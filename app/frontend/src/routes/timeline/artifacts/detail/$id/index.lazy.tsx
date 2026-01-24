import { createLazyFileRoute } from '@tanstack/react-router'

export const Route = createLazyFileRoute('/timeline/artifacts/detail/$id/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/timeline/artifacts/detail/$id"!</div>
}
