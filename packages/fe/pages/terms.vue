<template>
  <div :class="`page page-${tag}`">

    <BlockBuilder :sections="headerContent" />

    <div class="grid">
      <div class="col-8_md-10_sm-12" data-push-left="off-2_md-1_sm-0">
        <div
          class="main-content">
          <nuxt-content
            :document="mainContent"
            class="markdown-content-styling" />
        </div>
      </div>
    </div>

  </div>
</template>

<script>
// ====================================================================== Import
import BlockBuilder from '@/components/block-builder'

import datasetList from '@/content/data/dataset-list.json'

// ====================================================================== Export
export default {
  name: 'TermsPage',

  components: {
    BlockBuilder
  },

  async asyncData ({ $content, store }) {
    await store.dispatch('general/getBaseData', { key: 'datasetList', data: datasetList })
    const termsContent = await $content('markdown/terms').fetch()
    return { termsContent }
  },

  data () {
    return {
      tag: 'terms'
    }
  },

  computed: {
    heroTextBlock () {
      return {
        type: 'text_block',
        cols: {
          num: 'col-5_sm-12',
          push_left: 'off-1_sm-0'
        },
        heading: this.termsContent.heading,
        description: this.termsContent.description
      }
    },
    heroImageBlock () {
      return {
        type: 'image_block',
        cols: {
          num: 'col-5_sm-8_mi-10_ti-12',
          push_left: 'off-1_sm-2_mi-1_ti-0'
        },
        src: this.termsContent.image
      }
    },
    headerContent () {
      return {
        hero: {
          id: 'terms-hero',
          grid: ['middle'],
          col_0: this.heroImageBlock,
          col_1: this.heroTextBlock,
          col_2: this.heroImageBlock
        }
      }
    },
    mainContent () {
      return this.termsContent
    }
  }
}
</script>

<style lang="scss" scoped>
// ///////////////////////////////////////////////////////////////////// General
:deep(.terms-hero) {
  padding-top: 5rem;
  padding-bottom: toRem(100);
  @include small {
    padding-bottom: 0;
  }
  div[data-block-id="col_0"] {
    display: none;
    @include small {
      display: block;
    }
  }
  div[data-block-id="col_1"] {
    .text-block {
      .heading {
        @include h2;
        @include small {
          @include fontSize_28;
        }
      }
      .description {
        p {
          @include p2;
        }
      }
    }
  }
  div[data-block-id="col_2"] {
    @include small {
      display: none;
    }
  }
  .image-block {
    position: relative;
    transform: translateY(-25%);
    &:after {
      content: '';
      display: block;
      position: absolute;
      width: calc(100% - 1.5rem);
      height: 10rem;
      top: 92.5%;
      left: 0;
      background-image: url('/images/terms/mushroom-texture.png');
      background-size: 100%;
      background-repeat: no-repeat;
    }
  }
}

.main-content {
  margin-bottom: 4rem;
}

:deep(.markdown-content-styling) {
  h1,
  h2,
  h3,
  h4,
  h5,
  h6 {
    padding: 1.25rem 0;
  }
  p {
    @include p2;
    margin-bottom: 1.5rem;
  }
  ul,
  ol,
  li {
    list-style: none;
  }
  li {
    position: relative;
    padding-left: 1.125rem;
    @include p2;
    &:before {
      content: '';
      position: absolute;
      left: 0.125rem;
      top: 0.7125rem;
      height: 3.5px;
      width: 3px;
      border-radius: 2px;
      background-color: black;
    }
    &:last-child {
      margin-bottom: 1.5rem;
    }
  }
  li > p {
    margin-bottom: 0;
  }
}
</style>
