import { getSubscriptionPublicKey } from '@/api/get-subscription-public-key'
import { registerSubscription } from '@/api/register-subscription'

export class ServiceWorkerNotification {
  constructor() {
    this.requestNotifications()
  }

  async requestNotifications() {
    window.Notification.requestPermission().then((permission) => {
      permission === 'granted'
        ? console.log('Notification permission granted')
        : console.log('Notification permission denied')
    })
  }

  registerServiceWorker() {
    navigator.serviceWorker
      .register('/service-worker.js')
      .then(async (serviceWorker) => {
        try {
          let subscription = await serviceWorker.pushManager.getSubscription()

          if (!subscription) {
            const { publicKey } = await getSubscriptionPublicKey()

            subscription = await serviceWorker.pushManager.subscribe({
              userVisibleOnly: true,
              applicationServerKey: publicKey,
            })
            const { endpoint, keys } = subscription.toJSON()

            await registerSubscription({
              endpoint: endpoint || '',
              auth: keys?.auth || '',
              p256dh: keys?.p256dh || '',
            })
          }
        } catch (error) {
          console.log({ error })
        }
      })
  }
}

export const serviceWorkNotificationManager = new ServiceWorkerNotification()
