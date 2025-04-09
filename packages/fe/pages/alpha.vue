<template>
  <div :class="`page page-${tag}`">

    <BlockBuilder :sections="pageContent" />

  </div>
</template>

<script>
// ====================================================================== Import
import { mapGetters } from 'vuex'

import AlphaPageData from '@/content/pages/alpha.json'
import BlockBuilder from '@/components/block-builder'

import datasetList from '@/content/data/dataset-list.json'

// ====================================================================== Export
export default {
  name: 'AlphaPage',

  components: {
    BlockBuilder
  },

  data () {
    return {
      tag: 'alpha'
    }
  },

  async fetch ({ store, error }) {
    await store.dispatch('general/getBaseData', { key: 'alpha', data: AlphaPageData })
    await store.dispatch('general/getBaseData', { key: 'datasetList', data: datasetList })
  },

  head () {
    return this.$compileSeo(this.$getSeo(this.tag))
  },

  computed: {
    ...mapGetters({
      siteContent: 'general/siteContent'
    }),
    pageContent () {
      return this.siteContent[this.tag].page_content
    }
  }
}
</script>

<style lang="scss" scoped>
// ///////////////////////////////////////////////////////////////////// General
:deep(.alpha-hero) {
  padding-top: 3.5rem;
  @include small {
    padding-top: 0;
    padding-bottom: 2rem;
  }
  div[data-block-id="col_1"] {
    .image-block {
      &:first-child {
        transform: translateY(18%);
      }
    }
  }
  div[data-block-id="col_2"] {
    .text-block {
      .heading {
        @include h3;
        margin-bottom: 1.75rem;
      }
      .description {
        margin-bottom: 2rem;
        @include p1;
        p {
          @include small {
            @include p2;
          }
        }
      }
    }
  }
}

:deep(.alpha-intro) {
  padding-bottom: 5rem;
  @include small {
    padding-bottom: 2rem;
  }
  .text-block {
    padding-top: 5rem;
    @include small {
      padding-top: 2rem;
    }
    .label {
      @include h5;
    }
    .description {
      p {
        @include p2;
      }
    }
  }
  div[data-block-id="col_0"] {
    display: none;
    @include small {
      display: block;
    }
  }
  div[data-block-id="col_2"] {
    .column-content {
      position: relative;
    }
    .image-block {
      position: absolute;
      width: 100%;
      transform: translateY(-20%);
      height: fit-content;
    }
  }
}
</style>
