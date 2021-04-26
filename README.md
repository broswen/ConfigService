A remote configuration provider service with API Gateway, Lambda, and S3.

Call an endpoint with `endpoint/stage/systemname` to get the json configuration for that system and stage.

Protected with API Keys and throttling.



1. Define configuration with YAML and save as systemname/config.stage.yml in the S3 Bucket.

```yaml
name: SystemA-dev
version: 1.0.0
items:
  - item1
  - item2
  - item3
  - item4
info:
  info1: test
  info2: anothertest
```

2. Call the endpoint with `endpoint/stage/systemname` and receive the config as JSON.

```json
{
    "name": "SystemA-dev",
    "version": "1.0.0",
    "items": [
        "item1",
        "item2",
        "item3",
        "item4"
    ],
    "info": {
        "info1": "test",
        "info2": "anothertest"
    }
}
```



