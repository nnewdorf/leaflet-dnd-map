import { StateCreator } from "zustand"

export const enum MeasurementOption {
  None,
  Walking = 40,
  Horse = 80,
  Boat = 120
}

export interface MapControlSlice {
  showLabels: boolean
  showCities: boolean
  showCapitals: boolean
  toggleShowLabels: () => void
  toggleShowCities: () => void
  toggleShowCapitals: () => void
  measurementOption: MeasurementOption
  setMeasurementOption: (newMO: MeasurementOption) => void
}

export const createMapControlSlice: StateCreator<
  MapControlSlice, [], [], MapControlSlice
> = (set) => ({
  showLabels: true,
  showCities: true,
  showCapitals: true,
  toggleShowLabels: () => set((state) => ({showLabels: !state.showLabels})),
  toggleShowCities: () => set((state) => ({showCities: !state.showCities})),
  toggleShowCapitals: () => set((state) => ({showCapitals: !state.showCapitals})),
  measurementOption: MeasurementOption.None,
  setMeasurementOption: (newMO: MeasurementOption) =>
   set((state) => ({measurementOption: newMO}))
})