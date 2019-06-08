import { readFileSync, writeFileSync } from 'fs'
import pack from '../package.json'
import { config } from 'dotenv'
import { transform } from '@babel/core'

config()

let content = readFileSync('src/index.js', 'utf8')

content = helpersParsed(content)
content = algoliaParsed(content)
content = apiParsed(content)

content = transform(content, { presets: [['@babel/preset-env'], ['minify']] }).code

writeFileSync('index.js', `// Version: ${pack.version}\n ${content}`)

function parseSimple(content1, content2, where) {
  const imports = content2.match(/import (.*) from (.*)/g).join('\n')
  const apiVars = getExportVars(content2)
  return (
    imports +
    '\n' +
    content1.replace(
      new RegExp(`import .* from '\.\/${where}'`),
      functionify(content2.replace(/import (.*) from (.*)/g, ''), apiVars)
    )
  )
}

function apiParsed(content) {
  let api = readFileSync('src/api.js', 'utf8')
  return parseSimple(content, api, 'api')
}

function algoliaParsed(content) {
  let algolia = readFileSync('src/algolia.js', 'utf8')
  const parsed = parseSimple(content, algolia, 'algolia')
  return parsed
    .replace('process.env.MESALVA_ALGOLIA_ID', `'${process.env.MESALVA_ALGOLIA_ID}'`)
    .replace('process.env.MESALVA_ALGOLIA_KEY', `'${process.env.MESALVA_ALGOLIA_KEY}'`)
}

function helpersParsed(content) {
  const helpers = readFileSync('src/helpers.js', 'utf8')
  const helpersVars = getExportVars(helpers)
  return content.replace(/import .* from '\.\/helpers'/, functionify(helpers, helpersVars))
}

function functionify(content, vars) {
  return `const {${vars}} = (function(){` + content.replace(/export (const (\w+))/g, '$1') + `return {${vars}}})()`
}

function getExportVars(content) {
  return content
    .match(/export const (\w+)/g)
    .map(row => row.replace(/export const (\w+)/, '$1'))
    .join(',')
}
