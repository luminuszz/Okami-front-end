import { okamiHttpGateway } from '@/lib/axios'

interface Response {
  paymentSessionId: string
}

export async function createPaymentCheckout(): Promise<Response> {
  const results = await okamiHttpGateway.post<Response>('/payment/checkout')

  return {
    paymentSessionId: results.data.paymentSessionId,
  }
}
