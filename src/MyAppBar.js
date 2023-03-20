import {AppBar, Box, Dialog, IconButton, Toolbar, Typography } from "@mui/material"
import InfoIcon from '@mui/icons-material/Info'
import { useEffect, useState } from "react"
import ReactMarkdown from "react-markdown"
import info from './constants'

const MyAppBar = () => {
  const [infoString, setInfoString] = useState('')
  const [showInfo, setShowInfo] = useState(false)

  useEffect(() => { 
    fetch(info)
      .then(res => res.text())
      .then(text => setInfoString(text))
  }, [])

  const handleClick = () => setShowInfo(!showInfo)


  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Campaign 2 Map
          </Typography>
          <IconButton onClick={handleClick}>
            <InfoIcon />
          </IconButton>
        </Toolbar>
      </AppBar>
      <Dialog open={showInfo} onClose={handleClick}>
        <Box px={8}>
          <ReactMarkdown>{infoString}</ReactMarkdown>
        </Box>
      </Dialog>
    </>
  )
}

export default MyAppBar