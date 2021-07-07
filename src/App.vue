<template>
  <div class="view">
    <!-- 菜单 -->
    <el-menu :default-active="activeIndex" mode="horizontal" background-color="#545c64" text-color="#eee" active-text-color="#fa79a8"
    @select="menuIndexChange">
      <el-menu-item index="1">阳光 · Sunning</el-menu-item>
      <el-menu-item index="2">淡雅 · Elegant</el-menu-item>
      <el-menu-item index="3">精致 · Pretty</el-menu-item>
      <div class="weather">
        <!-- 天气显示区 -->
        <div class="weather-area">
          <div v-if="city" class="weather-area-show">
            <div class="weather-area-show-left">
              <div style="font-size: 13px;">更新时间：&nbsp;&nbsp;{{ weather_info.reporttime.substring(11) }}</div>
              <div><i style="font-size: 34px;" :class="['iconfont', `icon-${weather_code[weather_info.weather]}`]"></i> {{ weather_info.weather }}&nbsp;{{ weather_info.winddirection + '风' }} {{ weather_info.windpower + '级' }}</div>
            </div>
            <div class="weather-area-show-right">{{ weather_info.temperature }}<span class="temperature">℃</span></div>
          </div>
          <div v-else class="weather-area-tip">选择城市后查看天气</div>
        </div>
        <!-- 城市选择区 -->
        <el-select class="city-choose" v-model="city" filterable placeholder="选择城市" @change="chooseCity">
          <template v-if="city === ''">
            <el-option-group v-for="group in citys_list" :key="group" :label="group.label">
              <el-option
                v-for="item in group.options" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-option-group>
          </template>
          <template v-else>
            <el-option
              v-for="item in citys_list_options" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </template>
        </el-select>
      </div>
    </el-menu>
    <!-- 上传图片区域 -->
    <upload-area @click="showUploadDialog"></upload-area>
    <!-- 上传图片dialog -->
    <el-dialog
      title="上传图片"
      v-model="dialogVisible"
      width="70%"
      append-to-body
    >

    </el-dialog>
    <!-- vue-router展示区 -->
    <router-view class="router-view" />
  </div>
</template>
<script>
import { request } from '@/utils/request'
import { citys_list } from '@/utils/city_code'
import { citys_list_options } from '@/utils/citys_list_options'
import { weather_code } from '@/utils/weather_code'
import { defineComponent, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'
import { ElMessageBox, ElMessage } from 'element-plus'
import UploadArea from '@/components/uploadArea.vue'
export default defineComponent({
  components: {
    UploadArea
  },
  setup() {
    const $router = useRouter()
    const $store = useStore()

    // 点击切换菜单
    function menuIndexChange(index) {
      if (index === '1') $router.push('/sunning')
      else if (index === '2') $router.push('/elegant')
      else if (index === '3') $router.push('/pretty')
    }
    
    // 查询天气 -- 使用高德天气API
    const city = ref('')
    const weather_info = reactive({ reporttime: '', temperature: '', weather: '', winddirection: '', windpower: '' })
    async function getWeatherInfo() {
      const key = '360fa1b9dfd6f96542b3cae962f8eef4'
      const { data: res } = await request(`https://restapi.amap.com/v3/weather/weatherInfo?key=${key}&city=${city.value}`)
      if (res.lives.length > 0) {
        const data = res.lives[0]
        weather_info.reporttime = data.reporttime
        weather_info.temperature = data.temperature
        weather_info.weather = data.weather
        weather_info.winddirection = data.winddirection
        weather_info.windpower = data.windpower
      }
    }
    // 选择城市，发请求拿取天气数据 --- 保存到vuex中
    function chooseCity(value) {
      city.value = value
      getWeatherInfo()
      // 找到对应城市代码的城市名称
      let city_name = ''
      for (let i = 0; i < citys_list.length; i++) {
        for (let j = 0; j < citys_list[i].options.length; j++) {
          if (value === citys_list[i].options[j].value) {
            city_name = citys_list[i].options[j].label
            break
          }
        }
      }
      $store.commit('changeCity', city_name)
    }

    // 去到上传图片页面
    function showUploadDialog() {
      ElMessageBox.prompt('给你个机会输入密语吧', '哎哟，居然发现了这里', {
        confirmButtonText: '确认',
        cancelButtonText: '退出',
        type: 'warning',
        beforeClose: (action, instance, done) => {
          if (action === 'confirm') {
            if (instance.inputValue === '媛宝媛宝') {
              ElMessage({ message: 'Bingo!!!', type: 'success' })
              done()
            }
            else ElMessage({ message: '不对不对!!!', type: 'error' })
          } else done()
        }
      }).then(() => dialogVisible.value = true).catch(() => console.log())
    }

    // 控制dialog的显示与隐藏
    const dialogVisible = ref(false)

    return {
      activeIndex: '1',
      city,
      citys_list,
      citys_list_options,
      weather_info,
      weather_code,
      dialogVisible,
      menuIndexChange,
      chooseCity,
      showUploadDialog
    }
  }
})
</script>
<style>
@import url('//at.alicdn.com/t/font_2642879_yxfzi3uw99.css');
 html, body {
   margin: 0;
   padding: 0;
 } 
 #app {
   background-color: #eee;
   border-radius: 8px;
 }
 .view {
   margin: 0 auto;
   width: 90vw;
   height: 100vh;
 }
 .el-menu {
   position: relative;
 }
 .weather {
   position: absolute;
   top: 50%;
   right: 1%;
   transform: translate(0, -50%);
   width: 22rem;

   display: flex;
   align-items: center;
   justify-content: space-between;
 }
 .weather-area {
   width: 100%;
   font-size: 13px;
   color: #eee;
 }
 .weather-area-show {
   display: flex;
 }
 .weather-area-show-left {
   display: flex;
   flex-direction: column;
 }
 .weather-area-show-right {
   margin-left: .8rem;
   display: flex;
   justify-content: center;
   align-items: center;
   font-size: 30px;
   font-weight: 200;
 }
 .temperature {
   font-size: 16px;
   margin-left: 2px;
   margin-top: 10px;
 }
 .router-view {
   margin-top: 8px;
 }
</style>
