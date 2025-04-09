<template>
  <div :class="['card-list-block', `type__${cardType}`]">
    <div :class="['card-list', direction]">

      <template v-for="(card, i) in cards">
        <component
          :is="cardComponent"
          :key="`card-${i}`"
          :index="i + 1"
          :card="card"
          class="card" />
      </template>

    </div>
  </div>
</template>

<script>
// ====================================================================== Import
import FAQCard from '@/components/faq-card'

// ====================================================================== Export
export default {
  name: 'CardListBlock',

  components: {
    FAQCard
  },

  props: {
    block: {
      type: Object,
      required: true,
      default: () => ({})
    }
  },

  computed: {
    cardType () {
      return this.block.card_type
    },
    direction () {
      return ['row', 'column', 'row-reverse', 'column-reverse'].includes(this.block.direction) ? this.block.direction : 'row'
    },
    cardComponent () {
      switch (this.cardType) {
        case 'faq': return 'FAQCard'
        default : return 'FAQCard'
      }
    },
    cards () {
      return this.block.cards
    }
  }
}
</script>

<style lang="scss" scoped>
// ///////////////////////////////////////////////////////////////////// General
.card-list {
  display: flex;
  &.row {
    flex-direction: row;
  }
  &.column {
    flex-direction: column;
  }
  &.row-reverse {
    flex-direction: row-reverse;
  }
  &.column-reverse {
    flex-direction: column-reverse;
  }
}
</style>
