#!/usr/bin/env node
"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
var axios_1 = require("axios");
//console.log( "Hello!" );
var ownerName = "ZeniTD12";
var appName = "My-New-Test-App";
var token = "035be1cc469a116723cc20d78ba57a894cec1640";
//https://gist.github.com/sgrebnov/6fae277243e96d2c27aaaf93362eae0f
//https://openapi.appcenter.ms/#/build/builds_listToolsets
//https://github.com/ZeniTD12/My-New-Test-App
//https://appcenter.ms/users/ZeniTD12/apps/My-New-Test-App/build/branches
//https://github.com/ZeniTD12/BuildChecker/blob/main/BuildChecker.ps1
//---
//async function getBranches(ownerName:string, appName:string, token:string) {
//    let urlBranches = "https://api.appcenter.ms/v0.1/apps/" + ownerName + "/" + appName + "/branches";
//    let res = await axios({
//            method: 'get',
//            url: urlBranches,
//            headers: {
//                'Content-Type': 'application/json',
//                'X-API-Token': token
//            }
//    });
//
//    res.data.forEach((branchData:any) => {
//        console.log(branchData.branch.name);
//    });
//};
//---
//getBranches(ownerName, appName, token);
//async function startBuilds(ownerName:string, appName:string, token:string) {
//    let urlBranches = "https://api.appcenter.ms/v0.1/apps/" + ownerName + "/" + appName + "/branches";
//    let res = await axios({
//            method: 'get',
//            url: urlBranches,
//            headers: {
//                'Content-Type': 'application/json',
//                'X-API-Token': token
//            }
//    });
//
//    res.data.forEach((branchData:any) => {
//        console.log(branchData.branch.name);
//    });
//}
function getBranches(ownerName, appName, token) {
    return __awaiter(this, void 0, void 0, function () {
        var urlBranches;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    urlBranches = "https://api.appcenter.ms/v0.1/apps/" + ownerName + "/" + appName + "/branches";
                    return [4 /*yield*/, (0, axios_1["default"])({
                            method: 'get',
                            url: urlBranches,
                            headers: {
                                'Content-Type': 'application/json',
                                'X-API-Token': token
                            }
                        })
                            .then(function (responce) {
                            responce.data.forEach(function (branchData) {
                                console.log(branchData.branch.name);
                            });
                        })["catch"](function (error) {
                            console.log(error.toJSON().stack);
                        })];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
;
//getBranches(ownerName, appName, token);
function startBuilds(ownerName, appName, token) {
    return __awaiter(this, void 0, void 0, function () {
        var urlBranches;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    urlBranches = "https://api.appcenter.ms/v0.1/apps/" + ownerName + "/" + appName + "/branches";
                    return [4 /*yield*/, (0, axios_1["default"])({
                            method: 'get',
                            url: urlBranches,
                            headers: {
                                'Content-Type': 'application/json',
                                'X-API-Token': token
                            }
                        })
                            .then(function (responce) {
                            return __awaiter(this, void 0, void 0, function () {
                                return __generator(this, function (_a) {
                                    responce.data.forEach(function (branchData) {
                                        //console.log("Builds will be started here");
                                        var branch = branchData.branch.name;
                                        var branchWithoutSlash = branch.replace(/\//gi, "%2F");
                                        //console.log(branch);
                                        function startBuildinBranch(ownerName, appName, token, branch, branchWithoutSlash) {
                                            return __awaiter(this, void 0, void 0, function () {
                                                var urlBuildBranch;
                                                return __generator(this, function (_a) {
                                                    switch (_a.label) {
                                                        case 0:
                                                            urlBuildBranch = "https://api.appcenter.ms/v0.1/apps/" + ownerName + "/" + appName + "/branches/" + branchWithoutSlash + "/builds";
                                                            return [4 /*yield*/, (0, axios_1["default"])({
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
                                                                    //console.log(responce);
                                                                    console.log("Build number is " + responce.data.buildNumber);
                                                                    console.log("Builds URL - https://appcenter.ms/users/" + ownerName + "/apps/" + appName + "/build/branches/" + branch);
                                                                    console.log("--------------------------------------------------");
                                                                })["catch"](function (error) {
                                                                    console.log("--------------------------------------------------");
                                                                    console.log("Build in branch " + branch + " hasn't been started. Check message below for details.");
                                                                    console.log(error.toJSON().stack);
                                                                    console.log("--------------------------------------------------");
                                                                })];
                                                        case 1:
                                                            _a.sent();
                                                            return [2 /*return*/];
                                                    }
                                                });
                                            });
                                        }
                                        ;
                                        startBuildinBranch(ownerName, appName, token, branch, branchWithoutSlash);
                                    });
                                    return [2 /*return*/];
                                });
                            });
                        })["catch"](function (error) {
                            console.log(error.toJSON().stack);
                        })];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
;
startBuilds(ownerName, appName, token);
