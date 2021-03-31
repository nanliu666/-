<template>
  <span class="qustion">
    <span
      v-if="data.type !== QUESTION_TYPE_BLANK || type === 'view'"
      class="qustion-content-box"
      v-html="getHTML(data.content)"
    ></span>
    <div v-if="!_.isEmpty(data.attachments)" class="qustion__attachments">
      <div v-for="(attachment, index) in data.attachments" :key="index" class="qustion__attachment">
        <question-view :url="attachment.fileUrl" />
      </div>
    </div>
    <!-- 考试用来可编辑的状态 -->
    <div v-if="type === 'edit'" :class="{ 'blank-box': [QUESTION_TYPE_BLANK].includes(data.type) }">
      <!-- 判断题、单选题 -->
      <div
        v-if="[QUESTION_TYPE_SINGLE, QUESTION_TYPE_JUDGE].includes(data.type)"
        class="qustion__options"
      >
        <el-radio-group v-model="data.answer" :disabled="disabled" class="group-container">
          <el-radio
            v-for="option in data.options"
            :key="option.key"
            class="radio"
            :label="option.id"
          >
            <span>{{ _.unescape(option.content) }}</span>
            <question-view v-if="option.url" :url="option.url" />
          </el-radio>
        </el-radio-group>
      </div>
      <!-- 多选题 -->
      <div
        v-if="[QUESTION_TYPE_MULTIPLE].includes(data.type) && !_.isEmpty(data.options)"
        class="qustion__options"
      >
        <li class="group-container">
          <el-checkbox
            v-for="option in data.options"
            :key="option.id"
            v-model="option.answerModel"
            :disabled="disabled"
            :label="option.id"
            class="qustion-checkbox"
            @change="changeMultiple(option)"
          >
            <span>{{ _.unescape(option.content) }}</span>
            <question-view v-if="option.url" :url="option.url" />
          </el-checkbox>
        </li>
      </div>
      <el-input
        v-if="[QUESTION_TYPE_SHOER].includes(data.type)"
        v-model="data.answer"
        :disabled="disabled"
        type="textarea"
        :rows="4"
        placeholder="请输入内容"
      >
      </el-input>
      <ul v-if="[QUESTION_TYPE_BLANK].includes(data.type)" class="blank-ul">
        <li v-for="(item, index) in blankList" :key="index">
          <el-input
            v-if="item == '$'"
            v-model="data[`answerModel${index}`]"
            :disabled="disabled"
            style="display: inline;"
            placeholder="请输入内容"
            maxlength="32"
          >
          </el-input>
          <span v-else v-html="getHTML(item)" />
        </li>
      </ul>
    </div>
    <div v-else class="view-contain-box">
      <select-view
        v-if="
          [QUESTION_TYPE_MULTIPLE, QUESTION_TYPE_SINGLE, QUESTION_TYPE_JUDGE].includes(data.type)
        "
        :is-view-results="isViewResults"
        :data="data"
        :paper-data="paperData"
      />
      <gap-and-short
        v-if="[QUESTION_TYPE_BLANK, QUESTION_TYPE_SHOER].includes(data.type)"
        :is-view-results="isViewResults"
        :paper-data="paperData"
        :data="data"
      />
    </div>
  </span>
</template>

