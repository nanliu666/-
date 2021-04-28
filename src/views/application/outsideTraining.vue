<template>
  <div class="outsideTraining">
    <!-- 面包屑 -->
    <el-breadcrumb separator="/" style="padding: 25px 0 20px">
      <el-breadcrumb-item>业务申请</el-breadcrumb-item>
      <el-breadcrumb-item>外训报名</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 主体内容 -->
    <div class="form-card">
      <el-card>
        <div class="container">
          <!-- 申请人信息 -->
          <div class="applicant-information">
            <div class="title">申请人信息</div>
            <el-divider></el-divider>
            <el-row>
              <el-col :span="8">姓名：张三</el-col>
              <el-col :span="8">性别：男</el-col>
              <el-col :span="8">出生年月：2021/05</el-col>
              <el-col :span="8">所属部门：设计中心</el-col>
              <el-col :span="8">工作岗位：交互设计师</el-col>
              <el-col :span="8">职业资格/职称：高级设计师</el-col>
            </el-row>
          </div>
          <!-- 申请信息 -->
          <div class="application-information">
            <div class="title">申请信息</div>
            <el-divider></el-divider>
            <!-- 表单信息 -->
            <common-form ref="form" :model="form" :columns="columns" @node-click="_nodeClickFun">
            </common-form>
          </div>
          <!-- 项目培训信息 -->
          <div class="project-information">
            <div class="title">项目培训信息</div>
            <el-divider></el-divider>
            <el-row v-if="Object.keys(pojectTemp).length">
              <el-col :span="8">培训名称：Java技能课程</el-col>
              <el-col :span="8">分类：Java技能课程/Java高级培训</el-col>
              <el-col :span="8">培训时间：2021/03/100 - 2021/05/20</el-col>
              <el-col :span="8">知识体系：Java培训>Java基础</el-col>
              <el-col :span="8">培训对象：部门内部</el-col>
              <el-col :span="8">培训类型：岗位取证</el-col>
              <el-col :span="8">培训形式：在职培训</el-col>
              <el-col :span="8">培训机构：易宝科技</el-col>
              <el-col :span="8">联系人：周勋</el-col>
              <el-col :span="8">联系电话：137 1015 6325</el-col>
              <el-col :span="16">培训地点：深圳市龙华区宝能科技园10栋易宝软件</el-col>
            </el-row>
            <div v-else style="text-align: center; padding: 50px 0; font-size: 12px">
              暂未选择培训
            </div>
          </div>
          <!-- 提交按钮 -->
          <div class="submit-btn">
            <el-button type="primary" size="medium">提交申请</el-button>
            <el-button style="margin-left: 10px" size="medium">取消</el-button>
          </div>
        </div>
      </el-card>
    </div>
  </div>
</template>

<script>
export default {
  name: 'OutsideTraining',
  components: {
    CommonForm: () => import('@/components/common-form/CommonForm')
  },
  data() {
    return {
      form: {
        trainingType: '',
        trainingModality: '',
        trainingContent: '',
        trainingPurpose: ''
      },
      columns: [
        {
          prop: 'trainingType',
          itemType: 'treeSelect',
          label: '培训类型',
          span: 10,
          required: true,
          props: {
            selectParams: {
              placeholder: '请选择',
              multiple: false
            },
            treeParams: {
              data: [],
              'check-strictly': true,
              'default-expand-all': false,
              'expand-on-click-node': false,
              clickParent: true,
              filterable: false,
              props: {
                children: 'children',
                label: 'name',
                disabled: 'disabled',
                value: 'id'
              }
            }
          }
        },
        {
          prop: 'trainingModality',
          itemType: 'treeSelect',
          label: '培训形式',
          span: 10,
          offset: 4,
          required: true,
          props: {
            selectParams: {
              placeholder: '请选择',
              multiple: false
            },
            treeParams: {
              data: [],
              'check-strictly': true,
              'default-expand-all': false,
              'expand-on-click-node': false,
              clickParent: true,
              filterable: false,
              props: {
                children: 'children',
                label: 'name',
                disabled: 'disabled',
                value: 'id'
              }
            }
          }
        },
        {
          prop: 'trainingContent',
          itemType: 'treeSelect',
          label: '培训内容',
          span: 10,
          required: true,
          props: {
            selectParams: {
              placeholder: '请选择',
              multiple: false
            },
            treeParams: {
              data: [],
              'check-strictly': true,
              'default-expand-all': false,
              'expand-on-click-node': false,
              clickParent: true,
              filterable: false,
              props: {
                children: 'children',
                label: 'name',
                disabled: 'disabled',
                value: 'id'
              }
            }
          }
        },
        {
          prop: 'trainingPurpose',
          itemType: 'input',
          required: true,
          label: '培训目的',
          span: 24,
          rows: 6,
          type: 'textarea'
        }
      ],
      pojectTemp: {}
    }
  },
  methods: {
    _nodeClickFun(val) {
      console.log(val)
    }
  }
}
</script>

<style lang="scss" scoped>
.outsideTraining {
  .form-card {
    .container {
      padding: 30px 65px 0;
      .applicant-information {
        .title {
          font-size: 20px;
        }
        /deep/ .el-row {
          padding: 10px 50px;
          .el-col {
            margin-bottom: 25px;
          }
        }
      }
      .application-information {
        .title {
          font-size: 20px;
        }
        /deep/ .el-form {
          padding: 30px 105px;
        }
      }
      .project-information {
        .title {
          font-size: 20px;
        }
        /deep/ .el-row {
          padding: 10px 50px;
          .el-col {
            margin-bottom: 25px;
          }
        }
      }
    }
  }
}
</style>
