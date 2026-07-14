<template>
  <div ref="containerRef" class="book-container"></div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue'
import * as THREE from 'three'
import { gsap } from 'gsap'

const props = withDefaults(defineProps<{
  images?: string[]
}>(), {
  images: () => []
})

const containerRef = ref<HTMLDivElement>()

let scene: THREE.Scene
let camera: THREE.PerspectiveCamera
let renderer: THREE.WebGLRenderer
let spiralGroup: THREE.Group
let hoveredMesh: THREE.Mesh | null = null
const raycaster = new THREE.Raycaster()
const mouse = new THREE.Vector2(-999, -999)
let autoRotation = 0

// GSAP 动画代理
const scrollProxy = { y: 0 }
const parentScrollProxy = { y: 0 }
const rotationScrollProxy = { y: 0 }
let targetScrollY = 0
let extraRotation = 0
const wobbleProxy = { x: 0, z: 0 }
let scrollYQuickTo: ReturnType<typeof gsap.quickTo>
let parentScrollQuickTo: ReturnType<typeof gsap.quickTo>
let rotationScrollQuickTo: ReturnType<typeof gsap.quickTo>
let wobbleXTo: ReturnType<typeof gsap.quickTo>
let wobbleZTo: ReturnType<typeof gsap.quickTo>
let ctx: gsap.Context | null = null
let hoverTweenIn: gsap.core.Tween | null = null
let hoverTweenOut: gsap.core.Tween | null = null
let initialized = false

const R_MAX = 5.5           // 螺旋顶部半径（最外圈）
const R_MIN = 3.5           // 螺旋底部半径（最内圈）
const TURN_SPACING = 2.7    // 每圈螺旋的垂直间距
const RIBBON_WIDTH = 1.5    // 每张图片在弧线上占据的宽度
const RIBBON_HEIGHT = 2.2   // 每张图片的高度
const IMAGE_GAP = 0.02      // 相邻图片之间的弧长间隔
const INITIAL_Y = -3        // 螺旋初始垂直位置（正值上移，负值下移）
const SUBDIVISIONS = 20     // 每张图片的曲线细分段数，越大越平滑
const HOVER_OFFSET = 0.15    // 鼠标悬停时图片向外弹出的距离
const WOBBLE_STRENGTH = 0.08 // 鼠标悬停时螺旋晃动幅度
const ROTATION_SPEED = 0.0009 // 自动旋转速度（弧度/秒，0.018 ≈ 每分钟约10°）
const PREVENT_SCROLL = false // 是否阻止滚轮事件冒泡（false 时父组件也会滚动）
const SCROLL_SPEED = 0.9    // 滚轮驱动螺旋上移的倍率（值越大上移越快）
const PARENT_SCROLL_SPEED = 0.005 // 父组件滚动驱动螺旋的倍率
const SCROLL_LIMIT = -5    // 螺旋向下移动的最低位置（负值，值越小允许下移越低）
const SCROLL_CEILING = 17   // 螺旋向上移动的最高位置（正值，0 为初始位置）
const TILT_ANGLE = 0        // 螺旋整体往后倾斜的角度（弧度）
const PLACEHOLDER_COLOR = '#dddcdc67' // 图片加载前的占位颜色

function initScene() {
  const container = containerRef.value!
  const width = container.clientWidth
  const height = container.clientHeight
  if (width === 0 || height === 0) throw new Error('Container has zero dimensions')

  scene = new THREE.Scene()
  scene.background = null
  scene.fog = new THREE.FogExp2(0x1a1a1a, 0)

  camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 100)
  camera.position.set(0, 0, 14)
  camera.lookAt(0, -4, 0)

  renderer = new THREE.WebGLRenderer({
    antialias: true,
    alpha: true,
    failIfMajorPerformanceCaveat: false,
    powerPreference: 'default',
  })
  renderer.setSize(width, height)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  container.appendChild(renderer.domElement)
}

