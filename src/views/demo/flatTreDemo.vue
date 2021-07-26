<template>
  <div class="f1">
    <el-form ref="form" :model="form" label-width="80px">
      <el-form-item label="活动名称">
        <flat-tree v-model="flatData" :options="options"></flat-tree>
      </el-form-item>
      <el-form-item label="活动区域">
        <el-select v-model="form.region" placeholder="请选择活动区域">
          <el-option label="区域一" value="shanghai"></el-option>
          <el-option label="区域二" value="beijing"></el-option>
        </el-select>
      </el-form-item>
    </el-form>
    
    <!-- <flat-tree v-model="flatData" :options="options"></flat-tree>     -->
  </div>
</template>
<script>
import flatTree from '@/components/flatTree/flatTree.vue'
import {getStationParent, getOrganization} from '@/api/system'
export default {
  name:'FlatTreeDemo',  
  components:{
    flatTree
  },
  data:function(){
    return {
      flatData:[],
      form:{},
      options:{
        elType:'station', //组件类型 station 岗位 ；organization 组织
        value:'name', // input显示的内容     
        requestFn:getOrganization //请求数据绑定的api
      }
    }
  },
  methods:{
    
  }
}
</script>
<style scoped>
.f1{width: 500px;margin: 50px 0 0 30px;}
</style>