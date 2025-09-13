export const lang = {
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
    zh: '内容不会上传，仅在本地处理。',
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
  }
}


// Initialize language system
export function initLanguage(service) {
  // Get preferred language from localStorage or use browser language
  const savedLanguage = localStorage.getItem('preferred_language')
  const browserLanguage = navigator.language.startsWith('zh') ? 'zh' : 'en'
  const currentLanguage = savedLanguage || browserLanguage
  const langToggle = document.getElementById('lang-toggle')

  langToggle.addEventListener('click', () => {
    const newLang = langToggle.textContent === 'EN' ? 'en' : 'zh'
    langToggle.textContent = newLang === 'zh' ? 'EN' : '中'
    setLanguage(newLang)
  })
  // Set initial language
  setLanguage(currentLanguage)
  return currentLanguage
}

/**
 * Updates all language elements in the document based on the current language
 * @param {string} language - 'zh' or 'en'
 */
export function updateDocumentLangs(language = 'zh') {
  // Update all elements with .lang class
  document.querySelectorAll('.lang').forEach(el => {
    const key = el.getAttribute('data-lang');
    if (key && lang[key] && lang[key][language]) {
      el.textContent = lang[key][language];
    }
  });
  
  // Update placeholders for inputs and textareas
  document.querySelectorAll('[data-placeholder-lang]').forEach(el => {
    const key = el.getAttribute('data-placeholder-lang');
    if (key && lang[key] && lang[key][language]) {
      el.placeholder = lang[key][language];
    }
  });
  
  // Update titles/tooltips with data-title-lang if needed
  document.querySelectorAll('[data-title-lang]').forEach(el => {
    const key = el.getAttribute('data-title-lang');
    if (key && lang[key] && lang[key][language]) {
      el.title = lang[key][language];
    }
  });
}

/**
 * Set the current language and update all elements
 * @param {string} language - 'zh' or 'en'
 */
export function setLanguage(language = 'zh') {
  // Store the language preference
  localStorage.setItem('preferred_language', language);
  // Update document language attribute
  document.documentElement.lang = language === 'zh' ? 'zh-CN' : 'en';
  // Update all language elements
  updateDocumentLangs(language);
}