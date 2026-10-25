'use client'

import { useEffect, useRef, useState } from 'react'
import 'maplibre-gl/dist/maplibre-gl.css'

// Shop location (Google Maps place of 門仲どらやき どら山 總本鋪)
const SHOP: [number, number] = [139.7957982, 35.6726091]
const STYLE_URL = 'https://tiles.openfreemap.org/styles/positron'

// quiet, desaturated palette in the site's greens (after the LIG styled-map idea)
const COLORS = {
  land: '#1a3626',
  water: '#0f2418',
  park: '#1d3b29',
  building: '#22412f',
  roadMajor: '#3b5a47',
  roadMinor: '#2c4a38',
  rail: '#456552',
  label: '#cfd3c6',
  labelHalo: '#1a3626',
}

type StyleLayer = { id: string; type: string; 'source-layer'?: string; paint?: Record<string, unknown> }

function restyle(map: import('maplibre-gl').Map) {
  const layers = (map.getStyle().layers ?? []) as StyleLayer[]
  for (const l of layers) {
    const src = l['source-layer'] ?? ''
    const id = l.id
    try {
      if (l.type === 'background') map.setPaintProperty(id, 'background-color', COLORS.land)
      else if (l.type === 'raster') map.setLayoutProperty(id, 'visibility', 'none')
      else if (l.type === 'fill') {
        const c =
          src === 'water' ? COLORS.water
          : src === 'park' || /park|wood|grass|landcover/.test(id) ? COLORS.park
          : src === 'building' ? COLORS.building
          : COLORS.land
        map.setPaintProperty(id, 'fill-color', c)
        map.setPaintProperty(id, 'fill-outline-color', c)
      } else if (l.type === 'line') {
        const c =
          src === 'waterway' ? COLORS.water
          : /rail|transit/.test(id) ? COLORS.rail
          : /motorway|trunk|primary|secondary/.test(id) ? COLORS.roadMajor
          : src === 'boundary' ? COLORS.roadMinor
          : COLORS.roadMinor
        map.setPaintProperty(id, 'line-color', c)
      } else if (l.type === 'symbol') {
        // keep only place / street names in Japanese; no POI icons or road shields
        if (src === 'poi' || /poi|housenum|shield/.test(id)) {
          map.setLayoutProperty(id, 'visibility', 'none')
          continue
        }
        if (map.getLayoutProperty(id, 'text-field')) {
          map.setLayoutProperty(id, 'text-field', ['coalesce', ['get', 'name:ja'], ['get', 'name']])
        }
        map.setPaintProperty(id, 'text-color', COLORS.label)
        map.setPaintProperty(id, 'text-halo-color', COLORS.labelHalo)
        map.setPaintProperty(id, 'text-halo-width', 1.2)
        if (map.getLayoutProperty(id, 'icon-image')) map.setPaintProperty(id, 'icon-opacity', 0.6)
      }
    } catch {
      // a layer may not support a property; skip it
    }
  }
}

function markerElement() {
  const el = document.createElement('div')
  el.setAttribute('aria-label', '門仲どらやき どら山 總本鋪')
  el.innerHTML = `
    <div style="position:relative;display:flex;flex-direction:column;align-items:center">
      <div style="display:flex;align-items:center;justify-content:center;width:64px;height:64px;border-radius:9999px;background:#ebe7df;box-shadow:0 8px 24px rgba(0,0,0,0.35)">
        <span style="display:block;width:40px;height:24px;background:#12301f;-webkit-mask:url(images/logo-mark.png) center/contain no-repeat;mask:url(images/logo-mark.png) center/contain no-repeat"></span>
      </div>
      <span style="width:1px;height:14px;background:#ebe7df"></span>
      <span style="width:5px;height:5px;border-radius:9999px;background:#ebe7df;margin-top:-2px"></span>
    </div>`
  return el
}

export function ShopMap({ className }: { className?: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    let map: import('maplibre-gl').Map | null = null
    let cancelled = false
    import('maplibre-gl').then((mod) => {
      if (cancelled) return
      const maplibregl = (mod as unknown as { default?: typeof mod }).default ?? mod
      // the bundler cannot ship the map's background worker, so serve it as a plain file
      maplibregl.setWorkerUrl(new URL('vendor/maplibre/maplibre-gl-worker.mjs', document.baseURI).href)
      map = new maplibregl.Map({
        container: el,
        style: STYLE_URL,
        center: SHOP,
        zoom: 16.3,
        attributionControl: { compact: true },
        cooperativeGestures: true,
        locale: {
          'CooperativeGesturesHandler.WindowsHelpText': 'Ctrl キーを押しながらスクロールで拡大・縮小',
          'CooperativeGesturesHandler.MacHelpText': '⌘ キーを押しながらスクロールで拡大・縮小',
          'CooperativeGesturesHandler.MobileHelpText': '2本指で地図を動かせます',
        },
      })
      map.addControl(new maplibregl.NavigationControl({ showCompass: false }), 'bottom-right')
      map.on('load', () => {
        if (!map) return
        restyle(map)
        new maplibregl.Marker({ element: markerElement(), anchor: 'bottom', offset: [0, 2.5] }).setLngLat(SHOP).addTo(map)
        // fade the map in only once the streets have actually been drawn, so a
        // slow connection never shows the pin over an empty panel
        map.once('idle', () => setReady(true))
      })
    })
    return () => {
      cancelled = true
      map?.remove()
    }
  }, [])

  return (
    <div className={className}>
      <div
        ref={ref}
        role="region"
        aria-label="どら山 總本鋪の地図"
        className="shop-map transition-opacity duration-1000"
        // inline so the map library's own "position: relative" cannot collapse it
        style={{ position: 'absolute', inset: 0, opacity: ready ? 1 : 0 }}
      />
    </div>
  )
}
