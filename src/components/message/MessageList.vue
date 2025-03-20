<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { message ,Modal} from 'ant-design-vue';
import request from '@/utils/request';


interface MessageItem {
  id: string;
  title: string;
  content: string;
  createTime: string;
  isRead: boolean;
}

const columns = [
  {
    title: '标题',
    dataIndex: 'title',
    key: 'title',
    width: '20%',
  },
  {
    title: '内容',
    dataIndex: 'content',
    key: 'content',
    width: '40%',
  },
  {
    title: '消息类型',
    dataIndex: 'messageType',
    key: 'messageType',
    width: '10%',
  },
  {
    title: '发送时间',
    dataIndex: 'createTime',
    key: 'createTime',
    width: '15%',
    customRender: ({ text }) => text ? text.replace('T', ' ').substring(0, 19) : ''
  },
  {
    title: '状态',
    dataIndex: 'status',
    key: 'status',
    width: '5%',
  },
  {
    title: '操作',
    key: 'action',
    width: 100,
    fixed: 'right' as const,
  },
];

const messageList = ref<MessageItem[]>([]);
const loading = ref<boolean>(false);
const pagination = ref({
  current: 1,
  pageSize: 10,
  total: 0,
});

// 获取消息列表
const fetchMessageList = async () => {
  loading.value = true;
  try {
    const { data } = await request.get('/api/message/getMessages', {
      params: {
        pageNo: pagination.value.current,
        pageSize: pagination.value.pageSize,
      },
    });
    if (data.code === 200) {
      messageList.value = data.result.records;
      pagination.value.total = data.result.total;
    }
  } catch (error) {
    message.error('获取消息列表失败');
  } finally {
    loading.value = false;
  }
};

const isModalVisible = ref<boolean>(false);
const iframeUrl = ref<string>('');

// 修改getDetail方法
const getDetail = async (record: MessageItem) => {
  try {
    const { data } = await request.get('/api/message/getMessageDetail', {
      params: {
        id: record.id,
      },
    });
    if (data.code === 200) {
      if (data.result.url) {
        iframeUrl.value = data.result.url;
        isModalVisible.value = true;
      } else {
        message.info('该消息没有关联的页面');
      }
    }
  } catch (error) {
    message.error('获取详情失败');
  }
};

// 添加Modal关闭处理方法
const handleModalClose = () => {
  isModalVisible.value = false;
  iframeUrl.value = '';
};

// 处理表格变化
const handleTableChange = (pag: any) => {
  pagination.value.current = pag.current;
  pagination.value.pageSize = pag.pageSize;
  fetchMessageList();
};

// 全部已读
const markAllAsRead = async () => {
  try {
    const { data } = await request.post('/api/message/readAll');
    if (data.code === 200) {
      message.success('标记成功');
      fetchMessageList();
    }
  } catch (error) {
    message.error('操作失败');
  }
};

onMounted(() => {
  fetchMessageList();
});
</script>

<template>
  <div class="message-list-page">
    <div class="page-header">
      <h2>消息列表</h2>
      <a-button type="primary" @click="markAllAsRead">全部已读</a-button>
    </div>

    <a-table
        :columns="columns"
        :data-source="messageList"
        :loading="loading"
        :pagination="pagination"
        @change="handleTableChange"
        row-key="id"
    >
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'title'">
          <span :class="{ 'unread': !record.isRead }">{{ record.title }}</span>
        </template>

        <template v-else-if="column.key === 'action'">
          <a-button type="link" @click="getDetail(record)">查看详情</a-button>
        </template>
      </template>
    </a-table>

    <a-modal
        v-model:visible="isModalVisible"
        title="详情页面"
        :footer="null"
        width="80%"
        style="top: 20px"
        @cancel="handleModalClose"
    >
      <iframe
          v-if="iframeUrl"
          :src="iframeUrl"
          style="width: 100%; height: 80vh; border: none;"
      ></iframe>
    </a-modal>
  </div>
</template>

<style scoped>
.message-list-page {
  padding: 24px;
  background: #fff;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.unread {
  position: relative;
  padding-left: 12px;
}

.unread::before {
  content: '';
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  width: 6px;
  height: 6px;
  border-radius: 50%;
  //background-color: #ff4d4f;
}
</style>