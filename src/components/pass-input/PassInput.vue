<template>
  <el-input
    :type="inputType"
    v-bind="$attrs"
    class="pass-input"
    v-on="$listeners"
  >
    <i
      v-if="inputType !== 'password'"
      slot="suffix"
      class="iconeyeopen-outlined iconfont eye-icon"
      @click="toggleType"
    />
    <i
      v-else
      slot="suffix"
      class="iconeyeblind-outlined iconfont eye-icon"
      @click="toggleType"
    />
  </el-input>
</template>

<script>
export default {
  name: 'PassInput',
  data() {
    return {
      inputType: 'password'
    }
  },
  methods: {
    toggleType() {
      if (this.inputType === 'password') {
        this.inputType = 'text'
      } else {
        this.inputType = 'password'
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.pass-input {
  /deep/.el-input__suffix {
    right: 10px;
  }
  i {
    // color: rgba($primaryFontColor, 0.08);
    cursor: pointer;
  }
}
</style>
