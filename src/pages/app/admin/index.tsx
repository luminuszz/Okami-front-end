import { ReactNode } from 'react'
import { Helmet } from 'react-helmet-async'
import { useSearchParams } from 'react-router-dom'

import { SearchTokens } from '@/pages/app/admin/search-tokens/search-tokens.tsx'
import { TabLink } from '@/pages/app/admin/TabLink.tsx'
import { Tags } from '@/pages/app/admin/tags/tags.tsx'

export const sectionMap: Record<string, ReactNode> = {
  'search-tokens': <SearchTokens />,
  tags: <Tags />,
} as const

export function AdminPage() {
  const [params, setParams] = useSearchParams()

  function handleSeatTab(tab: string) {
    setParams((params) => {
      params.set('section', tab)

      return params
    })
  }

  const currentSection = params.get('section') ?? 'search-tokens'

  const isActive = (section: string) => section === currentSection

  return (
    <>
      <Helmet title="Área de admistração" />

      <main>
        <div className="grid grid-cols-12">
          <nav className="col-span-2 p-2">
            <h2 className="text-3xl font-bold text-foreground">
              Administração
            </h2>

            <div className="mt-5 flex flex-col ">
              <TabLink
                isActive={isActive('search-tokens')}
                onClick={() => handleSeatTab('search-tokens')}
              >
                Tokens de busca
              </TabLink>

              <TabLink
                isActive={isActive('tags')}
                onClick={() => handleSeatTab('tags')}
              >
                Tags
              </TabLink>
            </div>
          </nav>

          <section className="col-span-10 size-full rounded-md border p-4">
            {sectionMap[currentSection]}
          </section>
        </div>
      </main>
    </>
  )
}
