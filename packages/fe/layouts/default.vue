<template>
  <div class="master-container">

    <!-- <Toaster /> -->

    <SiteHeader />

    <nuxt />

    <SiteFooter />

  </div>
</template>

<script>
// ===================================================================== Imports
import SiteHeader from '@/components/site-header'
import SiteFooter from '@/components/site-footer'
// import Toaster from '@/modules/toaster/components/toaster'

// ====================================================================== Export
export default {
  name: 'LayoutDefault',

  components: {
    SiteHeader,
    SiteFooter
    // Toaster
  },

  data () {
    return {
      socket: false,
      networkErrorToastId: false
    }
  },

  async fetch () {
    // await this.$store.dispatch('datasets/getFiltersAndTypeahead')
    await this.$store.dispatch('general/getBaseData', 'general')
  },

  async mounted () {
    this.$scrollToHash(this.$route)
    await this.$connectWebsocket(this, () => {
      this.socket.emit('join-room', 'global')
      this.socket.on('cron|app-version-changed|payload', (message) => {
        this.$toaster.add({
          type: 'toast',
          category: 'success',
          message,
          timeout: 9999999999
        })
      })
      this.socket.on('disconnect', async () => {
        this.networkErrorToastId = await this.$toaster.add({
          type: 'toast',
          category: 'error',
          message: '❗️ Disconnected, trying to reconnect...',
          timeout: 9999999999
        })
      })
      this.$toaster.replace(this.networkErrorToastId, {
        id: this.networkErrorToastId,
        type: 'toast',
        category: 'success',
        message: '...and we\'re back! 🚀',
        timeout: 9999999999
      })
      const timeout = setTimeout(() => {
        this.$toaster.remove(this.networkErrorToastId)
        clearTimeout(timeout)
      }, 2000)
    })
  }
}
</script>