function createSpiral() {
  spiralGroup = new THREE.Group()
  const loader = new THREE.TextureLoader()
  loader.setCrossOrigin('anonymous')

  // 灰色占位纹理
  const placeholderCanvas = document.createElement('canvas')
  placeholderCanvas.width = 1
  placeholderCanvas.height = 1
  const placeholderCtx = placeholderCanvas.getContext('2d')!
  placeholderCtx.fillStyle = PLACEHOLDER_COLOR
  placeholderCtx.fillRect(0, 0, 1, 1)
  const placeholderTexture = new THREE.CanvasTexture(placeholderCanvas)

  let angle = 0
  let accumulatedY = 0
  const imageCount = props.images.length

  for (let img = 0; img < imageCount; img++) {
    const positions: number[] = []
    const normals: number[] = []
    const uvs: number[] = []
    const indices: number[] = []

    // 根据当前半径算出该图片的垂直步进，保证每圈上升高度一致
    const imgT = img / imageCount
    const imgRadius = R_MAX - (R_MAX - R_MIN) * imgT
    const verticalStep = TURN_SPACING * RIBBON_WIDTH / (2 * Math.PI * imgRadius)

    for (let s = 0; s <= SUBDIVISIONS; s++) {
      const localT = s / SUBDIVISIONS
      const globalT = (img + localT) / imageCount
      const radius = R_MAX - (R_MAX - R_MIN) * globalT

      if (s > 0) {
        angle += RIBBON_WIDTH / SUBDIVISIONS / radius
      }

      const cx = radius * Math.cos(angle)
      const cz = radius * Math.sin(angle)
      const cy = INITIAL_Y - (accumulatedY + localT * verticalStep)

      const nx = Math.cos(angle)
      const nz = Math.sin(angle)

      positions.push(cx, cy + RIBBON_HEIGHT / 2, cz)
      normals.push(nx, 0, nz)
      uvs.push(localT, 1)

      positions.push(cx, cy - RIBBON_HEIGHT / 2, cz)
      normals.push(nx, 0, nz)
      uvs.push(localT, 0)

      if (s < SUBDIVISIONS) {
        const a = s * 2
        const b = s * 2 + 1
        const c = (s + 1) * 2
        const d = (s + 1) * 2 + 1
        indices.push(a, c, b)
        indices.push(b, c, d)
      }
    }

    accumulatedY += verticalStep

    // 图片间隔
    if (IMAGE_GAP > 0 && img < imageCount - 1) {
      const gapT = (img + 1) / imageCount
      const gapRadius = R_MAX - (R_MAX - R_MIN) * gapT
      angle += IMAGE_GAP / gapRadius
    }

    const geometry = new THREE.BufferGeometry()
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3))
    geometry.setAttribute('normal', new THREE.Float32BufferAttribute(normals, 3))
    geometry.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2))
    geometry.setIndex(indices)

    const material = new THREE.MeshStandardMaterial({
      map: placeholderTexture,
      side: THREE.DoubleSide,
      transparent: true,
      roughness: 0.4,
      metalness: 0.1,
    })

  const texture = loader.load(
    props.images[img], 
    () => { 
      material.map = texture 
      material.needsUpdate = true 
    },
    undefined,
    (_err) => {
      // console.error('纹理加载失败:', err)
    }
  )
  texture.colorSpace = THREE.SRGBColorSpace

    const mesh = new THREE.Mesh(geometry, material)
    // 记录径向朝外方向，用于 hover 时偏移
    mesh.userData.outX = Math.cos(angle)
    mesh.userData.outZ = Math.sin(angle)
    mesh.userData.curOut = 0
    spiralGroup.add(mesh)
  }

  scene.add(spiralGroup)
}

function onHoverChanged(newHovered: THREE.Mesh | null, oldHovered: THREE.Mesh | null) {
  if (oldHovered) {
    hoverTweenOut?.kill()
    hoverTweenOut = gsap.to(oldHovered.userData, {
      curOut: 0,
      duration: 0.5,
      ease: 'power2.out',
      onUpdate() {
        oldHovered.position.x = oldHovered.userData.curOut * oldHovered.userData.outX
        oldHovered.position.z = oldHovered.userData.curOut * oldHovered.userData.outZ
      },
    })
  }
  if (newHovered) {
    hoverTweenIn?.kill()
    hoverTweenIn = gsap.to(newHovered.userData, {
      curOut: HOVER_OFFSET,
      duration: 0.4,
      ease: 'power2.out',
      onUpdate() {
        newHovered.position.x = newHovered.userData.curOut * newHovered.userData.outX
        newHovered.position.z = newHovered.userData.curOut * newHovered.userData.outZ
      },
    })
  }
}

function onParentScroll(scrollTop: number) {
  parentScrollQuickTo(scrollTop * PARENT_SCROLL_SPEED)
}

function handleMouseMove(e: MouseEvent) {
  const container = containerRef.value
  if (!container) return
  const rect = container.getBoundingClientRect()
  mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1
  mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1
}

function handleWheel(e: WheelEvent) {
  if (PREVENT_SCROLL) e.preventDefault()
  const delta = e.deltaY * 0.008
  const nextY = targetScrollY + delta

  if (nextY < SCROLL_LIMIT) {
    extraRotation += (nextY - SCROLL_LIMIT) * SCROLL_SPEED
    targetScrollY = SCROLL_LIMIT
  } else if (nextY > SCROLL_CEILING) {
    extraRotation += (nextY - SCROLL_CEILING) * SCROLL_SPEED
    targetScrollY = SCROLL_CEILING
  } else {
    targetScrollY = nextY
  }

  scrollYQuickTo(targetScrollY)
  rotationScrollQuickTo(targetScrollY + extraRotation)
}

