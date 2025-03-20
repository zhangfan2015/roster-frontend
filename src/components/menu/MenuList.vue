<template>
  <div class="all-content">

  <div class="menu-table">
    <!-- 顶部搜索和按钮区域 -->
    <div class="table-header">
      <a-input-search
          v-model:value="menuName"
          placeholder="请输入菜单名称"
          style="width: 300px"
          @search="onSearch"
      />
      <div class="header-buttons">
<!--        <a-button type="primary" @click="handleAddTop">+ 新增菜单</a-button>-->
<!--        <a-button @click="expandAll">展开全部</a-button>-->
<!--        <a-button @click="collapseAll">折叠全部</a-button>-->
      </div>
    </div>

    <!-- 表格 -->
    <a-table
        :columns="columns"
        :data-source="tableData"
        :row-selection="{ selectedRowKeys: selectedKeys, onChange: onSelectChange }"
        :pagination="false"
        :expandable="{
        defaultExpandAllRows: true
      }"
        :loading="loading"
    >
      <!-- 菜单名称列 -->
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'menuName'">
          <span v-if="record.children">
            {{ record.menuName }}
          </span>
          <span v-else class="indent-item">
            {{ record.menuName }}
          </span>
        </template>

        <!-- 图标列 -->
        <template v-if="column.key === 'icon'">
          <component :is="record.icon" v-if="record.icon" />
          <span v-else>-</span>
        </template>

        <!-- 操作列 -->
<!--        <template v-if="column.key === 'action'">-->
<!--          <a-space>-->
<!--            <a @click="handleEdit(record)">编辑</a>-->
<!--            <a @click="handleAddSub(record)">添加下级</a>-->
<!--          </a-space>-->
<!--        </template>-->
      </template>
    </a-table>

    <!-- 抽屉表单 -->
<!--    <a-drawer-->
<!--        :visible="drawerVisible"-->
<!--        :title="drawerTitle"-->
<!--        placement="right"-->
<!--        width="500px"-->
<!--        @close="closeDrawer"-->
<!--    >-->
<!--      <div class="drawer-content">-->
<!--        <a-tabs v-model:activeKey="activeTabKey">-->
<!--          <a-tab-pane key="1" tab="一级菜单">-->
<!--            <MenuDrawer ref="menuDrawerRef" :parent-menu="selectedParentMenu" />-->
<!--          </a-tab-pane>-->
<!--          <a-tab-pane key="2" tab="子菜单">-->
<!--            <MenuDrawer ref="menuDrawerRef" :parent-menu="selectedParentMenu" />-->
<!--          </a-tab-pane>-->
<!--        </a-tabs>-->
<!--      </div>-->
<!--      <div class="drawer-footer">-->
<!--        <a-button style="margin-right: 8px" @click="closeDrawer">取消</a-button>-->
<!--        <a-button type="primary" @click="handleSubmit" style="margin-right: 20px">确认</a-button>-->
<!--      </div>-->
<!--    </a-drawer>-->

<!--    <a-drawer-->
<!--        :visible="drawerSonVisible"-->
<!--        :title="drawerTitle"-->
<!--        placement="right"-->
<!--        width="500px"-->
<!--        @close="closeDrawer"-->
<!--    >-->
<!--      <div class="drawer-content">-->
<!--        <a-tabs v-model:activeKey="activeTabKey">-->
<!--          <a-tab-pane key="1" tab="子菜单">-->
<!--            <MenuSonDrawer ref="menuSonDrawerRef" :parent-menu="selectedParentMenu"/>-->
<!--          </a-tab-pane>-->
<!--        </a-tabs>-->
<!--      </div>-->
<!--      <div class="drawer-footer">-->
<!--        <a-button style="margin-right: 8px" @click="closeDrawer">取消</a-button>-->
<!--        <a-button type="primary" @click="handleSubmit" style="margin-right: 20px">确认</a-button>-->
<!--      </div>-->
<!--    </a-drawer>-->

<!--    <MenuDrawer-->
<!--      v-if="drawerVisible"-->
<!--      ref="menuDrawerRef"-->
<!--      @submit="handleSubmit"-->
<!--      @close="closeDrawer"-->
<!--    />-->
<!--    <MenuSonDrawer-->
<!--      v-if="drawerSonVisible"-->
<!--      ref="menuSonDrawerRef"-->
<!--      :parent-menu="selectedParentMenu"-->
<!--      @submit="handleSubmit"-->
<!--      @close="closeDrawer"-->
<!--    />-->
  </div>

  </div>
</template>

<script setup lang="ts">
import { ref, computed, reactive, onMounted, h } from 'vue'
import { message } from 'ant-design-vue'
import MenuDrawer from "./MenuDrawer.vue";
import MenuSonDrawer from "./MenuSonDrawer.vue";
import request from "@/utils/request.ts";

// 定义菜单项接口
interface MenuItem {
  id: number
  menuName: string
  menuType: string
  icon: string
  component: string
  path: string
  sort: number
  status: boolean
  children?: MenuItem[]
}

