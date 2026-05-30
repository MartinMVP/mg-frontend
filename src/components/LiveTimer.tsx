import { useEffect, useState } from 'react'

export default function LiveTimer({ endsAt }: { endsAt?: string }) {
  const [left, setLeft] = useState('--:--')

  useEffect(() => {
    if (!endsAt) return

    const target = new Date(endsAt).getTime()

    const tick = () => {
      const diff = Math.max(0, target - Date.now())
      const m = Math.floor(diff / 60000)
      const s = Math.floor((diff % 60000) / 1000)
      setLeft(`${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`)
    }

    tick()
    const id = window.setInterval(tick, 1000)
    return () => window.clearInterval(id)
  }, [endsAt])

  return <span>{left}</span>
}