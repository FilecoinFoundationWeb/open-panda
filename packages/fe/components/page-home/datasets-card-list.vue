<template>
  <div class="card">
    <CardCutout>
      <!-- =========================================================== Image -->
      <img class="image" :src="getImageUrl(dataset)" />

      <!-- ======================================================== Metadata -->
      <div class="metadata-wrapper">

        <!-- /////////////////////////////////////////////////////// heading -->
        <div class="name" :title="dataset.name">
          {{ dataset.name }}
        </div>

        <!-- ///////////////////////////////////////////// [Metadata] Tier 1 -->
        <div class="metadata tier-1">
          <div
            v-for="(label, key) in labelsTier1"
            :key="key"
            class="metadata-row">
            <!-- .................................................... common -->
            <span class="label">{{ label }}</span>
            <span :class="['value', key]">
              <template v-if="!dataset[key]">-</template>
              <!-- ............................................... data size -->
              <template v-else-if="key === 'size'">
                {{ $formatBytes(dataset.size) }}
              </template>
              <!-- ............................................... locations -->
              <template v-else-if="key === 'locations'">
                <span
                  v-for="(item, index) in dataset[key]"
                  :key="index">
                  {{ $getFlagIcon(item.country_code) }}
                </span>
              </template>
              <!-- ......................................... everything else -->
              <template v-else-if="dataset[key]">
                {{ dataset[key] }}
              </template>
            </span>
          </div>
        </div>

        <!-- ///////////////////////////////////////////// [Metadata] Tier 2 -->
        <div class="metadata tier-2">
          <div
            v-for="(label, key) in labelsTier2"
            :key="key"
            class="metadata-row">
            <!-- .................................................... common -->
            <span class="label">{{ label }}</span>
            <span :class="['value', key]">
              <template v-if="!dataset[key]">-</template>
              <!-- .............................................. total size -->
              <template v-else-if="key === 'total'">
                {{ $formatBytes(dataset.total) }}
              </template>
              <!-- ......................................... file extensions -->
              <template v-else-if="key === 'fileExtensions'">
                <span
                  v-for="(item, index) in dataset[key]"
                  :key="index">
                  <span v-if="index < 3" class="file-item">
                    {{ item }}
                  </span>
                </span>
              </template>
              <!-- ......................................... everything else -->
              <template v-else-if="dataset[key]">
                {{ dataset[key] }}
              </template>
            </span>
          </div>
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
  name: 'DatasetsCardList',

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

  computed: {
    labelsTier1 () {
      return this.labels.tier1
    },
    labelsTier2 () {
      return this.labels.tier2
    }
  },

  methods: {
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

:deep(.card-contents) {
  padding: toRem(25);
  display: flex;
  align-items: center;
}

// /////////////////////////////////////////////////////////////////////// Image
.image {
  background-color: $tasman;
  height: toRem(100);
  width: toRem(100);
  border-radius: toRem(2);
  object-fit: cover;
  flex-shrink: 0;
}

.name {
  @include fontSize_20;
  margin-bottom: toRem(10);
  line-height: leading(30, 20);
}

// //////////////////////////////////////////////////////////////////// Metadata
.metadata-wrapper {
  flex: 1;
  padding-left: toRem(60);
  padding-right: toRem(20);
}

.metadata,
.metadata-row {
  display: flex;
  flex-direction: row;
  align-items: center;
}

.metadata {
  &.tier-1 {
    margin-bottom: toRem(10);
    .label,
    .value {
      flex: 1;
    }
  }
  .label {
    @include caption;
    margin-right: toRem(12);
    white-space: nowrap;
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
  &:not(:last-child) {
    margin-right: 1rem;
  }
}

.button {
  margin-top: auto;
}
</style>
