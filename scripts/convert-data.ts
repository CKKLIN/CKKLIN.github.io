import { vueList, uniappList, reactList, wxAppList } from '../src/assets/linshi/data/h5/mainjing'
import { bookList12, bookList3, bookList } from '../src/assets/linshi/data/data'
import { user } from '../src/assets/linshi/data/user'
import * as fs from 'fs'
import * as path from 'path'

const outDir = path.resolve('./public/data')
fs.mkdirSync(outDir, { recursive: true })

fs.writeFileSync(path.join(outDir, 'mainjing.json'), JSON.stringify({ vueList, uniappList, reactList, wxAppList }))
fs.writeFileSync(path.join(outDir, 'books.json'), JSON.stringify({ bookList12, bookList3, bookList }))
fs.writeFileSync(path.join(outDir, 'mockUsers.json'), JSON.stringify({ user }))

// Copy existing JSON files
for (const f of ['resources.json', 'comments.json', 'users.json']) {
  fs.copyFileSync(path.resolve('./src/assets/linshi/data', f), path.join(outDir, f))
}

console.log('Done! Converted data files to public/data/')
