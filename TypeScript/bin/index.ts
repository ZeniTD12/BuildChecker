#!/usr/bin/env node

import axios from "axios";
import * as readline from 'readline';

const ownerName = "" // enter name of app's owner
const appName = ""   // enter name of app
const token = ""     // enter token

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

let rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

rl.question('Enter number of required operation:\n1 - Get list of branches\n2 - Start new builds in branches\n3 - Get status of latest builds in branches\nother - Exit\n', (answer) => {
    switch(answer.toLowerCase()) {
        case '1':
            console.log("Receiving list of branches ...");
            getBranches(ownerName, appName, token);
            break;
        case '2':
            console.log("Starting builds ...");
            startBuilds(ownerName, appName, token);
            break;
        case '3':
            console.log("Receiving state of builds ...");
            getBuilds(ownerName, appName, token);
            break;
        default:
            console.log('Exiting ...');
    }
    rl.close();
});
