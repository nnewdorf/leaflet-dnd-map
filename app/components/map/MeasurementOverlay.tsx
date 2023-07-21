'use client'
import { Polyline, Popup, Tooltip, useMapEvents } from "react-leaflet"
import { LatLng, LatLngExpression, LeafletMouseEvent } from "leaflet"
import useBoundStore from "@/app/zustandStores/useBoundedStore"
import { useState } from "react"
import { MeasurementOption } from "@/app/zustandStores/mapControlSlice"

const MeasurementOverlay = () => {
  const {measurementOption} = useBoundStore()
  const [position, setPosition] = useState([new LatLng(0,0), new LatLng(0,0)])
  const [measuring, setMeasuring] = useState(false)

  const measureDistance = () => {
    const x = position[0].lng - position[1].lng
    const y = position[0].lat - position[1].lat
    const distance = Math.round(Math.sqrt(x*x + y*y)/measurementOption)
    return distance
  }

  useMapEvents({
    dblclick: (event: LeafletMouseEvent) => {
      if (measuring) {
        setMeasuring(false)
      } else {
        const p = [event.latlng, event.latlng]
        setPosition(p)
        setMeasuring(true)
      }
    },
    mousemove: (event: LeafletMouseEvent) => {
      if (measuring) {
        const p = [position[0], event.latlng]
        setPosition(p)
      }
    }
  })

  if (measuring && measurementOption !== MeasurementOption.None) {
    return (
      <Polyline
        pathOptions={{color: "black"}}
        positions={position}
      >
        <Tooltip sticky >{measureDistance()}</Tooltip>
      </Polyline>
    )
  } else {
    return <></>
  }
}

export default MeasurementOverlay