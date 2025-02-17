import { extractMessages } from ".."; 
 
const code = String.raw` 
<script>
  import { ref } from 'svelte';
  const todos = ref([
    { 
      id: 1, 
      title: '完成项目报告', 
      description: '整理本季度的项目进度,准备PPT,并在周五之前发送给项目经理审阅。' 
    },
    { 
      id: 5, 
      title: t("学习新的编程语言"), 
      description: t("开始学习Python,完成Codecademy上的Python入门课程,每天至少编程1小时。") 
    }
  ]); 
</script>
<div class="todo-container">
  <h1>Todo List</h1>
  <input 
    bind:value={newTodo} 
    on:keyup.enter={() => addTodo(t('T1'))} 
    placeholder={t('T2')}
  />
  <ul>
    {#each todos as todo, index}
      <li title="任务">
        <span class:completed={todo.completed}>{todo.text}</span>
        <button title={t('T3')} on:click={() => openTodo(index)}>
          {t("T4")} {t("T5")}
        </button>
        <button title={t('T6',1,2)} on:click={() => addTodo(index)}>{t("T7")}</button>
        <button on:click={() => removeTodo(index)}>{t("T8")}</button>
        <button on:click={() => editTodo(index, t('T9'))}>{t("T10", 11, {})}</button>
        <Translate message="T11"/>
        <Translate vars="v1" message="T12" />
        <Translate vars="v2" message={Tx} />
        <Translate vars={v3} message="T13" />
        <Translate vars="tv1" message="T14" options="sss">ddsd</Translate>
        <Translate vars="tv2" message="T15" options="sss">ddsd</Translate>
      </li>
    {/each}
  </ul>
  <div>{t("T16")}</div>
  <!-- t("Tx") -->
</div>
`

console.log(extractMessages(code,{
    language:'svelte'
}).map(({message})=>message))
  