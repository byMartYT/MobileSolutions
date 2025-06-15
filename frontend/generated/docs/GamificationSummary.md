# GamificationSummary

Summary of user\'s gamification status.

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**stats** | [**UserStatsResponse**](UserStatsResponse.md) |  | [default to undefined]
**recent_achievements** | [**Array&lt;UserAchievement&gt;**](UserAchievement.md) | Recently unlocked achievements | [default to undefined]
**next_achievements** | [**Array&lt;AchievementWithProgress&gt;**](AchievementWithProgress.md) | Achievements close to unlocking | [default to undefined]
**recent_points** | [**Array&lt;PointsEntry&gt;**](PointsEntry.md) | Recent points activity | [default to undefined]

## Example

```typescript
import { GamificationSummary } from './api';

const instance: GamificationSummary = {
    stats,
    recent_achievements,
    next_achievements,
    recent_points,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
