<template>
  <div>
    <input type="hidden" :name="name" :id="name" :value="inputValue" />
    <div class="mt-px text-xs text-danger mb-2 pt-1">
      {{ errorMessage }}
    </div>

    <div class="grid grid-cols-12 gap-2">
      <div
        :class="[
          `
          bg-white border border-gray-300 border-opacity-30 dark:border-blueGray-700 dark:bg-blueGray-900
          p-4 rounded-xl relative col-span-3
        `,
          errorMessage &&
            '!border-danger !ring-danger-200 dark:!ring-danger-900',
        ]"
        v-for="(name, index) of specializations"
        :key="name + index"
      >
        <div class="flex justify-between">
          <div>
            {{ t(`commons.specialist.${name}`, true) }}
          </div>

          <AtomicAction type="muted">
            <template #icon>
              <PlusIcon />
            </template>
          </AtomicAction>
        </div>

        <p class="flex items-center pt-1 text-xs text-gray-400 col-span-6">
          {{ t(`commons.specialistDescription.${name}`, true) }}
        </p>
      </div>
    </div>
  </div>
</template>

<script>
import { defineComponent, ref } from 'vue'
import { useSkills } from '../../../composes/core'
import { useI18n } from '../../../composes/utils'
import { useField } from 'vee-validate'

export default defineComponent({
  name: 'WidgetSpecialistPicker',
  emits: ['update:modelValue'],
  props: {
    name: {
      type: String,
      default: 'specialists',
    },
  },
  setup(props) {
    const max = 10
    const selectedSpecialist = ref([])
    const { t, tDefault } = useI18n('components.widget.specialist.picker')
    const { specializations, getSkills } = useSkills()
    const { value: inputValue, errorMessage } = useField(
      props.name,
      undefined,
      {
        initialValue: selectedSpecialist,
      },
    )

    getSkills()

    return {
      max,
      inputValue,
      errorMessage,
      specializations,
      selectedSpecialist,
      t,
      tDefault,
    }
  },
})
</script>

<style scoped>
.break-avoid {
  break-inside: avoid;
}

.masonry {
  column-count: 4;
}
</style>
