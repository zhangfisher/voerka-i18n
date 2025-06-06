// component.js
import { defineComponent, reactive, computed } from '@vue-mini/core'

defineComponent({
  setup() {
    const state = reactive({
      count: 0,
      double: computed(() => state.count * 2),
    })

    function increment() {
      state.count++
    }

    return {
      state,
      increment,
    }
  },
})