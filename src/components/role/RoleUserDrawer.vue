<script setup lang="ts">
import { ref, reactive, defineProps, defineEmits, watch } from 'vue'
import { message } from 'ant-design-vue'
import { PlusOutlined } from '@ant-design/icons-vue'
import request from '@/utils/request.ts'

const props = defineProps({
  visible: {
    type: Boolean,
    default: false
  },
  roleId: {
    type: [Number, String],
    default: ''
  },
  roleData: Object
})

const emit = defineEmits(['update:visible'])

// 搜索表单数据
const username = ref('')

// 表格数据
const dataSource = ref([])
const dataSource1 = ref([])
const loading = ref(false)

// 用户选择相关
const userSelectVisible = ref(false)
const selectedRowKeys = ref<string[]>([])
const selectedRows = ref([])

// 表格列定义
const columns = [
  {
    title: '账号',
    dataIndex: 'username',
  },
  {
    title: '用户姓名',
    dataIndex: 'realname',
  },
  {
    title: '状态',
    dataIndex: 'status',
    key: 'status'
  },
  {
    title: '操作',
    key: 'action',
    width: 120
  }
]


// 获取用户列表
const fetchUserList = async () => {

  try {
    loading.value = true
    const { data } = await request.get('/api/user/userRoleList', {
      params: {
        roleId: props.roleId,
        page: pagination.pageNo,
        pageSize: pagination.pageSize,
      }
    })
    if (data.success) {
      dataSource1.value = data.result.records
      pagination.total = data.result.total
    }
  } catch (error) {
    message.error('获取用户列表失败')
  } finally {
    loading.value = false
  }
}

const fetchUserRoleList = async () => {

  const { data } = await request.get('/api/user/getYxUserList', {
    params: {
      pageNo: pagination.pageNo,
      pageSize: pagination.pageSize,
    }
  })
  if (data.success) {
    dataSource.value = data.result.records
    pagination.total = data.result.total
  }
}

const handleTableChange = (pag: any) => {
  pagination.pageNo = pag.pageNo
  pagination.pageSize = pag.pageSize
  fetchUserList()
}

// 搜索
const onSearch = (value: string) => {
  username.value = value
  fetchUserList()
}

// 重置
const handleReset = () => {
  username.value = ''
  fetchUserList()
}

// 打开用户选择
const handleAdd = () => {
  userSelectVisible.value = true
  selectedRowKeys.value = []
  globalSelectedKeys = []  // 重置全局变量
  selectedRows.value = []
  fetchUserRoleList()
}

// 确认选择用户
const handleConfirmSelect = async () => {

  if (!globalSelectedKeys || globalSelectedKeys.length === 0) {
    message.warning('请选择要添加的用户')
    return
  }
console.log('当前选中的行：', globalSelectedKeys)

  try {
    const { data } = await request.post('/api/user/bindUsers', {
      list: globalSelectedKeys, // 重置全局变量,
      roleId: props.roleId,
    })
    if (data.code === 200) {
      message.success('添加用户成功')
      userSelectVisible.value = false
      fetchUserList()
    } else {
      message.error(data.message || '添加用户失败')
    }
  } catch (error) {
    message.error('添加用户失败')
  }
}

// 取消关联
const handleUnbind = async (record: any) => {
  try {
    const { data } = await request.post('/api/user/unbindUser', {
      roleId: props.roleId,
      userId: record.id
    })
    if (data.code === 200) {
      message.success('取消关联成功')
      fetchUserList()
    }
  } catch (error) {
    message.error('取消关联失败')
  }
}

// 分页配置
const pagination = reactive({
  pageNo: 1,
  pageSize: 5,
  total: 0,
  showSizeChanger: true,
  showQuickJumper: true,
})

watch(() => props.visible, (val) => {
  if (val) {
    fetchUserList()
  }
})

// 在组件外部定义
let globalSelectedKeys = [];
</script>

<template>
  <a-drawer
      title="角色用户"
      placement="right"
      :width="800"
      :visible="visible"
      @close="() => emit('update:visible', false)"
  >
    <div class="drawer-content">
      <!-- 搜索区域 -->
      <a-card class="search-area" :bordered="false">
        <a-input-search
            v-model:value="username"
            placeholder="请输入用户账号"
            style="width: 300px"
            @search="onSearch"
        />
        <a-button style="margin-left: 8px" @click="handleReset">重置</a-button>
      </a-card>

      <!-- 按钮区域 -->
      <div class="button-area">
        <a-space>
          <a-button type="primary" @click="handleAdd">
            <template #icon><plus-outlined /></template>
            新增用户
          </a-button>
        </a-space>
      </div>

      <!-- 表格区域 -->
      <a-table
          :columns="columns"
          :data-source="dataSource1"
          :loading="loading"
          :pagination="pagination"
          @change="handleTableChange"
          bordered
      >
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'status'">
            <a-tag>
              {{ record.status === 0 ? '未注册' : record.status === 1 ? '正常' : '冻结' }}
            </a-tag>
          </template>
          <template v-else-if="column.key === 'action'">
            <a-popconfirm
                title="确定要取消关联该用户吗？"
                @confirm="handleUnbind(record)"
            >
              <a class="text-danger">取消关联</a>
            </a-popconfirm>
          </template>
        </template>
      </a-table>
    </div>

    <!-- 用户选择弹窗 -->
    <a-modal
        v-model:visible="userSelectVisible"
        title="用户选择列表"
        @ok="handleConfirmSelect"
        width="80%"
    >
      <a-table
          :columns="columns.filter(col => col.key !== 'action')"
          :data-source="dataSource"
          :loading="loading"
          :row-key="record => record.id"
          :row-selection="{
            selectedRowKeys: selectedRowKeys.value,
            onChange: (keys: (string | number)[], rows: any[]) => {
              globalSelectedKeys = [...keys]
             selectedRowKeys.value = keys
             selectedRows.value = rows
           console.log('选中的keys：',globalSelectedKeys)
  }
}"
          bordered
      >
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'status'">
            <a-tag >
              {{ record.status === 0 ? '未注册' : record.status === 1 ? '正常' : '冻结' }}
            </a-tag>
          </template>
        </template>
      </a-table>
    </a-modal>
  </a-drawer>
</template>

<style scoped>
.drawer-content {
  padding: 24px;
}

.search-area {
  margin-bottom: 16px;
}

.button-area {
  margin-bottom: 16px;
}

.text-danger {
  color: #ff4d4f;
}
</style>