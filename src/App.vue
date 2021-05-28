<template>
  <div class="h-screen">
    <LayoutHeader />
    <div class="grid grid-cols-10 gap-8 container mx-auto mt-8">
      <LayoutSidebar class="col-span-2" />
      <div class="col-span-8">
        <router-view :route="renderRoute" v-slot="{ Component, route }">
          <template v-if="Component">
            <transition name="fade" mode="out-in">
              <suspense>
                <div>
                  <div class="relative h-[100px]">
                    <AtomicBreadcrumbs :items="breadcrumbs" />
                    <transition name="slide">
                      <div :key="route.name" class="absolute">
                        <h1>{{ route.meta.name }}</h1>
                      </div>
                    </transition>
                  </div>
                  <component :is="Component" />
                </div>

                <template #fallback>
                  <div>
                    <div class="flex items-center">
                      <AtomicSkeleton class="w-[80px] mr-4" />
                      <AtomicSkeleton class="w-[120px]" />
                    </div>

                    <AtomicSkeleton
                      class="!w-[200px] !h-[40px] !rounded-md mt-4"
                    />
                  </div>
                </template>
              </suspense>
            </transition>
          </template>
        </router-view>

        <router-view
          v-if="isDialog"
          :route="dialogRoute"
          v-slot="{ Component: Dialog }"
        >
          <AtomicDialog :visible="true" @onClose="back">
            <component :is="Dialog" />
          </AtomicDialog>
        </router-view>
      </div>
    </div>
  </div>
</template>


<script>
import {
  defineComponent,
  ref,
  provide,
  computed,
  shallowRef,
  onErrorCaptured,
} from 'vue'
import { set, useTitle } from '@vueuse/core'
import { useRouter } from 'vue-router'
import { useCookies } from '@vueuse/integrations'

export default defineComponent({
  setup() {
    useTitle('DefBuff')

    const router = useRouter()
    const renderRoute = shallowRef({
      matched: [], // fix vue-router:
    }) // TODO: rename
    const dialogRoute = shallowRef(null)
    const isDialog = ref(false)
    const isError = ref(false)
    const breadcrumbs = computed(() => {
      const breadcrumbs = renderRoute.value?.meta.breadcrumbs || []
      const crumbRoutes = router.options.routes
        .filter((r) => breadcrumbs?.includes(r.name))
        .map((r) => ({ title: r.meta.name, to: r.path }))
      return [...crumbRoutes, { title: renderRoute.value.meta.name }]
    })

    const back = () => router.back()

    router.beforeResolve((to, from, next) => {
      set(isDialog, Boolean(to.params._isDialog))
      set(dialogRoute, isDialog.value ? to : null)

      // Prevent reactive triggers if background route isn't changed
      const bgRoute = isDialog.value ? from : to
      if (renderRoute.value.fullPath !== bgRoute.fullPath)
        set(renderRoute, bgRoute)
      next()
    })

    const t = ref(false)

    onErrorCaptured(() => set(isError, true))
    provide('backgroundRoute', renderRoute)

    return {
      t,
      isDialog,
      renderRoute,
      dialogRoute,
      breadcrumbs,
      isError,
      back,
    }
  },
})
</script>
