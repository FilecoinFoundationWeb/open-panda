<template>
  <div class="circular-slider" :style="{ '--slider-min-height': `${height}px` }">
    <div :class="`grid-noGutter${reverseGrid ? '-reverse' : ''}`">

      <div
        :class="gridCols.before.num"
        :data-push-left="gridCols.before.push_left"
        :data-push-right="gridCols.before.push_right">
        <div class="panel-before">

          <div class="title-matter">
            <slot name="title-matter" :slide="currentSlide"></slot>
          </div>

          <div class="slider-controls">
            <div class="slide-selector">

              <button
                class="previous-button slider-button"
                @click="onClick(1)">
                <slot name="icon-previous"></slot>
              </button>

              <button
                class="next-button slider-button"
                @click="onClick(-1)">
                <slot name="icon-next"></slot>
              </button>

            </div>
          </div>

        </div>
      </div>

      <div
        :class="gridCols.after.num"
        :data-push-left="gridCols.after.push_left"
        :data-push-right="gridCols.after.push_right">
        <div class="panel-after">
          <div class="slider-view">
            <div
              ref="rowContainer"
              v-hammer:swipe.horizontal="onSwipe"
              class="slider-row-container">
              <div
                class="slider-row">
                <div
                  v-for="(item, index) in collection"
                  :key="index"
                  ref="slides"
                  :style="getSlideStyles(index)"
                  class="slide">

                  <slot :name="`slider-panel-${index}`"></slot>

                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<script>
// ===================================================================== Imports
import { mapActions } from 'vuex'
import CloneDeep from 'lodash/cloneDeep'

// =================================================================== Functions
const handleSliderResize = (instance) => {
  matchBreakpointDisplayAmount(instance)
  if (instance.$refs.rowContainer) {
    const columnWidth = instance.$refs.rowContainer.clientWidth / instance.display
    instance.columnWidth = columnWidth
  }
  if (instance.$refs.slides) {
    const slideStyles = window.getComputedStyle(instance.$refs.slides[0])
    const slidePadding = 2 * parseInt(slideStyles.padding)
    const slideHeights = instance.$refs.slides.map((el) => {
      if (el.childNodes[0]) {
        return el.childNodes[0].clientHeight
      }
      return 0
    })
    instance.height = Math.max(...slideHeights) + slidePadding
  }
}

const matchBreakpointDisplayAmount = (instance) => {
  let reset = true
  for (const breakpoint in instance.breakpoints) {
    if (window.matchMedia(`(max-width: ${breakpoint})`).matches) {
      if (reset) { reset = false }
      if (instance.display !== instance.breakpoints[breakpoint]) {
        instance.display = instance.breakpoints[breakpoint]
      }
    }
  }
  if (reset) {
    if (instance.display !== instance.breakpoints.default) {
      instance.display = instance.breakpoints.default
    }
  }
}

