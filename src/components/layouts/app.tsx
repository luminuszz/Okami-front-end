import { Outlet } from 'react-router-dom'

import { Header } from '../header'

export function AppLayout() {
  return (
    <div className="flex min-h-screen flex-col antialiased">
      <Header />

      <div className="flex-4 flex flex-1 gap-4 p-8 pt-6">
        <Outlet />
      </div>
    </div>
  )
}
