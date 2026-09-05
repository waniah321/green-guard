// src/components/analysis/AnalysisMap.jsx
import React, { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, useMap, FeatureGroup, Polygon, Tooltip } from 'react-leaflet';
import { EditControl } from 'react-leaflet-draw';
import { Layers, Plus, Minus, Play, Box, CheckCircle, AlertTriangle, ShieldCheck, Radar, Crosshair } from 'lucide-react';
import L from 'leaflet';

import 'leaflet/dist/leaflet.css';
import 'leaflet-draw/dist/leaflet.draw.css';

// Margalla Hills Area of Interest (AOI) Polygon Coordinates (Islamabad, Pakistan)
const MARGALLA_HILLS_AOI = [
  [33.7250, 72.8500],
  [33.7550, 72.9000],
  [33.7750, 72.9500],
  [33.8050, 73.0200],
  [33.8150, 73.0800],
  [33.8180, 73.1200],
  [33.7950, 73.1500],
  [33.7500, 73.1500],
  [33.7420, 73.1000],
  [33.7380, 73.0600],
  [33.7150, 72.9800],
  [33.7050, 72.9300],
  [33.7100, 72.8800]
];

// World Outer Ring for creating the inverted mask outside AOI
const WORLD_OUTER_RING = [
  [90, -180],
  [90, 180],
  [-90, 180],
  [-90, -180]
];

// Inverted Mask Polygon (Outer Ring + Cutout AOI Ring)
const INVERTED_AOI_MASK = [
  WORLD_OUTER_RING,
  MARGALLA_HILLS_AOI
];

// Direct Margalla Hills AOI Center & Zoom (focused immediately on opening)
const MARGALLA_HILLS_CENTER = [33.7438, 73.0228];
const MARGALLA_HILLS_ZOOM = 12;

// Ray-casting Point-In-Polygon calculation
function isPointInPolygon(point, polygon) {
  const x = point[1], y = point[0]; // lng, lat
  let inside = false;
  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const xi = polygon[i][1], yi = polygon[i][0];
    const xj = polygon[j][1], yj = polygon[j][0];
    const intersect = ((yi > y) !== (yj > y)) &&
        (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
    if (intersect) inside = !inside;
  }
  return inside;
}

// Verifies if all vertices of a drawn polygon lie strictly inside Margalla Hills AOI
function checkPolygonInsideAOI(latLngs, aoiPolygon) {
  if (!latLngs) return false;
  let points = latLngs;
  // Unwraps Leaflet nested array structure [[LatLng, LatLng, ...]]
  while (Array.isArray(points[0])) {
    points = points[0];
  }
  if (!points || points.length === 0) return false;
  return points.every(pt => {
    const lat = pt.lat !== undefined ? pt.lat : pt[0];
    const lng = pt.lng !== undefined ? pt.lng : pt[1];
    return isPointInPolygon([lat, lng], aoiPolygon);
  });
}

