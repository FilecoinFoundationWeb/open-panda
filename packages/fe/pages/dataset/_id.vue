<template>
  <div class="page page-singular">

    <!-- ============================================================== Hero -->
    <section id="section-hero">

      <div class="grid">
        <div class="col-12">
          <div :class="['back-button-container', { 'no-previous-search': !returnToSearchButton }]">
            <Button
              v-if="returnToSearchButton"
              :button="returnToSearchButton"
              class="back-button"
              @clicked="returnToSearch" />
          </div>
        </div>

        <div
          class="col-3_mi-4_ti-3"
          data-push-left="off-1_sm-0_mi-0"
          data-push-right="off-0_mi-9">
          <div class="image-wrapper">
            <div class="header-image">
              <div
                class="background-image"
                :style="headerImage">
              </div>
            </div>
          </div>
        </div>

        <div
          class="col-6_lg-7_md-8_sm-9_mi-12"
          data-push-right="off-2_lg-1_md-0_mi-0">
          <div class="header-matter">

            <!-- <div
              v-if="progressMessage"
              class="message-banner"
              v-html="progressMessage">
            </div> -->

            <h1 class="heading">
              {{ heading }}
            </h1>

            <div class="tag-list">
              <div
                v-for="tag in tags"
                :key="tag"
                class="tag">
                {{ tag }}
              </div>
            </div>

          </div>
        </div>

      </div>
    </section>

    <!-- ============================================================= INTRO -->
    <section id="section-intro">

      <div class="grid-noBottom-noGutter">
        <div class="col-12">
          <TextBlock class="text-block-mobile" :block="descriptionBlock" />
        </div>
      </div>

      <Accordion
        v-slot="{ active }">
        <AccordionSection
          :active="active">

          <AccordionHeader :disabled="!mobile">
            <div class="accordion-header-mobile">
              <div class="grid-noBottom-noGutter">
                <div class="col">
                  <div
                    class="heading"
                    tabindex="0">
                    About this dataset
                  </div>
                </div>
              </div>
            </div>
          </AccordionHeader>

          <AccordionContent :disabled="!mobile">
            <section id="accordion-contents">
              <div class="grid">

                <div class="col-6_md-6_sm-12" data-push-left="off-1_md-0">

                  <TextBlock class="text-block-desktop" :block="descriptionBlock" />

                  <div class="stats-card-list">
                    <CardCutout
                      v-for="(stat, i) in stats"
                      :key="stat.label"
                      :top-tab="i === 0"
                      :bottom-tab="i === stats.length - 1"
                      class="stat-card">
                      <div class="stat-inner-wrapper">
                        <div :class="['icon', stat.icon]"></div>
                        <div>
                          <h3 class="heading">
                            {{ stat.data ? stat.data : '-' }}
                          </h3>
                          <div class="label">
                            {{ stat.label }}
                          </div>
                        </div>
                      </div>
                    </CardCutout>
                  </div>

                </div>

                <div class="col-4_md-5_sm-12" data-push-left="off-1_sm-0">
                  <div class="dataset-info-card">
                    <CardCutout>
                      <div class="info-card">

                        <div class="resources">
                          <h6 class="heading">
                            Resources
                          </h6>
                          <div class="links">
                            <a
                              v-for="(link, i) in resources"
                              :key="`resource-${i}`"
                              :href="link"
                              target="_blank"
                              class="link">
                              {{ link }}
                            </a>
                          </div>
                        </div>

                        <div class="information">
                          <h6 class="heading">
                            Information
                          </h6>
                          <div class="info-items">
                            <div
                              v-for="(item, i) in infoItems"
                              :key="`info-${i}`"
                              class="row">
                              <div class="label">
                                {{ item.label }}
                              </div>
                              <div
                                v-if="Array.isArray(item.value)"
                                :class="['value', 'list', $slugify(item.label)]">
                                <template v-if="item.label === 'Locations'">
                                  <template v-for="location in item.value">
                                    {{ $getFlagIcon(location.country_code) }}
                                  </template>
                                </template>
                                <template v-else-if="item.value.length">
                                  <div
                                    v-for="(value, j) in item.value"
                                    :key="`${value}-${j}`"
                                    class="list-item">
                                    <template v-if="item.label === 'Download'">
                                      <a
                                        :href="value.url"
                                        target="_blank"
                                        class="link">
                                        {{ value.label }}
                                      </a>
                                    </template>
                                    <template v-else>
                                      {{ value }}
                                    </template>
                                  </div>
                                </template>
                                <template v-else>
                                  <div>-</div>
                                </template>
                              </div>
                              <div
                                v-else
                                :class="['value', $slugify(item.label)]">
                                {{ item.value ? item.value : '-' }}
                              </div>
                            </div>
                          </div>
                        </div>

                      </div>
                    </CardCutout>
                  </div>
                </div>

              </div>
            </section>
          </AccordionContent>

        </AccordionSection>
      </Accordion>
    </section>

    <!-- ======================================================= SP EXPLORER -->
    <section id="section-explorer">
      <div :class="`grid${mobile ? '-noGutter' : ''}`">
        <div
          class="col-10_xlg-12_md-10_sm-12"
          data-push-left="off-1_xlg-0_md-1_sm-0"
          data-push-right="off-1_xlg-0_md-1_sm-0">

          <CIDTable :dataset-metadata="datasetMetadata" />

        </div>
      </div>
    </section>

  </div>
