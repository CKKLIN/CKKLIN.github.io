/**
 * 向 Supabase electron_questions 表写入 Electron 面试题数据
 * 前置条件：先在 Supabase Dashboard SQL Editor 里建表：
 *
 *   CREATE TABLE electron_questions (
 *     id BIGINT PRIMARY KEY,
 *     title TEXT NOT NULL,
 *     content TEXT NOT NULL,
 *     create_time BIGINT NOT NULL
 *   );
 *
 * 使用: node scripts/seed-electron.mjs
 */
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  'https://oawiptpyeraxngweqrhl.supabase.co',
  'sb_publishable_hNOTdGLGC8BjkncgMswEYA_vE42I3Dg'
)

const questions = [
  {
    id: 1,
    title: 'Electron 的主进程与渲染进程是如何分工的？',
    content: `<p><strong>核心分工：</strong></p><ul><li><strong>主进程（Main Process）：</strong> 负责管理窗口生命周期、系统原生交互（菜单、托盘、对话框）、IPC 通信调度、以及应用退出等。一个 Electron 应用只有一个主进程，运行在 Node.js 环境中。</li><li><strong>渲染进程（Renderer Process）：</strong> 负责页面渲染和 UI 交互，每个 BrowserWindow 对应一个独立的渲染进程，运行在 Chromium 环境中，可以使用 DOM API 和部分 Node.js API（通过 contextBridge）。</li></ul><p><strong>IPC 通信：</strong></p><p>主进程与渲染进程通过 <code>ipcMain</code> / <code>ipcRenderer</code> 进行进程间通信：</p><pre><code class="language-javascript">// preload.js — 暴露安全 API\nconst { contextBridge, ipcRenderer } = require('electron')\ncontextBridge.exposeInMainWorld('electronAPI', {\n  getAppVersion: () => ipcRenderer.invoke('get-version')\n})\n\n// main.js — 主进程处理\nipcMain.handle('get-version', () => app.getVersion())\n\n// renderer.js — 渲染进程调用\nconst version = await window.electronAPI.getAppVersion()</code></pre><p> <strong>口语化回答：</strong></p><p>可以把 Electron 想象成一个浏览器外加一个后台 Node 服务。主进程就是那个后台服务，管窗口的创建销毁、系统菜单、对话框这些底层的活儿，一个应用就只有一个主进程。渲染进程就是浏览器里的每一个标签页，负责页面渲染和交互，每个窗口都是独立进程，互不影响。两者之间通过 IPC 通信，而且出于安全考虑，渲染进程不能直接访问 Node.js API，需要通过 preload 脚本用 contextBridge 暴露一个精简的 API 出来。</p>`,
    create_time: 1749375600000,
  },
  {
    id: 2,
    title: 'Electron 中 contextBridge 的作用是什么？为什么不能直接启用 nodeIntegration？',
    content: `<p><strong>contextBridge 的作用：</strong></p><p><code>contextBridge</code> 是 Electron 提供的一个安全桥接模块，用于在 preload 脚本中<strong>有选择地</strong>向渲染进程暴露能力，同时保持渲染进程与 Node.js 环境的隔离。</p><p><strong>为什么不建议直接启用 nodeIntegration：</strong></p><ul><li><strong>安全风险：</strong> 启用 <code>nodeIntegration: true</code> 相当于把 Node.js 的所有 API 暴露给渲染进程，一旦页面被 XSS 攻击，攻击者可以直接执行 <code>require('child_process')</code> 调用系统命令。</li><li><strong>沙箱失效：</strong> 破坏了 Chrome 的沙箱隔离机制，让渲染进程拥有了原生能力。</li></ul><p><strong>推荐做法：</strong></p><pre><code class="language-javascript">// main.js\nconst win = new BrowserWindow({\n  webPreferences: {\n    nodeIntegration: false,  // 关闭\n    contextIsolation: true,  // 开启隔离\n    preload: path.join(__dirname, 'preload.js')\n  }\n})\n\n// preload.js\nconst { contextBridge, ipcRenderer } = require('electron')\ncontextBridge.exposeInMainWorld('api', {\n  openFile: () => ipcRenderer.invoke('dialog:openFile')\n})</code></pre><p> <strong>口语化回答：</strong></p><p>contextBridge 就像是一个安检通道，它只允许你指定的东西从 Node.js 环境传到渲染进程，而不是把整个 Node.js 工具箱都扔进去。早期有人图方便直接开启 nodeIntegration，等于给渲染进程开了个后门 —— 要是页面不小心被 XSS 了，攻击者直接就能在浏览器里跑 <code>require('fs')</code> 读写你硬盘文件，非常危险。所以现在标准的做法是关闭 nodeIntegration，通过 preload 脚本配合 contextBridge 只暴露最小必要的能力。</p>`,
    create_time: 1749375600000,
  },
  {
    id: 3,
    title: 'Electron 的 BrowserWindow 有哪些常用的配置项？',
    content: `<p><strong>常用配置项：</strong></p><ul><li><code>width / height</code>：窗口初始宽度和高度（像素）。</li><li><code>minWidth / minHeight</code>：窗口最小尺寸，防止用户拖太小。</li><li><code>resizable</code>：是否允许用户调整窗口大小。</li><li><code>frame</code>：是否显示系统窗口边框，设为 false 可自定义标题栏。</li><li><code>transparent</code>：是否支持透明背景（需配合 frameless 窗口）。</li><li><code>alwaysOnTop</code>：窗口是否始终置顶。</li><li><code>webPreferences</code>：网页功能配置，如 <code>nodeIntegration</code>、<code>contextIsolation</code>、<code>preload</code>。</li></ul><pre><code class="language-javascript">const win = new BrowserWindow({\n  width: 1024,\n  height: 768,\n  minWidth: 800,\n  minHeight: 600,\n  frame: false,          // 无边框窗口\n  transparent: true,     // 透明背景\n  resizable: true,\n  webPreferences: {\n    nodeIntegration: false,\n    contextIsolation: true,\n    preload: path.join(__dirname, 'preload.js')\n  }\n})</code></pre><p> <strong>口语化回答：</strong></p><p>做 Electron 开发，BrowserWindow 的配置项是每天都要打交道的。最常用的是 width/height 设置窗口大小，以及 webPreferences 里配置安全相关选项。如果你要做自定义标题栏（类似 VS Code 那种），就把 frame 设为 false 自己画；要是做悬浮助手类工具，就设 alwaysOnTop。透明窗口挺酷的，但要记得配合 frameless 和无背景色的 HTML 页面才能生效。</p>`,
    create_time: 1749375600000,
  },
  {
    id: 4,
    title: 'Electron 应用如何实现自动更新？',
    content: `<p><strong>常用方案：</strong></p><p>Electron 官方推荐使用 <code>electron-updater</code>（基于 electron-builder）实现自动更新。</p><p><strong>基本流程：</strong></p><ul><li>在 electron-builder 配置中开启 publish 选项，指向更新服务器（如 GitHub Releases、私有 OSS）。</li><li>主进程使用 <code>autoUpdater</code> 检查更新、下载、安装。</li><li>渲染进程监听更新进度事件，展示给用户。</li></ul><pre><code class="language-javascript">// main.js\nconst { autoUpdater } = require('electron-updater')\n\nautoUpdater.on('checking-for-update', () => {\n  win.webContents.send('update:checking')\n})\nautoUpdater.on('update-available', (info) => {\n  win.webContents.send('update:available', info)\n})\nautoUpdater.on('download-progress', (progress) => {\n  win.webContents.send('update:progress', progress.percent)\n})\nautoUpdater.on('update-downloaded', () => {\n  autoUpdater.quitAndInstall()\n})\n\nautoUpdater.checkForUpdates()</code></pre><p> <strong>口语化回答：</strong></p><p>Electron 自动更新最成熟的方案就是 electron-updater + electron-builder。说白了就是三步：打包时配置好更新服务器地址，启动时检查有没有新版本，有的话后台下载完提示用户重启安装。它支持增量更新，只下载差异部分，不会每次重新下载整个安装包。对于个人项目，我一般搭配 GitHub Releases 做更新源，免费又简单。</p>`,
    create_time: 1749375600000,
  },
  {
    id: 5,
    title: 'Electron 中如何实现系统托盘（Tray）功能？',
    content: `<p><strong>实现步骤：</strong></p><ul><li>引入 <code>Tray</code> 和 <code>Menu</code> 模块。</li><li>创建 Tray 实例并传入图标路径。</li><li>设置托盘图标的上下文菜单。</li><li>处理托盘图标的点击事件（如点击显示窗口）。</li></ul><pre><code class="language-javascript">const { Tray, Menu, app } = require('electron')\nlet tray = null\n\napp.whenReady().then(() => {\n  tray = new Tray('icon.png')\n  const contextMenu = Menu.buildFromTemplate([\n    { label: '显示窗口', click: () => mainWin.show() },\n    { label: '退出', click: () => app.quit() }\n  ])\n  tray.setToolTip('我的应用')\n  tray.setContextMenu(contextMenu)\n  tray.on('click', () => mainWin.show())\n})</code></pre><p> <strong>口语化回答：</strong></p><p>系统托盘是桌面应用的标配功能，比如微信、钉钉最小化到托盘那种效果。实现起来不复杂：先创建一个 Tray 实例并指定图标，然后给它绑定一个右键菜单，里面放「显示窗口」「退出」这些选项。坑点在于托盘图标在不同系统上要求的尺寸不一样 —— macOS 通常是 16x16 或 22x22 的模板图，Windows 用 32x32 或 48x48 的彩色图标，否则图标会糊。</p>`,
    create_time: 1749375600000,
  },
  {
    id: 6,
    title: 'Electron 应用如何打包和分发？',
    content: `<p><strong>常用打包工具：</strong></p><ul><li><strong>electron-builder：</strong> 社区最流行，支持 Windows（NSIS/Portable）、macOS（DMG/ZIP）、Linux（AppImage/deb）多平台打包。</li><li><strong>electron-forge：</strong> Electron 官方维护的打包工具，集成度更高。</li></ul><p><strong>electron-builder 配置示例（package.json）：</strong></p><pre><code class="language-json">{\n  "build": {\n    "appId": "com.example.app",\n    "productName": "MyApp",\n    "directories": {\n      "output": "dist_electron"\n    },\n    "win": {\n      "target": ["nsis"],\n      "icon": "build/icon.ico"\n    },\n    "mac": {\n      "target": ["dmg"],\n      "icon": "build/icon.icns"\n    },\n    "nsis": {\n      "oneClick": false,\n      "allowToChangeInstallationDirectory": true\n    }\n  }\n}</code></pre><p> <strong>口语化回答：</strong></p><p>Electron 打包我一般用 electron-builder，配置简单，生态也成熟。核心就是配好 appId、打包目标平台和安装包类型。Windows 用 NSIS 做安装包，macOS 用 DMG。有几个注意点：图标要提供不同平台对应的格式、代码签名在 macOS 上几乎是强制的否则 Gatekeeper 会拦截、打包出来的体积通常 100MB+ 因为自带了 Chromium。如果程序里有原生模块（如 node-canvas），还要注意和 Electron 版本的兼容性。</p>`,
    create_time: 1749375600000,
  },
]

async function run() {
  let ok = 0
  for (const q of questions) {
    const { error } = await supabase.from('electron_questions').upsert(q)
    if (error) {
      console.log(`  ❌ id=${q.id}: ${error.message}`)
      if (error.message.includes('relation') && error.message.includes('does not exist')) {
        console.log('\n⚠️  表不存在，请先在 Supabase Dashboard SQL Editor 里建表：')
        console.log(`
CREATE TABLE electron_questions (
  id BIGINT PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  create_time BIGINT NOT NULL
);`)
        break
      }
    } else {
      ok++
    }
  }
  console.log(`\n🎉 完成！${ok}/${questions.length} 条写入成功`)
}

run().catch(err => { console.error('❌', err); process.exit(1) })
