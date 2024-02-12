import { Skeleton } from '@/components/ui/skeleton'
import { TableCell, TableRow } from '@/components/ui/table'

export function EmptyLoadingTable() {
  return Array.from({ length: 10 }, (_, index) => (
    <TableRow key={index}>
      <TableCell>
        <Skeleton className="size-5 w-[200px] rounded-sm" />
      </TableCell>
      <TableCell>
        <Skeleton className="size-5 w-[200px] rounded-sm" />
      </TableCell>
      <TableCell>
        <Skeleton className="size-5 w-[200px] rounded-sm" />
      </TableCell>
      <TableCell>
        <Skeleton className="size-5 w-[200px] rounded-sm" />
      </TableCell>
      <TableCell>
        <Skeleton className="size-5 w-[200px] rounded-sm" />
      </TableCell>
      <TableCell>
        <Skeleton className="size-5 w-[200px] rounded-sm" />
      </TableCell>{' '}
      <TableCell>
        <Skeleton className="size-5 w-[200px] rounded-sm" />
      </TableCell>
    </TableRow>
  ))
}
