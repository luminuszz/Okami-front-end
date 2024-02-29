import { loadStripe } from '@stripe/stripe-js'

import { env } from '@/utils/env'

export const stripeSdkPromise = loadStripe(env.VITE_STRIPE_PUBLIC_KEY)
