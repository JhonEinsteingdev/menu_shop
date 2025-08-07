"use client"

import { useEffect } from 'react'

export function PWARegister() {
  useEffect(() => {
    // Registrar el service worker
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
          .then((registration) => {
            console.log('SW registered: ', registration)
          })
          .catch((registrationError) => {
            console.log('SW registration failed: ', registrationError)
          })
      })
    }

    // Agregar el manifest
    const link = document.createElement('link')
    link.rel = 'manifest'
    link.href = '/manifest.json'
    document.head.appendChild(link)

    // Agregar meta tags para PWA
    const metaThemeColor = document.createElement('meta')
    metaThemeColor.name = 'theme-color'
    metaThemeColor.content = '#ea580c'
    document.head.appendChild(metaThemeColor)

    const metaAppleTouchIcon = document.createElement('link')
    metaAppleTouchIcon.rel = 'apple-touch-icon'
    metaAppleTouchIcon.href = '/icon-192x192.png'
    document.head.appendChild(metaAppleTouchIcon)

    const metaAppleMobileWebAppCapable = document.createElement('meta')
    metaAppleMobileWebAppCapable.name = 'apple-mobile-web-app-capable'
    metaAppleMobileWebAppCapable.content = 'yes'
    document.head.appendChild(metaAppleMobileWebAppCapable)

    const metaAppleMobileWebAppStatusBarStyle = document.createElement('meta')
    metaAppleMobileWebAppStatusBarStyle.name = 'apple-mobile-web-app-status-bar-style'
    metaAppleMobileWebAppStatusBarStyle.content = 'default'
    document.head.appendChild(metaAppleMobileWebAppStatusBarStyle)
  }, [])

  return null
}
