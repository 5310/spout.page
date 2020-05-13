const Metalsmith = require('metalsmith')
const debug = console.log
const multimatch = require('multimatch')
const path = require('path')
const { parseAsYaml } = require('parse-yaml')
const marked = require('marked')

const markdownSpanToMarkupSpan = markdown => !markdown ? undefined : marked(
  markdown,
  {
    gfm: true,
    smartypants: true,
  }
).slice(3, -5)

const markdownBlockToMarkupBlock = markdown => !markdown ? undefined : marked(
  markdown.replace('\n', '\n\n'),
  {
    gfm: true,
    smartypants: true,
  }
)

const shorthandToImage = dir => shorthand => ({
  srcset: `content/${dir}/${shorthand.src}`,
  aspectRatio: 1 / 1, // TODO:
  blurhash: '', // TODO:
  alt: markdownSpanToMarkupSpan(shorthand.alt),
})

const jsonStringify = object => JSON.stringify(object, null, 2)

const yamlToJson = (files, metalsmith, done) => {
  setImmediate(done)
  Object.keys(files).forEach(filename => {
    debug('checking file: %s', filename)
    if (multimatch(filename, ['books/*/*.yaml', 'collections/*/*.yaml']).length) {
      const data = files[filename]
      const yaml = data.contents.toString()
      let json = parseAsYaml(yaml)

      const dirname = path.dirname(filename)
      const id = path.basename(dirname)

      debug('processing file: %s', filename)
      if (multimatch(filename, ['books/*/*.yaml']).length) {
        json = {
          ...json,
          id,
          cover: shorthandToImage(dirname)({ src: json.cover, alt: 'The front cover' }),
          title: markdownSpanToMarkupSpan(json.title),
          subtitle: markdownSpanToMarkupSpan(json.subtitle),
          author: markdownSpanToMarkupSpan(json.author),
          brief: markdownSpanToMarkupSpan(json.brief),
          blurb: markdownBlockToMarkupBlock(json.blurb),
          gallery: json.gallery.map(shorthandToImage(dirname))
        }
      }
      if (multimatch(filename, ['collections/*/*.yaml']).length) {
        json = {
          ...json,
          id,
          cover: json.cover && `content/${dirname}/${json.cover}`,
          title: markdownSpanToMarkupSpan(json.title),
          blurb: markdownBlockToMarkupBlock(json.blurb),
        }
      }

      delete files[filename]
      data.contents = Buffer.from(jsonStringify(json))
      files[filename.replace(/.yaml$/, '.json')] = data
    }
  })
}

Metalsmith(__dirname)
  .source('../content')
  .destination('../dist/content')
  .clean(true)
  .use(yamlToJson)
  .build(err => {
    if (err) throw err
  })
