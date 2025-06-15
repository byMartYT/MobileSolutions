# ConversationContext


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**domain** | **string** |  | [optional] [default to undefined]
**goals** | **Array&lt;string&gt;** |  | [optional] [default to undefined]
**difficulty** | **string** |  | [optional] [default to undefined]
**timeframe** | **string** |  | [optional] [default to undefined]
**preferences** | **{ [key: string]: any; }** |  | [optional] [default to undefined]
**collected_info** | **{ [key: string]: any; }** |  | [optional] [default to undefined]

## Example

```typescript
import { ConversationContext } from './api';

const instance: ConversationContext = {
    domain,
    goals,
    difficulty,
    timeframe,
    preferences,
    collected_info,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
