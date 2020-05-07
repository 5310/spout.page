export type Srcset = string

export type MarkupSpan = string

export type MarkupBlock = string

export type BlurHash = {
  width: number,
  height: number,
  hash: string,
}

export type Image = {
  srcset: Srcset,
  aspectRatio: number,
  // bleed?: { top: number, left: number, bottom: number, right: number }
  blurhash?: BlurHash,
  alt?: string,
}

export type Palette = {
  paper: string,
  ink: string,
  dark?: {
    paper: string,
    ink: string,
  }
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
  colors?: Palette,
}

export type Collection = {
  cover?: Srcset,
  title: MarkupSpan,
  blurb: MarkupBlock,
  books: Book[],
  colors?: Palette,
}