// 表格列定义
const columns = [
  {
    title: '菜单名称',
    dataIndex: 'menuName',
    key: 'menuName',
    width: '220px'
  },
  {
    title: '菜单类型',
    dataIndex: 'menuType',
    key: 'menuType',
    width: '120px',
    customRender: ({ text }: { text: string }) => {
      return text === '1' ? '一级菜单' : '子菜单'
    }
  },
  {
    title: '图标',
    dataIndex: 'icon',
    key: 'icon',
    width: '80px',
    customRender: ({ text }: { text: string }) => {
      if (!text) return '-'
      const IconComponent = text
      return h(IconComponent)
    }
  },
  // {
  //   title: '组件',
  //   dataIndex: 'component',
  //   key: 'component',
  //   ellipsis: true
  // },
  {
    title: '路由路径',
    dataIndex: 'url',
    key: 'url',
    ellipsis: true
  },
  {
    title: '排序',
    dataIndex: 'sort',
    key: 'sort',
    width: '80px'
  },
  // {
  //   title: '操作',
  //   key: 'action',
  //   width: 200,
  //   customRender: ({ record }: { record: MenuItem }) => {
  //     return h('span', [
  //       h('a-button', {
  //         type: 'link',
  //         onClick: () => handleAddSub(record)
  //       }, '添加下级'),
  //       h('a-button', {
  //         type: 'link',
  //         onClick: () => handleEdit(record)
  //       }, '编辑'),
  //       h('a-button', {
  //         type: 'link',
  //         danger: true,
  //         onClick: () => handleDelete(record)
  //       }, '删除')
  //     ])
  //   }
  // }
]

// 表格数据
const tableData = ref<MenuItem[]>([])
const loading = ref(false)

// 获取菜单数据
const fetchMenuData = async () => {
  loading.value = true
  try {
    const { data } = await request.get('/api/menu/tree')
    if (data.success) {
      // 处理返回的数据，确保每个节点都有唯一的 key
      const processData = (items: MenuItem[]): MenuItem[] => {
        return items.map(item => ({
          ...item,
          key: item.id,
          children: item.children ? processData(item.children) : undefined
        }))
      }
      tableData.value = processData(data.result)
    } else {
      message.error(data.message || '获取菜单数据失败')
    }
  } catch (error) {
    console.error('获取菜单数据错误:', error)
    message.error('获取菜单数据失败')
  } finally {
    loading.value = false
  }
}

// 组件挂载时获取数据
onMounted(() => {
  fetchMenuData()
})

// 状态管理
const menuName = ref('')
const selectedKeys = ref([])
const drawerVisible = ref(false)
const drawerSonVisible = ref(false)
const activeTabKey = ref('1')
const selectedParentMenu = ref<MenuItem | null>(null)
const menuDrawerRef = ref<InstanceType<typeof MenuDrawer> | null>(null)
const menuSonDrawerRef = ref<InstanceType<typeof MenuSonDrawer> | null>(null)
const isEdit = ref(false)

// 计算属性
const drawerTitle = computed(() => {
  return isEdit.value ? '编辑菜单' : '新增菜单'
})

// 搜索功能
const onSearch = async (value) => {
  const {data} = await request.get('/api/menu/getMenuList', {
    params: {
      menuName: value
    }
  })
  if (data.success) {
    tableData.value = data.result
  }
}

// 选择行变化
const onSelectChange = (keys) => {
  selectedKeys.value = keys
}

// 展开/折叠功能
const expandAll = () => {
  // 实现展开全部逻辑
}

const collapseAll = () => {
  // 实现折叠全部逻辑
}

// 新增顶级菜单
const handleAddTop = () => {
  isEdit.value = false
  selectedParentMenu.value = null
  activeTabKey.value = '1'
  drawerVisible.value = true
}

// 添加下级菜单
const handleAddSub = (record: MenuItem) => {
  isEdit.value = false
  selectedParentMenu.value = record
  activeTabKey.value = '2'
  drawerVisible.value = true
}

// 编辑菜单
const handleEdit = (record: MenuItem) => {
  isEdit.value = true
  selectedParentMenu.value = record
  activeTabKey.value = record.menuType === '1' ? '1' : '2'
  drawerVisible.value = true
}

// 关闭抽屉
const closeDrawer = () => {
  drawerVisible.value = false
  drawerSonVisible.value = false
  selectedParentMenu.value = null
  if (menuDrawerRef.value) {
    menuDrawerRef.value.resetFields()
  }
  if (menuSonDrawerRef.value) {
    menuSonDrawerRef.value.resetFields()
  }
}

// 提交表单
const handleSubmit = async (formData: Record<string, any>) => {
  try {
    const data = {
      ...formData,
      parentId: selectedParentMenu.value?.id || formData.parentId
    }
    const response = await request.post('/menu', data)
    if (response.data.success) {
      message.success('添加成功')
      closeDrawer()
      fetchMenuData()
    } else {
      message.error(response.data.message || '添加失败')
    }
  } catch (error) {
    message.error('添加失败')
  }
}

// 搜索表单数据
const searchForm = reactive({
  keyword: '',
})

// 搜索方法
const handleSearch = () => {
  console.log('搜索条件：', searchForm)
}

// 重置搜索
const handleReset = () => {
  searchForm.keyword = ''
}

// 新增方法
const handleAdd = () => {
  console.log('点击新增')
}

// 删除方法
const handleDelete = async (record: MenuItem) => {
  try {
    const response = await request.delete(`/menu/${record.id}`)
    if (response.data.success) {
      message.success('删除成功')
      fetchMenuData()
    } else {
      message.error(response.data.message || '删除失败')
    }
  } catch (error) {
    message.error('删除失败')
  }
}
</script>

<style scoped>
.all-content{
  width: 100%;
  //background-color: #C81623;
  overflow:auto;
  height: 100%;
  //border: 3px solid #C81623;
  margin-top: 20px;
}

.menu-table {
  padding: 20px;
  background: #fff;
}

.table-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.header-buttons {
  display: flex;
  gap: 8px;
}

.indent-item {
  padding-left: 24px;
}

.drawer-content {
  padding: 20px;
  height: calc(100% - 55px);
}

.drawer-footer {
  position: absolute;
  bottom: 0;
  width: 100%;
  border-top: 1px solid #e8e8e8;
  padding: 10px 16px;
  text-align: right;
  left: 0;
  background: #fff;
}

:deep(.ant-table-row-level-1) .indent-item {
  color: #666;
}
</style>