import { toast } from 'sonner'

import { getSubscriptionPublicKey } from '@/api/get-subscription-public-key'
import { registerSubscription } from '@/api/register-subscription'

export class ServiceWorkerNotification {
  async checkPermissions(): Promise<boolean> {
    const permission = window.Notification.permission
    return permission === 'granted'
  }

  async requestNotifications() {
    window.Notification.requestPermission().then((permission) => {
      const isGranted = permission === 'granted'

      if (!isGranted) {
        console.log('Notificação não permitida')
      } else {
        this.registerServiceWorker()
      }
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
          toast.error('Não foi possível registrar as notificações.')
        }
      })
  }
}

export const serviceWorkNotificationManager = new ServiceWorkerNotification()
