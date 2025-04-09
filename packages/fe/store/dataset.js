// /////////////////////////////////////////////////////////////////////// State
// ---------------------- https://vuex.vuejs.org/guide/modules.html#module-reuse
const state = () => ({
  dataset: false
})

// ///////////////////////////////////////////////////////////////////// Getters
// -----------------------------------------------------------------------------
const getters = {
  dataset: state => state.dataset
}

// ///////////////////////////////////////////////////////////////////// Actions
// -----------------------------------------------------------------------------
const actions = {
  // //////////////////////////////////////////////////////////////// getDataset
  getDataset ({ commit, getters, dispatch }, metadata) {
    try {
      const datasetList = metadata.datasetList
      const route = metadata.route
      const slug = route.params.id
      const dataset = datasetList.find(dataset => dataset.slug === slug)
      commit('SET_DATASET', { dataset })
      return dataset
    } catch (e) {
      if (getters.dataset) { commit('SET_DATASET', { dataset: false }) }
      console.log('======================== [Store Action: dataset/getDataset]')
      console.log(e)
      return false
    }
  }
}

// /////////////////////////////////////////////////////////////////// Mutations
// -----------------------------------------------------------------------------
const mutations = {
  SET_DATASET (state, payload) {
    state.dataset = payload.dataset
  }
}

// ////////////////////////////////////////////////////////////////////// Export
// -----------------------------------------------------------------------------
export default {
  state,
  getters,
  actions,
  mutations
}
