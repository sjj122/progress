import { createStore } from 'vuex'

export default createStore({
  state: {
    city: '',
  },
  mutations: {
    changeCity(state, value) {
      state.city = value
    }
  },
  getters: {
    getCity(state) {
      return state.city
    }
  },
  actions: {
  },
  modules: {
  }
})
