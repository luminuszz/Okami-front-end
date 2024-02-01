import { Link, LinkProps, useLocation } from 'react-router-dom'

interface NavLinkProps extends LinkProps {
  to: string
  children: React.ReactNode
}

export function NavLink({ to, children, ...props }: NavLinkProps) {
  const { pathname } = useLocation()

  return (
    <Link
      data-active={pathname === to}
      {...props}
      to={to}
      className="flex items-center gap-1 text-sm font-medium text-muted-foreground hover:text-foreground data-[active=true]:text-foreground"
    >
      {children}
    </Link>
  )
}
