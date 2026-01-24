import { createLazyFileRoute } from '@tanstack/react-router'

export const Route = createLazyFileRoute('/profile/$id/$userName/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/profile/$id/$userName/"!</div>
}
