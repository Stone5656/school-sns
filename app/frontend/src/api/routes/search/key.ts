export const searchKeys = {
  all: 'search' as const,
  results: () => [searchKeys.all, 'results'] as const,
  result: (keyword: string, type?: string) =>
    [...searchKeys.results(), { keyword, type }] as const,
}
