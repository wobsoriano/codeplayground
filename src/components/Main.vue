<template>
    <main class="flex-auto relative border-t border-gray-200 dark:border-gray-600" style="height: calc(100vh - 50px)">
        <div class="flex flex-row h-full">
            <div class="w-full">
                <Tabs :items="items" v-model="currentTab" />
                <MonacoEditor :activeTab="currentTab" :options="options" :initialContent="initialContent" @change="onChange" />
            </div>
            <iframe ref="iframe" class="h-full w-full" sandbox="allow-scripts" frameBorder="0"></iframe>
        </div>
    </main>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { useStorage } from '@vueuse/core'
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
const options = ref({})

const initialContent = ref('')

const isDark = useDarkGlobal()

watch(isDark, (value) => {
    iframe.value?.contentWindow?.postMessage(`theme-${value ? 'dark' : 'light'}`, '*')
})

const onChange = (payload: Record<string, any>) => {
    iframe.value!.srcdoc = generateHTML(payload, isDark.value)
}
</script>