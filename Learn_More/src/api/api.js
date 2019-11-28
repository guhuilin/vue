import {getAction, deleteAction, putAction, putAction1, postAction} from '@/api/manage'

//角色管理
const addRole = (params) => postAction("/nmmonitor-server/role/addRole", params);
const editRole = (params) => putAction("/nmmonitor-server/role/editRole", params);
const queryall = (params) => getAction("/nmmonitor-server/role/queryAll", params);

//用户管理
const addUser = (params) => postAction("/nmmonitor-server/user/addUser", params);
const editUser = (params) => putAction("/nmmonitor-server/user/editUser", params);
const queryUserRole = (params) => getAction("/nmmonitor-server/role/queryRoleInfoByUserId", params);
const getAllDeportmentInfo = (params) => getAction("/nmmonitor-server/department/getAllDeportmentInfo", params);

//验证用户账号是否唯一
const checkUsername = (params) => getAction("/nmmonitor-server/user/checkUserExists", params);
//改变密码
const changPassword = (params) => putAction("/nmmonitor-server/user/changPassword", params);

const getProgramCategroyInfoListOld = (params) => getAction("/nmmonitor-server/program/getProgramCategroyInfoList", params);
//内容汇聚
// const getProgramTypeList = (params) => getAction('/nmmonitor-server-moduls-elasticsearch/elasticsearch/getProgramTypeList',params);
// const getProgramTypeList = (params) => getAction('/nmmonitor-server-moduls-elasticsearch/elasticsearch/getProgramTypeList',params);
// const getProgramTypeList = (params) => getAction('/nmmonitor-server-moduls-elasticsearch/elasticsearch/getProgramTypeList',params);
const queryAllCont = (params) => getAction('/nmmonitor-server-moduls-elasticsearch/elasticsearch/queryAll',params);
const queryCrawl = (params) => getAction('/nmmonitor-server-moduls-elasticsearch/elasticsearch/queryCrawl',params);

const getProgramTypeList = (params) => getAction('/nmmonitor-server-moduls-elasticsearch/elasticsearch/getProgramTypeList',params);
const getProgramInfoList = (params) => getAction('/nmmonitor-server-moduls-elasticsearch/elasticsearch/getProgramInfoList',params);
const getProgramTypeHitShow = (params) => getAction('/nmmonitor-server-moduls-elasticsearch/elasticsearch/getProgramTypeHitShow',params);
const getProgramTypeHotword = (params) => getAction('/nmmonitor-server-moduls-elasticsearch/elasticsearch/getProgramTypeHotword',params);
const getProgramTypeHotwordTokeyword = (params) => getAction('/nmmonitor-server-moduls-elasticsearch/elasticsearch/getProgramTypeHotwordTokeyword',params);

const getNewsHotKeywordList = (params) => getAction("/nmmonitor-server/news/getNewsHotKeywordList", params);
const getNewsHotSearchList = (params) => getAction("/nmmonitor-server/news/getNewsHotSearchList", params);

//内容监测
const getProgramCategroyInfoList = (params) => getAction("/nmmonitor-server-keyword/keyWord/tree", params);
const editKeyWord = (params) => putAction1("/nmmonitor-server-keyword/keyWord/editKeyWord", params);
const addKeyWord = (params) => postAction("/nmmonitor-server-keyword/keyWord/addKeyWord", params);
const domainAndBusiness = (params) => getAction("/nmmonitor-server-keyword/keyWord/domainAndBusiness", params);
const useOrNot = (params) => putAction1("/nmmonitor-server-keyword/keyWord/useOrNot", params);
const treeData = (params) => getAction("/nmmonitor-server-keyword/keyWord/treeData", params);
const deleteData = (params) => deleteAction("/nmmonitor-server-keyword/keyWord/deleteData", params);
const findDetailData = (params) => getAction("/nmmonitor-server-keyword/keyWord/findDetailData", params);
const getImageWebSiteInfoList = (params) => getAction("/nmmonitor-server/program/getImageWebSiteInfoList", params);
const getSiteInfoList = (params) => getAction("/nmmonitor-server/program/getSiteInfoList", params);
const getViolateImageInfoList = (params) => getAction("/nmmonitor-server/program/getViolateImageInfoList", params);
const getViolateImageResultJson = (params) => getAction("/nmmonitor-server/program/getViolateImageResultJson", params);
const getViolateVideoInfoList = (params) => getAction("/nmmonitor-server/program/getViolateVideoInfoList", params);
const getVideoTaskId = (params) => getAction("/nmmonitor-server/program/getVideoTaskId", params);
const getVideoViolateResult = (params) => getAction("/nmmonitor-server/program/getVideoViolateResult", params);

//权限管理
const addPermission = (params) => postAction("/nmmonitor-server/menu/addMenuInfo", params);
const editPermission = (params) => putAction("/nmmonitor-server/menu/editMenuInfo", params);
const getPermissionList = (params) => getAction("/nmmonitor-server/menu/list", params);
const queryTreeList = (params) => getAction("/nmmonitor-server/menu/menuList", params);
const queryTreeListForRole = (params) => getAction("/nmmonitor-server/menu/menuList", params);
const queryRolePermission = (params) => getAction("/nmmonitor-server/menu/queryMenuInfoListByRoleId", params);
const saveRolePermission = (params) => postAction("/nmmonitor-server/menu/saveRolePermission", params);
const queryPermissionsByUser = (params) => getAction("/nmmonitor-server/menu/getUserPermissionByToken", params);

