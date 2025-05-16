// ///////////////////////////////////////////////////////////////////// Imports
// -----------------------------------------------------------------------------
import Filesize from 'filesize'
import Cookie from 'cookie'
import GetFlagEmoji from 'country-code-emoji'
import CloneDeepWith from 'lodash/cloneDeepWith'

// /////////////////////////////////////////////////////////////////// Functions
// -----------------------------------------------------------------------------
// ///////////////////////////////////////////////////////////////////// Slugify

/**
  * Options: 'dash', 'underscore', 'underscore-no-trim'
  */

const Slugify = (text, type = 'dash') => {
  if (type === 'dash') {
    return text.toString().toLowerCase()
      .replace(/[\s\t]+/g, '-') // Replace spaces with -
      .replace(/[^a-zA-Z0-9-]+/g, '') // Allow only alphanumeric
      .replace(/-+/g, '-') // Removes sequences of multiple dashes
      .replace(/^-+|-+$/, '') // Trim dashes from both ends
  } else if (type === 'underscore') {
    return text.toString().toLowerCase()
      .replace(/\s+/g, '_') // Replace spaces with _
      .replace(/[^\w_]+/g, '') // Remove all non-word chars
      .replace(/__+/g, '_') // Replace multiple _ with single _
      .replace(/^_+/, '') // Trim _ from start of text
      .replace(/_+$/, '') // Trim _ from end of text
  } else if (type === 'underscore-no-trim') {
    return text.toString().toLowerCase()
      .replace(/\s+/g, '_') // Replace spaces with _
      .replace(/[^\w_]+/g, '') // Remove all non-word chars
      .replace(/__+/g, '_') // Replace multiple _ with single _
  } else {
    return 'Incompatible "Type" specified. Must be type "dash", "underscore", or "underscore-no-trim". Default is "dash"'
  }
}

// ///////////////////////////////////////////////////////////////// Parse a URL

/**
  * https://www.abeautifulsite.net/parsing-urls-in-javascript
  */

const ParseURL = (url) => {
  const match = url.match(/:\/\/(www[0-9]?\.)?(.[^/:]+)/i)
  const urlBreakdown = {}
  let hostname = null
  let domain = null
  if (match != null && match.length > 2 && typeof match[2] === 'string' && match[2].length > 0) {
    hostname = match[2]
  }
  const urlParts = hostname.split('.').reverse()
  if (urlParts != null && urlParts.length > 1) {
    domain = urlParts[1] + '.' + urlParts[0]
    if (hostname.toLowerCase().includes('.co.uk') !== -1 && urlParts.length > 2) {
      domain = urlParts[2] + '.' + domain
    }
  }
  urlBreakdown.hostname = hostname
  urlBreakdown.domain = domain
  return urlBreakdown
}

// //////////////////////////////////////////////////////// Throttle From Lodash
const Throttle = (func, wait, options) => {
  let context
  let args
  let result
  let timeout = null
  let previous = 0
  if (!options) { options = {} }
  const later = function () {
    previous = options.leading === false ? 0 : Date.now()
    timeout = null
    result = func.apply(context, args)
    if (!timeout) { context = args = null }
  }
  return function () {
    const now = Date.now()
    if (!previous && options.leading === false) { previous = now }
    const remaining = wait - (now - previous)
    context = this
    args = arguments
    if (remaining <= 0 || remaining > wait) {
      if (timeout) { clearTimeout(timeout); timeout = null }
      previous = now
      result = func.apply(context, args)
      if (!timeout) { context = args = null }
    } else if (!timeout && options.trailing !== false) {
      timeout = setTimeout(later, remaining)
    } return result
  }
}

// /////////////////////////////////////////// Check if Element contains a class
const HasClass = (element, className) => {
  if (element.classList) { return element.classList.contains(className) }
  return new RegExp('(^| )' + className + '( |$)', 'gi').test(element.className)
}

// /////////////////////////////////////////////// If on iOS, return the version

/**
  * supports iOS 2.0 and later -- https://bit.ly/TJjs1V
  */

const IOSversion = (element, className) => {
  if (/iP(hone|od|ad)/.test(navigator.platform)) {
    const v = (navigator.appVersion).match(/OS (\d+)_(\d+)_?(\d+)?/)
    return [parseInt(v[1], 10), parseInt(v[2], 10), parseInt(v[3] || 0, 10)]
  }
  return false
}

