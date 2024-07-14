import { useQuery } from '@tanstack/react-query'
import { compareDesc, format } from 'date-fns'
import { Plus, Trash } from 'lucide-react'
import { useSearchParams } from 'react-router-dom'

import {
  getSearchTokenByType,
  SearchToken,
  SearchtokenType,
} from '@/api/get-search-tokens-by-type.ts'
import {
  AlertDialog,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog.tsx'
import { Button } from '@/components/ui/button.tsx'
import { Dialog, DialogTrigger } from '@/components/ui/dialog.tsx'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select.tsx'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table.tsx'
import { DeleteSearchTokenDialog } from '@/pages/app/admin/search-tokens/delete-search-token-dialog.tsx'

import { EmptyLoadingTable } from '../../scrapping-report/empty-loading-table.tsx'
import { AddNewSearchTokenDialog } from './add-new-search-token-dialog.tsx'

export const searchTokenTypeParam = 'search-token-type' as const
export const searchTokenQueryKey = 'search-tokens' as const

function formatSearchTokenList(list: SearchToken[]) {
  return list
    .sort((a, b) => compareDesc(a.createdAt, b.createdAt))
    .map((token) => ({
      id: token.id,
      token: token.token,
      type: token.type,
      createdAt: format(new Date(token.createdAt), 'dd/MM/yyyy'),
    }))
}

export function SearchTokens() {
  const [params, setParams] = useSearchParams()

  const currentTokenType =
    (params.get(searchTokenTypeParam) as SearchtokenType) ?? 'ANIME'

  const {
    data: searchTokens = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: [searchTokenQueryKey, currentTokenType],
    queryFn: () => getSearchTokenByType(currentTokenType),
    select: formatSearchTokenList,
  })

  function setTokenType(type: SearchtokenType) {
    setParams((params) => {
      params.set(searchTokenTypeParam, type)
      return params
    })
  }

  if (error) {
    return <div>Erro ao carregar tokens</div>
  }

  return (
    <section className="flex flex-col gap-4">
      <h1 className="text-center text-3xl font-bold tracking-tighter md:text-left">
        Tokens de busca
      </h1>

      <p className="text-center text-sm text-gray-500 md:text-left">
        Tokens de busca são usados para identificar novas atualizações de obras
      </p>

      <aside className="flex justify-between">
        <Select
          onValueChange={(value) => setTokenType(value as SearchtokenType)}
          value={currentTokenType}
          defaultValue={currentTokenType}
        >
          <SelectTrigger className="h-10 w-full max-w-[200px] ">
            <SelectValue placeholder="Selecione o tipo o token" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ANIME">
              <span className="text-sm">Anime</span>
            </SelectItem>

            <SelectItem value="MANGA">
              <span className="text-sm">Manga</span>
            </SelectItem>
          </SelectContent>
        </Select>

        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline">
              <Plus className="mr-2 size-4" />
              Adicionar token
            </Button>
          </DialogTrigger>

          <AddNewSearchTokenDialog />
        </Dialog>
      </aside>

      <div className="rounded-sm border">
        <Table>
          <TableHeader>
            <TableHead>Id</TableHead>
            <TableHead>Token</TableHead>
            <TableHead>Tipo</TableHead>
            <TableHead>Criado em</TableHead>
            <TableHead></TableHead>
          </TableHeader>
          <TableBody>
            {isLoading && <EmptyLoadingTable />}

            {searchTokens.map((token) => (
              <TableRow key={token.id}>
                <TableCell>{token.id}</TableCell>
                <TableCell>{token.token}</TableCell>
                <TableCell>{token.type}</TableCell>
                <TableCell>{token.createdAt}</TableCell>
                <TableCell>
                  <AlertDialog>
                    <DeleteSearchTokenDialog searchToken={token} />
                    <AlertDialogTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <Trash className="size-4" />
                      </Button>
                    </AlertDialogTrigger>
                  </AlertDialog>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </section>
  )
}
