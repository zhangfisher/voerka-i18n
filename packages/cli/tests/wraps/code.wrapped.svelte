<script>
    import { writable } from 'svelte/store';
    import { t } from '../src/languages';

    // 创建一个可写的 store 来存储待办事项
    const todos = writable([]);

    // 添加一个新的待办事项
    function addTodo(event) {
      const value = event.target.value.trim();
      if (value) {
        todos.update(todos => [...todos, { text: value, done: false }]);
        event.target.value = '';
      }
    }
    // 更新一个待办事项的状态或文本
    function updateTodo(todo) {
      todos.update(todos => todos.map(t => t.id === todo.id ? { ...todo } : t));
    }

    // 删除一个待办事项
    function deleteTodo(id) {
      todos.update(todos => todos.filter(todo => todo.id !== id));
    }

    // 当组件挂载时，为每个待办事项生成一个唯一的 ID
    $: todos.update(todos => todos.map((todo, index) => ({ ...todo, id: todo.id || (index + 1) })));
</script>


<div>
  <input type="text" placeholder={t('输入待办事项')} on:keyup={e => e.key === 'Enter' && addTodo(e)}>
  <button on:click={addTodo}>{t('添加')}</button>
</div>

<ul class="todo-list">
  {#each $todos as todo (todo.id)}
    <li class="todo-item">
      <input type="checkbox" bind:checked={todo.done}>
      <input type="text" value={todo.text} on:input={e => updateTodo({ ...todo, text: e.target.value })} disabled={todo.done}>
      <button on:click={() => deleteTodo(todo.id)}>{t('删除')}</button>
      <button on:click={() => addTodo()}>{t('增加')}</button>
      <button on:click={() => updateTodo({ ...todo, done: !todo.done })}>{todo.done ? t('已完成') : t('未完成')}</button>
      <button on:click={() => updateTodo({ ...todo, text: t('清空') })}>{t('清空')}</button>
      <button on:click={() => updateTodo({ ...todo, text: t('默认文本') })}>{t('默认')}</button>
      <button on:click={() => updateTodo({ ...todo, text: t('自定义文本') })}>{t('自定义')}</button>
    </li>
  {/each}
</ul>

<style>
    .todo-list {
      list-style-type: none;
      padding: 0;
    }
    .todo-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 10px;
      padding: 10px;
      border: 1px solid #ccc;
      border-radius: 4px;
    }
    .todo-item input[type="checkbox"] {
      margin-right: 10px;
    }
    .todo-item input[type="text"] {
      flex-grow: 1;
      min-width: 150px;
      margin-right: 10px;
      padding: 5px;
      border: 1px solid #ccc;
      border-radius: 4px;
    }
    .todo-item button {
      margin-left: 10px;
      padding: 5px 10px;
      border: none;
      background-color: #f44336;
      color: white;
      border-radius: 4px;
      cursor: pointer;
    }
    .todo-item button:hover {
      background-color: #da190b;
    }
</style>
