# TodosApi

All URIs are relative to *http://localhost*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**createTodoApiV1TodosPost**](#createtodoapiv1todospost) | **POST** /api/v1/todos/ | Create Todo|
|[**deleteTodoApiV1TodosTodoIdDelete**](#deletetodoapiv1todostodoiddelete) | **DELETE** /api/v1/todos/{todo_id} | Delete Todo|
|[**getTodoApiV1TodosTodoIdGet**](#gettodoapiv1todostodoidget) | **GET** /api/v1/todos/{todo_id} | Get Todo|
|[**getTodosApiV1TodosGet**](#gettodosapiv1todosget) | **GET** /api/v1/todos/ | Get Todos|
|[**partialUpdateTodoApiV1TodosTodoIdPatch**](#partialupdatetodoapiv1todostodoidpatch) | **PATCH** /api/v1/todos/{todo_id} | Partial Update Todo|
|[**updateTodoApiV1TodosTodoIdPut**](#updatetodoapiv1todostodoidput) | **PUT** /api/v1/todos/{todo_id} | Update Todo|
|[**updateTodoItemApiV1TodosTodoIdItemsItemIdPatch**](#updatetodoitemapiv1todostodoiditemsitemidpatch) | **PATCH** /api/v1/todos/{todo_id}/items/{item_id} | Update Todo Item|

# **createTodoApiV1TodosPost**
> Todo createTodoApiV1TodosPost(todo)

Create a new todo list

### Example

```typescript
import {
    TodosApi,
    Configuration,
    Todo
} from './api';

const configuration = new Configuration();
const apiInstance = new TodosApi(configuration);

let todo: Todo; //

const { status, data } = await apiInstance.createTodoApiV1TodosPost(
    todo
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **todo** | **Todo**|  | |


### Return type

**Todo**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**201** | Successful Response |  -  |
|**404** | Todo not found |  -  |
|**422** | Validation Error |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **deleteTodoApiV1TodosTodoIdDelete**
> deleteTodoApiV1TodosTodoIdDelete()

Delete a todo list by ID

### Example

```typescript
import {
    TodosApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new TodosApi(configuration);

let todoId: string; // (default to undefined)

const { status, data } = await apiInstance.deleteTodoApiV1TodosTodoIdDelete(
    todoId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **todoId** | [**string**] |  | defaults to undefined|


### Return type

void (empty response body)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**204** | Successful Response |  -  |
|**404** | Todo not found |  -  |
|**422** | Validation Error |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **getTodoApiV1TodosTodoIdGet**
> Todo getTodoApiV1TodosTodoIdGet()

Get a specific todo list by ID

### Example

```typescript
import {
    TodosApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new TodosApi(configuration);

let todoId: string; // (default to undefined)

const { status, data } = await apiInstance.getTodoApiV1TodosTodoIdGet(
    todoId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **todoId** | [**string**] |  | defaults to undefined|


### Return type

**Todo**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Successful Response |  -  |
|**404** | Todo not found |  -  |
|**422** | Validation Error |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **getTodosApiV1TodosGet**
> Array<Todo> getTodosApiV1TodosGet()

Get all todo lists with pagination

### Example

```typescript
import {
    TodosApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new TodosApi(configuration);

let skip: number; // (optional) (default to 0)
let limit: number; // (optional) (default to 10)

const { status, data } = await apiInstance.getTodosApiV1TodosGet(
    skip,
    limit
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **skip** | [**number**] |  | (optional) defaults to 0|
| **limit** | [**number**] |  | (optional) defaults to 10|


### Return type

**Array<Todo>**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Successful Response |  -  |
|**404** | Todo not found |  -  |
|**422** | Validation Error |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **partialUpdateTodoApiV1TodosTodoIdPatch**
> Todo partialUpdateTodoApiV1TodosTodoIdPatch(todoPatch)

Partially update a todo list by ID - only update the fields that are provided

### Example

```typescript
import {
    TodosApi,
    Configuration,
    TodoPatch
} from './api';

const configuration = new Configuration();
const apiInstance = new TodosApi(configuration);

let todoId: string; // (default to undefined)
let todoPatch: TodoPatch; //

const { status, data } = await apiInstance.partialUpdateTodoApiV1TodosTodoIdPatch(
    todoId,
    todoPatch
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **todoPatch** | **TodoPatch**|  | |
| **todoId** | [**string**] |  | defaults to undefined|


### Return type

**Todo**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Successful Response |  -  |
|**404** | Todo not found |  -  |
|**422** | Validation Error |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **updateTodoApiV1TodosTodoIdPut**
> Todo updateTodoApiV1TodosTodoIdPut(todo)

Update a todo list by ID

### Example

```typescript
import {
    TodosApi,
    Configuration,
    Todo
} from './api';

const configuration = new Configuration();
const apiInstance = new TodosApi(configuration);

let todoId: string; // (default to undefined)
let todo: Todo; //

const { status, data } = await apiInstance.updateTodoApiV1TodosTodoIdPut(
    todoId,
    todo
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **todo** | **Todo**|  | |
| **todoId** | [**string**] |  | defaults to undefined|


### Return type

**Todo**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Successful Response |  -  |
|**404** | Todo not found |  -  |
|**422** | Validation Error |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **updateTodoItemApiV1TodosTodoIdItemsItemIdPatch**
> Todo updateTodoItemApiV1TodosTodoIdItemsItemIdPatch(todoItemPatch)

Update a specific todo item within a todo list

### Example

```typescript
import {
    TodosApi,
    Configuration,
    TodoItemPatch
} from './api';

const configuration = new Configuration();
const apiInstance = new TodosApi(configuration);

let todoId: string; // (default to undefined)
let itemId: string; // (default to undefined)
let todoItemPatch: TodoItemPatch; //

const { status, data } = await apiInstance.updateTodoItemApiV1TodosTodoIdItemsItemIdPatch(
    todoId,
    itemId,
    todoItemPatch
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **todoItemPatch** | **TodoItemPatch**|  | |
| **todoId** | [**string**] |  | defaults to undefined|
| **itemId** | [**string**] |  | defaults to undefined|


### Return type

**Todo**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Successful Response |  -  |
|**404** | Todo not found |  -  |
|**422** | Validation Error |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

