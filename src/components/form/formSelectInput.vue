<template>
  <div class="formSelectInput">
    <slot :inputVal="inputVal">
      <formInput ref="formInput" v-model="inputVal" :disabled="disabled" :readonly='readonly'
                 :placeholder="placeholder" search="选择" @search="searchClick" @blur="blur" :rule="rule"></formInput>
    </slot>
    <commonDialog v-if="showHandle" class="filter" :title='placeholder?placeholder:"代码集选择"' appendBody
                  :visible.sync="dialogVisible"
                  :save="save" width="600px">
      <div class="codeSelectorTab-item">
        <commonTablistX class="padding" position="top" :options="tabsXData" v-model="checkedX"/>
        <formInput v-model="filterText" @iconClick="onFilter" suffixIcon="el-icon-search" class="search"/>
      </div>
      <div class="codeSelectorContent-item">
        <!--        <commonTree ref="allTree" v-if="dialogVisible&&checkedX===1" height="100%" autoHeight v-model="checkedVal"-->
        <!--                    checkStrictly-->
        <!--                    :multiple="multiple" :selectable="multiple" :props="props" :options="treeData"-->
        <!--                    @nodeClick="nodeClick" @checkedChange="checkedChange">-->
        <!--        </commonTree>-->
        <commonTree ref="allTree" v-if="dialogVisible&&checkedX===1" height="100%" autoHeight v-model="checkedVal"
                    checkStrictly
                    :multiple="multiple" :selectable="multiple" :props="props" :options="treeData"
                    @nodeClick="nodeClick" @checkedChange="checkedChange">
        </commonTree>
        <commonTree ref="stockTree" v-if="dialogVisible&&checkedX===0" height="100%" autoHeight v-model="checkedVal"
                    checkStrictly
                    :multiple="multiple" :selectable="multiple" :props="props" :options="stockData"
                    @nodeClick="nodeClick" @checkedChange="checkedChange">
        </commonTree>
      </div>


      <el-button slot="more" type="danger" @click="clear()">清空</el-button>
    </commonDialog>
    <slot v-else name="merge"></slot>
  </div>
</template>

