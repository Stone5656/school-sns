import { Outlet, createFileRoute } from '@tanstack/react-router'
import z from 'zod'
import SearchBar from '@/features/search/components/SearchBar'

const searchParamsSchema = z.object({
  keyword: z.string().nullable().default(null),
})

export const Route = createFileRoute('/search')({
  validateSearch: searchParamsSchema,
  component: RouteComponent,
})

function RouteComponent() {
  const { keyword } = Route.useSearch()

  return (
    <div className="flex flex-col gap-5 w-full items-center px-5 py-3 bg-slate-50">
      <SearchBar keyword={keyword} />
      <Outlet />
    </div>
  )
}
