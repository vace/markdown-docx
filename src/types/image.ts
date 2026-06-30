import { Tokens } from 'marked'

export type MarkdownImageType = 'jpg' | 'png' | 'gif' | 'bmp'

export type MarkdownImageItem = {
  type: MarkdownImageType
  data: Buffer | string | Uint8Array | ArrayBuffer
  width: number
  height: number
}

export type MarkdownImageAdapter = (token: Tokens.Image) => Promise<null | MarkdownImageItem>
