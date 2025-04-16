import markdownDocx, { Packer } from "markdown-docx"

export function initTools(service) {
  const clearButton = document.getElementById('clear')
  const downloadButton = document.getElementById('download')
  const uploadInput = document.getElementById('upload')

  // Clear button
  clearButton.addEventListener('click', () => {
    service.markdown.setMarkdown('')
    service.markdown.updatePreview()
  })

  // Download button
  downloadButton.addEventListener('click', async () => {
    const markdownContent = service.markdown.getMarkdown()
    const buffer = await markdownDocx(markdownContent)
    const blob = await Packer.toBlob(buffer);
  
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = formatFilename()
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)

    URL.revokeObjectURL(url)
  })

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

function formatFilename () {
  const date = new Date()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')
  const seconds = String(date.getSeconds()).padStart(2, '0')
  const dateString = `${month}${day}${hours}${minutes}${seconds}`
  const filename = `markdown-docx-${dateString}.docx`
  return filename
}
