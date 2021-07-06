<template>
  <el-dialog
    class="common-picker"
    :title="dialogTitle"
    :visible.sync="dialogVisible"
    destroy-on-close
    append-to-body
    width="700px"
  >
    <div class="dialog-body">
      <div class="area left">
        <div class="area-header">
          {{ headerTitle }}
        </div>

        <div class="area-body">
          <el-tabs>
            <el-tab-pane
              v-for="tab in tabOptions"
              :key="tab.$id"
              :label="tab.name"
            >
              <div class="content">
                <div class="search-container">
                  <el-input
                    v-model="tab.query.search['value']"
                    class="search-box"
                    :placeholder="tab.placeholder || '请输入'"
                    clearable
                  ></el-input>
                </div>
                <div
                  class="data-container"
                  :class="{ 'margin-top-5px': tab.type === 'tree' }"
                >
                  <div
                    v-if="tab.type === 'tree'"
                    style="height: 100%; overflow-y: scroll"
                  >
                    <el-tree
                      :ref="'tree' + tab.$id"
                      :check-strictly="tab.treeOption['check-strictly']"
                      lazy
                      :node-key="tab.treeOption['nodeKey'] || 'id'"
                      :default-expanded-keys="defaultExpandedKeys"
                      show-checkbox
                      :props="tab.treeOption.props"
                      :data="tab.$data"
                      :load="(node, resolve) => requestTreeData(node, resolve, tab)"
                      @check="
                        (node, { checkedNodes }) => treeCheckChange({ node, checkedNodes }, tab)
                      "
                    ></el-tree>
                  </div>

                  <el-table
                    v-if="tab.type === 'table'"
                    :ref="'table' + tab.$id"
                    v-table-scroll="() => requestTableData(tab)"
                    :row-key="tab.props.value"
                    :data="tab.$data"
                    height="100%"
                    @row-click="(row) => handleTableRowClick(row, tab)"
                    @selection-change="(rows) => handleTableSelectionChange(rows, tab)"
                  >
                    <el-table-column
                      type="selection"
                      width="55"
                      reserve-selection
                    >
                    </el-table-column>
                    <el-table-column
                      min-width="100"
                      label="全选"
                    >
                      <template slot-scope="scope">
                        {{
                          typeof tab.label === 'function'
                            ? tab.label(scope.row)
                            : scope.row[tab.label]
                        }}
                      </template>
                    </el-table-column>
                  </el-table>
                </div>
              </div>
            </el-tab-pane>
          </el-tabs>
        </div>
      </div>
      <div class="area right">
        <div class="area-header">
          已选 {{ selectList.length }} 项
        </div>
        <div class="area-body">
          <div
            v-if="selectList.length"
            class="selected-list-wrapper"
          >
            <ul class="selected-list">
              <li
                v-for="(selector, index) in selectList"
                :key="selector.$id"
                class="select-item"
              >
                <i
                  class="iconfont select-type-icon"
                  :class="getSelectedIcon()"
                ></i>
                <div class="select-name">
                  {{ getSelectedLabel(selector) }}
                </div>

                <i
                  class="select-del-btn el-icon-error"
                  @click="handleDeleteSelector(selector, index)"
                ></i>
              </li>
            </ul>
          </div>
          <div
            v-else
            class="empty-tips"
          >
            <img
              src="@/assets/images/nodata.png"
              class="empty-img"
            />
            <div class="empty-text">
              暂无数据
            </div>
          </div>
        </div>
      </div>
    </div>

    <div
      slot="footer"
      class="dialog-footer"
    >
      <el-button
        size="medium"
        @click="dialogVisible = false"
      >
        取 消
      </el-button>
      <el-button
        type="primary"
        size="medium"
        @click="confirm"
      >
        确 定
      </el-button>
    </div>
  </el-dialog>
</template>

<script>
import { getOrgUserChild, getOuterUser, getUserList } from '@/api/user'

