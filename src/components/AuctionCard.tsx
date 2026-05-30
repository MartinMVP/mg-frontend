import LiveTimer from './LiveTimer'

export default function AuctionCard({ auction }: { auction: any }) {
  const animal = auction?.listing?.animal
  const breed = animal?.breed?.name
  const title = auction?.title || animal?.name || animal?.tag || 'Subasta'

  return (
    <a className="mg-card" href={`/auctions/${auction._id}`}>
      <h3>{title}</h3>
      <p>{breed || 'Sin raza'} · ${Number(auction.currentPrice || auction.startPrice || 0).toLocaleString('es-MX')} MXN</p>
      <p>Estado: <b>{auction.state}</b></p>
      {auction.endsAt && <p>Cierra en: <LiveTimer endsAt={auction.endsAt} /></p>}
    </a>
  )
}