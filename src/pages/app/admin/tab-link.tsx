import { PropsWithChildren } from 'react'

type TabLinkProps = PropsWithChildren<{
  isActive?: boolean
  onClick: () => void
}>

export function TabLink({ isActive, onClick, children }: TabLinkProps) {
  return (
    <p
      data-active={isActive}
      onClick={onClick}
      className="mt-2 cursor-pointer rounded-md p-3 pl-2 text-sm text-foreground transition-colors duration-200  ease-out  hover:bg-accent
      hover:ease-in data-[active=true]:bg-accent
      "
    >
      {children}
    </p>
  )
}
