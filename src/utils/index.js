import $ from 'jquery';
import qs from 'qs';
import store from '../store';
let util = {};
util.install = function (Vue) {
    //提示信息
    Vue.prototype.$showMsg = (type, message,dangerouslyUseHTMLString=false) => {
        Vue.prototype.$message({
            type: type,
            message: message,
            dangerouslyUseHTMLString
        });
    };
    Vue.prototype.$computeHeight = (el,offset) => {
        let top = el.getBoundingClientRect().top
        return `calc(100vh - ${top}px - ${offset}px)`
    },
    //提示弹窗
    Vue.prototype.$showConfirm = (hintText, callback, cancel,flag=true) => {
        if(flag)
            Vue.prototype.$confirm(hintText, '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning',
                customClass: 'custom-confirm-class'
            }).then(() => {
                callback();
            }).catch(() => {
                if (cancel) {
                    cancel();
                }
                Vue.prototype.$showMsg('info', '取消操作!');
            });
        else
            callback();
    };

    //请求方式
    Vue.prototype.$ajaxPost = (requestOptions, showLoading, callback) => {
        let ajaxOptions = {
            method: 'post', //请求方式
            headers: {
                'X-Requested-With': 'XMLHttpRequest'
            },
            responseType: 'json', //'arraybuffer',//default//blob
            isNeedLogin: true
        }
        let requestUrl = requestOptions.url;
        if (requestUrl.substring(requestUrl.length - 1) === "?") { //请求参数是需要序列化的
            requestOptions.url = requestUrl.substring(0, requestUrl.length - 1);
            if (requestOptions.data.refresh)
                delete requestOptions.data.refresh;
            requestOptions.data = qs.stringify(requestOptions.data);
        }
        for (let key in requestOptions) {
            ajaxOptions[key] = requestOptions[key];
        }
        if (ajaxOptions.method === 'get' && Object.keys(ajaxOptions.data).length > 0) {
            ajaxOptions.url += "?";
            ajaxOptions.url += ajaxOptions.data;
            ajaxOptions.data = {};
            delete ajaxOptions.headers;
            delete ajaxOptions.responseType;
        }
        if (showLoading) {
            store.commit("updatePageLoading", ++store.state.pageLoading);
        }
        Vue.prototype.$http(ajaxOptions).then(function (response) {
            if (showLoading&&store.state.pageLoading>0){
                store.commit("updatePageLoading", --store.state.pageLoading)
            }
            if (callback){
                callback(response.data);
            }
        }).catch(error =>{
                if (showLoading&&store.state.pageLoading>0){
                    store.commit("updatePageLoading", --store.state.pageLoading)
                }
                if(error.response){
                    if (error.response.status === 401 || error.response.status === 402){
                        if(!ajaxOptions.url.includes('user/user/loginOut')) {
                            callback()
                            return
                        }
                        Vue.prototype.$message.warning('登录超时，请先登录系统！');
                        store.commit('updateLoginStatus');
                    }else {
                        Vue.prototype.$message.error( error.response.data.message || '系统错误！');
                    }
                    if(ajaxOptions.checkLogin){  //不管是否成功，都调回调函数
                        callback(error.response);
                    }
                }else{
                    //Vue.prototype.$message.error( error);
                    console.log(error)
                }
        });
    };
    //object->formData
    Vue.prototype.$jsToFormData = (config) => {
        let formData = new FormData();
        let obj = config.data;
        let arrayKey = config.arrayKey;
        for (var i in obj) {
            if (isArray(obj[i])) {
                obj[i].map(item => {
                    if (!arrayKey) {
                        formData.append(i, item)
                    } else {
                        formData.append(i + '[]', item)
                    }
                })
            } else if (obj[i] instanceof FileList) {
                //filelist 文件类型的处理
                for (var fileItem = 0; fileItem < obj[i].length; fileItem++) {
                    if (!arrayKey) {
                        formData.append(i, obj[i].item(fileItem))
                    } else {
                        formData.append(i + '[]', obj[i].item(fileItem))
                    }
                }
            } else {
                formData.append(i, obj[i])
            }
        }
        return formData;
    };


    //获取错误数
    Vue.prototype.$loadStatis = (callback) => {
        let ajaxOptions = {
            url: Vue.prototype.$baseUrl + "sys/check/result/statistics",
            data: {
                conditionTypeId: ''
            }
        };
        Vue.prototype.$ajaxPost(ajaxOptions, true, (res) => {
            if (res.code === 200) {
                callback(res.data.wrongNum)
            } else {
                Vue.prototype.$showMsg("error", res.message);
            }
        })
    };
    //根据用户身份信息获取用户菜单
    Vue.prototype.$getUserMenu = (callback) => {
        Vue.prototype.$loadStatis((wrongNum) => {
            // let wrongNum = 0;
            let ajaxOptions = {
                url: Vue.prototype.$baseUrl + "sys/permission/findRoleMenuList",
            }
            // 根据用户身份信息获取用户菜单
            Vue.prototype.$ajaxPost(ajaxOptions, true, (res) => {
                if (res.code === 200) {
                    let result = res.data.filter(item => item.children.length > 0)
                    let groupMenu = [];
                    let menuData = [];
                    let diffMenu = []; //->已经存在的组菜单内未拥有的数据
                    result.forEach((menu) => {
                        if (groupMenu[menu.name]) { //已經存在的組 去重
                            menu.children.forEach((item) => {
                                let isExist = false;
                                if (item.url === 'ConditionalError') {
                                    item.noDeal = wrongNum
                                }
                                groupMenu[menu.name].children.forEach((itemMenu) => {
                                    if (item.url === itemMenu.url) {
                                        isExist = true;
                                    }
                                });
                                if (!isExist)
                                    diffMenu.push(item);
                            })
                            groupMenu[menu.name].children.push(...diffMenu);
                            diffMenu = [];
                        } else {
                            menu.children.forEach((item) => {
                                if (item.url === 'ConditionalError') {
                                    item.noDeal = wrongNum
                                }
                            })
                            groupMenu[menu.name] = menu;
                        }
                    });
                    for (let key in groupMenu)
                        menuData.push(groupMenu[key]);
                    if (sessionStorage.showSecurity == '1'){
                        let secretLevelList = JSON.parse(sessionStorage.secretLevelList)
                        menuData.forEach(item =>{
                            item.children.forEach(item2 =>{
                                let temp = secretLevelList.find((item3)=>{
                                    return item3.code === item2.securityClassifiedCode
                                })
                                if(temp){
                                    item2.systemLevelColor = temp.color;
                                    item2.systemLevelCText = temp.systemSecurityName;
                                    item2.visible = temp.visible;
                                }else{
                                    item2.systemLevelColor = '#198fff';
                                    item2.systemLevelCText = '未知密级';
                                    item2.visible = '1';
                                }
                            })
                        })
                    }
                    localStorage.setItem(store.state.sysPrefix + 'userMenu', JSON.stringify(menuData));
                    store.commit("updateMenuData", menuData);
                    store.commit("updateOpenMenu", false); //每次进去必须让菜单隐藏
                    if (callback)
                        callback();
                } else {
                    Vue.prototype.$showMsg("error", res.message);
                }
            })
        })
    };
    //表单验证
    Vue.prototype.$validate = new function () {
        let that = this;
        //验证返回信息
        this.validateMessage = {
            required: '必填项不能为空',
            number: '请输入整数或2位小数的数字',
            integer: '只能输入整数',
            float: '请输入整数或者2位小数的数字',
            minlength: '请至少输入{0}位数据',
            maxlength: '最多只能输入{0}位数据',
            max: '请输入小于等于{0}的数值',
            min: '请输入大于等于{0}的数值',
            faxNum: '请输入正确的传真号格式',
            phoneVal: '请输入正确的座机号格式',
            mobileVal: '请输入正确的手机号格式',
            letter:'请输入以字母为首的格式',
            phoneAndMobile: '请输入正确的电话号码格式',
            identityNumber: '请输入正确的身份证号码格式',
            identityNums: '身份证号长度错误',
            identityPattern: '身份证号格式错误',
            identityAddress: '身份证号地址编码错误',
            identityDate: '身份证号出生日期错误',
            identityCheck: '身份证号校验位错误',
            identityExistence: '该身份证号已经被使用',
            departCode: '不符合编码规范',
            passWord: '请输入6-12位包含大小写字母和数字',
            passWord_rz: '不能少于8位且必须由字母和数字组成',
            yearAndMonth: '请输入数据格式为NN年NN月'
        }
        //验证类型规则
        this.methods = {
            required: (value) => {
                if (value === 0 || value === false)
                    return true;
                if (!value)
                    return false;
                let length = Array.prototype.isPrototypeOf(value) ? value.length : value.length || value > 0;
                return length > 0
            },
            passWord: (value) => {
                if (value === "" || value === null)
                    return true;
                // const reg = /^[a-zA-Z0-9]{6,12}$/;
                const reg = /(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z]).{6,12}/
                const result = reg.test(value);
                return result
            },
            passWord_rz: (value) => {
                if (value === "" || value === null)
                    return false;
                // const reg = /^[a-zA-Z0-9]{6,12}$/;
                // const reg = /(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z]).{6,12}/
                const reg = /^(?=.*[a-zA-Z])(?=.*[0-9])[a-zA-Z0-9]{8,}$/
                const result = reg.test(value);
                return result
            },
            yearAndMonth: (value)=>{
                 if (value === "" || value === null)
                     return true
                     // const reg = /^[a-zA-Z0-9]{6,12}$/;
                 const reg = /^(\d*[年|月]){1,2}$/
                 const result = reg.test(value);
                 return result
            },
            number: (value) => {
                if (value === "" || value === null)
                    return true;
                const reg = /^\d+(\.\d{0,2})?$/;
                const result = value > 0 ? reg.test(value / 1) : reg.test(value / -1);
                return result
            },
            integer: (value) => {
                if (value === "" || value === null)
                    return true;
                const reg = /^[1-9]+\d*?$/; //
                const result = value > 0 ? reg.test(value / 1) : reg.test(value / -1);
                return result
            },
            float: (value, param) => {
                if (value === "" || value === null)
                    return true;
                value = Number(value)
                const reg =    /^\d+(\.\d{0,2})?$/;
                const result = reg.test(value/1);
                return result
            },
            minlength: (value, param) => {
                let length = Array.prototype.isPrototypeOf(value) ? value.length : value.trim().length;
                return length >= param
            },
            maxlength: (value, param) => {
                let length = Array.prototype.isPrototypeOf(value) ? value.length : value.trim().length;
                return length <= param
            },
            max: (value, param) => {
                return param >= value;
            },
            min: (value, param) => {
                return param <= value;
            },
            faxNum: (value) => {
                if (value === "" || value === null)
                    return true;
                const reg = /^(\d{3,4}-)?\d{7,8}$/;
                const result = reg.test(value);
                return result
            },
            phoneVal: (value) => {
                if (value === "" || value === null)
                    return true;
                const reg = /^0\d{2,3}-\d{7,8}$/;
                const result = reg.test(value);
                return result
            },
            letter: (value) => {
                if (value === "" || value === null)
                    return true;
                const reg = /^(\$|[a-zA-Z_])/;
                const result = reg.test(value);
                return result

            },
            mobileVal: (value) => {
                if (value === "" || value === null)
                    return true;
                const reg = /^(13[0-9]|14[579]|15[0-3,5-9]|16[0-9]|17[0-9]|18[0-9]|19[0-9])\d{8}$/;
                const result = reg.test(value);
                return result
            },
            phoneAndMobile: (value) => {
                if (value === "" || value === null)
                    return true;
                const regMobile = /^(13[0-9]|14[579]|15[0-3,5-9]|16[6]|17[0135678]|18[0-9]|19[0-9])\d{8}$/;
                const regPhone = /^\d{7,8}$/; ///^0\d{2,3}-\d{7,8}$/;
                const result = regMobile.test(value) ? regMobile.test(value) : regPhone.test(value);
                return result;
            },
            departCode: (value) => {
                if (value === "" || value === null)
                    return true;
                // |(\d{3}\.\d{3})|(\d{3}\.\d{3}\.\d{3})
                // const reg = /\d{3}[\.]?\d{3}[\.]?\d{3}/; //
                const reg = /^\d{3}$/
                let result = true
                let arr = value.split('.')
                arr.forEach(item => {
                    if(item.length != 3) {
                        result = false
                        return false
                    } else {
                        let result2 = reg.test(item);
                        if(!result2){
                            result = false
                        }
                    }
                })
                return result
            },
            identityNumber: (value) => {
                if (value === "" || value === null)
                    return true;
                const reg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
                const result = reg.test(value);
                console.log(result)
                return result;
            },
            identityNums: (value) => {
                if (value === "" || value === null)
                    return true;
                if((value.length < 18 && value.length > 15) || value.length < 15 || value.length > 18){
                    return false;
                } else {
                    return true
                }
            },
            identityPattern: (value) => {
                if (value === "" || value === null)
                    return true;
                if(value.indexOf("000000000000000000")!=-1 && value.length===18){
                    return true;
                } else {
                    if(value.indexOf("111111111")!=-1){
                        return false;
                    } else {
                        if (!value || ! /(^\d{15}$)|(^\d{17}(\d|X)$)/) {
                            return false;
                        } else {
                            return true;
                        }
                    }

                }
            },
            identityAddress: (value) => {
                if (value === "" || value === null)
                    return true;
                let city = { 11: "北京", 12: "天津", 13: "河北", 14: "山西", 15: "内蒙古", 21: "辽宁", 22: "吉林", 23: "黑龙江 ", 31: "上海", 32: "江苏", 33: "浙江", 34: "安徽", 35: "福建", 36: "江西", 37: "山东", 41: "河南", 42: "湖北 ", 43: "湖南", 44: "广东", 45: "广西", 46: "海南", 50: "重庆", 51: "四川", 52: "贵州", 53: "云南", 54: "西藏 ", 61: "陕西", 62: "甘肃", 63: "青海", 64: "宁夏", 65: "新疆", 71: "台湾", 81: "香港", 82: "澳门", 91: "国外 " };
				if (!city[value.substr(0, 2)]) {
					return false;
				} else {
                    return true
                }
            },
            identityDate: (value) => {
                if (value === "" || value === null)
                    return true;
                if (value.length == 18) {
                    let month=value.substring(10, 12);
                    if(month>12||month==0){
                        return false;
                    } else {
                        return true;
                    }
                    let day=value.substring(12, 14);
                    if(month>31){
                        return false;
                    } else {
                        return true;
                    }
                    let age = new Date().getFullYear() - value.substring(6, 10);
                    if(age<0){
                        return false;
                    } else {
                        return true;
                    }
                }else{
                    let month=value.substring(10, 12);
                    if(month>12||month==0){
                        return false;
                    } else {
                        return true
                    }
                    let day=value.substring(12, 14);
                    if(month>31){
                        return false;
                    } else {
                        return true
                    }
                    // if(value.length>18){
                    //     return false;
                    // } else {
                    //     return true
                    // }
                }
            },
            identityExistence: (val)=>{
                let ajaxOptions = {
                   data: {
                      A001003: val,
                    },//兼容改了报错
                    method: "get",
                    url: Vue.prototype.$baseUrl + "cadre/checkIdCard?"
                }
                Vue.prototype.$ajaxPost(ajaxOptions,false,(res)=>{
                      if(res.data == '1'){
                          callback(false)
                      }else{
                          callback(true)
                      };
                })
            },
            identityCheck: (value) => {
                if (value === "" || value === null)
                    return true;
                //∑(ai×Wi)(mod 11)
                //加权因子
                let factor = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2];
                //校验位
                let parity = [1, 0, 'X', 9, 8, 7, 6, 5, 4, 3, 2];
                let sum = 0;
                let ai = 0;
                let wi = 0;
                let idCardLast = value.substring(17);
                for (let i = 0; i < 17; i++) {
                    ai = value[i];
                    wi = factor[i];
                    sum += ai * wi;
                }
                let last = parity[sum % 11];
                if(last==2){
                    if(idCardLast == "X" || idCardLast == "x"){
                        return false;
                    } else {
                        return true;
                    }
                }else{
                    if (parity[sum % 11] != value[17]) {
                        return false;
                    } else {
                        return true;
                    }
                }
            },
            existData: (val, callback) => { }

        }
        //保存时初始化验证数据
        this.validRules = (rules, form) => {
            for (var key in rules) {
                if (!rules[key].valid || rules[key].valid == undefined) {
                    Vue.set(rules[key], 'valid', true)
                    Vue.set(rules[key], 'msg', '')
                } else
                    rules[key].valid = true
            }
            let rulesResult = true
            for (var ruleName in rules) {
                var checkRuleOptions = {
                    ruleName: ruleName,
                    rule: rules[ruleName],
                    form: form
                }
                rulesResult = that.checkRules(checkRuleOptions) && rulesResult;
            }
            return rulesResult
        }
        //保存时验证详细数据
        this.checkRules = (options) => {
            let parentName = options.parentName; //->在form保存数据中的父级key
            let arrayIndex = options.arrayIndex; //->在form保存数据中的父级是数组的当前下标
            let ruleName = options.ruleName; //->需要验证的数据key
            let rule = options.rule; //->验证类型
            let form = options.form; //->form保存数据
            let ruleResult = true; //->验证通过与否
            for (var ruleKey in rule) {
                if (!rule[ruleKey]) {
                    return (ruleResult = true)
                }
                if (typeof that.methods[ruleKey] === 'function') {
                    let param = rule[ruleKey];
                    let result = null;
                    if (parentName) {
                        if (arrayIndex !== undefined) { //standardNam
                            result = that.methods[ruleKey](form[parentName][arrayIndex][ruleName], param)
                        } else {
                            result = that.methods[ruleKey](form[parentName][ruleName], param)
                        }
                    } else {
                        result = that.methods[ruleKey](form[ruleName], param)
                    }
                    /*控制台输出提示开始*/
                    let showText = ruleName + ' ' + ruleKey + ' result';
                    if (parentName)
                        showText = parentName + ' ' + showText;
                    console.log(showText, result);
                    /*控制台输出提示结束*/
                    if (!result) {
                        rule.valid = false
                        ruleResult = false
                        rule.msg = that.validateMessage[ruleKey].replace(
                            '{0}',
                            rule[ruleKey] && rule[ruleKey]!=0?rule[ruleKey]:4
                        )
                        break
                    }
                }
            }
            return ruleResult
        }
        //值切换时验证初始化数据
        this.validRule = (rule, val) => {

            if (!rule.valid || rule.valid == undefined) {
                Vue.set(rule, 'valid', true);
                Vue.set(rule, 'msg', '');
            } else
                rule.valid = true;
            let rulesResult = true;
            rulesResult = that.checkRule(rule, val) && rulesResult;
            return rulesResult
        }
        //值切换时验证详细数据
        this.checkRule = (rule, val) => {
            let ruleResult = true;
            for (var ruleKey in rule) {
                if (!rule[ruleKey]) {
                    return (ruleResult = true);
                }
                if (typeof that.methods[ruleKey] === 'function') {
                    let param = rule[ruleKey];

                    let result = that.methods[ruleKey](val, param)
                    if (!result) {
                        rule.valid = false
                        ruleResult = false
                        rule.msg = that.validateMessage[ruleKey].replace(
                            '{0}',
                            // rule[ruleKey]
                            rule[ruleKey] && rule[ruleKey]!=0?rule[ruleKey]:4
                        )
                        break
                    }
                }
            }
            return ruleResult;
        }
    }();

    //js代码格式化
    Vue.prototype.$dataStrBeautify = (data, spaceCount = 0) => {
        spaceCount++
        let type = Vue.prototype.$getType(data)
        let str = ''
        if (type === 'array') {
            str += '[\n'
            if (data.length <= 0) {
                return '[]'
            } else {
                let spaceStr = '';
                let endStr = '';
                for (let j = 0; j < spaceCount; j++) {
                    spaceStr += '\xa0\xa0\xa0\xa0\xa0';
                    if (j < spaceCount - 1)
                        endStr += '\xa0\xa0\xa0\xa0\xa0';
                }
                for (let i = 0; i < data.length; i++) {
                    str += `${spaceStr}${this.$dataStrBeautify(data[i], spaceCount)}${i < data.length - 1 ? ',\n' : '\n'}`
                }
                str += endStr + ']'
            }
        } else if (type === 'object') {
            str += '{\n'
            if (Object.keys(data).length <= 0) {
                return '{}'
            } else {
                let index = 0
                let spaceStr = ''
                let endStr = ''
                for (let j = 0; j < spaceCount; j++) {
                    spaceStr += '\xa0\xa0\xa0\xa0\xa0';
                    if (j < spaceCount - 1)
                        endStr += '\xa0\xa0\xa0\xa0\xa0';
                }
                for (let key in data) {
                    index++
                    str += `${spaceStr}"${key}":${Vue.prototype.$dataStrBeautify(data[key], spaceCount)}${index < Object.keys(data).length ? ',\n' : '\n'}`
                }
                str += endStr + '}'
            }
        } else if (type === 'number') {
            return data
        } else if (type === 'function') {
            return '"' + data + '"'
        } else {
            return `"${data}"`
        }
        return str
    };

    //获取页面相对高度
    Vue.prototype.$getHeight = (event, offset, rate) => {
        if(!$(event)[0]) return
        if (!offset)
            offset = 0;
        if (!rate)
            rate = 0.5;
        let windowHeight = $(window).height();
        let offsetTop = $(event)[0].getBoundingClientRect().top;
        let result = (windowHeight - offsetTop - offset) * rate;
        let maxHeight = windowHeight - offsetTop - offset;
        return {
            height: result,
            maxHeight: maxHeight
        };
    };

    //请求动态的数据
    Vue.prototype.$loadCadreInfo = (options, callback) => {
        let ajaxOptions = {
            data: {
                appCode: "200",
                tableTypeName: "CadreInfo",
                tableName: "",
                tableNamePK: "",
                tableNamePKValue: "",
                tableNameFK: "",
                tableNameFKValue: ""
            },//兼容改了报错
            method: "get",
            url: Vue.prototype.$baseUrl + "sys/getSysTableData?"
        };
        ajaxOptions.data = Vue.prototype.$mergeObj(ajaxOptions.data, options, true);
        Vue.prototype.$ajaxPost(ajaxOptions, true, (res) => {
            if (res.code === 200) {
                callback(res.data);
            } else {
                Vue.prototype.$showMsg("error", res.message);
                callback();
            }
        })
    };

    //请求动态的vue模板
    Vue.prototype.$loadCadreVue = (options, callback) => {

		let userInfo = JSON.parse(localStorage.getItem('userInfo'));
        let ajaxOptions = {
            data: {
                prjCode: "200",
                tableTypeName: "CadreInfo",
                tableName: "",
				userId:''
            },//兼容改了报错
            method: 'get',
            url: Vue.prototype.$baseUrl + "sys/getSysTableStructure?"
        }
        ajaxOptions.data = Vue.prototype.$mergeObj(ajaxOptions.data, options, true);
        Vue.prototype.$ajaxPost(ajaxOptions, true, (res) => {
            if (res.code === 200) {
                callback(res.data);
            } else {
                Vue.prototype.$showMsg("error", res.message);
                callback();
            }
        })
    };

    //导出表格/表单
    Vue.prototype.$downLoad = (options, encode) => {
        let ajaxOptions = {
            data: {},
            url: Vue.prototype.$baseUrl + "export/gbhmc/generateAndExport", //花名册
        };
        ajaxOptions = Vue.prototype.$mergeObj(ajaxOptions, options);
        for (let key in ajaxOptions.data) {
            ajaxOptions.url += `${key}=${ajaxOptions.data[key]}&`;
        }
        ajaxOptions.url = ajaxOptions.url.substring(0, ajaxOptions.url.length - 1);
        if (encode)
            ajaxOptions.url = encodeURI(ajaxOptions.url);
        console.log(ajaxOptions.url)
        // window.location.href = ajaxOptions.url;
        window.open(ajaxOptions.url, '_blank');
    };

    //导出表格POST方式
    Vue.prototype.$exportExcel = (options, type) => {
        let fileName = "";
        let ajaxOptions = {
            responseType: 'blob',
            data: {},
        };
        if (options.fileName)
            fileName = options.fileName;
        delete options.fileName;
        ajaxOptions = Object.assign(ajaxOptions, options);
        Vue.prototype.$ajaxPost(ajaxOptions, true, (data) => {
            let blob = null;
            switch (type) {
                case "doc":
                    blob = new Blob([data], {
                        type: "application/vnd.ms-word;charset=utf-8"
                    });
                    break;
                case "zip":
                    blob = new Blob([data], {
                        type: 'application/zip'
                    });
                    break;
                case "xls":
                    blob = new Blob([data], {
                        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8'
                    });
                    break;
                default:
                    break;
            }
            if (window.navigator.msSaveOrOpenBlob) {
                navigator.msSaveBlob(blob);
            } else {
                let elink = document.createElement('a');
                elink.download = fileName;
                elink.style.display = 'none';
                elink.href = URL.createObjectURL(blob);
                document.body.appendChild(elink);
                elink.click();
                document.body.removeChild(elink);
            }
        })
    };

    //导出表格
    Vue.prototype.$exportFile = (options, callback) => {
        let url = options.url;
        let params = options.data;
        let downForm = document.createElement('form'); //创建一个form表单
        downForm.id = 'downForm'; //该表单的id为downForm
        downForm.name = 'downForm'; //该表单的name属性为downForm
        downForm.className = 'x-hidden'; //该表单为隐藏的
        downForm.action = url; //表单的提交地址
        downForm.method = 'post'; //表单的提交方法
        for (let key in params) {
            let input = document.createElement('input'); //创建一个input节点
            input.type = 'hidden'; //隐藏域
            input.name = key; //需要传递给后台的参数名
            input.value = params[key]; //参数值
            downForm.appendChild(input); //将input节点追加到form表单里面
        }
        document.body.appendChild(downForm);
        $('#downForm').submit(); //调用form表单的submit方法，提交表单，从而开始下载文件
        document.body.removeChild(downForm);
        if (callback)
            callback();
    };

    //深度拷贝
    Vue.prototype.$deepClone = (options) => {
        let dataType = Vue.prototype.$getType(options);
        let result = dataType === "array" ? [] : {};
        return $.extend(true, result, options);
    };

    //合并对象
    Vue.prototype.$mergeObj = (data, mergeData, deep) => {
        if (deep === undefined)
            deep = true;
        return $.extend(deep, data, mergeData);
    }

    //对象之间的差异化取值
    Vue.prototype.$diffObject = (options, diffOptions) => {
        let result = {};
        for (var key in options) {
            if (diffOptions[key] !== options[key])
                result[key] = diffOptions[key];

        }
        return result;
    };
    //获取数据类型
    Vue.prototype.$getType = (obj) => {
        //tostring会返回对应不同的标签的构造函数
        var toString = Object.prototype.toString;
        var map = {
            '[object Boolean]': 'boolean',
            '[object Number]': 'number',
            '[object String]': 'string',
            '[object Function]': 'function',
            '[object Array]': 'array',
            '[object Date]': 'date',
            '[object RegExp]': 'regExp',
            '[object Undefined]': 'undefined',
            '[object Null]': 'null',
            '[object Object]': 'object'
        };
        if (obj instanceof Element) {
            return 'element';
        }
        return map[toString.call(obj)];
    };
    //获取时间名称
    Vue.prototype.$getTimeName = () => {
        let hour = Vue.prototype.$moment().hours();
        if (hour < 6) {
            return "凌晨好！"
        } else if (hour < 9) {
            return "早上好！"
        } else if (hour < 12) {
            return "上午好！"
        } else if (hour < 14) {
            return "中午好！"
        } else if (hour < 17) {
            return "下午好！"
        } else if (hour < 19) {
            return "傍晚好！"
        } else if (hour < 22) {
            return "晚上好！"
        } else {
            return "夜里好！"
        }
    };

    //批量修改/修改
    Vue.prototype.$opRequest = (options,callback) => {
        console.log(options)
        let requestUrl = {
            delete: Vue.prototype.$baseUrl + "sys/deleteSysTableData?",
            save: Vue.prototype.$baseUrl + "sys/saveSysTableData?",
            update: Vue.prototype.$baseUrl + "sys/updateSysTableData?",
            multipleSave: Vue.prototype.$baseUrl + "sys/batchSaveSysTableData?",
            multipleUpdate: Vue.prototype.$baseUrl + "sys/batchUpdateSysTableData?",
        }
        let dataFields = Vue.prototype.$dataFields[sessionStorage.local] 
        let ajaxOptions = {
            data:{
                appCode: dataFields.appCode,
                tableName: dataFields.tableName,
                tableTypeName: dataFields.tableTypeName,
                tableNamePK: dataFields.tablePk, //主键
                tableNamePKValue: "",
                tableNameFKValue: "",
                tableNameFK: "",//->外键
                // tableName: this.multipleInfo.tableNameEn,
                // form: JSON.stringify(form),
            },
        };
        ajaxOptions.data = Object.assign(ajaxOptions.data,options.data);
        // for(let key in ajaxOptions.data.form) {
        //     if(ajaxOptions.data.form[key] === undefined)
        //         ajaxOptions.data.form[key] = ''
        // }
        if(ajaxOptions.data.form)
            ajaxOptions.data.form = JSON.stringify(ajaxOptions.data.form);
        if(dataFields.operateKey)
            ajaxOptions.data[dataFields.operateKey] = options.operateId;
        ajaxOptions.url = requestUrl[options.operate];
        console.log("aaaa",ajaxOptions)
        Vue.prototype.$ajaxPost(ajaxOptions,true,(res)=> {
            callback(res);
        })
    };

    Vue.prototype.$opRequest2 = (options,callback) => {
      console.log(options)
      let requestUrl = {
        delete: Vue.prototype.$baseUrl + "sys/deleteSysTableData?",
        save: Vue.prototype.$baseUrl + "sys/saveSysTableData?",
        update: Vue.prototype.$baseUrl + "sys/updateSysTableData?",
        multipleSave: Vue.prototype.$baseUrl + "sys/batchSaveSysTableData?",
        multipleUpdate: Vue.prototype.$baseUrl + "sys/batchUpdateSysTableData?",
      }
      let dataFields = {
        appCode: options.appCode || "200",
        tableName: options.tableName,
        tableTypeName: options.tableTypeName || "CadreInfo",
        tableNamePK: options.tablePk, //主键
        tableNamePKValue: "",
        tableNameFKValue: "",
        tableNameFK: "",//->外键
      }
      let ajaxOptions = {
        data:{
          appCode: dataFields.appCode,
          tableName: dataFields.tableName,
          tableTypeName: dataFields.tableTypeName,
          tableNamePK: dataFields.tablePk, //主键
          tableNamePKValue: "",
          tableNameFKValue: "",
          tableNameFK: "",//->外键
          // tableName: this.multipleInfo.tableNameEn,
          // form: JSON.stringify(form),
        },
      };
      ajaxOptions.data = Object.assign(ajaxOptions.data,options.data);
      // for(let key in ajaxOptions.data.form) {
      //     if(ajaxOptions.data.form[key] === undefined)
      //         ajaxOptions.data.form[key] = ''
      // }
      if(ajaxOptions.data.form)
        ajaxOptions.data.form = JSON.stringify(ajaxOptions.data.form);
      if(dataFields.operateKey)
        ajaxOptions.data[dataFields.operateKey] = options.operateId;
      ajaxOptions.url = requestUrl[options.operate];
      console.log("aaaa",ajaxOptions)
      Vue.prototype.$ajaxPost(ajaxOptions,true,(res)=> {
        callback(res);
      })
    };
    Vue.prototype.$getCookie = (name)=>{
        var v = window.document.cookie.match('(^|;) ?' + name + '=([^;]*)(;|$)');
        return v ? v[2] : null;
    };
    Vue.prototype.$setCookie = (name, value, days)=>{
        var d = new Date;
        d.setTime(d.getTime() + 24*60*60*1000*days);
        window.document.cookie = name + "=" + value + ";path=/;expires=" + d.toGMTString();
    };
    Vue.prototype.$getCodeName = (codeKey,code)=>{
        let temp = store.getters.codeData[codeKey].sysCodeItemModels.find(item =>{
            return item.code === code;
        })
        if (temp){
            return temp.name
        }else{
            return ""
        }
    };

};
export default util;
