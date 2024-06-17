<template>
<div class="personAdd-box">
  <commonTitle showShadow title="新增干部信息" >
    <div slot="button">
      <el-button type="warning" @click="$refs.selectOls.click()">导入ols文件</el-button>
      <input type="file" ref="selectOls" accept=".ols" @change="handleOlsChange" style="display: none;" />
      <el-button type="primary" @click="submitForm">入库</el-button>
      <el-button type="primary"  class="iconfont icon-fanhui" @click="closeTab">返回</el-button>
    </div>
  </commonTitle>
  <div class="quickEditor-wrapper-add-person h-full" ref="quickEditorWrapper">
    <div class="other">
      <subInfo :subInfoData.sycn="subInfoData"  @submit="submitForm" :rules="subInfoDataRules"></subInfo>
    </div>
    <div class="editor-wrapper">
      <div class="container" ref="section">
        <div class="items">
          <div class="item item_1">
            <div class="rows">
              <div class="row row_1">
                <div class="rowLabel required">姓名</div>
                <div class="value">
                  <div>
                    <input class="editInput" type="text"
                           v-model="renderData.a01001">
                  </div>
                </div>
                <div class="rowLabel required">性别</div>
                <div class="value">
                  <div>
                    <formCodeSelect class="genderSelector"
                                codeKey="GB/T2261.1-2003"
                                :props="{value: 'name',label: 'name'}"
                                v-model="renderData.a01004"></formCodeSelect>
                  </div>
                </div>
                <div class="birthdate rowLabel required labelColor">
                  <span >出生年月</span>
                  <!--<span>(&nbsp;&nbsp;&nbsp;&nbsp;岁)</span>-->
                </div>
                <div class="birthdate value">
                  <div>
                    <formDate
                        class="datePicker bitrth" preFixIcon="''"
                        v-model="renderData.a01007"
                        placeholder=""
                        type="month"
                        @change="birthDateInput"
                        useType/>
                    <!--<span>(&nbsp;&nbsp;{{ renderData.age }}岁)</span>-->
                  </div>
                </div>
              </div>
              <div class="row row_2">
                <div class="rowLabel required">身份证号</div>
                <!--<div class="value">-->
                <!--  <input v-model="idcard['0']" maxlength="1" class="editInput idcardInput" type="text">-->
                <!--</div>-->
                <!--<div class="value">-->
                <!--  <input v-model="idcard['1']" maxlength="1" class="editInput idcardInput" type="text">-->
                <!--</div>-->
                <!--<div class="value">-->
                <!--  <input v-model="idcard['2']" maxlength="1" class="editInput idcardInput" type="text">-->
                <!--</div>-->
                <!--<div class="value">-->
                <!--  <input v-model="idcard['3']" maxlength="1" class="editInput idcardInput" type="text">-->
                <!--</div>-->
                <!--<div class="value">-->
                <!--  <input v-model="idcard['4']" maxlength="1" class="editInput idcardInput" type="text">-->
                <!--</div>-->
                <!--<div class="value">-->
                <!--  <input v-model="idcard['5']" maxlength="1" class="editInput idcardInput" type="text">-->
                <!--</div>-->
                <!--<div class="value">-->
                <!--  <input v-model="idcard['6']" maxlength="1" class="editInput idcardInput" type="text">-->
                <!--</div>-->
                <!--<div class="value">-->
                <!--  <input v-model="idcard['7']" maxlength="1" class="editInput idcardInput" type="text">-->
                <!--</div>-->
                <!--<div class="value">-->
                <!--  <input v-model="idcard['8']" maxlength="1" class="editInput idcardInput" type="text">-->
                <!--</div>-->
                <!--<div class="value">-->
                <!--  <input v-model="idcard['9']" maxlength="1" class="editInput idcardInput" type="text">-->
                <!--</div>-->
                <!--<div class="value">-->
                <!--  <input v-model="idcard['10']" maxlength="1" class="editInput idcardInput" type="text">-->
                <!--</div>-->
                <!--<div class="value">-->
                <!--  <input v-model="idcard['11']" maxlength="1" class="editInput idcardInput" type="text">-->
                <!--</div>-->
                <!--<div class="value">-->
                <!--  <input v-model="idcard['12']" maxlength="1" class="editInput idcardInput" type="text">-->
                <!--</div>-->
                <!--<div class="value">-->
                <!--  <input v-model="idcard['13']" maxlength="1" class="editInput idcardInput" type="text">-->
                <!--</div>-->
                <!--<div class="value">-->
                <!--  <input v-model="idcard['14']" maxlength="1" class="editInput idcardInput" type="text">-->
                <!--</div>-->
                <!--<div class="value">-->
                <!--  <input v-model="idcard['15']" maxlength="1" class="editInput idcardInput" type="text">-->
                <!--</div>-->
                <!--<div class="value">-->
                <!--  <input v-model="idcard['16']" maxlength="1" class="editInput idcardInput" type="text">-->
                <!--</div>-->
                <!--<div class="value">-->
                <!--  <input v-model="idcard['17']" maxlength="1" class="editInput idcardInput" type="text">-->
                <!--</div>-->
                <div class="value">
                  <input type="text" maxlength="18"  pattern="^\d{18}$" v-model="renderData.a001003">
                </div>
              </div>
              <div class="row row_3">
                <div class="rowLabel required">民族</div>
                <div class="value">
                  <codeSelector
                      placeholder="民族选择"
                      v-model="renderData.a01017"
                      stockKey="a01017"
                      codeKey="GB/T3304-1991"/>
                </div>
                <div class="rowLabel required">籍贯</div>
                <div class="value">
                  <codeSelector
                      placeholder="籍贯选择选择"
                      v-model="renderData.a01011B"
                      stockKey="a01011B"
                      codeKey="GB/T2260-2007"/>
                </div>
                <div class="rowLabel required">出生地</div>
                <div class="value">
                  <codeSelector
                      placeholder="籍贯选择选择"
                      v-model="renderData.a01014B"
                      stockKey="a01014B"
                      codeKey="GB/T2260-2007"/>
                </div>
              </div>
              <div class="row row_4">
                <div class="rowLabel ">政治面貌</div>
                <div class="value">
                  <EmpA58 v-model="renderData.EmpA58"></EmpA58>
                </div>
                <div class="rowLabel">参加工作时间</div>
                <div class="value">
                  <formDate class="datePicker bitrth" preFixIcon="''"
                            v-model="renderData.a01034"
                            placeholder=""
                            type="month"
                            :showPlaceholder="false"
                            useType/>
                </div>
                <div class="rowLabel noSpacing ">健康状况</div>
                <div class="value">
                  <codeSelector
                      placeholder="健康状况选择"
                      v-model="renderData.a01027"
                      stockKey="a01027"
                      codeKey="GB/T2261.3"/>
                </div>
              </div>
            </div>

            <div class="photo" @click="() => this.$refs.selectImgInput.click()">
              <input ref="selectImgInput" @change="readyCutImg" type="file" accept=".jpg,.png"
                     style="position: absolute;top: -99999px">
              <img v-if="showPersonImg" :src="photoImgUrl" alt="" @error="errorImg">
            </div>
          </div>
          <div class="item item_2">
            <div class="rows">
              <div class="row row_5">
                <div class="rowLabel multipleEdit">专业技术职务</div>
                <div class="value">
                  <EmpA06 v-model="renderData.EmpA06"/>
                </div>
                <div class="rowLabel breakLine">熟悉专业有何专长</div>
                <div class="value">
                  <input class="editInput" type="text"
                         v-model="renderData.a01087">
                </div>
              </div>
            </div>
          </div>
          <div class="item item_3">
            <div class="rows">
              <div class=" row_6">
                <div class="rowLabel">学历学位</div>
                <div class="labelColor rowLabel multipleEdit">全日制教育</div>
                <div class="value">
                  <div>
                    <EmpA16 ref="Empa16" v-model="renderData.EmpA16" :show-text="{qrzxl:true}"/>
                  </div>
                  <div @click="$refs.Empa16.visible = true">
                    {{qrzxw}}
                  </div>
                </div>
                <div class="labelColor rowLabel breakLine multipleEdit">毕业院校系及专业</div>
                <div class="value">
                  <div @click="$refs.Empa16.visible = true">
                    {{ qrzyx}}
                  </div>
                  <div @click="$refs.Empa16.visible = true">

                  </div>
                </div>
                <div class="labelColor rowLabel multipleEdit">在职教育</div>
                <div class="value">
                  <div @click="$refs.Empa16.visible = true">
                    {{zzxl}}
                  </div>
                  <div @click="$refs.Empa16.visible = true">
                   {{zzxw}}
                  </div>
                </div>
                <div class="labelColor rowLabel breakLine multipleEdit">毕业院校系及专业</div>
                <div class="value">
                  <div @click="$refs.Empa16.visible = true">
                    {{zzyx}}
                  </div>
                  <div @click="$refs.Empa16.visible = true">
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="item item_4">
            <div class="rows">
              <div class="row row_7" ref="item3">
                <div class="rowLabel breakLine required multipleEdit">工作单位及职务</div>
                <div class="value">
                  <!--<input type="text" v-model="renderData.a01111">-->
                  <EmpA02 ref="EmpA02" v-model="renderData.EmpA02"/>
                </div>
              </div>
              <div class="row row_8" ref="item4_1">
                <div class="rowLabel breakLine multipleEdit">职务层次</div>
                <div class="value">
                  <EmpA05 ref="EmpA05" v-model="renderData.EmpA05"/>
                </div>
              </div>
              <div class="row row_9" ref="item4_2">
                <div class="rowLabel breakLine multipleEdit">职级信息</div>
                <div class="value">
                  <EmpA05a ref="EmpA05a" v-model="renderData.EmpA05a" />
                </div>
              </div>
            </div>
          </div>
          <div class="item item_5" ref="item5">
            <div class="rows">
              <div class="row_10">
                <div class="rowLabel breakLine required multipleEdit">简历</div>
                <div class="resume">
                  <resume v-model="renderData.a01096"
                          ref="resume"
                          :locked="renderData.a01091"
                          @change="saveResume"
                          @generate="generate"
                          @openEducation="$refs.education.openDialog()"
                          @openPosition="$refs.position.openDialog()"></resume>
                </div>
              </div>
            </div>
          </div>
          <div class="item item_6">
            <div class="rows">
              <div class="row row_11">
                <div class="rowLabel">奖惩情况</div>
                <div class="input">
                  <EmpA14A   v-model="renderData.EmpA14A"/>
                </div>
                <div class="input">
                  <EmpA14B :empA14BData.sync="renderData.EmpA14B"/>
                </div>
            </div>
            </div>
          </div>
          <div class="item item_7">
            <div class="rows">
              <div class="row row_12">
                <div class="rowLabel">年度考核结果</div>
                <div class="input">
                  <EmpA15 v-model="renderData.EmpA15"></EmpA15>
                </div>
              </div>
            </div>
          </div>

          <div class="item item_8">
            <div class="rows">
              <div class="row row_13">
                <div class="rowLabel breakLine required">家庭主要成员及重要社会关系</div>
                <div class="dutyTable">
                  <EmpA36 v-model="renderData.EmpA36"></EmpA36>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div  class="h-full illustrate ">
      <div class="top">
        <commonTitle class="bg-f3f3fa" title="填写注意事项"/>
        <div class="pl-20px">
          <p class="m-y-10px">
            1. 单击表格对应表单，在弹框内维护人员具体信息
          </p>
          <p class="m-y-10px">
            2. <span class="red">职务信息--任职机构代码选择，没有历史任职机构代码时，可在任职单位名称一栏填写名称即可</span>
          </p>
          <p class="m-y-10px">
            3. 人员入库后，请在信息库查询此人信息是否完整
          </p >
        </div>
      </div>
      <div class="bottom">
        <commonTitle class="bg-f3f3fa" title="错误信息"/>
        <div class="error-list mt-20px mb-6px" v-if="errorList.length > 0">
          <div v-for="(item,index) in errorList" :key="index" class="error-item">
            {{item}}
          </div>
        </div>
      </div>
    </div>
  </div>

  <commonDialog
      title="裁剪图片" width="620px"
      height="450"
      :visible.sync="showCutDialog"
      :showFullScreen="false"
      :save="uploadCutImg">
    <div class="cutImgArea" v-if="showCutDialog">
      <vue-cropper
          class="vueCropper"
          ref="cropper"
          :src="cropperImgSrc"
          alt="Source Image"
          :initialAspectRatio="3/4"
          :aspectRatio="3/4"
          :viewMode="2"
          dragMode="move"
          preview=".cutOverImg"
      >
      </vue-cropper>
      <div class="cutImgRight">
        <div class="cutOverImg"></div>
        <el-button
            @click="() => this.$refs.againSelectImgInput.click()"
            class="againSelectImgInput">
          上传图片
        </el-button>
        <input ref="againSelectImgInput" @change="againReadyCutImg" type="file" accept=".jpg,.png"
               style="position: absolute;top: -99999px">
      </div>
    </div>
    <div style="position:absolute;height: 40px;line-height: 40px;text-indent: 10rem">
      鼠标滚轮缩放控制图片显示大小，鼠标拖拽调整显示位置
    </div>
  </commonDialog>
