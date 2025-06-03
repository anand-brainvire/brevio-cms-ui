import { gql } from '@apollo/client';

export const FETCH_GEOLOCATION = gql`
query FetchGeoLocations($page: Int, $limit: Int, $sortBy: String, $sortOrder: String, $name: String, $address: String, $status: Int, $isAll: Boolean) {
  fetchGeoLocations(page: $page, limit: $limit, sortBy: $sortBy, sortOrder: $sortOrder, name: $name, address: $address, status: $status, is_all: $isAll) {
    data {
      GeoLocationData {
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
        users {
          id
          uuid
          first_name
          middle_name
          last_name
          user_name
          email
          gender
          date_of_birth
          phone_no
          phone_country_id
          role
          user_type
          profile_img
          device_type
          device_token
          status
          created_at
          updated_at
          serialNo
        }
        serialNo
      }
      count
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

export const GET_GEOLOCATION_BY_ID = gql`
query GetGeoLocation($uuid: UUID) {
  getGeoLocation(uuid: $uuid) {
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
      users {
        id
        uuid
        first_name
        middle_name
        last_name
        user_name
        email
        gender
        date_of_birth
        phone_no
        phone_country_id
        role
        user_type
        profile_img
        device_type
        device_token
        status
        created_at
        updated_at
        serialNo
      }
      serialNo
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