function deepClone(target) {
  let result
  if (Array.isArray(target)) {
    result = []
    target.forEach((item) => {
      result.push(deepClone(item))
    })
  } else if (typeof target === 'object') {
    result = {}
    Object.keys(target).forEach((key) => {
      result[key] = deepClone(target[key])
    })
  } else {
    result = target
  }
  return result
}
const INITIAL_OPTIONS = [
  {
    name: '组织机构',
    request: getOrgUserChild,
    response: {
      props: {
        data: ['orgs', 'users'],
        total: 'totalNum'
      }
    },
    type: 'tree',
    placeholder: '搜索组织部门或成员姓名',
    checkRequest: {
      condition: function($data) {
        return !$data.userId
      },
      handler: function($data, resolve) {
        getUserList({ orgId: $data.id }).then((res = []) => {
          resolve(res)
        })
      }
    },
    treeOption: {
      props: {
        label: 'name',
        children: 'children'
      },
      'check-strictly': false,
      nodeKey: 'userId'
    },
    query: {
      search: {
        key: 'search',
        value: ''
      },
      id: {
        key: 'parentId',
        from: 'id',
        value: '0',
        initialValue: '0'
      }
    },
    props: {
      value: 'userId',
      select: ['userId', 'name', 'orgName', 'positionName', 'workNo', 'phoneNum', 'orgId', 'birthDate']
    }
  },
  {
    name: '外部人员',
    request: getOuterUser,
    type: 'table',
    placeholder: '搜索成员姓名',
    response: {
      props: {
        data: 'data',
        total: 'totalNum'
      }
    },
    props: {
      value: 'userId',
      select: ['userId', 'name', 'orgName', 'positionName', 'workNo', 'phonenum','orgId', 'birthDate']
    },
    label: function(data) {
      const { name, phonenum } = data
      if (phonenum) {
        return name + '(' + phonenum + ')'
      }
      return name
    },
    query: {
      search: {
        key: 'search',
        value: ''
      },
      page: {
        key: 'pageNo',
        value: 1
      },
      pageSize: {
        key: 'pageSize',
        value: 20
      }
    }
  }
]
export default {
  name: 'CommonPicker',
  directives: {
    tableScroll: {
      bind(el, binding) {
        // el-table 内容滚动区域
        const bodyWrap = el.querySelector('.el-table__body-wrapper')
        bodyWrap.addEventListener('scroll', function() {
          let sign = 0
          // 滚动到底部
          const scrollDistance = this.scrollHeight - this.scrollTop - this.clientHeight
          if (scrollDistance <= sign) {
            binding.value()
          }
        })
      }
    }
  },
  model: {
    prop: 'selectedValue',
    event: 'change'
  },
  props: {
    props: {
      type: Object,
      default() {
        return {
          value: 'bizId',
          select: ['bizId', 'bizName', 'orgName', 'positionName', 'workNo', 'phoneNum', 'orgId']
        }
      }
    },
    selectedValue: {
      type: Array,
      default() {
        return []
      }
    },
    options: {
      type: Array,
      default() {
        return INITIAL_OPTIONS
      }
    },
    selectedStyle: {
      type: Object,
      default() {
        return {
          icon: 'icon-approval-checkin-bicolor',
          label: function(node) {
            const { bizName, phoneNum } = node
            if (phoneNum) {
              return bizName + '(' + phoneNum + ')'
            }
            return bizName
          }
        }
      }
    },
    visible: {
      type: Boolean,
      default: false
    },
    dialogTitle: {
      type: String,
      default: '添加人员'
    },
    headerTitle: {
      type: String,
      default: '请选择人员'
    },
    reserve: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      tabOptions: [],
      selectList: [],
      defaultExpandedKeys: ['selected'],
      unMatchList: []
    }
  },
  computed: {
    dialogVisible: {
      get() {
        return this.visible
      },
      set(val) {
        this.$emit('update:visible', val)
      }
    }
  },

  watch: {
    dialogVisible(val) {
      if (!val) {
        this.tabOptions = []
        this.selectList = []
        return
      }
      this.init()
    }
  },
  methods: {
    handleTableRowClick(row, tab) {
      tab.$component.toggleRowSelection(row)
    },
    handleTableSelectionChange(rows, tab) {
      if (rows.length) {
        const selection = tab._selection
        if (selection.length) {
          const value = tab.props.value
          const isRemove = selection.length > rows.length
          let list = []
          if (isRemove) {
            list = selection.filter(
              (selector) => rows.findIndex((row) => row[value] === selector[value]) < 0
            )
          } else {
            list = rows.filter(
              (row) => selection.findIndex((selector) => row[value] === selector[value]) < 0
            )
          }
          list.forEach((row) => {
            this.updateSelectList(row, isRemove, tab)
          })
        } else {
          rows.forEach((row) => {
            this.updateSelectList(row, false, tab)
          })
        }
      } else {
        tab._selection.forEach((select) => {
          this.updateSelectList(select, true, tab)
        })
      }
      tab._selection = JSON.parse(JSON.stringify(rows))
      tab.$selection = rows
    },
    initTableLoadDom(tab) {
      this.$nextTick(() => {
        let el = tab.$component.$el
        const bodyWrap = el.querySelector('.el-table__body-wrapper')
        let loadDiv = (tab.$loadDom = document.createElement('div'))
        loadDiv.className = 'load-text'
        loadDiv.style.textAlign = 'center'
        loadDiv.style.display = 'none'
        loadDiv.style.padding = '12px 0'
        loadDiv.style.color = '#8b8b8b'
        const loadTextDom = el.querySelectorAll('.load-text')
        let { page, pageSize } = tab.query
        page = page.value
        pageSize = pageSize.value
        const total = tab.$total
        // 未添加节点时添加
        if (!loadTextDom.length) {
          loadDiv.innerHTML = page * pageSize >= total ? '加载中...' : '没有更多了'
          bodyWrap.appendChild(loadDiv)
        }
        // 已生成节点时处理
        if (loadTextDom.length) {
          const loadText = el.querySelector('.load-text')
          loadText.style.display = 'none'
          loadText.innerHTML = page * pageSize >= total ? '加载中...' : '没有更多了'
        }
      })
    },
    uniqArray(arr, key) {
      const obj = {}
      return arr.reduce(function(newArr, current) {
        if (!obj[current[key]]) {
          obj[current[key]] = true
          newArr.push(current)
        }
        return newArr
      }, [])
    },
    getSelectedIcon() {
      const { icon = 'icon-approval-checkin-bicolor' } = this.selectedStyle
      const classObj = {}
      classObj[icon] = true
      return classObj
    },
    getSelectedLabel(item) {
      const { label } = this.selectedStyle
      return typeof label === 'function' ? label(item) : item[label]
    },
    treeCheckChange(data, tab) {
      const { node, checkedNodes } = data
      this.handleTreeCheckChange(node, !checkedNodes.includes(node), tab)
    },
    async handleTreeCheckChange($data, isRemove, tab) {
      if ($data[tab.treeOption.nodeKey] === 'selected') {
        $data[tab.treeOption.props.children].map((c) => {
          this.updateSelectList(c, isRemove, tab)
        })
        return
      }

      if (tab.checkRequest) {
        const { condition, handler = () => {} } = tab.checkRequest
        if (!condition || (condition && !condition($data))) {
          this.updateSelectList($data, isRemove, tab)
          return
        }
        const promise = new Promise((resolve) => {
          handler($data, resolve)
        })
        tab.$loading = true
        let data = await promise
        tab.$loading = false
        data.forEach((item) => {
          this.updateSelectList(item, isRemove, tab)
        })
        return
      }

      this.updateSelectList($data, isRemove, tab)
    },
    async requestTreeData(node, resolve, tab) {
      if (node && !Array.isArray(node.data)) {
        const {
          props: { children },
          nodeKey
        } = tab.treeOption
        if (node.data[nodeKey] === 'selected') {
          resolve(node.data[children])
          return
        }
        if (tab.resolveRequest) {
          const { condition, handler = () => {} } = tab.resolveRequest
          if (!condition || (condition && condition(node))) {
            const promise = new Promise((_resolve) => {
              handler(node, _resolve)
            })
            const data = await promise
            resolve(data)
            return
          }
        }
        if (node.data[nodeKey] && tab.checkRequest) {
          resolve([])
          return
        }
      }
      const {
        query: { id, search }
      } = tab

      if (id && search) {
        id.disabled = false
        search.disabled = true
        if (node && node.data) {
          id.value = node.data[id.from]
        } else if (search.value) {
          id.disabled = true
          search.disabled = false
        }
      } else if (search) {
        search.disabled = false
      }
      if ((id && !id.value) || !node) {
        id.value = id.initialValue
      }
      tab.$loading = true
      this.handleRequest(tab)
        .then((data) => {
          const $selectedData = tab.$selectedData
          if ($selectedData.length && !$selectedData.hasSelection) {
            const initialData = {}
            let {
              props: { children, label, selectLabel },
              nodeKey
            } = tab.treeOption
            initialData[children] = JSON.parse(JSON.stringify($selectedData))
            initialData[nodeKey] = 'selected'
            if (typeof label == 'function') {
              label = selectLabel
            }

            initialData[label] = '已选'
            data = [initialData].concat(data)
            this.$nextTick(() => tab.$component.setChecked('selected', true, true))
            $selectedData.hasSelection = true
          }

          if (resolve) {
            resolve(data)
          } else {
            tab.$data = data
          }
          if (this.selectList.length) {
            this.$nextTick(() => {
              this.selectList.map((data) => {
                tab.$component.setChecked(data[this.props.value], true, true)
              })
            })
          }
        })
        .finally(() => {
          tab.$loading = true
        })
    },
    requestTableData(tab, isSearch) {
      if (tab.$loading) return
      const { query, $loadDom } = tab
      if ($loadDom) {
        $loadDom.innerHTML = '加载中...'
        $loadDom.style.display = 'block'
      }
      tab.$loading = true
      if (isSearch) {
        query.page.value = 1
      } else {
        query.page.value++
      }
      this.handleRequest(tab)
        .then((data) => {
          const $selectedData = tab.$selectedData
          if (isSearch) {
            if ($selectedData.length && !query.search.value) {
              // reset
              tab.$data = this.uniqArray($selectedData.concat(data), tab.props.value)
              tab.$data.slice(0, $selectedData.length).forEach((row) => {
                tab.$component.toggleRowSelection(row, true)
                tab.$selection.push(row)
              })
            } else {
              tab.$data = data
            }
          } else {
            data = data.filter(
              (item) =>
                $selectedData.findIndex(
                  (selector) => selector[tab.props.value] === item[tab.props.value]
                ) < 0
            )
            tab.$data = tab.$data.concat(data)
          }
          if (this.unMatchList.length) {
            const list = data.filter((item) => {
              const matchIndex = this.unMatchList.findIndex(
                (selector) => item[tab.props.value] === selector[this.props.value]
              )
              if (matchIndex > -1) {
                this.unMatchList.splice(matchIndex, 1)
                return true
              }
              return false
            })
            this.$nextTick(() => {
              list.map((row) => {
                tab.$component.toggleRowSelection(row)
                tab.$selection.push(row)
              })
            })
          }

          this.$forceUpdate()
          if (!$loadDom && tab.$data.length) {
            this.initTableLoadDom(tab)
          } else {
            if (!tab.$data.length) {
              $loadDom.display = 'none'
            }
            let { page, pageSize } = query
            page = page.value
            pageSize = pageSize.value
            if (page * pageSize >= tab.$total) {
              $loadDom.innerHTML = '没有更多了'
            }
          }
          tab.$loading = false
        })
        .catch(() => {
          tab.$loading = false
        })
    },
    init() {
      let options = []
      if (this.reserve && this.options !== INITIAL_OPTIONS) {
        options = INITIAL_OPTIONS.concat(this.options)
      } else {
        options = this.options
      }
      const selectedValue = JSON.parse(JSON.stringify(this.selectedValue))
      const records = []
      this.tabOptions = options.map((option, index) => {
        const tabOption = deepClone(option)
        tabOption.$id = index + ''
        tabOption.$data = []
        tabOption.$loading = false
        if (tabOption.type === 'table') {
          tabOption.$selection = []
          tabOption._selection = []
        }
        tabOption.$selectedData = []
        if (selectedValue.length) {
          const tabSelectedValue = selectedValue.filter((selector) => {
            if (selector.__requestApiName && selector.__requestApiName === tabOption.request.name) {
              records.push(selector)
              return true
            }
          })
          if (tabSelectedValue.length) {
            tabOption.$selectedData = tabSelectedValue.map((selector) => {
              const obj = {}
              this.props.select.map((key, index) => {
                obj[tabOption.props.select[index]] = selector[key]
              })
              return obj
            })
            tabOption.$selectedData.forEach((row) => this.updateSelectList(row, false, tabOption))
          }
        }
        return tabOption
      })
      selectedValue
        .filter((selector) => {
          return !records.includes(selector)
        })
        .map((selector) => {
          this.unMatchList.push(selector)
          this.selectList.push(selector)
        })
      this.tabOptions.forEach((tabOption, index) => {
        if (tabOption.type === 'table') {
          this.requestTableData(tabOption, true)
        }
        const { type, $id } = tabOption
        this.$nextTick(() => {
          tabOption.$component = this.$refs[type + $id][0]
        })
        this.$watch(
          `tabOptions.${index}.query.search`,
          _.debounce((search) => {
            if (search !== tabOption.query.search) return
            if (tabOption.type === 'tree') {
              this.requestTreeData(undefined, undefined, tabOption)
            } else {
              this.requestTableData(tabOption, true)
            }
          }, 1000),
          { deep: true }
        )
      })
    },
    handleRequest(tab) {
      const { request, query, response } = tab
      const params = this.paramsBuilder(query)
      return new Promise((resolve) => {
        request(params)
          .then((res = {}) => {
            let data = []
            if (Array.isArray(res)) {
              data = res
            } else {
              const { props } = response
              let { data: dataKey, total: totalKey } = props
              if (Array.isArray(dataKey)) {
                dataKey.map((key) => {
                  data = data.concat(res[key])
                })
              } else {
                data = res[dataKey]
              }
              resolve(data)
              if (totalKey) {
                const total = res[totalKey]
                if (typeof total === 'number' || typeof total === 'string') {
                  tab.$total = total
                }
              }
            }
          })
          .catch(() => {
            resolve([])
          })
      })
    },
    paramsBuilder(query) {
      let params = {}
      for (const k in query) {
        if (k === 'total') {
          continue
        }
        const cur = query[k]
        const { key, value, disabled } = cur
        if (!disabled) {
          params[key] = value
        }
      }
      return params
    },
    updateSelectList(current, isRemove, tab) {
      const selectList = this.selectList
      const index = selectList.findIndex(
        (selector) => selector[this.props.value] === current[tab.props.value]
      )
      if (isRemove) {
        if (index > -1) {
          selectList.splice(index, 1)
        }
      } else {
        if (index < 0) {
          const selector = {}
          this.props.select.map((key, index) => {
            selector[key] = current[tab.props.select[index]]
          })
          selector.$tabId = tab.$id
          selectList.push(selector)
        }
      }
    },
    handleDeleteSelector(selector, index) {
      this.selectList.splice(index, 1)
      const { $tabId } = selector
      if (!$tabId) {
        return
      }
      const tab = this.tabOptions[$tabId]
      let { type, $selection, $component } = tab
      if (type === 'tree') {
        this.$nextTick(() => {
          $component.setChecked(selector[this.props.value], false, false)
          $component.$forceUpdate()
          this.$forceUpdate()
        })
      } else {
        let row
        tab.$selection = $selection.filter((selection) => {
          if (selection[tab.props.value] !== selector[this.props.value]) {
            return true
          } else {
            row = selection
            return false
          }
        })
        $component.toggleRowSelection(row, false)
      }
    },
    findTreeNode(nodeList, keys, value) {
      for (let index = 0; index < nodeList.length; index++) {
        const node = nodeList[index]
        for (let k = 0; k < keys.length; k++) {
          const key = keys[k]
          if (node[key] === value) {
            return node
          }
        }
        if (!node.children) continue
        return this.findTreeNode(node.children, keys, value)
      }
    },
    confirm() {
      const list = this.selectList.map((selector) => {
        if (!selector.__requestApiName && selector.$tabId) {
          selector.__requestApiName = this.tabOptions[selector.$tabId].request.name
          delete selector.$tabId
        }
        return selector
      })
      this.$emit('change', list)
      this.dialogVisible = false
    }
  }
}
</script>

