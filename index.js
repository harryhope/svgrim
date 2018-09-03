const fs = require('fs')
const app = require('commander')
const svgr = require('@svgr/core').default
const util = require('util')

const readdir = util.promisify(fs.readdir)
const readfile = util.promisify(fs.readFile)
const rename = filename => filename.replace('.svg', '.js')
console.log(svgr)
app
  .version('1.0.0')
  .option('-d, --dir [value]', 'A directory of svgs to convert', './')
  .parse(process.argv)

const main = async (settings) => {
  try {
    const files = await readdir(settings.dir)
    const svgs = files.filter(file => file.indexOf('.svg') > -1)
    console.log(svgs)
    const reads = svgs.map(svg => readfile(settings.dir + svg, 'utf8'))
    const resolvedFiles = await Promise.all(reads)
    const writes = resolvedFiles.map(svg => svgr(svg))
    const results = await Promise.all(writes)
    console.log(results)
  } catch (err) {
    console.error('\033[1mError:\033[0m ', err)
    process.exit(1)
  }

}

main(app)
