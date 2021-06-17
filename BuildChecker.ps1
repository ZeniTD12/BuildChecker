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
            $i++
            
            #getting data about build logs
            $buildId = $branch.lastbuild.id
            $requestResult = Invoke-WebRequest -Uri "https://api.appcenter.ms/v0.1/apps/$ownerName/$appName/builds/$buildId/downloads/logs" -Method "GET" -Headers @{"Accept"="application/json"; "X-API-Token"=$token}
            if ($requestResult -ne $null)
            {
                $buildUri = $requestResult.Content | ConvertFrom-Json
            } else {
                Write-Host "Info about logs hasn't been received from App Center for branch" $branch.branch.name
            }
                  
            # check build state, calculate duration and echo build data
            switch ($branch.lastbuild.status)
            {
                "inProgress" {
                    $durationTimespan = (Get-Date) - (Get-Date -Date $branch.lastbuild.startTime)
                    $duration = [math]::Round($durationTimespan.TotalSeconds)
                    Write-Host "--------------------------------------------------"
                    Write-Host $i "-" $branch.branch.name "build is in status" $branch.lastbuild.status "for" $duration "seconds. Link to build logs:" $buildUri.uri
                    Write-Host "--------------------------------------------------"
                }
                "notStarted" {
                    Write-Host "--------------------------------------------------"
                    Write-Host $i "-" $branch.branch.name "build is queued ( status -" $branch.lastbuild.status" ) since" (Get-Date -Date $branch.lastbuild.queueTime)
                    Write-Host "--------------------------------------------------"
                }
                default {
                    $durationTimespan = (Get-Date -Date $branch.lastbuild.finishTime) - (Get-Date -Date $branch.lastbuild.startTime)
                    $duration = [math]::Round($durationTimespan.TotalSeconds)
                    Write-Host "--------------------------------------------------"
                    Write-Host $i "-" $branch.branch.name "build" $branch.lastbuild.status "in" $duration "seconds. Link to build logs:" $buildUri.uri
                    Write-Host "--------------------------------------------------"
                }
            }
            
            # pause output after each 10 builds
            if (([math]::IEEERemainder($i,10) -eq 0) -and ($i -lt $branches.Count))
            {
                Write-Host "Total number of branches is" $branches.Count ". Press any key to see next builds ..."
                $null = $Host.UI.RawUI.ReadKey('NoEcho,IncludeKeyDown')
            }
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
        $branchForBuildURL = $branchForBuild -replace "/", "%2F"
        
        #starting build
        $requestResult = Invoke-WebRequest -Uri "https://api.appcenter.ms/v0.1/apps/$ownerName/$appName/branches/$branchForBuildURL/builds" -Method "POST" -Headers @{"Accept"="application/json"; "X-API-Token"=$token}

        if (($requestResult.Content | ConvertFrom-Json).id -ne $null)
        {
            $queueTime = Get-Date -Date ($requestResult.Content | ConvertFrom-Json).queueTime
            Write-Host "New build in branch" $branchForBuild "has been started at" $queueTime
        } else {
            Write-Host "Build in branch" $branchForBuild "has not been started. Please check script output to identify reason of this"
        }
    }
    default {
        Write-Host "Unexpected operation was requested.`nUse 'GetStatus' to receive status of latest builds.`nUse 'NewBuild' to start new build."
    }
}
