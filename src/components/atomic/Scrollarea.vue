<template>
  <div v-bind="attrs" class="overflow-scroll" ref="container">
    {{ attrs }}
    <slot />
  </div>
</template>

<script>
import { defineComponent, onMounted, ref, useAttrs } from 'vue'

defineComponent({
  name: 'AtomicScrollarea',
  setup() {
    const attrs = useAttrs()
    const container = ref()
    // alert()
    onMounted(() => {
      console.log(container.value, 'mounted')
      container.value.addEventListener('scroll', console.log)
    })

    return { attrs, container }
  },
})
</script>
