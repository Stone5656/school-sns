import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/search/result/')({
  loader: () => console.log('Loading /search/result/ route'),
})
