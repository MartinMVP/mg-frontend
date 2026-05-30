import { createContext, useContext, useEffect, useMemo, useRef, useState } from 'react'
import { getAuctionSocket, closeAuctionSocket } from '../lib/socket'

type AuctionEvent =
  | { type: 'connected' }
  | { type: 'state_changed'; payload: any }
  | { type: 'bid_accepted'; payload: any }
  | { type: 'bid_rejected'; payload: any }
  | { type: 'error'; message: string }

type Ctx = {
  isConnected: boolean
  lastEvent?: AuctionEvent
  joinAuction: (auctionId: string) => void
  leaveAuction: (auctionId: string) => void
  placeBidWS: (auctionId: string, amount: number) => Promise<void>
}

const AuctionSocketCtx = createContext<Ctx | null>(null)

export function useAuctionSocket() {
  const ctx = useContext(AuctionSocketCtx)
  if (!ctx) throw new Error('useAuctionSocket must be used within AuctionSocketProvider')
  return ctx
}

export function AuctionSocketProvider({ children }: { children: React.ReactNode }) {
  const access = (localStorage.getItem('mg_access') || '').trim()

  const [isConnected, setIsConnected] = useState(false)
  const [lastEvent, setLastEvent] = useState<AuctionEvent>()
  const socketRef = useRef<ReturnType<typeof getAuctionSocket> | null>(null)

  useEffect(() => {
    if (!access) return

    const s = getAuctionSocket(access)
    socketRef.current = s

    const onConnect = () => {
      setIsConnected(true)
      setLastEvent({ type: 'connected' })
    }

    const onDisconnect = () => setIsConnected(false)

    const onStateChanged = (payload: any) => {
      setLastEvent({ type: 'state_changed', payload })
    }

    const onBidAccepted = (payload: any) => {
      setLastEvent({ type: 'bid_accepted', payload })
    }

    const onBidRejected = (payload: any) => {
      setLastEvent({ type: 'bid_rejected', payload })
    }

    const onError = (message: string) => {
      setLastEvent({ type: 'error', message })
    }

    s.on('connect', onConnect)
    s.on('disconnect', onDisconnect)
    s.on('state_changed', onStateChanged)
    s.on('bid_accepted', onBidAccepted)
    s.on('bid_rejected', onBidRejected)
    s.on('error', onError)

    s.connect()

    return () => {
      s.off('connect', onConnect)
      s.off('disconnect', onDisconnect)
      s.off('state_changed', onStateChanged)
      s.off('bid_accepted', onBidAccepted)
      s.off('bid_rejected', onBidRejected)
      s.off('error', onError)
      closeAuctionSocket()
    }
  }, [access])

  const value = useMemo<Ctx>(() => ({
    isConnected,
    lastEvent,
    joinAuction: (auctionId: string) => socketRef.current?.emit('join', auctionId),
    leaveAuction: (auctionId: string) => socketRef.current?.emit('leave', auctionId),
    placeBidWS: (auctionId: string, amount: number) =>
      new Promise((resolve, reject) => {
        const s = socketRef.current
        if (!s || !s.connected) {
          reject(new Error('Socket no conectado'))
          return
        }

        s.emit('place_bid', { auctionId, amount })
        resolve()
      }),
  }), [isConnected, lastEvent])

  return (
    <AuctionSocketCtx.Provider value={value}>
      {children}
    </AuctionSocketCtx.Provider>
  )
}