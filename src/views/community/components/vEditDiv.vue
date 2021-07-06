<template>
  <div
    class="edit-div"
    v-html="innerText"
    :placeholder="placeholder"
    :contenteditable="canEdit"
    @keydown.13="keyDown($event)"
    @focus="isLocked = true"
    @blur="isLocked = false"
    @input="changeText"
  ></div>
</template>
<script>
export default {
  name: 'editDiv',
  props: {
    value: {
      type: String,
      default: ''
    },
    subMaxWord: {
      type: Number,
      default: 0
    },
    placeholder: {
      type: String,
      default: ''
    },
    canEdit: {
      type: Boolean,
      default: true
    },
    //禁止换行
    nowrap: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      innerText: this.value,
      isLocked: false,
      isFistTime: true
    }
  },
  watch: {
    value() {
      if (!this.isLocked || !this.innerText) {
        if (!this.innerText) {
          this.$nextTick(() => {
            this.keepLastIndex(this.$el)
          })
        }
        this.innerText = this.value
      }
      this.isFistTime = false
    },
    isLocked() {
      this.innerText = this.value
    }
  },
  methods: {
    changeText() {
      // 解决：末尾换行，看不见的<br>，删不掉，造成清空无法出现placeholder文字
      if (this.$el.innerHTML == '<br>') {
        this.$el.innerHTML = ''
      }
      this.$emit('input', this.$el.innerHTML)
    },
    keyDown(e) {
      if (this.nowrap) {
        e.preventDefault()
      }
    },
    keepLastIndex(obj) {
      if (window.getSelection) {
        // ie11 10 9 ff safari
        obj.focus() // 解决ff不获取焦点无法定位问题
        let range = window.getSelection() // 创建range
        range.selectAllChildren(obj) // range 选择obj下所有子内容
        range.collapseToEnd() // 光标移至最后
      } else if (document.selection) {
        // ie10 9 8 7 6 5
        let range = document.selection.createRange() // 创建选择对象
        // var range = document.body.createTextRange();
        range.moveToElementText(obj) // range定位到obj
        range.collapse(false) // 光标移至最后
        range.select()
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.edit-div {
  width: 100%;
  height: 100%;
  overflow: auto;
  word-break: break-all;
  outline: none;
  user-select: text;
  white-space: pre-wrap;
  text-align: left;
  background: #ffffff;
  border: 1px solid #d9dbdc;
  border-radius: 4px;
  padding: 5px;
}
.edit-div[contenteditable='true'] {
  user-modify: read-write-plaintext-only;
  -webkit-user-modify: read-write-plaintext-only;
}
.edit-div[contenteditable='true']:empty:before {
  content: attr(placeholder);
  display: block;
  color: #ccc;
}
/deep/ .mention {
  vertical-align: baseline;
  cursor: text;
  display: inline-block;
  font-size: 1em;
  border: 0 none;
  background: none;
  overflow: visible;
  padding: 0;
  margin-right: 1px;
  text-align: left;
}
</style>