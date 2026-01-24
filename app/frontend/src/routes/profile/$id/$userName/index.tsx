import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/profile/$id/$userName/')({
  loader: () => {
    console.log('Loading /profile/$id/$userName/ route')
  },
})
