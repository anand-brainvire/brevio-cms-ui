# Custom Server Side Datatable

### How to Used

```
  <BVDataTable
    queryName={GET_BANNER}
    singleDeleteMutation={GROUP_DELETE_BANNER}
    multipleDeleteMutation={GROUP_DELETE_BANNER}
    updateStatusMutation={STATUS_CHANGE}
    columns={COL_ARR}
    defaultActions={['edit', 'delete', 'change_status', 'multiple_delete', 'view']}
    actionData={{
      edit: {
        route: ROUTES.banner,
      },
      view: {
        route: ROUTES.banner
      }
    }}
    actionWisePermissions={{
      edit: PERMISSION_LIST.Banner.EditAccess,
      delete: PERMISSION_LIST.Banner.DeleteAccess,
      changeStatus: PERMISSION_LIST.Banner.ChangeStatusAccess,
      multipleDelete: PERMISSION_LIST.Banner.GroupDeleteAcsess,
    }}
    sessionFilterName="filterBanner"
    updatedFilterData={filterData}
    idKey={'uuid'}
    multipleDeleteApiId={'groupDeleteBannerId'}
    singleDeleteApiId={'groupDeleteBannerId'}
    statusChangeApiId={'updateBannerStatusId'}
    statusKey={'status'}
    statusChangeApiKeyTitle={'status'}
    rowRefData={handleRowRef}
    extraActions={
	    <RoleBaseGuard permissions={[PERMISSION_LIST.SubAdmin.ChangePasswordAccess]}>
            <Button title={AccesibilityNames.ChangePassword}  route={''} onClick={changePasswordSubAdminFun} icon={<Key />} spanClassName='svg-icon inline-block h-3.5 w-3.5' label={''} className='btn-default' />
		</RoleBaseGuard>
    }
  />
```

## Available Props

| Property                | Type                                                                           | Required | Explanation                                                                                                |
| ----------------------- | ------------------------------------------------------------------------------ | -------- | ---------------------------------------------------------------------------------------------------------- |
| Columns                 | IColumnsProps[]                                                                | Yes      | Table Columns Header Name                                                                                  |
| queryName               | DocumentNode `OR` TypedDocumentNode<TData, TVariables>                         | Yes      | Listing Query (Query Name)                                                                                 |
| singleDeleteMutation    | DocumentNode `OR` TypedDocumentNode<TData, TVariables>                         | No       | Single Record Delete Query (delete record query name)                                                      |
| multipleDeleteMutation  | DocumentNode `OR` TypedDocumentNode<TData, TVariables>                         | No       | Multiple Record Delete Query name                                                                          |
| updateStatusMutation    | DocumentNode `OR` TypedDocumentNode<TData, TVariables>                         | No       | Update the Record Status to Active / Inactive Mutation Name                                                |
| sessionFilterName       | string                                                                         | Yes      | Stored Filter session data inside a session storage with it's name                                         |
| updatedFilterData       | [x: string]: T                                                                 | Yes      | Your Filter values with key pair                                                                           |
| actionWisePermissions   | IActionWisePermissions                                                         | No       | Permission to show and hide for action columns action buttons like edit, change status, delete             |
| defaultActions          | Array<'edit' , 'delete', 'change_status', 'view', 'multiple_delete'> `OR` null | Yes      | Default action which are Commanly present in All modules. Display Edit, Delete, View, Change Status Button |
| actionData              | IActionData                                                                    | No       | If We are displying the Edit and view button then redirect url we need to add                              |
| extraActions            | ReactNode                                                                      | No       | Required to Display custom Actions in Action Column                                                        |
| statusKey               | string                                                                         | No       | default `status`, If your status key name is changed from response then you can write your key name        |
| idKey                   | string                                                                         | Yes      | Your Unique Id key for handling the checkbox and redirect in edit and view page based on id like uuid key  |
| multipleDeleteApiId     | string                                                                         | No       | default `idKey`, Your Multiple Delete Mutation variable key name                                           |
| singleDeleteApiId       | string                                                                         | No       | default `idKey`, Your Single Delete Mutation variable key name                                             |
| statusChangeApiId       | string                                                                         | No       | default `idKey`, Your Status change Mutation variable id key name                                          |
| statusChangeApiKeyTitle | string                                                                         | No       | default `idKey`, Your Status change Mutation variable status key name                                      |
| rowRefData              | (data:IListData)=>void                                                         | No       | To access ref data need pass function we will get data as props                                            |

