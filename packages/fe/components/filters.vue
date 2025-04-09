<template>
  <div
    v-mousedown-outside="closePanel"
    :class="['filters', { open }, `direction-${openDirection}`, showSearch || showTypeahead ? 'has-search' : 'no-search', `theme-${theme}`]">

    <div class="feature-not-available-wrapper">
      <div class="button-c">
        <Searchbar
          v-if="showSearch || showTypeahead"
          :show-typeahead="showTypeahead"
          :placeholder="`Search ${ siteContent.datasetList.length || '...'} datasets`"
          theme="solid"
          v-on="$listeners" />
        <button class="button-filter" @click="togglePanel">
          <FiltersIcon class="icon" />
          <div class="button-content">
            <client-only>
              <span v-if="filterSelectionsExist" class="has-filters-dot" />
            </client-only>
            <span>{{ filterPanelData.labels.buttonText }}</span>
          </div>
        </button>
      </div>
    </div>

    <!-- <div :class="['filter-panel', { open }]">
      <CardCutout>
        <section class="grid-noGutter-middle-spaceBetween">
          <h5>{{ filterPanelData.labels.add }}</h5>
          <button class="circle-border" @click="togglePanel">
            <IconClose :width="13" :height="13" />
          </button>
        </section>
        <section class="grid-noGutter">
          <div class="filters-label col-12">
            <span>Dataset Size</span>
          </div>
          <DatasetHistogram />
        </section>
        <Filterer
          v-for="(filterGroup, parentIndex) in filterGroups"
          :key="filterGroup.id"
          :filter-key="filterGroup.id"
          :options="filters[filterGroup.id]">
          <section
            slot-scope="{ applyFilter, isSelected }"
            class="grid-noGutter">
            <div class="filters-label col-12">
              <span>{{ filterGroup.label }}</span>
            </div>
            <span
              v-for="(childItem, childIndex) in filters[filterGroup.id]"
              :key="`${filters[parentIndex.id]}-${childIndex}`">
              <ButtonFilters
                v-if="childIndex < filterGroup.limit"
                :selected="isSelected(childIndex)"
                class="filter-button"
                @clicked="applyFilter({ index: childIndex, live: false })">
                {{ childItem.label }}
                <span v-if="childItem.count">&nbsp;({{ childItem.count }})</span>
              </ButtonFilters>
            </span>

            <ButtonToggle
              theme="light"
              :class="[{ active: filterGroup.showMore }]"
              @click="toggleLimit(parentIndex, filters[filterGroup.id])">
              {{ filterGroup.showMore ? filterPanelData.labels.seeLess : filterPanelData.labels.seeMore }}
            </ButtonToggle>

          </section>
        </Filterer>
        <section class="grid-noGutter-right filter-button">
          <Button
            class="btn-clear"
            :button="{type: 'default'}"
            @click.native="clearAll">
            {{ filterPanelData.labels.clear }}
          </Button>
          <Button
            :button="{ type: 'solid', disabled: disableSearchButton }"
            @clicked="fetchNewData">
            {{ filterPanelData.labels.search }}
          </Button>
        </section>
      </CardCutout>
    </div> -->
    
  </div>
</template>

<script>
// ===================================================================== Imports
import { mapGetters } from 'vuex'

// import DatasetHistogram from '@/components/dataset-histogram'
// import Filterer from '@/modules/search/components/filterer'
// import ButtonFilters from '@/components/buttons/button-filters'
// import ButtonToggle from '@/components/buttons/button-toggle'
// import Button from '@/components/buttons/button'
// import CardCutout from '@/components/card-cutout'
import FiltersIcon from '@/components/icons/filter'
// import IconClose from '@/components/icons/close'
import Searchbar from '@/components/searchbar'

