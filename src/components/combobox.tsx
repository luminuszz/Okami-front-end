import { find } from 'lodash'
import { Check, ChevronsUpDown } from 'lucide-react'
import { useState } from 'react'

import { Button } from './ui/button'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from './ui/command'
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover'
import { ScrollArea } from './ui/scroll-area'

export interface ComboBoxProps {
  options: { label: string; value: string }[]
  value: string
  onSelected: (value: string) => void
  disabled?: boolean
}

export function ComboBox({
  options,
  value,
  onSelected,
  disabled,
}: ComboBoxProps) {
  const [isOpen, setIsOpen] = useState(false)

  const currentOption = find(options, { value }) ?? {
    label: 'Selecione obra',
    value: '',
  }

  return (
    <Popover modal open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          disabled={disabled}
          variant="outline"
          role="combobox"
          className="w-full justify-between truncate"
        >
          <span className="max-w-[400px] truncate">{currentOption?.label}</span>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="w-full max-w-[460px]"
        side="bottom"
        align="start"
      >
        <Command>
          <CommandInput placeholder="Pesquise a obra..." />
          <CommandEmpty>Obra não encontrada</CommandEmpty>
          <CommandGroup>
            <ScrollArea className="h-48">
              {options.map((option) => (
                <CommandItem
                  key={option.value}
                  onSelect={() => {
                    onSelected(option.value)
                    setIsOpen(false)
                  }}
                >
                  {option.label}
                  {option.value === value && <Check className="ml-2 h-4 w-4" />}
                </CommandItem>
              ))}
            </ScrollArea>
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  )
}