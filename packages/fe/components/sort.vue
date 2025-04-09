<template>
  <Filterer
    v-slot="{ applyFilter, originalSelected }"
    filter-key="sort"
    :is-single-option="true"
    :options="[]"
    class="datasets-sort"
    v-on="$listeners">
    <FieldContainer
      field-key="sort_by"
      :scaffold="{
        type: 'select',
        required: false,
        label: 'Sort by',
        options: options,
        defaultValue: originalSelected.length > 0 ? originalSelected : [0], /* manually set to 0 because default in datasets.js store corresponds with the 0'th value in limitOptions */
        resetGroupId: 'sort',
        updateGroupId: 'sort',
        isSingleOption: true
      }"
      @updateValue="initializeFilter($event, applyFilter)" />
  </Filterer>
</template>

<script>
// ===================================================================== Imports
import Filterer from '@/modules/search/components/filterer'
import FieldContainer from '@/components/form/field-container'

// ====================================================================== Export
export default {
  name: 'Sort',

  components: {
    Filterer,
    FieldContainer
  },

  props: {
    options: {
      type: Array,
      required: true
    }
  },

  methods: {
    async initializeFilter (index, applyFilter) {
      await applyFilter({ index, live: false })
      await this.$filter('page').for({ index: 0, live: false })
      await this.$applyMultipleFiltersToQuery({ filters: ['page', 'sort'] })
    }
  }
}
</script>

<style lang="scss" scoped>
// ///////////////////////////////////////////////////////////////////// General
.datasets-sort {
  margin-right: toRem(30);
  @include medium {
    margin-right: 0;
  }
  :deep(.field-label) {
    white-space: nowrap;
  }
  :deep(.field-select) {
    width: toRem(140);
  }
}
</style>
