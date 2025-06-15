# UserStatsResponse

User stats with calculated fields.

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**user_id** | **string** | User ID | [default to undefined]
**total_points** | **number** | Total accumulated points | [optional] [default to 0]
**current_level** | **number** | Current user level | [optional] [default to 1]
**current_level_progress** | **number** | Progress to next level (0-100%) | [optional] [default to 0.0]
**streak_count** | **number** | Current consecutive days streak | [optional] [default to 0]
**longest_streak** | **number** | Longest streak ever achieved | [optional] [default to 0]
**last_active_date** | **string** | Last activity date | [optional] [default to undefined]
**total_skills_completed** | **number** | Total skills completed | [optional] [default to 0]
**total_todos_completed** | **number** | Total todos completed | [optional] [default to 0]
**created_at** | **string** | Creation timestamp | [optional] [default to undefined]
**updated_at** | **string** | Last update timestamp | [optional] [default to undefined]
**id** | **string** |  | [optional] [default to undefined]
**points_to_next_level** | **number** | Points needed for next level | [default to undefined]
**next_level_title** | **string** | Next level title | [default to undefined]

## Example

```typescript
import { UserStatsResponse } from './api';

const instance: UserStatsResponse = {
    user_id,
    total_points,
    current_level,
    current_level_progress,
    streak_count,
    longest_streak,
    last_active_date,
    total_skills_completed,
    total_todos_completed,
    created_at,
    updated_at,
    id,
    points_to_next_level,
    next_level_title,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
