#!/usr/bin/env node

import axios from "axios";

//console.log( "Hello!" );
const ownerName = "ZeniTD12"
const appName = "My-New-Test-App"
const token = "035be1cc469a116723cc20d78ba57a894cec1640"

//https://gist.github.com/sgrebnov/6fae277243e96d2c27aaaf93362eae0f
//https://openapi.appcenter.ms/#/build/builds_listToolsets
//https://github.com/ZeniTD12/My-New-Test-App
//https://appcenter.ms/users/ZeniTD12/apps/My-New-Test-App/build/branches
//https://github.com/ZeniTD12/BuildChecker/blob/main/BuildChecker.ps1

async function getBranches(ownerName:string, appName:string, token:string) {
    let urlBranches = "https://api.appcenter.ms/v0.1/apps/" + ownerName + "/" + appName + "/branches";
    await axios({
            method: 'get',
            url: urlBranches,
            headers: {
                'Content-Type': 'application/json',
                'X-API-Token': token
            }
        })
    .then(function (responce) {
        responce.data.forEach((branchData:any) => {
            console.log(branchData.branch.name);
        });
    })
    .catch(function (error) {
        console.log(error.toJSON().stack);
    });
};

// getBranches(ownerName, appName, token);

async function startBuilds(ownerName:string, appName:string, token:string) {
    let urlBranches = "https://api.appcenter.ms/v0.1/apps/" + ownerName + "/" + appName + "/branches";
    await axios({
            method: 'get',
            url: urlBranches,
            headers: {
                'Content-Type': 'application/json',
                'X-API-Token': token
            }
        })
    .then(async function (responce) {
        responce.data.forEach((branchData:any) => {
            let branch = branchData.branch.name;
            let branchWithoutSlash = branch.replace(/\//gi, "%2F");
            async function startBuildinBranch(ownerName:string, appName:string, token:string, branch:string, branchWithoutSlash:string) {
                let urlBuildBranch = "https://api.appcenter.ms/v0.1/apps/" + ownerName + "/" + appName + "/branches/" + branchWithoutSlash + "/builds";
                await axios({
                    method: 'post',
                    url: urlBuildBranch,
                    headers: {
                        'Content-Type': 'application/json',
                        'X-API-Token': token
                    }
                })
                .then(function (responce) {
                    console.log("--------------------------------------------------")
                    console.log("Build in branch " + branch + " has been successfully started");
                    console.log("Build number is " + responce.data.buildNumber);
                    console.log("Builds URL - https://appcenter.ms/users/" + ownerName + "/apps/" + appName + "/build/branches/" + branchWithoutSlash);
                    console.log("--------------------------------------------------")
                })
                .catch(function (error) {
                    console.log("--------------------------------------------------")
                    console.log("Build in branch " + branch + " hasn't been started. Check message below for details.");
                    console.log(error.toJSON().stack);
                    console.log("--------------------------------------------------")
                });
            };
            startBuildinBranch(ownerName, appName, token, branch, branchWithoutSlash);
        });
    })
    .catch(function (error) {
        console.log(error.toJSON().stack);
    });
};

// startBuilds(ownerName, appName, token);

async function getBuilds(ownerName:string, appName:string, token:string) {
    let urlBranches = "https://api.appcenter.ms/v0.1/apps/" + ownerName + "/" + appName + "/branches";
    await axios({
            method: 'get',
            url: urlBranches,
            headers: {
                'Content-Type': 'application/json',
                'X-API-Token': token
            }
        })
    .then(function (responce) {
        responce.data.forEach((branchData:any) => {
            console.log(branchData.branch.name);
        });
    })
    .catch(function (error) {
        console.log(error.toJSON().stack);
    });
};

// getBranches(ownerName, appName, token);