</div>

</template>

<script >
import VueCropper from 'vue-cropperjs';
import 'cropperjs/dist/cropper.css';

// import testData, {subInfoTestData} from './test'
export default {
name: 'quickEditor',
props: {
  showLeftArea: {
    type: Boolean,
    default: true
  },
  showOther: {
    type: Boolean,
    default: true
  },
},
components: {
  VueCropper,
},
data() {
  return {
    familyNum: 0,
    moreTitle: '更多',
    loading: false,
    showRMB: '',
    showPersonImg: false,
    craPersonEmpId: '',
    showTagDialog: false,
    tagDialogTitle: '',
    searchTagText: '',
    dialogActiveIndex: '2',
    defaultExpandKeys: [],
    chooseTagIndex: -1,
    abilityTagList: [], //能力类标签
    workExpeTagList: [],
    tagArr: [],
    personAssessmentTagList: [],
    savePromise: null,
    tagList: [
      {
        name: '熟悉党建',
        id: '1'
      },
      {
        name: '城乡规划',
        id: '2'
      }
    ],
    searchData: [],
    historyTagList: [],
    checkTagList: [],
    checkTagIncludeInfo: [],
    showCutDialog: false,
    cropperImgSrc: '',
    cutFileName: '',
    photoImgUrl: ``,
    menus: [{
      id: 'item1',
      name: '基本信息',
      icon: 'iconfont icon-jiben',
      actived: true,
      position: 0
    },
      {
        id: 'item2',
        name: '学历信息',
        icon: 'iconfont icon-xueli',
        actived: false,
        position: 0
      },
      {
        id: 'item3',
        name: '工作单位及职务',
        icon: 'iconfont icon-work',
        actived: false,
        position: 0
      },
      {
        id: 'item4_1',
        name: '现职务层次',
        icon: 'iconfont icon-work',
        actived: false,
        position: 0
      },
      {
        id: 'item4_2',
        name: '现职级',
        icon: 'iconfont icon-work',
        actived: false,
        position: 0
      },
      // {
      //   id: 'item4',
      //   name: '干部最高职级',
      //   icon: 'iconfont icon-dengji',
      //   actived: false,
      //   position: 0
      // },

      {
        id: 'item5',
        name: '简历',
        icon: 'iconfont icon-biaodan',
        actived: false,
        position: 0
      },
      {
        id: 'item6',
        name: '奖惩情况',
        icon: 'iconfont icon-rewards',
        actived: false,
        position: 0
      },
      {
        id: 'item7',
        name: '年度考核结果',
        icon: 'iconfont icon-kaohe',
        actived: false,
        position: 0
      },
      {
        id: 'item8',
        name: '家庭成员及社会关系',
        icon: 'iconfont icon-zuzhi',
        actived: false,
        position: 0
      },
      // {
      //   id: 'item9',
      //   name: '能力标签类',
      //   icon: 'iconfont icon-mingdan',
      //   actived: false,
      //   position: 0
      // },
      {
        id: 'item10',
        name: '工作经历标签类',
        icon: 'iconfont icon-shengxu',
        actived: false,
        position: 0
      },
      // {
      //   id: 'item11',
      //   name: '个人评价标签类',
      //   icon: 'iconfont icon-shuxing',
      //   actived: false,
      //   position: 0
      // }
    ],
    controller: {
      visible: false
    },
    height: 0,
    tableOptions: [
      {
        name: '中共浙江省委',
        duty: '书记'
      }
    ],
    gridColumns: [
      {
        text: '表号',
        align: "center"
      },
      {
        text: '任职机构'
      },
      {
        text: '职务名称'
      }
    ],
    searchText: '',
    form: {},
    idcard: {
      '0': '',
      '1': '',
      '2': '',
      '3': '',
      '4': '',
      '5': '',
      '6': '',
      '7': '',
      '8': '',
      '9': '',
      '10': '',
      '11': '',
      '12': '',
      '13': '',
      '14': '',
      '15': '',
      '16': '',
      '17': ''
    },
    renderData: {
      "EmpA02": [
      ],
      "EmpA05": [
      ],
      "EmpA05a": [
      ],
      "EmpA06": [
      ],
      "EmpA14A": [
      ],
      "EmpA14B": [
      ],
      "EmpA15": [
      ],
      EmpA16: [],
      a001003: '',
      avatarImg: ''
    },
    familyList: [
      {
        'fmRel': '',
        'fmName': '',
        'fmAge': '',
        'fmParty': '',
        'fmOrgAndJob': ''
      },
      {
        'fmRel': '',
        'fmName': '',
        'fmAge': '',
        'fmParty': '',
        'fmOrgAndJob': ''
      },
      {
        'fmRel': '',
        'fmName': '',
        'fmAge': '',
        'fmParty': '',
        'fmOrgAndJob': ''
      },
      {
        'fmRel': '',
        'fmName': '',
        'fmAge': '',
        'fmParty': '',
        'fmOrgAndJob': ''
      },
      {
        'fmRel': '',
        'fmName': '',
        'fmAge': '',
        'fmParty': '',
        'fmOrgAndJob': ''
      },
      {
        'fmRel': '',
        'fmName': '',
        'fmAge': '',
        'fmParty': '',
        'fmOrgAndJob': ''
      }
    ],
    modifyFamily: [],
    chooseFamilyIndex: 0,
    subInfoData: {
      'a01015': '',
      'a01110': '',
      'a001004a': '',
      'a01052': '',
      'a01060': '',
      'a01065': '',
      'a01063': '',
      'a01057B': '',
      // 'a01034': '',
      'a01107': '',
      'a01103': '',
      'a010910': '',
      'a001004ALabel': '',
      'a01057BLabel': '',
      'ryBzlxDm': '',
      'ryZwlbDm': ''

    },
    subInfoDataRules: {
      'a001004a': {
        required: true
      },
      'a01060': {
        required: true
      },
      'a01065': {
        required: true
      },
      'a01063': {
        required: true
      },
      'ryZwlbDm': {
        required: true
      },
      'a01057B': {
        required: true
      },
      'ryBzlxDm': {
        required: true
      },
    },
    showPage: false,
    viewData: {},
    wordUrl: 'xxxx',
    lrmxUrl: 'xxxx',
    errorList: []
  };
},

created() {
  // this.renderData = testData
  // this.subInfoData = subInfoTestData
},
mounted() {
  this.initIdcardHandle()
  window.onbeforeunload =  (event) => {
    event.preventDefault();
    event.returnValue = '';
    return '';
  };
},
destroyed() {

},
computed: {
  qrzxl() { // 全日学历
    if (this.renderData.EmpA16.length > 0) {
      let qrzData =  this.renderData.EmpA16.filter(item => item.a16001.includes('1'))
      if(qrzData && qrzData.length >0) {
        return qrzData[0].a16002.split(']')[1]
      }
    } else {
      return ''
    }
  },
  qrzxw() { // 全日制学位
    if (this.renderData.EmpA16.length > 0) {
      let qrzData =  this.renderData.EmpA16.filter(item => item.a16001.includes('1'))
      if(qrzData && qrzData.length >0) {
        return qrzData[0].a16004.split(']')[1]
      }
    } else {
      return ''
    }
  },

  zzxl() { // 在职学历
    if (this.renderData.EmpA16.length > 0) {
      let zzData =  this.renderData.EmpA16.filter(item => item.a16001.includes('2'))
      if(zzData && zzData.length >0) {
        return zzData[0].a16002.split(']')[1]
      }
    } else {
      return ''
    }
  },
  zzxw() { // 在职学位
    if (this.renderData.EmpA16.length > 0) {
      let zzData =  this.renderData.EmpA16.filter(item => item.a16001.includes('2'))
      if(zzData && zzData.length >0) {
        return zzData[0].a16004.split(']')[1]
      }
    } else {
      return ''
    }
  },
  zzyx() { // 在职日学校院系
    if (this.renderData.EmpA16.length > 0) {
      let zzData =  this.renderData.EmpA16.filter(item => item.a16001.includes('2'))
      if(zzData && zzData.length >0) {
        return zzData[0].a16010 + zzData[0].a16011
      }
    } else {
      return ''
    }
  },
  qrzyx() { // 全日学校院系
    if (this.renderData.EmpA16.length > 0) {
      let zzData =  this.renderData.EmpA16.filter(item => item.a16001.includes('1'))
      if(zzData && zzData.length >0) {
        return zzData[0].a16010 + zzData[0].a16011
      }
    } else {
      return ''
    }
  },
  // idCardNumber() {
  //   if(this.idcard.length == 18) {
  //     this.form.a001003 = this.idcard.join('')
  //   }
  // }
},
watch: {
  // renderData: {
  //   handler(val) {
  //     console.log({val}, 'renderData')
  //   },
  //   deep: true
  // },
  // subInfoData: {
  //   handler(val) {
  //     console.log(val, 'subInfoData')
  //   },
  //   deep: true
  // },
  idcard: {
    handler(val) {
      let res = ''
      for (const key in val) {
        if(val[key] && typeof val[key] != 'number' ) {
          res += val[key]
        }
      }
      if(res.length == 18) {
        this.renderData.a001003 = res
      }else  {
        this.renderData.a001003 = ''
      }
    },
    deep: true
  }
},

methods: {
  // onChoseTree(key, {value, data}) {
  //     let stock = [];
  //     if (localStorage.getItem(key)) {
  //         let historyData = JSON.parse(localStorage.getItem(key));
  //         stock = stock.concat(historyData);
  //     }
  //     if (!stock.find(val => val.code === value)) {
  //         delete data.children;
  //         delete data.parentData;
  //         stock.push(data);
  //         localStorage.setItem(key, JSON.stringify(stock));
  //     }
  // },
  closeTab() {
    window.close()
  },
  handleOlsChange(e){
    const file = e.target.files[0];
    // 创建FileReader对象
    const reader = new FileReader();
    // 监听加载完成事件
    reader.onload = (event) => {
      // 解析文本内容
      const text = event.target.result;
      try {
        const jsonData = JSON.parse(text);
        console.log('ols文件',jsonData);
        jsonData.a01057B = '' // 清空 人事关系所在单位
        jsonData.a001004a = '' // 清空 统计关系所在单位
        jsonData.EmpA02.forEach(item => { // 清空 A02 任职机构代码
          item.a02001B = ''
        })
        this.renderData = jsonData
        this.subInfoData = Object.assign(this.subInfoData, this.renderData);
        this.$refs.selectOls.value = ''
        if(jsonData.avatarImg) {
          this.photoImgUrl = this.base64ToImageUrl(jsonData.avatarImg,'image/png')
          this.showPersonImg = true
        }
      } catch (err) {
        this.$message.error('解析失败');
      }
    };
    // 读取文本内容
    reader.readAsText(file);
  },
  base64ToImageUrl(base64Str, outputType) {
    let dataStr = 'data:' + outputType + ';base64,' + base64Str
    return  dataStr;
  },
  submitForm() {
    if(this.renderData.a001003.length !== 18) {
      return this.$message.error('请填写正确的身份证号码')
    }
    if(!this.renderData.a01096 ||  this.$refs.resume.$refs.editorA.hasError) {
      return this.$message.error('请填写完善并规范简历')
    }
    console.log(this.renderData,'renderData')
    let jsonData = JSON.stringify({
      ...this.renderData,
      ...this.subInfoData,
    })
    this.$ajaxPost({
      url: this.$baseUrl + 'analysis/importCadreJson',
      data: {
        json :jsonData
      }
    },true,(res) => {
      console.log(res)
      if(res.data && res.data.length > 0) {
        this.errorList = res.data;
      }else {
        this.errorList = [];
        this.$showMsg("success","添加成功！");
        this.resetForm()
      }
    })
  },
  resetForm(){
    // 重置 renderData表单
    for (const renderDataKey in this.renderData) {
      if(Array.isArray(this.renderData[renderDataKey])) {
        this.renderData[renderDataKey] = [];
      }else {
        this.renderData[renderDataKey] = '';
      }
    }
    // 清空 subInfoData
    for (const key in this.subInfoData) {
      this.subInfoData[key] = '';
    }
    // 清空身份证信息
    for (const key in this.idcard) {
      this.idcard[key] = '';
    }

    // 清空图片
    this.photoImgUrl = ''
    this.$refs.selectImgInput.value = []
  },
  saveResume(val) {
    this.renderData.a01096 = val;
  },
  generate() {
    const regExp1 = new RegExp(/^([1-9]\d{3}.(0[1-9]|1[0-2])--[1-9]\d{3}.(0[1-9]|1[0-2]))/);
    const regExp2 = new RegExp(/^([1-9]\d{3}.(0[1-9]|1[0-2])(--))/);
    const lockedList = this.renderData.a01091 ? this.renderData.a01091.split('$_') : [];
    let result = this.viewData.resume.map(val => {
      let item = `${val.resumeStartDate}         ${val.resumeContent.replace('\n', '')}`;
      if (!regExp1.test(val.resumeStartDate) && regExp2.test(val.resumeStartDate)) {
        item = `${val.resumeStartDate}         ${val.resumeContent.replace('\n', '')}`;
      } else {
        item = `${val.resumeStartDate}  ${val.resumeContent.replace('\n', '')}`;
      }
      let lockItem = lockedList.find(v => v.substr(0, 16) === item.substr(0, 16));
      if (lockItem) {
        item = lockItem;
      }
      return item;
    });
    this.$set(this.renderData, 'a01096', result.join('\n'));
  },
  birthDateInput(val) {
    this.$set(this.renderData, 'age', this.getAge(this.renderData.a01007));
  },
  uploadCutImg() {
    const img = this.$refs.cropper.getCroppedCanvas().toDataURL();
    const file = this.dataURLtoFile(img, this.cutFileName);
    this.photoImgUrl = img
    this.showPersonImg = true
    this.cropperImgSrc = '';
    this.cutFileName = '';
    this.showCutDialog = false;
    this.$refs.selectImgInput.value = ''
  },
  // base64转为图片
  dataURLtoFile(dataurl, filename) {
    var arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1];
    var extension = mime.split("/")[1];

    var bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename + "." + extension, {type: mime});
  },
  againReadyCutImg(e) {
    const file = e.target.files[0];
    this.cutFileName = file.name;
    let reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = e => {
      this.cropperImgSrc = reader.result;
      this.$refs.cropper.replace(reader.result);
    };
  },
  getAge(val) {
    let returnAge;
    let birthYear = this.$moment(val).format('YYYY');
    let birthMonth = this.$moment(val).format('MM');
    let birthDay = this.$moment(val).format('DD');
    const d = new Date();
    let nowYear = d.getFullYear();
    let nowMonth = d.getMonth() + 1;
    let nowDay = d.getDate();
    if (nowYear == birthYear) {
      returnAge = 0; //同年 则为0岁
    } else {
      let ageDiff = nowYear - birthYear; //年之差
      if (ageDiff > 0) {
        if (nowMonth == birthMonth) {
          let dayDiff = nowDay - birthDay; //日之差
          if (dayDiff < 0) {
            returnAge = ageDiff - 1;
          } else {
            returnAge = ageDiff;
          }
        } else {
          let monthDiff = nowMonth - birthMonth; //月之差
          if (monthDiff < 0) {
            returnAge = ageDiff - 1;
          } else {
            returnAge = ageDiff;
          }
        }
      } else {
        returnAge = -1; //输入有误
      }

    }
    return returnAge;
  },
  onScroll() {},
  onChange(id, position) {
    console.log(position, 'posi');
    this.$refs.section.scrollTo({top: position + 10, behavior: 'smooth'});
  },
  readyCutImg(e) {
    console.log('-===============--')
    const file = e.target.files[0];
    this.cutFileName = file.name;
    let reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = e => {
      console.log(e)
      this.cropperImgSrc = reader.result;
      this.renderData.avatarImg = reader.result.split(',')[1];
      this.showCutDialog = true;
    };
  },
  errorImg() {
    this.photoImgUrl = 'static/img/defaultAvatar.jpg';
  },
  initIdcardHandle(remove) {
    const doms = document.querySelectorAll('.idcardInput');
    for (let i = 0; i < doms.length; i++) {
      if (this.renderData['a001003'] && this.renderData['a001003'][i]) {
        this.idcard[i] = this.renderData['a001003'][i];
      } else {
        this.idcard[i] = '';
      }
      if (remove) {
        doms[i].onkeyup = null;
      } else {
        doms[i].onkeyup = (e) => {
          switch (e.keyCode) {
            case 8: //back
              doms[i - 1] ? doms[i - 1].focus() : '';
              break;
            case 37: //left
              doms[i - 1] ? doms[i - 1].focus() : '';
              break;
            case 39: //right
              doms[i + 1] ? doms[i + 1].focus() : '';
              break;
            default:
              if (this.idcard[i]) {
                this.idcard[i] = e.key;
                doms[i + 1] ? doms[i + 1].focus() : '';
              }
              break;
          }
        };
        doms[doms.length - 1].onblur = () => {
          const result = Object.values(this.idcard).join('');
          if (result.length >= 18) {
            this.renderData.a001003 = result;
            // console.log(result)
          }
        };
      }
    }
  },
}
};
</script>


