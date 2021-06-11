param
(
    # Name of app owner
    [Parameter(Mandatory = $true)]
    [ValidateNotNullOrEmpty()]
    [System.String]
    $ownerName,

    # Name of app
    [Parameter(Mandatory = $true)]
    [ValidateNotNullOrEmpty()]
    [System.String]
    $appName,

    # App token
    [Parameter(Mandatory = $true)]
    [ValidateNotNullOrEmpty()]
    [System.String]
    $token
)

Invoke-WebRequest -Uri "https://api.appcenter.ms/v0.1/apps/$ownerName/$appName/branches" -Method "GET" -Headers @{"Accept"="application/json"; "X-API-Token"=$token}
