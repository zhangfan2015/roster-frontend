<template>
  <a-modal
    :visible="visible"
    :title="title"
    @ok="handleOk"
    @cancel="handleCancel"
    :confirmLoading="confirmLoading"
    width="700px"
  >
    <a-form
      :model="formState"
      name="basic"
      :label-col="{ span: 6 }"
      :wrapper-col="{ span: 16 }"
      autocomplete="off"
      @finish="onFinish"
      @finishFailed="onFinishFailed"
      ref="formRef"
    >
      <a-form-item
        label="职位名称"
        name="positionName"
        :rules="[{ required: true, message: '请输入职位名称!' }]"
      >
        <a-input v-model:value="formState.positionName" />
      </a-form-item>

      <a-form-item
        label="部门"
        name="departName"
        :rules="[{ required: true, message: '请选择部门!' }]"
      >
        <a-select v-model:value="formState.departName">
          <a-select-option value="开发部">开发部</a-select-option>
          <a-select-option value="测试部">测试部</a-select-option>
        </a-select>
      </a-form-item>



    </a-form>
  </a-modal>
</template>

<script setup lang="ts">
import { reactive, ref, defineProps, defineEmits } from 'vue'
import { message } from 'ant-design-vue'
import type { FormInstance } from 'ant-design-vue'
import request from '@/utils/request'

const props = defineProps({
  visible: {
    type: Boolean,
    default: false
  },
  title: {
    type: String,
    default: '添加职位'
  }
})

const emit = defineEmits(['update:visible', 'success'])

const formRef = ref<FormInstance>()
const confirmLoading = ref<boolean>(false)

interface FormState {
  positionName: string
  departName: string
}

const formState = reactive<FormState>({
  positionName: '',
  departName: '',
})

const handleOk = () => {
  formRef.value?.validate()
      .then(() => {
        onFinish(formState)
      })
      .catch(err => {
        console.log('验证失败', err)
      })
}

const handleCancel = () => {
  emit('update:visible', false)
  resetForm()
}

const onFinish = async (values: FormState) => {
  try {
    confirmLoading.value = true
    const { data } = await request.post('/api/position/add', values)
    if (data.code === 200) {
      message.success('添加成功')
      emit('success')
      emit('update:visible', false)
      resetForm()
    } else {
      message.error(data.message || '添加失败')
    }
  } catch (error: any) {
    message.error(error.response?.data?.message || '添加失败，请稍后重试')
  } finally {
    confirmLoading.value = false
  }
}

const onFinishFailed = (errorInfo: any) => {
  console.log('Failed:', errorInfo)
  message.error('请检查表单填写是否正确')
}

const resetForm = () => {
  formRef.value?.resetFields()
}
</script>

<style scoped>
.ant-form {
  max-width: 600px;
  margin: 0 auto;
  padding: 24px;
}
</style>