</template>

<script>
// ====================================================================== Import
import { mapGetters, mapActions } from 'vuex'

import Button from '@/components/buttons/button'
import TextBlock from '@/components/blocks/text-block'
import CardCutout from '@/components/card-cutout'
import CIDTable from '@/components/cid-table'
import Accordion from '@/components/accordion/accordion'
import AccordionSection from '@/components/accordion/accordion-section'
import AccordionHeader from '@/components/accordion/accordion-header'
import AccordionContent from '@/components/accordion/accordion-content'

import datasetList from '@/content/data/dataset-list.json'

// =================================================================== Functions
const handlePageResize = (instance) => {
  if (window.matchMedia('(max-width: 53.125rem)').matches) {
    if (!instance.mobile) {
      instance.mobile = true
    }
  } else {
    if (instance.mobile) {
      instance.mobile = false
    }
  }
}

// ====================================================================== Export
export default {
  name: 'SingularPage',

  components: {
    Button,
    TextBlock,
    CardCutout,
    CIDTable,
    Accordion,
    AccordionSection,
    AccordionHeader,
    AccordionContent
  },

  async asyncData ({ store, route, error }) {
    store.dispatch('cid/setLoadingStatus', { status: true })
    await store.dispatch('general/getBaseData', { key: 'datasetList', data: datasetList })
    const datasetExists = await store.dispatch('dataset/getDataset', { datasetList, route })
    if (!datasetExists) { return error('Dataset could not be found.') }
    const datasetMetadata = await import(`@/static/datasets/${route.params.id}/metadata.json`)
    return { datasetExists, datasetMetadata: datasetMetadata.default }
  },

  data () {
    const id = this.$route.params.id
    return {
      id,
      resize: false,
      mobile: false
    }
  },

  head () {
    const dataset = this.dataset
    const siteUrl = this.siteContent.general.og.url
    return this.$compileSeo(this.$getSeo(this.id, null, {
      title: `${dataset.name} - Dataset on Open Panda`,
      description: dataset.description_short,
      og_site_name: `${dataset.name} - Dataset on Open Panda`,
      og_url: `${siteUrl}/dataset/${dataset.slug}`,
      og_image: `/images/datasets/${dataset.slug}.jpg`
    }))
  },

  computed: {
    ...mapGetters({
      siteContent: 'general/siteContent',
      dataset: 'dataset/dataset',
      cidList: 'cid/cidList',
      returnToSearchButton: 'datasets/returnToSearchButton'
    }),
    slug () {
      return this.dataset.slug
    },
    // progressMessage () {
    //   return '<b>In progress -</b> This dataset is currently being onboarded to the network and is only partially available. All data will be fully available soon.'
    // },
    headerImage () {
      let imgUrl = this.dataset.slug
      if (this.dataset.slug.includes('common-crawl')) {
        imgUrl = 'common-crawl'
      }
      if (this.dataset.slug.includes('sloan-digital-sky-survey-release')) {
        imgUrl = 'sloan-digital-sky-survey-release'
      }
      return { 'background-image': `url('/images/datasets/${imgUrl}.jpg')` }
    },
    heading () {
      return this.dataset.name
    },
    tags () {
      return this.dataset.categories
    },
    descriptionBlock () {
      return {
        label: this.dataset.description_short,
        description: this.dataset.description
      }
    },
    // dateCreated () {
    //   return this.dataset.createdAt ? this.$moment(this.dataset.createdAt).format('YYYY') : '-'
    // },
    datasetSize () {
      return this.dataset.size ? this.$formatBytes(this.dataset.size) : '-'
    },
    totalDataOnNetwork () {
      return this.dataset.total ? this.$formatBytes(this.dataset.total) : '-'
    },
    storageProviderCount () {
      return this.dataset.storage
    },
    stats () {
      const stats = [
        { icon: 'bar-graph', data: this.datasetSize, label: 'Dataset Size' },
        { icon: 'pie-chart', data: this.totalDataOnNetwork, label: 'Total Data on Network' },
        { icon: 'profile', data: this.storageProviderCount, label: 'Storage Providers' }
      ]
      return stats
    },
    locations () {
      return this.dataset.locations
    },
    dataStored () {
      return this.dataset.data_stored
    },
    resources () {
      return this.dataset.resources
    },
    // fileExtensions () {
    //   return this.dataset.file_extensions
    // },
    infoItems () {
      return [
        { label: 'Author', value: this.dataset.authors },
        { label: 'Date Created', value: this.dataset.createdAt },
        { label: 'Funders', value: this.dataset.funders },
        { label: 'File Types', value: this.dataset.fileExtensions },
        { label: 'Data Stored', value: this.dataStored },
        { label: 'Storage Providers', value: this.storageProviderCount },
        { label: 'Locations', value: this.locations },
        { label: 'Available Until', value: this.dataset.availableUntil },
        { label: 'Download', value: this.dataset.downloadLinks }
      ]
    }
  },

  watch: {
    '$route' () {
      this.$nextTick(() => {
        console.log(this.$route)
        this.getCidList({
          route: this.$route,
          page: parseInt(this.$route.query.page) || 1
        })
      })
    },
    cidList () {
      this.stopLoading()
    }
  },

  async mounted () {
    handlePageResize(this)
    this.resize = () => { handlePageResize(this) }
    window.addEventListener('resize', this.resize)
    await this.getCidList({
      route: this.$route,
      page: 1
    })
  },

  beforeDestroy () {
    if (this.resize) { window.removeEventListener('resize', this.resize) }
  },

  methods: {
    ...mapActions({
      getCidList: 'cid/getCidList',
      setLoadingStatus: 'cid/setLoadingStatus'
    }),
    stopLoading () {
      this.$nextTick(() => {
        if (typeof this.cidList !== 'boolean') {
          this.setLoadingStatus({ status: false })
        }
      })
    },
    returnToSearch () {
      this.$router.go(-1)
    }
  }
}
</script>

