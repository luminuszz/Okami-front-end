import { Dialog } from '@radix-ui/react-dialog'
import { formatDistance, parseISO } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { Book, BookCheck, Clock } from 'lucide-react'

import { WorkType } from '@/api/schemas'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
} from '@/components/ui/card'
import { DialogTrigger } from '@/components/ui/dialog'

import { EditWorkFormDialog } from './edit-work-form'
import { MarkWorksAsReadDialog } from './mark-work-as-read'

export interface WorksCardProps {
  work: WorkType
}

export function WorkCard({ work }: WorksCardProps) {
  const updatedAt = formatDistance(
    parseISO(work.nextChapterUpdatedAt ?? work.updatedAt),
    new Date(),
    {
      addSuffix: true,
      includeSeconds: true,
      locale: ptBR,
    },
  )

  const newChapter =
    work.category === 'ANIME' ? 'Novo Episodio ' : 'Novo Capitulo'

  const lastChapter =
    work.category === 'ANIME' ? 'Último episodio ' : 'Último Capitulo '

  return (
    <>
      <Card>
        <CardHeader>
          <CardDescription className="truncate text-center text-lg">
            {work.name}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col justify-center gap-4 text-center">
          <div className="h-[400px] w-full">
            <img
              className="size-full rounded bg-cover"
              src={work.imageUrl}
              alt={work.name}
            />
          </div>

          {work.hasNewChapter ? (
            <div className="flex items-center justify-center gap-1">
              <BookCheck className="size-5 text-green-500" />
              <strong className="text-md text-green-500">{`${newChapter} ${work.nextChapter}`}</strong>
            </div>
          ) : (
            <div className="flex items-center justify-center gap-1">
              <Book className="size-5" />
              <span className="text-md text-muted-foreground">{`${lastChapter} ${work.chapter}`}</span>
            </div>
          )}

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
                imageUrl: work.imageUrl,
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
            <Button
              variant="link"
              disabled
              className="font-bold text-green-500"
            >
              Finalizado
            </Button>
          )}
        </CardFooter>
      </Card>
    </>
  )
}
