# LevelConfig

Level configuration model.

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**level** | **number** | Level number | [default to undefined]
**points_required** | **number** | Total points required to reach this level | [default to undefined]
**title** | **string** | Level title/name | [default to undefined]
**rewards** | **Array&lt;string&gt;** | Rewards unlocked at this level | [optional] [default to undefined]
**color** | **string** | Level color theme | [optional] [default to '#4CAF50']
**id** | **string** |  | [optional] [default to undefined]

## Example

```typescript
import { LevelConfig } from './api';

const instance: LevelConfig = {
    level,
    points_required,
    title,
    rewards,
    color,
    id,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
