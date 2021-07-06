import demoRoutes from './demo'
import Layout from '@/page/Layout'
import EmptyLayout from '@/page/EmptyLayout'
import myTaskLayout from '@/views/myTask/myTask'
import lecturerTask from '@/views/lecturerTask/task'
// import myLearnLayout from '@/views/myTask/myLearn'
/**
 * 路由定义规范
 * 路由整体分八大模块，每个模块写一个路由对象，对象属性包括
 * path 模块的根路径,尽量使用简洁的单词
 * component 路由容器
 * redirect 因为模块不直接写页面组件，所以要重定向到模块内的某个页面，一般是列表页
 * children 模块内所有的页面配置
 * title 给面包屑用的首级title
 *
 * 页面路由,属性包括:
 * path 页面路径，注意不要以/开头,这样路径会自动拼上模块的根路径
 * name 使用大写的驼峰式命名，保证全局唯一，页面跳转时可以使用name跳转
 * component 页面文件
 * meta 这是一个对象可以写自定义属性，目前可以写title和fullscreen两个属性，title的值会自动设置为浏览器的标题，fullscreen为true时会隐藏顶部菜单栏并且宽度占满
 *
 * 路由定义可以参考下面的course模块
 * 注：最下面的demo路由是预留的本地演示或者测试用的路由
 */
