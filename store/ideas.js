import { uniqBy } from 'lodash'

export const state = () => ({
  list: [],
  own: [],
  idea: {},
})

export const mutations = {
  setIdeas: (state, list) => state.list = list,
  setOwnIdeas: (state, list) => state.own = list,
  setIdea: (state, idea) => state.idea = idea
}

export const actions = {
  async appendIdea(ctx, data) {
    return await this.$api.v1.post('idea', data)
  },

  async updateIdea(ctx, { id, data }) {
    return await await this.$api.v1.put(`idea/${id}`, data)
  },

  async getOwnIdeas({ commit, state }) {
    const ideas = await this.$api.v1.get('/idea/self')
    commit('setOwnIdeas', ideas)

    return ideas
  },

  async getIdeas({ commit, state }, params, rewrite) {
    const finalParams = {
      page: 1,
      sortBy: 'date',
      ...params
    }

    const query = new URLSearchParams
    Object.keys(finalParams).forEach(param => query.append(param, finalParams[param]));

    const ideas = await this.$api.v1.get(`/idea/?${query}`)
    commit('setIdeas', ideas)

    return ideas
  },

  async getIdea({ commit }, uuid) {
    const idea = await this.$api.v1.get(`/idea/${uuid}`)
    commit('setIdea', idea)

    return idea
  }
}

export const getters = {
  list: state => state.list,
  own: state => state.own,
  idea: state => state.idea
}
