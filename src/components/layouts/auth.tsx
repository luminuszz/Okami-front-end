import { Outlet } from 'react-router-dom'

import { Logo } from '../logo'

export function AuthLayout() {
  return (
    <div className="flex min-h-screen grid-cols-2 flex-col items-center justify-center antialiased md:grid">
      <div className="hidden h-full flex-col justify-between border-r border-foreground/5 bg-muted p-10 text-muted-foreground md:flex">
        <main className=" flex h-full flex-col items-center justify-center gap-5  text-lg  text-foreground">
          <Logo className="h-[400px] w-[400px]" />
          <span className="mt font-semibold ">Okami Platform</span>
        </main>

        <footer className="text-sm">
          Okami Web - Painel Admin &copy; {new Date().getFullYear()}
        </footer>
      </div>

      <div className="flex flex-col items-center justify-center">
        <div className="flex md:hidden">
          <Logo className="h-[100px] w-[100px]" />
        </div>
        <Outlet />
      </div>
    </div>
  )
}
