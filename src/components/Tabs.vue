<template>
  <div
    class="border-b border-gray-200 dark:border-gray-700 text-sm flex justify-start dark:bg-gray-900 h-10"
  >
    <a
      v-for="item in items"
      :key="item.value"
      :class="props.modelValue === item.value ? 'tab-item-active' : 'tab-item'"
      href="#"
      @click.prevent="emit('update:modelValue', item.value)"
    >
      {{ item.text }}
    </a>
  </div>
</template>

<script setup lang="ts">
interface Item {
  text: string;
  value: string;
}

const props = defineProps<{
  modelValue: string;
  items: Item[];
}>();
const emit = defineEmits<(e: 'update:modelValue', tab: string) => void>();
</script>

<style>
.tab-item {
  @apply inline-block px-4 py-2 text-gray-700 dark:text-gray-200 hover:text-indigo-500 dark:hover:text-indigo-400;
}

.tab-item-active {
  @apply inline-block px-4 py-2 border-t-2 border-indigo-500 text-indigo-500 font-semibold;
}
</style>