// //////////////////// Get the time from a timestamp in "22 seconds ago" format
const Timeago = (timestamp) => {
  const now = new Date()
  const secondsPast = (now.getTime() - timestamp.getTime()) / 1000
  if (secondsPast === 1) { return Math.floor(parseInt(secondsPast)) + ' second ago' }
  if (secondsPast < 60) { return Math.floor(parseInt(secondsPast)) + ' seconds ago' }
  if (secondsPast === 60) { return Math.floor(parseInt(secondsPast / 60)) + ' minute ago' }
  if (secondsPast < 3600) { return Math.floor(parseInt(secondsPast / 60)) + ' minutes ago' }
  if (secondsPast === 3600) { return Math.floor(parseInt(secondsPast / 3600)) + ' hour ago' }
  if (secondsPast < 86400) { return Math.floor(parseInt(secondsPast / 3600)) + ' hours ago' }
  if (secondsPast < 172800) { return Math.floor(parseInt(secondsPast / 86400)) + ' day ago' }
  if (secondsPast > 86400) { return Math.floor(parseInt(secondsPast / 86400)) + ' days ago' }
  return timestamp
}

// ///////////////////////////////////////////////////////////// Parse Video URL

/**
  * https://gist.github.com/yangshun/9892961
  */

const ParseVideoUrl = (url) => {
  const matched = url.match(/(https?:\/\/|\/\/|)(player.|www.)?(vimeo\.com|youtu(be\.com|\.be|be\.googleapis\.com)|dailymotion.com)\/(video\/|embed\/|watch\?v=|v\/)?([A-Za-z0-9._%-]*)(&\S+)?/)
  if (!matched) { return { type: false, id: false, time: false } }
  const parsed = new URL(`https://placeholder-for-parsing.com/${url.split('/').pop()}`)
  const domain = matched[3]
  let type = ''
  if (domain.includes('youtu')) { type = 'youtube' }
  if (domain.includes('vimeo')) { type = 'vimeo' }
  if (domain.includes('dailymotion')) { type = 'dailymotion' }
  return { type, id: matched[6], time: parsed.searchParams.get('t') }
}

// /////////////////////////////////////////////////////// Generate an embed URL

/**
  * Youtube or Vimeo
  */

const BuildVideoEmbedUrl = (parsed) => {
  const type = parsed.type
  const id = parsed.id
  const time = parsed.time
  let url
  switch (type) {
    case 'youtube' : url = `//www.youtube.com/embed/${id}${(time ? `?start=${time}` : '')}`; break
    case 'vimeo' : url = `//player.vimeo.com/video/${id}${(time ? `/#=${time}` : '')}`; break
    default : url = false
  }
  return url
}

// ////////////////////////////////// Get the height of the entire page Document
const GetDocHeight = () => {
  const D = document
  return Math.max(
    D.body.scrollHeight, D.documentElement.scrollHeight,
    D.body.offsetHeight, D.documentElement.offsetHeight,
    D.body.clientHeight, D.documentElement.clientHeight
  )
}

// ///////////////////////////////// Capitalize first letters of words in string

/**
  * Capitalizes .
  * @param {string} str String to be modified
  * @param {boolean=false} lower Whether all other letters should be lowercased
  * @return {string}
  * @usage
  *   capitalize('fix this string')     // -> 'Fix This String'
  *   capitalize('javaSCrIPT')          // -> 'JavaSCrIPT'
  *   capitalize('javaSCrIPT', true)    // -> //'Javascript'
  */

