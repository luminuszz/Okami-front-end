/**
 * Generated by orval v7.3.0 🍺
 * Do not edit manually.
 * Okami API
 * The Okami rest api
 * OpenAPI spec version: 1.0
 */

// esli

import type {
  DataTag,
  DefinedInitialDataOptions,
  DefinedUseInfiniteQueryResult,
  DefinedUseQueryResult,
  InfiniteData,
  MutationFunction,
  QueryFunction,
  QueryKey,
  UndefinedInitialDataOptions,
  UseInfiniteQueryOptions,
  UseInfiniteQueryResult,
  UseMutationOptions,
  UseMutationResult,
  UseQueryOptions,
  UseQueryResult,
} from '@tanstack/react-query'
import { useInfiniteQuery, useMutation, useQuery } from '@tanstack/react-query'

import { customInstance } from '@/lib/axios.ts'

import type {
  AddRowInCalendarDto,
  CalendarModel,
  CreateCalendarDto,
} from './models'

type SecondParameter<T extends (...args: any) => any> = Parameters<T>[1]

export const calendarControllerCreate = (
  createCalendarDto: CreateCalendarDto,
  options?: SecondParameter<typeof customInstance>,
  signal?: AbortSignal,
) => {
  return customInstance<void>(
    {
      url: `/calendar`,
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      data: createCalendarDto,
      signal,
    },
    options,
  )
}

export const getCalendarControllerCreateMutationOptions = <
  TError = unknown,
  TContext = unknown,
>(options?: {
  mutation?: UseMutationOptions<
    Awaited<ReturnType<typeof calendarControllerCreate>>,
    TError,
    { data: CreateCalendarDto },
    TContext
  >
  request?: SecondParameter<typeof customInstance>
}): UseMutationOptions<
  Awaited<ReturnType<typeof calendarControllerCreate>>,
  TError,
  { data: CreateCalendarDto },
  TContext
> => {
  const { mutation: mutationOptions, request: requestOptions } = options ?? {}

  const mutationFn: MutationFunction<
    Awaited<ReturnType<typeof calendarControllerCreate>>,
    { data: CreateCalendarDto }
  > = (props) => {
    const { data } = props ?? {}

    return calendarControllerCreate(data, requestOptions)
  }

  return { mutationFn, ...mutationOptions }
}

export type CalendarControllerCreateMutationResult = NonNullable<
  Awaited<ReturnType<typeof calendarControllerCreate>>
>
export type CalendarControllerCreateMutationBody = CreateCalendarDto
export type CalendarControllerCreateMutationError = unknown

export const useCalendarControllerCreate = <
  TError = unknown,
  TContext = unknown,
>(options?: {
  mutation?: UseMutationOptions<
    Awaited<ReturnType<typeof calendarControllerCreate>>,
    TError,
    { data: CreateCalendarDto },
    TContext
  >
  request?: SecondParameter<typeof customInstance>
}): UseMutationResult<
  Awaited<ReturnType<typeof calendarControllerCreate>>,
  TError,
  { data: CreateCalendarDto },
  TContext
> => {
  const mutationOptions = getCalendarControllerCreateMutationOptions(options)

  return useMutation(mutationOptions)
}

export const calendarControllerFetchUserCalendar = (
  options?: SecondParameter<typeof customInstance>,
  signal?: AbortSignal,
) => {
  return customInstance<CalendarModel>(
    { url: `/calendar`, method: 'GET', signal },
    options,
  )
}

export const getCalendarControllerFetchUserCalendarQueryKey = () => {
  return [`/calendar`] as const
}

export const getCalendarControllerFetchUserCalendarInfiniteQueryOptions = <
  TData = InfiniteData<
    Awaited<ReturnType<typeof calendarControllerFetchUserCalendar>>
  >,
  TError = CalendarModel,
>(options?: {
  query?: Partial<
    UseInfiniteQueryOptions<
      Awaited<ReturnType<typeof calendarControllerFetchUserCalendar>>,
      TError,
      TData
    >
  >
  request?: SecondParameter<typeof customInstance>
}) => {
  const { query: queryOptions, request: requestOptions } = options ?? {}

  const queryKey =
    queryOptions?.queryKey ?? getCalendarControllerFetchUserCalendarQueryKey()

  const queryFn: QueryFunction<
    Awaited<ReturnType<typeof calendarControllerFetchUserCalendar>>
  > = ({ signal }) =>
    calendarControllerFetchUserCalendar(requestOptions, signal)

  return { queryKey, queryFn, ...queryOptions } as UseInfiniteQueryOptions<
    Awaited<ReturnType<typeof calendarControllerFetchUserCalendar>>,
    TError,
    TData
  > & { queryKey: DataTag<QueryKey, TData> }
}

