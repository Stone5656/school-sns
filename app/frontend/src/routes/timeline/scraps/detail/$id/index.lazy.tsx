import { createLazyFileRoute } from '@tanstack/react-router'

export const Route = createLazyFileRoute('/timeline/scraps/detail/$id/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/timeline/scraps/detail/$id"!</div>
}
