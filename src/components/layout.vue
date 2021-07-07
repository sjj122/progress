<template>
  <el-card class="card"><slot></slot></el-card>
</template>

<script>
    import { defineComponent } from 'vue'
    export default defineComponent({

    })
</script>

<style scoped>
.card {
    height: calc(98vh - 61px);
    overflow: auto;
}

/* chrome & safari 浏览器 */
/*滚动条整体部分,必须要设置*/
.card::-webkit-scrollbar{
  width: 6px;
}
/*滚动条的滑块按钮*/
.card::-webkit-scrollbar-thumb{
  border-radius: 10px;
  background-color: #ccc;
  box-shadow: inset 0 0 5px #888;
}

</style>