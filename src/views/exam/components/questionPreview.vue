<template>
  <span class="qustion">
    <span class="qustion__content">
      <span v-html="_.unescape(data.content)"></span>
    </span>
    <div
      v-if="!_.isEmpty(data.attachments)"
      class="qustion__attachments"
    >
      <div
        v-for="(attachment, index) in data.attachments"
        :key="index"
        class="qustion__attachment"
      >
        <question-view :url="attachment.url" />
      </div>
    </div>
    <!-- 判断题、单选题 -->
    <div
      v-if="[QUESTION_TYPE_SINGLE, QUESTION_TYPE_JUDGE].includes(data.type)"
      class="qustion__options"
    >
      <el-radio-group v-model="data.answer">
        <el-radio
          v-for="option in data.options"
          :key="option.key"
          style="display: block"
          :label="option.id"
        >
          <span>{{ _.unescape(option.content) }}</span>
          <question-view
            v-if="option.url"
            :url="option.url"
          />
        </el-radio>
      </el-radio-group>
    </div>
    <!-- 多选题 -->
    <div
      v-if="[QUESTION_TYPE_MULTIPLE].includes(data.type) && !_.isEmpty(data.options)"
      class="qustion__options"
    >
      <li>
        <el-checkbox
          v-for="option in data.options"
          :key="option.id"
          v-model="option.answer"
          style="display: block"
          :label="option.id"
          @change="changeMultiple(option)"
        >
          <span>{{ _.unescape(option.content) }}</span>
          <question-view
            v-if="option.url"
            :url="option.url"
          />
        </el-checkbox>
      </li>
    </div>
  </span>
</template>

<script>
import questionView from './questionView'
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
    questionView
  },
  props: {
    data: {
      type: Object,
      default: () => ({})
    },
    isPreview: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {}
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
  methods: {
    changeMultiple() {
      const dataValue = _.map(this.data.options, (item) => {
        if (item.answer) {
          return item
        }
      })
      this.data.answer = dataValue
    }
  }
}
</script>

<style lang="scss" scoped>
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
    li {
      margin-bottom: 12px;
      // &:last-of-type {
      //   margin-bottom: 0;
      // }
      .el-radio {
        margin-right: 10px;
      }
      .el-checkbox {
        margin-right: 10px;
      }
    }
  }
}
</style>
