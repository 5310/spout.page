export type Srcset = string

export type Span = string

export type Block = string

export type Image = {
  srcset: Srcset,
  aspectratio: number,
  blurhash?: string,
  bleed?: { top: number, left: number, bottom: number, right: number }
}

export type Book = {
  cover: Image,
  title: Span,
  subtitle?: Span,
  author?: Span,
  isbn?: string,
  brief: Span,
  price: number,
  discount: number,
  size: { width: number, height: number, pages: number },
  tags: string[],
  blurb: Block,
  gallery: Image[],
}