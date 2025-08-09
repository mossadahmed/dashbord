import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faUser, faLock, faEye, faEyeSlash, faEnvelope, faArrowRightFromBracket, faHome, faUsers, faCircleCheck, faFileLines, faComments, faNoteSticky } from '@fortawesome/free-solid-svg-icons'
import { defineNuxtPlugin } from 'nuxt/app'

library.add(faUser, faLock, faEye, faEyeSlash, faEnvelope, faArrowRightFromBracket, faHome, faUsers, faCircleCheck, faFileLines, faComments, faNoteSticky)

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.component('FontAwesomeIcon', FontAwesomeIcon)
})
