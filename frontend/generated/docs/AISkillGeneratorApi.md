# AISkillGeneratorApi

All URIs are relative to *http://localhost*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**deleteConversationApiV1AiConversationConversationIdDelete**](#deleteconversationapiv1aiconversationconversationiddelete) | **DELETE** /api/v1/ai/conversation/{conversation_id} | Delete Conversation|
|[**generateSkillApiV1AiGenerateSkillPost**](#generateskillapiv1aigenerateskillpost) | **POST** /api/v1/ai/generate-skill | Generate Skill|
|[**getConversationApiV1AiConversationConversationIdGet**](#getconversationapiv1aiconversationconversationidget) | **GET** /api/v1/ai/conversation/{conversation_id} | Get Conversation|
|[**healthCheckApiV1AiHealthGet**](#healthcheckapiv1aihealthget) | **GET** /api/v1/ai/health | Health Check|
|[**sendMessageApiV1AiSendMessagePost**](#sendmessageapiv1aisendmessagepost) | **POST** /api/v1/ai/send-message | Send Message|
|[**startConversationApiV1AiStartConversationPost**](#startconversationapiv1aistartconversationpost) | **POST** /api/v1/ai/start-conversation | Start Conversation|

# **deleteConversationApiV1AiConversationConversationIdDelete**
> any deleteConversationApiV1AiConversationConversationIdDelete()

Delete a conversation

### Example

```typescript
import {
    AISkillGeneratorApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new AISkillGeneratorApi(configuration);

let conversationId: string; // (default to undefined)

const { status, data } = await apiInstance.deleteConversationApiV1AiConversationConversationIdDelete(
    conversationId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **conversationId** | [**string**] |  | defaults to undefined|


### Return type

**any**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Successful Response |  -  |
|**422** | Validation Error |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **generateSkillApiV1AiGenerateSkillPost**
> SkillGenerationResponse generateSkillApiV1AiGenerateSkillPost(skillGenerationRequest)

Generate the final skill based on conversation

### Example

```typescript
import {
    AISkillGeneratorApi,
    Configuration,
    SkillGenerationRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new AISkillGeneratorApi(configuration);

let skillGenerationRequest: SkillGenerationRequest; //

const { status, data } = await apiInstance.generateSkillApiV1AiGenerateSkillPost(
    skillGenerationRequest
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **skillGenerationRequest** | **SkillGenerationRequest**|  | |


### Return type

**SkillGenerationResponse**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Successful Response |  -  |
|**422** | Validation Error |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **getConversationApiV1AiConversationConversationIdGet**
> ConversationState getConversationApiV1AiConversationConversationIdGet()

Get conversation state

### Example

```typescript
import {
    AISkillGeneratorApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new AISkillGeneratorApi(configuration);

let conversationId: string; // (default to undefined)

const { status, data } = await apiInstance.getConversationApiV1AiConversationConversationIdGet(
    conversationId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **conversationId** | [**string**] |  | defaults to undefined|


### Return type

**ConversationState**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Successful Response |  -  |
|**422** | Validation Error |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **healthCheckApiV1AiHealthGet**
> any healthCheckApiV1AiHealthGet()

Health check endpoint

### Example

```typescript
import {
    AISkillGeneratorApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new AISkillGeneratorApi(configuration);

const { status, data } = await apiInstance.healthCheckApiV1AiHealthGet();
```

### Parameters
This endpoint does not have any parameters.


### Return type

**any**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Successful Response |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **sendMessageApiV1AiSendMessagePost**
> ConversationResponse sendMessageApiV1AiSendMessagePost(messageRequest)

Send a message in the conversation

### Example

```typescript
import {
    AISkillGeneratorApi,
    Configuration,
    MessageRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new AISkillGeneratorApi(configuration);

let messageRequest: MessageRequest; //

const { status, data } = await apiInstance.sendMessageApiV1AiSendMessagePost(
    messageRequest
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **messageRequest** | **MessageRequest**|  | |


### Return type

**ConversationResponse**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Successful Response |  -  |
|**422** | Validation Error |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **startConversationApiV1AiStartConversationPost**
> ConversationResponse startConversationApiV1AiStartConversationPost()

Start a new AI skill generation conversation

### Example

```typescript
import {
    AISkillGeneratorApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new AISkillGeneratorApi(configuration);

const { status, data } = await apiInstance.startConversationApiV1AiStartConversationPost();
```

### Parameters
This endpoint does not have any parameters.


### Return type

**ConversationResponse**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Successful Response |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

