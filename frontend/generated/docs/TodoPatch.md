# TodoPatch

Todo patch model for partial updates of todo items. All fields are optional to allow for partial updates.

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**title** | **string** |  | [optional] [default to undefined]
**user** | **string** |  | [optional] [default to undefined]
**icon** | **string** |  | [optional] [default to undefined]
**color** | **string** |  | [optional] [default to undefined]
**textColor** | **string** |  | [optional] [default to undefined]
**tip** | **string** |  | [optional] [default to undefined]
**goal** | **string** |  | [optional] [default to undefined]
**todos** | [**Array&lt;TodoItem&gt;**](TodoItem.md) |  | [optional] [default to undefined]

## Example

```typescript
import { TodoPatch } from './api';

const instance: TodoPatch = {
    title,
    user,
    icon,
    color,
    textColor,
    tip,
    goal,
    todos,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
