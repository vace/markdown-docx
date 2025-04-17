import { marked } from 'marked'
import { debounce } from './common'

export function initMarkdown () {
  const markdownInput = document.getElementById('markdown-input')
  const markdownPreview = document.getElementById('markdown-preview')

  const updatePreview = debounce(() => {
    const markdownContent = markdownInput.value
    markdownPreview.innerHTML = marked.parse(markdownContent)
  }, 300)

  function setMarkdown (text) {
    markdownInput.value = text
    updatePreview()
  }

  function getMarkdown () {
    return markdownInput.value
  }

  // add input event
  markdownInput.addEventListener('input', updatePreview)

  return {
    setMarkdown,
    updatePreview,
    getMarkdown,
  }
}