<style  lang="scss" scoped>
.personAdd-box {
  height: calc(100vh - 40px);
}
.h-full {
  height: 100%;
  overflow: hidden;
}

.quickEditor-wrapper-add-person {
  box-sizing: border-box;
  height: calc(100% - 45px);
  display: flex;
  overflow: hidden;

  .editor-wrapper {
    height: 100%;
    overflow: auto;
    flex: 1;
    margin: 10px 30px;
    padding: 20px 0 50px 0;

    .container {
      width: 100%;
      //height: 100%;
      overflow: auto;
      border: 1px solid #333;
    }
    .el-date-editor.el-input {
      width: 100%;
    }


    ::v-deep .value {
      input, .el-input__inner {
        border: none;
        text-align: center;
        width: 100%;

        &:focus {
          outline: none;
        }
      }
      .el-date-editor.el-input {
        width: 100%;
      }
    }
  }

}


.item {
  //display: grid;
  width: 100%;
  overflow: hidden;

  .rows {
    flex: 1;
    width: 100%;
    overflow: hidden;

    .row {
      display: grid;
      height: 45px;
      width: 100%;
      overflow: hidden;

      &:not(:last-child) {
        border-bottom: 1px solid #333;
      }

      > div {
        display: flex;
        align-items: center;
        justify-content: center;
        text-align: center;
        border-right: 1px solid #333;
      }

      .value {
        position: relative;

        input {
          width: 90% !important;
          text-align: center;
        }
      }
    }
  }
}

