import { Book, Home } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

import { AccountMenu } from './account-menu'
import { Logo } from './logo'
import { NavLink } from './navlink'
import { ThemeToggle } from './theme-toogle'
import { Separator } from './ui/separator'

export function Header() {
  const navigate = useNavigate()

  return (
    <header className="border-b">
      <div className="flex h-16 items-center gap-6 px-6">
        <Logo
          className="h-10 w-10 cursor-pointer hover:opacity-90"
          onClick={() => navigate('/')}
        />
        <Separator orientation="vertical" className="h-6" />

        <nav className="flex items-center space-x-4 lg:space-x-6">
          <NavLink
            to="/"
            className="flex flex-col items-center justify-center gap-2"
          >
            <Home className="mr-1 h-4 w-4" />
            Inicio
          </NavLink>

          <NavLink
            to="/works"
            className="flex flex-col items-center justify-center gap-2"
          >
            <Book className="mr-1 h-4 w-4" />
            Obras
          </NavLink>
        </nav>

        <div className="ml-auto flex items-center gap-2">
          <ThemeToggle />
          <AccountMenu />
        </div>
      </div>
    </header>
  )
}
