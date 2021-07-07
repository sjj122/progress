<template>
  <layout>
    <el-timeline>
      <!-- <video controls preload width="200">
        <source src="../../assets/视频.mp4" type="video/mp4">
        抱歉，你的游览器不支持video
      </video> -->
      <!-- 每一个时间线项 -->
      <el-timeline-item v-for="(item, index) in sunnings" :key="index"
                        :icon="item.icon" :type="item.type" :color="item.color"
                        :timestamp="format_month(item.month)" placement="top">
                        <div class="card-container">
                          <el-card v-for="(activity, index) in item.activities" :key="index" shadow="hover">
                            <!-- 文字容器与踩一踩 -->
                            <div class="text-container">
                              <p><span style="font-size:18px;color:#fa79a8;">{{ format_date(activity.date) }}</span>  {{ activity.desc }}</p>
                              <el-tooltip content="踩一踩" placement="top" :enterable="false">
                                <div class="steps">
                                  <el-popconfirm
                                    :confirm-button-text="`${getCity === '' ? '好的' : '是的'}`"
                                    cancel-button-text="取消"
                                    :title="`${getCity === '' ? '你还没有选择城市' : `确定添加${getCity}的踩一踩tag吗？`}`"
                                    @confirm="popconfirm_confirm(item._id, activity.id)"
                                  >
                                    <template #reference>
                                      <el-button size="mini">+</el-button>
                                    </template>
                                  </el-popconfirm>
                                  <el-tag v-for="(city_tag, index) in json_steps[activity.id]" :key="index" :type="tag_type_now(city_tag.step_num)" @click="addStep(item._id, activity.id, city_tag.city)">
                                    <i class="iconfont icon-zuji"></i> {{ city_tag.city }} +{{ city_tag.step_num }}
                                  </el-tag>
                                </div>
                              </el-tooltip>
                            </div>
                            <!-- 图片容器 -->
                            <div class="img-container">
                              <div class="img-wrap" v-for="(img, index) in activity.images" :key="index">
                                <el-image class="image_size"
                                          :src="exampleJpg" fit="contain" lazy :preview-src-list="activity.images">
                                </el-image>
                                <!-- :src="`${img}?x-oss-process=image/resize,m_lfit,h_300,w_500`" -->
                                <!-- <i v-if="index !== activity.images.length - 1" :class="icon_lists[parseInt(Math.random() * 20)]"></i> -->
                                <el-tooltip v-if="index === activity.images.length - 1" content="敬请期待" placement="right" :enterable="false"><i class="el-icon-more"></i></el-tooltip>
                              </div>
                            </div>
                          </el-card>
                        </div>
      </el-timeline-item>
      <!-- 加载更多组件 -->
      <loadmore @loadmore="loadmoreSunnings"></loadmore>
    </el-timeline>
  </layout>
</template>

