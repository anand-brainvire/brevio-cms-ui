import React, { ReactElement, useCallback, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { useFormik } from 'formik';
import { useTranslation } from 'react-i18next';
import TextInput from '@components/textinput/TextInput';
import Button from '@components/button/button';
import { useMutation, useQuery } from '@apollo/client';
import { useNavigate, useParams } from 'react-router-dom';
import { GOOGLE_MAP_KEY, ROUTES, STATUS_RADIO } from '@config/constant';
import { Cross } from '@components/icons/icons';
import RadioButton from '@components/radiobutton/radioButton';
import MapComponent from '@views/geoLocation/mapComponent';
import { GET_GEOLOCATION_BY_ID } from '@framework/graphql/queries/geoLocation';
import useValidation from '@src/hooks/validations';
import { Autocomplete, useJsApiLoader } from '@react-google-maps/api';
import { UPDATE_GEO_LOCATION } from '@framework/graphql/mutations/geoLocation';

const ViewGeoLocation = (): ReactElement => {
    const { isLoaded } = useJsApiLoader({
        googleMapsApiKey: GOOGLE_MAP_KEY || '',
        libraries: ['places', 'drawing'],
    });
    const { t } = useTranslation();
    const params = useParams();
    const navigate = useNavigate();
    const [updateGeoLocationMutation] = useMutation(UPDATE_GEO_LOCATION);
    const { data: geoLocationData } = useQuery(GET_GEOLOCATION_BY_ID, {
        variables: { uuid: params.id },
        skip: !params.id,
        fetchPolicy: 'network-only',
    });
    const { geoLocationValidationSchema } = useValidation();
    const [polygonCoords, setPolygonCoords] = useState<google.maps.LatLngLiteral[] | null>(null);
    useEffect(() => {
        if (geoLocationData && params.id) {
            const data = geoLocationData?.getGeoLocation?.data;
            formik.setValues({
                uuid: params.id || null,
                name: data?.name,
                address: data?.address,
                latLong: data?.lat_long,
                status: data?.status,
            });
        }
    }, [geoLocationData]);

    const initialValues = {
        uuid: params.id ? params.id : null,
        name: '',
        address: '',
        latLong: [],
        status: +1,
    };

    const formik = useFormik({
        initialValues,
        validationSchema: geoLocationValidationSchema,
        onSubmit: (values) => {
            const { uuid } = values;
            if (uuid) {
                updateGeoLocationMutation({
                    variables: {
                        uuid: params.id,
                        name: values.name,
                        address: values.address,
                        latLong: values.latLong,
                        status: +values.status,
                    },
                })
                    .then((res) => {
                        const data = res.data.updateGeoLocation;
                        if (data.meta.statusCode === 200) {
                            toast.success(data.meta.message);
                            navigate(`/${ROUTES.app}/${ROUTES.geoLocation}/${ROUTES.list}`);
                        } else {
                            toast.error(data.meta.message);
                        }
                    });
            }
        },
    });

    const onCancelGeoLocation = useCallback(() => {
        navigate(`/${ROUTES.app}/${ROUTES.geoLocation}/${ROUTES.list}`);
    }, [navigate]);

    const handlePolygonDrawn = (coordinates: google.maps.LatLngLiteral[]): void => {
        setPolygonCoords(coordinates);
    };



    const handleSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
        e.preventDefault();
        const latLongArray = polygonCoords ? polygonCoords.map((polygon) => ({
            latitude: polygon.lat.toFixed(6),
            longitude: polygon.lng.toFixed(6)
        })) : [];

        formik.setFieldValue('latLong', latLongArray);
        formik.handleSubmit();
    };

    return (
        <div className='card'>
            <form onSubmit={handleSubmit}>
                <div className='card-body'>
                    <div className='card-title-container'>
                        <p>
                            {t('Fields marked with')} <span className='error'>*</span> {t('are mandatory.')}
                        </p>
                    </div>
                    <div className='card-grid-addedit-page md:grid-cols-2'>
                        <div>
                            <TextInput
                                id={'name'}
                                required={true}
                                disabled={true}
                                placeholder={t('Name')}
                                name='name'
                                label={t('Name')}
                                value={formik.values.name}
                            />
                        </div>
                        <div>
                            {isLoaded &&

                                <Autocomplete>
                                    <TextInput
                                        id={'address'}
                                        disabled={true}
                                        required={true}
                                        placeholder={t('Address')}
                                        name='address'
                                        label={t('Address')}
                                        value={formik.values.address}
                                    />
                                </Autocomplete>
                            }
                        </div>
                        <RadioButton
                            id={'statusGeoLocation'}
                            required={true}
                            checked={formik.values.status}
                            name={'status'}
                            radioOptions={STATUS_RADIO}
                            label={t('Status')}
                        />
                    </div>
                </div>
                <div className="relative pointer-events-none">
                    <MapComponent
                        onPolygonDrawn={handlePolygonDrawn}
                        polyOptions={formik.values.latLong}
                        address={formik.values.address}
                    />
                </div>
                <div className='card-footer btn-group'>
                    <Button className='btn-primary ' label={t('Back')} onClick={onCancelGeoLocation}>
                        <span className='mr-1 w-2.5 h-2.5 text-white inline-block svg-icon'>
                            <Cross />
                        </span>
                    </Button>
                </div>
            </form>
        </div>
    );
};

export default ViewGeoLocation;