<style lang="scss" scoped>
// ///////////////////////////////////////////////////////////////////// SECTION
// ---------------------------------------------------------------------[HEADER]
.back-button-container {
  padding-bottom: 5rem;
  &.no-previous-search {
    padding-bottom: 7.375rem;
    @include mini {
      padding-bottom: 0;
    }
  }
  @include mini {
    padding-bottom: 0;
  }
}

.back-button {
  flex-direction: row-reverse;
  @include mini {
    position: absolute;
    transform: translateY(-3rem);
  }
  @include tiny {
    padding: 0.4375rem 1rem;
    transform: translate(-0.5rem, -3rem);
  }
  :deep(.arrow-icon) {
    margin-left: 0;
    margin-right: toRem(15);
    transform: translateX(2px) rotate(180deg) scale(0.85) !important;
  }
  &:hover {
    :deep(.arrow-icon) {
      transform: translateX(-4px) rotate(180deg) scale(0.85) !important;
    }
  }
}

.image-wrapper {
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
}

.header-image {
  position: relative;
  width: calc(100% - 3.25rem);
  max-width: toRem(270);
  @include large {
    width: calc(100% - 1.625rem);
  }
  @include medium {
    width: calc(100% - 1rem);
  }
  @include small {
    width: 100%;
  }
  &:before {
    content: '';
    display: block;
    padding-top: 100%;
  }
}

.background-image {
  position: absolute;
  top: 0;
  background-color: $tasman;
  left: 0;
  bottom: 0;
  right: 0;
  height: 100%;
  border-radius: 50%;
  border-bottom-right-radius: 0.125rem;
  background-repeat: no-repeat;
  background-size: cover;
  background-position: center;
  @include mini {
    border-bottom-left-radius: 0.125rem;
    border-bottom-right-radius: 50%;
  }
}

