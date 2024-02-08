const channel = new BroadcastChannel('service-worker-events')

const BroadCastEvents = {
  newChapterAvailable: 'new-chapter-available',
}

self.addEventListener('push', function (event) {
  const options = {
    body: event.data.text(),
    icon: './okami-logo.png',
    badge: './okami-logo.png',
  }

  channel.postMessage({
    type: BroadCastEvents.newChapterAvailable,
    data: options.body,
  })
  event.waitUntil(self.registration.showNotification('Okami Web', options))
})
