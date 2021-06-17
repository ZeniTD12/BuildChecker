param
(
    # Requested operation
    [Parameter(Mandatory = $true)]
    [ValidateSet('GetStatus','NewBuild')]
    [System.String]
    $reqOperation,
    
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

switch ($reqOperation)
{
    "GetStatus" {
        # getting branches info
        $requestResult = Invoke-WebRequest -Uri "https://api.appcenter.ms/v0.1/apps/$ownerName/$appName/branches" -Method "GET" -Headers @{"Accept"="application/json"; "X-API-Token"=$token}
        if ($requestResult -ne $null)
        {
            $branches = $requestResult.Content | ConvertFrom-Json
        } else {
            Write-Host "Data hasn't been received from App Center"
            break
        }

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
            if ($requestResult -ne $null)
            {
                $buildUri = $requestResult.Content | ConvertFrom-Json
            } else {
                Write-Host "Data hasn't been received from App Center for branch" $branch.branch.name
            }
                    
            $i++
        
            #echo build data
            Write-Host $i "-" $branch.branch.name "build" $branch.lastbuild.status "in $duration seconds. Link to build logs:" $buildUri.uri
        }
    }
    "NewBuild" {
        # getting branches info
        $requestResult = Invoke-WebRequest -Uri "https://api.appcenter.ms/v0.1/apps/$ownerName/$appName/branches" -Method "GET" -Headers @{"Accept"="application/json"; "X-API-Token"=$token}
        if ($requestResult -ne $null)
        {
            $branches = $requestResult.Content | ConvertFrom-Json
        } else {
            Write-Host "Data hasn't been received from App Center"
        }

        # selecting branch for build
        Write-Host "Select branch to start new build."

        $i = 1
        foreach ($branch in $branches)
        {
            Write-Host $i "-" $branch.branch.name
            $i++
        }

        $branchNum = Read-Host "Enter number of required branch"

        $branchForBuild = $branches[$branchNum - 1].branch.name
        
        #starting build
        $requestResult = Invoke-WebRequest -Uri "https://api.appcenter.ms/v0.1/apps/$ownerName/$appName/branches/$branchForBuild/builds" -Method "POST" -Headers @{"Accept"="application/json"; "X-API-Token"=$token}

        if (($requestResult.Content | ConvertFrom-Json).id -ne $null)
        {
            Write-Host "New build in branch" $branchForBuild "has been started - Link"
        } else {
            Write-Host "Build in branch" $branchForBuild "has not been started. Please check script output to identify reason of this"
        }
    }
    default {
        Write-Host "Unexpected operation was requested.`nUse 'GetStatus' to receive status of latest builds.`nUse 'NewBuild' to start new build."
    }
}


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
