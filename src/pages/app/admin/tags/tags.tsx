import { AlertDialog, AlertDialogTrigger } from '@radix-ui/react-alert-dialog'
import { useQuery } from '@tanstack/react-query'
import { Pencil, Tag, Trash } from 'lucide-react'
import colors from 'tailwindcss/colors'

import { getTagsPaged } from '@/api/get-tags-paged.ts'
import { Pagination } from '@/components/pagination.tsx'
import { Badge } from '@/components/ui/badge.tsx'
import { Button } from '@/components/ui/button.tsx'
import { Dialog, DialogTrigger } from '@/components/ui/dialog.tsx'
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
import { ColorKey, useGetCurrentPage } from '@/utils/helpers.ts'

import { EmptyLoadingTable } from '../../scrapping-report/empty-loading-table.tsx'

export const getTagsQueryKey = 'tags' as const

const defaultItemPerPage = 20

export function Tags() {
  const currentPage = useGetCurrentPage()

  const { isLoading, data: results } = useQuery({
    queryKey: [getTagsQueryKey, currentPage],
    queryFn: () => getTagsPaged(currentPage),
    select({ totalOfPages, data }) {
      return {
        totalOfPages,
        tags: data.map((item) => ({
          ...item,
          themeColor: colors[item.color as ColorKey] ?? colors.gray,
        })),
      }
    },
  })

  const totalOfTags = defaultItemPerPage * (results?.totalOfPages ?? 0)

  return (
    <section className="flex flex-col gap-4">
      <h1 className="text-center text-3xl font-bold tracking-tighter md:text-left">
        Tags
      </h1>

      <p className="text-center text-sm text-gray-500 md:text-left">
        Tags são utilizadas para categorizar os conteúdos das obras
      </p>

      <aside className="flex justify-end">
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

          {results?.tags.map((tag) => (
            <TableRow key={tag.id}>
              <TableCell>{tag.id}</TableCell>
              <TableCell>{tag.name}</TableCell>
              <TableCell>{tag.slug}</TableCell>
              <TableCell>
                <Badge
                  className="text-gray-100"
                  style={{ background: tag.themeColor[600] }}
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

        <div className="flex">
          <Pagination
            totalOfPages={results?.totalOfPages ?? 0}
            currentPage={currentPage}
          />
        </div>
      </div>
    </section>
  )
}
