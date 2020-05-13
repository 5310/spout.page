/**
 * An string that idenfities every book or collection uniquely
 */
export type ID = string

/**
 * An index of IDs.
 *
 * This exists purely as schematic convenience.
 */
export type IDs = ID[]

/**
 * A file path implicitly relative from the article's root folder.
 */
export type Src = string

/**
 * A <img> compatible srcset string referencing one or more files absolutely from project root.
 */
export type Srcset = string

/**
 * Some Markdown content intended to render to a span rather than a block.
 */
export type MarkdownSpan = string

/**
 * Some Markdown content intended to render to a block.
 *
 * Use the YAML `>` token for multiline content.
 */
export type MarkdownBlock = string

/**
 * MarkdownSpan compiled to HTML.
 */
export type MarkupSpan = string

/**
 * MarkdownBlock compiled to HTML.
 */
export type MarkupBlock = string

/**
 * Blurhash definition data.
 */
export type BlurHash = {
  width: number,
  height: number,
  hash: string,
}

/**
 * Image definition data.
 */
export type Image = {
  srcset: Srcset,
  aspectRatio: number,
  // bleed?: { top: number, left: number, bottom: number, right: number }
  blurhash?: BlurHash,
  alt?: string,
}

/**
 * A CSS supported color value. A standard color name, or hex-code, etc.
 */
export type Color = string

/**
 * Custom palette that books or collections may define to override the site.
 */
export type Palette = {
  /**
   * Color of the paper for the default light theme.
   */
  paper: Color,
  /**
   * Color of the ink for the default light theme.
   */
  ink: Color,
  /**
   * Color of any tinting or shadowing effects for the default light theme.
   */
  tint: Color,
  /**
   * Overrides for the dark theme.
   */
  dark?: {
    /**
     * Color of the paper for the dark theme.
     */
    paper: Color,
    /**
     * Color of the ink for the dark theme.
     */
    ink: Color,
    /**
     * Color of any tinting or shadowing effects for the darktheme.
     */
    tint: Color,
  }
}

/**
 * A book defined in YAML for convenience.
 *
 * These YAML files are further processed to generate the JSON files served to the site.
 */
export type YAMLBook = {
  /**
   * The front cover of the book.
   */
  cover: string,
  /**
   * The title of the book.
   */
  title: MarkdownSpan,
  /**
   * The subtitle of the book, if any.
   */
  subtitle?: MarkdownSpan,
  /**
   * The author(s) of the book, if any.
   */
  author?: MarkdownSpan,
  /**
   * The ISBN of the book.
   */
  isbn?: string,
  /**
   * A brief description of the book that appears on every listing.
   */
  brief: MarkdownSpan,
  /**
   * The MRP of the book.
   */
  price: number,
  /**
   * Any discount on the price in percentage.
   */
  discount: number,
  /**
   * The physical dimensions of the book.
   */
  size: { width: number, height: number, pages: number },
  /**
   * Any descriptive tags for the book.
   */
  tags: string[],
  /**
   * The detailed description of the book that would get cut off for brief listings.
   */
  blurb: MarkdownBlock,
  /**
   * A list of images showcasing the book.
   */
  gallery: {
    src: Src,
    /**
     * The alt text for this image.
     */
    alt?: string
  }[],
  /**
   * Custom palette for the book, if any.
   *
   * Presently unused.
   */
  colors?: Palette,
}

/**
 * A collection defined in YAML for convenience.
 *
 * These YAML files are further processed to generate the JSON files served to the site.
 */
export type YAMLCollection = {
  /**
   * A backing art for the collection.
   *
   * Presently unused.
   */
  cover?: Src,
  /**
   * The title of the collection.
   */
  title: MarkdownSpan,
  /**
   * The description of the collection.
   *
   * Unlike the blurb under books, this is never omitted.
   */
  blurb: MarkdownBlock,
  /**
   * The list of all the books under this collection by ID.
   */
  books: ID[],
  /**
   * Custom palette for the book, if any.
   *
   * Presently unused.
   */
  colors?: Palette,
}

/**
 * Book definition data compiled from YAMLBook.
 */
export type Book = {
  id: ID,
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

/**
 * Collection definition data compiled from YAMLCollection.
 */
export type Collection = {
  id: ID,
  cover?: Srcset,
  title: MarkupSpan,
  blurb: MarkupBlock,
  books: ID[],
  colors?: Palette,
}