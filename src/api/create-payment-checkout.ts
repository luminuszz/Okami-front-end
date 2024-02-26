import { okamiHttpGateway } from '@/lib/axios'

interface Response {
  paymentSessionId: string
}

export async function createPaymentCheckout(): Promise<Response> {
  const results = await okamiHttpGateway.post<Response>('/payment/intent')

  return {
    paymentSessionId: results.data.paymentSessionId,
  }
}
