<template>
  <div class="li-main">
    <div class="li-main-left" :class="{ blankidx: conItem.type === 'blank' }">
      <i
        class="iconfont"
        :class="`icon${isInImpeach ? 'image_icon_help_press' : 'image_icon_help_normal'}`"
        @click="setImpeach(conItem)"
      />
      <span style="margin-left:5px;">{{ topicIndex + 1 }}.</span>
      <span v-show="isShowScope === 1">（{{ conItem.score }}分）</span>
    </div>
    <div class="li-main-right">
      <QustionPreview
        v-if="QUESTION_TYPE_GROUP !== conItem.type"
        class="ques"
        :data="conItem"
        :disabled="disabled"
      />
      <span v-else>
        <span class="right-title" v-html="getHTML(conItem.content)"></span>
        <ul>
          <li v-for="(paperItem, paperIndex) in conItem.subQuestions" :key="paperIndex" class="">
            <span>{{ paperIndex + 1 }}.</span>
            <QustionPreview :data="paperItem" :disabled="disabled" />
          </li>
        </ul>
      </span>
    </div>
  </div>
</template>

<script>
import {
  QUESTION_TYPE_MAP,
  QUESTION_TYPE_MULTIPLE,
  QUESTION_TYPE_SINGLE,
  QUESTION_TYPE_JUDGE,
  QUESTION_TYPE_SHOER,
  QUESTION_TYPE_BLANK,
  QUESTION_TYPE_GROUP
} from '@/const/exam'
import QustionPreview from './questionPreview'
import { addLine } from '@/util/util'
export default {
  inject: ['paper'],
  name: 'AnswerByQuestion',
  components: {
    QustionPreview
  },
  props: {
    disabled: {
      type: Boolean,
      default: false
    },
    conItem: {
      type: Object,
      default: () => ({})
    },
    conIndex: {
      type: Number,
      default: 0
    },
    topicIndex: {
      type: Number,
      default: 0
    },
    isShowScope: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      isInImpeach: false
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
  methods: {
    getHTML(content) {
      return addLine(content)
    },
    setImpeach(data) {
      this.getCurrentImpeach(data)
      this.$emit('setImpeach', data)
    },
    getCurrentImpeach(data) {
      this.isInImpeach = !_.some(this.paper.impeachList, (item) => {
        return item.key === data.id
      })
    }
  }
}
</script>

<style scoped lang="scss">
$activeColor: #01aafc;
$selctColor: #fcba00;
.li-main {
  display: flex;
  justify-content: flex-start;
  .blankidx {
    margin-top: 8px;
  }
  .li-main-left {
    // margin-top: 2px;
    margin-right: 8.8px;
    .iconfont {
      &:hover {
        color: $activeColor;
        cursor: pointer;
      }
    }
    .iconimage_icon_help_press {
      color: $selctColor;
    }
  }
  .li-main-right {
    flex: 1;
  }
}
</style>