// ====================================================================== Export
export default {
  name: 'Filters',

  components: {
    // DatasetHistogram,
    // Filterer,
    // ButtonFilters,
    // ButtonToggle,
    // Button,
    // CardCutout,
    FiltersIcon,
    // IconClose,
    Searchbar
  },

  props: {
    openDirection: {
      type: String,
      required: false,
      default: 'left'
    },
    theme: {
      type: String,
      required: false,
      default: 'solid'
    },
    showSearch: {
      type: Boolean,
      required: false,
      default: false
    },
    showTypeahead: {
      type: Boolean,
      required: false,
      default: false
    }
  },

  data () {
    return {
      open: false,
      filterSelectionsExist: false,
      filterGroups: [{
        id: 'categories',
        label: 'Categories',
        limit: 10,
        showMore: false
      }, {
        id: 'licenses',
        label: 'Licenses',
        limit: 10,
        showMore: false
      }, {
        id: 'fileExtensions',
        label: 'File Types',
        limit: 10,
        showMore: false
      }]
    }
  },

  computed: {
    ...mapGetters({
      filters: 'datasets/filters',
      siteContent: 'general/siteContent',
      selectedFilters: 'search/filters',
      datasetListTypeahead: 'datasets/datasetListTypeahead'
    }),
    filterPanelData () {
      return this.siteContent.general ? this.siteContent.general.filterPanel : false
    }
    // filterKeys () {
    //   return this.filterGroups.map(group => (group.id)).concat(['page', 'datasetSizeMin', 'datasetSizeMax'])
    // },
    // disableSearchButton () {
    //   const filterSelectionsExist = this.$checkIfFilterSelectionsExist(this.filterKeys)
    //   const searchExists = !this.$search('search').isEmpty()
    //   return !filterSelectionsExist && !searchExists
    // }
  },

  watch: {
    async '$route' () {
      await this.checkIfFilterSelectionsExist()
    }
  },

  async mounted () {
    await this.checkIfFilterSelectionsExist()
  },

  methods: {
    togglePanel () {
      this.open = !this.open
    },
    closePanel () {
      this.open = false
    },
    async clearAll () {
      await this.$filter('page').for({ index: 0, live: false })
      await this.$clearSearchAndFilters({ filters: { clear: this.filterKeys, override: ['page'] } })
    },
    toggleLimit (index, child) {
      this.filterGroups[index].limit = this.filterGroups[index].showMore ? 10 : child.length
      this.filterGroups[index].showMore = !this.filterGroups[index].showMore
    },
    async checkIfFilterSelectionsExist () {
      this.filterSelectionsExist = await this.$checkIfFilterSelectionsExist(this.filterKeys)
    },
    async fetchNewData () {
      await this.$filter('page').for({ index: 0, live: false })
      await this.$applyMultipleFiltersToQuery({
        filters: this.filterKeys.concat(['page']),
        redirect: this.$route.path !== '/' ? '/' : undefined
      })
      this.closePanel()
      // need to emit this to close the modal
      this.$emit('filterPanelOnSearch')
    }
  }
}
</script>

<style lang="scss" scoped>
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
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 100;
    border-radius: toRem(30) toRem(30) toRem(30) toRem(2);
    opacity: 0;
    transition: 150ms ease-out;
  }
}

:deep(.button-toggle) {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 40px;
}

.filters {
  position: relative;
  @include fontWeight_Medium;
}

// main button toggle to open panel
.button-c {
  display: flex;
  height: toRem(50);
  pointer-events: none;
  .has-search & {
    @include shadow3;
    border-radius: toRem(30);
  }
  .button-filter {
    height: toRem(50);
    display: flex;
    align-items: center;
    @include fontSize_16;
    background-color: white;
    padding: toRem(15) toRem(28);
    border-radius: 0 toRem(30) toRem(30) 0;
    .no-search & {
      box-shadow: 0px 4px 34px rgba(81, 106, 130, 0.25);
      border-radius: toRem(30);
    }
    .has-search & {
      padding-left: toRem(20);
      border-left: 1px solid $tasman;
    }
    :deep(.icon) {
      margin-right: toRem(15);
      .path {
        transition: 250ms;
      }
    }
    .open &,
    &:hover {
      background-color: $rangoonGreen;
      color: white;
      :deep(.icon) {
        path {
          transition: 250ms;
          fill: white;
        }
      }
    }
  }
  .button-content {
    position: relative;
    .has-filters-dot {
      background-color: $dodgerBlue;
      border-radius: 100%;
      position: absolute;
      width: toRem(10);
      height: toRem(10);
      top: toRem(-5);
      right: toRem(-12);
    }
  }
}

.theme-line {
  border: 1px solid $tasman;
  border-radius: toRem(30);
  :deep(.searchbar) {
    background-color: transparent;
  }
  &.has-search {
    .button-c {
      box-shadow: none;
    }
  }
}

// //////////////////////////////////////////////////////////////// Filter Panel
.filter-panel {
  display: block;
  visibility: hidden;
  position: absolute;
  width: 70vw;
  max-width: toRem(800);
  right: 0;
  top: 120%;
  z-index: 100;
  opacity: 0;
  @include medium {
    width: 88vw;
  }
  &.open {
    visibility: visible;
    opacity: 1;
  }
  .direction-right & {
    left: 0;
    top: 135%;
  }
  section {
    padding: toRem(20) toRem(40);
    &:first-child {
      padding-bottom: toRem(15);
    }
    &:last-child {
      padding-bottom: toRem(10);
    }
    @include medium {
      padding: toRem(20);
    }
    border-bottom: 1px solid $athensGray;
    display: flex;
    &:last-child {
      border-bottom: 0;
    }
  }
  .header {
    justify-content: space-between;
  }
  .filters-label {
    margin-bottom: toRem(15);
    @include fontSize_20;
  }
}

.btn-clear {
  margin-right: toRem(30);
}
</style>
