// /////////////////////////////////////////////////////////// Variables & Setup
// -----------------------------------------------------------------------------
const env = process.env.SERVER_ENV

const baseUrls = {
  development: 'https://localhost',
  stable: 'https://stable.openpanda.io',
  production: 'https://openpanda.io'
}

const frontendPort = (function () {
  if (env === 'development') { return 13010 }
  return env === 'stable' ? 13020 : 13030
}())

const backendPort = (function () {
  if (env === 'development') { return 13040 }
  return env === 'stable' ? 13050 : 13060
}())

// ////////////////////////////////////////////////////////////////////// Export
// -----------------------------------------------------------------------------
export default {
  // ///////////////////////////////////////////////////// Runtime Configuration
  // ---------------------------------------------------------------------------
  // ---------------------------------------------------------- [Runtime] Public
  publicRuntimeConfig: {
    frontendUrl: env === 'development' ? `${baseUrls[env]}:${frontendPort}` : baseUrls[env],
    backendUrl: env === 'development' ? `${baseUrls[env]}:${backendPort}` : `${baseUrls[env]}/api`,
    githubOAuthLink: `https://github.com/login/oauth/authorize?client_id=${process.env.GITHUB_OAUTH_CLIENT_ID}&scope=user:email`,
    serverFlag: env,
    seo: {
      siteName: 'Open Panda'
    },
    socketOptions: {
      withCredentials: true
    }
  },
  // --------------------------------------------------------- [Runtime] Private
  privateRuntimeConfig: {},
  // /////////////////////////////////////////////////////////// Server & Render
  // ---------------------------------------------------------------------------
  server: {
    port: frontendPort,
    host: process.env.NODE_ENV !== 'development' ? '0.0.0.0' : 'localhost'
  },
  render: {
    bundleRenderer: {
      runInNewContext: false
    }
  },
  // /////////////////////////////////////////////////////// Headers of the Page
  // ---------------------------------------------------------------------------
  head: {
    title: 'Open Panda',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: 'Open Panda' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon/favicon-96x96.png' }
    ]
  },
  // ////////////////////////////////////////// Customize the progress-bar color
  // ---------------------------------------------------------------------------
  loading: {
    color: '#FFFFFF',
    height: '4px'
  },
  // /////////////////////////////////////////////////////////// Global CSS/SCSS
  // ---------------------------------------------------------------------------
  css: [
    '~/assets/scss/main.scss'
  ],
  styleResources: {
    scss: [
      '~/assets/scss/variables.scss'
    ]
  },
  // /////////////////////////////////////////////////////// Nuxt.js Dev Modules
  // ---------------------------------------------------------------------------
  buildModules: [
    // Doc: https://github.com/nuxt-community/eslint-module
    '@nuxtjs/eslint-module',
    // Doc: https://github.com/nuxt-community/moment-module#readme
    '@nuxtjs/moment',
    // https://google-fonts.nuxtjs.org/setup
    '@nuxtjs/google-fonts',
    '@nuxtjs/style-resources' // Doc: https://github.com/nuxt-community/style-resources-module/
  ],
  // /////////////////////////////////////////////////////////// Nuxt.js Modules
  // ---------------------------------------------------------------------------
  modules: [
    '@nuxtjs/axios', // Doc: https://axios.nuxtjs.org/usage
    'nuxt-socket-io', // Doc: https://nuxt-socket-io.netlify.app
    '@nuxt/content', // Doc: https://content.nuxtjs.org
    '@nuxtjs/gtm', // Doc: https://github.com/nuxt-community/gtm-module
    '~/modules/https',
    '~/modules/toaster',
    '~/modules/slider',
    '~/modules/ls',
    '~/modules/auth',
    '~/modules/search',
    '~/modules/form',
    '~/modules/button'
  ],
  // ///////////////////////////////////////////////////// [Module] Nuxt-content
  // ---------------------------------------------------------------------------
  content: {
    markdown: {
      prism: {
        theme: false
      }
    }
  },
  // /////////////////////////////////// Plugins to load before mounting the App
  // ---------------------------------------------------------------------------
  plugins: [
    '~/plugins/helpers',
    '~/plugins/directives',
    '~/plugins/seo',
    '~/plugins/scroll-to',
    // '~/plugins/in-viewport',
    '~/plugins/uuid',
    '~/plugins/nuxt-hammer'
  ],
  // ///////////////////////////////////////////////////////// [Module] MomentJS
  // ---------------------- Doc: https://github.com/nuxt-community/moment-module
  moment: {
    timezone: true,
    defaultTimezone: 'UTC'
  },
  // ////////////////////////////////////////////////////////////// [Module] GTM
  // ------------------------- Doc: https://github.com/nuxt-community/gtm-module
  gtm: {
    // Currently hardcoded, can be added as an environment variable instead
    id: 'GTM-WSHTSSQ',
    pageTracking: true
  },
  // ////////////////////////////////////////////////////// [Module] GoogleFonts
  googleFonts: {
    families: {
      Heebo: [400, 500, 700],
      Manrope: [600, 700],
      'Space Mono': [400]
    },
    preconnect: true,
    download: false
  },
  // ///////////////////////////////////////////////////////////// [Module] Auth
  // ---------------------------------------------------------------------------
  auth: {
    redirectAfterLogin: {
      unregistered: {
        path: '/account/:key',
        key: 'githubUsername'
      },
      registered: {
        path: '/account/:key/datasets/claimed',
        key: 'githubUsername'
      }
    },
    redirectAfterLogout: '/'
  },
  // /////////////////////////////////////////////////////////////// [Module] ls
  // ---------------------------------------------------------------------------
  ls: {
    prefix: 'openpanda__'
  },
  // //////////////////////////////////////////////////////////// [Module] Axios
  // -------------------------------------- See https://axios.nuxtjs.org/options
  axios: {},
  // /////////////////////////////////////////////////// [Module] Nuxt Socket.io
  // ---------------------------------- Doc: https://nuxt-socket-io.netlify.app/
  io: {
    sockets: [{
      url: env === 'development' ? `${baseUrls[env]}:${backendPort}` : baseUrls[env]
    }]
  },
  // ////////////////////////////////////////////////////////// [Plugin] Toaster
  // ---------------------------------------------------------------------------
  toaster: {
    display: 10,
    timeout: 5000
  },
  // /////////////////////////////////////////////////////// Router + Middleware
  // ---------------------------------------------------------------------------
  // router: {
  //   middleware: ['modify']
  // },
  // /////////////////////////////////////////////////////// Build configuration
  // ------------------------------------------------ Extend webpack config here
  build: {
    // ---------------------------------------------------------- Hot Middleware
    hotMiddleware: {
      client: {
        overlay: false
      }
    },
    // -------------------------------------------------------------- Extensions
    extend (config, ctx) {
      config.module.rules.push({
        test: /\.md$/,
        use: 'raw-loader'
      })
    }
  },
  storybook: {
    port: 4008,
    parameters: {
      layout: 'fullscreen'
    }
  }
}
