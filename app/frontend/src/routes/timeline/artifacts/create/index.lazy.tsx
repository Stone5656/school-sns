import { createLazyFileRoute } from '@tanstack/react-router'

export const Route = createLazyFileRoute('/timeline/artifacts/create/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/timeline/artifacts/create/"!</div>
}
