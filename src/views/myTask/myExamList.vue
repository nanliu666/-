<template>
  <exam-list ref="examList" from="task" />
</template>
<script>
import ExamList from '@/views/exam/List'
export default {
  name: 'MyExamList',
  components: {
    ExamList
  },
  data() {
    return {}
  },
  mounted() {
    this.$refs.examList.loadTableData()
  },
  methods: {}
}
</script>
<style scoped lang="scss"></style>
