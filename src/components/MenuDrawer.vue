<template>
  <a-form
      ref="formRef"
      :model="formState"
      :rules="rules"
      layout="vertical"
  >
    <a-form-item label="菜单名称" name="menuName">
      <a-input v-model:value="formState.menuName" placeholder="请输入菜单名称" />
    </a-form-item>

    <a-form-item label="上级菜单" name="parentId">
      <a-input 
        v-model:value="formState.parentId" 
        placeholder="上级菜单" 
        :disabled="formState.menuType === '1'"
      />
    </a-form-item>

    <a-form-item label="菜单类型" name="menuType">
      <a-select v-model:value="formState.menuType" placeholder="请选择菜单类型">
        <a-select-option v-for="option in menuTypeOptions" :key="option.value" :value="option.value">
          {{ option.label }}
        </a-select-option>
      </a-select>
    </a-form-item>

    <a-form-item label="图标" name="icon">
      <a-select v-model:value="formState.icon" placeholder="请选择图标">
        <a-select-option v-for="option in iconOptions" :key="option.value" :value="option.value">
          {{ option.label }}
        </a-select-option>
      </a-select>
    </a-form-item>

    <a-form-item label="组件路径" name="component">
      <a-input v-model:value="formState.component" placeholder="请输入组件路径" />
    </a-form-item>

    <a-form-item label="路由路径" name="path">
      <a-input v-model:value="formState.path" placeholder="请输入路由路径" />
    </a-form-item>

    <a-form-item label="排序" name="sort">
      <a-input-number v-model:value="formState.sort" :min="1" :max="999" />
    </a-form-item>

    <a-form-item label="状态" name="status">
      <a-switch v-model:checked="formState.status" />
    </a-form-item>
  </a-form>
</template>

<script setup lang="ts">
import { ref, defineProps, reactive, watch } from 'vue'
import { Form, Input, Select, InputNumber, Switch } from 'ant-design-vue'
import type { FormInstance } from 'ant-design-vue'

const props = defineProps({
  parentMenu: {
    type: Object,
    default: null
  }
})

const formRef = ref<FormInstance | null>(null)

// 表单数据
const formState = reactive({
  menuName: '',
  menuType: '1', // 默认为一级菜单
  icon: '',
  component: '',
  path: '',
  sort: 1,
  parentId: props.parentMenu?.id || 0,
  status: true
})

// 菜单类型选项
const menuTypeOptions = [
  { label: '一级菜单', value: '1' },
  { label: '子菜单', value: '2' }
]

// 图标选项
const iconOptions = [
  { label: '首页', value: 'HomeOutlined' },
  { label: '设置', value: 'SettingOutlined' },
  { label: '用户', value: 'UserOutlined' }
]

// 表单规则
const rules = {
  menuName: [{ required: true, message: '请输入菜单名称' }],
  menuType: [{ required: true, message: '请选择菜单类型' }],
  path: [{ required: true, message: '请输入路由路径' }]
}

// 监听父菜单变化
watch(() => props.parentMenu, (newVal) => {
  if (newVal) {
    formState.parentId = newVal.id
  }
}, { immediate: true })

// 监听菜单类型变化
watch(() => formState.menuType, (newVal) => {
  if (newVal === '1') {
    formState.parentId = 0
  }
})

// 提供给父组件调用的提交方法
const submitForm = async () => {
  try {
    if (!formRef.value) {
      return null
    }
    await formRef.value.validate()
    return { ...formState }
  } catch (error) {
    return null
  }
}

// 重置表单
const resetFields = () => {
  if (formRef.value) {
    formRef.value.resetFields()
    // 重置为默认值
    formState.menuType = '1'
    formState.parentId = props.parentMenu?.id || 0
    formState.status = true
  }
}

// 暴露方法给父组件
defineExpose({
  submitForm,
  resetFields
})
</script>

<style scoped>
.ant-form {
  padding: 24px;
}
</style>