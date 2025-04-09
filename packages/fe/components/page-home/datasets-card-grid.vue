<template>
  <div class="card">
    <CardCutout :background-image="getImageUrl(dataset)">

      <!-- =========================================================== Image -->
      <div class="image-wrapper">
        <div
          class="image"
          :style="{ 'background-image': `url('${getImageUrl(dataset)}')` }">
        </div>
      </div>

      <!-- ========================================================= Heading -->
      <div class="heading" :title="dataset.name">
        <div class="name">
          {{ dataset.name }}
        </div>
      </div>

      <!-- =============================================== [Metadata] Tier 1 -->
      <div class="metadata tier-1">
        <div
          v-for="(label, key) in labelsTier1"
          :key="key"
          class="metadata-row">
          <!-- ...................................................... common -->
          <span class="label">{{ label }}</span>
          <span :class="['value', key]">
            <template v-if="!dataset[key]">-</template>
            <!-- ................................................. data size -->
            <template v-else-if="key === 'size' || key === 'total'">
              {{ $formatBytes(dataset[key]) }}
            </template>
            <!-- ........................................... everything else -->
            <template v-else-if="dataset[key]">
              {{ dataset[key] }}
            </template>
          </span>
        </div>
      </div>

      <!-- =============================================== [Metadata] Tier 2 -->
      <div class="metadata tier-2">
        <!-- ............................................... file extensions -->
        <div class="metadata-entry">
          <span class="label bold">
            {{ labelsTier2.fileExtensions }}
          </span>
          <span v-if="!fileExtData" class="value">-</span>
          <template v-for="(item, index) in fileExtData">
            <span
              v-if="index < fileExtDisplayLimit"
              :key="index"
              class="file-item">
              {{ item }}
            </span>
          </template>
          <button
            v-if="fileExtData.length > 1"
            class="file-item"
            @click="toggleFileExtDisplayLimit()">
            {{ fileExtShowMore ? `-` : `+` }} {{ fileExtData.length - 1 }}
          </button>
        </div>

        <!-- ..................................................... locations -->
        <div class="metadata-entry">
          <span class="label bold">
            {{ labelsTier2.locations }}
          </span>
          <span v-if="!locationsData" class="value">-</span>
          <template v-for="(item, index) in locationsData">
            <span v-if="index < 6" :key="index">
              {{ $getFlagIcon(item.country_code) }}
            </span>
          </template>
        </div>
      </div>

      <!-- ========================================================== Button -->
      <Button
        :button="{
          type: 'solid',
          url: `/dataset/${dataset.slug}`,
          text: 'View dataset',
          icon: 'arrow'
        }">
      </Button>
    </CardCutout>
  </div>
</template>

<script>
// ===================================================================== Imports
import Button from '@/components/buttons/button'
import CardCutout from '@/components/card-cutout'

// ====================================================================== Export
export default {
  name: 'DatasetsCardGrid',

  components: {
    Button,
    CardCutout
  },

  props: {
    dataset: {
      type: Object,
      required: true
    },
    labels: {
      type: Object,
      required: true
    }
  },

  data () {
    return {
      fileExtDisplayLimit: 1,
      fileExtShowMore: false
    }
  },

  computed: {
    labelsTier1 () {
      return this.labels.tier1
    },
    labelsTier2 () {
      return this.labels.tier2
    },
    fileExtData () {
      return this.dataset.fileExtensions
    },
    locationsData () {
      return this.dataset.locations
    }
  },

  methods: {
    toggleFileExtDisplayLimit () {
      this.fileExtDisplayLimit = this.fileExtShowMore ? 1 : this.fileExtData.length
      this.fileExtShowMore = !this.fileExtShowMore
    },
    getImageUrl (dataset) {
      let slug = dataset.slug
      if (slug.includes('common-crawl')) {
        slug = 'common-crawl'
      }
      if (slug.includes('sloan-digital-sky-survey-release')) {
        slug = 'sloan-digital-sky-survey-release'
      }
      return `/images/datasets/${slug}.jpg`
    }
  }
}
</script>

<style lang="scss" scoped>
// ///////////////////////////////////////////////////////////////////// General
.card {
  margin-bottom: toRem(10);
}

:deep(.card-cutout-wrapper) {
  display: flex;
  flex-direction: column;
}

:deep(.card-contents) {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.heading,
.metadata {
  padding: toRem(20);
}

// /////////////////////////////////////////////////////////////////////// Image
.image-wrapper {
  height: toRem(113);
  overflow: hidden;
  border-top-right-radius: toRem(10);
}

.image {
  background-color: $tasman;
  height: toRem(122);
  object-fit: cover;
  background-repeat: no-repeat;
  background-size: cover;
  background-position: center center;
  transform: translateY(-9px);
  @include medium {
    height: toRem(118);
    transform: translateY(-4.5px);
  }
}

// ///////////////////////////////////////////////////////////////////// Heading
.heading {
  min-height: toRem(116.5);
  .name {
    line-height: leading(26, 17);
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
}

// //////////////////////////////////////////////////////////////////// Metadata
.metadata {
  border-top: 1px solid $athensGray;
  &.tier-1 {
    .label,
    .value {
      flex: 1;
    }
  }
  .label {
    @include caption;
    margin-right: toRem(12);
    &.bold {
      @include fontWeight_Medium;
    }
  }
  .value {
    @include caption;
    @include fontWeight_Bold;
  }
}

.metadata-row {
  display: flex;
  flex-direction: row;
}

.metadata-entry {
  margin-bottom: toRem(12);
}

.label {
  margin-right: 1rem;
}

.file-item {
  margin-bottom: 0.5625rem;
}

.button {
  align-self: flex-end;
  margin-top: auto;
  margin-right: toRem(20);
  margin-bottom: toRem(20);
  padding: toRem(10) toRem(20);
}
</style>
