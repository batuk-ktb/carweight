'use client'
import { useEffect, useRef } from 'react'
import Hls from 'hls.js'

const CameraPlayer = ({ src }: { src: string }) => {
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    if (!videoRef.current) return

    if (Hls.isSupported()) {
      const hls = new Hls()
      hls.loadSource(src)
      hls.attachMedia(videoRef.current)

      return () => hls.destroy()
    } else {
      videoRef.current.src = src
    }
  }, [src])

  return (
    <video
      ref={videoRef}
      autoPlay
      muted
      controls
      className="w-full h-full object-cover rounded-md"
    />
  )
}

export default CameraPlayer
