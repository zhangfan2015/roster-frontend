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
        label="角色名称"
        name="roleName"
        :rules="[{ required: true, message: '请输入角色名称!' }]"
      >
        <a-input v-model:value="formState.roleName" />
      </a-form-item>

      <a-form-item
        label="角色编码"
        name="roleCode"
        :rules="[{ required: true, message: '请输入角色编码!' }]"
      >
        <a-input v-model:value="formState.roleCode" />
      </a-form-item>

      <a-form-item
          label="备注"
          name="remark"
      >
        <a-textarea v-model:value="formState.remark" :rows="4" placeholder="请输入备注"/>
      </a-form-item>

    </a-form>
  </a-modal>
</template>

<script setup lang="ts">
import { reactive, ref, defineProps, defineEmits } from 'vue'
import { message } from 'ant-design-vue'
import type { FormInstance } from 'ant-design-vue'
import request from '@/utils/request'


const emit = defineEmits(['update:visible', 'success'])

const formRef = ref<FormInstance>()
const confirmLoading = ref<boolean>(false)

interface FormState {
  roleName: string
  roleCode: string
  remark: string
}

const formState = reactive<FormState>({
  roleName: '',
  roleCode: '',
  remark: '',
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
    const { data } = await request.post('/api/role/addRole', values)
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