import { useState } from "react"
import * as L from 'leaflet'
import { Button, ButtonGroup, Popover } from "@mui/material"

const MapControlGroup = ({currentLabel, popoverButtons}) => {
  const [anchorEl, setAnchorEl] = useState(null)

  const handleShowPopOver = (event) => {
    setAnchorEl(event.currentTarget);
  }

  const handleClose = () => {
    setAnchorEl(null);
  }
  
  const open = Boolean(anchorEl)
  const id = open ? 'simple-popover' : undefined

  return (
    <>
      <Button variant='contained' onClick={handleShowPopOver}>
        {currentLabel}
      </Button>
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'center',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'center',
          horizontal: 'left',
        }}
      >
        <ButtonGroup orientation='vertical' size='small'>
          {popoverButtons}
        </ButtonGroup>
      </Popover>
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

  const handleClick = (option) => {
    setMovementOption(option)
    setDistanceModifier(distanceModifier[option])
  }

  const popoverButtons =
  <>
    <Button onClick={() => handleClick('walking')}>walking</Button>
    <Button onClick={() => handleClick('horse')}>horse</Button>
    <Button onClick={() => handleClick('boat')}>boat</Button>
  </>

  return (
    <MapControlGroup
      currentLabel={movementOption}
      popoverButtons={popoverButtons}
    />
  )
}

const ShowLabelButton = ({showLabels, setShowLabels}) => {
  const popoverButtons =
    <>
      <Button onClick={() => setShowLabels(true)}>on</Button>
      <Button onClick={() => setShowLabels(false)}>off</Button>
    </>

  return (
      <MapControlGroup 
        currentLabel={showLabels ? "labels on" : "labels off"}
        popoverButtons={popoverButtons}
      />
  )
}

const MouseControlButtons = ({map, measuring, setMeasuring, distanceModifier}) => {
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
    map.off('mousedown')
    map.off('mousemove')
    map.off('mouseup')
  } else {
    map.dragging.disable()
    map.on('mousedown', handleMouseDown)
    map.on('mousemove', handleMouseMove)
    map.on('mouseup', handleMouseUp)
  }

  const popoverButtons =
    <>
      <Button onClick={() => setMeasuring(false)}>drag</Button>
      <Button onClick={() => setMeasuring(true)}>measure</Button>
    </>

  return (
    <MapControlGroup
      currentLabel={measuring ? 'measure' : 'drag'}
      popoverButtons={popoverButtons}
    />
  )
}

const ButtonPane = ({map, showLabels, setShowLabels}) => {
  const [measuring, setMeasuring] = useState(false)
  const [distanceModifier, setDistanceModifier] = useState(40)

  return(
    <>
      <div className='leaflet-top leaflet-left'>
        <div className="leaflet-control">
        <ButtonGroup orientation="vertical" size="small">
          <ShowLabelButton showLabels={showLabels} setShowLabels={setShowLabels}/>
          <MouseControlButtons map={map} measuring={measuring} setMeasuring={setMeasuring} distanceModifier={distanceModifier} />
          {measuring ? <MovementOptionButtons setDistanceModifier={setDistanceModifier} /> : null}
        </ButtonGroup>
        </div>
      </div>
    </>
  )
}

export default ButtonPane