// 部门管理
const queryDepartTreeList = (params) => getAction("/nmmonitor-server/department/queryDepartInfoTreeList", params);
const queryIdTree = (params) => getAction("/nmmonitor-server/department/queryDepartIdTree", params);
const searchByKeywords = (params) => getAction("/nmmonitor-server/department/searchBy", params);
const deleteByDepartId = (params) => deleteAction("/nmmonitor-server/department/delDepartInfoById", params);

//业务配置
const addActInstType = (params) => postAction("/nmmonitor-server-report/actinsttype/addActInstType", params);
const updateActInstType = (params) => postAction("/nmmonitor-server-report/actinsttype/updateActInstType", params);
const queryActInstTypeList = (params) => getAction("/nmmonitor-server-report/actinsttype/queryActInstTypeList", params);
const delectActInstType = (params) => deleteAction("/nmmonitor-server-report/actinsttype/delectActInstType", params);
const addReportBusinessInfo = (params) => postAction("/nmmonitor-server-report/report/addReportBusinessInfo", params);
const editReportBusinessInfo = (params) => postAction("/nmmonitor-server-report/report/editReportBusinessInfo", params);
const addReportDomainInfo = (params) => postAction("/nmmonitor-server-report/report/addReportDomainInfo", params);
const editReportDomainInfo = (params) => postAction("/nmmonitor-server-report/report/editReportDomainInfo", params);
const addReportTypeInfo = (params) => postAction("/nmmonitor-server-report/report/addReportTypeInfo", params);
const editReportTypeInfo = (params) => postAction("/nmmonitor-server-report/report/editReportTypeInfo", params);
const getAllReportDomainInfoList = (params) => getAction("/nmmonitor-server-report/report/getAllReportDomainInfoList", params);
const getAllReportBusinessInfoList = (params) => getAction("/nmmonitor-server-report/report/getAllReportBusinessInfoList", params);
const getAllReportTypeInfoList = (params) => getAction("/nmmonitor-server-report/report/getAllReportTypeInfoList", params);
const queryFieldTypeList = (params) => getAction("/nmmonitor-server-report/report/queryFieldTypeList", params);
const queryReportTableInfoList = (params) => getAction("/nmmonitor-server-report/report/queryReportTableInfoList", params);
const getReportTemplateId = (params) => getAction("/nmmonitor-server-report/report/getReportTemplateId", params);
const getTableDesId = (params) => getAction("/nmmonitor-server-report/report/getTableDesId", params);
const getFieldTypeIdList = (params) => getAction("/nmmonitor-server-report/report/getFieldTypeIdList", params);
const getReportAppendixIdAndTableId = (params) => getAction("/nmmonitor-server-report/report/getReportAppendixIdAndTableId", params);
const getReportAppendixId = (params) => getAction("/nmmonitor-server-report/report/getReportAppendixId", params);
const getReportAppendixIdList = (params) => getAction("/nmmonitor-server-report/report/getReportAppendixIdList", params);
const isExistsReportTemplateName = (params) => getAction("/nmmonitor-server-report/report/isExistsReportTemplateName", params);
const isExistsTableCode = (params) => getAction("/nmmonitor-server-report/report/isExistsTableCode", params);
const addReportTemplateInfo = (params) => postAction("/nmmonitor-server-report/report/addReportTemplateInfo", params);
const delReportTemplate = (params) => deleteAction("/nmmonitor-server-report/report/delReportTemplate", params);
const queryReportTableShowInfo = (params) => getAction("/nmmonitor-server-report/report/queryReportTableShowInfo", params);
const bulkDelFieldInfo = (params) => postAction("/nmmonitor-server-report/report/bulkDelFieldInfo", params);
const bulkAddTableAndFieldRelationShip = (params) => postAction("/nmmonitor-server-report/report/bulkAddTableAndFieldRelationShip", params);
const modifyReportTemplateInfo = (params) => postAction("/nmmonitor-server-report/report/modifyReportTemplateInfo", params);
const updateAppendixTypeInfo = (params) => postAction("/nmmonitor-server-report/report/updateAppendixTypeInfo", params);
const addAppendixTypeInfo = (params) => postAction("/nmmonitor-server-report/report/addAppendixTypeInfo", params);
const saveReportTemplateInfo = (params) => postAction("/nmmonitor-server-report/report/saveReportTemplateInfo", params);
const saveModifyReportTemplateInfo = (params) => postAction("/nmmonitor-server-report/report/saveModifyReportTemplateInfo", params);

// 监听监看管理页面中的接口
// 查询报告列表信息
const queryReportList = (params) => getAction("/nmmonitor-server-moduls-monitor/monitor/queryReportList", params);
// 下拉框查询报告类型
const queryReportTypeSelectList = (params) => getAction("/nmmonitor-server-moduls-monitor/monitor/queryReportTypeSelectList", params);
// 下拉框查询报告业务
const queryReportBusinessSelectList = (params) => getAction("/nmmonitor-server-moduls-monitor/monitor/queryReportBusinessSelectList", params);
// 下拉框查询报告所属领域
const queryReportDomainSelectList = (params) => getAction("/nmmonitor-server-moduls-monitor/monitor/queryReportDomainSelectList", params);
// 
const querySuspectVideoList = (params) => getAction("/nmmonitor-server-moduls-monitor/monitor/querySuspectVideoList", params);
// const queryReportTableInfoList = (params)=>getAction("/nmmonitor-server-moduls-monitor/feign/queryReportTableInfoList",params);
// 添加报告信息
const addReportInfo = (params) => postAction("/nmmonitor-server-moduls-monitor/monitor/addReportInfo", params);
const queryReportTableShowInfomoban = (params) => getAction("/nmmonitor-server-moduls-monitor/feign/queryReportTableShowInfo", params);
// 疑似违规数据列表附件搜索的接口
const queryReportTableInfoListtype = (params) => getAction("/nmmonitor-server-moduls-monitor/feign/queryReportTableInfoListtype", params);
// 手动处理（附件中的）
const addNmmDomain = (params) => postAction("/nmmonitor-server-moduls-monitor/monitor/addNmmDomain", params);
// 点击编辑的接口
const queryFindUpReport = (params) => getAction("/nmmonitor-server-moduls-monitor/monitor/queryFindUpReport", params);
// 点击编辑后修改的接口
const updateReportInfo = (params) => postAction("nmmonitor-server-moduls-monitor/monitor/updateReportInfo", params);
const querySuspectVideoHarmTypeList = (params) => getAction("/nmmonitor-server-moduls-monitor/monitor/querySuspectVideoHarmTypeList", params);
// 附件表头
// /monitor/queryFieldTypeListvoe
const queryFieldTypeListvoe = (params) => getAction("/nmmonitor-server-moduls-monitor/monitor/queryFieldTypeListvoe", params);
// 管理首页的接口
const findReportInfo = (params) => getAction("/nmmonitor-server-moduls-monitor/monitor/findReportInfo", params);
// 研判区资料库
const queryDbMateLrial = (params) => getAction("/nmmonitor-server-moduls-monitor/monitor/queryDbMateLrial", params);
// 附件tab
const queryReportAppendTypeModel = (params) => getAction("/nmmonitor-server-moduls-monitor/monitor/queryReportAppendTypeModel", params);