<script>
export default {
  name: 'formSelectInput',
  props: {
    readonly: {                                             //是否可输入
      type: Boolean,
      default: true,
    },
    label: [String, Number, Array],                            //显示文字
    value: [String, Number, Array],                            //值
    name: [String, Number, Array],                             //中文输出
    disabled: {                                              //是否禁用
      type: Boolean,
      default: false
    },
    showHandle: {
      type: Boolean,
      default: true
    },
    checkedAll: {                                               //是否可以选择根节点，如果是调用initChecked()方法更改所有的isFalse
      type: Boolean,
      default: false
    },
    checkName: {
      type: String,
    },
    multiple: {                                              //是否多选
      type: Boolean,
      default: false
    },
    changeData: [String, Number],                            // 调入调出功能中变动类别区分显示（调出不显示增加类，调入不显示减少类）
    options: Array,                                          //数据
    codeKey: String,                                         //本地码值key
    rule: Object,                                            //验证规则
    placeholder: String,                                     //提示文字
    props: {                                                 //配置
      type: Object,
      default: () => {
        return {
          value: "code",
          label: "nameCn",
          codeName: "name",
          children: "children",
          icon: "iconfont icon-biaodan blue",
          childrenIcon: "iconfont icon-biaodan blue",
          isFalse: "isFalse"
        }
      }
    },
    stockKey: String
  },
  data() {
    return {
      filterText: '',
      checkedX: 0,
      tabsXData: [
        {name: "常用代码", type: 0},
        {name: "所有代码", type: 1}
      ],
      stockData: [],
      dialogVisible: false,
      checkedVal: null,
      treeName: null,
      treeCodeName: null,
      checkedData: null,
      data: [],
      treeData: [],
      codeData: this.$store.getters.codeData,
    }
  },
  computed: {
    // codeName() {
    //   if (this.value && this.treeData.length > 0) {
    //     let result = this.data.filter((item) => {
    //       return item.code === this.value;
    //     });
    //     if (result.length > 0)
    //       return result[0][this.props.label];
    //   }
    //   return this.label ? this.label : "";
    // },
    codeName() {
      if (this.value && this.treeData.length > 0) {
        if (Array.isArray(this.value) && this.value.length > 0) {
          let results = [];
          this.value.forEach(item => {
            let result = this.data.find((item2) => {
              return item2.code === item;
            });
            if (result) {
              results.push(result[this.props.label]);
            }
          })
          return results.join(',')
        } else {
          let result = this.data.filter((item) => {
            return item.code === this.value;
          });
          if (result.length > 0) {
            return result[0][this.props.label];
          }
        }
      } else {
        return this.label ? this.label : "";
      }

    },
    inputVal: {
      get() {
        if (this.label)
          return this.label;
        return this.codeName;
      },
      set(val) {
        this.$emit("update:label", val)
      }
    },
    tagData() {
      return this.$store.getters.tagData;
    },
    refresh() {
      return this.$store.state.selectRefresh
    },
    StockKey() {
      return this.stockKey || this.codeKey
    }
  },
  watch: {
    refresh(val) {
      if (val && this.codeKey == val)
        this.initData()
      this.$store.commit('updateSelectRefresh', '')
    },
    options: {
      handler() {
        this.treeData = this.$deepClone(this.options);
      }
    },
    codeKey() {
      this.initData();
    },
    changeData() {
      this.initData();
    },
  },
  created() {
    this.initData();
  },
  methods: {
    onFilter(val) {
      if (this.checkedX === 0) {
        this.$refs.stockTree.$refs.tree.filter(val)
      } else {
        this.$refs.allTree.$refs.tree.filter(val)
      }
    },
    //初始化数据
    initKey(data, resultData) {
      data.forEach((item) => {
        resultData.push(item);
        if (item.children && item.children.length > 0) {
          this.initKey(item.children, resultData);
        }
      })
    },
    //初始化key
    initData() {
      //使用本地code
      if (this.codeKey) {
        //->标签数据
        if (this.tagData[this.codeKey]) {
          this.treeData = this.tagData[this.codeKey];
          let data = [];
          this.initKey(this.treeData, data);
          this.data = data;
          return
        }
        ;
        let parentCode = [this.codeKey];
        if (this.codeKey === "DM123") {
          parentCode.push(...["1", "2"]);
        }
        this.data = this.codeData[this.codeKey].sysCodeItemModels.map((item) => {
          let data = this.$deepClone(item);
          data.nameCn = `[${data.code}]${data.name}`;
          return data;
        }).sort((a, b) => {
          return a.ordinal - b.ordinal; // 从小到大排序
        });
        let resultData = [];
        /* let resultObj = {};
         this.data.forEach((item)=> {
             if(!item.parentCode || ~parentCode.indexOf(item.parentCode)){
                 resultData.push(item);
             }
             else{
                 if(!resultObj[item.parentCode]) {
                     resultObj[item.parentCode] = [];
                 }
                 resultObj[item.parentCode].push(item)
             }
         })

         for(let key in resultObj) {
             this.initTreeData(resultData,key,resultObj);
         }*/
        resultData = this.handlerCode();
        // 调入调出特殊处理（筛选数据返回）
        if (this.changeData) {
          let arrList = []
          if (this.codeKey == 'BT0215' || this.codeKey == 'BT0305') {
            if (this.changeData == '1') {
              arrList = resultData.filter(item => {
                return item.code == '2'
              })
              resultData = arrList
            }
            if (this.changeData == '2') {
              arrList = resultData.filter(item => {
                return item.code == '1'
              })
              resultData = arrList
            }
          }
        }
        if (this.checkedAll) {
          let arr = this.$deepClone(resultData)
          this.initChecked(arr)
          this.treeData = arr;
        } else {
          this.treeData = resultData;
        }
      }
      // debugger
      //外部传入的数据
      if (this.options) {
        this.treeData = this.$deepClone(this.options);
      }
      if (this.checkedX === 0) {
        this.stockData = JSON.parse(localStorage.getItem(`stock_${this.StockKey}`)) || []
      }
      this.getStockData()
    },
    // 设置所有树节点都可以选择
    initChecked(data) {
      data.forEach(item => {
        let len = item.children ? item.children.length : 0
        item.isFalse = false
        item.disabled = false
        if (len > 0) {
          this.initChecked(item.children)
        }
      })
    },
    //初始化树形
    initTreeData(resultData, key, resultObj) {
      resultData.forEach((item) => {
        if (item.children && item.children.length > 0) {
          this.initTreeData(item.children, key, resultObj)
        } else {
          item.children = [];
          if (item.code === key) {
            item.children.push(...resultObj[key]);
            delete resultObj[key];
          }
        }
      })
    },
    //点击按钮
    searchClick() {
      this.checkedX = 0
      this.checkedVal = this.value;
      if (this.showHandle) {
        this.dialogVisible = true;
        if (this.checkedX === 0) {
          this.getStockData()
        }
      }
      this.$emit('searchClick')
    },
    getStockData() {
      // debugger
      let localData = JSON.parse(localStorage.getItem(`stock_${this.StockKey}`)) || []
      if (localData.length === 0) {
        this.checkedX = 1
      } else {
        localData = localData.map((item) => {
          // debugger
          let data = this.$deepClone(item);
          let valueStr = this.stockKey ? '' : `[${data[this.props.value]}]`
          data.nameCn = `${data[this.props.label]}`; 
          // data.nameCn = `${valueStr}${data[this.props.label]}`;  //不知道为什么拼接${valueStr}
          return data;
        }).sort((a, b) => {
          return a.ordinal - b.ordinal; // 从小到大排序
        });
        localData.length = 20
      }
      this.stockData = localData
    },
    //节点点击
    nodeClick(val, data) {
      if (this.multiple)
        return;
      this.checkedVal = val;
      this.treeName = data[this.props.label];
      this.treeCodeName = data[this.props.codeName];
      this.checkedData = data;
    },
    //节点选中
    checkedChange(data, checkedVal, checkedData) {
      this.checkedVal = checkedVal;
      this.treeName = this.multiple ? checkedData.map(item => item[this.props.label]).join(",") : data[this.props.label];
      this.treeCodeName = this.multiple ? checkedData.map(item => item[this.props.codeName]).join(",") : data[this.props.codeName];
      this.checkedData = checkedData;
    },
    blur() {
      this.$emit("blur")
    },
    save() {
      if (this.$refs.formInput)
        this.$refs.formInput.ruleVal();
      this.$emit("update:label", this.treeName);
      this.$emit("update:name", this.treeCodeName);
      this.$emit("input", this.checkedVal);
      this.$emit("save", this.checkedVal, this.checkedData)
      // this.setStock({
      //   value: this.checkedVal,
      //   data: this.checkedData
      // })
      if(this.$dataFields.showEditHM){
        this.setStock({
          value: this.checkedVal,
          data: this.checkedData
        })
      }
      this.dialogVisible = false;
    },
    setStock({data, value}) {
      let stock = []
      if (localStorage.getItem(`stock_${this.StockKey}`)) {
        let historyData = JSON.parse(localStorage.getItem(`stock_${this.StockKey}`))
        stock = stock.concat(historyData)
      }
      if (!stock.find(val => val[this.props.value] === value)) {
		if(this.multiple){
			data.forEach(item=>{
				for(let key in item){
					if(key == 'parentData'||key == 'children'){
						delete item[key];
					}
				}	
			});
			stock = data;
		}else{
			delete data.children
			delete data.parentData
			stock.push(data);
		}
		localStorage.setItem(`stock_${this.StockKey}`, JSON.stringify(stock))
      }
    },
    //清空
    clear() {
      this.checkedVal = null;
      this.treeName = null;
      this.checkedData = {name:''};
      this.save()
    },
    assmTree(nodeList) {
      let nodeId2treeNodes = {};
      nodeList.forEach(item => {
        nodeId2treeNodes['+' + item.code] = this.$deepClone(item)
      });
      let topNodeTrees = [];
      let ObjectKeys = Object.keys(nodeId2treeNodes)
      ObjectKeys.forEach(code => {
        let treeNode = nodeId2treeNodes[code];
        let parentCode = treeNode.parentCode;
        if (!parentCode || !nodeId2treeNodes.hasOwnProperty('+' + parentCode)) {
          topNodeTrees.push(treeNode);
        } else {
          let parentTreeNode = nodeId2treeNodes['+' + parentCode];
          if (parentTreeNode.children === null || parentTreeNode.children === undefined) {
            parentTreeNode.children = [];
          }
          parentTreeNode.children.push(treeNode);
        }
      })
      return topNodeTrees
    },
    handlerCode() {
      let nodeList = [];
      this.data.forEach(item => {
        let treeNode = this.$deepClone(item)
        nodeList.push(treeNode);
      })
      return this.assmTree(nodeList)
    }
  },
}
</script>
<style lang="scss" type="text/scss">
.codeSelectorContent-item {
  height: calc(100% - 80px);
}
</style>