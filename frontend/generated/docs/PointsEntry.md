# PointsEntry

Points transaction history model.

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**user_id** | **string** | User ID | [default to undefined]
**points** | **number** | Points awarded (positive) or deducted (negative) | [default to undefined]
**reason** | [**PointsReason**](PointsReason.md) | Reason for points change | [default to undefined]
**reference_id** | **string** |  | [optional] [default to undefined]
**metadata** | **{ [key: string]: any; }** |  | [optional] [default to undefined]
**created_at** | **string** | Creation timestamp | [optional] [default to undefined]
**id** | **string** |  | [optional] [default to undefined]

## Example

```typescript
import { PointsEntry } from './api';

const instance: PointsEntry = {
    user_id,
    points,
    reason,
    reference_id,
    metadata,
    created_at,
    id,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
