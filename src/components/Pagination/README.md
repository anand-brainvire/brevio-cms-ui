# Custom Server Side Datatable 

### How to Used

```
  <Pagination currentPage={filterData?.page} totalPages={totalPages} onPageChange={handlePageChange} recordsPerPage={recordsPerPage} />
```



## Available Props

| Property | Type | Required | Explanation |
| ------------  | ------------ | ------------ |------------ |
| currentPage | number[] | Yes | Current Active Page Number  |
| totalPages | number | Yes | Total Page count (All the page count)  |
| onPageChange | (newPage: number, newRecordsPerPage?: number) => void | Yes | On Page change share the details to calling component |


## Props Example data
- currentPage
    ```
    currentPage='2'
    ```
- totalPages
    ```
    totalPages='5'
    ```