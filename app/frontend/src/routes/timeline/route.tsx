import { Outlet, createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/timeline')({
  component: RouteComponent,
})

function RouteComponent() {
  return <Outlet />
}