function MapController({ setZoom, is3DMode, setIs3DMode, setErrorMessage, setAoiStatus, drawnLayersCount, setIsDrawingActive, isAnalyzing }) {
  const map = useMap();
  const isDrawingActiveRef = useRef(false);
  const wasAnalyzingRef = useRef(false);
  const hasInitializedRef = useRef(false);

  useEffect(() => {
    if (hasInitializedRef.current) return;
    hasInitializedRef.current = true;

    // Immediately fit map bounds cleanly to Margalla Hills AOI
    const bounds = L.latLngBounds(MARGALLA_HILLS_AOI);
    map.fitBounds(bounds, {
      padding: [25, 25],
      maxZoom: 13
    });
  }, [map]);

  // Track Leaflet.draw drawing and editing events to dynamically toggle intercept bypass
  useEffect(() => {
    const handleDrawStart = () => {
      isDrawingActiveRef.current = true;
      setIsDrawingActive(true);
      // Auto-switch to 2D mode so mouse click coordinates map 1:1 without 3D rotation distortion
      if (setIs3DMode) {
        setIs3DMode(false);
      }
    };
    const handleDrawStop = () => {
      isDrawingActiveRef.current = false;
      setIsDrawingActive(false);
    };

    map.on('draw:drawstart', handleDrawStart);
    map.on('draw:drawstop', handleDrawStop);
    map.on('draw:created', handleDrawStop);
    map.on('draw:editstart', handleDrawStart);
    map.on('draw:editstop', handleDrawStop);
    map.on('draw:deletestart', handleDrawStart);
    map.on('draw:deletestop', handleDrawStop);

    return () => {
      map.off('draw:drawstart', handleDrawStart);
      map.off('draw:drawstop', handleDrawStop);
      map.off('draw:created', handleDrawStop);
      map.off('draw:editstart', handleDrawStart);
      map.off('draw:editstop', handleDrawStop);
      map.off('draw:deletestart', handleDrawStart);
      map.off('draw:deletestop', handleDrawStop);
    };
  }, [map, setIsDrawingActive, setIs3DMode]);

  // Direct click zoom locking on Leaflet.draw toolbar buttons
  useEffect(() => {
    const container = map.getContainer();
    const handleToolbarClick = (e) => {
      const btn = e.target.closest('.leaflet-draw-draw-polygon, .leaflet-draw-draw-rectangle');
      if (btn) {
        if (setIs3DMode) setIs3DMode(false);
        // Explicitly set view centered at Margalla Hills with zoom level 14 to cover 100% container screen
        map.setView([33.7438, 73.0228], 14, { animate: false });
      }
    };

    container.addEventListener('click', handleToolbarClick, true);
    return () => {
      container.removeEventListener('click', handleToolbarClick, true);
    };
  }, [map, setIs3DMode]);

  // Reset Mode: Automatically reset map view to standard overview bounds when analysis finishes
  useEffect(() => {
    if (wasAnalyzingRef.current && !isAnalyzing) {
      const bounds = L.latLngBounds(MARGALLA_HILLS_AOI);
      map.flyToBounds(bounds, {
        duration: 2.0,
        padding: [15, 15],
        maxZoom: 13
      });
    }
    wasAnalyzingRef.current = isAnalyzing;
  }, [isAnalyzing, map]);

  useEffect(() => {
    const timer = setTimeout(() => {
      map.invalidateSize();
    }, 250);
    return () => clearTimeout(timer);
  }, [map, is3DMode]);

  useEffect(() => {
    const handleZoom = () => setZoom(map.getZoom());
    map.on('zoomend', handleZoom);
    return () => map.off('zoomend', handleZoom);
  }, [map, setZoom]);

  return null;
}

