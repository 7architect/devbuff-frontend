<template>
  <div>
    <h1>{{ idea.name }}</h1>
    <div class="flex flex-wrap items-start my-5">
      <RouterLink to="/" custom v-slot="{ navigate }">
        <div class="mr-6 mb-4">
          <WidgetUser
            avatar-gradient-border
            :avatar="getUserProfileUrl(idea.ownerIdea.id)"
            :firstname="idea.ownerIdea.firstName"
            :lastname="idea.ownerIdea.lastName"
            :username="idea.ownerIdea.userName"
            @click="navigate"
            v-focusable
          />
        </div>
      </RouterLink>
      <AtomicLabel name="date" class="mt-0 mx-4 mb-4">
        {{ publishedAgo }}
      </AtomicLabel>

      <AtomicLabel name="status" class="mt-0 mx-4 mb-4">
        {{ idea.status }}
      </AtomicLabel>

      <AtomicLabel v-if="isOwnerIdea" name="moderation" class="mt-0 mx-4 mb-4">
        {{ idea.waitingValidation ? 'waiting' : 'aproove' }}
      </AtomicLabel>
    </div>
    <div class="grid gap-6 grid-cols-6">
      <AtomicCard class="mb-3 col-span-4">
        <div v-html="idea.text" class="overflow-hidden" />
      </AtomicCard>

      <div class="col-span-2">
        <div class="-mt-12 mb-6 flex items-center">
          <span class="opacity-50">вы создатель</span>
          <AtomicActions>
            <template #activator>
              <div class="text-primary flex items-center ml-2">
                Быстрое управление <ChevronDownIcon />
              </div>
            </template>

            <div class="text-xs">
              <AtomicAction
                type="danger"
                description="Все отклики будут удалены"
              >
                <template #icon><StopIcon /></template>
                Stop company
              </AtomicAction>
              <AtomicAction type="danger" class="my-2">
                <template #icon><TrashIcon /></template>
                Delete idea
              </AtomicAction>
              <AtomicAction>
                <template #icon><EditIcon /></template>
                Edit idea
              </AtomicAction>
            </div>
          </AtomicActions>
        </div>

        <AtomicCard>
          <h4 class="mt-0 mb-0 text-sm font-normal opacity-30">
            Позиции - {{ idea.specialist.length }}
          </h4>
          <div class="divide-y divide-gray-200 dark:divide-blueGray-700">
            <div
              class="-mx-4 mt-3 px-4 py-3"
              v-for="specialist in idea.specialist"
              :key="specialist.id"
            >
              <h5 class="mb-4 m-0 font-normal">
                {{ specialist.name }} Developer
              </h5>
              <AtomicLabel name="Стек языков">
                <div class="flex flex-wrap">
                  <div
                    v-for="language in languages"
                    :key="`language-${language}-${specialist.id}`"
                  >
                    <AtomicChip :text="language" class="mb-2" type="auto" />
                  </div>
                </div>
              </AtomicLabel>
              <AtomicLabel name="Стек фреймворков" class="mt-4">
                <div class="flex flex-wrap">
                  <div
                    v-for="framework of frameworks"
                    :key="`language-${framework}-${specialist.id}`"
                  >
                    <AtomicChip :text="framework" class="mb-2" type="auto" />
                  </div>
                </div>
              </AtomicLabel>

              <div v-if="!isOwnerIdea" class="mt-6">
                <div
                  role="button"
                  v-if="getStatusAtPosition(specialist.id) === 'NONE'"
                  @click="send(specialist.id)"
                  :class="[
                    'p-2 text-center text-primary bg-primary bg-opacity-10',
                    'transition-all hover:bg-opacity-[0.15] rounded',
                  ]"
                >
                  Откликнуться
                </div>
                <div
                  v-else-if="getStatusAtPosition(specialist.id) === 'PENDING'"
                  :class="[
                    'w-full py-2 rounded',
                    'text-center text-gray-400',
                    'bg-gray-100',
                  ]"
                >
                  Заявка отправлена
                </div>
                <div
                  v-else-if="getStatusAtPosition(specialist.id) === 'ACCEPTED'"
                  :class="[
                    'w-full py-2 rounded',
                    'text-center text-gray-400',
                    'bg-gray-100',
                  ]"
                >
                  Вы в команде
                </div>
              </div>
            </div>
          </div>
        </AtomicCard>
      </div>
    </div>
  </div>
</template>

<script>
import { defineComponent } from 'vue'
import { useIdea, useUser } from '../composes/core'
import { useTimeAgo, useTitle } from '@vueuse/core'

export default defineComponent({
  name: 'IdeaDetail',
  props: {
    id: { type: String, required: true },
  },
  async setup(props) {
    const {
      idea,
      statusPositions,
      languages,
      frameworks,
      getIdea,
      getStatusPositions,
      joinToIdea,
      changeStatusIdea,
    } = useIdea(props.id)
    const { getUserProfileUrl, getUser, user } = useUser()

    const send = (specialistId) => {
      joinToIdea(idea.value.id, specialistId)
      let result = statusPositions.value.find(
        (statusPosition) => statusPosition.specializationId === specialistId,
      )
      if (result) result.positionStatus = 'PENDING'
    }
    const getStatusAtPosition = (specialistId) => {
      let result = statusPositions.value.find(
        (statusPosition) => statusPosition.specializationId === specialistId,
      )
      return result && result.positionStatus
    }

    await getIdea()
    await getUser()
    await getStatusPositions(idea.value.id)

    const isOwnerIdea = user.value.id === idea.value.ownerIdea.id
    const publishedAgo = useTimeAgo(idea.value.lastUpdateDate)

    useTitle(`${idea.value.name} - DevBuff`)

    return {
      idea,
      isOwnerIdea,
      publishedAgo,
      languages,
      frameworks,
      send,
      changeStatusIdea,
      getUserProfileUrl,
      getStatusAtPosition,
    }
  },
})
</script>
