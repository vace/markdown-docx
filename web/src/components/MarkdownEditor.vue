<template>
  <div class="w-full md:w-1/2 p-2 overflow-auto relative">
    <div class="w-full h-full border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500">
      <textarea
        v-model="markdownContent"
        class="w-full h-full p-4 resize-none"
        :placeholder="t('markdown_placeholder')"
      ></textarea>
    </div>
    <div class="absolute top-4 right-4 z-10">
      <button
        @click="$emit('clear')"
        class="p-1 rounded bg-gray-200 hover:bg-gray-300 text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        title="Clear text"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
        </svg>
      </button>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useI18n } from '../composables/useI18n'

const props = defineProps({
  modelValue: {
    type: String,
    default: ''
  }
})

const emit = defineEmits(['update:modelValue', 'clear'])

const { t } = useI18n()

const markdownContent = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
})
</script>
