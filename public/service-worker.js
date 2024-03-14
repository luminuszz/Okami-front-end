const BroadCastEvents = {
  newChapterAvailable: 'new-chapter-available',
}

self.addEventListener('push', function (event) {
  const options = {
    body: event.data.text(),
    icon: './okami-logo.png',
    badge: './okami-logo.png',
  }

  event.waitUntil(
    self.clients.matchAll().then(function (clients) {
      clients.forEach((client) => {
        client.postMessage({
          type: BroadCastEvents.newChapterAvailable,
        })
      })
    }),
  )

  event.waitUntil(self.registration.showNotification('Okami Web', options))
})
