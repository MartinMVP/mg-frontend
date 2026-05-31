type Bid = {
  _id: string
  amount: number
  createdAt?: string
  bidder?: {
    name?: string
    email?: string
  }
}

type Props = {
  bids: Bid[]
}

export default function BidHistory({ bids }: Props) {
  return (
    <div className="mg-card">
      <h2>Últimas pujas</h2>

      {bids.length === 0 ? (
        <p>Sin pujas todavía.</p>
      ) : (
        <div className="mg-bid-list">
          {bids.map((bid) => (
            <div key={bid._id} className="mg-bid-row">
              <div>
                <strong>${Number(bid.amount || 0).toLocaleString('es-MX')} MXN</strong>
                <p>{bid.bidder?.name || bid.bidder?.email || 'Usuario'}</p>
              </div>

              {bid.createdAt && (
                <span>
                  {new Date(bid.createdAt).toLocaleTimeString('es-MX', {
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit',
                  })}
                </span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}