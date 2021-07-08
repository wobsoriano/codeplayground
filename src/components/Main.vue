<template>
    <main class="border-t border-gray-200 dark:border-gray-700">
        <div class="flex flex-row h-full">
            <div id="split-0" class="w-full">
                <Tabs :items="items" v-model="currentTab" />
                <MonacoEditor :activeTab="currentTab" @change="onChange" />
            </div>
            <iframe ref="iframe" class="h-full w-full" sandbox="allow-scripts" frameBorder="0"></iframe>
        </div>
    </main>
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import { useStorage } from '@vueuse/core'
import Split from 'split.js'

import { generateHTML, StorageName, useDarkGlobal } from '../utils'
import MonacoEditor from './MonacoEditor.vue'
import Tabs from './Tabs.vue'

const iframe = ref<HTMLIFrameElement>()

const items = ref([
    { text: 'HTML', value: 'html' },
    { text: 'CSS', value: 'css' },
    { text: 'JS', value: 'javascript' }
])

const currentTab = useStorage(StorageName.ACTIVE_TAB, items.value[0].value)

const isDark = useDarkGlobal()

watch(isDark, (value) => {
    iframe.value?.contentWindow?.postMessage(`theme-${value ? 'dark' : 'light'}`, '*')
})

const onChange = (payload: Record<string, any>) => {
    iframe.value!.srcdoc = generateHTML(payload, isDark.value)
}

onMounted(() => {
    Split(['#split-0', 'iframe'])
})
</script>

<style>
main {
    height: calc(100vh - var(--nav-height))
}

.gutter {
    @apply dark:bg-gray-900 bg-no-repeat;
    background-position: 50%;
}

.gutter.gutter-horizontal {
    background-image: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUAAAAeCAYAAADkftS9AAAAIklEQVQoU2M4c+bMfxAGAgYYmwGrIIiDjrELjpo5aiZeMwF+yNnOs5KSvgAAAABJRU5ErkJggg==');
    cursor: col-resize;
}
</style>