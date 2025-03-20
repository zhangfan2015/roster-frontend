<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { message } from 'ant-design-vue';
import { PlusOutlined, MinusOutlined } from '@ant-design/icons-vue';
import request from '@/utils/request';

interface TreeNode {
  id: string;
  title: string;
  key: string;
  children?: TreeNode[];
  parentId?: string;
}

const treeData = ref<TreeNode[]>([]);
const expandedKeys = ref<string[]>([]);

// 获取树形数据
const fetchTreeData = async () => {
  try {
    const { data } = await request.get('/api/depart/getTree');
    console.log('API返回数据:', data);

    if (data.code === 200 && Array.isArray(data.result)) {
      // 直接使用返回的数据
      treeData.value = data.result;
      console.log('树形数据:', treeData.value);

      // 默认展开第一级
      if (data.result.length > 0) {
        expandedKeys.value = [data.result[0].key];
      }
    } else {
      message.error(data.message || '获取部门数据失败');
    }
  } catch (error) {
    console.error('获取部门树数据出错:', error);
    message.error('获取部门数据失败');
  }
};

// 添加子部门
const handleAdd = async (node: TreeNode) => {
  try {
    const { data } = await request.post('/api/depart/add', {
      parentId: node.id,
      departName: '新部门'  // 这里可以改为弹窗输入
    });

    if (data.code === 200) {
      message.success('添加成功');
      fetchTreeData();
    } else {
      message.error(data.message || '添加失败');
    }
  } catch (error) {
    message.error('添加失败');
  }
};

// 删除部门
const handleDelete = async (node: TreeNode) => {
  try {
    const { data } = await request.delete('/api/depart/delete', {
      params: { id: node.id }
    });

    if (data.code === 200) {
      message.success('删除成功');
      fetchTreeData();
    } else {
      message.error(data.message || '删除失败');
    }
  } catch (error) {
    message.error('删除失败');
  }
};

onMounted(() => {
  fetchTreeData();
});
</script>

<template>
  <div class="depart-tree">
    <a-tree
        v-if="treeData.length > 0"
        :tree-data="treeData"
        :expanded-keys="expandedKeys"
        :show-line="true"
        :selectable="false"
    >
      <template #title="{ dataRef }">
        <div class="node-content">
          <span class="node-title">{{ dataRef.title }}</span>
          <span class="node-actions">
            <a-button
                type="link"
                size="small"
                @click.stop="handleAdd(dataRef)"
            >
              <plus-outlined />
            </a-button>
            <a-popconfirm
                title="确定要删除该部门吗？"
                @confirm="handleDelete(dataRef)"
                @click.stop
            >
              <a-button
                  type="link"
                  size="small"
                  danger
              >
                <minus-outlined />
              </a-button>
            </a-popconfirm>
          </span>
        </div>
      </template>
    </a-tree>
    <div v-else class="empty-tree">
      暂无部门数据
    </div>
  </div>
</template>

<style scoped>
.depart-tree {
  padding: 16px;
}

.empty-tree {
  text-align: center;
  color: #999;
  padding: 24px;
}

.node-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-right: 8px;
  width: 100%;
}

.node-title {
  margin-right: 8px;
}

.node-actions {
  display: none;
}

.node-content:hover .node-actions {
  display: inline-flex;
  align-items: center;
}

:deep(.ant-tree-node-content-wrapper) {
  display: flex !important;
  flex: 1;
}

:deep(.ant-tree-switcher) {
  align-self: center;
}

:deep(.ant-tree-node-content-wrapper:hover) {
  background: transparent;
}

:deep(.ant-btn-link) {
  padding: 0 4px;
  height: 20px;
  line-height: 20px;
}
</style>