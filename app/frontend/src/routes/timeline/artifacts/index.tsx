import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/timeline/artifacts/')({
  loader: () => console.log('Loading /timeline/artifacts/ route'),
})
