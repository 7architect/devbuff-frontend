<template>
  <div class="relative">
    <AtomicCard class="relative">
      <div class="flex items-center mb-3">
        <AtomicAvatar
          class="mr-2"
          size="30px"
          :avatar="getUserProfileUrl(idea.ownerIdea.id)"
        />
        <div class="mt-px text-xs">
          {{ idea.ownerIdea.firstName }} {{ idea.ownerIdea.lastName }}
          <div class="opacity-50">@{{ idea.ownerIdea.userName }}</div>
        </div>
      </div>

      <RouterLink
        :to="{ name: 'idea-detail', params: { id: idea.id, _isDialog: true } }"
        custom
        v-slot="{ href, navigate }"
      >
        <a
          :href="href"
          @click="navigate"
          v-focusable
          class="font-semibold text-lg inline-block"
        >
          {{ idea.name }}
        </a>
      </RouterLink>

      <div class="mt-2 text-sm text-gray-500 leading-5">
        {{ idea.description }}
      </div>

      <AtomicLabel
        v-if="idea.specialists.length"
        :name="t('detail.specialist')"
        class="mt-4"
      >
        <div class="flex flex-wrap">
          <AtomicChip
            v-for="(spec, index) in idea.specialists"
            :key="'spec' + spec.name + index"
            :text="t(`commons.specialist.${spec.name}`, true)"
            class="mr-2 mb-2"
          />
        </div>
      </AtomicLabel>

      <AtomicLabel
        v-if="technologies.length"
        :name="t('detail.technologies')"
        class="mt-2"
      >
        <div class="flex flex-wrap">
          <AtomicChip
            v-for="(tech, index) in technologies"
            :key="'tech' + tech + index"
            :text="tech"
            class="mr-2 mb-2"
          />
        </div>
      </AtomicLabel>

      <AtomicLabel
        v-if="languages.length"
        :name="t('detail.languages')"
        class="mt-2"
      >
        <div class="flex flex-wrap">
          <AtomicChip
            v-for="(language, index) in languages"
            :key="'lang' + language + index"
            :text="tDefault(`commons.languages.${language}`, language, true)"
            type="auto"
            class="mr-2 mb-2"
          />
        </div>
      </AtomicLabel>
    </AtomicCard>
  </div>
</template>

<script>
import { defineComponent } from 'vue'
import { useI18n } from '../../../composes/utils'
import { useUser } from '../../../composes/core'

export default defineComponent({
  name: 'WidgetIdeasCard',
  props: {
    idea: {
      type: Object,
      default: () => ({}),
    },
  },
  setup(props, context) {
    const { t, tDefault } = useI18n('components.widget.ideas.card')
    const { slots } = context
    const { getUserProfileUrl } = useUser()

    const languages = props.idea.specialists
      .flatMap((specialist) =>
        specialist.languages.map((language) => language.name),
      )
      .filter((item, index, array) => array.indexOf(item) === index)
    const technologies = props.idea.specialists
      .flatMap((specialist) =>
        specialist.languages.flatMap((languages) =>
          languages.technologies.map((technology) => technology.name),
        ),
      )
      .filter((item, index, array) => array.indexOf(item) === index)

    return {
      t,
      tDefault,
      getUserProfileUrl,
      slots,
      languages,
      technologies,
    }
  },
})
</script>
