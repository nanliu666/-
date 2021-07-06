import {getPositionUserList1, getPostionUserChild2, getGroup, getUsergroupList} from '@/api/user'


export const personPickerOptions= {
    props: {
        label: 'name', // 右边已选择列表的label
        value: 'userId', // 右边已选择列表的key
        select: ['userId', 'name', 'orgName', 'positionName', 'workNo', 'phoneNum', 'orgId', 'birthDate'] // 要提取到已选择列表的值的key
    },
    options: [  // 传入一个对象 代表一个tab
        {
            name: '岗位',
            response: {
              props: {
                data: ['positions', 'users']
              }
            },
            request: getPostionUserChild2,
            type: 'tree',
            placeholder: '搜索岗位名称',
            checkRequest: {
              condition: function($data) {
                return !$data.userId
              },
              handler: function($data, resolve) {
                getPositionUserList1({ parentId: $data.positionId }).then((res = {}) => {
                  if (Array.isArray(res)) {
                    resolve(res)
                  } else {
                    let data = []
                    Object.keys(res).forEach((key) => {
                      data = data.concat(res[key])
                    })
                    resolve(data)
                  }
                })
              }
            },
            treeOption: {
              props: {
                label: function(node) {
                  if (node.positionId) {
                    return node.positionName
                  }
                  return node.name
                },
                children: 'children',
                selectLabel: 'name'
              },
              nodeKey: 'userId',
            },
            query: {
              search: {
                key: 'search',
                value: ''
              },
              id: {
                key: 'parentId',
                value: '0',
                initialValue: '0',
                from: 'positionId'
              }
            },
            props: {
              value: 'userId',
              select: ['userId', 'name', 'orgName', 'positionName', 'workNo', 'phoneNum', 'orgId', 'birthDate']
            }
        },
        {
            name: '分组',
            request: getGroup,
            resolveRequest: {
                condition: function(node) {
                // node 是el-tree的node
                return !node.data.userId
                },
                handler: function (node, resolve) {
                // node 是el-tree的node
                getUsergroupList({ ids: node.data.id }).then(res => {
                    resolve(res)
                })
                }
            },
            type: 'tree',
            placeholder: '搜索分组名称',
            treeOption: {
                props: {
                label: 'name',
                children: 'children'
                },
                'check-strictly': false,
                nodeKey: 'userId',
            },
            checkRequest: {
                condition: function (data) {
                return !data.userId
                },
                handler: function (data, resolve) {
                getUsergroupList({ ids: data.id }).then(res => {
                    resolve(res)
                })
                }
            },
            props: {
                value: 'userId',
                select: ['userId', 'name', 'orgName', 'positionName', 'workNo', 'phoneNum', 'orgId', 'birthDate']
            },
            response: {
                props: {
                data: 'records',
                total: 'totalNum'
                },
            },
            label: function(node) {
                const { name } = node
                return name
            },
            query: {
                search: {
                key: 'search',
                value: ''
                },
            }
        }
    ],
    selectedStyle: {
        icon: 'icon-approval-checkin-bicolor', // 右边选择列表的icon
        label: function(node) { // 可以是函数也可以字符串
              const { name, phoneNum } = node
              if (phoneNum) {
                return name + '(' + phoneNum + ')'
              }
              return name
        } // 右边选择列表的label格式化方法
    },
    visible: {
      type: Boolean,
      default: false
    },
    dialogTitle: {
      type: String, 
      default: '添加人员'  // 选择框标题
    },
    headerTitle: {
      type: String,
      default: '请选择人员' // 二级标题
    },
    reserve: {
      type: Boolean,  // 是否保留默认的options 二个tab 。一个是选组织机构 一个是选外部人员
      default: true
    }
}