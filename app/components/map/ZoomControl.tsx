'use client'
import { Map } from "leaflet"
import { useMap } from "react-leaflet"

const ZoomControl = () => {
  const map: Map = useMap()

  return (
    <div className='leaflet-top leaflet-right'>
      <div className="leaflet-control join join-vertical ">
        <button onClick={() => map.zoomIn(1)} className="btn join-item">+</button>
        <button onClick={() => map.zoomOut(1)} className="btn join-item">-</button>
      </div>
    </div>
  )
}

export default ZoomControl