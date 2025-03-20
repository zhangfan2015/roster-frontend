<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { message, Upload, Modal } from 'ant-design-vue';
import type { UploadChangeParam } from 'ant-design-vue';
import request from '@/utils/request';

interface FileItem {
  id: string;
  name: string;
  createTime: string;
  type?: string;
  url?: string;
}

const fileList = ref<FileItem[]>([]);
const loading = ref<boolean>(false);
const previewVisible = ref<boolean>(false);
const previewUrl = ref<string>('');
const previewTitle = ref<string>('');

// 获取文件列表
const fetchFileList = async () => {
  loading.value = true;
  try {
    const { data } = await request.get('/api/file/list');
    if (data.code === 200) {
      fileList.value = data.result;
    }
  } catch (error) {
    message.error('获取文件列表失败');
  } finally {
    loading.value = false;
  }
};

// 下载文件
const downloadFile = async (file: FileItem) => {
  try {
    const response = await request.get(`/api/file/download/${file.id}`, {
      responseType: 'blob'
    });
    const blob = new Blob([response.data]);
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = file.name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
    message.success('下载成功');
  } catch (error) {
    message.error('下载失败');
  }
};

// 处理文件上传
const handleUploadChange = (info: UploadChangeParam) => {
  if (info.file.status === 'done') {
    message.success(`${info.file.name} 上传成功`);
    fetchFileList();
  } else if (info.file.status === 'error') {
    message.error(`${info.file.name} 上传失败`);
  }
};

// 预览文件
const previewFile = async (file: FileItem) => {
  try {
    const { data } = await request.get(`/api/file/preview/${file.id}`);
    if (data.code === 200) {
      previewUrl.value = data.result.url;
      previewTitle.value = file.name;
      previewVisible.value = true;
    }
  } catch (error) {
    message.error('获取预览失败');
  }
};

// 关闭预览
const handlePreviewClose = () => {
  previewVisible.value = false;
  previewUrl.value = '';
};

onMounted(() => {
  fetchFileList();
});
</script>

<template>
  <div class="file-popover">
    <div class="file-header">
      <div class="header-content">
        <h3>说明文档</h3>
        <Upload
            name="file"
            :action="'http://localhost:8080/api/file/upload'"
            :headers="{
                Authorization: localStorage ? localStorage.getItem('token') || '' : ''
            }"
            :show-upload-list="false"
            :accept="'application/pdf, application/msword, application/vnd.openxmlformats-officedocument.wordprocessingml.document, application/vnd.ms-excel, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'"
            @change="handleUploadChange"
        >
          <a-button type="primary" size="small">上传文件</a-button>
        </Upload>
      </div>
    </div>

    <a-spin :spinning="loading">
      <div class="file-list">
        <template v-if="fileList.length">
          <div v-for="item in fileList"
               :key="item.id"
               class="file-item">
            <div class="file-title">
              <span class="file-name">{{ item.name }}</span>
              <span class="file-time">{{ item.createTime ? item.createTime.replace('T', ' ').substring(0, 19) : '' }}</span>
            </div>
            <div class="file-actions">
              <a @click="previewFile(item)">预览</a>
              <a @click="downloadFile(item)">下载</a>
            </div>
          </div>
        </template>
        <div v-else class="empty-text">暂无文件</div>
      </div>
    </a-spin>

    <!-- 预览弹窗 -->
    <a-modal
        v-model:visible="previewVisible"
        :title="previewTitle"
        :footer="null"
        width="80%"
        style="top: 20px"
        @cancel="handlePreviewClose"
    >
      <iframe
          v-if="previewUrl"
          :src="previewUrl"
          style="width: 100%; height: 80vh; border: none;"
      ></iframe>
    </a-modal>
  </div>
</template>

<style scoped>
.file-popover {
  width: 300px;
  max-height: 400px;
  display: flex;
  flex-direction: column;
  background: #fff;
}

.file-header {
  padding: 12px;
  border-bottom: 1px solid #f0f0f0;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.file-list {
  flex: 1;
  overflow-y: auto;
  padding: 8px 12px;
  min-height: 200px;
  max-height: 300px;
}

.file-item {
  padding: 8px 0;
  border-bottom: 1px solid #f0f0f0;
  transition: background-color 0.3s;
}

.file-item:hover {
  background-color: #f5f5f5;
}

.file-title {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.file-name {
  color: #333;
  font-size: 14px;
}

.file-time {
  font-size: 12px;
  color: #999;
}

.file-actions {
  margin-top: 8px;
  display: flex;
  gap: 16px;
}

.file-actions a {
  color: #1890ff;
  cursor: pointer;
}

.file-actions a:hover {
  color: #40a9ff;
}

.empty-text {
  text-align: center;
  color: #999;
  padding: 30px 0;
}

h3 {
  margin: 0;
  font-size: 16px;
  color: #333;
}
</style>