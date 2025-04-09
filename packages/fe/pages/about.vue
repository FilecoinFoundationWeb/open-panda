<template>
  <div :class="`page page-${tag}`">

    <BlockBuilder :sections="pageContent" />

  </div>
</template>

<script>
// ====================================================================== Import
import { mapGetters } from 'vuex'

import AboutPageData from '@/content/pages/about.json'
import BlockBuilder from '@/components/block-builder'

import datasetList from '@/content/data/dataset-list.json'

// ====================================================================== Export
export default {
  name: 'About',

  components: {
    BlockBuilder
  },

  data () {
    return {
      tag: 'about'
    }
  },

  async fetch ({ app, store, route, error }) {
    await store.dispatch('general/getBaseData', { key: 'about', data: AboutPageData })
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
:deep(.about-hero) {
  margin-bottom: toRem(90);
  @include small {
    margin-bottom: 1.875rem;
  }
  div[data-block-id="col_1"] {
    .column-content {
      position: relative;
      .image-block {
        &:first-child {
          margin-bottom: 1.5rem;
          @include small {
            display: none;
          }
        }
        &:last-child {
          position: absolute;
          width: 100%;
          @include small {
            position: relative;
          }
        }
      }
    }
  }
  div[data-block-id="col_2"] {
    .text-block {
      margin-top: toRem(112);
      @include large {
        margin-top: 4.5rem;
      }
      @include medium {
        margin-top: 0.5rem;
      }
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

:deep(.about-intro-1) {
  padding-bottom: toRem(280);
  @include large {
    padding-bottom: toRem(140);
  }
  @include medium {
    padding-bottom: 2rem;
  }
  @include small {
    padding-bottom: toRem(54);
  }
  div[data-block-id="col_0"] {
    .image-block {
      display: none;
      @include small {
        display: block;
      }
    }
  }
  div[data-block-id="col_1"] {
    .text-block {
      margin-top: toRem(330);
      @include large {
        margin-top: toRem(180);
      }
      @include medium {
        margin-top: toRem(42);
      }
      @include small {
        margin-top: toRem(42);
      }
      .description {
        margin-bottom: 2rem;
        @include small {
          padding-bottom: 1rem;
          margin-bottom: 0;
        }
        p {
          @include p2;
        }
      }
      .button-row {
        @include small {
          margin-bottom: 2.5rem;
        }
      }
    }
  }
  div[data-block-id="col_2"] {
    .column-content {
      position: relative;
    }
    .image-block {
      &:first-child {
        margin-bottom: 1.5rem;
        @include small {
          display: none;
        }
      }
      &:last-child {
        position: absolute;
        width: 100%;
        @include small {
          position: relative;
        }
      }
    }
  }
}

:deep(.section-faq) {
  margin-bottom: 4rem;
  @include small {
    margin-bottom: 0;
  }
  .text-block {
    .heading {
      @include h2;
      margin-bottom: toRem(116);
      @include medium {
        margin-bottom: 1rem;
      }
      @include small {
        font-size: 2rem;
      }
    }
  }
}
</style>
