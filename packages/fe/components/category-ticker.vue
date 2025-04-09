<template>
  <div class="category-ticker">

    <div class="inner-content">

      <img :src="block.image" class="img" />

      <div class="text-wrapper">

        <div class="message">
          {{ message }}
        </div>

        <div class="ticker">
          <span
            v-for="(category, i) in categories"
            :key="category"
            :class="['tick', { current: categoryIndex === i }]">
            {{ category }}
          </span>
        </div>

      </div>

    </div>

  </div>
</template>

<script>
// ====================================================================== Import
import { mapActions, mapGetters } from 'vuex'

// ====================================================================== Export
export default {
  name: 'CategoryTicker',

  props: {
    block: {
      type: Object,
      required: true,
      default: () => ({})
    }
  },

  data () {
    return {
      categoryIndex: 0,
      interval: false
    }
  },

  computed: {
    ...mapGetters({
      siteContent: 'general/siteContent'
    }),
    categoryList () {
      return this.siteContent.categoryList
    },
    message () {
      return this.block.message
    },
    categories () {
      return this.categoryList.map(item => item.name)
    }
  },

  mounted () {
    if (this.categories.length) {
      this.$nextTick(() => {
        this.increment()
        this.interval = setInterval(() => { this.increment() }, 1750)
      })
    }
  },

  beforeDestroy () {
    if (this.interval) { clearInterval(this.interval) }
  },

  methods: {
    ...mapActions({
      getDatasetList: 'datasets/getDatasetList'
    }),
    increment () {
      this.categoryIndex = (this.categoryIndex + 1) % this.categories.length
    },
    async initializeFilter (index, applyFilter) {
      await applyFilter({ index, live: false })
      await this.$filter('page').for({ index: 0, live: false })
      await this.$applyMultipleFiltersToQuery({ filters: ['page', 'categories'] })
    }
  }
}
</script>

<style lang="scss" scoped>
// ///////////////////////////////////////////////////////////////////// General
:deep(.filters) {
  margin-bottom: toRem(20);
  @include tiny {
    margin-bottom: toRem(39);
  }
}

.inner-content {
  display: flex;
  flex-direction: row;
  justify-content: center;
  width: 100%;
  position: relative;
}

.text-wrapper {
  display: flex;
  position: absolute;
  bottom: 25%;
}

.ticker {
  position: relative;
  min-width: 5rem;
}

.message {
  margin-right: 0.25rem;
  @include fontSize_16;
  @include fontWeight_Medium;
  line-height: leading(24, 16);
}

.tick {
  @include fontSize_16;
  @include fontWeight_Bold;
  line-height: leading(24, 16);
  white-space: nowrap;
  position: absolute;
  top: 0;
  left: 0;
  opacity: 0;
  transition: 200ms ease;
  &.current {
    opacity: 1;
  }
}
</style>