export default [
  // 首页与layout同级
  {
    path: '/home',
    name: 'Home',
    component: () => import(/* webpackChunkName: "page" */ '@/views/Home.vue'),
    meta: {
      title: '首页'
    }
  },
  {
    path: '/666',
    component: () => import(/* webpackChunkName: "page" */ '@/components/error-page/666'),
    name: '666',
    meta: {
      keepAlive: true,
      isTab: false,
      isAuth: false
    }
  },
  {
    path: '/test',
    name: 'test',
    component: () => import(/* webpackChunkName: "page" */ '@/views/uploadDemo/test.vue'),
    meta: {
      title: '上传demo'
    }
  },
  {
    path: '/uploadDemo',
    name: 'uploadDemo',
    component: () => import(/* webpackChunkName: "page" */ '@/views/uploadDemo/uploadDemo.vue'),
    meta: {
      title: '上传demo'
    }
  },
  {
    name: 'WatchLive',
    path: '/watchLive',
    component: () => import('@/views/live/WatchLive.vue'),
    meta: {
      title: '观看直播'
    }
  },
  {
    name: 'BeginLive',
    path: '/beginLive',
    component: () => import('@/views/live/BeginLive.vue'),
    meta: {
      title: '开始直播'
    }
  },
  {
    path: '/',
    redirect: '/home',
    component: Layout,
    children: [
      {
        path: '/search',
        redirect: '/search/list',
        component: EmptyLayout,
        title: '搜索',
        children: [
          {
            path: 'list',
            name: 'SearchList',
            component: () => import(/* webpackChunkName: "page"*/ '@/views/home/search/list.vue'),
            meta: {
              title: '搜索',
              fullscreen: true
            }
          }
        ]
      },
      {
        path: '/lecturer',
        redirect: '/lecturer/list',
        component: EmptyLayout,
        title: '讲师风采',
        children: [
          {
            path: 'list',
            name: 'LecturerList',
            component: () => import(/* webpackChunkName: "page"*/ '@/views/home/lecturer/list.vue'),
            meta: {
              title: '讲师风采'
            }
          },
          {
            path: 'detail',
            name: 'lecturerDetail',
            component: () =>
              import(/* webpackChunkName: "page"*/ '@/views/home/lecturer/detail.vue'),
            meta: {
              title: '讲师详情'
            }
          }
        ]
      },
      {
        path: '/course',
        redirect: '/course/list',
        component: EmptyLayout,
        title: '课程',
        children: [
          {
            path: 'list',
            name: 'CourseList',
            component: () => import(/* webpackChunkName: "page"*/ '@/views/course/CourseList.vue'),
            meta: {
              title: '课程资源'
            }
          },
          {
            path: 'detail',
            name: 'CourseDetail',
            component: () =>
              import(/* webpackChunkName: "page"*/ '@/views/course/CourseDetail.vue'),
            meta: {
              title: '课程详情'
            }
          },
          {
            path: 'learn',
            name: 'CourseLearn',
            component: () => import(/* webpackChunkName: "page"*/ '@/views/course/CourseLearn.vue'),
            meta: {
              title: '课程学习',
              fullscreen: true
            }
          }
        ]
      },
      {
        path: '/knowledge',
        redirect: '/knowledge/list',
        component: EmptyLayout,
        title: '知识库',
        children: [
          {
            name: 'KnowledgeList',
            path: 'list',
            component: () => import(/* webpackChunkName: "page"*/ '@/views/knowledge/List.vue'),
            meta: {
              title: '知识分享'
            }
          },
          {
            path: 'detail',
            name: 'KnowledgeDetail',
            component: () => import(/* webpackChunkName: "page"*/ '@/views/knowledge/Detail.vue'),
            meta: {
              title: '知识详情'
            }
          },
          {
            path: 'share',
            name: 'share',
            component: () => import(/* webpackChunkName: "page"*/ '@/views/knowledge/share.vue'),
            meta: {
              title: '一点分享'
            }
          }
        ]
      },
      {
        path: '/exam',
        redirect: '/exam/list',
        component: EmptyLayout,
        title: '考试',
        children: [
          {
            name: 'ExamList',
            path: 'list',
            component: () => import(/* webpackChunkName: "page"*/ '@/views/exam/List.vue'),
            meta: {
              title: '考试中心'
            }
          },
          {
            path: 'detail',
            name: 'ExamDetail',
            component: () => import(/* webpackChunkName: "page"*/ '@/views/exam/Detail.vue'),
            meta: {
              title: '查看答卷'
            }
          },
          {
            path: 'middle',
            name: 'ExamMiddle',
            component: () => import(/* webpackChunkName: "page"*/ '@/views/exam/Middle.vue'),
            meta: {
              title: '考试详情'
            }
          },
          {
            path: 'paper',
            name: 'ExamPaper',
            component: () => import(/* webpackChunkName: "page"*/ '@/views/exam/Paper.vue'),
            meta: {
              title: '参与考试',
              fullscreen: true,
              keepAlive: false
            }
          }
        ]
      },
      {
        path: '/live',
        redirect: '/live/list',
        component: EmptyLayout,
        title: '直播',
        children: [
          {
            name: 'LiveList',
            path: 'list',
            component: () => import(/* webpackChunkName: "page"*/ '@/views/live/List.vue'),
            meta: {
              title: '直播中心'
            }
          },
          {
            name: 'LiveDetail',
            path: 'Detail',
            component: () => import(/* webpackChunkName: "page"*/ '@/views/live/Detail.vue'),
            meta: {
              title: '直播详情'
            }
          },
          {
            name: 'WatchLive',
            path: 'WatchLive',
            component: () => import(/* webpackChunkName: "page"*/ '@/views/live/WatchLive.vue'),
            meta: {
              title: '观看直播'
            }
          },
          {
            name: 'replay',
            path: 'replay',
            component: () => import(/* webpackChunkName: "page"*/ '@/views/live/Replay.vue'),
            meta: {
              title: '直播回放'
            }
          }
        ]
      },
      {
        path: '/learn',
        redirect: '/learn/list',
        component: EmptyLayout,
        title: '学习',
        children: [
          {
            path: 'list',
            name: 'LearnList',
            component: () => import(/* webpackChunkName: "page"*/ '@/views/learn/List.vue'),
            meta: {
              title: '学习列表'
            }
          }
        ]
      },
      {
        path: '/auth', // 注册页面
        redirect: '/login',
        component: EmptyLayout,
        children: [
          {
            path: '/login',
            name: 'Login',
            meta: {
              title: '登录页面',
              isAuth: false,
              isNotCenter: true,
              fullscreen: true
            },
            component: () => import(/* webpackChunkName: "page"*/ '@/views/auth/Login.vue')
          },
          {
            path: '/register', // 注册页面
            name: 'Register',
            meta: {
              isAuth: false,
              title: '注册页面',
              isNotCenter: true,
              fullscreen: true
            },
            component: () => import(/* webpackChunkName: "page"*/ '@/views/auth/Register.vue')
          },
          {
            path: '/forgetPassword', // 忘记密码页面
            name: 'ForgetPassword',
            meta: {
              isAuth: false,
              title: '忘记密码页面',
              isNotCenter: true,
              fullscreen: true
            },
            component: () => import(/* webpackChunkName: "page"*/ '@/views/auth/ForgetPassword.vue')
          }
        ]
      },
      {
        path: '/news',
        redirect: '/news/list',
        component: EmptyLayout,
        title: '新闻',
        children: [
          {
            path: 'list',
            name: 'list',
            component: () => import(/* webpackChunkName: "page" */ '@/views/news/NewsList.vue'),
            meta: {
              title: '新闻中心'
            }
          },
          {
            path: 'Details',
            name: 'newsDetails',
            component: () => import(/* webpackChunkName: "page" */ '@/views/news/NewsDetail.vue'),
            meta: {
              title: '文章详情'
            }
          }
        ]
      },
      {
        path: '/systemList',
        redirect: '/systemList/trainSystem',
        component: EmptyLayout,
        title: '制度清单',
        children: [
          {
            path: 'trainSystem',
            name: 'trainSystem',
            component: () =>
              import(/* webpackChunkName: "page" */ '@/views/systemList/trainSystem.vue'),
            meta: {
              title: '制度清单'
            }
          }
        ]
      },
      {
        path: '/ranking',
        redirect: '/ranking/rankIntegralList',
        component: EmptyLayout,
        title: '排行榜',
        children: [
          {
            path: 'rankIntegralList',
            name: 'rankIntegralList',
            component: () =>
              import(/* webpackChunkName: "page" */ '@/views/ranking/rankIntegralList.vue'),
            meta: {
              title: '排行榜'
            }
          }
        ]
      },
      {
        path: '/my',
        redirect: '/my/info',
        component: EmptyLayout,
        title: '个人中心',
        children: [
          {
            path: 'info',
            name: 'personal',
            component: () => import(/* webpackChunkName: "page" */ '@/views/my/Personal.vue'),
            meta: {
              title: '个人信息'
            }
          },
          {
            path: 'record',
            name: 'record',
            component: () => import(/* webpackChunkName: "page" */ '@/views/my/Record.vue'),
            meta: {
              title: '我的档案'
            }
          }
        ]
      },
      // 新的个人中心
      {
        path: '/personal',
        redirect: '/personal/personal',
        component: EmptyLayout,
        title: '个人中心',
        children: [
          {
            path: 'personal',
            name: 'personal',
            component: () =>
              import(/* webpackChunkName: "page" */ '@/views/personal/myPersonal.vue'),
            meta: {
              title: '个人中心'
            }
          }
        ]
      },
      // 个人中心里面的积分

      {
        path: '/Integral',
        name: 'Integral',
        component: () =>
          import(/* webpackChunkName: "page" */ '@/views/personal/components/Integral.vue'),
        meta: {
          title: '我的积分'
        }
      },

      // 个人中心里面的证书
      {
        path: '/Certificate',
        name: 'Certificate',
        component: () =>
          import(/* webpackChunkName: "page" */ '@/views/personal/components/Certificate.vue'),
        meta: {
          title: '我的证书'
        }
      },
      {
        path: '/CertificateDetail',
        name: 'CertificateDetail',
        component: () =>
          import(
            /* webpackChunkName: "page" */
            '@/views/personal/components/CertificateDetail.vue'
          ),
        meta: {
          title: '证书详情'
        }
      },
      {
        path: '/train', // 培训页面
        redirect: '/train/index',
        component: EmptyLayout,
        children: [
          {
            path: 'index',
            name: 'trainIndex',
            meta: {
              title: '培训中心'
            },
            component: () => import(/* webpackChunkName: "page"*/ '@/views/train')
          },
          {
            path: 'detail',
            name: 'trainDetail',
            meta: {
              title: '培训详情'
            },
            component: () => import(/* webpackChunkName: "page"*/ '@/views/train/detail')
          }
        ]
      },
      {
        path: '/message',
        redirect: '/message/list',
        component: EmptyLayout,
        title: '消息',
        children: [
          {
            name: 'MessageList',
            path: 'list',
            component: () =>
              import(/* webpackChunkName: "page"*/ '@/views/message/MessageList.vue'),
            meta: {
              title: '消息列表'
            }
          }
        ]
      },
      {
        path: '/approvalCenter',
        redirect: '/approvalCenter/center',
        component: EmptyLayout,
        title: '审批中心',
        children: [
          {
            path: 'approveIndex',
            name: 'approveIndex',
            component: () =>
              import(/* webpackChunkName: "page" */ '@/views/approvalCenter/approveIndex.vue'),
            meta: {
              title: '审批中心'
            }
          },
          {
            path: 'submitSucceed',
            name: 'submitSucceed',
            component: () =>
              import(/* webpackChunkName: "page" */ '@/views/application/submitSucceed.vue'),
            meta: {
              title: '申请已提交'
            }
          },
          {
            path: 'applyError',
            name: 'applyError',
            component: () =>
              import(/* webpackChunkName: "page" */ '@/views/application/applyError.vue'),
            meta: {
              title: '申请失败'
            }
          },
          {
            path: 'applyBuyTrain',
            name: 'applyBuyTrain',
            component: () =>
              import(/* webpackChunkName: "page" */ '@/views/application/applyBuyTrain.vue'),
            meta: {
              title: '外购培训申请'
            }
          },
          {
            path: 'applyCourseDev',
            name: 'applyCourseDev',
            component: () =>
              import(/* webpackChunkName: "page" */ '@/views/application/applyCourseDev.vue'),
            meta: {
              title: '课程开发申请'
            }
          },
          {
            path: 'applyTutorDenti',
            name: 'applyTutorDenti',
            component: () =>
              import(/* webpackChunkName: "page" */ '@/views/application/applyTutorDenti.vue'),
            meta: {
              title: '导师认证申请'
            }
          },
          {
            path: 'applyTeacherIdentification',
            name: 'applyTeacherIdentification',
            component: () =>
              import(
                /* webpackChunkName: "page" */
                '@/views/application/applyTeacherIdentification.vue'
              ),
            meta: {
              title: '讲师认证申请'
            }
          },
          {
            path: 'applyStudyDoctorate',
            name: 'applyStudyDoctorate',
            component: () =>
              import(/* webpackChunkName: "page" */ '@/views/application/applyStudyDoctorate.vue'),
            meta: {
              title: '在职读博申请'
            }
          },
          {
            path: 'applyOutsideTrainBookbuilding',
            name: 'applyOutsideTrainBookbuilding',
            component: () =>
              import(
                /* webpackChunkName: "page" */
                '@/views/application/applyOutsideTrainBookbuilding.vue'
              ),
            meta: {
              title: '外派培训申请'
            }
          },
          {
            path: 'applyLeave',
            name: 'applyLeave',
            component: () =>
              import(/* webpackChunkName: "page" */ '@/views/application/applyLeave.vue'),
            meta: {
              title: '培训请假申请'
            }
          },
          {
            path: 'outsideTraining',
            name: 'outsideTraining',
            component: () =>
              import(/* webpackChunkName: "page" */ '@/views/application/outsideTraining.vue'),
            meta: {
              title: '外训报名申请'
            }
          },
          {
            path: 'trainingNeeds',
            name: 'trainingNeeds',
            component: () =>
              import(/* webpackChunkName: "page" */ '@/views/application/trainingNeeds.vue'),
            meta: {
              title: '培训需求申请'
            }
          },
          {
            path: 'center',
            name: 'center',
            component: () =>
              import(/* webpackChunkName: "page" */ '@/views/approvalCenter/center.vue'),
            meta: {
              title: '审批中心'
            }
          },
          {
            path: 'details',
            name: 'details',
            component: () =>
              import(/* webpackChunkName: "page" */ '@/views/approvalCenter/details.vue'),
            meta: {
              title: '审批详情'
            }
          },
          {
            path: 'chapter',
            name: 'chapter',
            component: () =>
              import(/* webpackChunkName: "page" */ '@/views/approvalCenter/chapter.vue'),
            meta: {
              title: '章节详情'
            }
          }
        ]
      },

      {
        path: '/lecturerTask',
        redirect: '/lecturerTask/task',
        component: lecturerTask,
        children: [
          {
            name: 'lecturerTask',
            path: '/lecturerTask/task',
            // redirect: '/myTask/myLearn/myRequiredList',
            // component: myLearnLayout,
            meta: {
              title: '讲师任务'
            },
            children: [
              // {
              //   path: 'myRequiredList',
              //   name: 'myRequiredList',
              //   component: () =>
              //     import(/* webpackChunkName: "page"*/ '@/views/myTask/myRequiredList.vue'),
              //   meta: {
              //     title: '必修课'
              //   }
              // },
              // {
              //   path: 'myTrainList',
              //   name: 'myTrainList',
              //   component: () =>
              //     import(/* webpackChunkName: "page" */ '@/views/myTask/myTrainList.vue'),
              //   meta: {
              //     title: '培训'
              //   }
              // },
              // {
              //   path: 'myElectiveList',
              //   name: 'myElectiveList',
              //   component: () =>
              //     import(/* webpackChunkName: "page" */ '@/views/myTask/myElectiveList.vue'),
              //   meta: {
              //     title: '选修课'
              //   }
              // },
              // {
              //   path: 'myLiveList',
              //   name: 'myLiveList',
              //   component: () =>
              //     import(/* webpackChunkName: "page" */ '@/views/myTask/myLiveList.vue'),
              //   meta: {
              //     title: '直播'
              //   }
              // }
            ]
          }
          // {
          //   path: '/myTask/myExamList',
          //   name: 'myExamList',
          //   component: () => import('@/views/myTask/myExamList.vue'),
          //   meta: {
          //     title: '考试'
          //   }
          // }
        ]
      },
      {
        path: '/ExternalTraining',
        name: 'ExternalTraining',
        component: () => import('@/views/lecturerTask/train/ExternalTraining.vue'),
        meta: {
          title: '培训详情-外训'
        }
      },
      {
        path: '/InternalTraining',
        name: 'InternalTraining',
        component: () => import('@/views/lecturerTask/train/InternalTraining.vue'),
        meta: {
          title: '培训详情-内训'
        }
      },
      // 必修上报材料
      {
        path: '/materials',
        name: 'materials',
        component: () => import('@/views/lecturerTask/requiredCourse/materials.vue'),
        meta: {
          title: '查看上报材料'
        }
      },
      // 选修上报材料
      {
        path: '/electiveMaterials',
        name: 'electiveMaterials',
        component: () => import('@/views/lecturerTask/electiveCourses/electiveMaterials.vue'),
        meta: {
          title: '查看上报材料'
        }
      },
      // 培训上报材料
      {
        path: '/trainMaterials',
        name: 'trainMaterials',
        component: () => import('@/views/lecturerTask/train/stuff/trainMaterials.vue'),
        meta: {
          title: '查看上报材料'
        }
      },
      {
        path: '/requiredCourseDetail',
        name: 'requiredCourseDetail',
        component: () => import('@/views/lecturerTask/requiredCourse/requiredCourseDetail.vue'),
        meta: {
          title: '必修课详情'
        }
      },
      {
        path: '/examinationDetail',
        name: 'examinationDetail',
        component: () => import('@/views/lecturerTask/requiredCourse/examinationDetail.vue'),
        meta: {
          title: '考试详情'
        }
      },
      {
        path: '/liveExaminationDetail',
        name: 'liveExaminationDetail',
        component: () => import('@/views/lecturerTask/live/liveExaminationDetail.vue'),
        meta: {
          title: '考试详情'
        }
      },
      {
        path: '/electiveCoursesDetail',
        name: 'electiveCoursesDetail',
        component: () => import('@/views/lecturerTask/electiveCourses/electiveCoursesDetail.vue'),
        meta: {
          title: '必修课详情'
        }
      },
      {
        path: '/myTask',
        redirect: '/myTask/myLearn',
        component: myTaskLayout,
        children: [
          {
            name: 'myLearn',
            path: '/myTask/myLearn',
            // redirect: '/myTask/myLearn/myRequiredList',
            // component: myLearnLayout,
            title: '学习',
            meta: {
              title: '我的任务'
            },
            children: [
              {
                path: 'myRequiredList',
                name: 'myRequiredList',
                component: () =>
                  import(/* webpackChunkName: "page"*/ '@/views/myTask/myRequiredList.vue'),
                meta: {
                  title: '必修课'
                }
              },
              {
                path: 'myTrainList',
                name: 'myTrainList',
                component: () =>
                  import(/* webpackChunkName: "page" */ '@/views/myTask/myTrainList.vue'),
                meta: {
                  title: '培训'
                }
              },
              {
                path: 'myElectiveList',
                name: 'myElectiveList',
                component: () =>
                  import(/* webpackChunkName: "page" */ '@/views/myTask/myElectiveList.vue'),
                meta: {
                  title: '选修课'
                }
              },
              {
                path: 'myLiveList',
                name: 'myLiveList',
                component: () =>
                  import(/* webpackChunkName: "page" */ '@/views/myTask/myLiveList.vue'),
                meta: {
                  title: '直播'
                }
              }
            ]
          },
          {
            path: '/myTask/myExamList',
            name: 'myExamList',
            component: () => import('@/views/myTask/myExamList.vue'),
            meta: {
              title: '考试'
            }
          }
        ]
      },
      {
        path: '/myRequiredDetails',
        name: 'myRequiredDetails',
        component: () => import('@/views/myTask/myRequiredDetails.vue'),
        meta: {
          title: '必修课详情'
        }
      },
      //   作业-必修课详情
      {
        path: '/myTask/compulsoryDetail',
        name: 'compulsoryDetail',
        component: () => import('@/views/myTask/myHomeWork/components/compulsoryDetail.vue'),
        meta: {
          title: '作业-必修课详情'
        }
      },
      //   作业-培训详情
      {
        path: '/myTask/trainingDetail',
        name: 'trainingDetail',
        component: () => import('@/views/myTask/myHomeWork/components/trainingDetail.vue'),
        meta: {
          title: '作业-培训详情'
        }
      },
      //   作业-选修课详情
      {
        path: '/myTask/electiveDetail',
        name: 'electiveDetail',
        component: () => import('@/views/myTask/myHomeWork/components/electiveDetail.vue'),
        meta: {
          title: '作业-选修课详情'
        }
      },
      //   作业-调查问卷
      {
        path: '/myTask/fillQuestionnaire',
        name: 'fillQuestionnaire',
        component: () => import('@/views/myTask/questionnaire/fillQuestionnaire.vue'),
        meta: {
          title: '作业-调查问卷'
        }
      },
      {
        path: '/myTask/checkQuestionnaire',
        name: 'checkQuestionnaire',
        component: () => import('@/views/myTask/questionnaire/checkQuestionnaire.vue'),
        meta: {
          title: '作业-查看问卷'
        }
      },
      //   社区模块
      {
        path: '/community',
        redirect: '/community/recommended',
        component: EmptyLayout,
        title: '社区',
        children: [
          {
            name: 'recommended',
            path: 'recommended',
            component: () => import('@/views/community'),
            meta: {
              title: '推荐'
            }
          },
          {
            name: 'communityDetails',
            path: 'communityDetails',
            component: () => import('@/views/community/components/communityDetails'),
            meta: {
              title: '社区详情'
            }
          },
          {
            name: 'otherHomePage',
            path: 'otherHomePage',
            component: () => import('@/views/community/components/otherHomePage'),
            meta: {
              title: '他人主页'
            }
          },
          {
            name: 'zoneHomePage',
            path: 'zoneHomePage',
            component: () => import('@/views/community/components/zoneHomePage'),
            meta: {
              title: '社区主页'
            }
          },
          {
            name: 'postDetails',
            path: 'postDetails',
            component: () => import('@/views/community/components/postDetails'),
            meta: {
              title: '帖子详情'
            }
          },
          {
            name: 'knowledge-system',
            path: '/knowledge-system',
            component: () => import('@/views/knowledge-system/index.vue'),
            meta: {
              title: '知识体系'
            }
          }
        ]
      },
      ...(process.env.NODE_ENV === 'development' ? demoRoutes : [])
    ]
  }
]
import VueRouter from 'vue-router'
const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push(location) {
  return originalPush.call(this, location).catch((err) => err)
}
