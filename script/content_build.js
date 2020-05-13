const Metalsmith = require('metalsmith')
const multimatch = require('multimatch')
const sharp = require('sharp')
const path = require('path')
const { parseAsYaml } = require('parse-yaml')
const { encode } = require('blurhash')
const marked = require('marked')

const BLURHASHSCALE = 9

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

const jsonStringify = object => JSON.stringify(object, null, 2)

const processImage = async (files, metalsmith, done) => {
  for (const filename in files) {
    if (multimatch(filename, ['**/*.+(jpeg|jpg|png)']).length) {
      const data = files[filename]
      const image = sharp(data.contents)

      const { width, height } = await image.metadata()
      data.width = width
      data.height = height
      data.aspectRatio = width / height

      const angle = Math.atan(data.aspectRatio)
      data.blurhash = {
        width: Math.floor(BLURHASHSCALE * Math.sin(angle)),
        height: Math.floor(BLURHASHSCALE * Math.cos(angle)),
      }
      data.blurhash.hash = encode(
        new Uint8ClampedArray(
          await image
            .raw()
            .ensureAlpha()
            .toBuffer()
        ),
        width,
        height,
        data.blurhash.width,
        data.blurhash.height,
      )
    }
  }
  done()
}

const yamlToJson = async (files, metalsmith, done) => {
  const image = dir => shorthand => {
    const filename = `${dir}/${shorthand.src}`
    const { aspectRatio, blurhash } = files[filename]
    return {
      srcset: `content/${filename}`,
      aspectRatio,
      blurhash,
      alt: markdownSpanToMarkupSpan(shorthand.alt),
    }
  }

  for (const filename in files) {
    if (multimatch(filename, ['books/*/*.yaml', 'collections/*/*.yaml']).length) {
      const data = files[filename]
      const yaml = data.contents.toString()
      let json = parseAsYaml(yaml)

      const dirname = path.dirname(filename)
      const id = path.basename(dirname)

      if (multimatch(filename, ['books/*/*.yaml']).length) {
        json = {
          ...json,
          id,
          cover: image(dirname)({ src: json.cover, alt: 'The front cover' }),
          title: markdownSpanToMarkupSpan(json.title),
          subtitle: markdownSpanToMarkupSpan(json.subtitle),
          author: markdownSpanToMarkupSpan(json.author),
          brief: markdownSpanToMarkupSpan(json.brief),
          blurb: markdownBlockToMarkupBlock(json.blurb),
          gallery: json.gallery.map(image(dirname))
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
  }

  done()
}

Metalsmith(__dirname)
  .source('../content')
  .destination('../dist/content')
  .clean(true)
  .use(processImage)
  .use(yamlToJson)
  .build(err => {
    if (err) throw err
  })
