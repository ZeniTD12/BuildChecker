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
    console.log("List of actual branches:")
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
        console.log("Error with receiving list of branches has been occurred. Check message below for details.");
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
                    console.log("--------------------------------------------------");
                    console.log("Build in branch " + branch + " has been successfully started");
                    console.log("Build number is " + responce.data.buildNumber);
                    console.log("Builds URL - https://appcenter.ms/users/" + ownerName + "/apps/" + appName + "/build/branches/" + branchWithoutSlash);
                    console.log("--------------------------------------------------");
                })
                .catch(function (error) {
                    console.log("--------------------------------------------------");
                    console.log("Build in branch " + branch + " hasn't been started. Check message below for details.");
                    console.log(error.toJSON().stack);
                    console.log("--------------------------------------------------");
                });
            };
            startBuildinBranch(ownerName, appName, token, branch, branchWithoutSlash);
        });
    })
    .catch(function (error) {
        console.log("Error with receiving list of branches has been occurred. Check message below for details.");
        console.log(error.toJSON().stack);
    });
};

// startBuilds(ownerName, appName, token);

async function getBuilds(ownerName:string, appName:string, token:string) {
    let urlBranches = "https://api.appcenter.ms/v0.1/apps/" + ownerName + "/" + appName + "/branches";
    let index = 0;
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
            async function getLogsLink(ownerName:string, appName:string, token:string) {
                let urlBuildLogs = "https://api.appcenter.ms/v0.1/apps/" + ownerName + "/" + appName + "/builds/" + branchData.lastBuild.id + "/downloads/logs";
                await axios({
                    method: 'get',
                    url: urlBuildLogs,
                    headers: {
                        'Content-Type': 'application/json',
                        'X-API-Token': token
                    }
                })
                .then(function (responce) {
                    // console.log(responce.data.uri);
                    let startTime = null;
                    let queuedTime = null;
                    let finishTime = null;
                    let durationSec = null;
                    index = index + 1;
                    switch (branchData.lastBuild.status) {
                        case "inProgress":
                            startTime = new Date(branchData.lastBuild.startTime);
                            durationSec = Math.floor((Date.now() - startTime.getTime())/1000);
                            console.log("--------------------------------------------------");
                            console.log(index + " - Branch " + branchData.branch.name + " - latest build is in status " + branchData.lastBuild.status + " for " + durationSec + " seconds. Links to build logs: " + responce.data.uri + ".");
                            console.log("--------------------------------------------------");
                            break;
                        case "notStarted":
                            queuedTime = new Date(branchData.lastBuild.queueTime);
                            durationSec = Math.floor((Date.now() - queuedTime.getTime())/1000);
                            console.log("--------------------------------------------------");
                            console.log(index + " - Branch " + branchData.branch.name + " - latest build is queued (status - " + branchData.lastBuild.status + ") for " + durationSec + " seconds. Links to build logs will be available after start of the build.");
                            console.log("--------------------------------------------------");
                            break;
                        default:
                            //console.log("Status - " + branchData.lastBuild.status);
                            //console.log(responce.data.uri);
                            startTime = new Date(branchData.lastBuild.startTime);
                            finishTime = new Date(branchData.lastBuild.finishTime);
                            durationSec = Math.floor((finishTime.getTime() - startTime.getTime())/1000);
                            console.log("--------------------------------------------------");
                            console.log(index + " - Branch " + branchData.branch.name + " - latest build was " + branchData.lastBuild.status + " in " + durationSec + " seconds. Links to build logs: " + responce.data.uri + ".");
                            console.log("--------------------------------------------------");
                            break;
                    }
                })
                .catch(function (error) {
                    if (branchData.lastBuild.status != "notStarted") {
                        console.log("--------------------------------------------------");
                        console.log("Link to download logs of build " + branchData.lastBuild.id + " in branch " + branchData.branch.name + " hasn't been received. Check message below for details.");
                        console.log(error.toJSON().stack);
                        console.log("--------------------------------------------------");
                    }
                });
            }
            getLogsLink(ownerName, appName, token);
        });
    })
    .catch(function (error) {
        console.log("Error with receiving list of branches has been occurred. Check message below for details.");
        console.log(error.toJSON().stack);
    });
};

// getBuilds(ownerName, appName, token);