import { IMarkdownTheme } from "../types";

export const defaultTheme: IMarkdownTheme = {
  /**
   * Theme Colors
   */
  tag: "ED7D31", // Orange
  border: "A5A5A5", // Gray
  heading1: "2F5597", // Dark Blue
  heading2: "5B9BD5", // Medium Blue
  heading3: "44546A", // Dark Gray
  heading4: "44546A", // Gray
  heading5: "44546A", // Gray
  heading6: "44546A", // Gray
  link: "0563C1", // Bright Blue
  code: "032F62", // shiki light
  codespan: "70AD47", // shiki light
  codeBackground: "f6f6f7", // Light Gray
  blockquote: "666666", // Medium Gray
  blockquoteBackground: "F9F9F9", // Very Light Gray
  del: "FF0000", // Red
  hr: "D9D9D9", // Light Gray
  html: "4472C4",
  tableHeaderBackground: "F2F2F2", // Very Light Gray

  /**
   * Theme Patterns
   */
  heading1Size: 36,
  heading2Size: 32,
  heading3Size: 28,
  heading4Size: 26,
  heading5Size: 24,
  heading6Size: 24,
  spaceSize: 12,
  codeSize: 22,
  linkUnderline: true,
}