const query = (params) => getAction("/nmmonitor-server-moduls-monitor/monitor/queryTitle", params);
// 附件信息的接口
const exceSelectByMap = (params) => postAction("/nmmonitor-server-moduls-monitor/feign/exceSelectByMap", params);
// 获取在线用户的接口
const getCurrentLoginUserList = (params) => getAction("/nmmonitor-server/sys/getCurrentLoginUserList", params);
// 删除报告的接口
const deleteReport = (params) => deleteAction("nmmonitor-server-moduls-monitor/report/deleteReport", params);
// 附件中添加纪录的接口
const execInsertSql = (params) => postAction("nmmonitor-server-moduls-monitor/feign/execInsertSql", params);
//视频上传的接口
const fastDFSUpload = (params) => postAction("/nmmonitor-server-moduls-monitor/fastDFSUpload", params);
// 附件：通过tab的ID得到附件的code
const queryReportAppendTypeModelBean = (params) => getAction("/nmmonitor-server-moduls-monitor/monitor/queryReportAppendTypeModelBean", params);
// 电视厂家的接口
const queryTvManufacturers = (params) => getAction("/nmmonitor-server-moduls-monitor/monitor/queryTvManufacturers", params);
// 信号
const queryTvSignalName = (params) => getAction("/nmmonitor-server-moduls-monitor/monitor/queryTvSignalName", params);
// 点击网络电视弹出层选择厂家和信号后，点击确定按钮的事件
const addTvmanufacturersModel = (params) => postAction("/nmmonitor-server-moduls-monitor/monitor/addTvmanufacturersModel", params);
// 删除附件
const execDeleteSql = (params) => postAction("/nmmonitor-server-moduls-monitor/feign/execDeleteSql", params);
//点击附件中的编辑 请求的接口
const execSelectOne = (params) => postAction("/nmmonitor-server-moduls-monitor/feign/execSelectOne", params);
// 修改附件
const execUpdateSql = (params) => postAction("/nmmonitor-server-moduls-monitor/feign/execUpdateSql", params);
// 附件中获取搜索功能的接口（要搜索的的内容都是后台返回过来的）
const queryReportFieldModel = (params) => getAction("/nmmonitor-server-moduls-monitor/monitor/queryReportFieldModel", params);
// 查询工作流的
const inquireQueryDeployedProcessInfoList = (params) => getAction("/nmmonitor-server-moduls-monitor/feign/queryDeployedProcessInfoList", params);
// 获取ID
const getCustomTableSeqValBySeqName = (params) => getAction("/nmmonitor-server-moduls-monitor/feign/getCustomTableSeqValBySeqName", params);
// 节目的表头
const queryFieldtypeModelBean = (params) => getAction("/nmmonitor-server-moduls-monitor/monitor/queryFieldtypeModelBean", params);
// 节目的code
const queryReportAppendTypeModeljie = (params) => getAction("/nmmonitor-server-moduls-monitor/monitor/queryReportAppendTypeModeljie", params);
// 节目中表格的数据（list）
const exceSelectByMapjie = (params)=>postAction("/nmmonitor-server-moduls-monitor/feign/exceSelectByMapjie",params);
// 获取报告的ID
const selectReportInstanceSeqID = (params)=>getAction("/nmmonitor-server-moduls-monitor/monitor/selectReportInstanceSeq",params);
// 疑似违规数据的列表(弹出层中的表格里面的数据)
const querySuspectVideoListTab = (params)=>getAction("/nmmonitor-server-moduls-monitor/monitor/querySuspectVideoList",params);
//节目的搜索
const queryReportFieldModeljie = (params)=>getAction("/nmmonitor-server-moduls-monitor/monitor/queryReportFieldModeljie",params);
// 疑似违规数据列表（当用户选择加入到节目里面的时候，疑似违规数据列表里面的数据就不会再次返回了）
const updateSuSpectVideoList = (params)=>postAction("/nmmonitor-server-moduls-monitor/monitor/updateSuSpectVideoList",params);

// const exceSelectByMapjie = (params) => postAction("/nmmonitor-server-moduls-monitor/feign/exceSelectByMapjie", params);

