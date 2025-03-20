<script setup lang="ts">
import { ref, reactive, defineProps, defineEmits } from 'vue'
import { message } from 'ant-design-vue'
import request from '@/utils/request.ts'

const props = defineProps({
  visible: {
    type: Boolean,
    default: false
  },
  username: {
    type: String,
    default: ''
  }
})

const emit = defineEmits(['update:visible', 'success'])

const formRef = ref()
const form = reactive({
  username: props.username,
  password: '',
  confirmPassword: '',
})

const rules = {
  password: [
    { required: true, message: '请输入新密码', trigger: 'blur' },
    { min: 3, message: '密码长度不能小于3位', trigger: 'blur' }
  ],
  confirmPassword: [
    { required: true, message: '请确认新密码', trigger: 'blur' },
    {
      validator: async (rule: any, value: string) => {
        if (value !== form.password) {
          throw new Error('两次输入的密码不一致')
        }
      },
      trigger: 'blur'
    }
  ]
}

const handleSubmit = async () => {
  try {
    await formRef.value.validate()
    const { data } = await request.put('/api/user/editPs', {
      username: props.username,
      password: form.password
    })
    if (data.code === 200) {
      message.success('密码修改成功')
      emit('success')
      emit('update:visible', false)
      resetForm()
    } else {
      message.error(data.message || '修改失败')
    }
  } catch (error) {
    console.error('表单验证失败', error)
  }
}

const resetForm = () => {
  form.password = ''
  form.confirmPassword = ''
  formRef.value?.resetFields()
}

const handleCancel = () => {
  emit('update:visible', false)
  resetForm()
}
</script>

<template>
  <a-modal
      :visible="visible"
      title="修改密码"
      @ok="handleSubmit"
      @cancel="handleCancel"
  >
    <a-form
        ref="formRef"
        :model="form"
        :rules="rules"
        :label-col="{ span: 6 }"
        :wrapper-col="{ span: 16 }"
    >
      <a-form-item label="用户账号">
        <a-input :value="username" disabled />
      </a-form-item>
      <a-form-item label="新密码" name="password">
        <a-input-password v-model:value="form.password" placeholder="请输入新密码" />
      </a-form-item>
      <a-form-item label="确认密码" name="confirmPassword">
        <a-input-password v-model:value="form.confirmPassword" placeholder="请再次输入新密码" />
      </a-form-item>
    </a-form>
  </a-modal>
</template>