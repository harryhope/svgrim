# svgrim 🐅
SVGR Improved. Reactify svgs with additional options.

svgrim is a wrapper around [svgr](https://github.com/smooth-code/svgr) with additional features I use for compiling svg files into react js files. It currently features a more robust find/replace option, an option to create an index file with a list of ES6 icon exports, and defaults to converting a directory of svg icons while maintaining identical file naming conventions.

## Installation
To install globally, run
```
npm i -g @harryhope/svgrim
```

## Usage
```
  Usage: svgrim [options]

  SVGR Improved. Reactify svgs with additional options.

  Options:

    -V, --version           output the version number
    -d, --dir [value]       A directory of svgs to convert (default: ./)
    -r, --replace <values>  strings to replace
    -w, --with <values>     values to replace --replace with
    --icon                  use "1em" as width and height and add viewbox
    --ext <ext>             specify a custom file extension (default: "js")
    --no-dimensions         remove width and height from root SVG tag
    --native                add react-native support with react-native-svg
    --ref                   add svgRef prop to svg
    --title-prop            create a title element linked with props
    --create-index          create an index file with ES6 export syntax
    -h, --help              output usage information
```
