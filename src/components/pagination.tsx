import { max } from 'lodash'
import { useSearchParams } from 'react-router-dom'

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
  currentPage: number
}

export function Pagination({ totalOfPages, currentPage }: PaginationProps) {
  const [, setQuery] = useSearchParams()

  const uiLimit = 4

  const handlePageChange = (page: number) => {
    if (page >= totalOfPages || page < 0) {
      return
    }

    setQuery((query) => {
      query.set('page', String(page + 1))

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
                handlePageChange(value)
              }}
            >
              {value + 1}
            </PaginationLink>
          </PaginationItem>
        ))}

        {!listOfPages.includes(totalOfPages - 1) && <PaginationEllipsis />}

        {currentPage < totalOfPages && (
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
