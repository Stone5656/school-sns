import { createLazyFileRoute } from '@tanstack/react-router'

export const Route = createLazyFileRoute('/timeline/scraps/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/scraps/" hoge!</div>
}