const queryDbAppSoftList = (params)=>getAction("/nmmonitor-server-module-database/datebase/queryDbAppSoftList",params);
//提交
const claimAndCompleteTaskToUserNameByProInstId = (params)=>postAction("/nmmonitor-server-moduls-monitor/monitor/claimAndCompleteTaskToUserNameByProInstId",params);
// 投票
const addJudgeVote = (params)=>postAction("/nmmonitor-server-moduls-monitor/monitor/addJudgeVote",params);


// 应急搜索
const queryEmergencySearchInfoList = (params)=>getAction("/nmmonitor-server-report/emergencysearch/queryEmergencySearchInfoList",params);
const yjSearchEngine = (params)=>getAction("/nmmonitor-server-report/emergencysearch/yjSearchEngine",params);
const yjSearchLocal = (params)=>getAction("/nmmonitor-server-report/emergencysearch/yjSearchLocal",params);
const yjSearchSite = (params)=>getAction("/nmmonitor-server-report/emergencysearch/yjSearchSite",params);
const addEmergencySearch = (params)=>postAction("/nmmonitor-server-report/emergencysearch/addEmergencySearch",params);
const delectEmergencySearch = (params)=>deleteAction("/nmmonitor-server-report/emergencysearch/delectEmergencySearch",params);
const querynormalSettings = (params)=>getAction("/nmmonitor-server-report/emergencysearch/querynormalSettings",params);
const queryEmergencySearchResultInfoList = (params)=>getAction("/nmmonitor-server-report/emergencysearch/queryEmergencySearchResultInfoList",params);
const queryEmergencyTask = (params)=>getAction("/nmmonitor-server-report/emergencyTask/queryEmergencyTask",params);
const normalSettings = (params)=>postAction("/nmmonitor-server-report/emergencysearch/normalSettings",params);
// /emergencyTask/endTask
const endTask = (params)=>getAction("/nmmonitor-server-report/emergencyTask/endTask",params);


//报告规划
const queryStationsList = (params) => getAction("/nmmonitor-server-moduls-monitor/report/queryStationsList", params);
const selectReportInstanceSeq = (params) => getAction("/nmmonitor-server-moduls-monitor/report/selectReportInstanceSeq", params);
const addReportIssued = (params) => postAction("/nmmonitor-server-moduls-monitor/report/addReportIssued", params);

// 任务调度
const queryTaskInfoList = (params) => getAction("/nmmonitor-server-module-taskScheduling/taskSchedulingV2/queryTaskInfoList", params);
const getTaskVariableByMap = (params) => postAction("/nmmonitor-server-module-taskScheduling/taskSchedulingV2/getTaskVariableByMap", params);
const getJudgedUserInfoListByJudgedLevel = (params) => getAction("/nmmonitor-server-module-taskScheduling/taskSchedulingV2/getJudgedUserInfoListByJudgedLevel", params);
const addTaskInfo = (params) => putAction("/nmmonitor-server-module-taskScheduling/taskSchedulingV2/addTaskInfo", params);
const addJudgedInfoToTask = (params) => putAction("/nmmonitor-server-module-taskScheduling/taskSchedulingV2/addJudgedInfoToTask", params);
const relatedReport = (params) => putAction("/nmmonitor-server-module-taskScheduling/taskSchedulingV2/relatedReport", params);
const claimTask2 = (params) => putAction1("/nmmonitor-server-module-taskScheduling/taskSchedulingV2/claimTask", params);
const claimAndCompleteTask = (params) => putAction("/nmmonitor-server-module-taskScheduling/taskSchedulingV2/claimAndCompleteTask", params);
const modifyTaskRunningStatus = (params) => putAction1("/nmmonitor-server-module-taskScheduling/taskSchedulingV2/modifyTaskRunningStatus", params);
const updateTaskInfo = (params) => postAction("/nmmonitor-server-module-taskScheduling/taskSchedulingV2/updateTaskInfo", params);
const deleteTaskInfo = (params) => deleteAction("/nmmonitor-server-module-taskScheduling/taskSchedulingV2/deleteTaskInfo", params);
const getStationInfoList = (params) => getAction("/nmmonitor-server-module-taskScheduling/taskScheduling/getStationInfoList", params);
const getTaskModeInfoList = (params) => getAction("/nmmonitor-server-module-taskScheduling/taskSchedulingV2/getTaskModeInfoList", params);
const getActInstTypeInfoList = (params) => getAction("/nmmonitor-server-module-taskScheduling/taskSchedulingV2/getActInstTypeInfoList", params);
const getTaskInstanceInfoList = (params) => getAction("/nmmonitor-server-module-taskScheduling/taskSchedulingV2/getTaskInstanceInfoList", params);
// const addTaskInfo = (params) => postAction("/nmmonitor-server-module-taskScheduling/taskScheduling/addTaskInfo", params);
// const updateTaskInfo = (params) => postAction("/nmmonitor-server-module-taskScheduling/taskScheduling/updateTaskInfo", params);
const getTaskInstanceAndStationInfoList = (params) => getAction("/nmmonitor-server-module-taskScheduling/taskSchedulingV2/getTaskInstanceAndStationInfoList", params);
const instanceTask = (params) => postAction("/nmmonitor-server-module-taskScheduling/taskSchedulingV2/instanceTask", params);
const getImageJsonByProcessInstanceId = (params) => getAction("/nmmonitor-server-module-taskScheduling/taskScheduling/getImageJsonByProcessInstanceId", params);
const getImageJsonByProcessInstanceId2 = (params) => getAction("/nmmonitor-server-module-taskScheduling/taskSchedulingV2/getImageJsonByProcessInstanceId", params);
const getTableInfoList = (params) => getAction("/nmmonitor-server-module-taskScheduling/taskScheduling/getTableInfoList", params);
const getTaskMessageStatistics = (params) => getAction("/nmmonitor-server-module-taskScheduling/taskScheduling/getTaskMessageStatistics", params);
const getTaskMessageStatistics2 = (params) => getAction("/nmmonitor-server-module-taskScheduling/taskSchedulingV2/getTaskMessageStatistics", params);
const addReportInstanceInfo = (params) => postAction("/nmmonitor-server-module-taskScheduling/taskScheduling/addReportInstanceInfo", params);
const getTableDataList = (params) => postAction("/nmmonitor-server-module-taskScheduling/taskScheduling/getTableDataList", params);
const suspendProcessInstanceByKey = (params) => postAction("/nmmonitor-server-module-taskScheduling/taskScheduling/suspendProcessInstanceByKey", params);
const activateProcessInstanceByKey = (params) => postAction("/nmmonitor-server-module-taskScheduling/taskScheduling/activateProcessInstanceByKey", params);
const addTaskUrgentRecordInfo = (params) => postAction("/nmmonitor-server-module-taskScheduling/taskScheduling/addTaskUrgentRecordInfo", params);
const getNoHighLightImageByteDataByProcessDefinitionKey = (params) => getAction("/nmmonitor-server-module-taskScheduling/taskScheduling/getNoHighLightImageByteDataByProcessDefinitionKey", params);
const getTaskUrgentRecordInfoByCurrentUser = (params) => getAction("/nmmonitor-server-module-taskScheduling/taskScheduling/getTaskUrgentRecordInfoByCurrentUser", params);
const getTaskInfoByTaskId = (params) => getAction("/nmmonitor-server-module-taskScheduling/taskScheduling/getTaskInfoByTaskId", params);//通过id获取任务信息
const getUserNameList = (params) => getAction("/nmmonitor-server-module-taskScheduling/taskScheduling/getUserNameList", params);//获取所有用户
const claimTask = (params) => getAction("/nmmonitor-server-module-taskScheduling/taskScheduling/claimTask", params);//认领任务
const assignTaskToUser = (params) => getAction("/nmmonitor-server-module-taskScheduling/taskScheduling/assignTaskToUser", params);//指派任务
const getImageJsonByProcessDefinitionKey = (params) => getAction("/nmmonitor-server-module-taskScheduling/taskScheduling/getImageJsonByProcessDefinitionKey", params);//获取任务工作流图片

