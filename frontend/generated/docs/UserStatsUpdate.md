# UserStatsUpdate

Model for updating user stats.

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**points_to_add** | **number** |  | [optional] [default to undefined]
**todos_completed** | **number** |  | [optional] [default to undefined]
**skills_completed** | **number** |  | [optional] [default to undefined]
**update_streak** | **boolean** |  | [optional] [default to undefined]

## Example

```typescript
import { UserStatsUpdate } from './api';

const instance: UserStatsUpdate = {
    points_to_add,
    todos_completed,
    skills_completed,
    update_streak,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
