import { Helmet } from 'react-helmet-async'
import { useSearchParams } from 'react-router-dom'

import { AdminTabs, sectionMap } from '@/pages/app/admin/adminTabs.tsx'

export function AdminPage() {
  const [params] = useSearchParams()

  return (
    <>
      <Helmet title="Área de admistração" />

      <AdminTabs />

      {sectionMap[params.get('tab') ?? 'search-tokens']}
    </>
  )
}
