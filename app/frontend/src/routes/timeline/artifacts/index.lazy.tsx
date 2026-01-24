import { createLazyFileRoute } from '@tanstack/react-router'

export const Route = createLazyFileRoute('/timeline/artifacts/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/artifacts/"!</div>
}