## Props Type With Defination

-   IColumnsProps
    ```
    IColumnsProps {
        fieldName: string;
        name: string;
        sortable: boolean;
        type: 'image' | 'text' | 'date' | 'status' | 'action' | 'badge' | 'ratings'|'number';
        headerCenter: boolean;
        conversationValue?: IListData;
        isBase64ImageUrl?: boolean;
    }
    ```
-   IActionWisePermissions
    ```
    IActionWisePermissions {
        edit?: string;
        delete?: string;
        changeStatus?: string;
        view?: string;
        multipleDelete?: string;
    }
    ```
-   IActionData
    ```
    IActionData {
        edit?: {
            route: string;
        },
        view?: {
            route: string;
        }
    }
    ```

## Props Example data

-   defaultActions
    ```
    defaultActions={['edit', 'delete']}
    ```
-   columns

    ```
    [
        { name: 'Thumb', sortable: false, fieldName: 'filePath', type: 'image' },
        { name: 'Banner Title', sortable: true, fieldName: 'banner_title', type: 'text', },
        { name: 'Created By', sortable: true, fieldName: 'created_by', type: 'date',},
        { name: 'Created At', sortable: true, fieldName: 'created_at', type: 'date',},
        { name: 'Status', sortable: true, fieldName: 'status', type: 'status' },

    ]
    ```

-   actionWisePermissions
    ```
    {
      edit: 'EDIT_ACCESS',
      delete: "DELETE_ACCESS',
      changeStatus: 'CHANGE_STATUS_ACCESS',
      multipleDelete: 'GROUP_DELETE_ACCESS',
    }
    ```
-   updatedFilterData
    ```
        {
            page: 1,
            limit: 10,
            bannerTitle: '',
            createdBy: '',
            status: null,
            sortBy: 'created_at',
            sortOrder: sortOrder,
        }
    ```
-   actionData
    ```
    {
      edit: {
        route: 'banner-edit',
      },
      view: {
          route: 'banner-view'
      }
    }
    ```

## Api Response should be below

-   Required a api response in below format
    ```
    {
        "data": {
            "fetchBanner": {
                "data": {
                    "BannerData": [
                        {
                            "id": "139",
                            "uuid": "88309b09-81cd-4f54-bb43-024a97bea779",
                            "banner_title": "newBanner",
                            "banner_title_arabic": "newBanner",
                            "banner_image": null,
                            "status": 1,
                            "created_by": 6,
                            "created_at": "2024-01-03T07:36:29.689Z",
                            "updated_at": "2024-01-03T12:47:06.811Z",
                            "filePath": {
                                "original_file": "/uploads/banner-img/original_image/null",
                                "image_200": "/uploads/banner-img/200_200/null",
                                "__typename": "bannerPath"
                            },
                            "serialNo": 1,
                            "__typename": "fetchBanner"
                        },
                        {
                            "id": "138",
                            "uuid": "16a59f1b-819c-419f-ad3a-11ce8d48f582",
                            "banner_title": "Cyberpunk",
                            "banner_title_arabic": "Cyberpunk",
                            "banner_image": "1704262920083_wallpaper.jpg",
                            "status": 1,
                            "created_by": 6,
                            "created_at": "2024-01-03T06:22:00.031Z",
                            "updated_at": "2024-01-03T06:22:00.219Z",
                            "filePath": {
                                "original_file": "/uploads/banner-img/original_image/1704262920083_wallpaper.jpg",
                                "image_200": "/uploads/banner-img/200_200/1704262920083_wallpaper.jpg",
                                "__typename": "bannerPath"
                            },
                            "serialNo": 2,
                            "__typename": "fetchBanner"
                        },
                    ],
                    "count": 4,
                    "__typename": "BannerPagination"
                }
            }
        }
    }
    ```
