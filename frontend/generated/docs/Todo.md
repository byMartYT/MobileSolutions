# Todo

Todo model representing a collection of todo items with associated metadata.

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**title** | **string** | Title of the todo collection | [default to undefined]
**user** | **string** | User ID associated with the todo | [default to undefined]
**icon** | **string** | Icon identifier for the todo | [default to undefined]
**color** | **string** | Color code for styling the todo | [default to undefined]
**textColor** | **string** | Text color code for styling | [default to undefined]
**tip** | **string** | Helpful tip or description | [default to undefined]
**goal** | **string** | Goal or objective of the todo collection | [default to undefined]
**todos** | [**Array&lt;TodoItem&gt;**](TodoItem.md) | List of todo items | [default to undefined]
**id** | **string** |  | [optional] [default to undefined]

## Example

```typescript
import { Todo } from './api';

const instance: Todo = {
    title,
    user,
    icon,
    color,
    textColor,
    tip,
    goal,
    todos,
    id,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
