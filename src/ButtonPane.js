import { useState } from "react"
import * as L from 'leaflet'

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
  let polyLine = L.polyline([startpoint,startpoint], {color: 'black'})
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
      const distance = measureDistance().toString()
      const newPopUpString = `${distance} days travel` 
      if (distance-previousDistance > 0) {
        polyLine.setPopupContent(newPopUpString)
        polyLine.getPopup().setLatLng(endpoint)
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
      <div style={{
          position: 'absolute',
          left: '44px',
          margin: '10px',
          zIndex: 1000,
          display: 'grid',
          gridTemplate: 
              `"a b d"
              ". c e"
              ". . f"`
        }}>
        <ShowLabelButton showLabels={showLabels} setShowLabels={setShowLabels}/>
        <MouseControlButtons map={map} measuring={measuring} setMeasuring={setMeasuring} distanceModifier={distanceModifier} />
        {measuring ? <MovementOptionButtons setDistanceModifier={setDistanceModifier} /> : null}
      </div>
    </>
  )
}

export default ButtonPane