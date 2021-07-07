<template>
  <div :class="{'loadmore-container': loadmore_text === '加载更多', 'loadmore-container-text': loadmore_text === '你看到我的底线了', 'loadmore-container-hover': loading}" @click="loadmoreFunc">
      <span>{{ loadmore_text }}</span>
      <i v-if="loading" class="el-icon-loading"></i>
  </div>
</template>

<script>
import { computed, defineComponent, ref } from 'vue'
export default defineComponent({
    setup(props, context) {
        const loading = ref(false)
        const loadmore_text = ref('加载更多')
        function loadmoreFunc() {
            if (loadmore_text.value !== '加载更多') return
            this.loading = true
            context.emit('loadmore', msg => {
                this.loading = false
                if (msg) {
                    this.loadmore_text = '你看到我的底线了'
                }
            })
        }
        return {
            loadmoreFunc,
            loading,
            loadmore_text
        }
    }
})
</script>

<style scoped>
.loadmore-container {
    margin: 1rem auto;
    width: 6rem;
    height: 2rem;
    line-height: 2rem;
    text-align: center;
    border: 1px solid #eee;
    border-radius: 4px;
    color: white;
    background-color: #add8e6;
    cursor: pointer;
    letter-spacing: 1px;
}
.loadmore-container-text {
    cursor: auto;
    text-align: center;
}
.loadmore-container:hover, .loadmore-container-hover {
    background-color: darkcyan;
}
</style>