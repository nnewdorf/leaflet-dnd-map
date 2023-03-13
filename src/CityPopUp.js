import ReactMarkdown from 'react-markdown'
import { useEffect, useState } from 'react'
import { Popup } from 'react-leaflet'
import nations from './nation-notes'

const CityPopUp = ({city}) => {
  const [markdown, setMarkdown] = useState('')

  useEffect(() => {
    const cityFormated = city.replace(/\s/g, '').toLowerCase()
    
    fetch(nations[cityFormated])
      .then(res => res.text())
      .then(text => setMarkdown(text))
  }, [city])

  return (
    <>
      <Popup maxHeight={300}>
       <ReactMarkdown>{markdown}</ReactMarkdown>
      </Popup>
    </>
  )
}

export default CityPopUp