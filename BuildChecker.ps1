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

# getting branches info
$requestResult = Invoke-WebRequest -Uri "https://api.appcenter.ms/v0.1/apps/$ownerName/$appName/branches" -Method "GET" -Headers @{"Accept"="application/json"; "X-API-Token"=$token}
$branches = $requestResult.Content | ConvertFrom-Json

# echo state of branches
$i = 0
foreach ($branch in $branches)
{
    #getting duration for build
    $durationTimespan = (Get-Date -Date $branch.lastbuild.finishTime) - (Get-Date -Date $branch.lastbuild.startTime)
    $duration = [math]::Round($durationTimespan.TotalSeconds)
    
    #getting data about build logs
    $buildId = $branch.lastbuild.id
    $requestResult = Invoke-WebRequest -Uri "https://api.appcenter.ms/v0.1/apps/$ownerName/$appName/builds/$buildId/downloads/logs" -Method "GET" -Headers @{"Accept"="application/json"; "X-API-Token"=$token}
    $buildUri = $requestResult.Content | ConvertFrom-Json
    
    $i++

    #echo build data
    Write-Host $i "-" $branch.branch.name "build" $branch.lastbuild.status "in $duration seconds. Link to build logs:" $buildUri.uri
}
