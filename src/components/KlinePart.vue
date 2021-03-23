<template>
  <p ref="klineDOM" class="kline-echarts"></p>
</template>
<script>
// 引入主模块
import * as echarts from "echarts/core";
import {
    GridComponent,
    TooltipComponent
} from 'echarts/components';
import {
    LineChart
} from 'echarts/charts';
import {
    CanvasRenderer
} from 'echarts/renderers';
import { mapActions } from 'vuex';
echarts.use(
    [GridComponent,TooltipComponent, LineChart, CanvasRenderer]
);
export default {
  props: ["timeList", "dataList",'isDetail'],
  data(){
    return {
      myChart: null,
    }
  },
  mounted(){
    this.drawKline();
  },
  methods: {
    ...mapActions(['setMyChart']),
    drawKline() {
      if(!this.timeList||this.timeList.length<=1){
        return false;
      }
      //画图
      this.$refs.klineDOM.removeAttribute("_echarts_instance_")
      this.myChart = echarts.init(this.$refs.klineDOM);

      // k线配置
      var option = {
        color: this.mainColor,
        tooltip: {
          trigger: "axis",
          backgroundColor: "#fff",
          textStyle: {
            fontSize: 12,
            fontWeight: "bold",
          },
          padding: 12,
          extraCssText: "box-shadow: 0 4px 8px rgba(0,0,0,0.1);",
        },
        xAxis: {
          show:!this.isDetail,
          axisLine:false, //坐标轴线
          data: this.timeList,
        },
        yAxis:{
          scale: true,
          show:false,
        },
        grid: {
          top: 0,
          left: 0,
          right: 0,
          bottom: this.isDetail?12:40,
          show: true,
          borderWidth: 0,
        },
        series: [
          {
            type: "line",
            data: this.dataList,
            showSymbol: false,
            lineStyle: {
              width: 2,
              color: {
                type: 'linear',
                colorStops: [{
                  offset: 0, color: '#ec05f3' // 0% 处的颜色
                }, {
                    offset: 1, color: '#00ffb8' // 100% 处的颜色
                }],
              },
            },

            emphasis:{
              lineStyle: {
                width: 2,
              },
            }
          },
        ],
      };
      // 画图
      this.myChart.setOption(option);
      this.myChart.resize();
      this.debouncedKlineResize = this.lodash.debounce(this.myChart.resize, 500)
    },
  },
  watch:{
    dataList(){
      this.drawKline();
    },
    screenWidth(){
      if(this.myChart){
        this.debouncedKlineResize();
      }
    }
  }
};
</script>
<style scoped>
.kline-echarts {
  width: 100%;
  height: 200px;
}
</style>