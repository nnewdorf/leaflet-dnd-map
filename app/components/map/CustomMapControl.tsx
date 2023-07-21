'use client'
import { useState } from "react"
import useBoundStore from "../../zustandStores/useBoundedStore"
import { ChevronDoubleDownIcon, ChevronDoubleUpIcon } from '@heroicons/react/24/solid'
import { MeasurementOption } from "@/app/zustandStores/mapControlSlice"

const HideShowSwitches = () => {
  const { showCapitals, showCities, showLabels,
    toggleShowCapitals, toggleShowCities, toggleShowLabels } = useBoundStore()

  return (
    <div>
      <h3 className="underline text-lg">Hide / Show</h3>
      <label className="label cursor-pointer">
        <span className="label-text mr-2">Capitals</span> 
        <input
          type="checkbox"
          onChange={() => toggleShowCapitals()}
          className="toggle"
          checked={showCapitals}
        />
      </label>
      <label className="label cursor-pointer">
        <span className="label-text mr-2">Cities</span> 
        <input
          type="checkbox"
          onChange={() => toggleShowCities()}
          className="toggle"
          checked={showCities}
        />
      </label>
      <label className="label cursor-pointer">
        <span className="label-text mr-2">Labels</span> 
        <input
          type="checkbox"
          onChange={() => toggleShowLabels()}
          className="toggle"
          checked={showLabels}
        />
      </label>
    </div>
  )
}

const MeasurenmentSelector = () => {
  const { measurementOption, setMeasurementOption } = useBoundStore()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement> ) => {
    setMeasurementOption(Number(e.target.value) as MeasurementOption)
  }

  interface RadioButtonOption {
    mO: MeasurementOption,
    text: String
  }

  const RadioButtonOption: React.FC<RadioButtonOption> = ({mO, text}) => {
    return (
      <label className="label cursor-pointer join-item">
        <span className="label-text mr-2">{text}</span> 
        <input
          type="radio"
          name="measure"
          className="radio"
          value={mO}
          checked={mO === measurementOption}
          onChange={handleChange}
        />
      </label>
    )
  }

  const options = [
    {mO: MeasurementOption.None, text: "None"},
    {mO: MeasurementOption.Walking, text: "Walking"},
    {mO: MeasurementOption.Horse, text: "Horse"},
    {mO: MeasurementOption.Boat, text: "Boat"},
  ]

  return (
    <div className="join join-vertical">
      <h3 className="join-item underline text-lg">Measurement</h3>
      {options.map(o => <RadioButtonOption {...o} key={o.text}/>)}
    </div>
  )
}

const CustomMapControl = () => {
  const [collapsed, setCollapsed] = useState(true) 

  let collapseButtonIcon
  if(collapsed) {
    collapseButtonIcon = <ChevronDoubleDownIcon className="h-4 w-4"/>
  } else {
    collapseButtonIcon = <ChevronDoubleUpIcon className="h-4 w-4"/>
  }

  return (
    <div className="leaflet-top leaflet-left">
      <div className="leaflet-control rounded-box bg-base-100 p-4">
        <button onClick={() => setCollapsed(!collapsed)} className="btn btn-sm ">
          {collapseButtonIcon}
        </button>
        {!collapsed && 
          <>
            <div className="divider"></div>
            <HideShowSwitches />
            <div className="divider"></div>
            <MeasurenmentSelector />
          </>}
      </div>
    </div>
  )
}

export default CustomMapControl