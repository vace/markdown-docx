import { marked } from 'marked'

export function initMarkdown () {
  const markdownInput = document.getElementById('markdown-input')
  const markdownPreview = document.getElementById('markdown-preview')

  function setMarkdown (text) {
    markdownInput.value = text
    updatePreview()
  }
  function updatePreview () {
    const markdownContent = markdownInput.value
    markdownPreview.innerHTML = marked.parse(markdownContent)
  }

  function getMarkdown () {
    return markdownInput.value
  }

  return {
    setMarkdown,
    updatePreview,
    getMarkdown,
  }
}
