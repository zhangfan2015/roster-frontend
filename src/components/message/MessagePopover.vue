<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { message } from 'ant-design-vue';
import request from '@/utils/request.ts';

interface MessageItem {
  id: string;
  title: string;
  content: string;
  createTime: string;
  messageType: string;
  status: string; // 0: 未读, 1: 已读
}

const router = useRouter();
const activeTab = ref<string>('all');
const messageList = ref<MessageItem[]>([]);
const loading = ref<boolean>(false);

// 获取消息列表
const fetchMessageList = async () => {
  loading.value = true;
  try {
    const { data } = await request.get('/api/message/getMessageList', {
      params: {
        type: activeTab.value
      }
    });
    if (data.code === 200) {
      messageList.value = data.result;
    }
  } catch (error) {
    message.error('获取消息列表失败');
  } finally {
    loading.value = false;
  }
};

// 切换标签
const handleTabChange = (tab: string) => {
  activeTab.value = tab;
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

// 标记单条消息为已读
// const markAsRead = async (id: string) => {
//   try {
//     const { data } = await request.post('/api/message/read', { id });
//     if (data.code === 200) {
//       // 更新本地消息状态
//       const index = messageList.value.findIndex(item => item.id === id);
//       if (index !== -1) {
//         messageList.value[index].status = '已读';
//       }
//     }
//   } catch (error) {
//     message.error('操作失败');
//   }
// };

// 查看全部
const viewAll = () => {
  router.push('/home/message');
};

onMounted(() => {
  fetchMessageList();
});
</script>

<template>
  <div class="message-popover">
    <div class="message-header">
      <div class="tabs">
        <a-radio-group v-model:value="activeTab" button-style="solid" @change="(e) => handleTabChange(e.target?.value || 'all')">
        <a-radio-button value="all">全部</a-radio-button>
          <a-radio-button value="unread">未读</a-radio-button>
        </a-radio-group>
        <a-button type="link" @click="markAllAsRead">全部已读</a-button>
      </div>
    </div>

    <a-spin :spinning="loading">
      <div class="message-list">
        <template v-if="messageList.length">
          <div v-for="item in messageList"
               :key="item.id"
               class="message-item"
              >
            <!-- 切换单挑消息为已读 @click="markAsRead(item.id)"-->
            <div class="message-title">
              <span :class="{ 'unread': item.status === '未读' }">{{ item.title }}</span>
              <span class="message-time">{{ item.createTime ? item.createTime.replace('T', ' ').substring(0, 19) : '' }}</span>
            </div>
            <div class="message-content">{{ item.messageType }}</div>
          </div>
        </template>
        <div v-else class="empty-text">暂无消息</div>
      </div>
    </a-spin>

    <div class="message-footer">
      <a-button type="link" @click="viewAll">查看全部</a-button>
    </div>
  </div>
</template>

<style scoped>
.message-popover {
  width: 300px;
  max-height: 400px;
  display: flex;
  flex-direction: column;
}

.message-header {
  padding: 12px;
  border-bottom: 1px solid #f0f0f0;
}

.tabs {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.message-list {
  flex: 1;
  overflow-y: auto;
  padding: 8px 12px;
  min-height: 200px;
  max-height: 300px;
}

.message-item {
  padding: 8px 0;
  border-bottom: 1px solid #f0f0f0;
  cursor: pointer;
  transition: background-color 0.3s;
}

.message-item:hover {
  background-color: #f5f5f5;
}

.message-title {
  display: flex;
  justify-content: space-between;
  margin-bottom: 4px;
}

.unread::before {
  content: '';
  display: inline-block;
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background-color: #ff4d4f;
  margin-right: 6px;
  vertical-align: middle;
}

.message-time {
  font-size: 12px;
  color: #999;
}

.message-content {
  color: #666;
  font-size: 12px;
}

.message-footer {
  padding: 12px;
  text-align: center;
  border-top: 1px solid #f0f0f0;
}

.empty-text {
  text-align: center;
  color: #999;
  padding: 30px 0;
}
</style>