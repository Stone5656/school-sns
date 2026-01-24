import { createLazyFileRoute } from '@tanstack/react-router'

export const Route = createLazyFileRoute('/timeline/scraps/create/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/timeline/scraps/create/"!</div>
}
