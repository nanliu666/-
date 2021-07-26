<template>
  <div class="editExperience">
    <el-dialog title="提示" :visible.sync="dialogVisible" width="30%" :before-close="handleClose">
      <common-form
        ref="formRef"
        :model="formData"
        :columns="formColumns"
        @node-click="_nodeClickFun"
      >
      </common-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
export default {
  name: 'EditExperience',
  props: {
    value: {
      type: Object
    }
  },
  data() {
    return {
      formData: {},
      formColumns: [
        {
          prop: 'trainingModality',
          itemType: 'treeSelect',
          label: '学历',
          span: 10,
          offset: 0,
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
          itemType: 'input',
          label: '毕业院校',
          offset: 4,
          span: 10,
          required: true
        },
        {
          prop: 'trainingContent',
          itemType: 'input',
          label: '专业',
          offset: 0,
          span: 10,
          required: true
        },
        {
          itemType: 'inputNumber',
          label: '本岗位工作年限',
          min: 0,
          span: 10,
          offset: 4,
          precision: 1,
          maxlength: 32,
          required: true,
          prop: 'tttt'
        },
        {
          prop: 'trainingContent',
          itemType: 'treeSelect',
          label: '上年度绩效评价结果（2020年）',
          offset: 0,
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
          label: '申请说明',
          span: 24,
          rows: 6,
          maxlength: 1000,
          showWordLimit:true,
          type: 'textarea'
        }
      ]
    }
  },
  mounted() {
    this.formData = { ...this.value }
  },
  methods: {
    confirm() {
      this.$emit('input', this.formData)
    }
  }
}
</script>
<style scoped></style>
