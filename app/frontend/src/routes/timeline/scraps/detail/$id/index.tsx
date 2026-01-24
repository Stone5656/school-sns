import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/timeline/scraps/detail/$id/')({
  loader: () => {
    console.log('Loading /timeline/scraps/detail/$id/ route')
  },
})
