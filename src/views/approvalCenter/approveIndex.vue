<template>
  <div class="approveIndex">
    <div class="menu">
      <el-menu ref="elMenu" :default-active="defaultActive" class="el-menu-vertical-demo">
        <el-menu-item index="1" @click="componentName = 'apply'">
          <i class="iconimage_icon_GeneralInformation iconfont mIcon"></i>
          <span slot="title">业务申请</span>
        </el-menu-item>
        <el-menu-item index="2" @click="initApproveList(4)">
          <i class="iconimage_icon_GeneralInformation iconfont mIcon"></i>
          <span slot="title">我发起的</span>
        </el-menu-item>
        <el-submenu index="3" class="approveCenter-title">
          <template slot="title">
            <i class="iconimage_icon_GeneralInformation iconfont mIcon"></i>
            <span>审批中心</span>
          </template>
          <el-menu-item-group>
            <el-menu-item index="3-1" @click="initApproveList(1)">
              <!-- <el-badge :value="totalNum" class="item">
                待我审批
              </el-badge> -->
              待我审批
              <a v-if="totalNum>0" class="read-num">{{ totalNum }}</a>
            </el-menu-item>
            <el-menu-item index="3-2" @click="initApproveList(2)">我已审批</el-menu-item>
            <el-menu-item index="3-3" @click="initApproveList(3)">抄送我的</el-menu-item>
          </el-menu-item-group>
        </el-submenu>
        <!-- <el-menu-item index="3">
                    <i class="iconimage_icon_GeneralInformation iconfont"></i>
                    <span slot="title">审批中心</span>
                    <el-menu-item-group>                       
                        <el-menu-item index="1-1">选项1</el-menu-item>
                        <el-menu-item index="1-2">选项2</el-menu-item>
                    </el-menu-item-group>
                </el-menu-item> -->
      </el-menu>
    </div>
    <div class="content">
      <div class="content2">
        <component :is="componentName" ref="componetRef"></component>
      </div>
    </div>
  </div>
</template>
<script>
import center from './center'
import apply from '@/views/approvalCenter/components/apply'
import { getWaitApproveList } from '@/api/apprProcess/apprProcess'
export default {
  name: 'ApproveIndex',
  components: { center, apply },
  data() {
    return {
      totalNum: 0,
      componentName: 'apply',
      defaultActive:'1',
    }
  },
  activated() {
    if(this.$route.query.name==='message'){
      this.$refs.elMenu.activeIndex = '3-1'
      this.defaultActive='3-1'
      this.initApproveList(1)
    }
    if(this.$route.query.name==='mySend'){
      this.$refs.elMenu.activeIndex = '2'
      this.defaultActive='2'
      this.initApproveList(4)
    }
    this.initData()
  },
  methods: {
    async initData() {
      let sendData = {
        pageNo: 1,
        pageSize: 10,
        total: 0,
        currentPage: 1
      }
      let res = await getWaitApproveList(sendData)
      this.totalNum = res.totalNum
    },
    initApproveList(i) {
      this.componentName = 'center'
      this.$nextTick(() => {
        this.$refs.componetRef.setPitch(i)
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.approveIndex {
  display: flex;
  height: 100%;
  padding: 30px 0 0 0;
}
.approveCenter-title {
  /deep/.el-menu-item-group__title {
    padding: 0;
  }
  .read-num {
    display: inline-block;
    height: 18px;
    line-height: 18px;
    color: #fff;
    background-color: #f5623b;
    border-radius: 10px;
    font-size: 12px;
    white-space: nowrap;
    padding: 0 6px;
    text-align: center;
    margin: -2px 0 0 8px;
  }
}
.menu {
  width: 285px;
  padding: 20px 0 10px 0;
  background: #fff;
  box-shadow: 0 2px 12px 0 rgba(0, 61, 112, 0.08);
  border-radius: 4px;
}
/deep/.menu .el-menu {
  border-right: 0;
}
/deep/.menu .el-menu-item {
  height: 48px;
  line-height: 48px;
}
/deep/.menu .el-menu-item.is-active {
  border-left: $primaryColor solid 2px;
  background-color: #e6f7ff;
}
/deep/.menu .el-menu li::after {
  display: block;
  content: '';
  clear: both;
}
/* /deep/.menu .el-menu .mIcon{float: left;} */
/deep/.menu .el-menu span {
  padding: 0 0 0 10px;
  height: 48px;
  line-height: 48px;
}
.content {
  flex: 1;
}
.content2 {
  margin: 0 0 0 25px;
  min-height: 100%;
  height: 100%;
}
</style>
