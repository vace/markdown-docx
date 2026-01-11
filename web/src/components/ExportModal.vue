<template>
  <Teleport to="body">
    <div
      v-if="modelValue"
      class="fixed z-10 inset-0 overflow-y-auto"
      aria-labelledby="modal-title"
      role="dialog"
      aria-modal="true"
    >
      <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div
          class="fixed inset-0 bg-gray-500/80 bg-opacity-75 transition-opacity"
          aria-hidden="true"
          @click="$emit('update:modelValue', false)"
        ></div>
        <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
        <div
          class="relative inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-md sm:w-full sm:p-6"
        >
          <div>
            <h3 class="text-lg leading-6 font-medium text-gray-900 flex items-center" id="modal-title">
              <span>{{ t('modal_options') }}</span>
              <span class="text-sm text-gray-500"> (MarkdownDocx v1.0)</span>
              <button
                class="ml-auto text-gray-400 hover:text-gray-500 focus:outline-none cursor-pointer"
                @click="$emit('update:modelValue', false)"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
                <span class="sr-only">Close</span>
              </button>
            </h3>
            <div class="mt-3 text-center sm:mt-5">
              <form class="mt-2">
                <div class="mb-4">
                  <label for="doc-theme" class="block text-sm font-medium text-gray-700 text-left">{{ t('theme') }}</label>
                  <select
                    v-model="formData.theme"
                    id="doc-theme"
                    class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  >
                    <option value="default">{{ t('theme_default') }}</option>
                    <option value="elegant">{{ t('theme_elegant') }}</option>
                    <option value="academic">{{ t('theme_academic') }}</option>
                    <option value="modern">{{ t('theme_modern') }}</option>
                  </select>
                </div>

                <div class="mb-4">
                  <label for="doc-name" class="block text-sm font-medium text-gray-700 text-left">{{ t('filename') }}</label>
                  <input
                    v-model="formData.name"
                    type="text"
                    id="doc-name"
                    class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    :placeholder="t('document_name')"
                  />
                </div>

                <div class="mb-4">
                  <label for="doc-title" class="block text-sm font-medium text-gray-700 text-left">{{ t('title') }}</label>
                  <input
                    v-model="formData.title"
                    type="text"
                    id="doc-title"
                    class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    :placeholder="t('document_title')"
                  />
                </div>

                <div class="mb-4">
                  <label for="doc-description" class="block text-sm font-medium text-gray-700 text-left">{{ t('description') }}</label>
                  <textarea
                    v-model="formData.description"
                    id="doc-description"
                    rows="2"
                    class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    :placeholder="t('document_description')"
                  ></textarea>
                </div>

                <div class="mt-4 space-y-2">
                  <div class="flex items-start">
                    <div class="flex items-center h-5">
                      <input
                        v-model="formData.ignoreImage"
                        id="ignore-image"
                        type="checkbox"
                        class="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
                      />
                    </div>
                    <div class="ml-3 text-sm">
                      <label for="ignore-image" class="font-medium text-gray-700">{{ t('ignore_images') }}</label>
                    </div>
                  </div>

                  <div class="flex items-start">
                    <div class="flex items-center h-5">
                      <input
                        v-model="formData.ignoreFootnote"
                        id="ignore-footnote"
                        type="checkbox"
                        class="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
                      />
                    </div>
                    <div class="ml-3 text-sm">
                      <label for="ignore-footnote" class="font-medium text-gray-700">{{ t('ignore_footnotes') }}</label>
                    </div>
                  </div>

                  <div class="flex items-start">
                    <div class="flex items-center h-5">
                      <input
                        v-model="formData.ignoreHtml"
                        id="ignore-html"
                        type="checkbox"
                        class="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
                      />
                    </div>
                    <div class="ml-3 text-sm">
                      <label for="ignore-html" class="font-medium text-gray-700">{{ t('ignore_html') }}</label>
                    </div>
                  </div>
                </div>
              </form>
            </div>
          </div>
          <div class="mt-5 sm:mt-6">
            <button
              type="button"
              @click="handleExport"
              class="inline-flex justify-center w-full rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:text-sm"
            >
              {{ t('export_to_docx') }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
import { reactive } from 'vue'
import { useI18n } from '../composables/useI18n'

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['update:modelValue', 'export'])

const { t } = useI18n()

const formData = reactive({
  theme: 'default',
  name: '',
  title: '',
  description: '',
  ignoreImage: false,
  ignoreFootnote: false,
  ignoreHtml: false
})

const handleExport = () => {
  emit('export', { ...formData })
  emit('update:modelValue', false)
}
</script>
