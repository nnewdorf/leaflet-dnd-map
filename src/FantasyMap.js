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

const MovementOptionButtons = ({setDistanceModifier}) => {
  const [movementOption, setMovementOption] = useState('walking')
  const distanceModifier = {
    walking: 40,
    horse: 80,
    boat: 120
  }
  const colors = {
    walking: ['red', 'black', 'black'], 
    horse: ['black', 'red', 'black'],
    boat: ['black', 'black', 'red']
  }

  const handleClick = (option) => {
    setMovementOption(option)
    setDistanceModifier(distanceModifier[option])
  }

  return (
    <>
      <button onClick={() => handleClick('walking')} style={{color: colors[movementOption][0], gridArea: 'd'}}>walking</button>
      <button onClick={() => handleClick('horse')} style={{color: colors[movementOption][1], gridArea: 'e'}}>horse</button>
      <button onClick={() => handleClick('boat')} style={{color: colors[movementOption][2], gridArea: 'f'}}>boat</button>
    </>
  )
}

const ShowLabelButton = ({showLabels, setShowLabels}) => {
  const color = showLabels ? 'green' : 'black'

  const handleClick = () => setShowLabels(!showLabels)

  return (
    <>
      <button onClick={handleClick} style={{color: color, gridArea: 'a'}}>labels</button>
    </>
  )
}

const MouseControlButtons = ({map, measuring, setMeasuring, distanceModifier}) => {
  let colors = ['blue', 'black']
  let previousDistance = 0
  let startpoint = [0,0]
  let endpoint = [0,0]
  let polyLine = L.polyline([startpoint,startpoint])
  polyLine.bindPopup('')
  let measuringHappening = false 

  const measureDistance = () => {
    const x = startpoint.lng - endpoint.lng
    const y = startpoint.lat - endpoint.lat
    const distance = Math.round(Math.sqrt(x*x + y*y)/distanceModifier)
    return distance
  }

  const handleMouseDown = (event) => {
    measuringHappening = true
    startpoint = event.latlng
    polyLine.setLatLngs([startpoint, startpoint])
    polyLine.addTo(map)
    polyLine.openPopup(startpoint)
  }

  const handleMouseMove = (event) => {
    if (measuringHappening) {
      endpoint = event.latlng
      polyLine.setLatLngs([startpoint, endpoint])
      const distance = measureDistance()
      if (distance-previousDistance > 0) {
        polyLine.setPopupContent(distance.toString())
      }
      polyLine.redraw()
    }
  }

  const handleMouseUp = (event) => {
    measuringHappening = false
    polyLine.closePopup()
    polyLine.remove()
    window.getSelection().empty()
  }

  if (!measuring) {
    map.dragging.enable()
    colors = ['blue', 'black']
    map.off('mousedown')
    map.off('mousemove')
    map.off('mouseup')
  } else {
    map.dragging.disable()
    colors = ['black', 'blue']
    map.on('mousedown', handleMouseDown)
    map.on('mousemove', handleMouseMove)
    map.on('mouseup', handleMouseUp)
  }

  return (
    <>
      <button onClick={() => setMeasuring(false)} style={{color: colors[0], gridArea: 'b'}}>drag</button>
      <button onClick={() => setMeasuring(true)} style={{color: colors[1], gridArea: 'c'}}>measure</button>
    </>
  )
}

const ButtonPane = ({map, showLabels, setShowLabels}) => {
  const [measuring, setMeasuring] = useState(false)
  const [distanceModifier, setDistanceModifier] = useState(40)

  return(
    <>
      <div className='map-buttons'>
        <ShowLabelButton showLabels={showLabels} setShowLabels={setShowLabels}/>
        <MouseControlButtons map={map} measuring={measuring} setMeasuring={setMeasuring} distanceModifier={distanceModifier} />
        {measuring ? <MovementOptionButtons setDistanceModifier={setDistanceModifier} /> : null}
      </div>
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