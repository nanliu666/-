<template>
  <div class="trainingNeeds">
    <!-- 面包屑 -->
    <el-breadcrumb separator="/" style="padding: 25px 0 20px">
      <el-breadcrumb-item>业务申请</el-breadcrumb-item>
      <el-breadcrumb-item>培训需求申请</el-breadcrumb-item>
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
  name: 'TrainingNeeds',
  components: {
    CommonForm: () => import('@/components/common-form/CommonForm')
  },
  data() {
    return {
      form: {
        trainingType: '',
        trainingModality: '',
        trainingSource: ''
      },
      columns: [
        {
          prop: 'trainingModality',
          itemType: 'treeSelect',
          label: '培训形式',
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
          prop: 'trainingSource',
          itemType: 'treeSelect',
          label: '培训资源',
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
          prop: 'trainingPurpose',
          itemType: 'input',
          required: true,
          label: '培训目的',
          span: 24,
          rows: 6,
          type: 'textarea'
        }
      ]
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
.trainingNeeds {
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
    }
  }
}
</style>
