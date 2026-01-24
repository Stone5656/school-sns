import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/timeline/artifacts/detail/$id/')({
  loader: () => console.log('Loading /timeline/artifacts/detail/$id/ route'),
})