.item_1 {
  display: grid;
  grid-template-columns: 1fr 142px;
  overflow: hidden;

  .photo {
    height: 180px;
    width: 142px;
    //border-bottom: 1px solid #333;
    //border-left: 1px solid #333;
    box-sizing: border-box;
    display: flex;
    justify-content: center;
    align-items: center;

    > img {
      width: 100%;
      height: 100%;
    }
  }
}

.row_1 {
  display: grid;
  grid-template-columns: 110px 1fr 110px 1fr 110px 1fr;
}

.row_2 {
  //grid-template-columns: 110px repeat(18, 1fr);
  grid-template-columns: 110px 1fr;

  .rowLabel {
    width: 110px;
  }
  .value {
    input {
      letter-spacing: 2em;
    }
  }

}

.row_3, .row_4 {
  grid-template-columns: 110px 1fr 110px 1fr 110px 1fr;
}

.row_5 {
  grid-template-columns: 110px 1fr 110px 1fr 110px 1fr 142px;
  border-top: 1px solid #333;

  .rowLabel {
    width: 110px;
  }

  & > div:nth-child(2) {
    grid-column: 2/span 3
  }

  & > div:nth-child(4) {
    grid-column: 6/span 7
  }

  & > div:last-child {
    border-right: none !important;
  }
}

