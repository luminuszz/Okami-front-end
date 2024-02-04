import { Helmet } from 'react-helmet-async'

import { WorkGallery } from './workGallery'
import { WorksFilter } from './works-filter'

export function Works() {
  return (
    <>
      <Helmet title="obras atualizadas" />

      <div className=" flex flex-col gap-4">
        <h1 className="text-3xl font-bold tracking-tighter">
          Obras Atualizadas
        </h1>

        <WorksFilter />

        <main className="flex justify-center ">
          <WorkGallery />
        </main>
      </div>
    </>
  )
}