//数据库管理
const queryDbHotTwoMicroRankList = (params) => getAction("/nmmonitor-server-module-database/datebase/queryDbHotTwoMicroRankList", params);//获取两微一端节目排行榜
const addDbAppSoft = (params) => postAction("/nmmonitor-server-module-database/datebase/addDbAppSoft", params);//添加app信息
const updateDbAppSoft = (params) => postAction("/nmmonitor-server-module-database/datebase/updateDbAppSoft", params);//修改app信息
const addDbAvspBean = (params) => postAction("/nmmonitor-server-module-database/datebase/addDbAvspBean", params);//新增avsp信息
const updateDbAvspBean = (params) => postAction("/nmmonitor-server-module-database/datebase/updateDbAvspBean", params);//修改avsp信息
const addDbHarmVideoBean = (params) => postAction("/nmmonitor-server-module-database/datebase/addDbHarmVideoBean", params);//新增违规节目信息
const updateDbHarmVideoBean = (params) => postAction("/nmmonitor-server-module-database/datebase/updateDbHarmVideoBean", params);//修改违规节目信息
const addDbWebstieOrgan = (params) => postAction("/nmmonitor-server-module-database/datebase/addDbWebstieOrgan", params);//新增网站机构信息
const updateDbWebstieOrgan = (params) => postAction("/nmmonitor-server-module-database/datebase/updateDbWebstieOrgan", params);//修改网站机构信息
const queryDbHotVideoRankList = (params) => getAction("/nmmonitor-server-module-database/datebase/queryDbHotVideoRankList", params);//查询热点视听排行信息
const addDbott = (params) => postAction("/nmmonitor-server-module-database/datebase/addDbott", params);//新增电视终端设备信息
const updateDbott = (params) => postAction("/nmmonitor-server-module-database/datebase/updateDbott", params);//修改电视终端设备信息
const addDbIptvNetProgram = (params) => postAction("/nmmonitor-server-module-database/datebase/addDbIptvNetProgram", params);//新增电视平台节目信息
const updateDbIptvNetProgram = (params) => postAction("/nmmonitor-server-module-database/datebase/updateDbIptvNetProgram", params);//修改电视平台节目信息
const addDbAbroadNetProgram = (params) => postAction("/nmmonitor-server-module-database/datebase/addDbAbroadNetProgram", params);//新增境外剧引进信息
const updateDbAbroadNetProgram = (params) => postAction("/nmmonitor-server-module-database/datebase/updateDbAbroadNetProgram", params);//修改境外剧引进信息
const addReportInstancetwo = (params) => postAction("/nmmonitor-server-module-database/datebase/addReportInstancetwo", params);//新增境外剧引进信息
const updateReportInstancetwo = (params) => postAction("/nmmonitor-server-module-database/datebase/updateReportInstancetwo", params);//修改境外剧引进信息
const addEvidenceVideotwo = (params) => postAction("/nmmonitor-server-module-database/datebase/addEvidenceVideotwo", params);//新增取证视频信息
const updateEvidenceVideotwo = (params) => postAction("/nmmonitor-server-module-database/datebase/updateEvidenceVideotwo", params);//修改取证视频信息

