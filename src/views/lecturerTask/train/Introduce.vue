<template>
  <div v-html="content"></div>
</template>

<script>
import { getTrainDetail } from '@/api/lecturerTask'
export default {
  data() {
    return {
      content: ''
    }
  },
  created() {
    this.isgetTrainDetail()
  },
  methods: {
    async isgetTrainDetail() {
      let { introduction } = await getTrainDetail({ trainId: this.$route.query.id })
      this.content = _.unescape(introduction)
    }
  }
}
</script>

<style></style>
