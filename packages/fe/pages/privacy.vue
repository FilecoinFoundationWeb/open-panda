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
  name: 'PrivacyPage',

  components: {
    BlockBuilder
  },

  async asyncData ({ $content, store }) {
    await store.dispatch('general/getBaseData', { key: 'datasetList', data: datasetList })
    const privacyContent = await $content('markdown/privacy').fetch()
    return { privacyContent }
  },

  data () {
    return {
      tag: 'privacy'
    }
  },

  computed: {
    heroTextBlock () {
      return {
        type: 'text_block',
        cols: {
          num: 'col-5_mi-12',
          push_left: 'off-1_sm-0_mi-0'
        },
        heading: this.privacyContent.heading,
        description: this.privacyContent.description
      }
    },
    heroImageBlock () {
      return {
        type: 'image_block',
        cols: {
          num: 'col-5_sm-6_mi-12',
          push_left: 'off-1_mi-0'
        },
        src: this.privacyContent.image
      }
    },
    headerContent () {
      return {
        hero: {
          id: 'privacy-hero',
          grid: ['middle'],
          col_1: this.heroTextBlock,
          col_2: this.heroImageBlock
        }
      }
    },
    mainContent () {
      return this.privacyContent
    }
  }
}
</script>

<style lang="scss" scoped>
// ///////////////////////////////////////////////////////////////////// General
:deep(.privacy-hero) {
  padding-bottom: toRem(100);
  @include small {
    padding-bottom: 0;
  }
  [class~="grid"],
  [class*="grid-"],
  [class*="grid_"] {
    @include mini {
      flex-direction: column-reverse;
    }
  }
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