.header-matter {
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  height: 100%;
  @include small {
    margin-left: 1.5rem;
  }
  @include mini {
    margin-left: 0;
  }
  .heading {
    @include h2;
    padding: 1.4375rem 0;
    @include small {
      padding: 0.5625rem 0;
    }
    @include mini {
      padding-top: 0;
    }
  }
}

.message-banner {
  @include fontWeight_Regular;
  font-family: $font_Primary;
  @include fontSize_14;
  line-height: leading(21, 14);
  color: white;
  padding: 0.6875rem 2rem;
  margin-right: toRem(72);
  border-radius: toRem(40);
  border-bottom-left-radius: 0.125rem;
  background-color: $gray900;
  @include large {
    margin-right: 2rem;
  }
  @include small {
    margin-right: 0;
  }
  @include mini {
    margin-right: 0;
    margin-bottom: 0.5625rem;
  }
}

.tag-list {
  display: flex;
  .tag {
    @include p2;
    @include fontWeight_Medium;
    padding: 0.4375rem 0.9375rem;
    border: solid 1px $capeCod;
    border-radius: 1.25rem;
    &:not(:last-child) {
      margin-right: 0.3125rem;
    }
  }
}

// ///////////////////////////////////////////////////////////////////// SECTION
// ----------------------------------------------------------------------[INTRO]
#section-intro {
  padding-bottom: 5.625rem;
  border-bottom: solid 1px #DDDFE3;
  @include small {
    padding-bottom: 2rem;
  }
}

:deep(.text-block) {
  padding-top: 1.625rem;
  margin-bottom: 4rem;
  @include small {
    padding-top: 0;
  }
  &.text-block-desktop {
    @include small {
      margin-bottom: 1.25rem;
      .label {
        display: none;
      }
    }
  }
  &.text-block-mobile {
    display: none;
    margin-top: 0.5rem;
    margin-bottom: 1.5rem;
    @include small {
      display: block;
    }
    .description {
      display: none;
    }
  }
  .description {
    h5 {
      margin-bottom: 1rem;
    }
    p {
      @include p2;
    }
  }
  .text-wrapper {
    margin-bottom: 0;
  }
}

.accordion-header-mobile {
  display: none;
  @include small {
    display: block;
    .heading {
      cursor: pointer;
      @include fontWeight_Medium;
      font-family: $font_Primary;
      @include fontSize_20;
      line-height: leading(36, 20);
      &:after {
        content: '';
        display: inline-block;
        position: relative;
        margin-left: 0.8125rem;
        width: 11px;
        height: 7px;
        top: -2px;
        transform: rotate(180deg);
        transition: transform 250ms ease;
        background-repeat: no-repeat;
        background-size: contain;
        background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg width='12' height='8' viewBox='0 0 12 8' fill='none' xmlns='http://www.w3.org/2000/svg'%3e%3cpath d='M11 6.5L6 1.5L1 6.5' stroke='%231B1F12' stroke-width='2' stroke-linecap='round'/%3e%3c/svg%3e ");
      }
    }
  }
}

:deep(.accordion-section) {
  &.open {
    .heading {
      &:after {
        transform: rotate(0deg);
      }
    }
  }
}

:deep(.accordion-content) {
  transition: height 250ms ease-in-out;
}

#accordion-contents {
  padding: 2.625rem 0;
  @include medium {
    padding-bottom: 1rem;
  }
  @include small {
    padding-top: 0.75rem;
  }
  [class~=col],
  [class*=col-],
  [class*=col_] {
    @include small {
      padding: 0 0 1rem;
    }
  }
}

.stats-card-list {
  display: flex;
  justify-content: space-between;
  width: 100%;
  @include small {
    margin-bottom: 0.5rem;
  }
}

