import { createFileRoute } from '@tanstack/react-router'
import Flow from '../components/Flow'

export const Route = createFileRoute('/')({ component: Home })

function Home() {
  return (
    <div className="h-full">
      <Flow />
    </div>
  )
}
