<template>
  <button
    :class="[
      'px-6 overflow-hidden rounded relative inline-block text-center',
      `transition-all border focus:ring ring-${colorType}-300 focus:outline-none`,
      `bg-${colorType} border-${colorType}`,
      `hover:bg-${colorType}-400 hover:border-${colorType}-400`,
      `active:bg-${colorType}-600 active:border-${colorType}-600`,

      isWide && 'w-full',
      isSmall ? 'py-0.5 text-sm' : 'py-1.5',
      isDepressed &&
        `
          bg-opacity-10 border-opacity-0 hover:bg-opacity-20 hover:border-opacity-20
          active:bg-opacity-30 active:border-opacity-30
        `,
      !isDepressed && !isMuted && 'text-white',
      isDepressed && `text-${colorType}`,
    ]"
    v-bind="$attrs"
  >
    <span class="flex items-center justify-center">
      <span v-if="slots.icon" class="mr-2">
        <slot name="icon" />
      </span>
      <span
        v-if="slots.default"
        :class="[
          'font-normal whitespace-nowrap',
          loading && 'invisible relative',
        ]"
      >
        <slot />
      </span>
    </span>
    <span
      v-if="loading"
      class="
        absolute
        w-full
        h-full
        top-0
        left-0
        flex
        items-center
        justify-center
      "
    >
      <atomic-loading-spinner
        :class="isMuted ? 'text-black dark:text-white' : 'text-white'"
      />
    </span>
  </button>
</template>

<script>
import { defineComponent, computed } from 'vue'

const types = ['muted', 'primary', 'success', 'warning', 'danger']
const defaultType = 'muted'

export default defineComponent({
  name: 'AtomicButton',
  props: {
    type: {
      type: String,
      default: 'primary',
      validate: (v) => types.includes(v),
    },
    isOutline: {
      type: Boolean,
      default: false,
    },
    isSmall: {
      type: Boolean,
      default: false,
    },
    isWide: {
      type: Boolean,
      default: false,
    },
    isDepressed: {
      type: Boolean,
      default: false,
    },
    loading: {
      type: Boolean,
      default: false,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
  },
  setup(props, ctx) {
    const isMuted = computed(() => props.type === 'muted')
    const isTypeSupports = computed(() => types.includes(props.type))
    const colorType = computed(() =>
      isTypeSupports.value ? props.type : defaultType,
    )

    return { isMuted, isTypeSupports, colorType, ...ctx }
  },
})
</script>
