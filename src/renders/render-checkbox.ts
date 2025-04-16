import { CheckBox } from "docx";
import { MarkdownDocx } from "../MarkdownDocx";

export function renderCheckbox(render: MarkdownDocx, checked?: boolean): CheckBox {
  return new CheckBox({
    checked: !!checked,
    checkedState: { value: "2611", font: "MS Gothic" },
    uncheckedState: { value: "2610", font: "MS Gothic" },
  })
}

