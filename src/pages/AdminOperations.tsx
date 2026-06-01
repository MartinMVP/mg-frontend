import { useEffect, useState } from 'react'
import NotificationBell from '../components/NotificationBell'
import { api } from '../lib/api'

type OperationStatus =
  | ''
  | 'pending_contact'
  | 'contacted'
  | 'sale_confirmed'
  | 'sale_cancelled'
  | 'in_dispute'

type Operation = {
  _id: string
  animal?: {
    name?: string
    tag?: string
    breed?: { name?: string }
  } | null
  seller?: { name?: string } | null
  buyer?: { name?: string } | null
  finalPrice: number
  status: string
  closedAt: string
}

const statusOptions: Array<{ value: OperationStatus; label: string }> = [
  { value: '', label: 'Todos' },
  { value: 'pending_contact', label: 'pending_contact' },
  { value: 'contacted', label: 'contacted' },
  { value: 'sale_confirmed', label: 'sale_confirmed' },
  { value: 'sale_cancelled', label: 'sale_cancelled' },
  { value: 'in_dispute', label: 'in_dispute' },
]

function animalLabel(item: Operation) {
  const name = item.animal?.name || item.animal?.tag || 'Animal'
  const breed = item.animal?.breed?.name
  return breed ? `${name} · ${breed}` : name
}

export default function AdminOperations() {
  const [items, setItems] = useState<Operation[]>([])
  const [status, setStatus] = useState<OperationStatus>('')
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState('')

  async function load(nextStatus = status) {
    setLoading(true)
    setMessage('')

    try {
      const params: Record<string, string | number> = { page: 1, limit: 20 }
      if (nextStatus) params.status = nextStatus

      const { data } = await api.get('/admin/operations', { params })
      setItems(Array.isArray(data?.items) ? data.items : [])
    } catch (err: any) {
      setItems([])
      setMessage(err?.response?.data?.error || 'No se pudieron cargar las operaciones.')
    } finally {
      setLoading(false)
    }
  }

  function handleStatusChange(value: OperationStatus) {
    setStatus(value)
    load(value)
  }

  useEffect(() => {
    load('')
  }, [])

  return (
    <main className="mg-page">
      <div className="mg-header">
        <div>
          <h1>Operaciones</h1>
          <nav className="mg-nav">
            <a href="/dashboard">Dashboard</a>
            <a href="/account/sales">Ventas</a>
            <a href="/account/purchases">Compras</a>
          </nav>
        </div>
        <NotificationBell />
      </div>

      <section className="mg-card">
        <label className="mg-field">
          <span>Estado</span>
          <select
            value={status}
            onChange={(event) => handleStatusChange(event.target.value as OperationStatus)}
          >
            {statusOptions.map((option) => (
              <option key={option.value || 'all'} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>
      </section>

      {loading && <p>Cargando...</p>}
      {message && <p>{message}</p>}

      {!loading && !message && items.length === 0 && (
        <p>No hay operaciones para mostrar.</p>
      )}

      <div className="mg-grid">
        {items.map((item) => (
          <article className="mg-card" key={item._id}>
            <h3>{animalLabel(item)}</h3>
            <p>Comprador: <b>{item.buyer?.name || 'Sin comprador'}</b></p>
            <p>Vendedor: <b>{item.seller?.name || 'Sin vendedor'}</b></p>
            <p>Monto: <b>${Number(item.finalPrice || 0).toLocaleString('es-MX')} MXN</b></p>
            <p>Estado: <b>{item.status}</b></p>
            <p>Fecha cierre: {new Date(item.closedAt).toLocaleDateString('es-MX')}</p>
          </article>
        ))}
      </div>
    </main>
  )
}
