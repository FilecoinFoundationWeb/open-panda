<template>
  <div class="block-builder">

    <template v-for="section in sections">
      <section
        v-if="!section.hide"
        :id="section.slug"
        :key="section.id"
        :class="['sectional', section.id]">
        <!-- ============================================ [Section] Off Grid -->
        <div
          v-if="section.off_grid"
          :id="`${section.id}-background`"
          class="section-background">

          <template v-for="(component, i) in section.off_grid">
            <component
              :is="component.name"
              :key="`${section.id}-background-${i}`"
              v-bind="component.props" />
          </template>

        </div>

        <!-- ================================================ [Section] Grid -->
        <div :class="[getGridClasses(section.grid), section.classNames]">
          <template v-for="(block, blockId) in section">
            <div
              v-if="blockAllowed(blockId)"
              :key="blockId"
              :class="[getColumnCount(block)]"
              :data-block-id="blockId"
              :data-push-left="getColumnPushCount(block, 'left')"
              :data-push-right="getColumnPushCount(block, 'right')">
              <div class="column-content">

                <!-- ======================================== [Block] Custom -->
                <template v-if="block.type === 'custom'">
                  <component
                    :is="component.name"
                    v-for="(component, componentKey) in block.customizations"
                    :key="componentKey"
                    v-bind="component.props" />
                </template>

                <!-- ======================================= [Block] Dynamic -->
                <component
                  :is="getComponentName(block)"
                  v-else-if="block.type !== 'sectional'"
                  v-bind="{ block }" />

                <!-- ===================== Recursive Sectional/Block imports -->
                <BlockBuilder
                  v-else
                  :sections="block.sections" />

              </div>
            </div>
          </template>
        </div>
      </section>
    </template>

  </div>
</template>

<script>
// ===================================================================== Imports
import TextBlock from '@/components/blocks/text-block'
import ImageBlock from '@/components/blocks/image-block'
import MarkdownBlock from '@/components/blocks/markdown-block'
import CategorySliderBlock from '@/components/blocks/category-slider-block'
import CategoryTicker from '@/components/category-ticker'
import CardListBlock from '@/components/blocks/card-list-block'
import BlockBuilder from '@/components/block-builder'

// ====================================================================== Export
export default {
  name: 'BlockBuilder',

  components: {
    TextBlock,
    ImageBlock,
    BlockBuilder,
    MarkdownBlock,
    CategorySliderBlock,
    CategoryTicker,
    CardListBlock
  },

  props: {
    sections: {
      type: Object,
      required: true
    }
  },

  methods: {
    getGridClasses (blockGrid) {
      const classList = ['grid']
      if (typeof blockGrid === 'object' && Array.isArray(blockGrid) && blockGrid.length > 0) {
        blockGrid.forEach(className => classList.push(`-${className}`))
      }
      return classList.join('')
    },
    blockAllowed (blockId) {
      return !['grid', 'classNames', 'off_grid', 'slug', 'hide', 'id'].includes(blockId)
    },
    getColumnCount (block) {
      return block.cols.num
    },
    getColumnPushCount (block, direction) {
      return block.cols.hasOwnProperty(`push_${direction}`) ? block.cols[`push_${direction}`] : undefined
    },
    getComponentName (block) {
      const type = block.type
      let name = ''
      switch (type) {
        case 'text_block' : name = 'TextBlock'; break
        case 'image_block' : name = 'ImageBlock'; break
        case 'markdown_block': name = 'MarkdownBlock'; break
        case 'category_slider_block': name = 'CategorySliderBlock'; break
        case 'card_list_block': name = 'CardListBlock'; break
        case 'custom' : name = block.component; break
      }
      return name
    }
  }
}
</script>
