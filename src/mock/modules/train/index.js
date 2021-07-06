/* eslint-disable no-console */

import Mock from 'mockjs'

const normalData = {
  code: 200,
  success: true,
  msg: '操作成功',
  response: ''
}
export default ({ mock }) => {
  if (!mock) return
  Mock.mock(new RegExp('/api/blade-manage/v1/web/train/queryTrainInfo' + '.*'), 'get', () => {
    return {
      normalData,
      response: [
        {
          id: '1111112',
          name: '靓仔',
          teacherName: '靓仔不',
          type: 1,
          status: 1,
          flag: 1,
          content: [
            {
              id: '1232',
              name: '啦啦啦啦啦啦',
              type: 1,
              courseId: '1212112312321321',
              contentId: '121212121',
              content: '发了多少解放了开始打回访',
              localName: '地方即可拉伸的减肥了',
              sort: 1,
              percentageComplete: 99,
              fileSize: '1111'
            },
            {
              id: '1213124',
              name: '啦啦啦啦啦啦',
              type: 1,
              courseId: '1212112312321321',
              contentId: '121212121',
              content: '发了多少解放了开始打回访',
              localName: '地方即可拉伸的减肥了',
              sort: 1,
              percentageComplete: 99,
              fileSize: '1111'
            },
            {
              id: '32645341',
              name: '啦啦啦啦啦啦',
              type: 2,
              courseId: '1212112312321321',
              contentId: '121212121',
              content: '发了多少解放了开始打回访',
              localName: '地方即可拉伸的减肥了',
              sort: 3,
              percentageComplete: 99,
              fileSize: '1111'
            },
            {
              id: '13423151',
              name: '啦啦啦啦啦啦',
              type: 3,
              courseId: '1212112312321321',
              contentId: '121212121',
              content: '发了多少解放了开始打回访',
              localName: '地方即可拉伸的减肥了',
              sort: 2,
              percentageComplete: 99,
              fileSize: '1111'
            },
            {
              id: '132342341',
              name: '啦啦啦啦啦啦',
              type: 4,
              courseId: '1212112312321321',
              contentId: '121212121',
              content: '发了多少解放了开始打回访',
              localName: '地方即可拉伸的减肥了',
              sort: 4,
              percentageComplete: 99,
              fileSize: '1111'
            }
          ],
          startTime: '2021-05-01',
          endTime: '2021-06-02',
          roomName: '1',
          roomAddr: '1',
          totalNum: 999,
          isLimitedJoinNum: true,
          joinNumValue: 111,
          examTimes: 11,
          scoreRule: '12撒打发',
          totalScore: 100,
          score: 99,
          sign: 1,
          complete: 1,
          auditStatus: 0,
          joinStatus: 1
        },
        {
          id: '1111121',
          name: '靓仔',
          teacherName: '靓仔不',
          type: 2,
          status: 2,
          flag: 2,
          content: [
            {
              id: '1',
              name: '啦啦啦啦啦啦',
              type: 1,
              courseId: '1212112312321321',
              contentId: '121212121',
              content: '发了多少解放了开始打回访',
              localName: '地方即可拉伸的减肥了',
              sort: 1,
              percentageComplete: 99,
              fileSize: '1111'
            },
            {
              id: '1',
              name: '啦啦啦啦啦啦',
              type: 1,
              courseId: '1212112312321321',
              contentId: '121212121',
              content: '发了多少解放了开始打回访',
              localName: '地方即可拉伸的减肥了',
              sort: 1,
              percentageComplete: 99,
              fileSize: '1111'
            },
            {
              id: '1',
              name: '啦啦啦啦啦啦',
              type: 2,
              courseId: '1212112312321321',
              contentId: '121212121',
              content: '发了多少解放了开始打回访',
              localName: '地方即可拉伸的减肥了',
              sort: 3,
              percentageComplete: 99,
              fileSize: '1111'
            },
            {
              id: '1',
              name: '啦啦啦啦啦啦',
              type: 3,
              courseId: '1212112312321321',
              contentId: '121212121',
              content: '发了多少解放了开始打回访',
              localName: '地方即可拉伸的减肥了',
              sort: 2,
              percentageComplete: 99,
              fileSize: '1111'
            },
            {
              id: '1',
              name: '啦啦啦啦啦啦',
              type: 4,
              courseId: '1212112312321321',
              contentId: '121212121',
              content: '发了多少解放了开始打回访',
              localName: '地方即可拉伸的减肥了',
              sort: 4,
              percentageComplete: 99,
              fileSize: '1111'
            }
          ],
          startTime: '2021-05-01',
          endTime: '2021-06-02',
          roomName: '1',
          roomAddr: '1',
          totalNum: 999,
          isLimitedJoinNum: true,
          joinNumValue: 111,
          examTimes: 11,
          scoreRule: '12撒打发',
          totalScore: 100,
          score: 99,
          sign: 2,
          complete: 2,
          auditStatus: 1,
          joinStatus: 2
        },
        {
          id: '1111113',
          name: '靓仔',
          teacherName: '靓仔不',
          type: 3,
          status: 2,
          flag: 1,
          content: [
            {
              id: '1',
              name: '啦啦啦啦啦啦',
              type: 1,
              courseId: '1212112312321321',
              contentId: '121212121',
              content: '发了多少解放了开始打回访',
              localName: '地方即可拉伸的减肥了',
              sort: 1,
              percentageComplete: 99,
              fileSize: '1111'
            },
            {
              id: '1',
              name: '啦啦啦啦啦啦',
              type: 1,
              courseId: '1212112312321321',
              contentId: '121212121',
              content: '发了多少解放了开始打回访',
              localName: '地方即可拉伸的减肥了',
              sort: 1,
              percentageComplete: 99,
              fileSize: '1111'
            },
            {
              id: '1',
              name: '啦啦啦啦啦啦',
              type: 2,
              courseId: '1212112312321321',
              contentId: '121212121',
              content: '发了多少解放了开始打回访',
              localName: '地方即可拉伸的减肥了',
              sort: 3,
              percentageComplete: 99,
              fileSize: '1111'
            },
            {
              id: '1',
              name: '啦啦啦啦啦啦',
              type: 3,
              courseId: '1212112312321321',
              contentId: '121212121',
              content: '发了多少解放了开始打回访',
              localName: '地方即可拉伸的减肥了',
              sort: 2,
              percentageComplete: 99,
              fileSize: '1111'
            },
            {
              id: '1',
              name: '啦啦啦啦啦啦',
              type: 4,
              courseId: '1212112312321321',
              contentId: '121212121',
              content: '发了多少解放了开始打回访',
              localName: '地方即可拉伸的减肥了',
              sort: 4,
              percentageComplete: 99,
              fileSize: '1111'
            }
          ],
          startTime: '2021-05-01',
          endTime: '2021-06-02',
          roomName: '1',
          roomAddr: '1',
          totalNum: 999,
          isLimitedJoinNum: true,
          joinNumValue: 111,
          examTimes: 11,
          scoreRule: '12撒打发',
          totalScore: 100,
          score: 99,
          sign: 1,
          complete: 1,
          auditStatus: 2,
          joinStatus: 2
        }
      ]
    }
  })
}
