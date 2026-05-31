import { useEffect, useMemo, useState } from 'react'
import { api } from '../lib/api'

type Notification = {
  _id: string
  type: string
  title: string
  message: string
  read: boolean
  createdAt?: string
}

export default function NotificationBell() {
  const [items, setItems] = useState<Notification[]>([])
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  const unreadCount = useMemo(
    () => items.filter((item) => !item.read).length,
    [items],
  )

  async function loadNotifications() {
    setLoading(true)
    try {
      const { data } = await api.get('/notifications')
      setItems(Array.isArray(data) ? data : [])
    } catch {
      setItems([])
    } finally {
      setLoading(false)
    }
  }

  async function markRead(notification: Notification) {
    if (notification.read) return

    setItems((prev) =>
      prev.map((item) =>
        item._id === notification._id ? { ...item, read: true } : item,
      ),
    )

    try {
      await api.post(`/notifications/${notification._id}/read`)
    } catch {
      await loadNotifications()
    }
  }

  useEffect(() => {
    loadNotifications()
  }, [])

  return (
    <div className="mg-notifications">
      <button
        type="button"
        className="mg-icon-button"
        aria-label="Notificaciones"
        onClick={() => setOpen((value) => !value)}
      >
        <span aria-hidden="true">!</span>
        {unreadCount > 0 && <span className="mg-badge">{unreadCount}</span>}
      </button>

      {open && (
        <div className="mg-notification-menu">
          <div className="mg-notification-head">
            <strong>Notificaciones</strong>
            <button type="button" onClick={loadNotifications}>
              Actualizar
            </button>
          </div>

          {loading && <p>Cargando...</p>}

          {!loading && items.length === 0 && (
            <p className="mg-muted">Sin notificaciones.</p>
          )}

          {!loading && items.map((item) => (
            <button
              key={item._id}
              type="button"
              className={`mg-notification-item ${item.read ? '' : 'is-unread'}`}
              onClick={() => markRead(item)}
            >
              <span>{item.title}</span>
              <small>{item.message}</small>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
