<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { message } from 'ant-design-vue'
import { PlusOutlined } from "@ant-design/icons-vue"
import request from '@/utils/request.ts'
import CompanyForm from "@/components/company/CompanyForm.vue";
import type { UnwrapRef } from 'vue';
import { cloneDeep } from 'lodash-es';

interface CompanyRecord {
  id?: number
  companyName?: string
  address?: string
  phone?: string
  email?: string
  scale?: string
  description?: string
  createTime?: string
  companyType?: string
  tel?: string
  clTime?: string
  content?: string
  registCapital?: string
  people?: string
  status?: string
}

// 搜索表单数据
const searchForm = reactive({
  companyName: '',
})

// 表格加载状态
const loading = ref(false)
const formVisible = ref(false)
const currentRecord = ref<CompanyRecord>({})
const companyName = ref('')
// 表格列定义
const columns = [
  // {
  //   title: '创建时间',
  //   dataIndex: 'createTime',
  // },
  {
    title: '公司名称',
    dataIndex: 'companyName',
  },
  {
    title: '公司类型',
    dataIndex: 'companyType',
  },
  {
    title: '联系电话',
    dataIndex: 'tel',
  },
  {
    title: '公司经营地址',
    dataIndex: 'address',
  },
  {
    title: '电子邮箱',
    dataIndex: 'email',
  },
  {
    title: '成立日期',
    dataIndex: 'clTime',
  },
  {
    title: '公司简介',
    dataIndex: 'content',
  },
  {
    title: '注册资本',
    dataIndex: 'registCapital',
  },
  {
    title: '法人',
    dataIndex: 'people',
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
  fetchCompanyList()
})

const fetchCompanyList = async () => {
  try {
    loading.value = true
    const { data } = await request.get('/api/company/getCompanyList', {
      params: {
        page: pagination.pageNo,
        pageSize: pagination.pageSize,
        company: searchForm.companyName
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

const onSearch = async (value) => {

  const {data} = await request.get('/api/company/getCompanyList', {
    params: {
      companyName: value
    }
  })
  if (data.success) {
    dataSource.value = data.result.records
  }
}
//
// const handleReset = () => {
//   searchForm.companyName = ''
//   pagination.pageNo = 1
//   fetchCompanyList()
// }

// 新增方法
const handleAdd = () => {
  currentRecord.value = {}
  formVisible.value = true
}


// 删除方法
const handleDelete = async (record: any) => {
  try {
    const { data } = await request.delete('/api/company/delete', {
      params: { id: record.id }
    })
    if (data.code === 200) {
      message.success('删除成功')
      fetchCompanyList()
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
  fetchCompanyList()
}

const handleFormSuccess = () => {
  fetchCompanyList()
}

// 编辑相关的数据和方法
const editableData: UnwrapRef<Record<string, CompanyRecord>> = reactive({})

const edit = (record: CompanyRecord) => {
  editableData[record.id as number] = cloneDeep(record)
}

const dongjie = async (record: CompanyRecord) => {
  const {data} = await request.put('/api/company/dongjie', record)
  if (data.success) {
    message.success('编辑成功！')
    fetchCompanyList()
  }
}

const save = async (record: CompanyRecord) => {
  try {
    const row = editableData[record.id as number]
    const { data } = await request.put('/api/company/edit', row)
    if (data.code === 200) {
      message.success('编辑成功')
      delete editableData[record.id as number]
      fetchCompanyList()
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
    <!-- 搜索区域 -->
    <a-card class="search-area" :bordered="false">
      <a-input-search
          v-model:value="companyName"
          placeholder="请输入菜单名称"
          style="width: 300px"
          @search="onSearch"
      />
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
        <template v-if="column.dataIndex === 'companyName' || column.dataIndex === 'address'">
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
          <a-tag :color="record.status === 0 ? 'success' : 'error'">
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
                <a-divider type="vertical" />
                <a @click="dongjie(record)" :class="record.status === 1 ? 'text-success' : 'text-warning'">
                  {{ record.status === 1 ? '解除' : '冻结' }}
                </a>
                <a-divider type="vertical" />
                <a-popconfirm
                    title="确定要删除这条记录吗？"
                    @confirm="handleDelete(record)"
                >
                  <a class="text-danger">删除</a>
                </a-popconfirm>
              </a-space>
            </template>
          </div>
        </template>
      </template>
    </a-table>

    <!-- 添加/编辑表单对话框 -->
    <CompanyForm
      v-model:visible="formVisible"
      :title="currentRecord.id ? '编辑公司' : '添加公司'"
      @success="handleFormSuccess"
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