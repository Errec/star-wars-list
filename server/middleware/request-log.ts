export default defineEventHandler((event) => {
  if (event.path.startsWith('/api/')) {
    console.info(JSON.stringify({
      level: 'info',
      type: 'api_request',
      method: event.method,
      path: event.path,
      at: new Date().toISOString()
    }))
  }
})
