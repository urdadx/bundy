import { WorldSelector } from '@/components/select-world'
import { createFileRoute } from '@tanstack/react-router'
import { z } from 'zod'

const worldSearchSchema = z.object({
  world: z.string().optional().catch('Meadow'),
})

export const Route = createFileRoute('/worlds')({
  validateSearch: (search) => worldSearchSchema.parse(search),
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div className="bg-[#fffcf2] min-h-screen">
      <WorldSelector />
    </div>
  )
}