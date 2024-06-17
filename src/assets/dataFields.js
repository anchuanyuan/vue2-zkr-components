/*$dataFields 日照码表*/
const RZdataFields = {
	sizeLimit:[20,50,100,200,500,1000],
	proLookData:true,             //省级数据查看以及推送
	quickAfterFive:true,         //快捷查询后面五个去掉
    showResumezwsj: false,       //简历时间 后端返回为中文—— ，任免表中-- 改为—— 了
    showResumeCheckJump: true,              //判断数据校验结果中，简历信息修正时跳转到表式编辑
    showMoveBtn: false,                //判断是否显示上移下移按钮功能
    showVirtualNode: false,            //机构分组图标
	showUnitRank:true,                  //单位编制表职级
    showSynchronization: true,         //工作经历显示同步按钮
    showMajor: true,                 //简历头部显示院系专业
    showDelete: false,                 //干部列表是否显示删除按钮
    showEduConfiguration:true,      //判断任免表和表式编辑学历学位栏的multiple弹窗显示内容(true表示济宁通过table-id项进行配置，flase表示使用multiple中的写死固定配置)
    heighEditEdu:true,             //高级编辑任免表学历学位合并在一起，目前日照特有
	eduColumnControll:true,         // 根据学历学位代码判断
	showEditResume:false,            //简历栏点击后通过信息集判断
	showCheckData:true,             //是否显示数据治理按钮
    showRMB: true,                  //编辑页是否显示图预览任免表
    showPartyTree: false,           //显示党树
    showNameEn: false,              //需要代码集英文或代码值
    showCardeStation: false,        //需要身份证号码和单位及职务
    showChangeCadre: true,          //干部编辑页面可以直接切换人
    showCardeMessage: true,         //身份证号存在提示单位信息
    showPassRules: false,           //是否修改密码进行密码复杂度校验false
    showTreeLimt: false,            //是否限制单位树、党树权限
    showGetOrgCode: true,          //是否获取单位code
    showStatusList: false,           //是否后端获取人员状态list
    showCarderColumn: 'bj',         // 显示新疆已删除人员的列名称
    showDepartColumn: 'bj',         // 显示新疆已删除单位的列名称
    showFileRemove: false,          //  文件上传是否显示删除按钮
    showValidateCode: false,         //是否显示验证码
    showAppInfo: false,              //是否手动指定标题信息
    showTransFer: false,             //是否显示调入调出
    showCJ: true,//是否显示采集程序入口
    showAllRightForm: false,           //干部分析研判是否显示考察和调研
	showAccountType: false,          //是否显示账号状态
	showMaxLeft: false,               // 是否显示最大宽度
	showViewFile: false,             // 信息集多媒体文件预览
    showRoleChange: false,           // 安全审计员、保密管理员、系统管理员
    hideInfoSet: false,              // 新疆隐藏A020和C002信息集
	showFileTitle: false,
    treeNodeIcon: false,             // 单位树党组织树节点，根据返回值显示不同的图标
    showMutipleCopy: true,          // 信息集信息项复制
    dateType: 'month',              //全局日期类型YYYY-MM
    codeType: 'BJList',             //码表类别管理类型列表
    basicClickStyle: "1",           //双击进入基本情况页面
	loginOutBlack:'1',                 //退出账号时转到登录页
    showNumberPosition: false,           // 安全审计员、保密管理员、系统管理员
    showSJGDM: false,           // 生成省单位机构代码
    showSubmit: false,               //干部库执行干部是否有权限修改
    a001: "a01001",                 //姓名
    a002: "a01111",                 //现任职单位及职务
    a003: "a01004value",            //性别
    a004: "a01007",                 //出生日期
    a005: "a001004a",               //统计关系所在单位(进入本系统单位)
    a005E: "a001004aValue",         //进入本系统单位
    a006: "A001003",                //公民身份号码
    a007: "b001001A",               //当前单位代码
    a008: "b01001",                 //单位名称
    a008E: "b01001",                //单位代码
    /********************************************************************* */
    b001: "EmpA05",                 //职级情况
    b002: "EmpA61",                 //公务员登记
    b003: "EmpA11",                 //教育培训
    b004: "EmpA15",                 //考核情况
    b005: "EMP_A02",                //职务信息集导出
    b006: "EMP_A001",               //基本情况信息集导出
    b007: "EMP_A36",                //家庭社会关系信息集导出
    b008: "EmpA30",                //调出情况
    b009: "EmpA31",                //离退情况
    b0010: "EmpA51",                //辞职辞退情况
    b0011: "EmpA83",                //去世
    b0012: "EmpA49",                //交流情况
	showThreelayers: true,          // 标签

    /********************************************************************** */
    cadreManager: { //干部应用系统
        showChangeCadre: true,              //显示切换干部
	      showUpdate: true,              //显示同步按钮
        showNormal: true,                   //常规维护
        name: "干部综合信息管理",
        appCode: '200',
        tablePk: "EMP_ID",
        tableFk: "subId",
        tableName: "EmpA001",
        tableTypeName: 'CadreInfo',
        operateKey:"empId",
    },
    representativeMembers:{
        showChangeCadre: true,              //显示切换干部
	    showUpdate: true,              //显示同步按钮
        showNormal: true,                   //常规维护
        name: "干部综合信息管理",
        appCode: '200',
        tablePk: "EMP_ID",
        tableFk: "subId",
        tableName: "EmpA001",
        tableTypeName: 'CadreInfo',
        operateKey:"empId",
    },
    departManager: { //单位应用系统
	    showUpdate: true,              //显示同步按钮
        name: "单位综合信息管理",
        appCode: '201',
        idKey: "depId",
        tablePk: "DEP_ID",
        tableFk: "subId",
        tableName: "DepB001",
        tableTypeName: 'DepartmentInfo',
        operateKey:"depId",
    },
    archivesManager: { //干部档案管理
        name: "干部档案管理",
        appCode: '',
        tablePk: "EMP_ID",
        tableFk: "subId",
        tableName: "EmpA001",
        tableTypeName: '',
        operateKey:"empId",
    },
	retreatPersonnel: { //离退人员信息管理
		showChangeCadre: true,              //显示切换干部
		showNormal: true,                   //常规维护
		name: "离退人员信息管理",
		appCode: '200',
		tablePk: "EMP_ID",
		tableFk: "subId",
		tableName: "EmpA001",
		tableTypeName: 'CadreInfo',
        operateKey:"empId",
    },
    retireMessage: { //离退人员信息管理
		showChangeCadre: true,              //显示切换干部
		showNormal: true,                   //常规维护
		name: "离退人员信息管理",
		appCode: '200',
		tablePk: "EMP_ID",
		tableFk: "subId",
		tableName: "EmpA001",
		tableTypeName: 'CadreInfo',
        operateKey:"empId",
    },
    deathMessage: {  //已去世人员信息管理
        showChangeCadre: true,              //显示切换干部
		showNormal: true,                   //常规维护
		name: "已去世人员信息管理",
		appCode: '200',
		tablePk: "EMP_ID",
		tableFk: "subId",
		tableName: "EmpA001",
		tableTypeName: 'CadreInfo',
        operateKey:"empId",
    },
    backMessage: {  //回原单位人员信息管理
        showChangeCadre: true,              //显示切换干部
		showNormal: true,                   //常规维护
		name: "回原单位人员信息管理",
		appCode: '200',
		tablePk: "EMP_ID",
		tableFk: "subId",
		tableName: "EmpA001",
		tableTypeName: 'CadreInfo',
        operateKey:"empId",
    },
    otherMessage: {  //其他人员信息管理
        showChangeCadre: true,              //显示切换干部
		showNormal: true,                   //常规维护
		name: "其他人员信息管理",
		appCode: '200',
		tablePk: "EMP_ID",
		tableFk: "subId",
		tableName: "EmpA001",
		tableTypeName: 'CadreInfo',
        operateKey:"empId",
    },
    leaveMessage: {  //调离人员信息管理
        showChangeCadre: true,              //显示切换干部
		showNormal: true,                   //常规维护
		name: "调离人员信息管理l",
		appCode: '200',
		tablePk: "EMP_ID",
		tableFk: "subId",
		tableName: "EmpA001",
		tableTypeName: 'CadreInfo',
        operateKey:"empId",
    },
	enterOrReturn: {  //调离人员信息管理
        showChangeCadre: true,              //显示切换干部
		showNormal: true,                   //常规维护
		name: "进退流转人员信息管理",
		appCode: '200',
		tablePk: "EMP_ID",
		tableFk: "subId",
		tableName: "EmpA001",
		tableTypeName: 'CadreInfo',
        operateKey:"empId",
    },
	teamManager: { //班子应用系统
        showUpdate: true,              //显示同步按钮
        name: "班子综合信息管理",
        appCode: '202',
        idKey: "depId",
        tablePk: "DEP_ID",
        tableFk: "subId",
        tableName: "DepB001",
        tableTypeName: 'DepartmentInfo',
        operateKey:"depId",
    },

    /********************************************************************** */
    table: {
        a01001: {
            text: '姓名',
            align: 'center',
            dataIndex: 'a01001',
            formatter: (scope) => {
                return {
                    showBtn: true,
                    type: "text primary underline",
                    text: scope.row.a01001,
                    eName: "goRMB"
                }
            }
        },
        b01001: {
            text: '单位名称',
            align: 'left',
            dataIndex: 'b01001',
            formatter: (scope) => {
                return {
                    showBtn: true,
                    type: "text primary underline",
                    text: scope.row.b01001,
                    eName: "changeRow"
                }
            }
        },
        wrongNum: {
            text: '错误总数',
            align: 'center',
            dataIndex: 'wrongNum',
            formatter: (scope) => {
                return {
                    showBtn: true,
                    type: "text danger underline",
                    text: scope.row.wrongNum,
                    eName: "changeRow"
                }
            }
        },
        ignoreNum: {
            text: '忽略数',
            align: 'center',
            dataIndex: 'ignoreNum',
            formatter: (scope) => {
                return {
                    showBtn: true,
                    type: "text primary underline",
                    text: scope.row.ignoreNum,
                    eName: "changeRow"
                }
            }
        },
        operate: {
            text: '操作',
            align: "center",
            fixed: "right",
            width: "75px",
            formatter: (scope) => {
                return {
                    showDropDown: true,
                    text: "操作",
                    data: [{
                        text: "修改",
                        class: "blue",
                        eName: "changeRow"
                    },
                    {
                        text: "删除",
                        class: "red",
                        eName: "delRow"
                    }
                    ]
                }
            }
        },
        //信息中心单位管理
        operate4: {
            text: '操作',
            align: "center",
            fixed: "right",
            width: "75px",
            formatter: (scope) => {
                return {
                    showDropDown: true,
                    text: "操作",
                    data: [{
                        text: "修改",
                        class: "blue",
                        eName: "changeRow"
                    },
                        {
                            text: "重置编码",
                            class: "blue",
                            eName: "resetCode"
                        },
                        {
                            text: "删除",
                            class: "red",
                            eName: "delRow"
                        }
                    ]
                }
            }
        },
        operateCadre:{
            text: '操作',
            align: "center",
            fixed: "right",
            width: "75px",
            formatter: (scope) => {
                return {
                    showDropDown: true,
                    text: "操作",
                    data: [{
                        text: "修改",
                        class: "blue",
                        eName: "changeRow"
                    },
                        {
                            text: "删除",
                            class: "blue",
                            eName: "delRow"
                        },

                        {
                            text: "复制",
                            class: "blue",
                            eName: "copyRow"
                        }
                    ]
                }
            }
        },
		operate3: {
            text: '操作',
            align: "center",
            fixed: "right",
            width: "75px",
            formatter: (scope) => {
                return {
                    showDropDown: true,
                    text: "操作",
                    data: [{
                        text: "修改",
                        class: "blue",
                        eName: "changeRow"
                    },
                    {
                        text: "删除",
                        class: "red",
                        eName: "delRow"
                    },{
                        text: "上移",
                        class: "blue",
                        eName: "moveUp"
                    },
                    {
                        text: "下移",
                        class: "blue",
                        eName: "moveDown"
                    },
                    ]
                }
            }
        },
        operate1: {
            text: '操作',
            align: "center",
            fixed: "right",
            width: "75px",
            formatter: (scope) => {
                return {
                    showDropDown: true,
                    text: "操作",
                    data: [
                        {
                            text: "附件",
                            class: "blue",
                            eName: "detailRow"
                        },
                        {
                            text: "下载附件",
                            class: "green",
                            eName: "downloadAccess"
                        },
                        {
                            text: "修改",
                            class: "blue",
                            eName: "changeRow"
                        },
                        {
                            text: "删除",
                            class: "red",
                            eName: "delRow"
                        },
                    ]
                }
            }
        },
        operate2: {
            text: '操作',
            align: "center",
            fixed: "right",
            width: "75px",
            formatter: (scope) => {
                return {
                    showDropDown: true,
                    text: "操作",
                    data: [{
                        text: "修改",
                        class: "blue",
                        eName: "changeRow"
                    },
                        {
                            text: "删除",
                            class: "red",
                            eName: "delRow"
                        },
                    ]
                }
            }
        },
    },

    //干部页面
    depUrl:"export/gbrmb/rz/html/generateDWBZB?",//单位编制表生成
    downLoadDWBZUrl:"export/gbrmb/rz/word/generateAndExportDwbzb?",//单位编制表生成
    downLoadDWXXUrl:"export/dwldzs/orgProCode?",//单位信息
    htmlUrl:"export/gbrmb/rz/html/generate?",
    wordUrl:"export/gbrmb/rz/word/generateAndExport?",
    lrmxUrl:"export/gbrmb/rz/lrmx/generateAndExport?",
    hmcUrl:"export/gbhmcrz/generateAndExportNofile",
    // hmcUrl:"export/gbhmc/generateAndExport?",
    hmcForGJUrl:"export/gbhmc/generateAndExportForGJ?",
    isViewUrl:"export/gbrmb/rz/html/whetherOrNotArchives",
	downLoadLDGBNDKHDJBUrl:'export/gbrmb/rz/word/generateAndExportKhdjb?',
	downLoadDRSPBUrl:'export/gbrmb/rz/word/generateAndExportDrspb?',
	downLoadGWYKHDJBUrl:'export/gbrmb/rz/word/generateAndExportKhdjbGwy?',
	downLoadCJXXBUrl:'export/gbhmc/generateAndExportCollectExcel?',
	errorUrl:"cadre/getCadreCheckResult?",
    cadreDownLoad:[
		{
		    name: "基本信息审核表",
		    eName: "downloadBaseTempalte",
		    empType: "EMP_A001"
		},
        // { name: "干部花名册(导入模板)", eName: "uploadHmcTemplate"},
        // { name: "干部花名册(导出模板)", eName: "downLoadChoseTemplate"},
        // { name: "干部花名册", eName: "downLoadGbhmc",data:{} },
        {
            name: "干部花名册(不含单位)",
            eName: "downLoadGbhmc",
            data: { containDepartment: false }
        },
        {
            name: "干部花名册(包含身份证号)",
            eName: "downLoadGbhmc",
            data: { containIdCardNo: true }
        },
        {
            name: "干部花名册(职务关联单位)",
            eName: "downLoadGbhmc",
            data: { containDutyDepart: true }
        },
        { name: "干部任免表lrmx", eName: "downLoadGbLrmx" },
        { name: "干部任免表word", eName: "downLoadGbWord" },
        // {
        //     name: "职务信息集导出",
        //     eName: "downLoadTable",
        //     empType: "EMP_A02"
        // },
        // {
        //     name: "基本情况信息集导出",
        //     eName: "downLoadTable",
        //     empType: "EMP_A001"
        // },
        // {
        //     name: "家庭社会关系信息集导出",
        //     eName: "downLoadTable",
        //     empType: "EMP_A36"
        // },
		// {
  //           name: "干教花名册",
  //           eName: "downLoadGbhmcForGJ",
  //       },{
  //           name: "领导干部年度考核登记表",
  //           eName: "downLoadLDGBNDKHDJB",
  //       },{
  //           name: "公务员考核登记表",
  //           eName: "downLoadGWYKHDJB",
  //       },{
  //           name: "公务员调任审批表",
  //           eName: "downLoadDRSPB",
  //       },
	// 	{
  //           name: "采集信息表",
  //           eName: "downLoadCJXXB",
  //       },
    ],
    //单位页面
    departDownLoad:[
        // {
        //     name: "领导职数(市级党委管理的单位)",
        //     eName: "downLoadGbhmc",
        //     data: { type: 1 }
        // },
        // {
        //     name: "领导职数(县级党委管理的单位)",
        //     eName: "downLoadGbhmc",
        //     data: { type: 2 }
        // },
        // {
        //     name: "领导职数(当前单位管理的单位)",
        //     eName: "downLoadGbhmc",
        //     data: { type: 0 }
        // },
        {
            name: "单位编制表",
            eName: "downLoadDWBZ",
        },{
            name: "单位信息表",
            eName: "downLoadDWXX",
        },{
            name: "领导班子分析研判",
            eName: "openFxyp",
            data: {}
        },
        {
            name: "导出干部信息",
            eName: "exportCadre",
            data: {}
        },
        {
            name: "导出干部信息(可选属性)",
            eName: "openNature",
            data: {}
        },
    ],
    //系统管理页面
    codeTypeData:{
        "0": "毕节标准",
        "1": "国家标准",
        "2": "地方标准",
        "3": "行业标准",
        "127": "自定义标准",
    },
    urlList: [
		{
		    routerName: 'proManage',
		    name: '查看省对接字段维护',
		    id: 'proManage'
		},{
		    routerName: 'assessSystem',
		    name: '考核数据维护',
		    id: 'assessSystem'
		},{
		    routerName: 'LeadershipManager',
		    name: '班子详情管理',
		    id: 'LeadershipManager'
		},
        {
            routerName: 'agewarning',
            name: '年龄红绿灯',
            id: 'agewarning'
        },
        {
            routerName: 'tree',
            name: '管理层级树',
            id: 'tree'
        },
        {
            routerName: 'provinceinformation',
            name: '省信息中心',
            id: 'provinceinformation'
        },
        {
            routerName: 'circulation',
            name: '进退留转',
            id: 'circulation'
        },
        //市直中层年龄预警台账
        {
            routerName: 'LeaderAge',
            name: '市直中层年龄预警台账123',
            id: 'LeaderAge'
        },{
		    routerName: 'LeadershipCondition',
		    name: '班子查询条件管理',
		    id: 'LeadershipCondition'
		},
		{
		    routerName: 'departAgeAnalysis',
		    name: '班子年龄分析',
		    id: 'departAgeAnalysis'
		},
        {
            routerName: 'departAgeAnalysisTwo',
            name: '班子年龄分析2',
            id: 'departAgeAnalysisTwo'
        },
		{
		    routerName: 'AssessmentManager',
		    name: '一人一档管理',
		    id: 'AssessmentManager'
		},{
		    routerName: 'PositionNumber',
		    name: '单位职级职数详情',
		    id: 'PositionNumber'
		},
		{
		    routerName: 'technological',
		    name: '流程管理',
		    id: 'technological'
		},{
		    routerName: 'guideProcess',
		    name: '引导流程页面',
		    id: 'guideProcess'
		},{
		    routerName: 'guideList',
		    name: '流程未完成页面',
		    id: 'guideList'
		},
		{
		    routerName: 'dataAduilt',
		    name: '干部校核',
		    id: 'dataAduilt'
		},{
		    routerName: 'unitAduilt',
		    name: '单位校核',
		    id: 'unitAduilt'
		},
        // 班子换届
        {
            routerName: 'VocabularyManagement',
            name: '词汇管理',
            id: 'VocabularyManagement'
        },
        {
            routerName: 'ConditionTemplate',
            name: '条件模板',
            id: 'ConditionTemplate'
        },
        {
            routerName: 'ChangeManagement',
            name: '班子换届管理',
            id: 'ChangeManagement'
        },
        {
            routerName: 'AddSession',
            name: '届次条件设置',
            id: 'AddSession'
        },
        {
            routerName: 'SimulatedChange',
            name: '模拟换届',
            id: 'SimulatedChange'
        },
        {
            routerName: 'RepresentativeMembers',
            name: '“两代表一委员”库',
            id: 'RepresentativeMembers'
        },{
            routerName: 'LeaderPosition',
            name: '领导班子条件设置',
            id: 'LeaderPosition'
        },{
            routerName: 'sendEmailList',
            name: '已发送邮件',
            id: 'sendEmailList'
        },
        {
            routerName: 'inbox',
            name: '已收到邮件',
            id: 'inbox'
        },{
            routerName: 'ipadManage',
            name: 'ipad管理',
            id: 'ipadManage'
        },{
            routerName: 'ipadManageRole',
            name: 'ipad管理（暂定）',
            id: 'ipadManageRole'
        },{
            routerName: 'knowledgeBase',
            name: '知识库',
            id: 'knowledgeBase'
        },
        {
            routerName: 'BackMessage',
            name: '回原单位人员信息管理',
            id: 'BackMessage'
        },
        {
            routerName: 'PositionNumber',
            name: '单位职数情况',
            id: 'PositionNumber'
        },
        {
            routerName: 'Test',
            name: '测试页面',
            id: 'Test'
        },
        {
            routerName: 'DynamicTag',
            name: '动态标签管理',
            id: 'DynamicTag'
        },
        {
            routerName: 'CadreTableStatistics',
            name: '干部表格统计',
            id: 'CadreTableStatistics'
        },
        {
            routerName: 'CadreManager',
            name: '干部综合信息管理',
            id: 'CadreManager'
        },
        {
            routerName: 'JudementAnalysis',
            name: '班子分析研判',
            id: 'JudementAnalysis'
        },
        {
            routerName: 'TeamManager',
            name: '班子信息管理',
            id: 'TeamManager'
        },
        {
            routerName: 'CadreChangeInfo',
            name: '干部信息变动管理',
            id: 'CadreChangeInfo'
        },
        {
            routerName: 'transferCadreInfo',
            name: '人员调动任务管理',
            id: 'transferCadreInfo'
        },
        {
            routerName: 'DepartManager',
            name: '单位综合信息管理',
            id: 'DepartManager'
        },
        {
            routerName: 'InformationCenter',
            name: '信息中心单位管理',
            id: 'InformationCenter'
        },
        {
            routerName: 'InformationCenterNew',
            name: '省机构信息维护',
            id: 'InformationCenterNew'
        },
        {
            routerName: 'treeNew',
            name: '自建机构对应省机构维护',
            id: 'treeNew'
        },
        {
            routerName: 'tree',
            name: '管理层级树',
            id: 'tree'
        },
        {
            routerName: 'AppointManager',
            name: '任免表编辑',
            id: 'AppointManager'
        },
        {
            routerName: 'GroupManager',
            name: '信息集类别',
            id: 'GroupManager'
        },
        {
            routerName: 'CategoryManager',
            name: '信息集实体',
            id: 'CategoryManager'
        },
        {
            routerName: 'InfoManager',
            name: '信息集字段',
            id: 'InfoManager'
        },
        {
            routerName: 'AssessmentConfig',
            name: '一人一档权限管理',
            id: 'AssessmentConfig'
        },
        {
            routerName: 'LogManager',
            name: '日志管理',
            id: 'LogManager'
        },
        {
            routerName: 'UserManager',
            name: '用户管理',
            id: 'UserManager'
        },
        {
            routerName: 'PropertyManager',
            name: '应用管理',
            id: 'PropertyManager'
        },
        {
            routerName: 'MenuGroup',
            name: '功能权限组配置',
            id: 'MenuGroup'
        },
        {
            routerName: 'AccountGroup',
            name: '账号配置',
            id: 'AccountGroup'
        },
        {
            routerName: 'AccountAudit',
            name: '账号审核',
            id: 'AccountAudit'
        },
        {
            routerName: 'RoleConfig',
            name: '角色配置',
            id: 'RoleConfig'
        },
        {
            routerName: 'CodeTableConfig',
            name: '码表配置',
            id: 'CodeTableConfig'
        },
        {
            routerName: 'CodeTableOperate',
            name: '码表集操作',
            id: 'CodeTableOperate'
        },
        {
            routerName: 'ConditionalError',
            name: '数据治理',
            id: 'ConditionalError'
        },
        {
            routerName: 'ConditionalErrorConfig',
            name: '系统查错条件配置',
            id: 'ConditionalErrorConfig'
        },
        {
          routerName: 'ConditionalErrorConfigNew',
          name: '系统数据校核条件配置',
          id: 'ConditionalErrorConfigNew'
        },
        {
            routerName: 'carderCheck',
            name: '干部查错列表',
            id: 'carderCheck'
        },
        {
            routerName: 'UnitCheck',
            name: '单位查错列表',
            id: 'UnitCheck'
        },
        {
            routerName: 'ErrorType',
            name: '错误类型治理',
            id: 'ErrorType'
        },
        {
            routerName: 'CadreStatistics',
            name: '干部统计',
            id: 'CadreStatistics'
        },
        {
            routerName: 'CadreSql',
            name: '角色权限页面SQL配置',
            id: 'CadreSql'
        },
        {
            routerName: 'EditLableItem',
            name: '标签管理',
            id: 'EditLableItem'
        },
        {
            routerName: 'TabManager',
            name: '标签类别配置',
            id: 'TabManager'
        },
        {
            routerName: 'ArchivesManager',
            name: '干部档案管理',
            id: 'ArchivesManager'
        },
        {
            routerName: 'ViewApplication',
            name: '档案申请列表',
            id: 'ViewApplication'
        },
        {
            routerName: 'AddApply',
            name: '申请查看档案',
            id: 'AddApply'
        },
        {
            routerName: 'ApproveApply',
            name: '档案审批列表',
            id: 'ApproveApply'
        },
        {
            routerName: 'Approve',
            name: '档案审批',
            id: 'Approve'
        },
        {
            routerName: 'Look',
            name: '预览档案',
            id: 'Look'
        },
        {
            routerName: 'Interface',
            name: '数据权限配置',
            id: 'Interface'
        },
        {
            routerName: 'InfoConfig',
            name: '角色数据权限配置',
            id: 'InfoConfig'
        },
        {
            routerName: 'ConfigSql',
            name: '配置数据权限sql',
            id: 'ConfigSql'
        },
        {
            routerName: 'DataSource',
            name: '数据源',
            id: 'DataSource'
        },
        {
            routerName: 'Condition',
            name: '条件源',
            id: 'Condition'
        },
        {
            routerName: 'Template',
            name: '报表模板管理',
            id: 'Template'
        },
        {
            routerName: 'CustomReports',
            name: '自定义报表',
            id: 'CustomReports'
        },
        {
            routerName: 'StatisReport',
            name: '统计报表',
            id: 'StatisReport'
        },
        //党组织
        {
            routerName: 'PartyActivist',
            name: '入党积极分子信息管理',
            id: 'PartyActivist'
        },
        {
            routerName: 'PartyApply',
            name: '入党申请人信息管理',
            id: 'PartyApply'
        },
        {
            routerName: 'PartyBasic',
            name: '党员基本信息管理',
            id: 'PartyBasic'
        },
        {
            routerName: 'PartyDevelopment',
            name: '发展对象信息管理',
            id: 'PartyDevelopment'
        },
        {
            routerName: 'PartyOrganization',
            name: '党组织机构管理',
            id: 'PartyOrganization'
        },
        //中间表
        {
            routerName: 'MiddleBasic',
            name: '人员党员基本信息',
            id: 'MiddleBasic'
        },
        {
            routerName: 'MiddleChange',
            name: '组织关系变动',
            id: 'MiddleChange'
        },
        {
            routerName: 'MiddleCompany',
            name: '党代表情况',
            id: 'MiddleCompany'
        },
        {
            routerName: 'MiddlePosition',
            name: '党内职务信息',
            id: 'MiddlePosition'
        },
        {
            routerName: 'MiddleRelation',
            name: '党组织和单位关联',
            id: 'MiddleRelation'
        },
        {
            routerName: 'MiddleRelationship',
            name: '单位和党组织关系',
            id: 'MiddleRelationship'
        },
        {
            routerName: 'MiddleRepresentative',
            name: '党代表情况',
            id: 'MiddleRepresentative'
        },
        {
            routerName: 'MiddleReward',
            name: '本年人员奖罚实现',
            id: 'MiddleReward'
        },
        {
            routerName: 'MiddleTransfer',
            name: '人事关系变动',
            id: 'MiddleTransfer'
        },
        // 离职人员管理
        {
            routerName: 'RetreatPersonnel',
            name: '离退人员信息管理',
            id: 'RetreatPersonnel'
        },
        // 毕节干部综合信息管理
        {
            routerName: 'LeaveMessage',
            name: '调离人员信息',
            id: 'LeaveMessage'
        },{
            routerName: 'enterOrReturn',
            name: '进退流转人员信息管理',
            id: 'enterOrReturn'
        },
        {
            routerName: 'otherMessage',
            name: '其他人员信息',
            id: 'otherMessage'
        },
        {
            routerName: 'DeathMessage',
            name: '已去世人员信息',
            id: 'DeathMessage'
        },
        {
            routerName: 'DeletedCadresManager',
            name: '已删除干部管理',
            id: 'DeletedCadresManager'
        }, {
            routerName: 'DeletedDepartManager',
            name: '已删除单位管理',
            id: 'DeletedDepartManager'
        },
    ],
	// 功能权限分组图标
	classIconData: [
		// 导航分类
		{
			id: "icon-renyuanguanli",
			name: "icon-renyuanguanli",
			nameCn: "人员管理分类"
		},
		{
			id: "icon-lituiguanhuai",
			name: "icon-lituiguanhuai",
			nameCn: "离退人员管理分类"
		},
		{
			id: "icon-dangzuzhiguanli",
			name: "icon-dangzuzhiguanli",
			nameCn: "党组织管理分类"
		},
		{
			id: "icon-shengchengzhongjianbiao",
			name: "icon-shengchengzhongjianbiao",
			nameCn: "中间表管理分类"
		},
		{
			id: "icon-baobiaoguanli",
			name: "icon-baobiaoguanli",
			nameCn: "报表信息分类"
		},
		{
			id: "icon-system",
			name: "icon-system",
			nameCn: "系统管理分类"
		},
		//原始
		{
			id: "icon-shuxing",
			name: "icon-shuxing"
		},
		{
			id: "icon-junren",
			name: "icon-junren"
		},
		{
			id: "icon-dengji",
			name: "icon-dengji"
		},
		{
			id: "icon-jinru",
			name: "icon-jinru"
		},
		{
			id: "icon-likai",
			name: "icon-likai"
		},
		{
			id: "icon-group",
			name: "icon-group"
		},
		{
			id: "icon-fenlei",
			name: "icon-fenlei"
		},
		{
			id: "icon-changgui",
			name: "icon-changgui"
		},
		{
			id: "icon-mingdan",
			name: "icon-mingdan"
		},
		{
			id: "icon-biaodan",
			name: "icon-biaodan"
		},
		{
			id: "icon-ganbu",
			name: "icon-ganbu"
		},
		{
			id: "icon-zhuye",
			name: "icon-zhuye"
		},
		{
			id: "icon-zuzhi",
			name: "icon-zuzhi"
		},
		{
			id: "icon-work",
			name: "icon-work"
		},
		{
			id: "icon-dizhi",
			name: "icon-dizhi"
		},
	],
	// 功能权限图标
	iconData: [
		// 人员管理
		{
			id: "icon-renyuanxinxiguanli",
			name: "icon-renyuanxinxiguanli",
			nameCn: "人员信息管理"
		},
		{
			id: "icon-ganburenmian",
			name: "icon-ganburenmian",
			nameCn: '任免表快速编辑'
		},
		{
			id: "icon-danweiguanli",
			name: "icon-danweiguanli",
			nameCn: '单位综合信息管理'
		},
		{
			id: "icon-shujuzhili",
			name: "icon-shujuzhili",
			nameCn: '系统数据治理'
		},
		{
			id: "icon-renyuantongji",
			name: "icon-renyuantongji",
			nameCn: '干部统计分析'
		},
		{
			id: "icon-danwei1",
			name: "icon-danwei1",
			nameCn: '已删除单位管理'
		},
		{
			id: "icon-yichuganbu",
			name: "icon-yichuganbu",
			nameCn: '已删除干部管理'
		},
		{
			id: "icon-liudongrenkou1",
			name: "icon-liudongrenkou1",
			nameCn: '干部调入/调出申请'
		},
		{
			id: "icon-renyuanshenhe",
			name: "icon-renyuanshenhe",
			nameCn: '干部调入/调出审核'
		},
		{
			id: "icon-danganchakan",
			name: "icon-danganchakan",
			nameCn: '档案查看申请'
		},
		{
			id: "icon-shenpi",
			name: "icon-shenpi",
			nameCn: '档案申请审批'
		},
		{
			id: "icon-dananguanli-",
			name: "icon-dananguanli-",
			nameCn: '干部档案管理'
		},
		//党组织管理
		{
			id: "icon-zuzhijigou",
			name: "icon-zuzhijigou",
			nameCn: '党组织机构管理'
		},
		{
			id: "icon-dangyuanguanli",
			name: "icon-dangyuanguanli",
			nameCn: '党员基本信息管理'
		},
		{
			id: "icon-rudangshenqing",
			name: "icon-rudangshenqing",
			nameCn: '入党申请人信息管理'
		},
		{
			id: "icon-rudangjijifenziguanli",
			name: "icon-rudangjijifenziguanli",
			nameCn: '入党积极分子信息管理'
		},
		{
			id: "icon-development-object",
			name: "icon-development-object",
			nameCn: '发展对象信息管理'
		},
		{
			id: "icon-jurassic_delete-org",
			name: "icon-jurassic_delete-org",
			nameCn: '已删除党组织管理'
		},
		{
			id: "icon-shanchurenyuan",
			name: "icon-shanchurenyuan",
			nameCn: '已删除党员管理'
		},
		{
			id: "icon-dangyuanzuzhiguanxizhuanyi",
			name: "icon-dangyuanzuzhiguanxizhuanyi",
			nameCn: '党组织关系转入转出申请'
		},
		{
			id: "icon-btn-check",
			name: "icon-btn-check",
			nameCn: '党组织关系转入转出审核'
		},
		// 离退人员管理
		{
			id: "icon-lituixiu",
			name: "icon-lituixiu",
			nameCn: '离退人员管理'
		},
		{
			id: "icon-shanchurenyuan",
			name: "icon-shanchurenyuan",
			nameCn: '已删除离退人员管理'
		},
		// 中间表管理
		{
			id: "icon-renyuanxinxiguanli",
			name: "icon-renyuanxinxiguanli",
			nameCn: '人员党员基本信息'
		},
		{
			id: "icon-liudongrenkou",
			name: "icon-liudongrenkou",
			nameCn: '人事关系变动'
		},
		{
			id: "icon-dangyuanzuzhiguanxizhuanyi",
			name: "icon-dangyuanzuzhiguanxizhuanyi",
			nameCn: '组织关系变动'
		},
		{
			id: "icon-guanlian",
			name: "icon-guanlian",
			nameCn: '党组织和单位关联'
		},
		{
			id: "icon-guanxi",
			name: "icon-guanxi",
			nameCn: '单位和党组织关系'
		},
		{
			id: "icon-danweibianzhi",
			name: "icon-danweibianzhi",
			nameCn: '单位编制设置'
		},
		{
			id: "icon-ddb",
			name: "icon-ddb",
			nameCn: '党代表情况'
		},
		{
			id: "icon-jiangcheng",
			name: "icon-jiangcheng",
			nameCn: '本年人员奖罚实现'
		},
		{
			id: "icon-zhiwu",
			name: "icon-zhiwu",
			nameCn: '党内职务信息'
		},
		{
			id: "icon-lingdaobanzi",
			name: "icon-lingdaobanzi",
			nameCn: '领导班子任职信息'
		},
		{
			id: "icon-gongwuyuan",
			name: "icon-gongwuyuan",
			nameCn: '公务员基本情况'
		},
		{
			id: "icon-tubiaozhizuomoban-",
			name: "icon-tubiaozhizuomoban-",
			nameCn: '公务员职务职级中间表'
		},
		{
			id: "icon-jishurenyuan",
			name: "icon-jishurenyuan",
			nameCn: '企事业单位管理专技人员'
		},
		{
			id: "icon-lituixiu",
			name: "icon-lituixiu",
			nameCn: '离退休干部基本情况'
		},
		{
			id: "icon-dangyuanguanli",
			name: "icon-dangyuanguanli",
			nameCn: '党员基本情况'
		},
		{
			id: "icon-rudangshenqing",
			name: "icon-rudangshenqing",
			nameCn: '入党申请人基本情况'
		},
		{
			id: "icon-rudangjijifenziguanli",
			name: "icon-rudangjijifenziguanli",
			nameCn: '入党积极分子中间表'
		},
		{
			id: "icon-development-object",
			name: "icon-development-object",
			nameCn: '发展对象基本情况中间表'
		},
		{
			id: "icon-gongzi4",
			name: "icon-gongzi4",
			nameCn: '工资信息中间表'
		},
		// 报表管理
		{
			id: "icon-tiaojian",
			name: "icon-tiaojian",
			nameCn: '条件源'
		},
		{
			id: "icon-shujuyuan1",
			name: "icon-shujuyuan1",
			nameCn: '数据源'
		},
		{
			id: "icon-tongjibaobiao",
			name: "icon-tongjibaobiao",
			nameCn: '统计报表'
		},
		{
			id: "icon-zidingyibaobiao-bianji",
			name: "icon-zidingyibaobiao-bianji",
			nameCn: '自定义报表'
		},
		{
			id: "icon-statement-order1",
			name: "icon-statement-order1",
			nameCn: '报表模板'
		},
		// 系统管理
		{
			id: "icon-ziduan",
			name: "icon-ziduan",
			nameCn: '信息集字段'
		},
		{
			id: "icon-jufengkaifaiCON",
			name: "icon-jufengkaifaiCON",
			nameCn: '信息集类别'
		},
		{
			id: "icon-shiti",
			name: "icon-shiti",
			nameCn: '信息集实体'
		},
		{
			id: "icon-yingyongguanli",
			name: "icon-yingyongguanli",
			nameCn: '应用管理'
		},
		{
			id: "icon-gongnengquanxian",
			name: "icon-gongnengquanxian",
			nameCn: '功能权限组配置'
		},
		{
			id: "icon-xitongquanxian",
			name: "icon-xitongquanxian",
			nameCn: '角色配置'
		},
		{
			id: "icon-zhanghaopeizhi",
			name: "icon-zhanghaopeizhi",
			nameCn: '账号配置'
		},
		{
			id: "icon-zhanghaoshenhe",
			name: "icon-zhanghaoshenhe",
			nameCn: '账号审核'
		},
		{
			id: "icon-mabiaoduizhaoguanli",
			name: "icon-mabiaoduizhaoguanli",
			nameCn: '码表配置'
		},
		{
			id: "icon-mabiaoguanli",
			name: "icon-mabiaoguanli",
			nameCn: '码表集操作'
		},
		{
			id: "icon-rizhi1",
			name: "icon-rizhi1",
			nameCn: '日志管理'
		},
		{
			id: "icon-biaoqian",
			name: "icon-biaoqian",
			nameCn: '标签类别配置'
		},
		{
			id: "icon-chacuojianjilu",
			name: "icon-chacuojianjilu",
			nameCn: '系统差错条件配置'
		},
		{
			id: "icon-icon-test",
			name: "icon-icon-test",
			nameCn: '数据权限'
		},
		//原始
		{
			id: "icon-shuxing",
			name: "icon-shuxing"
		},
		{
			id: "icon-junren",
			name: "icon-junren"
		},
		{
			id: "icon-dengji",
			name: "icon-dengji"
		},
		{
			id: "icon-jinru",
			name: "icon-jinru"
		},
		{
			id: "icon-likai",
			name: "icon-likai"
		},
		{
			id: "icon-group",
			name: "icon-group"
		},
		{
			id: "icon-fenlei",
			name: "icon-fenlei"
		},
		{
			id: "icon-changgui",
			name: "icon-changgui"
		},
		{
			id: "icon-mingdan",
			name: "icon-mingdan"
		},
		{
			id: "icon-biaodan",
			name: "icon-biaodan"
		},
		{
			id: "icon-ganbu",
			name: "icon-ganbu"
		},
		{
			id: "icon-zhuye",
			name: "icon-zhuye"
		},
		{
			id: "icon-zuzhi",
			name: "icon-zuzhi"
		},
		{
			id: "icon-work",
			name: "icon-work"
		},
		{
			id: "icon-dizhi",
			name: "icon-dizhi"
		},
	],
}
//类型数据
const BJgroupData = [
    {
        tableNameCn: "职务信息",
        tableNameEn: "EmpA02",
        comName: "jobInfo",
        icon: "icon-work",
    },
    {
        tableNameCn: "录聘情况",
        tableNameEn: "EmpA03",
        icon: "icon-jinru",
    }, {
        tableNameCn: "试用情况",
        tableNameEn: "EmpA04",
        icon: "icon-shiyong",
    }, {
        tableNameCn: "职级情况",
        tableNameEn: "EmpA05",
        icon: "icon-dengji",
    }, {
        tableNameCn: "专业技术任职资格",
        tableNameEn: "EmpA06",
        icon: "icon-mingdan",
    }, {
        tableNameCn: "衔称",
        tableNameEn: "EmpA07",
        icon: "icon-zhuanjia",
    }, {
        tableNameCn: "学历",
        tableNameEn: "EmpA08",
        icon: "icon-xueli",
    }, {
        tableNameCn: "学位",
        tableNameEn: "EmpA09",
        icon: "icon-xueli",
    }, {
        tableNameCn: "语言能力",
        tableNameEn: "EmpA10",
        icon: "icon-yuyan",
    }, {
        tableNameCn: "学习（培训、进修）",
        tableNameEn: "EmpA11",
        icon: "icon-xueli",
    }, {
        tableNameCn: "出国（境）情况",
        tableNameEn: "EmpA12",
        icon: "icon-chuguo",
    }, {
        tableNameCn: "奖惩情况",
        tableNameEn: "EmpA14",
        icon: "icon-rewards",
    }, {
        tableNameCn: "基本情况",
        tableNameEn: "EmpA001",
        icon: "icon-jiben",
    }, {
        tableNameCn: "考核情况",
        tableNameEn: "EmpA15",
        icon: "icon-kaohe",
    }, {
        tableNameCn: "工作经历",
        tableNameEn: "EmpA17",
        icon: "icon-work",
    }, {
        tableNameCn: "业绩",
        tableNameEn: "EmpA18",
        icon: "icon-yeji",
    }, {
        tableNameCn: "专业技术工作及成果",
        tableNameEn: "EmpA19",
        icon: "icon-chengguo",
    }, {
        tableNameCn: "专业技术工作获奖",
        tableNameEn: "EmpA20",
        icon: "icon-chengguo",
    }, {
        tableNameCn: "获取专利",
        tableNameEn: "EmpA21",
        icon: "icon-lunwen",
    }, {
        tableNameCn: "论文、论著",
        tableNameEn: "EmpA22",
        icon: "icon-lunwen",
    }, {
        tableNameCn: "后备干部",
        tableNameEn: "EmpA23",
        icon: "icon-leader",
    }, {
        tableNameCn: "专家",
        tableNameEn: "EmpA24",
        icon: "icon-zhuanjia",
    }, {
        tableNameCn: "退出现役军人（武警）情况",
        tableNameEn: "EmpA26",
        icon: "icon-junren",
    }, {
        tableNameCn: "工人技术等级",
        tableNameEn: "EmpA27",
        icon: "icon-dengji",
    }, {
        tableNameCn: "调入情况",
        tableNameEn: "EmpA29",
        icon: "icon-jinru",
    }, {
        tableNameCn: "调出情况",
        tableNameEn: "EmpA30",
        icon: "icon-likai",
    }, {
        tableNameCn: "离退情况",
        tableNameEn: "EmpA31",
        icon: "icon-lizhi",
    }, {
        tableNameCn: "机关事业单位工资变动情况",
        tableNameEn: "EmpA32",
        icon: "icon-gongzi",
    }, {
        tableNameCn: "工资福利项目",
        tableNameEn: "EmpA33",
        icon: "icon-gongzi",
    }, {
        tableNameCn: "社会保险",
        tableNameEn: "EmpA34",
        icon: "icon-gongzi",
    }, {
        tableNameCn: "国籍",
        tableNameEn: "EmpA35",
        icon: "icon-guojia",
    }, {
        tableNameCn: "家庭成员及社会关系",
        tableNameEn: "EmpA36",
        icon: "icon-zuzhi",
    }, {
        tableNameCn: "地址与通信",
        tableNameEn: "EmpA37",
        icon: "icon-tongxin",
    }, {
        tableNameCn: "人事档案管理",
        tableNameEn: "EmpA38",
        icon: "icon-rizhi",
    }, {
        tableNameCn: "个人其他情况",
        tableNameEn: "EmpA39",
        icon: "icon-jiben",
    }, {
        tableNameCn: "长期从事、分管的领域",
        tableNameEn: "EmpA46",
        icon: "icon-zhuanjia",
    }, {
        tableNameCn: "组织考察情况",
        tableNameEn: "EmpA47",
        icon: "icon-kaohe",
    }, {
        tableNameCn: "工作岗位",
        tableNameEn: "EmpA48",
        icon: "icon-work",
    }, {
        tableNameCn: "交流情况",
        tableNameEn: "EmpA49",
        icon: "icon-usergroup",
    }, {
        tableNameCn: "民主测评情况",
        tableNameEn: "EmpA50",
        icon: "icon-kaohe",
    }, {
        tableNameCn: "辞职辞退情况",
        tableNameEn: "EmpA51",
        icon: "icon-lizhi",
    }, {
        tableNameCn: "职务变动情况",
        tableNameEn: "EmpA52",
        icon: "icon-zhiwei",
    }, {
        tableNameCn: "拟任拟免职务",
        tableNameEn: "EmpA53",
        icon: "icon-zhiwei",
    }, {
        tableNameCn: "个人重大事项报告",
        tableNameEn: "EmpA54",
        icon: "icon-gonggao",
    }, {
        tableNameCn: "经济责任审计",
        tableNameEn: "EmpA55",
        icon: "icon-kaohe",
    }, {
        tableNameCn: "群众反映意见",
        tableNameEn: "EmpA56",
        icon: "icon-gonggao",
    }, {
        tableNameCn: "个人多媒体信息",
        tableNameEn: "EmpA57",
        icon: "icon-gonggao",
    }, {
        tableNameCn: "政治面貌",
        tableNameEn: "EmpA58",
        icon: "icon-zhengzhimianmao",
    }, {
        tableNameCn: "公务员登记",
        tableNameEn: "EmpA61",
        icon: "icon-bianzhi",
    }, {
        tableNameCn: "参加学术团体情况",
        tableNameEn: "EmpA63",
        comName: "sicoalInfo",
        icon: "icon-xueli",
    },
]



export {
    RZdataFields,
    BJgroupData,
}