export type CalendarControllerFetchUserCalendarInfiniteQueryResult =
  NonNullable<Awaited<ReturnType<typeof calendarControllerFetchUserCalendar>>>
export type CalendarControllerFetchUserCalendarInfiniteQueryError =
  CalendarModel

export function useCalendarControllerFetchUserCalendarInfinite<
  TData = InfiniteData<
    Awaited<ReturnType<typeof calendarControllerFetchUserCalendar>>
  >,
  TError = CalendarModel,
>(options: {
  query: Partial<
    UseInfiniteQueryOptions<
      Awaited<ReturnType<typeof calendarControllerFetchUserCalendar>>,
      TError,
      TData
    >
  > &
    Pick<
      DefinedInitialDataOptions<
        Awaited<ReturnType<typeof calendarControllerFetchUserCalendar>>,
        TError,
        TData
      >,
      'initialData'
    >
  request?: SecondParameter<typeof customInstance>
}): DefinedUseInfiniteQueryResult<TData, TError> & {
  queryKey: DataTag<QueryKey, TData>
}
export function useCalendarControllerFetchUserCalendarInfinite<
  TData = InfiniteData<
    Awaited<ReturnType<typeof calendarControllerFetchUserCalendar>>
  >,
  TError = CalendarModel,
>(options?: {
  query?: Partial<
    UseInfiniteQueryOptions<
      Awaited<ReturnType<typeof calendarControllerFetchUserCalendar>>,
      TError,
      TData
    >
  > &
    Pick<
      UndefinedInitialDataOptions<
        Awaited<ReturnType<typeof calendarControllerFetchUserCalendar>>,
        TError,
        TData
      >,
      'initialData'
    >
  request?: SecondParameter<typeof customInstance>
}): UseInfiniteQueryResult<TData, TError> & {
  queryKey: DataTag<QueryKey, TData>
}
export function useCalendarControllerFetchUserCalendarInfinite<
  TData = InfiniteData<
    Awaited<ReturnType<typeof calendarControllerFetchUserCalendar>>
  >,
  TError = CalendarModel,
>(options?: {
  query?: Partial<
    UseInfiniteQueryOptions<
      Awaited<ReturnType<typeof calendarControllerFetchUserCalendar>>,
      TError,
      TData
    >
  >
  request?: SecondParameter<typeof customInstance>
}): UseInfiniteQueryResult<TData, TError> & {
  queryKey: DataTag<QueryKey, TData>
}

export function useCalendarControllerFetchUserCalendarInfinite<
  TData = InfiniteData<
    Awaited<ReturnType<typeof calendarControllerFetchUserCalendar>>
  >,
  TError = CalendarModel,
>(options?: {
  query?: Partial<
    UseInfiniteQueryOptions<
      Awaited<ReturnType<typeof calendarControllerFetchUserCalendar>>,
      TError,
      TData
    >
  >
  request?: SecondParameter<typeof customInstance>
}): UseInfiniteQueryResult<TData, TError> & {
  queryKey: DataTag<QueryKey, TData>
} {
  const queryOptions =
    getCalendarControllerFetchUserCalendarInfiniteQueryOptions(options)

  const query = useInfiniteQuery(queryOptions) as UseInfiniteQueryResult<
    TData,
    TError
  > & { queryKey: DataTag<QueryKey, TData> }

  query.queryKey = queryOptions.queryKey

  return query
}

export const getCalendarControllerFetchUserCalendarQueryOptions = <
  TData = Awaited<ReturnType<typeof calendarControllerFetchUserCalendar>>,
  TError = CalendarModel,
>(options?: {
  query?: Partial<
    UseQueryOptions<
      Awaited<ReturnType<typeof calendarControllerFetchUserCalendar>>,
      TError,
      TData
    >
  >
  request?: SecondParameter<typeof customInstance>
}) => {
  const { query: queryOptions, request: requestOptions } = options ?? {}

  const queryKey =
    queryOptions?.queryKey ?? getCalendarControllerFetchUserCalendarQueryKey()

  const queryFn: QueryFunction<
    Awaited<ReturnType<typeof calendarControllerFetchUserCalendar>>
  > = ({ signal }) =>
    calendarControllerFetchUserCalendar(requestOptions, signal)

  return { queryKey, queryFn, ...queryOptions } as UseQueryOptions<
    Awaited<ReturnType<typeof calendarControllerFetchUserCalendar>>,
    TError,
    TData
  > & { queryKey: DataTag<QueryKey, TData> }
}

export type CalendarControllerFetchUserCalendarQueryResult = NonNullable<
  Awaited<ReturnType<typeof calendarControllerFetchUserCalendar>>
>
export type CalendarControllerFetchUserCalendarQueryError = CalendarModel

export function useCalendarControllerFetchUserCalendar<
  TData = Awaited<ReturnType<typeof calendarControllerFetchUserCalendar>>,
  TError = CalendarModel,
