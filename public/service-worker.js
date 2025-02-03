const BroadCastEvents = {
  newChapterAvailable: 'new-chapter-available',
}

const NotificationsActions = {
  goToWork: 'go_to_work',
}


const parseStringJston = (value) => {
  const fixedStr = value.replace(/'/g, "") // Remove outer quotes
    .replace(/(\w+):/g, '"$1":') // Add double quotes to keys
    .replace(/:([^",}]+)/g, ':"$1"'); // Add double quotes to values

  return JSON.parse(fixedStr);
}

self.addEventListener('push', function (event) {
  const notificaitonContent = JSON.parse(event.data.text().replace(/\\"/g, '"'));

  const options = {
    body:  notificaitonContent.message,
    icon: './okami-logo.png',
    badge: './okami-logo.png',
    actions: [
      { action: NotificationsActions.goToWork, title: "Ir para obra" },
    ],
    data: {
      workId: notificaitonContent.workId,
      workName: notificaitonContent.name,
    }
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

  event.waitUntil(self.registration.showNotification(`${notificaitonContent.name} - by Okami`, options))
})

self.addEventListener("notificationclick", async function (event) {
  if(event.action === NotificationsActions.goToWork) {
    const  updatedUrl = new URL("https://okami.daviribeiro.com/works");
    updatedUrl.searchParams.append("name", event.notification.data.workName);
    event.waitUntil(clients.openWindow(updatedUrl.toString()));
  }

})
