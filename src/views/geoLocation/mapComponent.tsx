import React, { useEffect, useRef, useState } from 'react';
import { DrawingManager, GoogleMap, Polygon, useJsApiLoader } from '@react-google-maps/api';
import deleteIcon from '@assets/images/bin.png'
import handIcon from '@assets/images/hand.png'
import drawIcon from '@assets/images/draw.png'
import { MapComponentProps } from '@type/geoLocation';
import { useTranslation } from 'react-i18next';

const MapComponent = ({ onPolygonDrawn, polyOptions, address }: MapComponentProps) => {
    const { t } = useTranslation();
    const mapRef = useRef<google.maps.Map | null>(null);
    const polygonRefs = useRef<google.maps.Polygon>();
    const drawingManagerRef = useRef<google.maps.drawing.DrawingManager | null>(null);

    useEffect(() => {
        const polygonData = polyOptions as {
            latitude: string;
            longitude: string;
        }[];
        setPolygons(polygonData.map((item) => {
            return { lat: +item.latitude, lng: +item.longitude };
        }));

        if (address) {
            moveToAddress(address);
        }
    }, [polyOptions, address]);
    const [defaultCenter, setDefaultCenter] = useState<google.maps.LatLngLiteral>({
        lat: 23.04,
        lng: 72.5
    })

    const moveToAddress = (address: string) => {
        const geocoder = new google.maps.Geocoder();
        geocoder.geocode({ address }, (results: google.maps.GeocoderResult[] | null, status: google.maps.GeocoderStatus) => {
            if (status === google.maps.GeocoderStatus.OK && results) {
                const location = results[0].geometry.location;
                mapRef.current?.setCenter(location);
                setDefaultCenter({
                    lat: location.lat(),
                    lng: location.lng()
                });

                mapRef.current?.setZoom(15);
            }
        });
    };

    const { isLoaded } = useJsApiLoader({
        googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY || '',
        libraries: ['places', 'drawing']
    });

    const [polygons, setPolygons] = useState<google.maps.LatLngLiteral[]>([]);
    const [drawingMode, setDrawingMode] = useState<google.maps.drawing.OverlayType | null>(null);

    const [center, setCenter] = useState<google.maps.LatLngLiteral | null>(defaultCenter);

    const containerStyle: React.CSSProperties = {
        width: '100%',
        height: '800px',
    };

    const polygonOptions: google.maps.PolygonOptions = {
        fillOpacity: 0.3,
        fillColor: '#ff0000',
        strokeColor: '#ff0000',
        strokeWeight: 2,
        draggable: true,
        editable: true
    };

    const drawingManagerOptions: google.maps.drawing.DrawingManagerOptions = {
        polygonOptions: polygonOptions,
        drawingControl: false, // Remove default drawing controls
    };

    const onLoadMap = (map: google.maps.Map) => {
        mapRef.current = map;
    };

    const onLoadPolygon = (polygon: google.maps.Polygon) => {
        polygonRefs.current = polygon;
    };

    const onLoadDrawingManager = (drawingManager: google.maps.drawing.DrawingManager) => {
        drawingManagerRef.current = drawingManager;
    };

    const onOverlayComplete = (overlayEvent: google.maps.drawing.OverlayCompleteEvent) => {
        overlayEvent.overlay?.setMap(null)
    };



    const handlePolygonComplete = (polygon: google.maps.Polygon) => {
        const coordinates = polygon
            .getPath()
            .getArray()
            .map((latLng) => ({
                lat: latLng.lat(),
                lng: latLng.lng(),
            }));
        setPolygons(coordinates);
        if (onPolygonDrawn) {
            onPolygonDrawn(coordinates)
        }
    }

    const onDeleteDrawing = () => {
        setPolygons([]);
    };
    const onStartDrawing = () => {
        setDrawingMode(window.google?.maps?.drawing?.OverlayType?.POLYGON);
    };
    const onStopDrawing = () => {
        setDrawingMode(null);
    };
    const onEditPolygon = () => {
        const polygonRef = polygonRefs.current;
        if (polygonRef) {
            const coordinates = polygonRef
                .getPath()
                .getArray()
                .map((latLng) => ({
                    lat: latLng.lat(),
                    lng: latLng.lng(),
                }));
            setPolygons(coordinates);
            if (onPolygonDrawn) {
                onPolygonDrawn(coordinates)
            }
        }
    }

    return (
        isLoaded ?
            <div style={{ position: 'relative' }}>
                <div className="map-icons">
                    <div aria-label='clear-region' aria-hidden='true' className="icon-container" onClick={onDeleteDrawing}>
                        <img
                            src={deleteIcon}
                            alt="Delete Shape"
                            className="map-iconData"
                        />
                        <span className="icon-label">{t('Clear region')}</span>
                    </div>
                    <div aria-label='move-map' aria-hidden='true' className="icon-container" onClick={onStopDrawing}>
                        <img
                            src={handIcon}
                            alt="Stop Drawing"
                            className="map-iconData"
                        />
                        <span className="icon-label">{t('Move Map')}</span>
                    </div>
                    <div aria-label='mark-region' aria-hidden='true' className="icon-container" onClick={onStartDrawing}>
                        <img
                            src={drawIcon}
                            alt="Start Drawing"
                            className="map-iconData"
                        />
                        <span className="icon-label">{t('Mark Region')}</span>
                    </div>
                </div>

                <GoogleMap
                    zoom={15}
                    center={center || defaultCenter}
                    onLoad={onLoadMap}
                    mapContainerStyle={containerStyle}
                    onTilesLoaded={() => setCenter(null)}
                >
                    <DrawingManager
                        onLoad={onLoadDrawingManager}
                        onOverlayComplete={onOverlayComplete}
                        onPolygonComplete={handlePolygonComplete}
                        options={drawingManagerOptions}
                        drawingMode={drawingMode} // Set drawing mode
                    />
                    <Polygon
                        onLoad={(event) => onLoadPolygon(event as google.maps.Polygon)}
                        options={polygonOptions}
                        paths={polygons}
                        draggable
                        onMouseUp={onEditPolygon}
                        editable
                    />
                </GoogleMap>
            </div>
            : null
    );
};

export default MapComponent;