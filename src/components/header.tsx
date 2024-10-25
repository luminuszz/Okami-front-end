import { BarChart4, Book, Home, Shield } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

import { Can } from '@/components/permissions-provider'

import { AccountMenu } from './account-menu'
import { Logo } from './logo'
import { MobileMenu } from './mobile-menu'
import { NavLink } from './navlink'
import { NotificationTab } from './notification-indicator'
import { SubscriptionIndicator } from './subscripion-indicator'
import { SyncTelegramPresentationDialog } from './sync-telegram-presentation-dialog'
import { ThemeToggle } from './theme-toogle'

export function Header() {
  const navigate = useNavigate()

  return (
    <header className="border-b">
      <div className="flex h-16 items-center justify-between  gap-6 px-4 md:hidden">
        <Logo
          className="size-10 cursor-pointer  hover:opacity-90"
          onClick={() => navigate('/')}
        />

        <div className="flex gap-4">
          <NotificationTab />
          <MobileMenu />
        </div>
      </div>

      <div className="hidden  h-16 items-center gap-6 px-6 md:flex">
        <Logo
          className="size-10 cursor-pointer hover:opacity-90"
          onClick={() => navigate('/')}
        />

        <nav className="hidden  items-center space-x-4 md:flex lg:space-x-6">
          <NavLink
            to="/"
            className="flex flex-col items-center justify-center gap-2"
          >
            <Home className="mr-1 h-4 w-4" />
            Inicio
          </NavLink>

          <NavLink
            to={'/works'}
            className="flex flex-col items-center justify-center gap-2"
          >
            <Book className="mr-1 h-4 w-4" />
            Obras
          </NavLink>

          <NavLink
            to="/scrapping-report"
            className="flex flex-col items-center justify-center gap-2"
          >
            <BarChart4 className="mr-1 h-4 w-4" />
            Relatório
          </NavLink>

          <Can I="show" a="admin-section">
            <NavLink
              to="/admin"
              className="flex flex-col items-center justify-center gap-2"
            >
              <Shield className="mr-1 h-4 w-4" />
              Administração
            </NavLink>
          </Can>
        </nav>

        <div className="ml-auto hidden items-center gap-2 md:flex">
          <SyncTelegramPresentationDialog />
          <SubscriptionIndicator />
          <ThemeToggle />
          <NotificationTab />
          <AccountMenu />
        </div>
      </div>
    </header>
  )
}