// 添加自定义任务工作流流程定义
const addCustomActProcInst = (params) => putAction("/nmmonitor-server-activiti/activiti/addCustomActProcInst", params);
// 查询自定义任务工作流流程定义信息列表
const getCustomActProcInstInfoList = (params) => getAction("/nmmonitor-server-activiti/activiti/getCustomActProcInstInfoList", params);
// 修改自定义工作流流程定义
const updateCustomActProcInstInfo = (params) => putAction("/nmmonitor-server-activiti/activiti/updateCustomActProcInstInfo", params);
// 删除自定义工作流流程定义
const deleteCustomActProcInstInfo = (params) => getAction("/nmmonitor-server-activiti/activiti/deleteCustomActProcInstInfo", params);
// 工作流定制
const queryDeployedProcessInfoList = (params) => getAction("/nmmonitor-server-activiti/activiti/queryDeployedProcessInfoList", params);
// 创建工作流
const createBpnmModel = (params) => postAction("/nmmonitor-server-activiti/activiti/createBpnmModel", params);
// 根据key删除工作流
const deleteProcessDefinitionByKey = (params) => deleteAction("/nmmonitor-server-activiti/activiti/deleteProcessDefinitionByKey", params);
// 查询角色信息列表
const getRoleInfoList = (params) => getAction("/nmmonitor-server-activiti/activiti/getRoleInfoList", params);
// 修改activiti工作流中流程图
const updateBpnmModel = (params) => postAction("/nmmonitor-server-activiti/activiti/updateBpnmModel", params);
// 查询系统监控列表
const querySystemMonitorList = (params) => getAction("/nmmonitor-server-moduls-monitor/monitor/querySystemMonitorList", params);

// 系统配置
const querySubSystem = (params) => getAction("/nmmonitor-server-module-database/datebase/querySubSystem", params);
const querySystemConfig = (params) => getAction("/nmmonitor-server-module-database/datebase/querySystemConfig", params);
const addSubSystem = (params) => postAction("/nmmonitor-server-module-database/datebase/addSubSystem", params);
const addSystemConfig = (params) => postAction("/nmmonitor-server-module-database/datebase/addSystemConfig", params);
const updateSystemConfig = (params) => postAction("/nmmonitor-server-module-database/datebase/updateSystemConfig", params);
const deleteSystemConfig = (params) => deleteAction("/nmmonitor-server-module-database/datebase/deleteSystemConfig", params);
const getAITaskInfoList = (params) => getAction("/nmmonitor-server-module-database/AIConfigController/getAITaskInfoList", params);
const addAIConfigInfo = (params) => putAction("/nmmonitor-server-module-database/AIConfigController/addAIConfigInfo", params);
const updateAIConfigInfo = (params) => putAction("/nmmonitor-server-module-database/AIConfigController/updateAIConfigInfo", params);

// 获取字段类型定义组件信息列表
const getFieldComponentList = (params) => getAction("/nmmonitor-server/componentToolController/getFieldComponentList", params);
// 根据字段ID获取字段类型定义组件信息
const getFieldComponentById = (params) => getAction("/nmmonitor-server/componentToolController/getFieldComponentById", params);
// 根据字段ID（多个用逗号分隔）获取字段类型定义组件信息
const getFieldComponentByIds = (params) => getAction("/nmmonitor-server/componentToolController/getFieldComponentByIds", params);

// 新增分层研判
const addNmDomain = (params) => postAction("/nmmonitor-server-module-Judgements/Judgements/addNmmDomain", params);
// 分层研判查询
const queryTask = (params) => getAction("/nmmonitor-server-module-Judgements/Judgements/queryTask", params);
const queryReporttypeBean = (params) => getAction("/nmmonitor-server-module-Judgements/Judgements/queryReporttypeBean", params);
const queryReportbusinessBean = (params) => getAction("/nmmonitor-server-module-Judgements/Judgements/queryReportbusinessBean", params);
const queryReportdomainBean = (params) => getAction("/nmmonitor-server-module-Judgements/Judgements/queryReportdomainBean", params);
const queryReportInstanceBean = (params) => getAction("/nmmonitor-server-module-Judgements/Judgements/queryReportInstanceBean", params);
const updateSus = (params) => postAction("/nmmonitor-server-module-Judgements/Judgements/updateSus", params);
const exceSelectByMapJudge = (params) => postAction("/nmmonitor-server-module-Judgements/feign/execSelectOne", params);
const queryAuditVideoHis = (params) => getAction("/nmmonitor-server-module-Judgements/Judgements/queryAuditVideoHisonone", params);
const execInsertSqlJudge = (params) => postAction("/nmmonitor-server-module-Judgements/feign/execInsertSql", params);
const FieldTypeList = (params) => getAction("/nmmonitor-server-module-Judgements/Judgements/FieldTypeList", params);
const updateReportBusiness = (params) => postAction("/nmmonitor-server-module-Judgements/Judgements/updateReportBusiness", params);
const addAppendixVideo = (params) => postAction("/nmmonitor-server-module-Judgements/Judgements/addAppendixVideo", params);
const addDbNetProgamone = (params) => postAction("/nmmonitor-server-module-Judgements/Judgements/addDbNetProgamone", params);
const addPorgramVideo = (params) => postAction("/nmmonitor-server-module-Judgements/Judgements/addPorgramVideo", params);
const queryReportData = (params) => getAction("/nmmonitor-server-module-Judgements/Judgements/queryReportData", params);
const queryJudgeList = (params) => getAction("/nmmonitor-server-module-Judgements/Judgements/queryFieldTypeList", params);
const updatequerySuspectProgramzero = (params) => postAction("/nmmonitor-server-module-Judgements/Judgements/updatequerySuspectProgramzero", params);
const ReportDomainSelectList = (params) => getAction("/nmmonitor-server-module-Judgements/feign/queryReportDomainSelectList", params);
const queryMonitorManage = (params) => getAction("/nmmonitor-server-module-Judgements/feign/findReportInfo", params);
const queryClaimTask = (params) => getAction("/nmmonitor-server-module-Judgements/feign/claimTask", params);
const querySuspectProgram = (params) => getAction("/nmmonitor-server-module-Judgements/Judgements/querySuspectProgram", params);
const querySuspectProgramthree = (params) => getAction("/nmmonitor-server-module-Judgements/Judgements/querySuspectProgramthree", params);
const queryPorgramVideozerothree = (params) => getAction("/nmmonitor-server-module-Judgements/Judgements/queryPorgramVideothree", params);
const querySuspectProgramtwo = (params) => getAction("/nmmonitor-server-module-Judgements/Judgements/querySuspectProgramtwo", params);
const queryProgramVideo = (params) => getAction("/nmmonitor-server-module-Judgements/Judgements/queryPorgramVideo", params);
const querySuspectProgramzero = (params) => getAction("/nmmonitor-server-module-Judgements/Judgements/querySuspectProgramzero", params);
// 删除分层研判
const deleteSuspectProgram = (params) => deleteAction("/nmmonitor-server-module-Judgements/Judgements/deleteSuspectProgram", params);
// 查询违规业务
const queryReportBusiness = (params) => getAction("/nmmonitor-server-module-Judgements/Judgements/queryReportBusiness", params);
// 处理分层研判
const updateSuspectProgram = (params) => postAction("/nmmonitor-server-module-Judgements/Judgements/updateSuspectProgram", params);
const addauditVideoHis = (params) => postAction("/nmmonitor-server-module-Judgements/Judgements/addauditVideoHis", params);

