//项目相关的各种服务
define(["templateModule"], function(eftemplateApp) {
	'use strict';

	eftemplateApp.factory('programsProfileService', ['mtsapis', 'serverHostProfileService', 'rxResource', '$log', '$q', 
 	    function(mtsapis, serverHostProfileService, rxResource, $log, $q) {
 		return {
 			qrCodeCreate: function(param, callback) {
 				rxResource.post(mtsapis.qrCodeCreate.api, null, param, callback);
 			},
 			qryAuditLog: function(param, callback) {
 				rxResource.post(mtsapis.qryAuditLog.api, null, param, callback);
 			},
 			/*qrySites: function(param, callback) {
 				serverHostProfileService.qrySites(param, callback);
 			},*/
 			/*qryPrograms: function(param, callback) {
 				serverHostProfileService.qryPrograms(param, callback);
 			},*/
 			doSave : function(param, callback){
 				rxResource.post(mtsapis.editProgram.api, null, param, callback);
 			},
 			doRemove: function(param, callback) {
 				rxResource.post(mtsapis.removeProgram.api, null, param, callback);
 			},
 			validateFolder: function(folderName) {
 				folderName = folderName.trim();
 				if(/[^0-9a-zA-Z]/.test(folderName)) {
 					return {type: 'danger', msg: '项目目录名称错误'};
 				}
 				if(/[0-9a-zA-Z]{21,}/.test(folderName)) {
 					return {type: 'danger', msg: '项目目录名称过长'};
 				}
 				return null;
 			},
 			validate: function(param) {
 				var prompObj = null;
 				/*if(!param.site_id) {
 					//alert("验证码输入错误或者刷新验证码失败,请清新获得验证码并输入。");
 					prompObj = {type: 'danger', msg: '站点不可为空'};
 				} else */
 				if(!param.project_name) {
 					//alert("验证码输入错误或者刷新验证码失败,请清新获得验证码并输入。");
 					prompObj = {type: 'danger', msg: '项目不可为空'};
 				} else if(param.project_name.length > 20) {
 					//alert("验证码输入错误或者刷新验证码失败,请清新获得验证码并输入。");
 					prompObj = {type: 'danger', msg: '项目名称最大长度为20个中英文字母'};
 				} else if(!param.project_path_name) {
 					//alert("验证码输入错误或者刷新验证码失败,请清新获得验证码并输入。");
 					prompObj = {type: 'danger', msg: '项目录名称不可为空'};
 				}
 				return prompObj;
 			}
 		}
 	}]);



	eftemplateApp.factory('versionsProfileService', ['mtsapis', 'mtsMethodNames', 'serverHostProfileService', 'rxResource', '$log', '$q', 
	    function(mtsapis, mtsMethodNames, serverHostProfileService, rxResource, $log, $q) {
		return {
			qrySites: function(param, callback) {
				serverHostProfileService.qrySites(param, callback);
			},
			qryPrograms: function(param, callback) {
				serverHostProfileService.qryPrograms(param, callback);
			},
			qryProgramsVersion: function(param, callback) {
				rxResource.query(mtsapis.qryProgramsVersion.api, param, callback);
			},
			haltRunning: function(param, callback) {
				console.log('haltRunning');//rxResource.post(mtsapis.createProgram.api, null, param, callback);
			}
		}
	}]);


	//代码上传需要的服务
	eftemplateApp.factory('codeProfileService', ['mtsapis', 'mtsMethodNames', 'h5plusAPINameHandler', 'serverHostProfileService', 'rxResource', '$log', '$q', 
	    function(mtsapis, mtsMethodNames, h5plusAPINameHandler, serverHostProfileService, rxResource, $log, $q) {
		return {
			cancelUpload: function(param, callback) {
				rxResource.post(mtsapis.cancelUpload.api, null, param, function(result) {
					result = h5plusAPINameHandler.convert(mtsMethodNames.qryPrograms.methodName, result);
					callback(result);
				});
			},
			ftpCodeAudit: function(param, callback) {
				rxResource.post(mtsapis.ftpCodeAudit.api, null, param, callback);
			},
			validateCommit: function(param) {
				var prompt = null;
				if(!param.apply_reason) {
					prompt = {type: 'danger', msg: '申请原因上线说明不可为空, 请输入上线内容说明!'};
				} else if(param.apply_reason.length < 15) {
					prompt = {type: 'danger', msg: '内容过于简介, 请输入最少15个汉字的介绍说明!'};
				} else if(param.apply_reason.length > 500) {
					prompt = {type: 'danger', msg: '申请原因输入过长，最多只能输入500个汉字'};
				}
				return prompt;
			},
			validateSelect: function(param) {
				var prompt = null;
				if(!param.onSelectSite || !param.onSelectProgram) {
					prompt = {type: 'danger', msg: '请选择所属站点和所属项目'};
				} else if(!param.onSelectUploadType) {
					prompt = {type: 'danger', msg: '请选择上传代码类型'};
				}
				return prompt;
			},
			validate: function(param) {
				var prompt = null;
				if(!param.onSelectSite || !param.onSelectProgram) {
					prompt = {type: 'danger', msg: '请选择所属站点和所属项目'};
				} else if(!param.onSelectUploadType) {
					prompt = {type: 'danger', msg: '请选择上传代码类型'};
				} else if(param.onSelectUploadType == 'comp-upload' && param.onUploadDone != true) {
					prompt = {type: 'danger', msg: '压缩包未上传完成'};
				}
				return prompt;
			},
			qrySites: function(param, callback) {
				serverHostProfileService.qrySites(param, callback);
			},
			qryPrograms: function(param, callback) {
				serverHostProfileService.qryPrograms(param, callback);
			},
			/*doCreate : function(callback) {
				callback({success: false, msg: "就是不让你成功"});
			},
			doSave : function(callback){
				callback({success: false, msg: "就是不让你成功"});
			},*/
			fetchFTPAccnt: function(callback) {
				rxResource.post(mtsapis.getFtpAccnt.api, null, null, callback);
			},
			commitUplineRequest: function(param, callback) {
				rxResource.post(mtsapis.commitUpline.api, null, param, callback);
			}
		}
	}]);

});