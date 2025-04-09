<template>
  <div class="cid-table">
    <!-- =========================================================== Toolbar -->
    <div
      v-if="cidList && cidList.length"
      class="toolbar">
      <div class="checkboxes">
        <FieldContainer
          field-key="toggle_complete_data"
          :scaffold="{
            type: 'checkbox',
            required: false,
            options: checkboxes,
            defaultValue: false,
            resetGroupId: 'complete-data',
            updateGroupId: 'complete-data',
            resetTo: 'nullState',
            isSingleOption: true
          }"
          class="disabled"
          data-tooltip="Coming soon" />
      </div>
    </div>

    <div class="search-results-count">
      <div v-if="resultsCount" class="count">
        {{ `${resultsCount} Search Results` }}
      </div>
    </div>

    <!-- ============================================================= Table -->
    <div :class="['table', { 'null-state': !cidList || !cidList.length }]">

      <template v-if="cidList && cidList.length">
        <CIDCard
          v-for="(cid, i) in cidList"
          :key="`cid-${i}`"
          :cid-data="cid"
          :mobile="mobileTable" />
      </template>

      <div class="table-messages">
        <h3
          v-if="Array.isArray(cidList) && !cidList.length && !cidsLoading"
          class="heading">
          This dataset hasn’t been onboarded to the network yet
        </h3>
        <Spinner
          v-if="cidsLoading"
          theme="dark" />
      </div>

    </div>

    <!-- ======================================================== Pagination -->
    <div class="pagination">

      <PaginationControls
        v-if="totalPages > 1"
        :page="page"
        :total-pages="totalPages"
        :loading="cidsLoading" />

      <Limit
        v-if="totalPages > 1 && limitOptions"
        :options="limitOptions" />

    </div>

  </div>
</template>

<script>
// ====================================================================== Import
import { mapGetters } from 'vuex'

import CIDCard from '@/components/cid-card'
import PaginationControls from '@/components/pagination-controls'
import Limit from '@/components/limit'
import FieldContainer from '@/components/form/field-container'
import Spinner from '@/components/spinners/triple-dot'

// =================================================================== Functions
const handleTableResize = (instance) => {
  if (window.matchMedia('(max-width: 64rem)').matches) {
    if (!instance.mobileTable) {
      instance.mobileTable = true
    }
  } else {
    if (instance.mobileTable) {
      instance.mobileTable = false
    }
  }
}

// ====================================================================== Export
export default {
  name: 'CIDTable',

  components: {
    CIDCard,
    PaginationControls,
    Limit,
    FieldContainer,
    Spinner
  },

  data () {
    return {
      mobileTable: false,
      resize: false,
      checkboxes: [
        { label: 'Show only complete data', value: false },
        { label: 'Show only available CIDs', value: false }
      ]
    }
  },

  computed: {
    ...mapGetters({
      cidList: 'cid/cidList',
      metadata: 'cid/metadata',
      cidsLoading: 'cid/loading',
      limitOptions: 'datasets/limitOptions',
      filters: 'datasets/filters'
    }),
    totalPages () {
      return this.metadata.totalPages
    },
    page () {
      return this.metadata.page
    },
    resultsCount () {
      return this.metadata.count
    }
  },

  mounted () {
    handleTableResize(this)
    this.resize = () => { handleTableResize(this) }
    window.addEventListener('resize', this.resize)
  },

  beforeDestroy () {
    if (this.resize) { window.removeEventListener('resize', this.resize) }
  }
}
</script>

<style lang="scss" scoped>
// ///////////////////////////////////////////////////////////////////// General
:deep(.card-cutout-wrapper) {
  margin-bottom: 1.875rem;
}

.table {
  margin-bottom: 3.5rem;
  @include tiny {
    margin-bottom: 2.5rem;
  }
  &.null-state {
    padding: 1.8125rem 25%;
    @include small {
      padding: 1.8125rem 17%;
    }
    @include mini {
      padding: 1.8125rem 1rem;
    }
    @include tiny {
      padding: 1.8125rem 0;
    }
  }
  .heading {
    text-align: center;
    margin-bottom: 1.5rem;
  }
}

.toolbar {
  display: flex;
  justify-content: space-between;
  margin-bottom: 1.375rem;
  padding-right: 0.5rem;
  @include medium {
    flex-direction: column;
  }
  :deep(.searchbar) {
    flex-grow: 0;
    flex-direction: row-reverse;
    min-width: 24rem;
    padding: 0 1.25rem;
    @include tiny {
      min-width: auto;
    }
    .search-button {
      margin-left: 0.25rem;
      margin-right: 1.125rem;
    }
  }
  .checkboxes {
    display: flex;
    margin: auto 0;
    @include medium {
      margin: 0;
      margin-top: 1.5rem;
      padding-left: 0.5rem;
    }
  }
  :deep(.checkbox) {
    &.field-wrapper.disabled {
      .checkbox-wrapper {
        opacity: 0.5;
        pointer-events: none;
        touch-action: none;
        @include medium {
          margin: 0;
          &:not(:last-child) {
            margin-bottom: 0.75rem;
          }
        }
      }
      &:hover {
        cursor: not-allowed;
      }
    }
    .field-checkbox {
      display: flex;
      @include medium {
        flex-direction: column;
        align-items: flex-start;
      }
    }
  }
}

.count {
  @include fontSize_16;
  @include fontWeight_Medium;
  padding-left: 1.75rem;
  margin-bottom: 3.125rem;
}

.pagination {
  display: flex;
  justify-content: space-between;
  padding: 0 1.5625rem;
  @include medium {
    flex-direction: column;
    align-items: center;
  }
  @include mini {
    padding: 0;
  }
  :deep(#pagination-controls) {
    width: unset;
    @include tiny {
      width: 100%;
      padding: 0 0.5rem;
      justify-content: space-between;
    }
  }
  :deep(.field-wrapper) {
    @include medium {
      margin-top: 1.875rem;
    }
    .field-label {
      white-space: nowrap;
    }
  }
}
</style>
