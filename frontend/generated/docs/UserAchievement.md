# UserAchievement

User\'s unlocked achievement model.

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**user_id** | **string** | User ID | [default to undefined]
**achievement_id** | **string** | Achievement ID | [default to undefined]
**unlocked_at** | **string** | Unlock timestamp | [optional] [default to undefined]
**is_seen** | **boolean** | Whether user has seen the achievement notification | [optional] [default to false]
**id** | **string** |  | [optional] [default to undefined]

## Example

```typescript
import { UserAchievement } from './api';

const instance: UserAchievement = {
    user_id,
    achievement_id,
    unlocked_at,
    is_seen,
    id,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
