import { Button, ButtonGroup } from "@mui/material"

const ZoomControl = ({map}) => {

  const handleClick = (zoomIn) => {
    if(zoomIn) {
      map.zoomIn(1)
    } else {
      map.zoomOut(1)
    }
  }

  return (
    <div className='leaflet-top leaflet-right'>
      <div className="leaflet-control">
        <ButtonGroup variant='contained' orientation='vertical' size='small'>
          <Button onClick={() => handleClick(true)}>+</Button>
          <Button onClick={() => handleClick(false)}>-</Button>
        </ButtonGroup>
      </div>
    </div>
  )
}

export default ZoomControl