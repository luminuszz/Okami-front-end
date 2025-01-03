module.exports = {
  okami: {
    input: {
      target: './swagger.json',
      filters: {
        mode: 'include',
        tags: ['calendar'],
        schemas: [/Calendar/],
      },
    },
    output: {
      target: 'src/api/generated/okami.ts',
      schemas: 'src/api/generated/models',
      client: 'react-query',
      override: {
        mutator: {
          path: 'src/lib/axios.ts',
          name: 'customInstance',
        },
        query: {
          useInfinite: true,
          useInfiniteQueryParam: 'page',
        },
      },
    },
  },
}
