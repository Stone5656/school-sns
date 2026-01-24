import { createLazyFileRoute } from '@tanstack/react-router'

export const Route = createLazyFileRoute('/timeline/artifacts/edit/$id/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/timeline/artifacts/edit/$id"!</div>
}