// ====================================================================== Export
export default {
  name: 'CircularSlider',

  props: {
    sliderId: {
      type: String,
      required: true
    },
    startPanelIndex: {
      type: Number,
      required: false,
      default: 0
    },
    displayOptions: {
      type: Object,
      required: false,
      default: () => {
        return { default: 3 }
      }
    },
    gridCols: {
      type: Object,
      required: false,
      default: () => ({
        before: { num: 'col-4_sm-12' },
        after: { num: 'col-8_sm-12' }
      })
    },
    reverseGrid: {
      type: Boolean,
      required: false,
      default: false
    }
  },

  data () {
    const localId = this.$uuid.v4()
    const num = this.displayOptions.default
    return {
      localId,
      animateSlots: [],
      display: num,
      columnWidth: 0,
      resize: false,
      touchGesture: '',
      height: 100
    }
  },

  computed: {
    id () {
      return `${this.sliderId}|${this.localId}`
    },
    collection () {
      const slides = []
      for (const key in this.$slots) {
        if (key.startsWith('slider-panel')) { slides.push(key) }
      }
      return slides
    },
    breakpoints () {
      const data = {}
      if (this.displayOptions.hasOwnProperty('ultralarge')) { data['140.625rem'] = this.displayOptions.ultralarge }
      if (this.displayOptions.hasOwnProperty('xlarge')) { data['90rem'] = this.displayOptions.xlarge }
      if (this.displayOptions.hasOwnProperty('large')) { data['85rem'] = this.displayOptions.large }
      if (this.displayOptions.hasOwnProperty('medium')) { data['64rem'] = this.displayOptions.medium }
      if (this.displayOptions.hasOwnProperty('small')) { data['53.125rem'] = this.displayOptions.small }
      if (this.displayOptions.hasOwnProperty('mini')) { data['40rem'] = this.displayOptions.mini }
      if (this.displayOptions.hasOwnProperty('tiny')) { data['25.9375rem'] = this.displayOptions.tiny }
      if (this.displayOptions.hasOwnProperty('default')) {
        data.default = this.displayOptions.default
      } else {
        data.default = 3
      }
      return data
    },
    panelCount () {
      return this.$slider(this.sliderId).getPanelCount()
    },
    positions () {
      return this.$slider(this.sliderId).getPanelPositions()
    },
    mapToPixels () {
      return this.positions.map((e, i) => (i - 2) * this.columnWidth)
    },
    currentSlide () {
      return this.positions[1]
    }
  },

  mounted () {
    const panelCount = this.collection.length
    const startPanelIndex = this.startPanelIndex
    const displayMax = Math.max(...Object.keys(this.breakpoints).map(key => this.breakpoints[key]))
    if (startPanelIndex < 0) {
      throw new Error(`The start panel index cannot be a negative number. You supplied a value of ${startPanelIndex}`)
    }
    if (startPanelIndex > panelCount - 1) {
      throw new Error(`You entered a start panel index (${startPanelIndex}) that is higher than the amount of panels available; (${panelCount}).`)
    }
    if (panelCount - 2 < displayMax) {
      throw new Error(`Not enough slides were provided. At least two more than the display maximum of ${displayMax} are needed.`)
    }
    this.registerSlider({
      id: this.id,
      sliderId: this.sliderId,
      panelPositions: [...Array(panelCount).keys()].map(el => (el + startPanelIndex + panelCount - 1) % panelCount),
      panelCount,
      refreshHeight: handleSliderResize(this)
    })
    handleSliderResize(this)
    this.resize = () => { handleSliderResize(this) }
    window.addEventListener('resize', this.resize)
  },

  beforeDestroy () {
    this.deregisterSlider(this.id)
    if (this.resize) { window.removeEventListener('resize', this.resize) }
  },

  methods: {
    ...mapActions({
      registerSlider: 'slider/registerSlider',
      deregisterSlider: 'slider/deregisterSlider',
      updateSlider: 'slider/updateSlider'
    }),
    getSlideStyles (slide) {
      const position = this.positions.indexOf(slide)
      const width = `${this.columnWidth}px`
      const transform = `translateX(${this.mapToPixels[position]}px)`
      const transition = this.animateSlots.includes(position) ? 'transform 250ms ease' : 'unset'
      const styles = { width, transform, transition }
      return styles
    },
    onClick (direction) {
      if (this.touchGesture) {
        this.touchGesture = ''
      }
      this.increment(direction)
    },
    increment (val) {
      const dir = this.stacked ? -1 * val : val
      const positions = CloneDeep(this.positions)
      if (dir === -1) {
        this.animateSlots = this.positions.map((el, i) => i).filter(i => i !== this.positions.length - 1)
        positions.push(positions.shift())
      } else if (dir === 1) {
        this.animateSlots = this.positions.map((el, i) => i).filter(i => i !== 0)
        positions.unshift(positions.pop())
      }
      this.updateSlider({
        sliderId: this.sliderId,
        panelPositions: positions
      })
    },
    onSwipe (e) {
      if (e.type === 'swipeleft') {
        this.touchGesture = 'force-left'
        this.increment(-1)
      }
      if (e.type === 'swiperight') {
        this.touchGesture = 'force-right'
        this.increment(1)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
// ///////////////////////////////////////////////////////////////////// General
.circular-slider {
  --slider-min-height: 100px;
  .panel-before,
  .panel-after {
    min-height: var(--slider-min-height);
  }
}

.panel-before,
.panel-after {
  // position: relative;
}

img {
  margin: 0;
}

// //////////////////////////////////////////////////////////////////// Controls
.panel-before {
 display: flex;
 flex-direction: column;
 justify-content: space-around;
}

.slide-selector {
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  width: 100%;
  @include small {
    justify-content: center;
  }
}

// ////////////////////////////////////////////////////////////////////// Slides
.panel-after {
  position: relative;
  width: 100%;
}

.slider-view {
  position: absolute;
  overflow: hidden;
  width: 100%;
  height: 100%;
}

.slider-row-container {
  width: 100%;
  height: 100%;
}

.slider-row {
  display: flex;
  flex-flow: row;
  align-items: flex-start;
  box-sizing: border-box;
  position: relative;
  left: 0px;
  width: 100%;
  height: 100%;
}

// ////////////////////////////////////////////////////////////// Slider Content
.slide {
  position: absolute;
  padding: 0.625rem;
  left: 0;
  top: 0;
  height: 100%;
}
</style>