// 效果核查
// /programcheck/harmvideo/getPageHarmVideo
const getPageHarmVideo = (params) => getAction("/programcheck/harmvideo/getPageHarmVideo", params);
// programcheck/wzwebsite/getPageWzWebsite
// const getPageHarmVideo = (params) => getAction("/programcheck/harmvideo/getPageHarmVideo", params);
// 自定义区域
// 获取用户的自定义区域
const queryCustomAreaCode = (params) => getAction("/nmmonitor-server-module-Judgements/CustomareatableController/queryCustomAreaCode", params);
//获取用户已经添加了的元素和所有元素
const queryCustomAreaCodeone = (params) => getAction("/nmmonitor-server-module-Judgements/CustomareatableController/queryCustomAreaCodeone", params);
const updateCustomAreaCodeuser = (params) => postAction("/nmmonitor-server-module-Judgements/CustomareatableController/updateCustomAreaCodeuser", params);
const addCustomAreaCodeone = (params) => postAction("/nmmonitor-server-module-Judgements/CustomareatableController/addCustomAreaCodeone", params);
// /CustomareatableController/quertCustomAreaConfig

// 查询可以添加的元素
const quertCustomAreaConfig = (params) => getAction("/nmmonitor-server-module-Judgements/CustomareatableController/quertCustomAreaConfig", params);

// 提交
// nmmonitor-server-module-Judgements/Judgements/updateSuspectProgramevaluation 
const updateSuspectProgramevaluation = (params) => postAction("/nmmonitor-server-module-Judgements/Judgements/updateSuspectProgramevaluation", params);

// xxxxxxx
const queryFieldtypeModelBeanJudge = (params) => getAction("/nmmonitor-server-module-Judgements/Judgements/queryFieldtypeModelBean", params);
const queryReportAppendTypeModeljieJudge = (params) => getAction("/nmmonitor-server-module-Judgements/Judgements/queryReportAppendTypeModeljie", params);

