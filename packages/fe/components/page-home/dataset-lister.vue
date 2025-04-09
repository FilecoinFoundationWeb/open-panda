<template>
  <div :class="['dataset-lister', `layout__${layout}`]">

    <div :class="gridClasses">
      <div
        v-for="(dataset, index) in datasetList"
        :key="`dataset-${layout}-${index}`"
        class="col">
        <component
          :is="cardType"
          :dataset="dataset"
          :labels="pageContent.layouts[layout].labels"
          :class="`layout__${layout}`" />
      </div>
    </div>

  </div>
</template>

<script>
// ===================================================================== Imports
import { mapGetters } from 'vuex'

import CardGrid from '@/components/page-home/datasets-card-grid'
import CardList from '@/components/page-home/datasets-card-list'

// ====================================================================== Export
export default {
  name: 'Toolbar',

  components: {
    CardGrid,
    CardList
  },

  props: {
    pageContent: {
      type: Object,
      required: true
    },
    layout: {
      type: String,
      required: true
    }
  },

  computed: {
    ...mapGetters({
      siteContent: 'general/siteContent'
    }),
    datasetList () {
      return this.siteContent.datasetList
    },
    gridClasses () {
      return this.layout === 'grid' ? 'grid-4_lg-3_md-2_sm-1' : 'grid-1'
    },
    cardType () {
      return this.layout === 'grid' ? 'CardGrid' : 'CardList'
    }
  }
}
</script>

<style lang="scss" scoped>
// ///////////////////////////////////////////////////////////////////// General
:deep(.card) {
  height: calc(100% - #{toRem(9)});
  .card-cutout-wrapper {
    height: 100%;
  }
}
</style>
