<template>
  <div class="flex flex-col h-screen max-w-full">
    <AppHeader
      @upload="handleUpload"
      @download="showExportModal = true"
      @select-template="handleSelectTemplate"
    />

    <!-- Bilingual notice -->
    <div class="text-center py-2 bg-green-50 text-sm">
      <p>
        <span class="text-green-600 font-medium">🔒 {{ t('local_processing') }}</span>
      </p>
    </div>

    <!-- Main content - split view -->
    <div class="flex flex-col md:flex-row flex-1 overflow-hidden">
      <MarkdownEditor
        v-model="markdownContent"
        @clear="clearMarkdown"
      />
      <MarkdownPreview :html-content="htmlContent" />
    </div>

    <ExportModal
      v-model="showExportModal"
      @export="handleExport"
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import AppHeader from './components/AppHeader.vue'
import MarkdownEditor from './components/MarkdownEditor.vue'
import MarkdownPreview from './components/MarkdownPreview.vue'
import ExportModal from './components/ExportModal.vue'
import { useMarkdown } from './composables/useMarkdown'
import { useTheme } from './composables/useTheme'
import { useI18n } from './composables/useI18n'
import markdownDocx, { Packer } from 'markdown-docx'
import initMarkdown from './assets/templates/template.md?raw'

const { markdownContent, htmlContent, setMarkdown, clearMarkdown } = useMarkdown()
const { getThemeConfig } = useTheme()
const { t } = useI18n()

const showExportModal = ref(false)

onMounted(() => {
  // 初始化默认内容
  setMarkdown(initMarkdown)
})

const handleUpload = (content) => {
  setMarkdown(content)
}

const handleSelectTemplate = (template) => {
  setMarkdown(template)
}

const handleExport = async (options) => {
  const selectedTheme = getThemeConfig(options.theme)

  const exportOptions = {
    name: options.name,
    document: {
      title: options.title,
      description: options.description,
    },
    ignoreImage: options.ignoreImage,
    ignoreFootnote: options.ignoreFootnote,
    ignoreHtml: options.ignoreHtml,
    theme: selectedTheme?.theme,
  }

  try {
    const buffer = await markdownDocx(markdownContent.value, exportOptions)
    const blob = await Packer.toBlob(buffer)

    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = formatFilename(exportOptions.name)
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)

    URL.revokeObjectURL(url)
  } catch (error) {
    console.error('Export failed:', error)
  }
}

const formatFilename = (name) => {
  const date = new Date()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')
  const seconds = String(date.getSeconds()).padStart(2, '0')
  const dateString = `${month}${day}${hours}${minutes}${seconds}`
  return `${name || 'markdown-docx'}-${dateString}.docx`
}
</script>
