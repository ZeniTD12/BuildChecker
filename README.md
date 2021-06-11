# BuildChecker

Returns list of branches in App and status of latest builds in the branches

## Syntax

```powershell
.\BuildChecker.ps1
  -ownerName <String>
  -appName <String>
  -token <String>
```
## Parameters:

**-ownerName**

Owner name of App. It can be received from link to App, like https://appcenter.ms/users/{ownerName}/apps/{appName}/

**-appName**

Name of App. It can be received from link to App, like https://appcenter.ms/users/{ownerName}/apps/{appName}/

**-token**

App API token. It can be created in App on page https://appcenter.ms/users/{ownerName}/apps/{appName}/settings/apitokens
