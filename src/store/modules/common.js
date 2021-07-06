import _ from 'lodash'
import { setStore, getStore } from '@/util/store'
const common = {
  state: {
    comSearchText: '',
    historyList: getStore({ name: 'historyList' }) || []
  },
  mutations: {
    SET_SEARCH_TEXT: (state, comSearchText) => {
      state.comSearchText = comSearchText
    },
    SET_SEARCH_HISTORY: (state, history) => {
      if (history) {
        state.historyList = _.uniq([...state.historyList, history])
        if (_.size(state.historyList) > 5) {
          state.historyList.shift()
        }
        setStore({ name: 'historyList', content: state.historyList })
      }
    },
    CLEAR_SEARCH_HISTORY: (state) => {
      state.historyList = []
      setStore({ name: 'historyList', content: [] })
    }
  }
}
export default common
