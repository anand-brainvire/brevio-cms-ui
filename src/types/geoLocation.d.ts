export type CreateGeoLocation = {
    name: string;
    address: string;
};

export type FilterGeoLocationProps = {
    name: string;
    address: string
};
export type GeoLocationProps = {
    onSearchGeoLocation: (values: FilterQrCodeProps) => void;
    clearSelectionGeoLocation: () => void;
    filterData: PaginationParams;
};


export interface PolyOptions {
    latitude: string;
    longitude: string;
    __typename: string;
}

export interface MapComponentProps {
    onPolygonDrawn?: (coordinates: google.maps.LatLngLiteral[]) => void;
    polyOptions?: PolyOptions[] | null;
    address?: string | null;
}

interface viewGeoLocation {
    lat_long: [];
    name: string;
    address: string;
    status: string;
}