>(options: {
  query: Partial<
    UseQueryOptions<
      Awaited<ReturnType<typeof calendarControllerFetchUserCalendar>>,
      TError,
      TData
    >
  > &
    Pick<
      DefinedInitialDataOptions<
        Awaited<ReturnType<typeof calendarControllerFetchUserCalendar>>,
        TError,
        TData
      >,
      'initialData'
    >
  request?: SecondParameter<typeof customInstance>
}): DefinedUseQueryResult<TData, TError> & {
  queryKey: DataTag<QueryKey, TData>
}
export function useCalendarControllerFetchUserCalendar<
  TData = Awaited<ReturnType<typeof calendarControllerFetchUserCalendar>>,
  TError = CalendarModel,
>(options?: {
  query?: Partial<
    UseQueryOptions<
      Awaited<ReturnType<typeof calendarControllerFetchUserCalendar>>,
      TError,
      TData
    >
  > &
    Pick<
      UndefinedInitialDataOptions<
        Awaited<ReturnType<typeof calendarControllerFetchUserCalendar>>,
        TError,
        TData
      >,
      'initialData'
    >
  request?: SecondParameter<typeof customInstance>
}): UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData> }
export function useCalendarControllerFetchUserCalendar<
  TData = Awaited<ReturnType<typeof calendarControllerFetchUserCalendar>>,
  TError = CalendarModel,
>(options?: {
  query?: Partial<
    UseQueryOptions<
      Awaited<ReturnType<typeof calendarControllerFetchUserCalendar>>,
      TError,
      TData
    >
  >
  request?: SecondParameter<typeof customInstance>
}): UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData> }

export function useCalendarControllerFetchUserCalendar<
  TData = Awaited<ReturnType<typeof calendarControllerFetchUserCalendar>>,
  TError = CalendarModel,
>(options?: {
  query?: Partial<
    UseQueryOptions<
      Awaited<ReturnType<typeof calendarControllerFetchUserCalendar>>,
      TError,
      TData
    >
  >
  request?: SecondParameter<typeof customInstance>
}): UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData> } {
  const queryOptions =
    getCalendarControllerFetchUserCalendarQueryOptions(options)

  const query = useQuery(queryOptions) as UseQueryResult<TData, TError> & {
    queryKey: DataTag<QueryKey, TData>
  }

  query.queryKey = queryOptions.queryKey

  return query
}

export const calendarControllerAddRowInCalendar = (
  addRowInCalendarDto: AddRowInCalendarDto,
  options?: SecondParameter<typeof customInstance>,
  signal?: AbortSignal,
) => {
  return customInstance<void>(
    {
      url: `/calendar/row`,
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      data: addRowInCalendarDto,
      signal,
    },
    options,
  )
}

export const getCalendarControllerAddRowInCalendarMutationOptions = <
  TError = unknown,
  TContext = unknown,
>(options?: {
  mutation?: UseMutationOptions<
    Awaited<ReturnType<typeof calendarControllerAddRowInCalendar>>,
    TError,
    { data: AddRowInCalendarDto },
    TContext
  >
  request?: SecondParameter<typeof customInstance>
}): UseMutationOptions<
  Awaited<ReturnType<typeof calendarControllerAddRowInCalendar>>,
  TError,
  { data: AddRowInCalendarDto },
  TContext
> => {
  const { mutation: mutationOptions, request: requestOptions } = options ?? {}

  const mutationFn: MutationFunction<
    Awaited<ReturnType<typeof calendarControllerAddRowInCalendar>>,
    { data: AddRowInCalendarDto }
  > = (props) => {
    const { data } = props ?? {}

    return calendarControllerAddRowInCalendar(data, requestOptions)
  }

  return { mutationFn, ...mutationOptions }
}

export type CalendarControllerAddRowInCalendarMutationResult = NonNullable<
  Awaited<ReturnType<typeof calendarControllerAddRowInCalendar>>
>
export type CalendarControllerAddRowInCalendarMutationBody = AddRowInCalendarDto
export type CalendarControllerAddRowInCalendarMutationError = unknown

export const useCalendarControllerAddRowInCalendar = <
  TError = unknown,
  TContext = unknown,
>(options?: {
  mutation?: UseMutationOptions<
    Awaited<ReturnType<typeof calendarControllerAddRowInCalendar>>,
    TError,
    { data: AddRowInCalendarDto },
    TContext
  >
  request?: SecondParameter<typeof customInstance>
}): UseMutationResult<
  Awaited<ReturnType<typeof calendarControllerAddRowInCalendar>>,
  TError,
  { data: AddRowInCalendarDto },
  TContext
> => {
  const mutationOptions =
    getCalendarControllerAddRowInCalendarMutationOptions(options)

  return useMutation(mutationOptions)
}