<script>
import { deleteHTMLTag } from '@/util/util'
import questionView from './questionView'
import SelectView from './SelectView'
import GapAndShort from './GapAndShort'
import { addLine } from '@/util/util'
import {
  QUESTION_TYPE_MAP,
  QUESTION_TYPE_MULTIPLE,
  QUESTION_TYPE_SINGLE,
  QUESTION_TYPE_JUDGE,
  QUESTION_TYPE_SHOER,
  QUESTION_TYPE_BLANK,
  QUESTION_TYPE_GROUP
} from '@/const/exam'
export default {
  name: 'QustionPreview',
  components: {
    questionView,
    SelectView,
    GapAndShort
  },
  props: {
    isViewResults: {
      type: Boolean,
      default: false
    },
    type: {
      type: String,
      default: 'edit'
    },
    disabled: {
      type: Boolean,
      default: false
    },
    data: {
      type: Object,
      default: () => ({})
    },
    paperData: {
      type: Object,
      default: () => ({})
    },
    isPreview: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      blankList: []
    }
  },
  computed: {
    QUESTION_TYPE_MULTIPLE: () => QUESTION_TYPE_MULTIPLE,
    QUESTION_TYPE_SINGLE: () => QUESTION_TYPE_SINGLE,
    QUESTION_TYPE_JUDGE: () => QUESTION_TYPE_JUDGE,
    QUESTION_TYPE_BLANK: () => QUESTION_TYPE_BLANK,
    QUESTION_TYPE_SHOER: () => QUESTION_TYPE_SHOER,
    QUESTION_TYPE_MAP: () => QUESTION_TYPE_MAP,
    QUESTION_TYPE_GROUP: () => QUESTION_TYPE_GROUP
  },
  watch: {
    data: {
      handler(value) {
        switch (value.type) {
          case QUESTION_TYPE_BLANK:
            this.handleBlankValue(value)
            break
          case QUESTION_TYPE_MULTIPLE:
            this.handleMulipleValue(value)
            break
        }
      },
      deep: true,
      immediate: true
    }
  },
  methods: {
    getHTML(content) {
      return addLine(content)
    },
    handleMulipleValue(value) {
      const temp = _.cloneDeep(value.answerModel)
      let target = _.map(temp, (item) => {
        if (!_.isEmpty(item)) {
          return item.id
        }
      })
      value.answer = _.compact(target).join(',')
    },
    handleBlankValue(value) {
      // 手动将___转换成数组以_$_来分隔，通过$定位input，精髓在通过$前后的下划线来进行切分
      const content = deleteHTMLTag(_.unescape(value.content)).replace(/[_]{3}/g, '_$_')
      this.blankList = _.filter(_.split(content, '_'))
      let tempValue = []
      _.forIn(value, (forValue, key) => {
        if (key.includes('answerModel')) {
          let temp = { [key]: forValue }
          let WhetherIn = _.findIndex(tempValue, (item) => {
            return _.findKey(item) === _.findKey(temp)
          })
          if (WhetherIn === -1) {
            tempValue.push(temp)
          }
        }
      })
      const target = _.map(tempValue, (item) => {
        return _.get(item, _.findKey(item))
      })
      value.answer = target.join(',')
    },
    changeMultiple() {
      const dataValue = _.map(this.data.options, (item) => {
        if (item.answerModel) {
          return item
        }
      })
      this.data.answerModel = dataValue
    }
  }
}
</script>

<style lang="scss" scoped>
.blank-box {
  display: inline-block;
}
.blank-ul {
  display: flex;
  justify-content: flex-start;
  flex-wrap: wrap;
  li {
    /deep/ .el-input__inner {
      border-color: transparent;
      border-bottom-color: #303133;
      border-radius: 0;
      margin-top: -18px;
      &:hover {
        border-color: transparent;
        border-bottom-color: #303133;
      }
    }
  }
}
.qustion {
  &__attachments {
    margin-top: 12px;
    .el-image {
      vertical-align: middle;
    }
  }
  &__attachment {
    display: inline-block;
    position: relative;
    margin-right: 10px;
    width: calc(20% - 10px);

    &:hover {
      .upload__cover {
        display: flex;
      }
    }
  }
  .upload__cover {
    width: 100%;
    height: 100%;
    position: absolute;
    display: none;
    top: 0;
    background-color: rgba(0, 0, 0, 0.6);
    align-items: center;
    justify-content: space-evenly;
    i {
      cursor: pointer;
      color: #fff;
    }
  }
  &__options {
    margin-top: 12px;
    .group-container {
      .el-radio {
        margin-right: 0px;
        margin-bottom: 16px;
        display: block;
        &:last-child {
          margin-bottom: 0;
        }
      }
      .qustion-checkbox {
        margin-bottom: 16px;
        display: flex;
        align-items: flex-start;
        &:last-child {
          margin-bottom: 0;
        }
        /deep/ .el-checkbox__label {
          margin-top: -2px;
        }
      }
    }
  }
}
</style>
