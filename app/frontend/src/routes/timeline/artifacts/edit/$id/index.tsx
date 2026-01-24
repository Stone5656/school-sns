import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/timeline/artifacts/edit/$id/')({
  loader: () => console.log('Loading /timeline/artifacts/edit/$id/ route'),
})