.stat-card {
  padding: 1.3125rem;
  width: calc(33.333% - 0.9375rem);
  @include medium {
    padding: 0.75rem 0.625rem;
    width: calc(33.333% - 0.458333rem);
  }
  &:not(:last-child) {
    margin-right: 1.375rem;
    @include medium {
      margin-right: 0.6875rem;
    }
  }
  .icon {
    width: 1.5625rem;
    height: 1.5625rem;
    margin-bottom: 1.875rem;
    background-repeat: no-repeat;
    background-size: 100%;
    @include medium {
      width: 1rem;
      height: 1rem;
    }
    &.bar-graph {
      background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg width='25' height='25' viewBox='0 0 25 25' fill='none' xmlns='http://www.w3.org/2000/svg'%3e%3cpath d='M5.35714 17.8571H1.78571V23.2143H5.35714V17.8571ZM14.2857 10.7143H10.7143V23.2143H14.2857V10.7143ZM23.2143 1.78571V23.2143H19.6429V1.78571H23.2143ZM19.6429 0C19.1693 0 18.7151 0.188137 18.3802 0.523023C18.0453 0.85791 17.8571 1.31211 17.8571 1.78571V23.2143C17.8571 23.6879 18.0453 24.1421 18.3802 24.477C18.7151 24.8119 19.1693 25 19.6429 25H23.2143C23.6879 25 24.1421 24.8119 24.477 24.477C24.8119 24.1421 25 23.6879 25 23.2143V1.78571C25 1.31211 24.8119 0.85791 24.477 0.523023C24.1421 0.188137 23.6879 0 23.2143 0H19.6429ZM8.92857 10.7143C8.92857 10.2407 9.11671 9.78648 9.4516 9.4516C9.78648 9.11671 10.2407 8.92857 10.7143 8.92857H14.2857C14.7593 8.92857 15.2135 9.11671 15.5484 9.4516C15.8833 9.78648 16.0714 10.2407 16.0714 10.7143V23.2143C16.0714 23.6879 15.8833 24.1421 15.5484 24.477C15.2135 24.8119 14.7593 25 14.2857 25H10.7143C10.2407 25 9.78648 24.8119 9.4516 24.477C9.11671 24.1421 8.92857 23.6879 8.92857 23.2143V10.7143ZM0 17.8571C0 17.3835 0.188137 16.9293 0.523023 16.5945C0.85791 16.2596 1.31211 16.0714 1.78571 16.0714H5.35714C5.83074 16.0714 6.28495 16.2596 6.61983 16.5945C6.95472 16.9293 7.14286 17.3835 7.14286 17.8571V23.2143C7.14286 23.6879 6.95472 24.1421 6.61983 24.477C6.28495 24.8119 5.83074 25 5.35714 25H1.78571C1.31211 25 0.85791 24.8119 0.523023 24.477C0.188137 24.1421 0 23.6879 0 23.2143V17.8571Z' fill='%234B6256'/%3e%3c/svg%3e ");
    }
    &.pie-chart {
      background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg width='25' height='25' viewBox='0 0 25 25' fill='none' xmlns='http://www.w3.org/2000/svg'%3e%3cpath d='M11.7188 1.59063C9.69371 1.73574 7.74902 2.44163 6.1024 3.62927C4.45577 4.8169 3.1722 6.4394 2.39537 8.31514C1.61854 10.1909 1.37912 12.2458 1.70392 14.2499C2.02871 16.254 2.90489 18.1281 4.23438 19.6625L11.7188 12.1766V1.59063ZM13.2812 1.59063V11.7188H23.4094C23.2211 9.09486 22.0936 6.62669 20.2334 4.76655C18.3733 2.90641 15.9051 1.77889 13.2812 1.59063ZM23.4094 13.2812H12.8234L5.33906 20.7656C6.87347 22.0947 8.74747 22.9705 10.7513 23.295C12.7552 23.6195 14.8098 23.38 16.6853 22.6032C18.5607 21.8264 20.183 20.5431 21.3706 18.8967C22.5581 17.2504 23.264 15.306 23.4094 13.2812ZM0 12.5C0 9.18479 1.31696 6.00537 3.66117 3.66117C6.00537 1.31696 9.18479 0 12.5 0C15.8152 0 18.9946 1.31696 21.3388 3.66117C23.683 6.00537 25 9.18479 25 12.5C25 15.8152 23.683 18.9946 21.3388 21.3388C18.9946 23.683 15.8152 25 12.5 25C9.18479 25 6.00537 23.683 3.66117 21.3388C1.31696 18.9946 0 15.8152 0 12.5Z' fill='%234B6256'/%3e%3c/svg%3e ");
    }
    &.profile {
      background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg width='25' height='25' viewBox='0 0 25 25' fill='none' xmlns='http://www.w3.org/2000/svg'%3e%3cpath d='M12.5 12.5C14.1576 12.5 15.7473 11.8415 16.9194 10.6694C18.0915 9.49731 18.75 7.9076 18.75 6.25C18.75 4.5924 18.0915 3.00269 16.9194 1.83058C15.7473 0.65848 14.1576 0 12.5 0C10.8424 0 9.25268 0.65848 8.08058 1.83058C6.90848 3.00269 6.25 4.5924 6.25 6.25C6.25 7.9076 6.90848 9.49731 8.08058 10.6694C9.25268 11.8415 10.8424 12.5 12.5 12.5ZM16.6667 6.25C16.6667 7.35507 16.2277 8.41488 15.4463 9.19628C14.6649 9.97768 13.6051 10.4167 12.5 10.4167C11.3949 10.4167 10.3351 9.97768 9.55372 9.19628C8.77232 8.41488 8.33333 7.35507 8.33333 6.25C8.33333 5.14493 8.77232 4.08512 9.55372 3.30372C10.3351 2.52232 11.3949 2.08333 12.5 2.08333C13.6051 2.08333 14.6649 2.52232 15.4463 3.30372C16.2277 4.08512 16.6667 5.14493 16.6667 6.25ZM25 22.9167C25 25 22.9167 25 22.9167 25H2.08333C2.08333 25 0 25 0 22.9167C0 20.8333 2.08333 14.5833 12.5 14.5833C22.9167 14.5833 25 20.8333 25 22.9167ZM22.9167 22.9083C22.9146 22.3958 22.5958 20.8542 21.1833 19.4417C19.825 18.0833 17.2687 16.6667 12.5 16.6667C7.72917 16.6667 5.175 18.0833 3.81667 19.4417C2.40417 20.8542 2.0875 22.3958 2.08333 22.9083H22.9167Z' fill='%234B6256'/%3e%3c/svg%3e ");
    }
  }
  .heading {
    font-size: toRem(30);
    line-height: leading(45, 30);
    @include large {
      @include fontSize_20;
    }
    @include medium {
      @include fontSize_16;
      line-height: leading(26, 16);
    }
  }
  .label {
    @include p2;
    white-space: nowrap;
    letter-spacing: 0;
    @include customMaxMQ ($containerWidth + 4rem) {
      white-space: normal;
    }
    @include medium {
      font-size: 0.75rem;
      line-height: leading(14, 12);
      white-space: normal;
    }
    @include tiny {
      max-width: 5rem;
    }
  }
  :deep(.card-contents) {
    height: 100%;
  }
}

