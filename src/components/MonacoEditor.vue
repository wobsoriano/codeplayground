<template>
  <div ref="container" class="w-full h-full"></div>
</template>

<script setup lang="ts">
import { onMounted, ref, defineProps, onUnmounted, watch, toRefs, defineEmit } from "vue";
import { useResizeObserver, useStorage, useDebounceFn } from '@vueuse/core'
import { editor as MonacoEditor } from 'monaco-editor'

import { StorageName, useDarkGlobal, useMonaco } from "../utils"

const monaco = useMonaco()
const container = ref<HTMLDivElement | null>(null)

let editor: MonacoEditor.IStandaloneCodeEditor

const isDark = useDarkGlobal()

const props = defineProps<{
  initialContent: string
  options: MonacoEditor.IEditorOptions & MonacoEditor.IGlobalEditorOptions
  activeTab: string
}>()

const { options, activeTab } = toRefs(props)

const editorState = useStorage<Record<string, any>>(StorageName.EDITOR_STATE, {})
const editorValue = useStorage<Record<string, any>>(StorageName.EDITOR_VALUE, {})

const emit = defineEmit<(e: 'change', payload: typeof editorValue.value) => void>()

onMounted(() => {
  editor = monaco.editor.create(container.value!, {
      language: activeTab.value,
      theme: isDark.value ? 'vs-dark' : 'vs',
      ...props.options
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

watch(options, (value) => {
  editor.updateOptions({
    ...editor.getOptions,
    ...value
  })
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