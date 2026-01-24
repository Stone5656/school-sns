import { createLazyFileRoute } from '@tanstack/react-router'

export const Route = createLazyFileRoute('/search/result/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/search/result/"!</div>
}