export default function AnalysisMap({ targetRef, onRunAnalysis, isAnalyzing: externalIsAnalyzing = false }) {
  const [zoom, setZoom] = useState(MARGALLA_HILLS_ZOOM);
  const [coords, setCoords] = useState({ lat: '33.7438', lng: '73.0228' });
  const [mapInstance, setMapInstance] = useState(null);
  const [drawnLayers, setDrawnLayers] = useState([]);
  
  // Re-center directly on Margalla Hills AOI
  const handleResetView = () => {
    if (mapInstance) {
      const bounds = L.latLngBounds(MARGALLA_HILLS_AOI);
      mapInstance.flyToBounds(bounds, { duration: 1.2, padding: [25, 25] });
      setCoords({ lat: '33.7438', lng: '73.0228' });
    }
  };
  
  // 2D / 3D Mode Toggle State
  const [is3DMode, setIs3DMode] = useState(false);

  // Map Tile Type: 'satellite' | 'terrain' | 'street'
  const [mapType, setMapType] = useState('satellite');

  // Active drawing state
  const [isDrawingActive, setIsDrawingActive] = useState(false);

  // LiDAR Scanning state
  const isAnalyzing = externalIsAnalyzing;

  // AOI validation status: 'idle' | 'valid' | 'invalid'
  const [aoiStatus, setAoiStatus] = useState('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleRunAnalysis = () => {
    if (isAnalyzing) return;

    let payloadCoords = MARGALLA_HILLS_AOI;
    if (drawnLayers && drawnLayers.length > 0) {
      let raw = drawnLayers[0];
      // Robustly unwrap Leaflet nested array structures [[LatLng, LatLng, ...]]
      while (Array.isArray(raw) && raw.length > 0 && Array.isArray(raw[0])) {
        raw = raw[0];
      }
      if (Array.isArray(raw) && raw.length > 0) {
        payloadCoords = raw.map(pt => {
          if (pt && typeof pt === 'object') {
            const lat = pt.lat !== undefined ? pt.lat : pt[0];
            const lng = pt.lng !== undefined ? pt.lng : pt[1];
            return [Number(lat), Number(lng)];
          }
          return pt;
        });
      }
    }

    if (onRunAnalysis) {
      onRunAnalysis(payloadCoords);
    }
  };

  const handleZoomIn = () => mapInstance && mapInstance.zoomIn();
  const handleZoomOut = () => mapInstance && mapInstance.zoomOut();

  // Polygon creation handler with strict AOI boundary check fallback
  const _onCreated = (e) => {
    const { layerType, layer } = e;
    if (layerType === 'polygon' || layerType === 'rectangle') {
      const latLngs = layer.getLatLngs();
      const isValid = checkPolygonInsideAOI(latLngs, MARGALLA_HILLS_AOI);

      if (!isValid) {
        // Prevent polygon creation & remove invalid layer automatically from map
        if (layer.remove) {
          layer.remove();
        }
        if (layer._map) {
          layer._map.removeLayer(layer);
        }
        if (mapInstance) {
          mapInstance.removeLayer(layer);
        }

        setAoiStatus('invalid');
        setErrorMessage('You can only draw inside the Area of Interest.');
        setTimeout(() => {
          setErrorMessage('');
          setAoiStatus(drawnLayers.length > 0 ? 'valid' : 'idle');
        }, 4000);
        return;
      }

      // Valid polygon inside Margalla Hills AOI
      setAoiStatus('valid');
      setErrorMessage('');
      const center = layer.getBounds().getCenter();
      setCoords({
        lat: center.lat.toFixed(4),
        lng: center.lng.toFixed(4)
      });
      setDrawnLayers([latLngs]);
    }
  };

  const _onEdited = (e) => {
    const { layers } = e;
    let valid = true;
    layers.eachLayer((layer) => {
      const latLngs = layer.getLatLngs();
      if (!checkPolygonInsideAOI(latLngs, MARGALLA_HILLS_AOI)) {
        valid = false;
        if (layer.remove) layer.remove();
        if (mapInstance) mapInstance.removeLayer(layer);
      } else {
        const center = layer.getBounds().getCenter();
        setCoords({
          lat: center.lat.toFixed(4),
          lng: center.lng.toFixed(4)
        });
        setDrawnLayers([latLngs]);
      }
    });

    if (!valid) {
      setAoiStatus('invalid');
      setErrorMessage('You can only draw inside the Area of Interest.');
      setTimeout(() => setErrorMessage(''), 4000);
    } else {
      setAoiStatus('valid');
      setErrorMessage('');
    }
  };

  const _onDeleted = () => {
    setDrawnLayers([]);
    setAoiStatus('idle');
    setCoords({ lat: '33.7438', lng: '73.0228' });
  };

  return (
    <div className="analysis-map-container">
      
      {/* Top Controls Row */}
      <div className="map-top-header">
        
        {/* Left Side: 2D vs 3D Mode & Map Type Toggle Switches */}
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
          <div className="view-mode-toggle">
            <button 
              type="button"
              className={`mode-btn ${!is3DMode ? 'active' : ''}`}
              onClick={() => setIs3DMode(false)}
            >
              <Layers className="w-3.5 h-3.5" />
              2D View
            </button>
            <button 
              type="button"
              className={`mode-btn ${is3DMode ? 'active' : ''}`}
              onClick={() => setIs3DMode(true)}
            >
              <Box className="w-3.5 h-3.5" />
              3D Mode
            </button>
          </div>

          <div className="view-mode-toggle">
            <button 
              type="button"
              className={`mode-btn ${mapType === 'satellite' ? 'active' : ''}`}
              onClick={() => setMapType('satellite')}
            >
              Satellite
            </button>
            <button 
              type="button"
              className={`mode-btn ${mapType === 'terrain' ? 'active' : ''}`}
              onClick={() => setMapType('terrain')}
            >
              Terrain
            </button>
            <button 
              type="button"
              className={`mode-btn ${mapType === 'street' ? 'active' : ''}`}
              onClick={() => setMapType('street')}
            >
              Street
            </button>
          </div>
        </div>

        {/* Right Side: Run Analysis Button */}
        <div className="run-analysis-wrapper">
          <button 
            type="button"
            className={`run-analysis-btn ${isAnalyzing ? 'analyzing' : ''}`} 
            onClick={handleRunAnalysis}
            disabled={isAnalyzing}
          >
            {isAnalyzing ? (
              <>
                <Radar className="w-4 h-4 animate-spin text-emerald-300" />
                <span>Scanning...</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-current" />
                <span>Run Analysis</span>
              </>
            )}
          </button>
        </div>

      </div>

      {/* Map Workspace Container */}
      <div className={`map-workspace ${is3DMode ? 'map-workspace-3d' : ''} ${isAnalyzing ? 'workspace-scanning' : ''} ${isDrawingActive ? 'drawing-active' : ''}`}>
        
        <MapContainer 
          center={MARGALLA_HILLS_CENTER} 
          zoom={zoom} 
          style={{ height: '100%', width: '100%' }}
          zoomControl={false}
          scrollWheelZoom={true}
          dragging={true}
          touchZoom={true}
          doubleClickZoom={false}
          ref={setMapInstance}
        >
          {/* Dynamic Base Tile Layer based on selected Map Type */}
          {mapType === 'satellite' && (
            <TileLayer
              attribution='Tiles &copy; Esri &mdash; Satellite'
              url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
            />
          )}
          {mapType === 'terrain' && (
            <TileLayer
              attribution='Tiles &copy; Esri &mdash; Topographic'
              url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}"
            />
          )}
          {mapType === 'street' && (
            <TileLayer
              attribution='&copy; OpenStreetMap contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
          )}

          {/* 3D Elevation & Hillshade Overlay when 3D Mode is active */}
          {is3DMode && (
            <TileLayer
              attribution='Esri World Hillshade'
              url="https://server.arcgisonline.com/ArcGIS/rest/services/Elevation/World_Hillshade/MapServer/tile/{z}/{y}/{x}"
              opacity={0.45}
            />
          )}

          {/* Inverted Dark Blur Mask: Dims and blurs everything outside Margalla Hills AOI */}
          <Polygon 
            positions={INVERTED_AOI_MASK}
            pathOptions={{
              color: 'transparent',
              fillColor: '#0f172a',
              fillOpacity: 0.65,
              className: 'aoi-outside-mask',
              interactive: false
            }}
          />

          {/* Predefined Margalla Hills AOI Boundary Overlay */}
          <Polygon 
            positions={MARGALLA_HILLS_AOI}
            pathOptions={{
              color: isAnalyzing ? '#34d399' : '#10b981',
              weight: isAnalyzing ? 3.5 : 3,
              dashArray: isAnalyzing ? 'none' : '8, 8',
              fillColor: isAnalyzing ? '#059669' : '#10b981',
              fillOpacity: isAnalyzing ? 0.50 : 0.35,
              className: `margalla-aoi-polygon ${isAnalyzing ? 'polygon-scanning-active' : ''}`,
              interactive: !isDrawingActive
            }}
          >
            <Tooltip permanent direction="top" className="aoi-boundary-tooltip" offset={[0, -10]}>
              🌿 Margalla Hills AOI
            </Tooltip>
          </Polygon>
          
          {/* Drawing Tool Feature Group */}
          <FeatureGroup>
            <EditControl
              position="topleft"
              onCreated={_onCreated}
              onEdited={_onEdited}
              onDeleted={_onDeleted}
              draw={{
                polygon: {
                  allowIntersection: false,
                  showArea: true,
                  drawError: { color: '#ef4444', message: '<strong>Error:</strong> Shapes cannot intersect!' },
                  shapeOptions: { 
                    color: aoiStatus === 'invalid' ? '#ef4444' : (isAnalyzing ? '#34d399' : '#10b981'), 
                    fillColor: aoiStatus === 'invalid' ? '#ef4444' : (isAnalyzing ? '#059669' : '#10b981'), 
                    fillOpacity: isAnalyzing ? 0.50 : 0.35,
                    className: isAnalyzing ? 'polygon-scanning-active' : ''
                  }
                },
                rectangle: {
                  showArea: true,
                  shapeOptions: {
                    color: aoiStatus === 'invalid' ? '#ef4444' : (isAnalyzing ? '#34d399' : '#10b981'), 
                    fillColor: aoiStatus === 'invalid' ? '#ef4444' : (isAnalyzing ? '#059669' : '#10b981'), 
                    fillOpacity: isAnalyzing ? 0.50 : 0.35,
                    className: isAnalyzing ? 'polygon-scanning-active' : ''
                  }
                },
                circle: false,
                circlemarker: false,
                marker: false,
                polyline: false,
              }}
            />
          </FeatureGroup>

          <MapController 
            setZoom={setZoom} 
            is3DMode={is3DMode} 
            setIs3DMode={setIs3DMode}
            setErrorMessage={setErrorMessage}
            setAoiStatus={setAoiStatus}
            drawnLayersCount={drawnLayers.length}
            setIsDrawingActive={setIsDrawingActive}
            isAnalyzing={isAnalyzing}
          />
        </MapContainer>
        
        {/* Coordinates Overlay HUD */}
        <div className="map-coordinates">
          <div className="target-region-title">MARGALLA HILLS AOI</div>
          <div>LAT: {coords.lat}° N &nbsp;|&nbsp; LNG: {coords.lng}° E</div>
        </div>

        {/* Live AOI Status Indicator Badge */}
        {!isAnalyzing && (
          <div className={`aoi-status-badge ${aoiStatus}`}>
            {aoiStatus === 'valid' && (
              <>
                <CheckCircle className="w-4 h-4 text-emerald-500" />
                <span>Valid Polygon (Inside Margalla Hills AOI)</span>
              </>
            )}
            {aoiStatus === 'invalid' && (
              <>
                <AlertTriangle className="w-4 h-4 text-red-500" />
                <span>Restricted! Draw inside Margalla Hills AOI</span>
              </>
            )}
            {aoiStatus === 'idle' && (
              <>
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>AOI Active — Draw Polygon inside Margalla Hills Boundary</span>
              </>
            )}
          </div>
        )}

        {/* Restricted Area Toast Popup */}
        {errorMessage && (
          <div className="aoi-error-toast">
            <AlertTriangle className="w-4 h-4 text-red-400" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Pure Visual Satellite Remote Sensing Scanning Effect */}
        {isAnalyzing && (
          <div className="satellite-lidar-overlay">
            {/* Animated LiDAR Laser Beam Rays sweeping top to bottom across polygon */}
            <div className="lidar-scan-ray-primary"></div>
            <div className="lidar-scan-ray-secondary"></div>
            <div className="lidar-sweep-beam"></div>

            {/* Remote Sensing Grid Matrix Sweep Overlay */}
            <div className="lidar-grid-matrix"></div>
          </div>
        )}

        {/* Right Side Navigation Widgets */}
        <div className="map-controls-widget">
          <button type="button" onClick={handleResetView} className="widget-btn" title="Focus Margalla Hills AOI">
            <Crosshair className="w-5 h-5 text-emerald-600" />
          </button>
          <button type="button" onClick={handleZoomIn} className="widget-btn" title="Zoom In">
            <Plus className="w-5 h-5 text-gray-700" />
          </button>
          <button type="button" onClick={handleZoomOut} className="widget-btn" title="Zoom Out">
            <Minus className="w-5 h-5 text-gray-700" />
          </button>
          <button 
            type="button"
            onClick={() => setIs3DMode(!is3DMode)} 
            className={`widget-btn ${is3DMode ? 'active' : ''}`}
            title="Toggle 3D View"
          >
            <Box className="w-5 h-5 text-gray-700" />
          </button>
        </div>

      </div>
    </div>
  );
}
