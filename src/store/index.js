import Vue from 'vue'
import Vuex from 'vuex'
import user from './modules/user'
import dict from './modules/dict'
import common from './modules/common'

import getters from './getters'

Vue.use(Vuex)
const store = new Vuex.Store({
  modules: {
    user,
    dict,
    common
  },
  getters
})

export default store
