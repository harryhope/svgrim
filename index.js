const _ = require('lodash')
const fs = require('fs')
const app = require('commander')
const svgr = require('@svgr/core').default
const util = require('util')

const readdir = util.promisify(fs.readdir)
const readfile = util.promisify(fs.readFile)
const writefile = util.promisify(fs.writeFile)
const rename = filename => filename.replace('.svg', '.js')
const componentName = filename => _.upperFirst(_.camelCase(_.trim(filename.replace('.svg', ''))))
const esc = str =>
  str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

app
  .version('1.0.0')
  .option('-d, --dir [value]', 'A directory of svgs to convert', './')
  .option('-r, --replace <values>', 'Strings to replace', str => str.split(','))
  .option('-w, --with <values>', 'Values to replace --replace with', str => str.split(','))
  .option('--icon', 'use "1em" as width and height and add viewbox')
  .option('--ext <ext>', 'specify a custom file extension (default: "js")')
  .option('--no-dimensions', 'remove width and height from root SVG tag')
  .option('--native', 'add react-native support with react-native-svg')
  .option('--ref', 'add svgRef prop to svg')
  .option('--title-prop', 'create a title element linked with props')
  .parse(process.argv)

const main = async (settings) => {
  try {
    const files = await readdir(settings.dir)
    const svgs = files.filter(file => file.indexOf('.svg') > -1)
    const reads = svgs.map(svg => Promise.all([readfile(settings.dir + svg, 'utf8'), svg]))
    const resolvedFiles = await Promise.all(reads)
    const writes = resolvedFiles.map(([svg, name]) =>
      Promise.all([svgr(svg, app, {componentName: componentName(name)}), name]))
    const results = await Promise.all(writes)
    const transforms = settings.replace && settings.with ? results.map(([svg, name]) => {
      return [settings.replace.reduce((acc, replacee, index) => {
        const replacement = settings.with[index]
        return acc.replace(
          new RegExp(esc(replacee), 'g'),
          replacement
        )
      }, svg), name]
    }) : results
    const reactFiles = transforms.map(([svg, name]) =>
      writefile(rename(name), svg)
    )
    await Promise.all(writes)
    console.log(`Finished writing ${reactFiles.length} file(s).`)
  } catch (err) {
    console.error('\033[1mError:\033[0m ', err)
    process.exit(1)
  }
}

main(app)
