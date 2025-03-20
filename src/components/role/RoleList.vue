<script setup lang="ts">
import { ref, reactive, onMounted, watch} from 'vue'
import { message } from 'ant-design-vue'
import { DownOutlined } from "@ant-design/icons-vue"
import request from '@/utils/request.ts'
import type { UnwrapRef } from 'vue';
import { cloneDeep } from 'lodash-es';
import RoleForm from "@/components/role/RoleForm.vue";
import RoleUserDrawer from "@/components/role/RoleUserDrawer.vue";


interface RoleRecord {
  id?: number
  roleName?: string
  roleCode?: string
  remark?: string
  status?: number
}

// 搜索表单数据
const searchForm = reactive({
  roleName: '',
  roleCode: '',
})

// 表格加载状态
const loading = ref(false)

// 表格列定义
const columns = [
  {
    title: '角色名称',
    dataIndex: 'roleName',
  },
  {
    title: '角色编码',
    dataIndex: 'roleCode',
  },
  {
    title: '备注',
    dataIndex: 'remark',
  },
  {
    title: '状态',
    dataIndex: 'status',
    key: 'status'
  },
  {
    title: '操作',
    key: 'action',
    width: 210,
    fixed: 'right' as const,
  },

]

onMounted(() => {
  fetchRoleList()
})

const handleFormSuccess = () => {
  fetchRoleList()
}

const fetchRoleList = async () => {
  try {
    loading.value = true
    const { data } = await request.get('/api/role/getRoleList', {
      params: {
        pageNo: pagination.pageNo,
        pageSize: pagination.pageSize,
        roleName: searchForm.roleName,
        roleCode: searchForm.roleCode,
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
const formVisible = ref(false)
const currentRecord = ref<RoleRecord>({})

// 用户抽屉相关
const userDrawerVisible = ref(false)
const currentRoleId = ref<number | string>('')

const handleViewUsers = (record: RoleRecord) => {
  currentRoleId.value = record.id || ''
  currentRoleData.value = record  // 保存完整的行数据
  userDrawerVisible.value = true
}
const currentRoleData = ref<RoleRecord>({})


// 分页配置
const pagination = reactive({
  pageNo: 1,
  pageSize: 10,
  total: 0,
  showSizeChanger: true,
  showQuickJumper: true,
})

// 新增方法
const handleAdd = () => {
  currentRecord.value = {}
  formVisible.value = true
}

const handleSearch = async () => {
  const {data} = await request.get('/api/role/getRoleList', {
    params: {
      roleName: searchForm.roleName,
      roleCode: searchForm.roleCode
    }
  })
  if (data.success) {
    dataSource.value = data.result.records
  }
}

const handleReset = () => {
  searchForm.roleName = ''
  searchForm.roleCode = ''
  pagination.pageNo = 1
  fetchRoleList()
}


// 删除方法
const handleDelete = async (record: any) => {
  try {
    const { data } = await request.delete('/api/role/delete', {
      params: { id: record.id }
    })
    if (data.code === 200) {
      message.success('删除成功')
      fetchRoleList()
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
  fetchRoleList()
}


// 编辑相关的数据和方法
const editableData: UnwrapRef<Record<string, RoleRecord>> = reactive({})

const edit = (record: RoleRecord) => {
  editableData[record.id as number] = cloneDeep(record)
}


const dongjie = async (record: RoleRecord) => {
  const {data} = await request.put('/api/role/dongjie', record)
  if (data.success) {
    message.success('编辑成功！')
    fetchRoleList()
  }else {
    message.error(data.message);
  }
}

const save = async (record: RoleRecord) => {
  try {
    const row = editableData[record.id as number]
    const { data } = await request.put('/api/role/edit', row)
    if (data.code === 200) {
      message.success('编辑成功')
      delete editableData[record.id as number]
      fetchRoleList()
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
        <a-form-item label="角色名称">
          <a-input
              v-model:value="searchForm.roleName"
              placeholder="请输入角色名称"
              allow-clear
          />
        </a-form-item>
        <a-form-item label="角色编号">
          <a-input
              v-model:value="searchForm.roleCode"
              placeholder="请输入角色编号"
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
                <a-button type="primary" @click="handleAdd">
                  <template #icon><plus-outlined /></template>
                  新增
                </a-button>
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
        <template v-if="column.dataIndex === 'roleName' || column.dataIndex === 'roleCode' || column.dataIndex === 'remark'">
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
          <a-tag :color="record.status === 0 ? 'processing' : 'error'">
            {{ record.status === 0 ? '正常' : '冻结' }}
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
              <a @click="handleViewUsers(record)">用户</a>
              <a-divider type="vertical" />
              <a-dropdown>
                <a class="ant-dropdown-link" @click.prevent>
                  更多
                  <DownOutlined />
                </a>
                <template #overlay>
                  <a-menu>
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
                        {{record.status === 0 ? '冻结' : '解除' }}
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

<RoleForm  v-model:visible="formVisible"
           :title="currentRecord.id ? '编辑角色' : '添加角色'"
           @success="handleFormSuccess"
/>

    <RoleUserDrawer
        v-model:visible="userDrawerVisible"
        :role-id="currentRoleId"
        :role-data="currentRoleData"
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