import { ReactNode } from 'react'
import { useSearchParams } from 'react-router-dom'

import { Button } from '@/components/ui/button.tsx'

import { SearchTokens } from './search-tokens'

export const sectionMap: Record<string, ReactNode> = {
  'search-tokens': <SearchTokens />,
} as const

export const sectionList = Object.keys(sectionMap)

export function AdminTabs() {
  const [, setParams] = useSearchParams()

  function handleSetTab(tab: string) {
    setParams((params) => {
      params.set('tab', tab)
      return params
    })
  }

  return (
    <section className="flex justify-start gap-4">
      {sectionList.map((section) => (
        <Button
          key={section}
          onClick={() => handleSetTab('search-tokens')}
          variant="ghost"
        >
          Tokens de busca
        </Button>
      ))}
    </section>
  )
}
