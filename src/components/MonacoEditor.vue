<template>
  <div ref="container" style="height: calc(100% - 2.5rem)"></div>
</template>

<script setup lang="ts">
import { onMounted, ref, onUnmounted, watch, toRefs } from 'vue'
import { useResizeObserver, useStorage, useDebounceFn } from '@vueuse/core'
import { initialEditorValue, StorageName, useDarkGlobal } from '../utils'

// Import monaco
// https://github.com/vitejs/vite/discussions/1791
import * as monaco from 'monaco-editor'
import editorWorker from 'monaco-editor/esm/vs/editor/editor.worker?worker'
import jsonWorker from 'monaco-editor/esm/vs/language/json/json.worker?worker'
import cssWorker from 'monaco-editor/esm/vs/language/css/css.worker?worker'
import htmlWorker from 'monaco-editor/esm/vs/language/html/html.worker?worker'
import tsWorker from 'monaco-editor/esm/vs/language/typescript/ts.worker?worker'

// @ts-ignore
self.MonacoEnvironment = {
  getWorker(_: string, label: string) {
    if (label === 'json') {
      return new jsonWorker()
    }
    if (label === 'css' || label === 'scss' || label === 'less') {
      return new cssWorker()
    }
    if (label === 'html' || label === 'handlebars' || label === 'razor') {
      return new htmlWorker()
    }
    if (label === 'typescript' || label === 'javascript') {
      return new tsWorker()
    }
    return new editorWorker()
  }
}

const container = ref<HTMLDivElement | null>(null)

let editor: monaco.editor.IStandaloneCodeEditor

const isDark = useDarkGlobal()

const props = defineProps<{
  activeTab: string
}>()

const { activeTab } = toRefs(props)

const editorState = useStorage<Record<string, any>>(StorageName.EDITOR_STATE, {})
const editorValue = useStorage<Record<string, any>>(StorageName.EDITOR_VALUE, initialEditorValue)

const emit = defineEmits<(e: 'change', payload: typeof editorValue.value) => void>()

onMounted(() => {
  editor = monaco.editor.create(container.value!, {
      language: activeTab.value,
      theme: isDark.value ? 'vs-dark' : 'vs'
  })
  
  emit('change', editorValue.value)

  editor.onDidChangeModelContent(useDebounceFn(() => {
    if (editorValue.value[activeTab.value] !== editor.getValue()!) {
      editorValue.value[activeTab.value] = editor.getValue()!
      emit('change', editorValue.value)
    }
  }, 500))

  // Set values from storage on load
  if (editorValue.value[activeTab.value]) {
    editor.setValue(editorValue.value[activeTab.value])
    editor.restoreViewState(editorState.value[activeTab.value])
  }
})

watch(activeTab, (currentTab, prevTab) => {
  monaco.editor.setModelLanguage(editor.getModel()!, currentTab)

  editorState.value[prevTab] = editor.saveViewState()

  if (editorValue.value[currentTab]) {
    editor.setValue(editorValue.value[currentTab])
  } else {
    editor.setValue('')
  }

  if (editorState.value[currentTab]) {
    editor.restoreViewState(editorState.value[currentTab]!)
    editor.focus()
  }
})

watch(isDark, (value) => {
  editor.updateOptions({
    theme: value ? 'vs-dark' : 'vs'
  })
})

const editorObserver = useResizeObserver(container, () => {
  editor.layout()
})

onUnmounted(() => {
  editor?.dispose()
  editorObserver.stop()
})
</script>