<style lang="scss">
.common-picker {
  .el-table--border::after,
  .el-table--group::after,
  .el-table::before {
    background-color: transparent;
  }
  .el-table .cell {
    font-weight: 500;
  }
  .el-table__row {
    cursor: pointer;
  }
  .el-tabs__header {
    padding: 0 12px;
  }
  .el-scrollbar__wrap {
    overflow-x: hidden;
  }
  .el-table td,
  .el-table th.is-leaf {
    border-bottom: none;
  }
  .dialog-body {
    display: flex;
    border: 1px solid #f2f2f2;
    width: 100%;
    box-sizing: border-box;
    .area {
      display: flex;
      flex-direction: column;
      height: 550px;
      .area-header {
        flex: 0 0 48px;
        height: 48px;
        width: 100%;
        line-height: 48px;
        padding-left: 12px;
        font-size: 13px;
        color: #606266;
        border-bottom: 1px solid #f2f2f2;
      }
      .area-body {
        flex: 1;
        height: 0;
        .el-tabs {
          display: flex;
          flex-direction: column;
          height: 100%;
          .el-tabs__content {
            flex: 1;
            height: 0;
            .el-tab-pane {
              height: 100%;
              .content {
                display: flex;
                flex-direction: column;
                height: 100%;
                .search-container {
                  padding: 0 12px;
                }
                .data-container {
                  position: relative;
                  flex: 1;
                  margin-top: 5px;
                  height: 0;
                  .empty-tips {
                    position: absolute;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    font-size: 12px;
                    color: #606266;
                  }
                }
              }
            }
          }
        }
        .selected-list-wrapper {
          height: 100%;
          overflow-y: scroll;
          .selected-list {
            .select-item {
              cursor: default;
              display: flex;
              padding: 5px 8px;
              align-items: center;
              .select-type-icon {
                flex: 0 0 32px;
                font-size: 32px;
                margin-right: 5px;
                color: #01aafc;
              }
              .select-name {
                flex: 1;
                width: 0;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
                color: #333;
                font-size: 14px;
              }
              .select-del-btn {
                cursor: pointer;
                flex: 0 0 20px;
                font-size: 20px;
              }
            }
          }
        }
      }
      &.left {
        width: 60%;
        border-right: 1px solid #f2f2f2;
        box-sizing: border-box;
      }
      &.right {
        width: 40%;
        .area-body {
          position: relative;
          .empty-tips {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            text-align: center;
            .empty-img {
              width: 120px;
              height: 120px;
            }
            .empty-text {
              font-size: 12px;
            }
          }
        }
      }
    }
  }
  .margin-top-5px {
    margin-top: 5px;
  }
}
</style>
