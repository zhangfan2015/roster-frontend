<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { message } from 'ant-design-vue'
import { DownOutlined } from "@ant-design/icons-vue"
import request from '@/utils/request.ts'
import type { UnwrapRef } from 'vue';
import { cloneDeep } from 'lodash-es';
import PasswordModal from "@/components/user/PasswordModal.vue";


interface UserRecord {
  id?: number
  username?: string
  realname?: string
  sex?: string
  age?: string
  email?: string
  phone?: string
  img?: string
  departName?: string
  status?: number
  delFlag?: number
}

// 搜索表单数据
const searchForm = reactive({
  username: '',
  realname: '',
})

// 表格加载状态
const loading = ref(false)
// 表格列定义
const columns = [
  {
    title: '账号',
    dataIndex: 'username',
  },
  {
    title: '姓名',
    dataIndex: 'realname',
  },
  {
    title: '性别',
    dataIndex: 'sex',
  },
  {
    title: '年龄',
    dataIndex: 'age',
  },
  {
    title: '手机号',
    dataIndex: 'phone',
  },
  {
    title: '邮箱',
    dataIndex: 'email',
  },
  {
    title: '头像',
    dataIndex: 'img',
  },
  {
    title: '所属部门',
    dataIndex: 'departName',
  },
  {
    title: '状态',
    dataIndex: 'status',
    key: 'status',
    width: 100
  },
  {
    title: '操作',
    key: 'action',
    width: 210,
    fixed: 'right' as const,
  },
]

onMounted(() => {
  fetchUserList()
})

const fetchUserList = async () => {
  try {
    loading.value = true
    const { data } = await request.get('/api/user/getUserList', {
      params: {
        pageNo: pagination.pageNo,
        pageSize: pagination.pageSize,
        username: searchForm.username,
        realname: searchForm.realname,
      }
    })

    if (data.code === 200) {
      dataSource.value = data.result.records
      pagination.total = data.result.total
    } else {
      message.error(data.message || '获取数据失败')
    }
  } catch (error) {
    message.error('获取数据失败')
  } finally {
    loading.value = false
  }
}

// 表格数据
const dataSource = ref([])

// 分页配置
const pagination = reactive({
  pageNo: 1,
  pageSize: 10,
  total: 0,
  showSizeChanger: true,
  showQuickJumper: true,
})


const handleSearch = async () => {
  const {data} = await request.get('/api/user/getUserList', {
    params: {
      username: searchForm.username,
      realname: searchForm.realname
    }
  })
  if (data.success) {
    dataSource.value = data.result.records
  }
}

const handleReset = () => {
  searchForm.username = ''
  searchForm.realname = ''
  pagination.pageNo = 1
  fetchUserList()
}


// 删除方法
const handleDelete = async (record: any) => {
  try {
    const { data } = await request.delete('/api/user/delete', {
      params: { id: record.id }
    })
    if (data.code === 200) {
      message.success('删除成功')
      fetchUserList()
    } else {
      message.error(data.message || '删除失败')
    }
  } catch (error) {
    message.error('删除失败')
  }
}

const handleTableChange = (pag: any) => {
  pagination.pageNo = pag.pageNo
  pagination.pageSize = pag.pageSize
  fetchUserList()
}


// 编辑相关的数据和方法
const editableData: UnwrapRef<Record<string, UserRecord>> = reactive({})

const edit = (record: UserRecord) => {
  editableData[record.id as number] = cloneDeep(record)
}

const passwordModalVisible = ref(false)
const currentUsername = ref('')

const editPs = async (record: UserRecord) => {
  currentUsername.value = record.username || ''
  passwordModalVisible.value = true
}

const dongjie = async (record: UserRecord) => {
  const {data} = await request.put('/api/user/updateStatus', record)
  if (data.success) {
    message.success('编辑成功！')
    fetchUserList()
  }else {
    message.error(data.message);
  }
}

const save = async (record: UserRecord) => {
  try {
    const row = editableData[record.id as number]
    const { data } = await request.put('/api/user/edit', row)
    if (data.code === 200) {
      message.success('编辑成功')
      delete editableData[record.id as number]
      fetchUserList()
    } else {
      message.error(data.message || '编辑失败')
    }
  } catch (error) {
    message.error('编辑失败')
  }
}

