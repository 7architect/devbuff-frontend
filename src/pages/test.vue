<template>
  <AtomicImageUpload target="image" v-model="model" />
</template>

<script>
export default {
  name: 'Test',
  data() {
    return { model: '' }
  },
}
</script>
