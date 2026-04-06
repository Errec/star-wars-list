export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.config.errorHandler = (error, instance, info) => {
    console.error('Vue error captured by global handler.', { error, info, component: instance?.$options?.name })
  }
})
