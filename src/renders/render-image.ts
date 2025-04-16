import { Tokens } from "marked";
import { MarkdownDocx } from "../MarkdownDocx";
import { ITextAttr } from "../types";
import { ImageRun } from "docx";
import { renderText } from "./render-text";

export function renderImage(render: MarkdownDocx, block: Tokens.Image, attr: ITextAttr) {
  const image = render.findImage(block)

  if (!image || !image.type) {
    return renderText(render, `[!${block.text}](${block.href})`, attr)
  }

  return new ImageRun({
    type: image.type,
    data: image.data,
    transformation: {
      width: image.width,
      height: image.height,
    },
    altText: {
      title: block.title || block.text,
      description: block.text,
      name: block.text
    }
  })
}
