import { Helmet } from 'react-helmet-async'

import { FavoriteSyncList } from './favorite-sync-list.tsx'
import { FinishedWorksAmountCard } from './finished-works-amount-card'
import { ReadWorksAmountCard } from './read-works-amount.card'
import { TotalWorksCard } from './total-works-card'
import { UnreadWorksAmountCard } from './unread-works-amount-card'
import { WorksInfoChart } from './works-info-chart'

export function Dashboard() {
  return (
    <>
      <Helmet title="Dashboard" />

      <main className="flex flex-col gap-4">
        <h1 className="text-3xl font-bold tracking-tighter">Dashboard</h1>

        <section className="grid gap-4 md:grid-cols-4">
          <TotalWorksCard />
          <UnreadWorksAmountCard />
          <ReadWorksAmountCard />
          <FinishedWorksAmountCard />
        </section>

        <section className="grid gap-2 md:grid-cols-2">
          <WorksInfoChart />
          <FavoriteSyncList />
        </section>
      </main>
    </>
  )
}
