import './style.css'
import { initTemplates } from './templates'
import { initMarkdown } from './markdown'
import { initTools } from './tools'
import { initLanguage } from './lang.js'

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  const app = document.getElementById('app')
  createApp(app)
})

// Create the main app
function createApp(container) {
  const service = {
    markdown: null,
    templates: null,
    tools: null,
    lang: initLanguage()
  }

  // Initialize the editor and preview
  service.markdown = initMarkdown(service)
  service.templates = initTemplates(service)
  service.tools = initTools(service)
}
