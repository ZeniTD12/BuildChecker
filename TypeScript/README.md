# BuildChecker - TypeScript

The tool has 2 features:
- returns list of branches in App and status of latest builds in the branches;
- starts build in specified branch.

## Usage

Provide credentials and build the tool to use this.
App asks user about required operation after start. Available operations:
- Get list of branches;
- Start new builds in branches;
- Get status of latest builds in branches.

### Enter credentials

Specify owner name, app name and token in \bin\index.ts.

### Build

```powershell
tsc .\bin\index.ts
```

### Run

```powershell
node .\bin\index.js
```
