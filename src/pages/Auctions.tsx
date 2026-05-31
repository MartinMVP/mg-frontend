import { useEffect, useState } from 'react'
import { api } from '../lib/api'
import AuctionCard from '../components/AuctionCard'
import NotificationBell from '../components/NotificationBell'

export default function Auctions() {
  const [items, setItems] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  async function load() {
    setLoading(true)
    try {
      const { data } = await api.get('/auctions')
      setItems(Array.isArray(data) ? data : [])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [])

  return (
    <main className="mg-page">
      <div className="mg-header">
        <div>
          <h1>Subastas</h1>
          <nav className="mg-nav">
            <a href="/dashboard">Dashboard</a>
            <a href="/account/purchases">Compras</a>
            <a href="/account/sales">Ventas</a>
          </nav>
        </div>
        <NotificationBell />
      </div>

      {loading && <p>Cargando...</p>}

      {!loading && items.length === 0 && (
        <p>No hay subastas todavía.</p>
      )}

      <div className="mg-grid">
        {items.map((auction) => (
          <AuctionCard key={auction._id} auction={auction} />
        ))}
      </div>
    </main>
  )
}
