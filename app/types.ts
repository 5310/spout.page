export type Srcset = string

export type MdSpan = string

export type MdBlock = string

export type Image = {
  srcset: Srcset,
  aspectratio: number,
  blurhash?: string,
  bleed?: { top: number, left: number, bottom: number, right: number }
}

export type Book = {
  cover: Image,
  title: MdSpan,
  subtitle?: MdSpan,
  author?: MdSpan,
  isbn?: string,
  brief: MdSpan,
  price: number,
  discount: number,
  size: { width: number, height: number, pages: number },
  tags: string[],
  blurb: MdBlock,
  gallery: Image[],
}