import { gql } from '@apollo/client';
import { META_FRAGMENT } from '@framework/graphql/fragments';

export const CREATE_GEO_LOCATION = gql`
${META_FRAGMENT}
mutation CreateGeoLocation($name: String, $address: String, $latLong: [latitudeLongitude], $status: Int) {
    createGeoLocation(name: $name, address: $address, lat_long: $latLong, status: $status) {
      data {
        id
        uuid
        name
        address
        lat_long {
          latitude
          longitude
        }
        status
        created_by
        updated_by
        created_at
        updated_at
      }
      meta {
      ...MetaFragment
      }
    }
  }
`;


export const UPDATE_GEO_LOCATION = gql`
mutation UpdateGeoLocation($uuid: UUID, $name: String, $address: String, $latLong: [latitudeLongitude], $status: Int) {
  updateGeoLocation(uuid: $uuid, name: $name, address: $address, lat_long: $latLong, status: $status) {
    data {
      id
      uuid
      name
      address
      lat_long {
        latitude
        longitude
      }
      status
      created_by
      updated_by
      created_at
      updated_at
    }
    meta {
      message
      messageCode
      statusCode
      status
      type
      errors {

        errorField
        error
      }
      errorType
    }
  }
}
`

export const GROUP_DELETE_GEOLOCATION = gql`
mutation GroupDeleteGeoLocation($uuid: [UUID]) {
  groupDeleteGeoLocation(uuid: $uuid) {
    meta {
      message
      messageCode
      statusCode
      status
      type
      errors {
        errorField
        error
      }
      errorType
    }
  }
}`

export const SINGLE_DELETE_GEOLOCATION = gql`mutation DeleteGeoLocation($uuid: UUID) {
  deleteGeoLocation(uuid: $uuid) {
    meta {
      message
      messageCode
      statusCode
      status
      type
      errors {
        errorField
        error
      }
      errorType
    }
  }
}`


export const CHANGE_GEOLOCATION_STATUS = gql`
mutation UpdateGeoLocationStatus($uuid: UUID, $status: Int) {
  updateGeoLocationStatus(uuid: $uuid, status: $status) {
    data {
      id
      uuid
      name
      address
      lat_long {
        latitude
        longitude
      }
      status
      created_by
      updated_by
      created_at
      updated_at
    }
    meta {
      message
      messageCode
      statusCode
      status
      type
      errors {
        errorField
        error
      }
      errorType
    }
  }
}`