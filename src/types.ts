export type Srcset = string

export type MarkupSpan = string

export type MarkupBlock = string

export type Image = {
  srcset: Srcset,
  aspectRatio: number,
  bleed?: { top: number, left: number, bottom: number, right: number }
  blurhash?: string,
  alt?: string,
}

export type Book = {
  cover: Image,
  title: MarkupSpan,
  subtitle?: MarkupSpan,
  author?: MarkupSpan,
  isbn?: string,
  brief: MarkupSpan,
  price: number,
  discount: number,
  size: { width: number, height: number, pages: number },
  tags: string[],
  blurb: MarkupBlock,
  gallery: Image[],
}