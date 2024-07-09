import { Flame } from 'lucide-react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { AccountMenu } from './account-menu'
import { Logo } from './logo'
import { NavLink } from './navlink'
import { Can } from './permissions-provider'
import { SubscriptionIndicator } from './subscripion-indicator'
import { SyncTelegramPresentationDialog } from './sync-telegram-presentation-dialog'
import { Button } from './ui/button'
import { Drawer, DrawerContent, DrawerHeader, DrawerTrigger } from './ui/drawer'
import { Separator } from './ui/separator'

export function MobileMenu() {
  const navigate = useNavigate()

  const [canAnimateIcon, setCanAnimateIcon] = useState(true)

  return (
    <nav className="flex md:hidden">
      <Drawer onOpenChange={(value) => setCanAnimateIcon(!value)}>
        <DrawerTrigger asChild>
          <Button size="icon" variant="ghost">
            <Flame
              className={`text-gray-100 ${canAnimateIcon ? 'animate-bounce' : 'animate-none'}`}
            />
          </Button>
        </DrawerTrigger>

        <DrawerContent>
          <DrawerHeader className="justify-center">
            <div className="flex items-center gap-2">
              <Logo
                className="size-10 cursor-pointer hover:opacity-90"
                onClick={() => navigate('/')}
              />
              <span className="font-mono  text-2xl tracking-wider">OKAMI</span>
            </div>
          </DrawerHeader>

          <Separator orientation="horizontal" />

          <section className="p-2 px-4">
            <nav className="flex  flex-col items-center justify-center space-y-4 ">
              <NavLink to="/">Home</NavLink>
              <NavLink to="/works">Obras</NavLink>
              <NavLink to="/scrapping-report">Relatório</NavLink>
              <NavLink to="/admin">Administração</NavLink>
            </nav>
          </section>

          <Can I="show" a="telegram-button">
            <Separator orientation="horizontal" />
          </Can>

          <section className="flex justify-center py-2">
            <SyncTelegramPresentationDialog />
          </section>

          <Separator orientation="horizontal" />

          <div className="flex flex-col justify-between gap-2 px-2 py-2">
            <SubscriptionIndicator />
            <AccountMenu />
          </div>
        </DrawerContent>
      </Drawer>
    </nav>
  )
}
