<template>
  <exam-list ref="examList" from="live" :live-id="id" />
</template>
<script>
import ExamList from '@/views/exam/List'
export default {
  name: 'LiveExam',
  components: {
    ExamList
  },
  data() {
    return {}
  },
  computed: {
    id() {
      return _.get(this.$route, 'query.id', null)
    }
  },
  mounted() {
    this.$refs.examList.loadTableData()
  },
  methods: {}
}
</script>
<style scoped lang="scss"></style>
