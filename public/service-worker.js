self.addEventListener('push', function (event) {
  const options = {
    body: event.data.text(),
    icon: './okami-logo.png',
    badge: './okami-logo.png',
  }

  event.waitUntil(self.registration.showNotification('Okami Web', options))
})
