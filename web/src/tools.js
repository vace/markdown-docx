import markdownDocx, { Packer } from "markdown-docx"

export function initTools(service) {
  const clearButton = document.getElementById('clear-markdown')
  const downloadButton = document.getElementById('download')
  const uploadInput = document.getElementById('upload')
  const exportDocxButton = document.getElementById('export-docx')
  const cancelExportButton = document.getElementById('close-modal')
  const downloadSettingModal = document.getElementById('download-setting')

  // Clear button
  clearButton.addEventListener('click', () => {
    service.markdown.setMarkdown('')
    service.markdown.updatePreview()
  })

  // Download button - now opens the settings modal first
  downloadButton.addEventListener('click', () => {
    // Show the download settings modal
    if (downloadSettingModal) {
      downloadSettingModal.classList.remove('hidden')
    }
  })

  // Cancel export button - closes the modal
  if (cancelExportButton) {
    cancelExportButton.addEventListener('click', () => {
      if (downloadSettingModal) {
        downloadSettingModal.classList.add('hidden')
      }
    })
  }

  // Export DOCX button - performs the actual export
  if (exportDocxButton) {
    exportDocxButton.addEventListener('click', async () => {
      const markdownContent = service.markdown.getMarkdown()
      const getValueOf = (id) => document.getElementById(id)?.value || undefined
      const getChecked = (id) => document.getElementById(id)?.checked || false
      
      // Get export options from form
      const options = {
        name: getValueOf('doc-name'),
        document: {
          title: getValueOf('doc-title'),
          description: getValueOf('doc-description'),
        },
        ignoreImage: getChecked('ignore-image'),
        ignoreFootnote: getChecked('ignore-footnote'),
        ignoreHtml: getChecked('ignore-html'),
        codeHighlight: {
          enabled: true,
          theme: 'github-light',
          showLineNumbers: false,
          showLanguage: false,
        }
      }

      // Use options for export
      const buffer = await markdownDocx(markdownContent, options)
      const blob = await Packer.toBlob(buffer);
    
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = formatFilename(options.name)
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
  
      URL.revokeObjectURL(url)
      
      // Hide the modal after export
      if (downloadSettingModal) {
        downloadSettingModal.classList.add('hidden')
      }
    })
  }

  // Upload button
  uploadInput.addEventListener('change', (event) => {
    const file = event.target.files[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = function(e) {
      service.markdown.setMarkdown(e.target.result)
      service.markdown.updatePreview()
    }
    reader.readAsText(file)
    // Reset the file input so the same file can be uploaded again if needed
    event.target.value = ''
  })
}

function formatFilename (name) {
  const date = new Date()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')
  const seconds = String(date.getSeconds()).padStart(2, '0')
  const dateString = `${month}${day}${hours}${minutes}${seconds}`
  const filename = `${name || 'markdown-docx'}-${dateString}.docx`
  return filename
}
