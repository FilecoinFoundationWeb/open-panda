<template>
  <div :class="`page page-${tag}`">
    <!-- ============================================================== Hero -->
    <BlockBuilder
      id="section-hero-categories-slider"
      :sections="pageContent.header" />

    <!-- =========================================================== Toolbar -->
    <Toolbar
      id="section-toolbar"
      :page-content="pageContent"
      :layout="layout"
      @updateLayout="updateLayout" />

    <!-- ============================================ Dataset lister (cards) -->
    <DatasetLister
      id="section-dataset-lister"
      :page-content="pageContent"
      :layout="layout" />

    <!-- ======================================================== Pagination -->
    <section v-if="!noResults" id="pagination">
      <div class="grid-center-noGutter-middle">

        <div class="col-5_md-12">
          <PaginationControls
            v-if="totalPages > 1"
            :page="page"
            :total-pages="totalPages"
            :loading="dataLoading" />
        </div>

        <div class="col-5_md-12">
          <div class="limit">
            <Limit
              v-if="totalPages > 1"
              :options="limitOptions" />
          </div>
        </div>

      </div>
    </section>

  </div>
</template>

<script>
// ===================================================================== Imports
import { mapGetters, mapActions } from 'vuex'

import IndexPageData from '@/content/pages/index.json'
import BlockBuilder from '@/components/block-builder'
import Toolbar from '@/components/page-home/toolbar'
import DatasetLister from '@/components/page-home/dataset-lister'
import PaginationControls from '@/components/pagination-controls'
import Limit from '@/components/limit'

import datasetList from '@/content/data/dataset-list.json'
import filters from '@/content/data/filters.json'
import categoryList from '@/content/data/categories.json'

// ====================================================================== Export
export default {
  name: 'PageIndex',

  components: {
    BlockBuilder,
    Toolbar,
    DatasetLister,
    PaginationControls,
    Limit
  },

  data () {
    return {
      tag: 'index',
      layout: 'grid'
    }
  },

  async fetch ({ app, store, route, redirect }) {
    await store.dispatch('general/getBaseData', { key: 'index', data: IndexPageData })
    await store.dispatch('general/getBaseData', { key: 'datasetList', data: datasetList })
    await store.dispatch('general/getBaseData', { key: 'filters', data: filters })
    await store.dispatch('general/getBaseData', { key: 'categoryList', data: categoryList })
    // const response = await store.dispatch('datasets/getDatasetList', { route })
    // if (response.fail) {
    //   return redirect(response.route)
    // }
  },

  head () {
    return this.$compileSeo(this.$getSeo(this.tag))
  },

  computed: {
    ...mapGetters({
      siteContent: 'general/siteContent',
      limitOptions: 'datasets/limitOptions',
      dataLoading: 'datasets/loading',
      metadata: 'datasets/metadata',
      datasetList: 'datasets/datasetList'
    }),
    pageContent () {
      return this.siteContent[this.tag].page_content
    },
    count () {
      return this.metadata.count
    },
    page () {
      return this.metadata.page
    },
    totalPages () {
      return this.metadata.totalPages
    },
    noResults () {
      return !this.count
    }
  },

  watch: {
    '$route' () {
      this.$nextTick(() => {
        this.getDatasetList()
        this.scrollToResultList()
      })
    },
    datasetList () {
      this.stopLoading()
    }
  },

  mounted () {
    this.stopLoading()
    this.scrollToResultList()
    this.$nextTick(() => {
      this.layout = this.$ls.get('layout') || 'grid'
      this.setReturnToSearchButton({
        button: {
          text: 'Back',
          type: 'light',
          icon: 'arrow'
        }
      })
    })
  },

  methods: {
    ...mapActions({
      resetStore: 'datasets/resetStore',
      setLoadingStatus: 'datasets/setLoadingStatus',
      getDatasetList: 'datasets/getDatasetList',
      setReturnToSearchButton: 'datasets/setReturnToSearchButton'
    }),
    stopLoading () {
      this.$nextTick(() => {
        if (typeof this.datasetList !== 'boolean') {
          this.setLoadingStatus({ status: false })
        }
      })
    },
    updateLayout (layout) {
      this.$ls.set('layout', layout)
      this.layout = layout
    },
    /**
     * If search and filters are not empty, scroll to the results section
     */
    async scrollToResultList () {
      const filterSelectionsExist = await this.$checkIfFilterSelectionsExist(['categories', 'licenses', 'fileExtensions', 'fullyStored'])
      const searchExists = !this.$search('search').isEmpty()
      if (filterSelectionsExist || searchExists) {
        this.$scrollToElement(document.getElementById('section-toolbar'), 200, -50)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
// //////////////////////////////////////////////////////////////////////// Hero
:deep(.home-hero) {
  padding-bottom: toRem(60);
  @include medium {
    padding-bottom: 0;
  }
  [data-block-id="col_2"] {
    .text-block {
      margin-left: $singleColumn;
      margin-top: toRem(90);
      @include medium {
        margin-left: 0;
        margin-top: toRem(35);
      }
    }
  }
  [data-block-id="col_1"] {
    .image-block {
      margin-top: -10%;
    }
  }
  @include medium {
    .button-row {
      display: none;
    }
  }
  .image-block {
    &.desktop-only {
      @include tiny {
        display: none;
      }
    }
    &.mobile-only {
      display: none;
      @include tiny {
        display: block;
      }
    }
  }
}

:deep(.home-slider) {
  overflow: hidden;
}

// ///////////////////////////////////////////////////////////////////// Toolbar
#section-toolbar {
  margin-bottom: toRem(55);
  @include tiny {
    margin-bottom: toRem(24);
  }
}

// ////////////////////////////////////////////////////////////////// No results
#section-no-results {
  text-align: center;
}

// ////////////////////////////////////////////////////////// Pagination & limit
#pagination {
  margin-top: toRem(50);
}

#pagination-controls {
  @include medium {
    justify-content: center;
    margin-bottom: toRem(20);
  }
}

.limit {
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  @include medium {
    justify-content: center;
  }
}
</style>
