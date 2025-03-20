<template>
  <div class="custom-select" v-click-outside="closeDropdown">
    <div class="select-input" @click="toggleDropdown">
      <div class="selected-text" :class="{ 'placeholder': selectedItems.length === 0 }">
        <template v-if="selectedItems.length === 0">
          Select
        </template>
        <template v-else-if="selectedItems.length <= 3">
          <span class="selected-item" v-for="value in selectedItems" :key="value">
            {{ getOptionLabel(value) }}
          </span>
        </template>
        <template v-else>
          已选择 {{ selectedItems.length }} 项
        </template>
      </div>
<!--      <div class="arrow" :class="{ 'arrow-rotate': isOpen }">▼</div>-->
    </div>

    <div class="dropdown-menu" v-show="isOpen">
      <!-- 搜索框 -->
      <div class="search-box">
        <input
            type="text"
            v-model="searchText"
            placeholder="Search"
            @click.stop
        >
      </div>

      <!-- 全选选项 -->
      <div class="select-item1">
        <label class="checkbox-container">
          <input
              type="checkbox"
              :checked="isAllSelected"
              @change="toggleSelectAll"
          >
          <span class="checkmark"></span>
          <span class="item-text">Select all</span>
        </label>
      </div>

      <!-- 选项列表 -->
      <div class="options-container">
        <div
            v-for="option in filteredOptions"
            :key="option.value"
            class="select-item"
        >
          <label class="checkbox-container">
            <input
                type="checkbox"
                :checked="selectedItems.includes(option.value)"
                @change="toggleOption(option)"
            >
            <span class="checkmark"></span>
            <span class="item-text">{{ option.label }}</span>
          </label>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

// 自定义指令：点击外部关闭下拉框
const vClickOutside = {
  mounted(el, binding) {
    el._clickOutside = (event) => {
      if (!(el === event.target || el.contains(event.target))) {
        binding.value(event)
      }
    }
    document.addEventListener('click', el._clickOutside)
  },
  unmounted(el) {
    document.removeEventListener('click', el._clickOutside)
  }
}

const props = defineProps({
  options: {
    type: Array,
    default: () => [
      { label: 'AUDI - LE', value: 'audi' },
      { label: 'BAIC - LE', value: 'baic' },
      { label: 'BMW - LE', value: 'bmw' },
      { label: 'BENZ - LE', value: 'benz' },
      { label: 'HONDA - LE', value: 'honda' }
    ]
  }
})

const emit = defineEmits(['update:modelValue', 'change'])

const isOpen = ref(false)
const searchText = ref('')
const selectedItems = ref([])

// 获取选项的标签文本
const getOptionLabel = (value) => {
  const option = props.options.find(opt => opt.value === value)
  return option ? option.label : ''
}

// 过滤后的选项
const filteredOptions = computed(() => {
  return props.options.filter(option =>
      option.label.toLowerCase().includes(searchText.value.toLowerCase())
  )
})

// 是否全选
const isAllSelected = computed(() => {
  return props.options.length === selectedItems.value.length
})

// 切换下拉框显示状态
const toggleDropdown = () => {
  isOpen.value = !isOpen.value
}

// 关闭下拉框
const closeDropdown = () => {
  isOpen.value = false
}

// 切换全选状态
const toggleSelectAll = () => {
  if (isAllSelected.value) {
    selectedItems.value = []
  } else {
    selectedItems.value = props.options.map(option => option.value)
  }
  emit('change', selectedItems.value)
}

// 切换单个选项
const toggleOption = (option) => {
  const index = selectedItems.value.indexOf(option.value)
  if (index === -1) {
    selectedItems.value.push(option.value)
  } else {
    selectedItems.value.splice(index, 1)
  }
  emit('change', selectedItems.value)
}
</script>

<style scoped>
.custom-select {
  position: relative;
  width: 100%;
  font-family: Arial, sans-serif;
  user-select: none;
  margin-bottom: 10px;
}

.select-input {
  height: 36px;
  padding: 4px 30px 4px 12px;
  border-radius: 4px;
  background-color:rgba(255,255,255,0.15);
  display: flex;
  align-items: center;
  justify-content: flex-start;
  cursor: pointer;
  flex-wrap: nowrap;
  overflow-x: auto;
}

.selected-text {
  flex: 1;
  display: flex;
  flex-wrap: nowrap;
  gap: 4px;
  color: #fff;
  flex-direction: row;
  //overflow-x: auto;
  overflow: hidden;
  align-items: center;
}

.selected-text.placeholder {
  color: #ffffff;
  font-size: 16px;
}

.selected-item {
  border-radius: 4px;
  padding: 2px 8px;
  font-size: 14px;
  color: #fff;
  white-space: nowrap;
}

.arrow {
  position: absolute;
  right: 12px;
  font-size: 16px;
  color: #c0c4cc;
  transition: transform 0.3s;
}

.arrow-rotate {
  transform: rotate(180deg);
}

.dropdown-menu {
  position: absolute;
  top: calc(100% + 5px);
  left: 0;
  width: 100%;
  background-color:rgba(22,29,42,0.95);
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  box-shadow: 0 2px 12px 0 rgba(0,0,0,0.1);
  z-index: 1000;
}

.search-box {
  background-color: #ffffff;
  padding: 8px;
  border-bottom: 1px solid #ebeef5;
}

.search-box input {
  width: 90%;
  height: 32px;
  padding: 0 8px;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  outline: none;
}

.search-box input:focus {
  border-color: #409eff;
}

.options-container {
  max-height: 100px;
  overflow-y: auto;
}

.select-item {
  padding: 8px 12px;
  cursor: pointer;

}

.select-item:hover {
  background-color: #29384f;
}

.select-item1{
  padding: 8px 12px;
  cursor: pointer;
  border-bottom: 1px solid #fff;
}

.select-item1:hover {
  background-color: #29384f;
}

.checkbox-container {
  display: flex;
  align-items: center;
  position: relative;
  padding-left: 25px;
  cursor: pointer;
}

.checkbox-container input {
  position: absolute;
  opacity: 0;
  cursor: pointer;
  height: 0;
  width: 0;
}

.checkmark {
  position: absolute;
  left: 0;
  height: 16px;
  width: 16px;
  border: 1px solid #dcdfe6;
  border-radius: 2px;
  background-color: #fff;
}

.checkbox-container:hover input ~ .checkmark {
  border-color: #409eff;
}

.checkbox-container input:checked ~ .checkmark {
  background-color: #409eff;
  border-color: #409eff;
}

.checkmark:after {
  content: "";
  position: absolute;
  display: none;
}

.checkbox-container input:checked ~ .checkmark:after {
  display: block;
  left: 5px;
  top: 2px;
  width: 4px;
  height: 8px;
  border: solid white;
  border-width: 0 2px 2px 0;
  transform: rotate(45deg);
}

.item-text {
  margin-left: 8px;
  color: #fff;
}
</style>