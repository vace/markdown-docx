<template>
  <div class="w-full md:w-1/2 p-2 bg-white">
    <div class="w-full max-w-full h-full p-4 border rounded overflow-auto">
      <div
        id="markdown-preview"
        class="prose prose-sm w-full max-w-full min-h-full p-4"
        :style="previewStyles"
        v-html="htmlContent"
      ></div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useTheme } from '../composables/useTheme'

const props = defineProps({
  htmlContent: {
    type: String,
    default: ''
  }
})

const { themeConfig } = useTheme()

const previewStyles = computed(() => {
  const theme = themeConfig.value?.theme
  if (!theme) return {}

  return {
    '--theme-heading1': `#${theme.heading1}`,
    '--theme-heading2': `#${theme.heading2}`,
    '--theme-primary': `#${theme.heading3}`,
    '--theme-link': `#${theme.link}`,
    '--theme-code': `#${theme.code}`
  }
})
</script>
