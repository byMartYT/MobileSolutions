# ConversationState


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**id** | **string** |  | [default to undefined]
**state** | **string** |  | [default to undefined]
**context** | [**ConversationContext**](ConversationContext.md) |  | [default to undefined]
**messages** | [**Array&lt;Message&gt;**](Message.md) |  | [default to undefined]
**is_complete** | **boolean** |  | [optional] [default to false]
**created_at** | **string** |  | [default to undefined]
**updated_at** | **string** |  | [default to undefined]

## Example

```typescript
import { ConversationState } from './api';

const instance: ConversationState = {
    id,
    state,
    context,
    messages,
    is_complete,
    created_at,
    updated_at,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