const cancel = (id: number) => {
  delete editableData[id]
}
</script>

<template>
  <div class="table-page">
    <a-card class="search-area" :bordered="false">
      <a-form layout="inline">
        <a-form-item label="用户账号">
          <a-input
              v-model:value="searchForm.username"
              placeholder="请输入用户账号"
              allow-clear
          />
        </a-form-item>
        <a-form-item label="用户姓名">
          <a-input
              v-model:value="searchForm.realname"
              placeholder="请输入用户姓名"
              allow-clear
          />
        </a-form-item>
        <a-form-item>
          <a-button type="primary" @click="handleSearch">搜索</a-button>
          <a-button style="margin-left: 8px" @click="handleReset">重置</a-button>
        </a-form-item>
      </a-form>
    </a-card>

    <!-- 按钮区域 -->
    <div class="button-area">
      <a-space>
<!--        <a-button type="primary" @click="handleAdd">-->
<!--          <template #icon><plus-outlined /></template>-->
<!--          新增-->
<!--        </a-button>-->
        <!--        <a-button @click="handleExport">-->
        <!--          <template #icon><download-outlined /></template>-->
        <!--          导出-->
        <!--        </a-button>-->
      </a-space>
    </div>

    <!-- 表格区域 -->
    <a-table
        :columns="columns"
        :data-source="dataSource"
        :loading="loading"
        :pagination="pagination"
        @change="handleTableChange"
        bordered
    >
      <template #bodyCell="{ column, text, record }">
        <template v-if="column.dataIndex === 'realname' || column.dataIndex === 'age'  || column.dataIndex === 'sex' || column.dataIndex === 'phone'">
          <div class="editable-cell">
            <template v-if="editableData[record.id]">
              <a-input
                  v-model:value="editableData[record.id][column.dataIndex]"
                  style="margin: -5px 0"
              />
            </template>
            <template v-else>
              {{ text }}
            </template>
          </div>
        </template>
        <template v-else-if="column.key === 'status'">
          <a-tag :color="record.status === 0 ? 'success' : record.status === 1 ? 'processing' : 'error'">
            {{ record.status === 0 ? '未注册' : record.status === 1 ? '正常' : '冻结' }}
          </a-tag>
        </template>
        <template v-else-if="column.key === 'action'">
          <div class="editable-row-operations">
            <template v-if="editableData[record.id]">
              <a-typography-link @click="save(record)">保存</a-typography-link>
              <a-divider type="vertical" />
              <a-typography-link @click="cancel(record.id)">取消</a-typography-link>
            </template>
            <template v-else>
              <a-space>
                <a @click="edit(record)">编辑</a>
              </a-space>
              <a-divider type="vertical" />
              <a-dropdown>
                <a class="ant-dropdown-link" @click.prevent>
                  更多
                  <DownOutlined />
                </a>
                <template #overlay>
                  <a-menu>
                    <a-menu-item>
                      <a @click="editPs(record)">修改密码</a>
                    </a-menu-item>
                    <a-menu-item>
                      <a-popconfirm
                          title="确定要删除这条记录吗？"
                          @confirm="handleDelete(record)"
                      >
                        <a class="text-danger">删除</a>
                      </a-popconfirm>
                    </a-menu-item>
                    <a-menu-item>
                      <a @click="dongjie(record)">
                        {{ record.status === 0 ? '未注册' : record.status === 1 ? '冻结' : '解除' }}
                      </a>
                    </a-menu-item>
                  </a-menu>
                </template>
              </a-dropdown>
            </template>
          </div>
        </template>
      </template>
    </a-table>

    <!--修改密码form-->
    <PasswordModal
        v-model:visible="passwordModalVisible"
        :username="currentUsername"
        @success="fetchUserList"
    />

  </div>

</template>

<style scoped>
.table-page {
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
.editable-cell {
  position: relative;
  padding: 5px 12px;
  cursor: pointer;
}

.editable-row-operations a {
  margin-right: 8px;
}
.text-warning {
  color: #faad14;
}

.text-success {
  color: #52c41a;
}
</style>