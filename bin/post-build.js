import * as fs from 'fs'
import pack from '../package.json'

let content = fs.readFileSync('index.js', 'utf8')
fs.writeFileSync('index.js', `// Version: ${pack.version}\n ${content}`)
