import { ref, computed } from 'vue'

const translations = {
  upload: {
    zh: '上传',
    en: 'Upload',
  },
  download: {
    zh: '下载 Docx',
    en: 'Download Docx',
  },
  github: {
    zh: 'GitHub',
    en: 'GitHub',
  },
  modal_options: {
    zh: '导出选项',
    en: 'Export Options',
  },
  local_processing: {
    zh: '内容不会上传,仅在本地处理。',
    en: 'Nothing is uploaded, all processing happens locally.'
  },
  markdown_placeholder: {
    zh: '在此输入 Markdown 内容...',
    en: 'Enter your Markdown here...'
  },
  filename: {
    zh: '文件名',
    en: 'Filename'
  },
  title: {
    zh: '标题',
    en: 'Title'
  },
  description: {
    zh: '描述',
    en: 'Description'
  },
  document_name: {
    zh: '文档名称',
    en: 'Document Name'
  },
  document_title: {
    zh: '文档标题',
    en: 'Document Title'
  },
  document_description: {
    zh: '文档描述',
    en: 'Document Description'
  },
  ignore_images: {
    zh: '忽略图片',
    en: 'Ignore Images'
  },
  ignore_footnotes: {
    zh: '忽略脚注',
    en: 'Ignore Footnotes'
  },
  ignore_html: {
    zh: '忽略 HTML',
    en: 'Ignore HTML'
  },
  export_to_docx: {
    zh: '导出到 DOCX',
    en: 'Export to DOCX'
  },
  theme: {
    zh: '主题',
    en: 'Theme'
  },
  theme_default: {
    zh: '默认',
    en: 'Default'
  },
  theme_elegant: {
    zh: '优雅',
    en: 'Elegant'
  },
  theme_academic: {
    zh: '学术',
    en: 'Academic'
  },
  theme_modern: {
    zh: '现代',
    en: 'Modern'
  }
}

// 全局状态
const currentLocale = ref(
  localStorage.getItem('preferred_language') ||
  (navigator.language.startsWith('zh') ? 'zh' : 'en')
)

export function useI18n() {
  const locale = computed(() => currentLocale.value)

  const t = (key) => {
    return translations[key]?.[locale.value] || key
  }

  const setLocale = (newLocale) => {
    currentLocale.value = newLocale
    localStorage.setItem('preferred_language', newLocale)
    document.documentElement.lang = newLocale === 'zh' ? 'zh-CN' : 'en'
  }

  const toggleLocale = () => {
    const newLocale = locale.value === 'zh' ? 'en' : 'zh'
    setLocale(newLocale)
  }

  return {
    locale,
    t,
    setLocale,
    toggleLocale
  }
}
