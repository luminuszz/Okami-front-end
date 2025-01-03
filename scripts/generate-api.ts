import { unlinkSync, writeFileSync } from 'node:fs'
import path from 'node:path'

import axios, { AxiosError } from 'axios'
import orval from 'orval'

const OKAMI_URL_SWAGGER = `${process.env.VITE_API_URL}/static/swagger`

const SWAGGER_PATH = path.resolve(__dirname, '../swagger.json')
const ORVAL_CONFIG_PATH = path.resolve(__dirname, '../orval.config.cjs')

async function run() {
  try {
    if (!OKAMI_URL_SWAGGER) {
      console.error('EXPO_PUBLIC_API_URL is not defined in .env.local')
      return
    }

    console.log('Fetching Swagger API from Okami API')

    const response = await axios.get(OKAMI_URL_SWAGGER, {
      responseType: 'json',
    })

    console.log('Writing Swagger API to file')

    writeFileSync(SWAGGER_PATH, JSON.stringify(response.data, null, 2))

    await orval(ORVAL_CONFIG_PATH)

    console.log('API generation completed')
  } catch (error) {
    if (error instanceof AxiosError) {
      console.log('Error fetching Swagger API from Okami API')
    }

    console.error(error)
  } finally {
    console.log('Finished script')
    console.log('Exiting...')

    unlinkSync(SWAGGER_PATH)
  }
}

run()
