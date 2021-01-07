<template>
  <div class="li-main">
    <div class="li-main-left">
      <i
        class="iconfont"
        :class="
          `icon${
            currentItemIsInImpeach(conItem) ? 'image_icon_help_press' : 'image_icon_help_normal'
          }`
        "
        @click="setImpeach(conItem)"
      />
    </div>
    <div class="li-main-right">
      <span>{{ conIndex + 1 }}.</span>
      <span>（{{ conItem.score / 10 }}分）</span>
      <QustionPreview
        v-if="QUESTION_TYPE_GROUP !== conItem.type"
        :data="conItem"
      />
      <span v-else>
        <span
          class="right-title"
          v-html="_.unescape(conItem.content)"
        ></span>
        <ul>
          <li
            v-for="(paperItem, paperIndex) in conItem.subQuestions"
            :key="paperIndex"
            class=""
          >
            <span>{{ paperIndex + 1 }}.</span>
            <QustionPreview :data="paperItem" />
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
export default {
  name: 'AnswerByQuestion',
  components: {
    QustionPreview
  },
  props: {
    conItem: {
      type: Object,
      default: () => ({})
    },
    conIndex: {
      type: Number,
      default: 0
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
  created() {},
  methods: {
    currentItemIsInImpeach(data) {
      this.$emit('checkImpeach', data)
    },
    setImpeach(data) {
      this.$emit('setImpeach', data)
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
  .li-main-left {
    margin-top: 2px;
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
