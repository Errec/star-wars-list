export default defineEventHandler(() => {
  return {
    status: 'ok',
    service: 'star-wars-list',
    at: new Date().toISOString()
  }
})
