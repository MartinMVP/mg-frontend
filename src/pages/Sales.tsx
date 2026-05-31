import { useEffect, useState } from 'react'
import NotificationBell from '../components/NotificationBell'
import { api } from '../lib/api'

type AccountSale = {
  _id: string
  buyerId?: { name?: string }
  listingId?: {
    animal?: {
      name?: string
      tag?: string
      breed?: { name?: string }
    }
  }
  finalPrice: number
  status: string
}

function animalLabel(item: AccountSale) {
  const animal = item.listingId?.animal
  const name = animal?.name || animal?.tag || 'Animal'
  const breed = animal?.breed?.name
  return breed ? `${name} · ${breed}` : name
}

export default function Sales() {
  const [items, setItems] = useState<AccountSale[]>([])
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState('')
  const [workingId, setWorkingId] = useState('')

  async function load() {
    setLoading(true)
    try {
      const { data } = await api.get('/account/sales')
      setItems(Array.isArray(data) ? data : [])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [])

  async function updateSaleStatus(id: string, action: 'confirm' | 'cancel') {
    setWorkingId(id)
    setMessage('')

    try {
      const { data } = await api.post(`/sales/${id}/${action}`)
      setItems((prev) =>
        prev.map((item) =>
          item._id === id ? { ...item, status: data?.status || item.status } : item,
        ),
      )
      setMessage(action === 'confirm' ? 'Venta confirmada.' : 'Venta cancelada.')
    } catch (err: any) {
      setMessage(err?.response?.data?.error || 'No se pudo actualizar la venta.')
    } finally {
      setWorkingId('')
    }
  }

  return (
    <main className="mg-page">
      <div className="mg-header">
        <div>
          <h1>Ventas</h1>
          <nav className="mg-nav">
            <a href="/dashboard">Dashboard</a>
            <a href="/account/purchases">Compras</a>
            <a href="/auctions">Subastas</a>
          </nav>
        </div>
        <NotificationBell />
      </div>

      {loading && <p>Cargando...</p>}

      {!loading && items.length === 0 && (
        <p>No tienes ventas registradas.</p>
      )}

      {message && <p>{message}</p>}

      <div className="mg-grid">
        {items.map((item) => {
          const canUpdate = item.status === 'pending_contact' || item.status === 'contacted'
          const isWorking = workingId === item._id

          return (
            <article className="mg-card" key={item._id}>
              <h3>{animalLabel(item)}</h3>
              <p>Comprador: <b>{item.buyerId?.name || 'Comprador'}</b></p>
              <p>Precio final: <b>${Number(item.finalPrice || 0).toLocaleString('es-MX')} MXN</b></p>
              <p>Status: <b>{item.status}</b></p>

              {canUpdate && (
                <div className="mg-actions">
                  <button
                    type="button"
                    disabled={Boolean(workingId)}
                    onClick={() => updateSaleStatus(item._id, 'confirm')}
                  >
                    {isWorking ? 'Procesando...' : 'Confirmar venta'}
                  </button>
                  <button
                    type="button"
                    disabled={Boolean(workingId)}
                    onClick={() => updateSaleStatus(item._id, 'cancel')}
                  >
                    {isWorking ? 'Procesando...' : 'Cancelar venta'}
                  </button>
                </div>
              )}
            </article>
          )
        })}
      </div>
    </main>
  )
}
