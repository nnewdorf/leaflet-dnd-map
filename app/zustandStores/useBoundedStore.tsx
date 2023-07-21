import { create } from "zustand"
import {createMapControlSlice, MapControlSlice} from "./mapControlSlice"

const useBoundStore = create<MapControlSlice>()((...a) => ({
  ...createMapControlSlice(...a)
}))

export default useBoundStore