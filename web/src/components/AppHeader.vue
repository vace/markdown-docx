<template>
  <header class="flex justify-between items-center p-4 bg-white shadow w-full z-10 mb-1">
    <div class="flex items-center space-x-4">
      <a class="flex items-center" target="_blank" href="https://github.com/vace/markdown-docx">
        <img src="/icon.svg" alt="MarkdownDocx Logo" class="h-8 w-8 mr-4" />
        <div class="text-xl font-bold text-indigo-600">MarkdownDocx</div>
      </a>
      <div class="hidden sm:flex space-x-2">
        <button
          v-for="template in templates"
          :key="template.id"
          class="template-btn px-2 py-1 text-sm rounded cursor-pointer hover:bg-indigo-100"
          @click="$emit('select-template', template.template)"
        >
          {{ template.name }}
        </button>
      </div>
    </div>

    <div class="flex items-center space-x-4">
      <!-- Theme Selector -->
      <div class="relative" ref="themeDropdownRef">
        <button
          @click="showThemeDropdown = !showThemeDropdown"
          class="px-3 py-1 text-sm rounded bg-gray-200 hover:bg-gray-100 cursor-pointer flex items-center"
        >
          <svg class="h-3.5 w-3.5 mr-1" width="24" height="24" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M24 40.9444C26.123 42.8446 28.9266 44 32 44C38.6274 44 44 38.6274 44 32C44 26.4085 40.1757 21.7102 35 20.3781"
              stroke="#000000" stroke-width="4" stroke-linejoin="round" />
            <path
              d="M13 20.3781C7.82432 21.7102 4 26.4085 4 32C4 38.6274 9.37258 44 16 44C22.6274 44 28 38.6274 28 32C28 30.4506 27.7063 28.9697 27.1716 27.6101"
              stroke="#000000" stroke-width="4" stroke-linejoin="round" />
            <path
              d="M24 28C30.6274 28 36 22.6274 36 16C36 9.37258 30.6274 4 24 4C17.3726 4 12 9.37258 12 16C12 22.6274 17.3726 28 24 28Z"
              fill="none" stroke="#000000" stroke-width="4" stroke-linejoin="round" />
          </svg>
          <span>{{ t('theme') }}</span>
        </button>
        <div
          v-show="showThemeDropdown"
          class="absolute right-0 mt-1 w-40 bg-white border border-gray-300 rounded-md shadow-lg z-20"
        >
          <div class="py-1">
            <button
              v-for="themeName in getAllThemes()"
              :key="themeName"
              class="theme-option block w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 text-left"
              :data-theme="themeName"
              @click="handleThemeSelect(themeName)"
            >
              {{ t(`theme_${themeName}`) }}
            </button>
          </div>
        </div>
      </div>

      <button
        @click="toggleLocale"
        class="px-3 py-1 text-sm rounded bg-gray-200 hover:bg-gray-100 cursor-pointer"
      >
        {{ locale === 'zh' ? '中' : 'EN' }}
      </button>

      <label
        for="upload"
        class="px-3 py-1 rounded bg-gray-200 hover:bg-gray-100 cursor-pointer flex items-center"
        title="Upload Markdown file"
      >
        <svg class="h-5 w-5 mr-2" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
          <mask maskUnits="userSpaceOnUse" x="0" y="0" width="48" height="48" style="mask-type: alpha">
            <path d="M48 0H0V48H48V0Z" fill="currentColor" />
          </mask>
          <g mask="url(#icon-13c37f497f10b972)">
            <path d="M6 24.0083V42H42V24" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" />
            <path d="M33 15L24 6L15 15" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" />
            <path d="M23.9917 32V6" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" />
          </g>
        </svg>
        <span>{{ t('upload') }}</span>
        <input id="upload" type="file" accept=".md, .markdown, .txt" class="hidden" @change="handleFileUpload" />
      </label>

      <button
        @click="$emit('download')"
        class="px-3 py-1 bg-indigo-600 text-white rounded hover:bg-indigo-700 flex items-center"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 16l4-5h-3v-6h-2v6h-3l4 5zm-8 2v2h16v-2h-16z" />
        </svg>
        <span>{{ t('download') }}</span>
      </button>

      <a
        href="https://github.com/vace/markdown-docx"
        target="_blank"
        class="text-gray-700 hover:text-gray-700 flex items-center bg-gray-200 hover:bg-gray-100 rounded px-3 py-1"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
          <path
            d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"
          />
        </svg>
        <span class="hidden sm:inline-block ml-2 font-semibold">GitHub</span>
      </a>
    </div>
  </header>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useI18n } from '../composables/useI18n'
import { useTheme } from '../composables/useTheme'
import initMarkdown from '../assets/templates/template.md?raw'
import initZhMarkdown from '../assets/templates/zh-template.md?raw'

const emit = defineEmits(['upload', 'download', 'select-template'])

const { t, locale, toggleLocale } = useI18n()
const { setTheme, getAllThemes } = useTheme()

const showThemeDropdown = ref(false)
const themeDropdownRef = ref(null)

const templates = [
  {
    id: -1,
    name: 'Default',
    template: initMarkdown,
  },
  {
    id: 1,
    name: 'Template 1',
    template: initZhMarkdown,
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

## Notes
1. Next meeting scheduled for April 30, 2025
2. Follow-up on action items in the next meeting

> Remember to send out meeting minutes to all attendees.
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

const handleThemeSelect = (themeName) => {
  setTheme(themeName)
  showThemeDropdown.value = false
}

const handleFileUpload = (event) => {
  const file = event.target.files[0]
  if (!file) return

  const reader = new FileReader()
  reader.onload = (e) => {
    emit('upload', e.target.result)
  }
  reader.readAsText(file)
  event.target.value = ''
}

const handleClickOutside = (event) => {
  if (themeDropdownRef.value && !themeDropdownRef.value.contains(event.target)) {
    showThemeDropdown.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>
