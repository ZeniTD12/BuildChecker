# BuildChecker

The tool has 2 features:
- returns list of branches in App and status of latest builds in the branches;
- starts build in specified branch.

## Syntax

```powershell
.\BuildChecker.ps1
  -reqOperation <String>
  -ownerName <String>
  -appName <String>
  -token <String>
```
## Parameters:

**-reqOperation**

Action which should be performed by tool:
- **GetStatus** returns list of branches in App and status of latest builds in the branches;
- **NewBuild** starts build in specified branch.

**-ownerName**

Owner name of App. It can be received from link to App, like https://appcenter.ms/users/{ownerName}/apps/{appName}/.

**-appName**

Name of App. It can be received from link to App, like https://appcenter.ms/users/{ownerName}/apps/{appName}/.

**-token**

App API token. It can be created in App on page https://appcenter.ms/users/{ownerName}/apps/{appName}/settings/apitokens.
