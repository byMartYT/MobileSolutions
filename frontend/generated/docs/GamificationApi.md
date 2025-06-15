# GamificationApi

All URIs are relative to *http://localhost*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**addPointsApiV1GamificationPointsUserIdAddPost**](#addpointsapiv1gamificationpointsuseridaddpost) | **POST** /api/v1/gamification/points/{user_id}/add | Add Points|
|[**getGamificationSummaryApiV1GamificationSummaryUserIdGet**](#getgamificationsummaryapiv1gamificationsummaryuseridget) | **GET** /api/v1/gamification/summary/{user_id} | Get Gamification Summary|
|[**getLevelsApiV1GamificationLevelsGet**](#getlevelsapiv1gamificationlevelsget) | **GET** /api/v1/gamification/levels | Get Levels|
|[**getUserAchievementsApiV1GamificationAchievementsUserIdGet**](#getuserachievementsapiv1gamificationachievementsuseridget) | **GET** /api/v1/gamification/achievements/{user_id} | Get User Achievements|
|[**getUserStatsApiV1GamificationStatsUserIdGet**](#getuserstatsapiv1gamificationstatsuseridget) | **GET** /api/v1/gamification/stats/{user_id} | Get User Stats|
|[**markAchievementSeenApiV1GamificationAchievementsUserIdAchievementIdMarkSeenPost**](#markachievementseenapiv1gamificationachievementsuseridachievementidmarkseenpost) | **POST** /api/v1/gamification/achievements/{user_id}/{achievement_id}/mark-seen | Mark Achievement Seen|
|[**updateUserStatsApiV1GamificationStatsUserIdUpdatePost**](#updateuserstatsapiv1gamificationstatsuseridupdatepost) | **POST** /api/v1/gamification/stats/{user_id}/update | Update User Stats|

# **addPointsApiV1GamificationPointsUserIdAddPost**
> any addPointsApiV1GamificationPointsUserIdAddPost()

Add points to user and record in history.

### Example

```typescript
import {
    GamificationApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new GamificationApi(configuration);

let userId: string; // (default to undefined)
let points: number; // (default to undefined)
let reason: PointsReason; // (default to undefined)
let referenceId: string; // (optional) (default to undefined)

const { status, data } = await apiInstance.addPointsApiV1GamificationPointsUserIdAddPost(
    userId,
    points,
    reason,
    referenceId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **userId** | [**string**] |  | defaults to undefined|
| **points** | [**number**] |  | defaults to undefined|
| **reason** | **PointsReason** |  | defaults to undefined|
| **referenceId** | [**string**] |  | (optional) defaults to undefined|


### Return type

**any**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Successful Response |  -  |
|**422** | Validation Error |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **getGamificationSummaryApiV1GamificationSummaryUserIdGet**
> GamificationSummary getGamificationSummaryApiV1GamificationSummaryUserIdGet()

Get comprehensive gamification summary for user.

### Example

```typescript
import {
    GamificationApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new GamificationApi(configuration);

let userId: string; // (default to undefined)

const { status, data } = await apiInstance.getGamificationSummaryApiV1GamificationSummaryUserIdGet(
    userId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **userId** | [**string**] |  | defaults to undefined|


### Return type

**GamificationSummary**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Successful Response |  -  |
|**422** | Validation Error |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **getLevelsApiV1GamificationLevelsGet**
> Array<LevelConfig> getLevelsApiV1GamificationLevelsGet()

Get all level configurations.

### Example

```typescript
import {
    GamificationApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new GamificationApi(configuration);

const { status, data } = await apiInstance.getLevelsApiV1GamificationLevelsGet();
```

### Parameters
This endpoint does not have any parameters.


### Return type

**Array<LevelConfig>**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Successful Response |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **getUserAchievementsApiV1GamificationAchievementsUserIdGet**
> any getUserAchievementsApiV1GamificationAchievementsUserIdGet()

Get user\'s achievements with progress.

### Example

```typescript
import {
    GamificationApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new GamificationApi(configuration);

let userId: string; // (default to undefined)

const { status, data } = await apiInstance.getUserAchievementsApiV1GamificationAchievementsUserIdGet(
    userId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **userId** | [**string**] |  | defaults to undefined|


### Return type

**any**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Successful Response |  -  |
|**422** | Validation Error |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **getUserStatsApiV1GamificationStatsUserIdGet**
> UserStatsResponse getUserStatsApiV1GamificationStatsUserIdGet()

Get user\'s gamification statistics.

### Example

```typescript
import {
    GamificationApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new GamificationApi(configuration);

let userId: string; // (default to undefined)

const { status, data } = await apiInstance.getUserStatsApiV1GamificationStatsUserIdGet(
    userId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **userId** | [**string**] |  | defaults to undefined|


### Return type

**UserStatsResponse**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Successful Response |  -  |
|**422** | Validation Error |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **markAchievementSeenApiV1GamificationAchievementsUserIdAchievementIdMarkSeenPost**
> any markAchievementSeenApiV1GamificationAchievementsUserIdAchievementIdMarkSeenPost()

Mark an achievement as seen by the user.

### Example

```typescript
import {
    GamificationApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new GamificationApi(configuration);

let userId: string; // (default to undefined)
let achievementId: string; // (default to undefined)

const { status, data } = await apiInstance.markAchievementSeenApiV1GamificationAchievementsUserIdAchievementIdMarkSeenPost(
    userId,
    achievementId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **userId** | [**string**] |  | defaults to undefined|
| **achievementId** | [**string**] |  | defaults to undefined|


### Return type

**any**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Successful Response |  -  |
|**422** | Validation Error |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **updateUserStatsApiV1GamificationStatsUserIdUpdatePost**
> any updateUserStatsApiV1GamificationStatsUserIdUpdatePost(userStatsUpdate)

Update user statistics.

### Example

```typescript
import {
    GamificationApi,
    Configuration,
    UserStatsUpdate
} from './api';

const configuration = new Configuration();
const apiInstance = new GamificationApi(configuration);

let userId: string; // (default to undefined)
let userStatsUpdate: UserStatsUpdate; //

const { status, data } = await apiInstance.updateUserStatsApiV1GamificationStatsUserIdUpdatePost(
    userId,
    userStatsUpdate
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **userStatsUpdate** | **UserStatsUpdate**|  | |
| **userId** | [**string**] |  | defaults to undefined|


### Return type

**any**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Successful Response |  -  |
|**422** | Validation Error |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

