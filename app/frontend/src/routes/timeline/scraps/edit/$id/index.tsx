import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/timeline/scraps/edit/$id/')({
  loader: () => {
    console.log('Loading /timeline/scraps/edit/$id/ route')
  },
})
