import { Outlet } from 'react-router-dom'

export function AuthLayout() {
  return (
    <div className="grid min-h-screen grid-cols-2 antialiased">
      <div className="flex h-full flex-col justify-between border-r border-foreground/5 bg-muted p-10 text-muted-foreground">
        <main className=" flex h-full flex-col items-center justify-center gap-5  text-lg  text-foreground">
          <img
            className="h-[400px] w-[400px]"
            src="/okami-logo.png"
            alt="Okami logo"
          />
          <span className="mt font-semibold ">Okami Platform</span>
        </main>

        <footer className="text-sm">
          Okami Web - Painel Admin &copy; {new Date().getFullYear()}
        </footer>
      </div>

      <div className="flex flex-col items-center justify-center">
        <Outlet />
      </div>
    </div>
  )
}