function updateHover() {
  raycaster.setFromCamera(mouse, camera)
  const meshes = spiralGroup.children as THREE.Mesh[]
  const intersects = raycaster.intersectObjects(meshes)

  const newHovered = (intersects.length > 0 ? intersects[0].object : null) as THREE.Mesh | null

  if (newHovered !== hoveredMesh) {
    const old = hoveredMesh
    hoveredMesh = newHovered
    onHoverChanged(newHovered, old)
  }
}

function addLights() {
  const ambient = new THREE.AmbientLight(0xffffff, 3)
  scene.add(ambient)

  const pointLight = new THREE.PointLight(0xffffff, 80, 30)
  pointLight.position.set(0, 10, 0)
  scene.add(pointLight)

  const pointLight2 = new THREE.PointLight(0x4488ff, 40, 25)
  pointLight2.position.set(-5, -3, 5)
  scene.add(pointLight2)
}

function onTick() {
  autoRotation += ROTATION_SPEED * gsap.ticker.deltaRatio()

  const totalScroll = scrollProxy.y + parentScrollProxy.y
  const totalRotation = rotationScrollProxy.y + parentScrollProxy.y
  spiralGroup.position.y = totalScroll * SCROLL_SPEED
  spiralGroup.rotation.y = autoRotation + totalRotation * SCROLL_SPEED

  const targetX = hoveredMesh ? -mouse.y * WOBBLE_STRENGTH : 0
  const targetZ = hoveredMesh ? -mouse.x * WOBBLE_STRENGTH : 0
  wobbleXTo(targetX)
  wobbleZTo(targetZ)
  spiralGroup.rotation.x = wobbleProxy.x + TILT_ANGLE
  spiralGroup.rotation.z = wobbleProxy.z

  updateHover()
  renderer.render(scene, camera)
}

function handleResize() {
  if (!containerRef.value) return
  const width = containerRef.value.clientWidth
  const height = containerRef.value.clientHeight
  camera.aspect = width / height
  camera.updateProjectionMatrix()
  renderer.setSize(width, height)
}

function cleanup() {
  window.removeEventListener('resize', handleResize)

  spiralGroup.traverse((child) => {
    if (child instanceof THREE.Mesh) {
      child.geometry.dispose()
      const mats = Array.isArray(child.material) ? child.material : [child.material]
      mats.forEach((mat) => {
        const m = mat as THREE.MeshStandardMaterial
        m.map?.dispose()
        m.dispose()
      })
    }
  })
  renderer.dispose()
  renderer.forceContextLoss()
  renderer.domElement = null as unknown as HTMLCanvasElement
  containerRef.value?.removeChild(renderer.domElement)
}

function start() {
  try {
    initScene()
  } catch (e) {
    console.warn('[3DSpiralGallery] WebGL init failed:', e)
    return
  }
  addLights()
  createSpiral()

  ctx = gsap.context(() => {
    scrollYQuickTo = gsap.quickTo(scrollProxy, 'y', { duration: 0.8, ease: 'power3' })
    parentScrollQuickTo = gsap.quickTo(parentScrollProxy, 'y', { duration: 0.8, ease: 'power3' })
    rotationScrollQuickTo = gsap.quickTo(rotationScrollProxy, 'y', { duration: 0.8, ease: 'power3' })
    wobbleXTo = gsap.quickTo(wobbleProxy, 'x', { duration: 0.8, ease: 'power2.out' })
    wobbleZTo = gsap.quickTo(wobbleProxy, 'z', { duration: 0.8, ease: 'power2.out' })
    gsap.ticker.add(onTick)
  })

  window.addEventListener('resize', handleResize)
  containerRef.value?.addEventListener('mousemove', handleMouseMove)
  containerRef.value?.addEventListener('wheel', handleWheel, { passive: !PREVENT_SCROLL })
}

let stopWatch: (() => void) | null = null

onMounted(() => {
  if (props.images.length) {
    initialized = true
    start()
  } else {
    stopWatch = watch(() => props.images.length, (len) => {
      if (len > 0) {
        stopWatch?.()
        stopWatch = null
        initialized = true
        start()
      }
    })
  }
})

defineExpose({ onParentScroll })

onUnmounted(() => {
  stopWatch?.()
  if (!initialized) return
  hoverTweenIn?.kill()
  hoverTweenOut?.kill()
  ctx?.revert()
  if (renderer) cleanup()
  containerRef.value?.removeEventListener('mousemove', handleMouseMove)
  containerRef.value?.removeEventListener('wheel', handleWheel)
})
</script>

<style scoped>
.book-container {
  width: 100%;
  height: 100%;
  background: #08080800;
}
</style>