.stat-inner-wrapper {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100%;
}

.info-card {
  padding: 1.625rem 0;
}

.info-items {
  display: flex;
  flex-direction: column;
  .row {
    display: flex;
    flex-direction: row;
  }
}

.resources {
  padding: 0 1.5rem;
  padding-bottom: 1.375rem;
  border-bottom: solid 1px #DDDFE3;
  .heading {
    margin-bottom: 0.75rem;
  }
  .links {
    display: flex;
    flex-direction: column;
  }
}

.link {
    font-family: $font_Primary;
    @include fontSize_16;
    @include fontWeight_Medium;
    line-height: leading(25, 16);
    color: #001AFF;
    overflow-wrap: break-word;
    overflow: hidden;
    display: -webkit-box;
    -webkit-box-flex: 1;
    -webkit-line-clamp: 1;
    -webkit-box-orient: vertical;
    &:hover {
      text-decoration: underline;
    }
    &:not(:last-child) {
      margin-bottom: 0.5rem;
    }
  }

.information {
  padding: 0 1.5rem;
  padding-top: 0.875rem;
  .heading,
  .row {
    margin-bottom: 1rem;
  }
  .row {
    width: 100%;
  }
  .label,
  .value {
    @include p2;
  }
  .label {
    width: 40%;
    flex-shrink: 0;
  }
  .value {
    @include fontWeight_Medium;
    margin-left: 1.5rem;
    &.list {
      display: flex;
      flex-direction: column;
      flex-wrap: wrap;
      &.file-types {
        flex-direction: row;
        .list-item {
          @include fileItem;
          margin-bottom: 0.5625rem;
          &:not(:last-child) {
            margin-right: 0.5625rem;
          }
        }
      }
    }
  }
}

// ///////////////////////////////////////////////////////////////////// SECTION
// ---------------------------------------------------------------[CID EXPLORER]
#section-explorer {
  padding-top: 2.25rem;
}
</style>