.row_6 {
  display: grid;
  //grid-template-rows: 60px 60px;
  grid-template-columns: 110px 1fr 110px 1fr 110px 1fr 142px;

  > div {
    display: flex;
    justify-content: center;
    align-items: center;
    text-align: center;
    border-right: 1px solid #333;
    border-top: 1px solid #333;

    &:nth-child(1) {
      grid-row: 1 / span 2;
    }

    &:nth-child(3), &:nth-child(7) {
      grid-column: 3 / span 2;
    }

    &:nth-child(5), &:nth-child(9) {
      grid-column: 6 / span 2;
      border-right: 0;
    }
  }

  .value {
    display: flex;
    flex-direction: column;

    > div {
      width: 100%;
      line-height: 48px;
      height: 48px;

      &:not(:last-child) {
        border-bottom: 1px dashed #333;
      }
    }
  }

}

.item_3 {
  border-bottom: 1px solid #333;
}

.row_7, .row_8, .row_9 , .row_12 ,.row_13{
  display: grid;
  grid-template-columns: 110px 1fr;

  > div {
    &:last-child {
      border-right: none !important;
    }
  }
}
.row_11 {
  display: grid;
  grid-template-columns: 110px 1fr 1fr;
}

.item_4,.item_5,.item_6 ,.item_7 {
  border-bottom: 1px solid #333;
}

.row_10 {
  display: grid;
  grid-template-columns: 110px 1fr;
  > div {
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
    border-right: 1px solid #333;
    &:last-child {
      border-right: none !important;
    }
  }

  .resume {
    width: 100%;
    font-size: 14px!important;
    padding: 0 0 10px 30px;
    overflow: hidden;
    min-height: 400px;
    position: relative;
  }
}

.illustrate {
  width: 30%;
  max-width: 450px;
  margin-right: 10px;
  display: flex;
  flex-direction: column;
  background: #f3f3fa;
  .top {
    flex: 1;
    font-size: 15px;
  }
  .bottom {
    flex: 1;
    font-size: 15px;
  }
}
.bg-f3f3fa {
  background: #f3f3fa;
}
.error-list {
  //border: 1px solid #333333;
  margin: 10px 10px;
  .error-item {
    //&:not(:last-child) {
    //  border-bottom: 1px solid #333333;
    //}
    padding: 5px 4px;
    color: red;
  }
}
.m-y-10px {
  margin: 10px 0;
}
.rows {
  .rowLabel {
    background: #d9e5fc;
  }
}
.rows .required::before {
  content: '*';
  color: #FF0000;
  font-size: 18px;
  margin-right: 5px;
}
</style>
