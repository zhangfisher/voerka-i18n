import { extractMessages } from ".."; 
 
const code = `
<template>
  <div class="todo-container">
    <h1>Todo List</h1>
    <input v-model="newTodo" @keyup.enter="addTodo(t('T1'))" :placeholder="Add a new todo t('T2')" />
    <ul>
      <li v-for="(todo, index) in todos" title="任务" :key="index">
        <span :class="{ completed: todo.completed }">{{ todo.text }}</span>
        <button :title="t('T3')+t('T4')" @click="openTodo(index)">{{ t("T5") + t("T6") }}</button>
        <button title="t('Tx',1,2)" @click="addTodo(index)">{{ t("T7") }}</button>
        <button @click="removeTodo(index)">{{ t("T8") }}</button>
        <button @click="editTodo(index,t('T9'))">{{ t("T10",11,{}) }}</button>
        <Translate message="T11"/>
        <Translate vars="v1" message="T12" />
        <Translate vars="v2" :message="Tx" />
        <Translate vars={v3} message="T13" />
        <Translate vars="tv1" message="T14" options="sss">ddsd</Translate>
        <Translate vars="tv2" message="T15" options="sss">ddsd</Translate>
      </li>
    </ul>
    <div>t("Tx")</div>
    <!-- t("Tx") -->
  </div>
</template>
<script setup lang="ts">
import { ref } from 'vue'; 
const todos = ref([
    { 
        id: 1, 
        title: t("完成项目报告"), 
        description: t("整理本季度的项目进度,准备PPT,并在周五之前发送给项目经理审阅。") 
      },
      { 
        id: 2, 
        title: t("准备周会演示文稿"), 
        description: t("汇总团队本周工作内容,制作简报,重点突出项目里程碑的完成情况。") 
      },
      { 
        id: 3, 
        title: t("安排团队建设活动"), 
        description: t("联系活动策划公司,讨论团建方案,预算控制在每人500元以内,时间定在下个月第一个周末。") 
      },
      { 
        id: 4, 
        title: t("更新个人简历"), 
        description: t("添加最近完成的项目经验,更新技能列表,重新设计简历版式使其更有吸引力。") 
      },
      { 
        id: 5, 
        title: t("学习新的编程语言"), 
        description: t("开始学习Python,完成Codecademy上的Python入门课程,每天至少编程1小时。") 
      }
]); 
</script>

`

console.log(extractMessages(code,{ 
    extractor:"regex"
}).map(({message})=>message  ))
  