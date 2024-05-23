import { Dialog } from '@radix-ui/react-dialog'
import { formatDistance, parseISO } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { Book, BookCheck, Clock, Trash } from 'lucide-react'
import colors from 'tailwindcss/colors'

import { WorkType } from '@/api/fetch-for-works-with-filter'
import { AlertDialog, AlertDialogTrigger } from '@/components/ui/alert-dialog'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { DialogTrigger } from '@/components/ui/dialog'
import { ConfirmDeleteWorkAlertDialog } from '@/pages/app/works/confirm-delete-work-alert-dialog'

import { EditWorkFormDialog } from './edit-work-form'
import { MarkWorksAsReadDialog } from './mark-work-as-read'

export interface WorksCardProps {
  work: WorkType
}

export function WorkCard({ work }: WorksCardProps) {
  const updatedAt = formatDistance(
    parseISO(work.nextChapterUpdatedAt ?? work.updatedAt ?? work.createdAt),
    new Date(),
    {
      addSuffix: true,
      includeSeconds: true,
      locale: ptBR,
    },
  )

  function handleOpenUrl() {
    window.open(work.url, '_blank')
  }

  const newChapter =
    work.category === 'ANIME' ? 'Novo Episodio ' : 'Novo Capitulo'

  const lastChapter =
    work.category === 'ANIME' ? 'Último episodio ' : 'Último Capitulo '

  return (
    <Card className="max-w-xl">
      <div className="flex justify-end p-2">
        <AlertDialog>
          <ConfirmDeleteWorkAlertDialog
            work={{ name: work.name, workId: work.id }}
          />
          <AlertDialogTrigger asChild>
            <Button
              className="text-muted-foreground"
              variant="ghost"
              size="icon"
            >
              <Trash size="20" />
            </Button>
          </AlertDialogTrigger>
        </AlertDialog>
      </div>
      <CardHeader>
        <CardTitle className="truncate text-center text-lg">
          {work.name}
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col justify-center gap-4 text-center">
        <object data={work.imageUrl ?? ''} className="h-[400px] w-full">
          <img
            className="size-full rounded bg-cover"
            src="/okami-logo.png"
            alt={work.name}
          />
        </object>

        {work.hasNewChapter ? (
          <Button
            variant="link"
            className="text-md text-green-500"
            onClick={handleOpenUrl}
          >
            <BookCheck className="mr-2 size-5 text-green-500" />
            {`${newChapter} ${work.nextChapter}`}
          </Button>
        ) : (
          <Button
            variant="link"
            className="text-md text-muted-foreground"
            onClick={handleOpenUrl}
          >
            <Book className="mr-2 size-5" />
            {`${lastChapter} ${work.chapter}`}
          </Button>
        )}

        <div className="gap-2">
          {work.tags?.map((tag) => {
            const color =
              colors[tag.color as keyof typeof colors] ?? colors.gray

            return (
              <Badge
                className="text-gray-100"
                style={{ background: color[600] }}
                variant="outline"
                key={tag.id}
              >
                {tag.name}
              </Badge>
            )
          })}
        </div>

        <div className="flex items-center justify-center gap-1">
          <Clock className="size-5" />
          <span className="text-sm text-muted-foreground">{`Atualizado a ${updatedAt}`}</span>
        </div>
      </CardContent>
      <CardFooter className="flex justify-center gap-4">
        {work.hasNewChapter && (
          <Dialog>
            <MarkWorksAsReadDialog
              work={{
                id: work.id,
                chapter: work.nextChapter ?? work.chapter,
                name: work.name,
                type: work.category,
              }}
            />

            <DialogTrigger asChild>
              <Button>Marcar como lido</Button>
            </DialogTrigger>
          </Dialog>
        )}

        <Dialog>
          <EditWorkFormDialog
            work={{
              id: work.id,
              chapter: work.chapter,
              name: work.name,
              imageUrl: work.imageUrl ?? '',
              url: work.url,
              type: work.category,
              hasNewChapter: work.hasNewChapter,
            }}
          />

          <DialogTrigger asChild>
            <Button variant="outline">Editar</Button>
          </DialogTrigger>
        </Dialog>

        {work.isFinished && (
          <Button variant="link" disabled className="font-bold text-green-500">
            Finalizado
          </Button>
        )}

        {work.isDropped && (
          <Button variant="link" className="font-bold text-red-500" disabled>
            Dropado
          </Button>
        )}
      </CardFooter>
    </Card>
  )
}
