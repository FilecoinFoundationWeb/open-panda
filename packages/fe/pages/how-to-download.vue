<template>
  <div :class="`page page-${tag}`">

    <BlockBuilder :sections="pageContent" />

  </div>
</template>

<script>
// ====================================================================== Import
import { mapGetters } from 'vuex'

import HowToDownloadPageData from '@/content/pages/how-to-download.json'
import BlockBuilder from '@/components/block-builder'

import datasetList from '@/content/data/dataset-list.json'

// ====================================================================== Export
export default {
  name: 'HowToDownloadPage',

  components: {
    BlockBuilder
  },

  data () {
    return {
      tag: 'how-to-download'
    }
  },

  async fetch ({ store, error }) {
    await store.dispatch('general/getBaseData', { key: 'how-to-download', data: HowToDownloadPageData })
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
:deep(.how-to-download-hero) {
  padding-bottom: toRem(116);
  @include small {
    padding-bottom: toRem(66);
  }
  div[data-block-id="col_1"] {
    .image-block {
      @include small {
        margin-bottom: 1rem;
      }
    }
  }
  div[data-block-id="col_2"] {
    .text-block {
      .heading {
        @include h2;
        margin-bottom: 1.75rem;
      }
      .description {
        margin-bottom: 2rem;
        p {
          @include small {
            @include p2;
          }
        }
      }
    }
  }
}

:deep(.how-to-download-instructions) {
  padding-bottom: 1rem;
  @include small {
    padding-bottom: 0;
  }
  .block {
    margin-bottom: toRem(42);
    @include small {
      margin-bottom: 1.125rem;
    }
  }
}
</style>
