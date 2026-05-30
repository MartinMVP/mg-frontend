import { io, Socket } from 'socket.io-client'

let socket: Socket | null = null

export function getAuctionSocket(accessToken: string) {
  const baseURL = import.meta.env.VITE_API_URL || ''

  if (!socket) {
    socket = io(`${baseURL}/auctions`, {
      transports: ['websocket'],
      auth: { token: accessToken },
      autoConnect: false,
      reconnection: true,
      reconnectionAttempts: 10,
      reconnectionDelay: 800,
    })
  }

  return socket
}

export function closeAuctionSocket() {
  if (socket) {
    socket.disconnect()
    socket = null
  }
}