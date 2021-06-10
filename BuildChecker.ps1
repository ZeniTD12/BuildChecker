$ownerName = "" # enter name of app owner
$appName = "" # enter name of app
$token = "" # enter app token

Invoke-WebRequest -Uri "https://api.appcenter.ms/v0.1/apps/$ownerName/$appName/branches" -Method "GET" -Headers @{"Accept"="application/json"; "X-API-Token"=$token}
