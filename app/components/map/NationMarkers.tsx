"use client"
import { useEffect, useState } from "react"
import { useMapEvents, Marker, Popup, LayerGroup} from "react-leaflet"
import { LeafletEvent, icon } from "leaflet"
import locations from "./locations.json"
import { LatLng } from "leaflet"

interface location { 
  name: string
  latlng: number[]
  type: string
  tags: string[]
}

const getNewIconSize = (zoomLevel: number): number => {
  if (zoomLevel > 0) {
    return 10 * 2 * zoomLevel
  } else if (zoomLevel === 0) {
    return 10
  } else {
    return 10 / (-2 * zoomLevel)
  }
}

export const CityMarkers = () => {
  const [iconSize, setIconSize] = useState(10)
  const map = useMapEvents({
    zoomend: (event: LeafletEvent) => {
      const zoomLevel: number = event?.target._animateToZoom + 2
      setIconSize(getNewIconSize(zoomLevel))
    }
  })

  useEffect (() => {
    const startSize = getNewIconSize(map.getZoom()+2)
    setIconSize(startSize)
  }, [])

  const cityIcon = icon({
    iconUrl: "/map/city.png",
    iconSize: [iconSize, iconSize]
  })

  const cities: location[] = locations.filter(l => l.type === "city")

  return (
    <LayerGroup>
      {cities.map((city: location) =>
      <Marker
        key={city.name}
        position={new LatLng(city.latlng[0], city.latlng[1])}
        icon={cityIcon}
      >
        <Popup>{city.name}</Popup>
      </Marker>
    )}
    </LayerGroup>
  )
}

export const CapitalMarkers = () => {
  const [iconSize, setIconSize] = useState(10)
  const map = useMapEvents({
    zoomend: (event: LeafletEvent) => {
      const zoomLevel: number = event?.target._animateToZoom + 2
      setIconSize(getNewIconSize(zoomLevel))
    }
  })

  useEffect (() => {
    const startSize = getNewIconSize(map.getZoom()+2)
    setIconSize(startSize)
  }, [])

  const capitalIcon = icon({
    iconUrl: "/map/capital.png",
    iconSize: [iconSize*2, iconSize]
  })

  const capitals: location[] = locations.filter(l => l.type === "capital")

  return (
    <LayerGroup>
      {capitals.map((capital: location) =>
      <Marker
        key={capital.name}
        position={new LatLng(capital.latlng[0], capital.latlng[1])}
        icon={capitalIcon}
      >
        <Popup>{capital.name}</Popup>
      </Marker>
    )}
    </LayerGroup>
  )
}