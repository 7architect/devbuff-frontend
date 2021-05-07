import { defineNuxtPlugin } from '@nuxtjs/composition-api'

export default defineNuxtPlugin(async ({ $auth, $api, $config }) => {
  let cacheKey = 0
  const fetchUser = async () => {
    const token = $auth.strategy.token.get()?.split(' ').pop()
    console.log($auth.refreshTokens(), token)
    const credentials = new URLSearchParams()
    credentials.set('token', token)

    try {
      const { active, authorities } = await $api.latest.post(
        '/oAuth/check',
        credentials
      )

      if (active) {
        const profile = await $api.latest.get('/profile')
        const avatar = `${$config.API_BASE_URL}/photo/profile/${
          profile.id
        }?${cacheKey++}`

        $auth.setUser({
          ...profile,
          avatar,
          scope: authorities,
        })
      }
    } catch (e) {
      console.error(e)
    }
  }

  $auth.fetchUser = fetchUser
  await $auth.fetchUser()
})