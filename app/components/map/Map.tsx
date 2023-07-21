import dynamic from "next/dynamic"

const ClientMap = dynamic(() => import("./ClientMap"), {ssr:false})

const Map = () => {
  return (
    <div>
      <ClientMap />
    </div>
  )
}

export default Map