import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { api } from '../lib/api'
import LiveTimer from '../components/LiveTimer'
import BidPanel from '../components/BidPanel'
import BidHistory from '../components/BidHistory'
import { useAuctionSocket } from '../context/AuctionSocketProvider'

export default function AuctionRoom() {
  const { id } = useParams()
  const { joinAuction, leaveAuction, lastEvent, isConnected } = useAuctionSocket()

  const [auction, setAuction] = useState<any>(null)
  const [bids, setBids] = useState<any[]>([])
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

  async function loadBids() {
    if (!id) return

    try {
      const { data } = await api.get(`/auctions/${id}/bids`)
      setBids(Array.isArray(data) ? data : [])
    } catch (err) {
      console.error('Error cargando pujas:', err)
    }
  }

  useEffect(() => {
    load(true)
    loadBids()
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
      loadBids()
    }

    if (lastEvent.type === 'state_changed') {
      const payload = lastEvent.payload || {}

      if (payload.auctionId && id && payload.auctionId !== id) return

      setAuction((prev: any) => {
        if (!prev) return prev

        return {
          ...prev,
          state: payload.state ?? prev.state,
          currentWinner: payload.currentWinner ?? prev.currentWinner,
          currentPrice: payload.currentPrice ?? payload.finalPrice ?? prev.currentPrice,
          endsAt: payload.endsAt ?? prev.endsAt,
        }
      })

      if (payload.state === 'closed') {
        loadBids()
      }

      load(false)
    }
  }, [lastEvent])

  if (loading) return <main className="mg-page">Cargando...</main>
  if (!auction) return <main className="mg-page">Subasta no encontrada</main>

  const animal = auction?.listing?.animal
  const currentPrice = Number(auction.currentPrice || auction.startPrice || 0)
  const minIncrement = Number(auction.minIncrement || 500)
  const isClosed = auction.state === 'closed'
  const winner = auction.currentWinner
  const latestBidder = bids[0]?.bidder
  const winnerLabel =
    typeof winner === 'object'
      ? winner?.name || winner?.email || winner?._id
      : latestBidder?.name || latestBidder?.email || winner || 'Sin ganador'

  return (
    <main className="mg-page">
      <div className="mg-header">
        <a href="/auctions">← Volver</a>
        <span>{isConnected ? '🟢 Tiempo real conectado' : '🟡 Usando HTTP fallback'}</span>
      </div>

      <section className="mg-card">
        <h1>{auction.title}</h1>
        <p>Estado: <b>{auction.state}</b></p>
        <p>{isClosed ? 'Cerró' : 'Cierra en'}: <LiveTimer endsAt={auction.endsAt} /></p>
        <p>{isClosed ? 'Precio final' : 'Precio actual'}: <b>${currentPrice.toLocaleString('es-MX')} MXN</b></p>
        {isClosed && <p>Ganador: <b>{winnerLabel}</b></p>}
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
          onBidOk={async () => {
            await load(false)
            await loadBids()
          }}
        />
      ) : (
        <div className="mg-card">
          Esta subasta no está activa para recibir pujas.
        </div>
      )}

      <BidHistory bids={bids} />
    </main>
  )
}
