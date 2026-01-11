import { ref, watch } from 'vue'
import { marked } from 'marked'
import markedKatex from 'marked-katex-extension'
import { debounce } from '../utils/common'

// 配置 marked 支持 KaTeX
marked.use(markedKatex({
  throwOnError: false,
  output: 'html'
}))

export function useMarkdown() {
  const markdownContent = ref('')
  const htmlContent = ref('')

  // 使用防抖更新预览
  const updatePreview = debounce(() => {
    htmlContent.value = marked.parse(markdownContent.value)
  }, 300)

  // 监听 markdown 内容变化
  watch(markdownContent, () => {
    updatePreview()
  })

  const setMarkdown = (content) => {
    markdownContent.value = content
  }

  const clearMarkdown = () => {
    markdownContent.value = ''
  }

  return {
    markdownContent,
    htmlContent,
    setMarkdown,
    clearMarkdown
  }
}
