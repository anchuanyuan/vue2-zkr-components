<template>
  <div :class="{'quickEditorNavigation-wrapper':true,'isExpand':isExpand}">
    <div class="expand" @click="isExpand=!isExpand">
      <span>{{ isExpand ? '>' : '<' }}</span>
      <span>{{ isExpand ? '>' : '<' }}</span>
    </div>
    <el-timeline class="items">
      <el-timeline-item :icon="item.icon" :class="['item',item.actived?'actived':'']" v-for="item in menus" :key="item.id">
        <div v-if="!less1280" slot="dot" @click.stop="onChose(item)" :class="['circle',item.actived?'bgblue':'']"></div>
        <div v-else slot="dot" @click.stop="onChose(item)" :class="['less','circle',item.actived?'bgblue':'']">
          <div :class="item.icon"></div>
        </div>
        <div @click.stop="onChose(item)" :class="['menuItem',item.actived?'blue':'']">
          <span :class="item.icon"></span>
          {{ item.name }}
        </div>
        <el-tooltip :disabled="!isExpand" effect="light" popper-class="customTipClass" :visible-arrow="false"
                    :content="item.name"
                    placement="right">
          <div class="cover" @click.stop="onChose(item)"></div>
        </el-tooltip>
      </el-timeline-item>
    </el-timeline>
  </div>
</template>

<style  lang="scss" scoped>
.quickEditorNavigation-wrapper {
  width: 260px;
  overflow: hidden;
  text-align: center;
  height: 100%;
  background-color: #FBFBFD;
  border-right: 1px solid #E5E5E5;
  //padding-left: 30px;
  transition: .3s ease-in-out;

  .expand {
    color: #417FF2;
    background-color: #F5F8FE;
    height: 40px;
    border-bottom: 1px solid #E5E5E5;
    margin-bottom: 20px;
    line-height: 40px;
    cursor: pointer;
    word-spacing: -20px;
    font-size: 14px;
  }

  .items {
    //width: 100px;
    //height: calc(100% - 96px);
    width: 100%;
    height: 65%;
    font-size: 14px;

    .menuItem {
      font-size: 16px;
      color: #333;
      transition: .3s ease-in-out;
      width: 260px;
      text-align: left;
      padding-left: 18px;
    }

    .menuItem.blue {
      color: #417FF2;
      cursor: pointer;
    }

    /deep/.el-timeline-item__tail {
      left: 26px;
    }

    /deep/.el-timeline-item__dot {
      padding-left: 20px;
    }

    /deep/.el-timeline-item__wrapper {
      top: 0;
    }

    .item {
      .cover {
        cursor: pointer;
        transition: .3s ease-in-out;
        height: calc(100% + 30px);
        content: '';
        width: 260px;
        position: absolute;
        left: 0;
        top: 0;
        -webkit-transform: translateY(-50%);
        transform: translateY(-35%);
        opacity: 0.1;
      }

    }

    .actived.item {

      position: relative;

      .cover {
        background: -webkit-gradient(linear, right top, left top, from(#218AFF), to(rgba(33, 138, 255, 0)));
        background: linear-gradient(-90deg, #218AFF 0%, rgba(33, 138, 255, 0) 100%);
      }

      //&::after {
    }

    .circle {
      border-radius: 50%;
      cursor: pointer;
      width: 16px;
      height: 16px;
      background-color: #fff;
      //transform: translateX(calc(-50% + 1px));
      border: 2px solid #D2D2D2;
    }

    .bgblue {
      background-color: #417FF2;
      border: 2px solid #417FF2;
    }
  }
}

.isExpand {
  width: 60px;

  .menuItem {
    visibility: hidden;
  }

  .item {
    .cover {
      width: 60px !important;
    }
  }
}
</style>
<style>

.customTipClass {
  transform: translate(-20%, 0);
  background: #FFFFFF;
  box-shadow: 0px 3px 5px 0px rgba(0, 0, 0, 0.1);
  border: 0 !important;
  border-radius: 0;
}
</style>
<!--1280以下分辨率响应式样式-->
<style type="text/scss" lang="scss">
@media screen and (max-width: 1280px) {
  .expand {
    height: 0 !important;
    visibility: hidden;
  }
  .el-timeline-item {
    padding-bottom: 10px;
  }
  .el-timeline-item__dot {
    padding-left: 15px!important;
  }

  .less.circle{
    //width: 0px;
    border: 0!important;
    //background-color: #fff;
    padding: 13px!important;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: #e4e7ed!important;
    //color: #417FF2;
    //color: #fff;
    color: #000;
    //width: 27px;

    //height: 27px;
  }
  .less.bgblue{
    color: #fff;
    background-color: #417FF2!important;
  }
}
</style>
<script>
export default {
  props: {
    menus: {
      type: Array,
      default() {
        return []
      }
    }
  },
  data() {
    return {
      isExpand: false,
      less1280:false
    }
  },
  created() {
    if (document.body.clientWidth <= 1280) {
      this.isExpand = true
      this.less1280 = true
    }
  },
  methods: {
    onChose({id, position}) {
      this.$emit('change', id, position)
    },
  },
}

</script>