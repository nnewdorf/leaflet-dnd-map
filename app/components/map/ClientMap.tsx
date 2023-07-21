"use client"
import {
  ImageOverlay,
  MapContainer
} from "react-leaflet"
import "leaflet/dist/leaflet.css"
import { CRS, LatLng, LatLngBounds } from "leaflet"
import { CapitalMarkers, CityMarkers} from "./NationMarkers"
import CustomMapControl from "./CustomMapControl"
import useBoundStore from "@/app/zustandStores/useBoundedStore"
import ZoomControl from "./ZoomControl"
import MeasurementOverlay from "./MeasurementOverlay"

const BOUNDS = new LatLngBounds([[0,0], [2160,3840]])
const MAP_PROPS = {
  crs: CRS.Simple,
  center: new LatLng(1080,1920),
  minZoom: -3,
  zoom: -2,
  maxZoom: 2,
  zoomControl: false,
  doubleClickZoom: false
}

const ClientMap = () => {
  const { showLabels, showCapitals, showCities } = useBoundStore()

  return(
    <MapContainer {...MAP_PROPS} style={{height: "100vh", width: "100vw"}}>
      <ImageOverlay url={"/map/map.png"} bounds={BOUNDS} />
      {showLabels && showCapitals &&
        <ImageOverlay 
          url={"/map/capital-names.png"}
          bounds={BOUNDS}
        />}
      {showLabels && showCities &&
        <ImageOverlay 
          url={"/map/city-names.png"}
          bounds={BOUNDS}
        />}
      {showCapitals && <CapitalMarkers />}
      {showCities && <CityMarkers />}
      <MeasurementOverlay />
      <CustomMapControl />
      <ZoomControl />
    </MapContainer>
  )
}

export default ClientMap