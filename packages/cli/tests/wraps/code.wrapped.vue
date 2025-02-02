<script setup lang="ts">
import { ref, computed } from 'vue'
import { t } from '../src/languages'

interface Task {
  text: string
  completed: boolean
}

const newTask = ref('')
const tasks = ref<Task[]>([])

const addTask = () => {
  if (newTask.value.trim()) {
    tasks.value.push({
      text: t('新建任务'),
      completed: false
    })
    newTask.value = ''
  }
}

const editTask = (index: number) => {
  tasks.value[index].text = t('编辑任务')
}

const openTask = (index: number) => {
  tasks.value[index].text = t('打开任务')
}

const toggleTask = (index: number) => {
  tasks.value[index].completed = !tasks.value[index].completed
}

const removeTask = (index: number) => {
  tasks.value.splice(index, 1)
}
</script>

<template>
  <div class="todo-container">
    <h1>{{ t('任务列表') }}</h1>
    <div class="input-container">
      <input
        v-model="newTask"
        @keyup.enter="addTask"
        :placeholder="t('增加新任务...')"
      />
      <button @click="addTask">{{ t('增加') }}</button>
    </div>
    
    <ul v-if="tasks.length > 0">
      <li v-for="(task, index) in tasks" :key="index">
        <input
          type="checkbox"
          v-model="task.completed"
          @change="toggleTask(index)"
        />
        <span :class="{ completed: task.completed }">{{ task.text }}</span>
        <button @click="removeTask(index)" :placeholder="t('删除')">{{ t('删除') }}</button>
        <button @click="editTask(index)" :placeholder="t('编辑')">{{ t('编辑') }}</button>
        <button @click="openTask(index)" :placeholder="t('打开')">{{ t('打开') }}</button>
        <button @click="viewTask(index)" :placeholder="t('属性')">{{ t(task.id + '属性') }}</button>
      </li>
    </ul>
    <p v-else>{{ t('No tasks yet. Add one!') }}</p>
  </div>
</template>

<style scoped>
.todo-container {
  max-width: 500px;
  margin: 0 auto;
  padding: 20px;
}

.input-container {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
}

input {
  flex: 1;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

button {
  padding: 8px 16px;
  background-color: #42b983;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

button:hover {
  background-color: #3aa876;
}

ul {
  list-style: none;
  padding: 0;
}

li {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px;
  border-bottom: 1px solid #eee;
}

.completed {
  text-decoration: line-through;
  color: #888;
}
</style>
