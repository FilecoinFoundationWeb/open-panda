<template>
  <div class="toolbar">

    <!-- =================================================== Toolbar heading -->
    <div class="grid-middle-spaceBetween">
      <div class="col">
        <h5 class="toolbar-heading">
          {{ toolbarContent.headingText }}
        </h5>
      </div>
    </div>

    <!-- ========================= searchbar, checkbox, sort, filter button -->
    <div class="toolbar-top">
      <div class="feature-not-available-wrapper">
        <div class="grid-middle-spaceBetween">

          <div class="col-8_md-12">
            <div class="toolbar-panel-left">
              <Searchbar
                :placeholder="`Search ${count || '...'} datasets`"
                :loading="dataLoading"
                theme="line"
                class="datasets-searchbar" />
              <CheckboxFullyStored
                :options="siteContent.filters.filters.fullyStored"
                class="datasets-checkbox show-desktop-only" />
              <Filters class="show-mobile-only" />
            </div>
          </div>

          <div class="col-4_md-12">
            <div class="toolbar-panel-right">
              <CheckboxFullyStored
                :options="siteContent.filters.filters.fullyStored"
                class="datasets-checkbox show-mobile-only" />
              <Sort :options="siteContent.filters.sort" />
              <Filters class="show-desktop-only" />
            </div>
          </div>

        </div>
      </div>
    </div>

    <!-- =================== results count, selected filters, layout toggle -->
    <div class="toolbar-bottom show-desktop-only">
      <div class="grid-middle-spaceBetween">

        <div class="col-8">
          <div class="button-list left">
            <!-- <div class="results-count">
              {{ resultCount }}
            </div> -->
            <ButtonFilters
              v-for="(option, index) in selectedFilterOptions"
              :key="`${option.value}-${index}`"
              :selected="true"
              class="filter-button"
              @clicked="deselectFilterOption(option)">
              {{ option.label }}
            </ButtonFilters>
          </div>
        </div>

        <div class="col-4">
          <div class="button-list right">
            <!-- <Button
              :button="{type: 'outline'}"
              @clicked="clearAllFilters">
              {{ toolbarContent.clearAllFiltersButtonText }}
            </Button> -->
            <button
              :class="['button-layout layout-grid', layout === 'grid' ? 'selected' : '']"
              @click="$emit('updateLayout', 'grid')">
              <GridIcon />
            </button>
            <button
              :class="['button-layout layout-list', layout === 'list' ? 'selected' : '']"
              @click="$emit('updateLayout', 'list')">
              <ListIcon />
            </button>
          </div>
        </div>

      </div>
    </div>

  </div>
</template>

<script>
// ===================================================================== Imports
import { mapGetters } from 'vuex'

import Filters from '@/components/filters'
import Searchbar from '@/components/searchbar'
import Sort from '@/components/sort'
import CheckboxFullyStored from '@/components/page-home/checkbox-fully-stored'
import ButtonFilters from '@/components/buttons/button-filters'
// import Button from '@/components/buttons/button'

import GridIcon from '@/components/icons/grid'
import ListIcon from '@/components/icons/list'

// ====================================================================== Export
export default {
  name: 'Toolbar',

  components: {
    Filters,
    Searchbar,
    Sort,
    CheckboxFullyStored,
    ButtonFilters,
    // Button,
    GridIcon,
    ListIcon
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

  data () {
    return {
      searchAndFiltersToclear: {
        resetFormFields: [
          { id: 'search', resetTo: 'nullState' },
          { id: 'sort' },
          { id: 'limit' },
          { id: 'fully-stored' }
        ],
        searchers: ['search'],
        filters: {
          clear: ['categories', 'licenses', 'fileExtensions', 'sort', 'limit', 'fullyStored', 'datasetSizeMin', 'datasetSizeMax'],
          override: ['page']
        }
      }
    }
  },

  computed: {
    ...mapGetters({
      filters: 'datasets/filters',
      sortOptions: 'datasets/sortOptions',
      dataLoading: 'datasets/loading',
      metadata: 'datasets/metadata',
      siteContent: 'general/siteContent'
    }),
    toolbarContent () {
      return this.pageContent.toolbar
    },
    count () {
      return this.siteContent.datasetList.length
    },
    resultCount () {
      const count = this.count
      if (!count) { return '0 Results' }
      if (count === 1) { return '1 Result' }
      return `${count} Results`
    },
    selectedFilterOptions () {
      const filters = ['categories', 'licenses', 'fileExtensions']
      const len = filters.length
      let selected = []
      for (let i = 0; i < len; i++) {
        selected = selected.concat(
          this.$filter(filters[i]).getSelectionOptions()
        )
      }
      return selected
    }
  },

  beforeDestroy () {
    this.$clearSearchAndFilters(this.searchAndFiltersToclear)
  },

  methods: {
    async deselectFilterOption (option) {
      await this.$filter(option.filterKey).for({ index: option.index, live: false })
      await this.$filter('page').for({ index: 0, live: false })
      await this.$applyMultipleFiltersToQuery({
        filters: ['page', 'categories']
      })
    },
    async clearAllFilters () {
      await this.$filter('page').for({ index: 0, live: false })
      await this.$clearSearchAndFilters(this.searchAndFiltersToclear)
    }
  }
}
</script>

<style lang="scss" scoped>
// ///////////////////////////////////////////////////////////////////// General
.feature-not-available-wrapper {
  position: relative;
  &:hover {
    &::before {
      transition: 150ms ease-in;
      backdrop-filter: blur(10px);
      opacity: 1;
    }
  }
  &::before {
    content: 'Feature not available';
    display: flex;
    align-items: center;
    justify-content: center;
    position: absolute;
    bottom: -0.5rem;
    left: 0;
    width: 100%;
    height: calc(100% + 2.5rem);
    z-index: 200;
    border-radius: toRem(30) toRem(30) toRem(30) toRem(2);
    opacity: 0;
    transition: 150ms ease-out;
  }
}

.toolbar-heading {
  position: relative;
  margin-top: 2.25rem;
  z-index: 300;
  // @include mini {
  //   margin-bottom: toRem(10);
  // }
}

.toolbar-panel-left {
  display: flex;
  align-items: center;
}

.toolbar-panel-right {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  @include mini {
    :deep(.button-filter) {
      width: 100%;
    }
  }
}

.searchbar {
  max-width: toRem(400);
  margin-right: toRem(17);
  @include medium {
    width: 100%;
    max-width: none;
  }
  @include mini {
    // margin-bottom: toRem(10);
  }
}

.button-list {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  align-items: center;
  &.right {
    justify-content: flex-end;
  }
}

.results-count {
  margin-right: 1rem;
  margin-bottom: 0.5rem;
}

.filter-button {
  margin-bottom: 0.5rem;
}

.button-layout {
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: toRem(10);
  width: toRem(36);
  height: toRem(36);
  margin-left: toRem(10);
  &.selected {
    background-color: $rangoonGreen;
    :deep(path) {
      fill: white;
    }
  }
  &.layout-grid {
    margin-left: toRem(20);
  }
  :deep(path) {
    fill: $rangoonGreen;
  }
}

.toolbar-bottom {
  position: relative;
  z-index: 300;
}
</style>
