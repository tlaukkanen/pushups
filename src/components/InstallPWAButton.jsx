import { Button } from '@material-ui/core'
import React, { useState, useEffect } from 'react'

const InstallPWAButton = () => {
  const [supportsPWA, setSupportsPWA] = useState(false)
  const [promptInstall, setPromptInstall] = useState(null)

  useEffect(() => {
    const handler = (event) => {
      event.preventDefault()
      console.log("Before install prompt")
      setSupportsPWA(true)
      setPromptInstall(event)
    }
    window.addEventListener('beforeinstallprompt', handler)
    return () => window.removeEventListener('transitionend', handler)
  }, [])

  const onClick = (evt) => {
    evt.preventDefault()
    if(!promptInstall) {
      return
    }
    promptInstall.prompt()
  }

  if(!supportsPWA) {
    return <div>not supported</div>
  }
  return(
    <Button
      id="setup-pwa"
      aria-label="Install PWA"
      title='Install PWA'
      onClick={onClick}
    >
      Install PWA
    </Button>
  )
}

export default InstallPWAButton
