import { max } from 'lodash'
import { useSearchParams } from 'react-router-dom'
import { z } from 'zod'

import {
  Pagination as PaginationComponent,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from './ui/pagination'

export interface PaginationProps {
  totalOfPages: number
}

export function Pagination({ totalOfPages }: PaginationProps) {
  const [query, setQuery] = useSearchParams()

  const currentPage = z.coerce
    .number()
    .transform((value) => value - 1)
    .parse(query.get('page') ?? '1')

  const uiLimit = 4

  const handlePageChange = (page: number) => {
    setQuery((query) => {
      if (page >= totalOfPages || page < 0) {
        return query
      }

      query.set('page', String(page))

      return query
    })
  }

  const listOfPages = Array.from({ length: totalOfPages })
    .map((_, index) => index)
    .slice(max([0, currentPage - uiLimit]), currentPage + uiLimit + 1)

  return (
    <PaginationComponent>
      <PaginationContent>
        <PaginationItem>
          {currentPage > 0 && (
            <PaginationPrevious
              className="cursor-pointer"
              onClick={() => {
                handlePageChange(currentPage - 1)
              }}
            />
          )}
        </PaginationItem>
        {listOfPages.map((value) => (
          <PaginationItem key={value} className="cursor-pointer">
            <PaginationLink
              isActive={value === currentPage}
              onClick={() => {
                handlePageChange(value + 1)
              }}
            >
              {value + 1}
            </PaginationLink>
          </PaginationItem>
        ))}

        {!listOfPages.includes(totalOfPages - 1) && <PaginationEllipsis />}

        {currentPage + 1 < totalOfPages && (
          <>
            <PaginationItem>
              <PaginationNext
                className="cursor-pointer"
                onClick={() => handlePageChange(currentPage + 1)}
              />
            </PaginationItem>
          </>
        )}
      </PaginationContent>
    </PaginationComponent>
  )
}
