<template>
  <div class="li-main">
    <div class="li-main-left">
      <span style="margin-left:5px;">{{ topicIndex + 1 }}.</span>
      <span v-show="_.get(paperData, 'paperData.isShowScore') === 1">（{{ conItem.score }}分）</span>
    </div>
    <div class="li-main-right">
      <div>
        <div v-if="QUESTION_TYPE_GROUP !== conItem.type">
          <QustionPreview class="ques" :data="conItem" :disabled="disabled" />
          <div class="right__button">
            <el-button size="medium" @click="setImpeach(conItem)">{{
              _.some(isInImpeachList, (imItem) => imItem === conItem.id) ? '取消存疑' : '存疑'
            }}</el-button>
          </div>
        </div>
        <span v-else>
          <span class="right-title" v-html="getHTML(conItem.content)"></span>
          <ul>
            <li
              v-for="(paperItem, paperIndex) in conItem.subQuestions"
              :id="`id${paperItem.id}`"
              :key="paperIndex"
              class="right__content"
            >
              <div class="content_topic">
                <span class="topic__index">({{ paperIndex + 1 }}) </span>
                <QustionPreview :data="paperItem" :disabled="disabled" />
              </div>
              <div class="right__button">
                <el-button size="medium" @click="setImpeach(paperItem)">{{
                  _.some(isInImpeachList, (imItem) => imItem === paperItem.id) ? '取消存疑' : '存疑'
                }}</el-button>
              </div>
            </li>
          </ul>
        </span>
      </div>
    </div>
  </div>
</template>

<script>
import { QUESTION_TYPE_GROUP } from '@/const/exam'
import QustionPreview from './questionPreview'
import { addLine } from '@/util/util'
export default {
  inject: ['paperData'],
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
    topicIndex: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      isInImpeachList: []
    }
  },
  computed: {
    QUESTION_TYPE_GROUP: () => QUESTION_TYPE_GROUP
  },
  methods: {
    getHTML(content) {
      return addLine(content)
    },
    setImpeach(data) {
      this.$emit('setImpeach', data)
      this.$nextTick(() => {
        this.getCurrentImpeach(data)
      })
    },
    getCurrentImpeach(data) {
      const temp = _.find(this.paperData.impeachList, (item) => {
        if (item.key === data.id) {
          return data.id
        }
      })
      if (temp) {
        this.isInImpeachList.push(_.get(temp, 'key'))
      } else {
        const inpeachIndex = _.findIndex(this.isInImpeachList, (item) => item === data.id)
        this.isInImpeachList.splice(inpeachIndex, 1)
      }
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
  align-items: flex-start;
  .li-main-left {
    margin-top: 2px;
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
    .right__button {
      display: flex;
      justify-content: flex-end;
      margin-top: 4px;
    }
    .right__content {
      margin-top: 10px;
      margin-bottom: 20px;
      .content_topic {
        display: flex;
        width: 100%;
        .topic__index {
          margin-top: 2px;
        }
      }
    }
  }
}
</style>
