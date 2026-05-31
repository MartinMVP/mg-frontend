import { useEffect, useState } from 'react'
import NotificationBell from '../components/NotificationBell'
import { api } from '../lib/api'

type AccountResult = {
  _id: string
  listingId?: {
    animal?: {
      name?: string
      tag?: string
      breed?: { name?: string }
    }
  }
  finalPrice: number
  closedAt: string
  status: string
}

function animalLabel(item: AccountResult) {
  const animal = item.listingId?.animal
  const name = animal?.name || animal?.tag || 'Animal'
  const breed = animal?.breed?.name
  return breed ? `${name} · ${breed}` : name
}

export default function Purchases() {
  const [items, setItems] = useState<AccountResult[]>([])
  const [loading, setLoading] = useState(true)

  async function load() {
    setLoading(true)
    try {
      const { data } = await api.get('/account/purchases')
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
          <h1>Compras</h1>
          <nav className="mg-nav">
            <a href="/dashboard">Dashboard</a>
            <a href="/account/sales">Ventas</a>
            <a href="/auctions">Subastas</a>
          </nav>
        </div>
        <NotificationBell />
      </div>

      {loading && <p>Cargando...</p>}

      {!loading && items.length === 0 && (
        <p>No tienes compras registradas.</p>
      )}

      <div className="mg-grid">
        {items.map((item) => (
          <article className="mg-card" key={item._id}>
            <h3>{animalLabel(item)}</h3>
            <p>Precio final: <b>${Number(item.finalPrice || 0).toLocaleString('es-MX')} MXN</b></p>
            <p>Fecha cierre: {new Date(item.closedAt).toLocaleDateString('es-MX')}</p>
            <p>Status: <b>{item.status}</b></p>
          </article>
        ))}
      </div>
    </main>
  )
}