export {
    addRole,
    editRole,
    addUser,
    editUser,
    queryUserRole,
    queryall,
    checkUsername,
    changPassword,
    getPermissionList,
    addPermission,
    editPermission,
    queryTreeList,
    queryRolePermission,
    saveRolePermission,
    queryPermissionsByUser,
    queryDepartTreeList,
    queryIdTree,
    searchByKeywords,
    deleteByDepartId,
    queryTreeListForRole,
    queryAllCont,
    queryCrawl,
    getProgramTypeList,
    getProgramInfoList,
    getProgramTypeHitShow,
    getProgramTypeHotword,
    getProgramTypeHotwordTokeyword,
    getNewsHotKeywordList,
    getNewsHotSearchList,
    getProgramCategroyInfoList,
    editKeyWord,
    addKeyWord,
    domainAndBusiness,
    treeData,
    useOrNot,
    deleteData,
    findDetailData,
    getSiteInfoList,
    getImageWebSiteInfoList,
    getViolateImageInfoList,
    getViolateImageResultJson,
    getViolateVideoInfoList,
    getVideoTaskId,
    getVideoViolateResult,
    addActInstType,
    updateActInstType,
    queryActInstTypeList,
    delectActInstType,
    addReportBusinessInfo,
    editReportBusinessInfo,
    addReportDomainInfo,
    editReportDomainInfo,
    addReportTypeInfo,
    editReportTypeInfo,
    getAllReportDomainInfoList,
    getAllReportBusinessInfoList,
    getAllReportTypeInfoList,
    queryFieldTypeList,
    queryReportTableInfoList,
    getReportTemplateId,
    getTableDesId,
    getFieldTypeIdList,
    getReportAppendixIdAndTableId,
    getReportAppendixId,
    getReportAppendixIdList,
    isExistsReportTemplateName,
    isExistsTableCode,
    addReportTemplateInfo,
    delReportTemplate,
    queryReportTableShowInfo,
    queryReportList,
    bulkDelFieldInfo,
    bulkAddTableAndFieldRelationShip,
    modifyReportTemplateInfo,
    updateAppendixTypeInfo,
    addAppendixTypeInfo,
    saveReportTemplateInfo,
    queryReportTypeSelectList,
    queryReportBusinessSelectList,
    queryReportDomainSelectList,
    queryTask,
    queryReportbusinessBean,
    queryReporttypeBean,
    queryReportdomainBean,
    queryReportInstanceBean,
    updateSus,
    exceSelectByMapJudge,
    queryAuditVideoHis,
    execInsertSqlJudge,
    updatequerySuspectProgramzero,
    queryReportData,
    FieldTypeList,
    addAppendixVideo,
    updateReportBusiness,
    addDbNetProgamone,
    addPorgramVideo,
    queryJudgeList,
    querySuspectVideoList,
    getStationInfoList,
    getTaskModeInfoList,
    getActInstTypeInfoList,
    getTaskInstanceInfoList,
    addTaskInfo,
    addJudgedInfoToTask,
    relatedReport,
    claimTask2,
    claimAndCompleteTask,
    modifyTaskRunningStatus,
    queryTaskInfoList,
    getTaskVariableByMap,
    getJudgedUserInfoListByJudgedLevel,
    deleteTaskInfo,
    updateTaskInfo,
    queryDeployedProcessInfoList,
    addCustomActProcInst,
    getCustomActProcInstInfoList,
    updateCustomActProcInstInfo,
    deleteCustomActProcInstInfo,
    createBpnmModel,
    deleteProcessDefinitionByKey,
    getRoleInfoList,
    updateBpnmModel,
    querySystemMonitorList,
    // queryReportTableInfoList
    addReportInfo,
    queryReportTableShowInfomoban,
    queryReportTableInfoListtype,
    addNmmDomain,
    queryFindUpReport,
    updateReportInfo,
    querySuspectVideoHarmTypeList,
    // queryFieldTypeListTab,
    saveModifyReportTemplateInfo,
    findReportInfo,
    queryDbMateLrial,
    queryReportAppendTypeModel,
    query,
    queryStationsList,
    selectReportInstanceSeq,
    addReportIssued,
    getTaskInstanceAndStationInfoList,
    instanceTask,
    getImageJsonByProcessInstanceId,
    getImageJsonByProcessInstanceId2,
    getTableInfoList,
    getTaskMessageStatistics,
    getTaskMessageStatistics2,
    exceSelectByMap,
    addReportInstanceInfo,
    getTableDataList,
    suspendProcessInstanceByKey,
    activateProcessInstanceByKey,
    addTaskUrgentRecordInfo,
    getNoHighLightImageByteDataByProcessDefinitionKey,
    getTaskUrgentRecordInfoByCurrentUser,
    getCurrentLoginUserList,
    deleteReport,
    execInsertSql,
    fastDFSUpload,
    queryReportAppendTypeModelBean,
    queryTvManufacturers,
    queryTvSignalName,
    addTvmanufacturersModel,
    queryFieldTypeListvoe,
    execDeleteSql,
    execSelectOne,
    execUpdateSql,
    queryReportFieldModel,
    inquireQueryDeployedProcessInfoList,
    getCustomTableSeqValBySeqName,
    getAllDeportmentInfo,
    queryFieldtypeModelBean,
    queryReportAppendTypeModeljie,
    exceSelectByMapjie,
    getTaskInfoByTaskId,
    getUserNameList,
    claimTask,
    assignTaskToUser,
    selectReportInstanceSeqID,
    querySuspectVideoListTab,
    queryReportFieldModeljie,
    updateSuSpectVideoList,
    queryDbAppSoftList,
    claimAndCompleteTaskToUserNameByProInstId,
    queryDbHotTwoMicroRankList,
    addDbAppSoft,
    updateDbAppSoft,
    addDbAvspBean,
    updateDbAvspBean,
    addDbHarmVideoBean,
    updateDbHarmVideoBean,
    addDbWebstieOrgan,
    updateDbWebstieOrgan,
    queryDbHotVideoRankList,
    getImageJsonByProcessDefinitionKey,
    querySubSystem,
    querySystemConfig,
    addSubSystem,
    addSystemConfig,
    updateSystemConfig,
    deleteSystemConfig,
    getAITaskInfoList,
    addAIConfigInfo,
    updateAIConfigInfo,
    addDbott,
    updateDbott,
    addDbIptvNetProgram,
    updateDbIptvNetProgram,
    addDbAbroadNetProgram,
    updateDbAbroadNetProgram,
    addReportInstancetwo,
    updateReportInstancetwo,
    addEvidenceVideotwo,
    updateEvidenceVideotwo,
    getFieldComponentList,
    getFieldComponentById,
    getFieldComponentByIds,
    addNmDomain,
    querySuspectProgram,
    querySuspectProgramtwo,
    queryProgramVideo,
    querySuspectProgramthree,
    queryPorgramVideozerothree,
    queryMonitorManage,
    queryClaimTask,
    addauditVideoHis,
    ReportDomainSelectList,
    deleteSuspectProgram,
    queryReportBusiness,
    updateSuspectProgram,
    querySuspectProgramzero,
    addJudgeVote,
    queryEmergencySearchInfoList,
    yjSearchEngine,
    yjSearchLocal,
    yjSearchSite,
    addEmergencySearch,
    delectEmergencySearch,
    querynormalSettings,
    queryEmergencySearchResultInfoList,
    queryEmergencyTask,
    normalSettings,
    getPageHarmVideo,
    endTask,
    queryCustomAreaCode,
    queryCustomAreaCodeone,
    updateCustomAreaCodeuser,
    addCustomAreaCodeone,
    quertCustomAreaConfig,
    getProgramCategroyInfoListOld,


    // updateCustomAreaCode,
    queryFieldtypeModelBeanJudge,
    queryReportAppendTypeModeljieJudge,
    updateSuspectProgramevaluation
}