const Capitalize = (str, lower = false) => {
  return (lower ? str.toLowerCase() : str).replace(/(?:^|\s|["'([{])+\S/g, match => match.toUpperCase())
}

// //////////////////////////////////// Convert bytes// to human-readable format
// ----------------------------- Ex: 257831078666960800 bytes outputs as 229 PiB
const FormatBytes = (bytes, format = 'string') => {
  const size = Filesize(bytes, { standard: 'iec', base: 2 })
  if (format === 'string') { return size }
  const split = size.split(' ')
  return { value: split[0], unit: split[1] }
}

// //////////////////////////////////////////// Convert thousands to kilo format

/**
  * Could add others later if needed, like M for Mega/Millions
  * Ex: 15450 outputs as 15k
  */

const FormatMetric = (num) => {
  return (Math.abs(num) > 999 ? Math.sign(num) * ((Math.abs(num) / 1000).toFixed(1)) + 'K' : Math.sign(num) * Math.abs(num))
}

// //////////////////////////////////////////////////////////// Shuffle an Array

/**
  * https://stackoverflow.com/a/2450976
  */

const ShuffleArray = (arr) => {
  let currentIndex = arr.length
  let temporaryValue
  let randomIndex
  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex)
    currentIndex -= 1
    temporaryValue = arr[currentIndex]
    arr[currentIndex] = arr[randomIndex]
    arr[randomIndex] = temporaryValue
  }
  return arr
}

// ////////////////////////////////// Gene//rate a Random Integer Within a Range

/**
  * https://stackoverflow.com/a/1527820
  */

const GetRandomInteger = (min, max) => {
  min = Math.ceil(min)
  max = Math.floor(max)
  return Math.floor(Math.random() * (max - min + 1)) + min
}

// /////////////////////////////////////////////////////////// Truncate a string

/**
  * Default: len = 30, end = '...'
  */

const TruncateString = (string, len = 30, end = '...', type = 'single') => {
  if (type === 'single') {
    return string.length > len + 3 ? `${string.slice(0, len)}${end}` : string
  } else {
    return string.length > len + 3 ? `${string.slice(0, len)}${end}${string.slice(-len)}` : string
  }
}

// //////////////////////////////////////////////// Convert number to have zeros

/**
  * Ex: 250 --> 250.00, 250.1 --> 250.10
  */

const FormatNumberWithZeros = (incoming) => {
  const value = typeof incoming !== 'number' ? parseFloat(incoming) : incoming
  if (isNaN(value) || value === 0) { return value }
  const split = value.toString().split('.')
  const beforeDecimal = split[0]
  const afterDecimal = split[1]
  const beforeLen = beforeDecimal.length
  if (beforeLen === 1) {
    return Number(`${beforeDecimal}${afterDecimal ? `.${afterDecimal.charAt(0)}` : ''}`).toFixed(1)
  } else if (beforeLen > 1) {
    return value.toFixed(2)
  } else {
    return value
  }
}

// /////////////////////////////////////////////////////// Add text to clipboard
const AddTextToClipboard = (text) => {
  const container = document.createElement('textarea')
  container.style.position = 'fixed'
  container.style.left = '-99999px'
  container.style.zIndex = '-1'
  container.style.opacity = '0'
  container.style.pointerEvents = 'none'
  container.innerHTML = text
  document.body.appendChild(container)
  container.select()
  document.execCommand('copy')
  document.body.removeChild(container)
}

// /////////////////// Convert text into a downloadable file and prompt download
const DownloadTextFile = (filename, data) => {
  return new Promise((resolve) => {
    const blob = new Blob([data])
    const anchor = document.createElement('a')
    const url = window.URL.createObjectURL(blob)
    anchor.href = url
    anchor.download = decodeURI(filename)
    anchor.style.display = 'none'
    document.body.appendChild(anchor)
    anchor.click()
    anchor.parentNode.removeChild(anchor)
    window.URL.revokeObjectURL(url)
    resolve()
  })
}

// //////////////////////////////////////////// Get a flag icon based on isoCode
const GetFlagIcon = (isoCode) => {
  try {
    return GetFlagEmoji(isoCode)
  } catch (e) {
    return '🌐'
  }
}

// //////////////////////////////////////////////////////////////////// OmitDeep
const OmitDeep = (collection, excludeKeys) => {
  const omit = (value) => {
    if (value && typeof value === 'object') {
      excludeKeys.forEach((key) => {
        delete value[key]
      })
    }
  }
  return CloneDeepWith(collection, omit)
}

// /////////////////////////////////////////////////////////////////// GetCookie
const GetCookie = (string, key) => {
  const cookies = Cookie.parse(string)
  return cookies.hasOwnProperty(key) ? cookies[key] : false
}

// /////////////////////////////////////////////////////////////// ParseFilename
const ParseFilename = (filename) => {
  return {
    name: filename.slice(0, filename.lastIndexOf('.')),
    ext: filename.slice(filename.lastIndexOf('.') + 1, filename.length)
  }
}

// /////////////////////////////////////////////////////////////////////// Delay
const Delay = (ms) => {
  return new Promise(resolve => setTimeout(resolve, ms))
}

// //////////////////////////////////////////////////////// AwaitServerReconnect
const AwaitServerReconnect = (config, app) => async () => {
  if (config.serverFlag !== 'production') { console.log('⚡️ ping') }
  try {
    await app.$axios.get(config.backendUrl)
    return false
  } catch (e) {
    if (e.message === 'Network Error') {
      if (config.serverFlag !== 'production') { console.log('🔥 server down') }
      await app.$delay(500)
      return await app.$awaitServerReconnect()
    }
    if (config.serverFlag !== 'production') { console.log('⬆️ server up') }
    return false
  }
}

// //////////////////////////////////////////////////////////// ConnectWebsocket
const ConnectWebsocket = config => (instance, next) => {
  const connect = (resolve) => {
    instance.socket.on('connect', () => {
      next()
      resolve()
    })
  }
  const disconnect = (resolve) => {
    instance.socket.on('disconnect', async (reason) => {
      if (reason === 'ping timeout' || reason === 'transport close' || reason === 'transport error') {
        await instance.$awaitServerReconnect()
        instance.socket = instance.$nuxtSocket(config.socketOptions)
        disconnect(resolve)
        connect(resolve)
      } else {
        instance.socket = false
      }
    })
  }
  return new Promise((resolve) => {
    instance.socket = instance.$nuxtSocket(config.socketOptions)
    disconnect(resolve)
    connect(resolve)
  })
}

// //////////////////////////////////////////////////////// getKebab
// makes any string kebab-lowercase
const GetKebab = (str) => {
  return str.toLowerCase().replace(/[.,/#!$%^&*;:{}=_`~()]/g, '').replace(/\s+/g, '-').trim()
}

// //////////////////////////////////////////////////////// getPrettyNameFromUrl
// replace '-' to ' '
// remove extension
const GetPrettyNameFromUrl = (url) => {
  return url ? url.split('/').pop().replaceAll('-', ' ').replace(/\.[^/.]+$/, '') : ''
}

// //////////////////////////////////////////////////////////// GetTagBasedOnUrl
const GetTagBasedOnUrl = (url) => {
  return url ? url.includes('http') || url.includes('mailto') || url.includes('tel') ? 'a' : 'nuxt-link' : 'button'
}

// ///////////////////////////////////////////////////////// GetTargetBasedOnUrl
const GetTargetBasedOnUrl = (url) => {
  return url ? url.includes('http') ? '_blank' : '' : false
}

// ////////////////////////////////////////////////////////////// IsRouteCurrent
const IsRouteCurrent = (route, href) => {
  return route.fullPath === href
}

// //////////////////////////////////////////////////////////////// ScrollToHash
const ScrollToHash = (app, route, element) => {
  const hash = route.hash.replace('#', '')
  if (hash) {
    const element = document.getElementById(hash) || document.querySelector(`[data-id='${hash}']`)
    if (element) {
      app.$scrollToElement(element, 200, -50)
    }
  }
}

// ////////////////////////////////////////////////////////////////////// Export
// -----------------------------------------------------------------------------
export default ({ $config, app }, inject) => {
  inject('isRouteCurrent', IsRouteCurrent)
  inject('slugify', Slugify)
  inject('parseURL', ParseURL)
  inject('throttle', Throttle)
  inject('hasClass', HasClass)
  inject('iOSversion', IOSversion)
  inject('timeago', Timeago)
  inject('parseVideoUrl', ParseVideoUrl)
  inject('buildVideoEmbedUrl', BuildVideoEmbedUrl)
  inject('getDocHeight', GetDocHeight)
  inject('capitalize', Capitalize)
  inject('formatBytes', FormatBytes)
  inject('formatMetric', FormatMetric)
  inject('shuffleArray', ShuffleArray)
  inject('getRandomInteger', GetRandomInteger)
  inject('truncateString', TruncateString)
  inject('formatNumberWithZeros', FormatNumberWithZeros)
  inject('addTextToClipboard', AddTextToClipboard)
  inject('downloadTextFile', DownloadTextFile)
  inject('getFlagIcon', GetFlagIcon)
  inject('omitDeep', OmitDeep)
  inject('getCookie', GetCookie)
  inject('parseFilename', ParseFilename)
  inject('delay', Delay)
  inject('awaitServerReconnect', AwaitServerReconnect($config, app))
  inject('connectWebsocket', ConnectWebsocket($config))
  inject('GetTagBasedOnUrl', GetTagBasedOnUrl)
  inject('GetTargetBasedOnUrl', GetTargetBasedOnUrl)
  inject('GetKebab', GetKebab)
  inject('GetPrettyNameFromUrl', GetPrettyNameFromUrl)
  inject('scrollToHash', (route, element) => ScrollToHash(app, route, element))
}
