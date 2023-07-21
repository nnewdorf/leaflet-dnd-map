import Map from "./components/map/Map"
import NavBar from "./components/navbar/NavBar"

export default function Home() {
  return (
    <main className="flex flex-col">
      <NavBar />
      <Map />
    </main>
  )
}