<template>
  <div>
    <div class="insert-teamer-box">
      <div class="input-item">
        <b class="label">添加协作者：</b>
        <a-select
          v-model="teamer"
          show-search
          class="ant-input"
          :default-active-first-option="false"
          :show-arrow="false"
          :filter-option="false"
          :not-found-content="null"
          @search="handleSearch"
          @change="handleChange"
        >
          <a-select-option v-for="d in users" :key="d.id">
            {{ d.nickname }}
          </a-select-option>
        </a-select>
        <a-button class="add-collaborator-btn" type="primary" ghost @click="addCoordination">
          添加
        </a-button>
      </div>
    </div>
    <a-table
      v-if="dataSource.length"
      bordered
      :data-source="dataSource"
      :columns="columns"
      size="small"
      :pagination="false"
    >
      <template slot="userAvatar" slot-scope="text, record">
        <GUserPopover :user-id="record.userId">
          <a-avatar :src="text" />
        </GUserPopover>
      </template>
      <template slot="operation" slot-scope="text, record">
        <a-popconfirm
          v-if="dataSource.length"
          title="确定要删除该协助者吗?"
          on-text="确认"
          cancel-text="取消"
          @confirm="() => onDelete(record)"
        >
          <a href="javascript:;">删除</a>
        </a-popconfirm>
      </template>
    </a-table>
  </div>
</template>

<script>

export default {
  name: 'UserList',
  props: {
    wikiId: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      dataSource: [],
      columns: [
        {
          title: '头像',
          dataIndex: 'userAvatar',
          width: '30%',
          scopedSlots: { customRender: 'userAvatar' }
        },
        {
          title: '昵称',
          dataIndex: 'userNickName'
        },
        {
          title: '操作',
          dataIndex: 'operation',
          scopedSlots: { customRender: 'operation' }
        }
      ],
      addLoading: false,
      teamer: '',
      currentUser: null,
      users: []
    }
  },
  mounted () {
    this.getUserList()
  },
  methods: {
    clearState () {
      this.teamer = ''
      this.currentUser = null
    },
    addCoordination () {
      if (this.addLoading) return
      this.addLoading = true
      this.$api.addWikiCollaborator({
        wikiId: this.wikiId,
        userId: this.currentUser.id
      }).then((res) => {
        this.addLoading = false
        if (res.success) {
          this.$message.success('添加成功')
          this.clearState()
          this.getUserList()
        } else {
          this.$message.error(res.message)
        }
      })
    },
    handleSearch (val) {
      this.teamer = val
      this.$api.getUserByName(val).then((list) => {
        this.users = list
      })
    },
    handleChange (val) {
      this.users.forEach((item) => {
        if (item.id === +val) {
          this.teamer = item.nickname
          this.currentUser = item
        }
      })
    },
    onCellChange (key, dataIndex, value) {
      const dataSource = [...this.dataSource]
      const target = dataSource.find(item => item.key === key)
      if (target) {
        target[dataIndex] = value
        this.dataSource = dataSource
      }
    },
    onDelete (data) {
      this.$api.delWikiCollaborator({
        wikiId: this.wikiId,
        userId: data.userId
      }).then((res) => {
        if (res.success) {
          this.$message.success('删除成功')
          this.getUserList()
        } else {
          this.$message.error(res.message)
        }
      })
    },
    getUserList () {
      this.$api.getWikiCollaboratorList({
        wikiId: this.wikiId
      }).then((users) => {
        this.dataSource = [...users]
      })
    }
  }
}
</script>

<style lang="less" scoped>
.insert-teamer-box {
  margin-bottom: @g-margin * 2;
  .input-item {
    display: flex;
    height: 40px;
    align-items: center;
    .label {
      display: inline-block;
      white-space: nowrap;
    }
    /deep/.ant-select-selection--single {
      height: 30px !important;
      border: 0 !important;
    }
    .add-collaborator-btn {
      margin-left: @g-margin * 2;
    }
  }
}
</style>