<script>
import Layout from '@/components/layout.vue'
import Loadmore from '@/components/loadmore.vue'
import exampleJpg from '@/assets/images/qqtouxiang.jpg'
import { request } from '@/utils/request'
import { tag_type } from '@/utils/tag_type'
import { icon_lists } from '@/utils/icon_lists'
import { computed, defineComponent, onMounted, reactive, ref } from 'vue'
import { ElMessage } from 'element-plus'
import { useStore, mapGetters } from 'vuex'
export default defineComponent({
  components: {
    Layout,Loadmore
  },
  computed: {
    ...mapGetters(['getCity'])
  },
  setup() {
    const $store = useStore()
    // 获取sunnings数据
    const sunnings = ref([])
    const steps = reactive({})     // 单独保存踩一踩数据，方便更新，对象形式
    const pageNum = ref(1)
    async function getSunnings(callback) {
      const { data: res } = await request({
        url: '/getSunning',
        method: 'post',
        data: {
          pageNum: pageNum.value,
          pageSize: 1
        }
      })
      if (res.status !== 200) ElMessage({ message: 'network error', type: 'error' })
      else {
        if (res.result.length !== 0) {
          // 保存sunnings数据
          res.result[0].activities = res.result[0].activities.sort((a, b) => b.date - a.date) // 将日期排序一下
          sunnings.value = [...sunnings.value, ...res.result]
          // 保存踩一踩数据
          for (let i = 0; i < res.result[0].activities.length; i++) {
            steps[res.result[0].activities[i].id] = res.result[0].activities[i].steps
          }
        }
        // 回传给loadmore组件
        if (callback) {
          if (res.result.length === 0) callback('no more data')
          else callback()
        }
      }
    }
    onMounted(() => {
      getSunnings()
    })
    // 处理timestamp格式问题
    let format_month = computed(() => month => month + '月')
    let format_date = computed(() => date => new Date(date).toLocaleString().substring(5, 8))
    // 序列化steps方便取值
    let json_steps = computed(() => JSON.parse(JSON.stringify(steps)))
    // 返回不一样的tag颜色，根据踩一踩数量，个位为1-2 3-4 5-6 7-8 9和0
    let tag_type_now = computed(() => num => {
      let num_arr = num.toString().split('')
      let type = ''
      switch (num_arr[num_arr.length - 1]) {
        case '1':
        case '2':
          type = tag_type[0]
          break
        case '3':
        case '4':
          type = tag_type[1]
          break
        case '5':
        case '6':
          type = tag_type[2]
          break
        case '7':
        case '8':
          type = tag_type[3]
          break
        case '9':
        case '0':
          type = tag_type[4]
          break
      }
      return type
    })
    // 返回不一样的图片连接小图标
    // let img_i = computed(() => )
    // 获取更多sunnings数据
    function loadmoreSunnings(callback) {
      pageNum.value += 1
      getSunnings(callback)
    }
    // 添加踩一踩tag
    async function add_step_func(sunning_id, activity_id, city, flag) {
      const { data: res } = await request({
          url: '/addStepTag',
          method: 'post',
          data: {
            sunning_id,
            activity_id,
            tag_city: city || $store.getters.getCity.substring(0, $store.getters.getCity.length - 1)
          }
        })
        if (res.status !== 200) ElMessage({ message: 'network error', type: 'error' })
        else {
          // 更新加一数据
          updateSunningData(res.sunning)
          // 提示加一成功
          if (flag) ElMessage({ message: `${res.result === '增加' ? '已存在，默认+1' : '添加成功'}`, type: 'success' })
          else ElMessage({ message: '+ 1', type: 'success' })
        }
    }
    function popconfirm_confirm(sunning_id, activity_id) {
      if ($store.getters.getCity) {
        add_step_func(sunning_id, activity_id, null, 1)
      }
    }
    function addStep(sunning_id, activity_id, city_name) { // 直接点击图标加一
      add_step_func(sunning_id, activity_id, city_name)
    }
    // 更新数据方法
    function updateSunningData(data) {
      for (let i = 0; i < data.activities.length; i++) {
        steps[data.activities[i].id] = data.activities[i].steps
      }
    }
    
    return {
      sunnings,
      steps,
      format_month,
      format_date,
      json_steps,
      tag_type_now,
      exampleJpg,
      tag_type,
      icon_lists,
      loadmoreSunnings,
      popconfirm_confirm,
      addStep
    }
  }
})
</script>

<style scoped>
.card-container {
  border: .1rem solid #add8e6;
  border-radius: 6px;
  padding: 4px 10px;
}
.image_size {
  width: 17rem;
  padding-bottom: 1rem;
}
.img-container {
  column-count: 5;
  column-gap: 0;
  overflow: auto;
  text-align: center;
}
/* .img-wrap {
  display: flex;
  justify-content: center;
  align-items: center;
} */
/* .img-wrap > .el-image { flex: 9; }
.img-wrap > i {
  flex: 1;
  font-size: 1.6rem;
} */
.el-timeline-item__timestamp {
  font-size: 18px;
}
.text-container {
  height: 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: .7rem;
}
.steps {
  display: flex;
  max-width: 36rem;
  height: 46px;
  overflow: auto;
  border-bottom: 1px solid #eee;
}
.steps::-webkit-scrollbar,.img-container::-webkit-scrollbar{
  height: 6px;
}
/*滚动条的滑块按钮*/
.steps::-webkit-scrollbar-thumb,.img-container::-webkit-scrollbar-thumb{
  border-radius: 10px;
  background-color: #ccc;
  box-shadow: inset 0 0 5px #888;
}
.el-tag:nth-child(1) { margin-left: 0; }
.el-tag:last-child { margin-right: 1px; }
.el-tag {
  margin-left: .7rem;
  cursor: pointer;
}
.el-button {
  height: 32px;
  width: 32px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 26px;
  color: #888;
}
</style>