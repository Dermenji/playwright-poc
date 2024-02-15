# Playwright POC


## Run tests for UI

```
npx playwright test --project=core --grep=@UI
npx playwright test --project=core --grep=@UI --headed
PREFIX=staging LOC=en APIKEY_UI={test} APISECRET_UI={test} npx playwright test --project=core --grep=@UI --headed
```

Pass env variables
PREFIX=staging or beta
LOC=en or de

## Run APIv2 test

```
npx playwright test --project=api --grep=@API

APIKEY={test} APISECRET={test} npx playwright test --project=api --grep=@API
```

## Show report

```
 npx playwright show-report
```