import { Helmet } from 'react-helmet-async'

import { ActionsButtons } from './actions-buttons'
import { WorkGallery } from './workGallery'
import { WorksFilter } from './works-filter'

export function Works() {
  return (
    <>
      <Helmet title="obras atualizadas" />

      <div className=" flex flex-col gap-4">
        <h1 className="text-center text-3xl font-bold tracking-tighter md:text-left">
          Obras Atualizadas
        </h1>

        <aside className="flex flex-col items-center  gap-2 md:flex-row md:justify-between ">
          <WorksFilter />

          <ActionsButtons />
        </aside>

        <WorkGallery />
      </div>
    </>
  )
}
