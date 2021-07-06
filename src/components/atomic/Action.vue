<template>
  <div>
    <div
      v-focusable
      class="flex items-center cursor-pointer group transition-colors"
    >
      <div
        :class="[
          {
            'text-primary bg-primary': type === 'primary',
            'text-secondary bg-secondary': type === 'secondary',
            'text-warning bg-warning': type === 'warning',
            'text-danger bg-danger': type === 'danger',
            'text-success bg-success': type === 'success',
            'bg-gray-500': type === 'muted',
          },
          `
            bg-opacity-[.15] rounded-full p-1
            group-hover:bg-opacity-20 group-active:bg-opacity-30
            transform group-active:scale-90
         `,
        ]"
      >
        <slot name="icon" />
      </div>
      <div :class="{ 'ml-2': slots.icon && slots.default }">
        <slot />
      </div>
    </div>
    <div v-if="description" class="text-xs my-1 opacity-30 flex leading-3">
      <div class="w-[1.5em] m-2"></div>
      {{ description }}
    </div>
  </div>
</template>

<script>
import { defineComponent, useContext } from 'vue'

const types = ['primary', 'secondary', 'warning', 'danger', 'success', 'muted']
export default defineComponent({
  name: 'AtomicAction',
  props: {
    description: { type: String, default: null },
    type: {
      type: String,
      default: 'muted',
      validate: (v) => types.includes(v),
    },
  },
  setup(props) {
    return {
      ...useContext(),
    }
  },
})
</script>
