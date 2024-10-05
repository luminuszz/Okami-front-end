import { useAtom } from 'jotai'
import { Plus, X } from 'lucide-react'
import { useCallback, useEffect, useMemo } from 'react'
import { useInView } from 'react-intersection-observer'

import { Tag } from '@/api/get-tags-paged.ts'
import { tagSelectorIsOpen } from '@/app/store/tag-selector.ts'
import { Badge } from '@/components/ui/badge.tsx'
import { Button } from '@/components/ui/button.tsx'
import {
  Command,
  CommandEmpty,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command.tsx'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover.tsx'
import { getTagColor } from '@/utils/helpers.ts'

export interface TagsSelectProps {
  options: Tag[]
  onEndReached: () => void
  handleRemoveTag: (tagId: string) => void
  handleAddTag: (tag: Tag[]) => void
  value: Tag[]
  isLoading?: boolean
  onSearch?: (search: string) => void
}

export function TagsSelect({
  options,
  onEndReached,
  handleAddTag,
  handleRemoveTag,
  value,
  isLoading,
  onSearch,
}: TagsSelectProps) {
  const [open, setOpen] = useAtom(tagSelectorIsOpen)
  const [ref, inView] = useInView()

  const handler = useCallback(onEndReached, [onEndReached])

  const tags = useMemo(() => value, [value])

  useEffect(() => {
    if (inView) {
      handler()
    }
  }, [handler, inView])

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <div className="flex items-center justify-between px-2">
        <div className="space-x-1">
          {tags.length ? (
            tags.map((tag) => {
              return (
                <Badge
                  key={tag.id}
                  className="text-gray-100"
                  style={{ background: getTagColor(tag.color) }}
                  variant="outline"
                >
                  <X
                    onClick={() => handleRemoveTag(tag.id)}
                    className="mr-2 size-4 cursor-pointer"
                  />
                  <p>{tag.name}</p>
                </Badge>
              )
            })
          ) : (
            <span className="text-center text-sm text-muted-foreground">
              Adicionar tags
            </span>
          )}
        </div>

        <PopoverTrigger asChild>
          <Button variant="ghost" size="icon" className="ml-2">
            <Plus className="size-4" />
          </Button>
        </PopoverTrigger>
      </div>

      <PopoverContent align="center">
        <Command shouldFilter={false}>
          <CommandInput
            inputMode="search"
            onValueChange={onSearch}
            placeholder="Pesquisar tags..."
            isPending={isLoading}
          />
          <CommandEmpty>Sem tags</CommandEmpty>
          <CommandList>
            {options?.map((tag) => (
              <CommandItem
                key={tag.id}
                onSelect={() => {
                  handleAddTag([...value, tag])
                }}
              >
                <Badge
                  className="space-y-1 text-gray-100"
                  style={{ background: getTagColor(tag.color) }}
                  variant="outline"
                >
                  {tag.name}
                </Badge>
              </CommandItem>
            ))}
            <div ref={ref}></div>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
