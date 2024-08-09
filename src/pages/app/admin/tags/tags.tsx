import { AlertDialog, AlertDialogTrigger } from '@radix-ui/react-alert-dialog'
import { useQuery } from '@tanstack/react-query'
import { map } from 'lodash'
import { Pencil, Search, Tag, Trash } from 'lucide-react'
import { FormEvent, useState } from 'react'
import { toast } from 'sonner'

import { filterTagsBySearch } from '@/api/filter-tags-by-search.ts'
import { getTagsPaged } from '@/api/get-tags-paged.ts'
import { Pagination } from '@/components/pagination.tsx'
import { Badge } from '@/components/ui/badge.tsx'
import { Button } from '@/components/ui/button.tsx'
import { Dialog, DialogTrigger } from '@/components/ui/dialog.tsx'
import { Input } from '@/components/ui/input.tsx'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table.tsx'
import { CreateTagDialog } from '@/pages/app/admin/tags/create-tag-dialog.tsx'
import { DeleteTagAlertConfirmDialog } from '@/pages/app/admin/tags/delete-tag-alert-confirm-dialog.tsx'
import { UpdateTagDialog } from '@/pages/app/admin/tags/update-tag-dialog.tsx'
import { getTagColor, useGetCurrentPage } from '@/utils/helpers.ts'

import { EmptyLoadingTable } from '../../scrapping-report/empty-loading-table.tsx'

export const getTagsQueryKey = 'tags' as const
export const filteredTagsQueryKey = 'filtered-tags' as const

const defaultItemPerPage = 20

export function Tags() {
  const currentPage = useGetCurrentPage()

  const [search, setSearch] = useState('')
  const { isLoading, data: results } = useQuery({
    queryKey: [getTagsQueryKey, currentPage],
    queryFn: () => getTagsPaged(currentPage),
    select({ totalOfPages, data }) {
      return {
        totalOfPages,
        tags: data.map((item) => ({
          ...item,
          themeColor: getTagColor(item.color),
        })),
      }
    },
  })

  const { data: filteredTags, refetch } = useQuery({
    queryKey: [filteredTagsQueryKey, { search }],
    queryFn: () => filterTagsBySearch(search),
    enabled: false,
    initialData: [],
    select(data) {
      return map(data, (item) => ({
        ...item,
        themeColor: getTagColor(item.color),
      }))
    },
  })

  function handleSubmitSearch(e: FormEvent) {
    e.preventDefault()

    if (!search) return

    refetch().then((query) => {
      if (!query.data?.length) {
        toast.error('Nenhuma tag encontrada')
      }
    })
  }

  const totalOfTags =
    filteredTags.length ?? defaultItemPerPage * (results?.totalOfPages ?? 0)

  const tagList = filteredTags.length ? filteredTags : results?.tags ?? []

  return (
    <section className="flex flex-col gap-4">
      <h1 className="text-center text-3xl font-bold tracking-tighter md:text-left">
        Tags
      </h1>

      <p className="text-center text-sm text-gray-500 md:text-left">
        Tags são utilizadas para categorizar os conteúdos das obras
      </p>

      <aside className="flex justify-between">
        <form className="flex items-center gap-4" onSubmit={handleSubmitSearch}>
          <Input
            placeholder="Pesquisar tag..."
            className="h-8 w-full max-w-[320px]"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <Button type="submit" variant="ghost" className="h-8">
            <Search className="size-4" />
          </Button>
        </form>

        <Dialog>
          <CreateTagDialog />
          <DialogTrigger asChild>
            <Button variant="outline">
              <Tag className="mr-2 size-4" />
              Adicionar Tag
            </Button>
          </DialogTrigger>
        </Dialog>
      </aside>

      <div className="rounded-sm border">
        <Table>
          <TableHeader>
            <TableHead>Id</TableHead>
            <TableHead>Nome</TableHead>
            <TableHead>Slug</TableHead>
            <TableHead>Cor</TableHead>
            <TableHead>Cor</TableHead>
          </TableHeader>
          <TableBody>{isLoading && <EmptyLoadingTable />}</TableBody>

          {tagList.map((tag) => (
            <TableRow key={tag.id}>
              <TableCell>{tag.id}</TableCell>
              <TableCell>{tag.name}</TableCell>
              <TableCell>{tag.slug}</TableCell>
              <TableCell>
                <Badge
                  className="text-gray-100"
                  style={{ background: tag.themeColor }}
                  variant="outline"
                  key={tag.id}
                >
                  {tag.color}
                </Badge>
              </TableCell>
              <TableCell>
                <Dialog>
                  <UpdateTagDialog tag={tag} />
                  <DialogTrigger asChild>
                    <Button size="icon" variant="ghost">
                      <Pencil className="size-4 text-muted-foreground" />
                    </Button>
                  </DialogTrigger>
                </Dialog>

                <AlertDialog>
                  <DeleteTagAlertConfirmDialog tag={tag} />
                  <AlertDialogTrigger asChild>
                    <Button size="icon" variant="ghost">
                      <Trash className="size-4 text-muted-foreground" />
                    </Button>
                  </AlertDialogTrigger>
                </AlertDialog>
              </TableCell>
            </TableRow>
          ))}
        </Table>
      </div>

      <div className="flex flex-col items-center justify-between md:flex-row">
        <p className="text-sm text-muted-foreground ">
          Total de {totalOfTags} tags
        </p>

        {!search && (
          <div className="flex">
            <Pagination
              totalOfPages={results?.totalOfPages ?? 0}
              currentPage={currentPage}
            />
          </div>
        )}
      </div>
    </section>
  )
}
