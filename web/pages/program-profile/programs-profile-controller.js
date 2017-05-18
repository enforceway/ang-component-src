define(['templateModule', '../programs/programs-profile-service'],
	function(eftemplateApp) {
    'use strict';

	eftemplateApp.controller('programsController', ['$rootScope', '$scope', '$state', '$timeout', '$modal', 'mtsMethodNames', 'h5plusAPINameHandler', 'serverHostProfileService', 'programsProfileService', 'messageConfig', 'modalMessageConfig',
		function($rootScope, $scope, $state, $timeout, $modal, mtsMethodNames, h5plusAPINameHandler, serverHostProfileService, programsProfileService, messageConfig, modalMessageConfig) {
			$scope.programLoge = {
				programQryCondition: {input:''},
				programManifest: {programList: {}, programTotal: 0, onCommitProgram: null, onAuditProgram: null},
				viewAnalysis: function(program) {
					serverHostProfileService.viewAnalysis(program);
				},
				resetAndQryProgramsWithCondition: function() {
					$scope.pagination.pageIndex = 1;
					this.searchProgramsWithCondition();
				},
				resetAndQryProgramsWithoutCondition: function() {
					$scope.pagination.pageIndex = 1;
					this.searchProgramsWithoutCondition();
				},
				init: function() {
					$rootScope.windowUtil.close();
					var $this = this;
					//是否应该显示指导导航
					serverHostProfileService.qryGuideDisplay(serverHostProfileService.hitch(this, function(result) {
						if(result == true) {
							$state.go('quick-guide');
							return;
						}
						if(!$scope.pagination) {
							$scope.pagination = {
								pageIndex: 1,
								pageSize: 10
							};
						}
						this.searchProgramsWithoutCondition();
						/* ftp帐号对于一个用户来说用户名和密码是固定的，不能修改，所以在进入项目列表时候就查询一次了，之后用到ftp用户名和密码地方直接去rootScope上的traverseLoge上取*/
						this.qryFTPInfo();
						//获取当前登录帐号的pid
						this.getPid();
					}));
				},
				searchProgramsWithCondition : function() {
					var programName = this.programQryCondition.input;
					var options = {
						page_num: $scope.pagination.pageIndex,
						page_size: $scope.pagination.pageSize,
						project_name: programName
					};
					this.qryPrograms(options);
				},
				searchProgramsWithoutCondition: function() {
					var options = {
						page_num: $scope.pagination.pageIndex,
						page_size: $scope.pagination.pageSize
					};
					this.qryPrograms(options);
				},
				qryPrograms: function(param) {
					//var $this = this;
					//设置要查询的项目名称
					serverHostProfileService.qryPrograms(param, serverHostProfileService.hitch(this, function(result) {
						result = h5plusAPINameHandler.convert(mtsMethodNames.qryPrograms.methodName, result);
						if(result.error_response) {
							messageConfig.offer({type: 'danger', msg: messageConfig.netExceptionMsg});
							return;
						}
						this.programManifest.programList = result.siteprojectons.siteprojecton;
						this.programManifest.programTotal = result.total;
					}));
				},
				qryFTPInfo: function() {
					//var $this = this;
					serverHostProfileService.qryFTPInfo(function(result) {
						if(result.error_response) {
							messageConfig.offer({type: 'danger', msg: messageConfig.netExceptionMsg});
							return;
						}
						//放在rootScope上traverseLoge上面，是因为每个账户对应的账户信息还有密码是固定的，所以进入项目列表一次就放在rootScope上，其他地方去rootScope.traverseLoge上面去吧
						angular.extend($rootScope.traverseLoge.ftpInfo, result.MtsFtpUser);
					});
				},
				getPid: function() {
					//获取帐号pid
					serverHostProfileService.getPid(function(result) {
						if ('1' == result.code) {
							//等于1代表查询成功
							var data = result.data;
							$rootScope.traverseLoge.accntInfo.pid = data._id;
						}
					});
				},
				/*///申请上线画面
				showDialogOfCommitOnline : function(pendingCommitProgram) {
					this.programManifest.onCommitProgram = {};
					angular.extend($rootScope.traverseLoge.onCommitProgram, pendingCommitProgram);
					$rootScope.windowUtil.open({
						templateUrl: 'pages/module-templates/program-commit-online.html',
						scope: $scope,
						size: 'md',
						backdrop: 'static', 
						keyboard: false
					});
				},*/
				//版本列表画面
				showDialogOfProgramVersion : function(versionedProgram) {
//					$scope.versionData = {};
					var newScope = $rootScope.$new();
					newScope.versionData = {}
					angular.extend(newScope.versionData, versionedProgram);
					$rootScope.windowUtil.open({
						templateUrl: 'pages/module-templates/program-version.html',
						scope: newScope,
						size: 'md',
						backdrop: 'static', 
						keyboard: false
					});
				},
				//审批历史列表画面
				showDialogOfAuditLog : function(auditProgram) {
					this.programManifest.onAuditProgram = {};
					var newScope = $rootScope.$new();
					newScope.auditData = {};
					angular.extend(newScope.auditData, auditProgram);
					$rootScope.windowUtil.open({
						templateUrl: 'pages/module-templates/program-audit-profile.html',
						scope: newScope,
						size: 'md',
						backdrop: 'static', 
						keyboard: false
					});
				},
				//创建项目画面
				showDialogOfProgramCreate : function() {
					$rootScope.windowUtil.open({
						templateUrl: 'pages/module-templates/program-profile-create.html',
						scope: $scope,
						size: 'lg',
						backdrop: 'static', 
						keyboard: false
					});
				},
				//编辑项目画面
				showDialogOfProgramEdit : function(pendingEditProgram) {
					$scope.editProgramData = {};
					angular.extend($scope.editProgramData, pendingEditProgram);
					$rootScope.windowUtil.open({
						templateUrl: 'pages/module-templates/program-profile-edit.html',
						scope: $scope,
						size: 'md',
						backdrop: 'static',
						keyboard: false
					});
				},
				/*//创建后选择去向的画面
				showDialogOfCreatePost : function(pendingEditProgram) {
					$rootScope.windowUtil.open({
						templateUrl: 'pages/module-templates/program-create-post.html',
						scope: $scope,
						size: 'md',
						backdrop: 'static',
						keyboard: false
					});
				},*/
				//移除项目
				showDialogOfProgramRemove: function(programPendingRemove) {
					var param = {
						project_id: programPendingRemove.project_id
					};
					var $this = this;
					modalMessageConfig.dialogOfDecisionMaking({
						template: 'itemRemoveTpl.html',
						size: 'sm',
						keyboard: false,
						backdrop : 'static',
						scope: $scope,
						param: param,
						confirm : function(data) {
							programsProfileService.doRemove(param, function(result) {
								result = h5plusAPINameHandler.convert(mtsMethodNames.removeProgram.methodName, result);
								if(result.error_response) {
									var tmp = {type: 'danger', msg: messageConfig.netExceptionMsg};
									if(result.error_response.code == 'H5MTSI093') {
										tmp = {type: 'danger', msg: '此项目已经申请上线，不可以进行删除操作'};
									}
									messageConfig.offer(tmp);
									return;
								}
								messageConfig.offer({type: 'success', msg: "操作成功"});
								$this.resetAndQryProgramsWithoutCondition();
							});
						},
						cancel : function(data) {
						}
					});
				},
				viewProgramDetail: function(onDetailViewProgram) {
					var param = {};
					angular.extend(param, onDetailViewProgram);
					$state.go('program-detail', param);
				}
			};
		}
	]);

	eftemplateApp.controller('programCreateController', ['$modal','$rootScope','$scope', '$state', '$timeout', 'modalMessageConfig', 'mtsMethodNames', 'h5plusAPINameHandler', 'serverHostValidator', 'programsProfileService', 'messageConfig', 'serverHostProfileService',
		function($modal,$rootScope, $scope, $state, $timeout, modalMessageConfig, mtsMethodNames, h5plusAPINameHandler, serverHostValidator, programsProfileService, messageConfig, serverHostProfileService) {
			$scope.slides = [{id:1,image:"static/images/site_domain_explain.png",text:""},{id:2,image:"static/images/project_path_explain.png",text:""}];
			$scope.formatter = function (item) {
				if(!item.text) {
					return '';
				}
				return item.text.toLowerCase();
			};
			$scope.parser = function (item) {
				return item.value;
			};
			$scope.programCreateLoge = {
				siteList: [],
				onCreateProgram: {clicked:false, programSiteName: '',programSiteId:'', programName:'', programFolder: '', programDesc: ''},
				init: function() {
					this.qrySites();
				},
				qrySites: function() {
					var $this = this;
					var param = {
						page_size: 100,
						page_num : 1
					};
					//这里应该把所有的站点都查询出来
					serverHostProfileService.qrySites(param, function(result) {
						result = h5plusAPINameHandler.convert(mtsMethodNames.qrySites.methodName, result);
						if(result.error_response) {
							messageConfig.offer({type: 'danger', msg: messageConfig.netExceptionMsg});
							return;
						}
						var newSitesArr = [];
						angular.forEach(result.sites.site, function(item, value) {
							newSitesArr.push({text: item.ftp_site_path, value: item.id});
						});
						$this.siteList = newSitesArr;
					});
				},
				doCreate: function() {
					var $this = this;
					//site_id无值site_name有值，说明用户输入了新的站点；site_id有值site_name无值，说明用户选择站点
					var programParam = {
						site_name : 		this.onCreateProgram.programSiteName,
						site_id : 			this.onCreateProgram.programSiteId,
						project_name : 		this.onCreateProgram.programName,
						project_path_name : this.onCreateProgram.programFolder,
						project_des : 		this.onCreateProgram.programDesc,
						project_type:		'3',
						pid: 				$rootScope.traverseLoge.accntInfo.pid
					};
					var programDetailParam = {
						project_id: 	null,
						project_name:   null,
			            project_path:   null,
			            site_name: 		null,
			            project_type:  	null,
			            project_status: null,
			            project_des:	null,
//			            is_online:  	null,
			            site_id:  		null,
			            publish_status: null,
			            update_time: 	null,
			            http_url: 		null,
			            create_time: 	null
					};
					function createSite() {
						var siteParam = {
							name: programParam.site_name,
							captcha : '1234',
							description: '',
							dns : programParam.site_name
						};
						//验证站点域名
						var promptObj = serverHostValidator.validateSiteDns(programParam.site_name);
						if (promptObj) {
	                        messageConfig.offer(promptObj);
	                        $scope.clicked = false;
	                        return;
	                    }
						serverHostProfileService.createSite(siteParam, function(result) {
                            result = h5plusAPINameHandler.convert(mtsMethodNames.createSite.methodName, result);
                            if (result.error_response) {
                                var error = result.error_response;
                                var tmp;
                                tmp = {type: 'danger', msg: messageConfig.netExceptionMsg};
                                if (error.code == 'H5MTSEA001' || error.code == 'H5MTSI057' || error.code == 'H5MTSI058') {
                                    tmp = {
                                        type: 'danger',
                                        msg: error.msg
                                    };
                                }
                                $scope.clicked = false;
                                messageConfig.offer(tmp);
                                return;
                            }
                            programParam.site_id = result.id;
                            // 1. 如果创建站点成功则，直接去创建项目
                            createProgram();
							// 2. 并且刷新站点列表
							$this.qrySites();
                            //$this.siteList.push({text:siteParam.name,value:result.id});
                        });
					};
					function createProgram(){
						serverHostProfileService.createProgram(programParam, function(result) {
							$scope.clicked = false;
							result = h5plusAPINameHandler.convert(mtsMethodNames.createProgram.methodName, result);
							if(result.error_response) {
								var tmp = {type: 'danger', msg: messageConfig.netExceptionMsg};
								if(/(H5MTSI079)|(H5MTSI078)|(H5MTSI081)|(H5MTSI082)/.test(result.error_response.code)) {
									tmp = {type: 'danger', msg: result.error_response.msg};
								}
								$scope.clicked = false;
								messageConfig.offer(tmp);
								return;
							}
							programDetailParam.site_id = programParam.site_id;
							programDetailParam.site_name = programParam.site_name;
							programDetailParam.project_id = result.id;
							programDetailParam.project_name = result.name;
							programDetailParam.project_path = result.ftpProjectPath;
							programDetailParam.project_type = result.type;
							programDetailParam.project_status = result.isOnline;
							programDetailParam.publish_status = result.publishedStatus;
							programDetailParam.project_des = result.description;
							programDetailParam.update_time = result.rxUpdatetime;
							programDetailParam.http_url = result.httpUrl;
							programDetailParam.http_url_on = result.prodHttpUrl;
							programDetailParam.create_time = result.rxInserttime;
							programDetailParam.piwik_id = result.piwikId;
							
							//打开提示用户是否前往项目详情的画面
							showBench();
							//重新加载项目列表，如果成功创建项目
							$scope.programLoge.resetAndQryProgramsWithoutCondition();
						});
					};
					//用于显示提示用户是否进入项目详情的画面
					function showBench() {
						$rootScope.windowUtil.close();
						modalMessageConfig.dialogOfDecisionMaking({
							template: 'programCreateBench.html',
							size: 'md',
							keyboard: false,
							backdrop : 'static',
							scope: $scope,
							param: programDetailParam,
							confirm : function(param) {
								$state.go('program-detail', param);
								//$rootScope.windowUtil.close();
							},
							cancel : function(data) {
								$rootScope.windowUtil.close();
							}
						});
					}
					//检查是否有必填项没填写
					var tmp = null;
					var promptObj = programsProfileService.validate(programParam);
					if(!promptObj && (tmp = programsProfileService.validateFolder(programParam.project_path_name))) {
						promptObj = tmp;
					}
					if(promptObj) {
						messageConfig.offer(promptObj);
						return;
					}
					//如果选择了站点,则直接创建项目即可
					if(programParam.site_id && !programParam.site_name) {
						programParam.site_id = this.onCreateProgram.programSiteId;
						//如果用户选择了列表中站点,则把站点名字找到
						angular.forEach(this.siteList, function(item, index){
							if(item.value == programParam.site_id) {
								programParam.site_name = item.text;
							}
						});
						$scope.clicked = true;
						createProgram();
					} else if(!programParam.site_id && programParam.site_name) {
						//如果没有选择站点且输入了要创建的站点域名
						$scope.clicked = true;
						createSite();
					} else {
						//如果没有选择站点且没有输入要创建的站点域名
						messageConfig.offer({type:'danger',msg:'请选择项目关联站点'});
					}
				}
			};
		}
	]);

	//编辑项目
	eftemplateApp.controller('programEditController', ['$rootScope', '$scope', '$state', '$timeout', 'mtsMethodNames', 'h5plusAPINameHandler', 'programsProfileService', 'messageConfig', 'FileUploader',
	    function($rootScope, $scope, $state, $timeout, mtsMethodNames, h5plusAPINameHandler, programsProfileService, messageConfig, FileUploader) {
			$scope.programEditLoge = {
				onEditProgram : {},
				init: function() {
					angular.extend(this.onEditProgram, $scope.editProgramData);
				},
				doSave: function() {
					var $this = this;
					var param = {
						site_id : '0',
						project_path_name : 'path',
						project_id: this.onEditProgram.project_id,
						project_name: this.onEditProgram.project_name,
						project_des: this.onEditProgram.project_des
					};
					var promptObj = programsProfileService.validate(param);
					if(promptObj) {
						messageConfig.offer(promptObj);
						return;
					}
					delete param.project_path_name;
					delete param.site_id;
					$scope.clicked = true;
					programsProfileService.doSave(param, function(result) {
						$scope.clicked = false;
						result = h5plusAPINameHandler.convert(mtsMethodNames.editProgram.methodName, result);
						if(result.error_response) {
							var tmp = {type: 'danger', msg: messageConfig.netExceptionMsg};
							if(/(H5MTSI079)|(H5MTSI078|(H5MTSI081)|(H5MTSI082))/.test(result.error_response.code)) {
								tmp = {type: 'danger', msg: result.error_response.msg};
							}
							messageConfig.offer(tmp);
							return;
						}
						messageConfig.offer({type: 'success', msg: '操作成功'});
						$rootScope.windowUtil.close();
						//如果是从项目详情过来的需要刷新项目详情
						if($scope.programDetailLoge && $scope.programDetailLoge.onViewProgram) {
							$scope.programDetailLoge.onViewProgram.project_des = param.project_des;
							$scope.programDetailLoge.onViewProgram.project_name = param.project_name;
						}
						//如果是从项目列表过来的需要刷新项目列表
						if($scope.programLoge && $scope.programLoge.resetAndQryProgramsWithoutCondition) {
							$scope.programLoge.resetAndQryProgramsWithoutCondition();
						}
					});
				}
			};
		}
	]);

	//审批历史
	eftemplateApp.controller('programAuditLogController', ['$scope', '$state', '$timeout', 'mtsMethodNames', 'h5plusAPINameHandler', 'programsProfileService', 'messageConfig', 'FileUploader',
	    function($scope, $state, $timeout, mtsMethodNames, h5plusAPINameHandler, programsProfileService, messageConfig, FileUploader) {
			$scope.auditLogLoge = {
				auditManifest:{auditLogList:[], logTotal:0, onAuditProgram:null},
				qryLogs: function() {
					var $this = this;
					var param = {
						project_id : this.auditManifest.onAuditProgram.project_id,
						page_num: $scope.pagination.pageIndex,
                        page_size: $scope.pagination.pageSize
					};
					programsProfileService.qryAuditLog(param, function(result) {
						result = h5plusAPINameHandler.convert(mtsMethodNames.qryAuditLog.methodName, result);
						if(result.error_response) {
							messageConfig.offer({type: 'danger', msg: messageConfig.netExceptionMsg});
							return;
						}
						$this.auditManifest.auditLogList = result.projectversions.projectversion;
						$this.auditManifest.logTotal = result.total;
					});
				},
				init: function() {
					if (!$scope.pagination) {
                        $scope.pagination = {pageIndex:1, pageSize:5};
                    }
					this.auditManifest.onAuditProgram = {};
					angular.extend(this.auditManifest.onAuditProgram, $scope.auditData);
					//angular.extend(this.auditManifest.onAuditProgram, $scope.programLoge.programManifest.onAuditProgram);
					this.qryLogs();
				}
			};
		}
	]);

	//申请上线
	eftemplateApp.controller('programUplineController', ['$scope', '$rootScope', '$timeout', '$modal', 'mtsapis', 'FileUploader', 'mtsMethodNames', 'h5plusAPINameHandler', 'serverHostProfileService', 'codeProfileService', 'messageConfig', 'modalMessageConfig',
		 function($scope, $rootScope, $timeout, $modal, mtsapis, FileUploader, mtsMethodNames, h5plusAPINameHandler, serverHostProfileService, codeProfileService, messageConfig, modalMessageConfig) {
			$scope.clicked = false;
			$scope.applyFlag = false;
			$scope.codeCommitLoge = {
				accntsWithCode:[{name: 'h5plus', pub_id : 'gh_7996537d8300', group_index:'自动分配微信公众号'}],
				accntsWithoutCode: [{name: 'h5plus', pub_id : 'gh_7996537d8300', group_index:'自动分配微信公众号'}],
				commitInfoLoge: {clicked: false, commitComment:'', wechat_account:'gh_7996537d8300'},
				accntsOptions: [],
				//默认使用的是h5plus公众号的weixin_id
				init: function(){
					this.accntsOptions = this.accntsWithoutCode;
					//$scope.wechatCodeFlag = false;
					this.qryAllPubAccnt();
					var $this = this;
					$scope.$watch('wechatCodeFlag', function(newValue, oldValue) {
						//等于false，说明不包含代码
						if(newValue == false) {
							$this.commitInfoLoge.wechat_account = 'gh_7996537d8300';
							$this.accntsOptions = $this.accntsWithoutCode;
						} else if(newValue == true) {
							$this.accntsOptions = $this.accntsWithCode;
						}
					});
					$scope.$watch('codeCommitLoge.commitInfoLoge.commitComment', function(newValue, oldValue) {
						if(newValue.length >= 1) {
							$scope.applyFlag = true;
						} else {
							$scope.applyFlag = false;
						}
					});
				},
				//获得帐号下面所有的微信公众号
				qryAllPubAccnt:function() {
					serverHostProfileService.qryPubidList(serverHostProfileService.hitch(this, function(result) {
						if(result.error_response) {
							return;
						}
						if(result.wxinfos) {
							var fullGrantAccnts = [];
							angular.forEach(result.wxinfos.wxinfo, function(item, index) {
								item.group_index = '我的公众号';
								fullGrantAccnts.push(item);
							});
							this.accntsWithoutCode = this.accntsWithoutCode.concat(fullGrantAccnts);
							this.accntsOptions = this.accntsWithoutCode;
						}
					}));
				},
				doCommit: function() {
					var $this = this;
					var onSelectSite = $rootScope.traverseLoge.onCommitProgram.site_id;
					var onSelectProgram = $rootScope.traverseLoge.onCommitProgram.project_id;
					var index_path = $rootScope.traverseLoge.onCommitProgram.index_path;
					var ftpInfo = $rootScope.traverseLoge.ftpInfo;
					//$scope.wechatCodeFlag是true代表不包含微信代码
					var param = {
						index_path: index_path,
						site_id : onSelectSite,
						project_id : onSelectProgram,
						apply_reason: this.commitInfoLoge.commitComment,
						deploy_type: '1',
						weixin_id: $scope.wechatCodeFlag?this.accntsWithoutCode[0]['pub_id']:this.commitInfoLoge.wechat_account,
						weixin_source_yn: $scope.wechatCodeFlag?'N':'Y'
//						ftp_user: ftpInfo.ftp_user,
					};
					//校验一下输入申请的信息正确与否
					/*var prompt = codeProfileService.validateCommit(param);
					if(prompt){
						messageConfig.offer(prompt);
						return;
					}*/
					//校验项目目录下面是否有index.html, 估计可以去掉了
					$scope.clicked = true;
					codeProfileService.commitUplineRequest(param, function(result) {
						$scope.clicked = false;
						if(result.error_response) {
							var prompt = {type: 'danger', msg: messageConfig.netExceptionMsg};
							if(result.error_response.code == 'H5MTSI709') {
								prompt = {type: 'danger', msg: '申请原因不可为空'};
							} else if(result.error_response.code == 'H5MTSI710') {
								prompt = {type: 'danger', msg: result.error_response.msg};
							}
							messageConfig.offer(prompt);
							return;
						}
						$scope.programDetailLoge.onViewProgram.publish_status = 1;
						$rootScope.windowUtil.close();
						$scope.programDetailLoge.onViewProgram.publish_status = 1; // 1代表审批中
						messageConfig.offer({type: 'success', msg: '上线申请提交成功!审核周期为:1-3工作日'});
						serverHostProfileService.commitNotify($rootScope.traverseLoge.onCommitProgram);
						//重新加载项目列表
						//$scope.programLogeObj.resetAndQryPrograms();
					});
					/*serverHostProfileService.qualifiedToCommit(param, function(result) {
						if(result.error_response) {
							$this.commitLogeObj.clicked = false;
							messageConfig.offer({type:'danger', msg: result.error_response.msg});
							return;
						}
						if(result.code == 1) {
							codeProfileService.commitUplineRequest(param, function(result) {
								$this.commitLogeObj.clicked = false;
								if(result.error_response) {
									var prompt = {type: 'danger', msg: messageConfig.netExceptionMsg};
									if(result.error_response.code == 'H5MTSI709') {
										prompt = {type: 'danger', msg: '申请原因不可为空'};
									} else if(result.error_response.code == 'H5MTSI710') {
										prompt = {type: 'danger', msg: result.error_response.msg};
									}
									messageConfig.offer(prompt);
									return;
								}
								$scope.dialogOfManipulate.dismiss('cancel');
								messageConfig.offer({type: 'success', msg: '上线申请提交成功!审核周期为:1-3工作日'});
								//重新加载项目列表
								$scope.programLogeObj.resetAndQryPrograms();
							});
						}
					});*/
				}
			}
		}
	]);

	//版本列表
	eftemplateApp.controller('versionsProfileController', ['$scope', '$state', '$timeout', '$modal', 'mtsapis', 'mtsMethodNames', 'h5plusAPINameHandler', 'versionsProfileService', 'messageConfig', 'modalMessageConfig',
        function($scope, $state, $timeout, $modal, mtsapis, mtsMethodNames, h5plusAPINameHandler, versionsProfileService, messageConfig, modalMessageConfig) {
		$scope.versionsLoge = {
			versionProfile: {
				versionTotal: 0,
				versionList: []
			},
			init: function() {
				var $this = this;
				if (!$scope.pagination) {
    				$scope.pagination = {pageIndex:1, pageSize:5};
    			}
				this.qryProgramVersion();
			},
			qryProgramVersion: function() {
				var $this = this;
				var onSelectProgram = $scope.versionData.project_id;
				var param = {
					page_num: $scope.pagination.pageIndex,
	                page_size: $scope.pagination.pageSize,
					project_id : onSelectProgram
				};
				versionsProfileService.qryProgramsVersion(param, function(result) {
					result = h5plusAPINameHandler.convert(mtsMethodNames.qryProgramsVersion.methodName, result);
					$this.versionProfile.versionList = result.projectversions.projectversion;
					$this.versionProfile.versionTotal = result.total;
				});
			}}
   		}
   	]);

	//浏览项目详情
	eftemplateApp.controller('programDetailController', ['$rootScope','serverHostProfileService','$stateParams','$scope', '$state', 'mtsMethodNames', 'h5plusAPINameHandler', 'programsProfileService', 'messageConfig', '$timeout', 'FileUploader',
		function($rootScope, serverHostProfileService, $stateParams, $scope, $state, mtsMethodNames, h5plusAPINameHandler, programsProfileService, messageConfig, $timeout, FileUploader) {
			$scope.programDetailLoge = {
				onViewProgram: {htmlFileList:[],htmlFileTotal:0, defaultKey:'', onProdUrl: '', onTestUrl:''},
				init: function() {
					if(!$stateParams.project_id) {
						$state.go('program-profile');
						return;
					}
					angular.extend(this.onViewProgram, $stateParams);
					this.getHtmlFileList(false);
					this.watchDefaultHtml();
				},
				viewAnalysis: function() {
					serverHostProfileService.viewAnalysis(this.onViewProgram);
				},
				//设置项目首页
				setDefaultHtml: function(defaultObj) {
					var param = {
						project_id : this.onViewProgram.project_id,
						main_html_path : defaultObj.file_path
					};
					serverHostProfileService.setDefaultHtml(param, serverHostProfileService.hitch(this, function(result) {
						if(result.error_response) {
							return;
						}
						//this.getHtmlFileList();
						this.onViewProgram.onTestUrl = defaultObj.file_url;
					}));
				},
				//设置观察项目首页选择变化
				watchDefaultHtml : function() {
					var $this = this;
					$scope.$watch('programDetailLoge.onViewProgram.defaultKey', function(newValue, oldValue) {
						if(newValue && (newValue != oldValue)) {
							var result = $this.onViewProgram.htmlFileList.filter(function(item) {
								return item.file_path == newValue;
							});
							if(result.length) {
								$rootScope.traverseLoge.onCommitProgram.index_path = result[0]['file_path'];
								$this.setDefaultHtml(result[0]);
							}
						}
					});
				},
				//获得项目目录下所有html文件
				getHtmlFileList: function(initLoadingIcon) {
					var param = {
						ftp_account: $rootScope.traverseLoge.ftpInfo.ftp_user,
						project_id : this.onViewProgram.project_id
					};
					$scope.loadingHtmlFiles = initLoadingIcon;
					serverHostProfileService.getHtmlFileList(param, serverHostProfileService.hitch(this, function(result) {
						$timeout(function(){
							$scope.loadingHtmlFiles = false;
						}, 1500);
						if(result.error_response) {
							return;
						}
						var $this = this;
						angular.forEach(result.files.file, function(item, index) {
							if(item.is_default == true) {
								$rootScope.traverseLoge.onCommitProgram.index_path = item.file_path;
								$this.onViewProgram.defaultKey = item.file_path;
								$this.onViewProgram.onTestUrl = item.file_url;
							}
						});
						this.onViewProgram.htmlFileList = result.files.file;
						this.onViewProgram.htmlFileTotal = result.files.file.length;
						if(this.onViewProgram.htmlFileList.length == 0) {
							this.onViewProgram.defaultKey = '';
							this.onViewProgram.onTestUrl = '';
						}
					}));
				},
				//编辑项目的画面
				showDialogOfEditProgram: function() {
					$scope.editProgramData = {};
					angular.extend($scope.editProgramData, this.onViewProgram);
					$rootScope.windowUtil.open({
						templateUrl: 'pages/module-templates/program-profile-edit.html',
						scope: $scope,
						size: 'md',
						backdrop: 'static',
						keyboard: false
					});
				},
				//打开压缩包上传画面
				showDialogOfUpload : function() {
					$scope.uploadData = {};
					angular.extend($scope.uploadData = {}, this.onViewProgram);
					$rootScope.windowUtil.open({
						templateUrl: 'pages/module-templates/code-upload.html',
						scope: $scope,
						size: 'md',
						backdrop: 'static', 
						keyboard: false
					});
				},
				//打开FTP帐号浏览画面
				showDialogOfFTPView : function() {
					$rootScope.windowUtil.open({
						templateUrl: 'pages/module-templates/program-ftpinfo.html',
						scope: $scope,
						size: 'md',
						backdrop: 'static', 
						keyboard: false
					});
				},
				//打开申请上线画面
				showDialogOfCommitOnline : function() {
					if(this.onViewProgram.publish_status == 1) {
						messageConfig.offer({type:'danger', msg:'正在审批中，不可重复提交'});
						return;
					}
					//这里保存在rootScope里面是因为，有可能在不同的画面，即不同的controller中进行提交申请的操作.
					angular.extend($rootScope.traverseLoge.onCommitProgram, this.onViewProgram, $stateParams);
					$rootScope.windowUtil.open({
						templateUrl: 'pages/module-templates/program-commit-online.html',
						scope: $scope,
						size: 'md',
						backdrop: 'static', 
						keyboard: false
					});
				},
				//打开版本管理画面
				showDialogOfVersions : function() {
					$scope.versionData = {};
					angular.extend($scope.versionData, this.onViewProgram);
					$rootScope.windowUtil.open({
						templateUrl: 'pages/module-templates/program-version.html',
						scope: $scope,
						size: 'md',
						backdrop: 'static', 
						keyboard: false
					});
				}
			};
			$scope.ifUploadTab = true;
		}
	]);

	//ftp帐号controller
	'use strict';
	eftemplateApp.controller('programFTPInfoController', ['$rootScope','$scope', 'mtsFtpService',
		function($rootScope, $scope, mtsFtpService) {
			$scope.ftpLoge = {
				ftpInfo: {},
				init: function() {
					angular.extend(this.ftpInfo, $rootScope.traverseLoge.ftpInfo);
					angular.extend(this.ftpInfo, mtsFtpService);
				}
			};
		}
	]);

	//示例项目controller
	eftemplateApp.controller('ProjectExampleListCtrl', ['$rootScope', '$scope', '$state', '$timeout', '$modal', 'mtsMethodNames', 'h5plusAPINameHandler', 'serverHostProfileService', 'programsProfileService', 'messageConfig', 'modalMessageConfig',
		function($rootScope, $scope, $state, $timeout, $modal, mtsMethodNames, h5plusAPINameHandler, serverHostProfileService, programsProfileService, messageConfig, modalMessageConfig) {
			$scope.exampleList = [{
				viewAnalysis: true,
				download: true,
				browseAndView: true,
		        title: '学习中心示例',
		        body: '学习中心示例',
		        img: 'img/static_site.png',
		        rx_inserttime:'2016-01-06 10:01:09',
		        previewUrl: 'http://system.minisite.h5plus.net/working/FTP1263/system/learning1/index.html',
		        doc: 'http://ruixuesoftpicture.oss-cn-beijing.aliyuncs.com/h5plus/静态网站示例说明.docx',
		        code: 'http://resource.h5plus.net/example/%E5%AD%A6%E4%B9%A0%E4%B8%AD%E5%BF%83.zip',
		        piwik_id:1
		    }, {
		    	viewAnalysis: true,
		        download: true,
		        browseAndView: true,
		        title: '个人简历站点示例',
		        body: '个人简历站点示例',
		        img: 'img/nosqlblog.png',
		        rx_inserttime:'2016-01-01 10:10:10',
		        previewUrl: 'http://enforceway.minisite.h5plus.net/working/FTP10638/enforceway/nosqlblog/index.html',
		        doc: 'http://h5plus.oss-cn-hangzhou.aliyuncs.com/example/个人博客示例说明.docx',
		        code: 'http://h5plus.oss-cn-hangzhou.aliyuncs.com/example/enforcewayblog.zip',
		        piwik_id:1
		    }, {
		    	viewAnalysis: false,
		        download: true,
		        browseAndView: false,
		        qrcode: true,
		        title: '微信JS-SDK示例',
		        body: '本示例是一个完全由HTML和JS实现微信JS-SDK接口调用',
		        img: 'img/weixin-jssdk.png',
		        rx_inserttime:'2016-01-01 10:10:10',
		        previewUrl: 'http://example.minisite.h5plus.net/working/FTP1263/example/jssdk/index.html',
		        doc: 'http://ruixuesoftpicture.oss-cn-beijing.aliyuncs.com/h5plus/微信JS-SDK说明.doc',
		        code: 'http://ruixuesoftpicture.oss-cn-beijing.aliyuncs.com/h5plus/微信JS_SDK_demo.zip',
		        piwik_id:1
		    },
		    {
		    	viewAnalysis: false,
		        download: true,
		        browseAndView: false,
		        qrcode: true,
		        title: 'H5SDK调用微信接口示例',
		        body: '使用h5sdk调用微信接口示例说明,请在微信浏览器预览',
		        img: 'img/weixingongzhonghpingtai.jpg',
		        rx_inserttime:'2016-01-01 10:10:10',
		        previewUrl: 'http://example.minisite.h5plus.net/working/FTP1263/example/ropapi/index.html',
		        doc: 'http://ruixuesoftpicture.oss-cn-beijing.aliyuncs.com/h5plus/H5SDK微信接口调用说明.doc',
		        code: 'http://ruixuesoftpicture.oss-cn-beijing.aliyuncs.com/h5plus/H5SDK调用微信API.zip',
		        piwik_id:1
		    },
		    {
		    	viewAnalysis: false,
		        download: true,
		        browseAndView: false,
		        title: 'H5SDK调用ROP接口示例',
		        body: '使用h5sdk调用ROP接口示例说明',
		        img: 'img/ropcall.png',
		        rx_inserttime:'2016-01-01 10:10:10',
		        previewUrl: 'http://example.minisite.h5plus.net/working/FTP1263/example/h5sdkrop/index.html',
		        doc: 'http://h5plus.oss-cn-hangzhou.aliyuncs.com/H5SDKROPAPI接口调用说明.doc',
		        code: 'http://h5plus.oss-cn-hangzhou.aliyuncs.com/H5SDK调用ROP接口示例.zip',
		        piwik_id:1
		    },
		    {
		    	viewAnalysis: false,
		        download: true,
		        browseAndView: false,
		        title: 'ROP接口示例',
		        body: '调用ROP接口示例说明',
		        img: 'img/ropcall-nonh5sdk.png',
		        rx_inserttime:'2016-01-01 10:10:10',
		        previewUrl: 'http://example.minisite.h5plus.net/working/FTP1263/example/ropapi/index.html',
		        doc: 'http://ruixuesoftpicture.oss-cn-beijing.aliyuncs.com/h5plus/RopApi调用说明.docx',
		        code: 'http://ruixuesoftpicture.oss-cn-beijing.aliyuncs.com/h5plus/RopApi调用_demo.zip',
		        piwik_id:1
		    }];
			$scope.projectExampleList={
				report:function(example){
					var url = 'http://test.bi.ruixuesoft.com:8081/h5/html/h5TemplateView.html?projectId=' + example.piwik_id + '&sessionId=024zYyGz7NjBeW7StY1ZxjtMtD/mvNdQ4muPFKB8g8wB0%3D';
//					var url = 'http://172.20.5.16:18080/h5/html/h5TemplateView.html?projectId=' + example.piwik_id + '&sessionId=024zYyGz7NjBeW7StY1ZxjtMtD/mvNdQ4muPFKB8g8wB0%3D';
					window.open(url, '_blank');
				},
				download:function(example){
					var url = example.code;
					window.open(url, '_blank');
				},
				preview:function(example){
					var url = example.previewUrl;
					window.open(url, '_blank');
				}
			};
		}
	])

	//代码上传controller
	eftemplateApp.controller('codeProfileController', ['$rootScope', '$scope', '$state', '$stateParams', '$timeout', '$modal', 'mtsapis', 'FileUploader', 'mtsMethodNames', 'h5plusAPINameHandler', 'codeProfileService', 'serverHostProfileService', 'messageConfig', 'modalMessageConfig',
		function($rootScope, $scope, $state, $stateParams, $timeout, $modal, mtsapis, FileUploader, mtsMethodNames, h5plusAPINameHandler, codeProfileService, serverHostProfileService, messageConfig, modalMessageConfig) {
			$scope.clicked = false;
			$scope.codeLoge = {
				programInfo: {uploadLog:[], uploadTotal:0},
				packageUpload: {
					uploaded: false
//					reset: function() {
						//清空上传到压缩包名称
//						$scope.codeLogeObj.codeProfile.uploadFileName = '';
						//清空上传进度
//						$scope.codeLogeObj.codeProfile.onUploadProgress = 0;
						//初始化上传状态为从未上传过压缩包
//						$scope.codeLogeObj.packageUpload.done = null;
						//清空上传控件保存的压缩包名称
//						document.uploadForm.reset();
//						$scope.zipUploader.clearQueue();
//					},
//					done: null
				},
				codeProfile: {
//					uploadFileName: '',
//					ftp_port: '21',
//					ftp_addr:'',
//					ftpuser:'',
//					ftppwd: '',
//					programList: [],
//					uploadList: []
					//onUploadProgress: 0,
				},
				init: function() {
					if(!$scope.pagination) {
						$scope.pagination = {
							pageSize: 10,
							pageIndex: 1
						}
					}
					angular.extend(this.programInfo, $scope.uploadData);
					var url = mtsapis.projectUpload.api;
					//上传组件
					var zipUploader = this.getNVFileInstance({
						url: url, 
						formData: [{site_id:this.programInfo.site_id},{project_id:this.programInfo.project_id},{ftp_user_name: $rootScope.traverseLoge.ftpInfo.ftp_user}],
						errorFn: function() {
							$scope.clicked = false;
							//alert('上传过程中发生错误, 请稍后重试');
						},
						beforeFn: function(item) {
							$scope.clicked = true;
							item.mtsProgress = 0;
							item.mtsUploadStatus = '正在上传';
							$scope.mtsUploadDot = true;
						},
						afterFn: function(item) {
							item.mtsUploadStatus = '上传成功!';
							item.mtsProgress = 100;
							$scope.mtsUploadDot = false;
							$scope.clicked = false;
							$scope.codeLoge.packageUpload.uploaded = true;
							if(document.uploadForm) document.uploadForm.reset();
						},
						progressFn: function(item, progress) {
							if(progress >= 95) {
								item.mtsProgress = 99;
								item.mtsUploadStatus = '正在解压';
								return;
							}
							item.mtsProgress = progress;
						},
						filterFailFn: function(paramObj) {
							messageConfig.offer(paramObj);
						}
					}
					);
					$scope.zipUploader = zipUploader;
				},
				close: function() {
					$rootScope.windowUtil.close();
					if(this.packageUpload.uploaded == true) $scope.programDetailLoge.getHtmlFileList(true);
				},
				/*doRemoveFile: function(removingItem) {
					//按照文件名字进行匹配然后移除,这里这么做只是为了以后需要上传多个文件
					angular.forEach($scope.zipUploader.queue, function(item, index) {
						if(removingItem.file.name == item.file.name) {
							var tmp = $scope.zipUploader.queue.splice(index, index);
							$scope.zipUploader.queue = tmp;
							return;
						}
					});
				},*/
				switchTabTo: function(tabName) {
					switch(tabName) {
						case 'upload':
							$scope.ifUploadTab = true;
							break;
						case 'log':
							$scope.ifUploadTab = false;
							//查询一下上传代码
							this.qryUploadLog();
							break;
						default:
							$scope.ifUploadTab = true;
							break;
					};
				},
				qryUploadLog: function() {
					var $this = this;
					var param = {
						project_id: this.programInfo.project_id,
						page_num: $scope.pagination.pageIndex,
						page_size: $scope.pagination.pageSize
					};
					serverHostProfileService.qryUploadLog(param, function(result) {
						if(result.error_response) {
							return;
						}
						$this.programInfo.uploadLog = result.projectzips.projectzip;
						$this.programInfo.uploadTotal = result.total;
					});
				},
				getNVFileInstance: function(options) {
					var url = options.url, 
						formDataArr = options.formData, 
						uploadErrorFn = options.errorFn, 
						filterErrorFn = options.filterFailFn,
						beforeFn = options.beforeFn,
						afterFn = options.afterFn,
						progressFn = options.progressFn;
					var $this = this;
					if(!formDataArr) formDataArr = [];
					if(!uploadErrorFn) uploadErrorFn = function(){};
					if(!filterErrorFn) filterErrorFn = function(){};
					if(!beforeFn) beforeFn = function(){};
					if(!afterFn) afterFn = function(){};
					if(!progressFn) progressFn = function(){};
					var tmpUploader = {};
					tmpUploader = new FileUploader({
						autoUpload: false,
						withCredentials: true,
						formData: formDataArr,
						url: url,
						onAfterAddingFile: function(item) {
							//item.mtsProgress = 0;
							//为了强化只能选择一个文件的需求
							tmpUploader.queue = [item];
							//开始上传,但并未上传完成
							//$this.packageUpload.done = false;
							//$this.clicked = true;
							//item.formData.push({ftpUserName: $this.codeProfile.ftp_user});
							//item.formData.push({siteId: $this.codeProfile.onSelectSite});
							//item.formData.push({projectId: $this.codeProfile.onSelectProgram});
							item.onSuccess = function(response, status, headers) {
								afterFn(item, response, status);
								//item.mtsProgress = 100;
								//$this.clicked = false;
								var tmp = {type: 'danger', msg: '网络繁忙，请稍后重新上传！'};
								if(response && response.code == 0) {
									//上传完成
									//$this.packageUpload.done = true;
									tmp = {type: 'success', msg: '上传完成！'};
									document.uploadForm.reset();
								} else {
									//上传出现异常,状态变为从未上传过
									//$this.packageUpload.reset();
									tmp = {type: 'danger', msg: response.msg};
								}
								//zipUploader.clearQueue();
								//messageConfig.offer(tmp);
							};
							item.onProgress = function(progress) {
								progressFn(item, progress);
								//item.mtsProgress = progress;
								//$this.codeProfile.onUploadProgress = progress;
							};
							item.onCancel = function(response, status, headers) {
								tmpUploader.clearQueue();
								//$this.packageUpload.reset();
								//messageConfig.offer({type: 'danger', msg: '上传压缩包过程中发生异常，上传失败。'});
							};
							item.onError = function() {
								tmpUploader.clearQueue();
								uploadErrorFn();
								//$this.packageUpload.reset();
								//$this.clicked = false;
								//messageConfig.offer({type: 'danger', msg: '上传压缩包失败，请稍后重试。'});
							};
							item.startUpload = function() {
								beforeFn(item);
								item.upload();
							};
							return;
						},
						filters: [{
							name: 'suffixFilter',
							fn: function(item, options) {
								//只能上传一.zip和.rar结尾的压缩包
								var suffixReg = /((.zip)|(.rar))$/;
								if (suffixReg.test(item.name)) {
									return true;
								} else {
									filterErrorFn({filterName:'suffixFilter', type: 'danger', msg: '您选择的是非zip包,请重新确认。'});
									return false;
								}
							}
						}, {
							name: 'sizeFilter',
							fn: function(item, options) {
								if(item.size > 20 * 1000 * 1000) {
									tmpUploader.forbidToUpload = true;
									filterErrorFn({filterName:'sizeFilter', type: 'danger', msg: '压缩包文件超过20M，请使用FTP工具进行代码上传'});
									return true;
								}
								tmpUploader.forbidToUpload = false;
								return true;
							}
						}]
					});
					return tmpUploader;
				}
			};
			$scope.ifUploadTag = false;
		}
	]);

});