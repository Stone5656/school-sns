import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/timeline/scraps/')({
  loader: () => console.log('Loading /timeline/scraps/ route'),
})
