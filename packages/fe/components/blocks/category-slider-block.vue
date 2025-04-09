<template>
  <div v-if="collection" class="category-slider-block">

    <!-- ===================================================== SVG clip path -->
    <svg
      class="clip-path-svg"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 208 115">
      <defs>
        <clipPath id="category-card-clip-path">
          <path d="M100.257 -9.58029e-07L205.599 -3.67217e-07C207.705 -2.75146e-07 208.524 3.08831 206.733 4.19808C199.379 8.7567 188.616 16.269 183.344 23.7182C175.715 34.4977 171.868 40.7206 167.316 54.4269C157.251 84.7297 137.091 115 105.161 115L2.847 115C0.940776 115 0.0699719 112.541 1.52966 111.315C6.96669 106.749 15.8818 98.7727 20.132 92.25C26.2646 82.8383 28.9036 77.7549 32.2487 66.5C42.3009 32.6784 64.9734 -1.25522e-06 100.257 -9.58029e-07Z" />
        </clipPath>
      </defs>
    </svg>

    <!-- =================================================== Slider + Filter -->
    <Filterer
      filter-key="categories"
      :options="siteContent.categoryList">
      <CircularSlider
        slider-id="category-slider"
        :start-panel-index="collection.length - 1"
        :display-options="{ default: 7, xlarge: 6, large: 5, small: 4, mini: 5 }"
        :grid-cols="sliderGrid">

        <template #icon-previous>
          <ChevronDownIcon class="previous-icon" />
        </template>

        <template #icon-next>
          <ChevronDownIcon class="next-icon" />
        </template>

        <template
          v-for="(slide, i) in collection"
          #[`slider-panel-${i}`]>
          <div
            :key="`slide-${i}`"
            class="category-card">
            <div class="inner-content">
              <div
                class="background-image"
                :style="{ 'background-image': `url('/images/categories/${slide.id}.jpg')` }">
              </div>
              <div class="category">
                <div class="text">
                  <!-- {{ `${slide.label} (${slide.count})` }} -->
                  {{ slide.name }}
                </div>
              </div>
            </div>
          </div>
        </template>

      </CircularSlider>
    </Filterer>

  </div>
</template>

<script>
// ====================================================================== Import
import { mapGetters } from 'vuex'

import Filterer from '@/modules/search/components/filterer'
import CircularSlider from '@/modules/slider/components/circular-slider'
import ChevronDownIcon from '@/components/icons/chevron-down'

// ====================================================================== Export
export default {
  name: 'SliderBlock',

  components: {
    Filterer,
    CircularSlider,
    ChevronDownIcon
  },

  props: {
    block: {
      type: Object,
      required: true,
      default: () => ({})
    }
  },

  computed: {
    ...mapGetters({
      filters: 'datasets/filters',
      siteContent: 'general/siteContent'
    }),
    collection () {
      return this.siteContent.categoryList
    },
    sliderGrid () {
      return this.block.sliderGrid
    }
  },

  methods: {
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
.category-slider-block {
  position: relative;
  @include small {
    margin-bottom: 2.5rem;
  }
}

.clip-path-svg {
  position: absolute;
  z-index: -1;
  opacity: 0;
}

.clip-path-svg,
.background-image {
  width: 208px;
  height: 115px;
}

:deep(.slider-view) {
  &:before,
  &:after {
    content: '';
    position: absolute;
    z-index: 2;
    top: 0;
    width: 3rem;
    height: 100%;
  }
  &:before {
    left: 0;
    background: linear-gradient(90deg, rgba(238,245,241,1) 0%, rgba(0,0,0,0) 100%);
  }
  &:after {
    right: 0;
    background: linear-gradient(-90deg, rgba(238,245,241,1) 0%, rgba(0,0,0,0) 100%);
  }
  .slider-row {
    z-index: 1;
  }
}

// ////////////////////////////////////////////////////////////// CircularSlider
:deep(.circular-slider .panel-before) {
  min-height: 0 !important;
  z-index: 1;
  @include small {
    position: absolute;
    width: 100%;
    top: 100%;
  }
}

:deep(.circular-slider .panel-after) {
  @include medium {
    margin: 0 -2.5rem;
    width: calc(100% + 5rem);
  }
  @include small {
    margin: 0 -3.5rem;
    width: calc(100% + 7rem);
  }
  @include mini {
    margin: 0 -14rem;
    width: calc(100% + 28rem);
  }
  @include tiny {
    margin: 0 -18rem;
    width: calc(100% + 36rem);
  }
}

:deep(.slider-controls) {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 100%;
  // margin-top: -1rem;
  // transform: translateY(74px);
  @include small {
    transform: none;
    display: flex;
    justify-content: center;
  }
  .slide-selector {
    justify-content: space-between;
    padding: 0 2.25rem;
    @include medium {
      padding: 0;
      margin: 0 -1rem;
      width: calc(100% + 2rem);
    }
    @include small {
      width: toRem(112);
    }
    .slider-button {
      @include circleBorder;
    }
    .previous-button {
      svg {
        transform: rotate(90deg) scale(0.4);
      }
    }
    .next-button {
      svg {
        transform: rotate(-90deg) scale(0.4);
      }
    }
  }
}

.category-card {
  // cursor: pointer;
  position: relative;
  width: 100%;
  min-height: 9.125rem;
  // &:hover {
  //   .text {
  //     &:after {
  //       opacity: 1;
  //     }
  //   }
  // }
}

.inner-content {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: 100%;
  height: 100%;
}

.background-image {
  position: relative;
  clip-path: url(#category-card-clip-path);
  background-repeat: no-repeat;
  background-size: cover;
}

.category {
  display: flex;
  justify-content: center;
  width: 100%;
  margin-top: 0.625rem;
  .text {
    position: relative;
    @include fontWeight_Bold;
    @include fontSize_14;
    line-height: leading(21, 14);
    text-align: center;
    &:after {
      content: '';
      position: absolute;
      top: calc(100% + 0.25rem);
      left: 2px;
      width: calc(100% - 0.5rem);
      height: 0;
      border: solid 1.5px black;
      border-radius: 2px;
      opacity: 0;
      transition: 200ms ease;
    }
  }
}

</style>
