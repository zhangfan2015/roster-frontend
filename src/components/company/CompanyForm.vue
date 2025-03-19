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
        label="公司名称"
        name="companyName"
        :rules="[{ required: true, message: '请输入公司名称!' }]"
      >
        <a-input v-model:value="formState.companyName" />
      </a-form-item>

      <a-form-item
        label="公司类型"
        name="companyType"
        :rules="[{ required: true, message: '请选择公司类型!' }]"
      >
        <a-select v-model:value="formState.companyType">
          <a-select-option value="私有企业">私有企业</a-select-option>
          <a-select-option value="国有企业">国有企业</a-select-option>
        </a-select>
      </a-form-item>

      <a-form-item
        label="联系电话"
        name="tel"
      >
        <a-input v-model:value="formState.tel" />
      </a-form-item>

      <a-form-item
          label="经营地址"
          name="address"
          :rules="[{ required: true, message: '请输入经营地址!' }]"
      >
        <a-input v-model:value="formState.address" />
      </a-form-item>

      <a-form-item
        label="电子邮箱"
        name="email"
        :rules="[
          { required: true, message: '请输入电子邮箱!' },
          { type: 'email', message: '请输入有效的电子邮箱!' }
        ]"
      >
        <a-input v-model:value="formState.email" />
      </a-form-item>

      <a-form-item
          label="成立日期"
          name="clTime"
          :rules="[{ required: true, message: '请输入成立日期!' }]"
      >
        <a-date-picker v-model:value="formState.clTime" placeholder="请选择成立日期"/>
      </a-form-item>

      <a-form-item
          label="公司简介"
          name="content"
      >
        <a-textarea
            v-model:value="formState.content"
            :rows="4"
            placeholder="请输入公司简介"
        />
      </a-form-item>

      <a-form-item
          label="注册资本"
          name="registCapital"
      >
        <a-input v-model:value="formState.registCapital" />
      </a-form-item>

      <a-form-item
          label="法人"
          name="people"
      >
        <a-input v-model:value="formState.people" />
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
    default: '添加公司'
  }
})

const emit = defineEmits(['update:visible', 'success'])

const formRef = ref<FormInstance>()
const confirmLoading = ref<boolean>(false)

interface FormState {
  companyName: string
  companyType: string
  address: string
  tel: string
  email: string
  clTime: string
  content: string
  registCapital:string
  people: string
}

const formState = reactive<FormState>({
  companyName: '',
  companyType: '',
  address: '',
  tel: '',
  email: '',
  clTime: '',
  content: '',
  registCapital:'',
  people: ''
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
    const { data } = await request.post('/api/company/add', values)
    if (data.code === 200) {
      message.success('添加成功')
      emit('success')
      emit('update:visible', false)
      resetForm()
    } else {
      message.error(data.message || '添加失败')
    }
  } catch (error: any) {
    console.error('添加公司错误:', error)
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