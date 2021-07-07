<template>
  <div ref="uploadArea" class="upload-area">
      <i v-if="isEnter" title="上传图片" class="el-icon-paperclip paperclip"></i>
  </div>
</template>

<script>
import { defineComponent, onMounted, ref } from 'vue'
export default defineComponent({
    setup() {
        const isEnter = ref(false)
        const uploadArea = ref(null)
        onMounted(() => {
            // 绑定鼠标移进移出事件
            uploadArea.value.addEventListener('mouseenter', e => {
                isEnter.value = true
            })
            uploadArea.value.addEventListener('mouseleave', e => {
                isEnter.value = false
            })
        })
        return {
            uploadArea,
            isEnter
        }
    }
})
</script>

<style scoped>
.upload-area {
    position: absolute;
    top: 0;
    left: 0;
    background-color: #eee;
    width: 2.1vw;
    height: 2.1vh;
    text-align: center;
    line-height: 2.1vh;
}
.paperclip {
    font-size: 2vw;
    cursor: pointer;
}
</style>