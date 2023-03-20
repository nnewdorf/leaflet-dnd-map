import { ImageOverlay, MapContainer, Marker, Popup, useMapEvent } from 'react-leaflet';
import * as L from 'leaflet'
import React, { useState } from 'react'
import './FantasyMap.css'
import city from './city.png'
import capital from './capital.png'
import world_map from './map.png'
import name_overlay from './name-overlay.png'
import nations from './nations.json'
import CityPopUp from './CityPopUp';
import ButtonPane from './ButtonPane'

const NationMarkers = () => {
  const [iconSize, setIconSize] = useState(10)

  useMapEvent({
    zoomend: (event) => {
      const zoomLevel = event.target._animateToZoom + 2

      if (zoomLevel > 0) {
        const newIconSize = 10 * 2 * zoomLevel
        setIconSize(newIconSize)
      } else if (zoomLevel === 0) {
        setIconSize(10)
      } else if (zoomLevel < 0) {
        const newIconSize = 10 / (-2 * zoomLevel)
        setIconSize(newIconSize)
      }
    } 
  })

  let cityIcon = L.icon({
    iconUrl: city,
    iconSize: [iconSize,iconSize]
  })

  let capitalIcon = L.icon({
    iconUrl: capital,
    iconSize: [iconSize*2,iconSize]
  })

  return(
    <>
      {nations.map(nation => nation.cities.map((city, index) =>  
        <Marker key={index} position={city.latlng} icon={cityIcon}>
          <Popup>{city.name}</Popup>
        </Marker>
      ))}
      {nations.map((nation, index) =>  
        <Marker key={index} position={nation.capital.latlng} icon={capitalIcon}>
          <CityPopUp city={nation.capital.name}/>
        </Marker>
      )}
    </>
  )
}

const MyMap = ({map, setMap, showLabels}) => {
  const bounds = [[0,0], [2160,3840]]

  return (
    <>
      <MapContainer ref={setMap} center={[1080, 1920]} minZoom={-3} zoom={-2} scrollWheelZoom={false} crs={L.CRS.Simple}>
        <ImageOverlay url={world_map} bounds={bounds} />
        {showLabels ? <ImageOverlay url={name_overlay} bounds={bounds} /> : null}
        {null !== map ? <NationMarkers /> : null}
      </MapContainer>
    </>
  )
}

const FantasyMap = () => {
  const [map, setMap] = useState(null)
  const [showLabels, setShowLabels] = useState(true)

  return (
    <>
      {map !== null ? <ButtonPane map={map} showLabels={showLabels} setShowLabels={setShowLabels} /> : null}
      <MyMap map={map} setMap={setMap} showLabels={showLabels} />
    </>
  )
}

export default FantasyMap