# StoreApi

All URIs are relative to *https://petstore.swagger.io/v2*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**deleteOrder**](#deleteorder) | **DELETE** /store/order/{orderId} | Delete purchase order by ID|
|[**getInventory**](#getinventory) | **GET** /store/inventory | Returns pet inventories by status|
|[**getOrderById**](#getorderbyid) | **GET** /store/order/{orderId} | Find purchase order by ID|
|[**placeOrder**](#placeorder) | **POST** /store/order | Place an order for a pet|

# **deleteOrder**
> deleteOrder()

For valid response try integer IDs with positive integer value. Negative or non-integer values will generate API errors

### Example

```typescript
import {
    StoreApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new StoreApi(configuration);

let orderId: number; //ID of the order that needs to be deleted (default to undefined)

const { status, data } = await apiInstance.deleteOrder(
    orderId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **orderId** | [**number**] | ID of the order that needs to be deleted | defaults to undefined|


### Return type

void (empty response body)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: Not defined


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**400** | Invalid ID supplied |  -  |
|**404** | Order not found |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **getInventory**
> { [key: string]: number; } getInventory()

Returns a map of status codes to quantities

### Example

```typescript
import {
    StoreApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new StoreApi(configuration);

const { status, data } = await apiInstance.getInventory();
```

### Parameters
This endpoint does not have any parameters.


### Return type

**{ [key: string]: number; }**

### Authorization

[api_key](../README.md#api_key)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | successful operation |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **getOrderById**
> Order getOrderById()

For valid response try integer IDs with value >= 1 and <= 10. Other values will generated exceptions

### Example

```typescript
import {
    StoreApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new StoreApi(configuration);

let orderId: number; //ID of pet that needs to be fetched (default to undefined)

const { status, data } = await apiInstance.getOrderById(
    orderId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **orderId** | [**number**] | ID of pet that needs to be fetched | defaults to undefined|


### Return type

**Order**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json, application/xml


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | successful operation |  -  |
|**400** | Invalid ID supplied |  -  |
|**404** | Order not found |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **placeOrder**
> Order placeOrder(body)


### Example

```typescript
import {
    StoreApi,
    Configuration,
    Order
} from './api';

const configuration = new Configuration();
const apiInstance = new StoreApi(configuration);

let body: Order; //order placed for purchasing the pet

const { status, data } = await apiInstance.placeOrder(
    body
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **body** | **Order**| order placed for purchasing the pet | |


### Return type

**Order**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json, application/xml


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | successful operation |  -  |
|**400** | Invalid Order |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

