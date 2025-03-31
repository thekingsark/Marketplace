self.addEventListener('push', (event) => {
  const data = event.data.json()
  const title = data.title
  const body = data.body
  const icon = data.icon
  const url = data.data.url
  const id = data.id

  const notificationOptions = {
    body,
    tag: id,
    icon,
    data: {
      url,
    },
  }

  self.registration.showNotification(title, notificationOptions)
})
