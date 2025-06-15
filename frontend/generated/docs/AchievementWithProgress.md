# AchievementWithProgress

Achievement with user progress.

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**name** | **string** | Achievement name | [default to undefined]
**description** | **string** | Achievement description | [default to undefined]
**icon** | **string** | Achievement icon identifier | [default to undefined]
**category** | [**AchievementCategory**](AchievementCategory.md) | Achievement category | [default to undefined]
**condition_type** | [**ConditionType**](ConditionType.md) | Type of condition to unlock | [default to undefined]
**condition_value** | **number** | Value needed to unlock | [default to undefined]
**points_reward** | **number** | Points awarded when unlocked | [default to undefined]
**is_hidden** | **boolean** | Whether achievement is hidden until unlocked | [optional] [default to false]
**created_at** | **string** | Creation timestamp | [optional] [default to undefined]
**id** | **string** |  | [optional] [default to undefined]
**is_unlocked** | **boolean** | Whether user has unlocked this achievement | [default to undefined]
**progress** | **number** | Progress towards unlocking (0-100%) | [default to undefined]
**unlocked_at** | **string** |  | [optional] [default to undefined]

## Example

```typescript
import { AchievementWithProgress } from './api';

const instance: AchievementWithProgress = {
    name,
    description,
    icon,
    category,
    condition_type,
    condition_value,
    points_reward,
    is_hidden,
    created_at,
    id,
    is_unlocked,
    progress,
    unlocked_at,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
