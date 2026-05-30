import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { api } from '../lib/api'
import LiveTimer from '../components/LiveTimer'
import BidPanel from '../components/BidPanel'
import { useAuctionSocket } from '../context/AuctionSocketProvider'

export default function AuctionRoom() {
  const { id } = useParams()
  const { joinAuction, leaveAuction, lastEvent, isConnected } = useAuctionSocket()

  const [auction, setAuction] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  async function load(showLoading = false) {
    if (!id) return
    if (showLoading) setLoading(true)

    try {
      const { data } = await api.get(`/auctions/${id}`)
      setAuction(data)
    } finally {
      if (showLoading) setLoading(false)
    }
  }

  useEffect(() => {
    load(true)
  }, [id])

  useEffect(() => {
    if (!id) return
    joinAuction(id)
    return () => leaveAuction(id)
  }, [id])

  useEffect(() => {
    if (!lastEvent || !auction) return

    if (lastEvent.type === 'bid_accepted') {
      load(false)
    }

    if (lastEvent.type === 'state_changed') {
      load(false)
    }
  }, [lastEvent])

  if (loading) return <main className="mg-page">Cargando...</main>
  if (!auction) return <main className="mg-page">Subasta no encontrada</main>

  const animal = auction?.listing?.animal
  const currentPrice = Number(auction.currentPrice || auction.startPrice || 0)
  const minIncrement = Number(auction.minIncrement || 500)

  return (
    <main className="mg-page">
      <div className="mg-header">
        <a href="/auctions">← Volver</a>
        <span>{isConnected ? '🟢 Tiempo real conectado' : '🟡 Usando HTTP fallback'}</span>
      </div>

      <section className="mg-card">
        <h1>{auction.title}</h1>
        <p>Estado: <b>{auction.state}</b></p>
        <p>Cierra en: <LiveTimer endsAt={auction.endsAt} /></p>
        <p>Precio actual: <b>${currentPrice.toLocaleString('es-MX')} MXN</b></p>
      </section>

      <section className="mg-card">
        <h2>Animal</h2>
        <p>{animal?.name || animal?.tag}</p>
        <p>{animal?.breed?.name} · {animal?.location?.state}</p>
      </section>

      {auction.state === 'live' ? (
        <BidPanel
          auctionId={auction._id}
          currentPrice={currentPrice}
          minIncrement={minIncrement}
          onBidOk={() => load(false)}
        />
      ) : (
        <div className="mg-card">
          Esta subasta no está activa para recibir pujas.
        </div>
      )}
    </main>
  )
}