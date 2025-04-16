import clsx from "clsx"
import initMarkdown from './template.md?raw'

export function initTemplates(service) {

  function renderTemplates () {
    const templateNode = document.getElementById('template-list')

    // clear existing buttons
    templateNode.innerHTML = ''

    for (const template of templatesList) {
      const button = document.createElement('button')
      button.textContent = template.name
      button.className = clsx('template-btn px-2 py-1 text-sm rounded cursor-pointer hover:bg-indigo-100')
      button.addEventListener('click', () => {
        service.markdown.setMarkdown(template.template)
      })
      templateNode.appendChild(button)
    }
  }

  service.markdown.setMarkdown(initialMarkdown)
  renderTemplates()

  return {
    initialMarkdown,
    renderTemplates,
  }
}

// Initialize state with default content
export const initialMarkdown = initMarkdown

export const templatesList = [
  {
    id: 0,
    name: 'Default',
    template: initMarkdown,
  },
  {
    id: 1,
    name: 'Template 1',
    template: `# Template 1: Introduction

This is a simple template showing basic Markdown features.

## Headers

You can create headers using # symbols.

## Lists

- Item 1
- Item 2
  - Nested item
- Item 3

## Formatting

You can use **bold**, *italic*, or ~~strikethrough~~ text.
`,
  },

  {
    id: 2,
    name: 'Template 2',
    template: `# Template 2: Meeting Notes

## Meeting Information
- **Date**: April 16, 2025
- **Time**: 10:00 AM - 11:30 AM
- **Location**: Conference Room A
- **Attendees**: John Doe, Jane Smith, Bob Johnson

## Agenda
1. Review previous action items
2. Discuss current project status
3. Plan next steps
4. Any other business

## Discussion Points
- Project Alpha is on schedule
- Team Beta needs additional resources
- New deadlines for Project Gamma

## Action Items
- [ ] John to prepare the quarterly report
- [ ] Jane to coordinate with the design team
- [ ] Bob to update the project timeline
`
  },
  {
    id: 3,
    name: 'Template 3',
    template: `# Template 3: Project Documentation

## Overview
This document provides comprehensive documentation for the Project X.

## Features
- Real-time data processing
- Multi-platform support
- Automatic backups
- User authentication

## Technical Specifications

| Component | Technology | Version |
|-----------|------------|---------|
| Frontend  | React      | 18.2.0  |
| Backend   | Node.js    | 18.15.0 |
| Database  | MongoDB    | 6.0     |

## Installation

\`\`\`bash
git clone https://github.com/example/project-x.git
cd project-x
npm install
npm start
\`\`\`

## Notes
> This is a work in progress. Features may change before final release.
`
  }
]
