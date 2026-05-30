import { useEffect, useState } from 'react'
import { api } from '../lib/api'
import { useAuctionSocket } from '../context/AuctionSocketProvider'

type Props = {
  auctionId: string
  currentPrice: number
  minIncrement: number
  onBidOk: () => void
}

export default function BidPanel({ auctionId, currentPrice, minIncrement, onBidOk }: Props) {
  const { isConnected } = useAuctionSocket()
  const [amount, setAmount] = useState(currentPrice + minIncrement)
  const [loading, setLoading] = useState(false)
  const [msg, setMsg] = useState('')

  useEffect(() => {
    setAmount(currentPrice + minIncrement)
  }, [currentPrice, minIncrement])

  async function submitBid() {
    setLoading(true)
    setMsg('')

    try {
      const bidAmount = amount
      const { data } = await api.post(`/auctions/${auctionId}/bid`, { amount: bidAmount })

      console.log('BID OK:', data)

      await onBidOk()

      setMsg(`✅ Puja aceptada por $${bidAmount.toLocaleString('es-MX')} MXN`)
    } catch (err: any) {
      console.error('BID ERROR:', err?.response?.data || err)

      const apiMsg =
        err?.response?.data?.error ||
        err?.response?.data?.message ||
        'Puja rechazada. Revisa el monto mínimo o el estado de la subasta.'

      setMsg(`❌ ${apiMsg}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="mg-card">
      <h3>Pujar</h3>

      <p>
        Precio actual: <b>${currentPrice.toLocaleString('es-MX')} MXN</b>
      </p>

      <p>
        Mínimo: <b>${(currentPrice + minIncrement).toLocaleString('es-MX')} MXN</b>
      </p>

      <input
        type="number"
        value={amount}
        min={currentPrice + minIncrement}
        step={minIncrement}
        onChange={(e) => setAmount(Number(e.target.value))}
      />

      <div className="mg-actions">
        <button type="button" onClick={() => setAmount(currentPrice + minIncrement)}>
          Mínimo
        </button>
        <button type="button" onClick={() => setAmount(amount + minIncrement)}>
          + {minIncrement}
        </button>
        <button type="button" onClick={() => setAmount(amount + minIncrement * 2)}>
          + {minIncrement * 2}
        </button>
      </div>

      <button type="button" onClick={submitBid} disabled={loading}>
        {loading ? 'Enviando...' : 'Enviar puja'}
      </button>

      {msg && (
        <div style={{ marginTop: 14, padding: 10, borderRadius: 10, background: '#ecfdf5', color: '#065f46', fontWeight: 700 }}>
          {msg}
        </div>
      )}

      <p style={{ marginTop: 10, fontSize: 13 }}>
        {isConnected ? '🟢 Tiempo real conectado' : '🟡 Fallback HTTP activo'}
      </p>
    </div>
  )
}