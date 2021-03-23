<template>
  <article>
    <div class="card-border tvl-part" v-if="klineDataList&&klineDataList.length>0">
      <h3>Total Value Locked in Sonala DeFi</h3>
      <h1>${{webUtil.addCommas(klineDataList[klineDataList.length-1])}}
        <span v-if="tvlPercentChange>=0" class="color-up">+{{tvlPercentChange}}%</span>
        <span v-else class="color-down">{{tvlPercentChange}}%</span>
      </h1>
      <KlinePart :timeList="klineTimeList" :dataList="klineDataList" v-if="klineDataList && klineDataList.length > 2"/>
    </div>
    <ul class="banner flex-between">
      <li class="bg-light-green">
        <h6>Total Value Locked</h6>
        <h3 v-if="totalTVL>0">${{webUtil.addCommas(totalTVL)}}</h3>
        <h3 v-else>--</h3>
      </li>
      <li class="bg-light-blue">
        <h6>Transactions per second (TPS)</h6>
        <h3>{{tps>0?webUtil.addCommas(tps):'--'}}</h3>
      </li>
      <li class="bg-light-purple">
        <h6>Total Txn</h6>
        <h3>{{txn>0?webUtil.addCommas(txn):'--'}}</h3>
      </li>
    </ul>
  </article>
</template>
<script>
import KlinePart from './KlinePart.vue';
export default {
  components: { KlinePart },
  props: ["isHome"],
  data() {
    return {
      klineTimeList:[],
      klineDataList:[],
      totalTVL:'',
      tps:'',
      txn:'',
      tvlPercentChange:0
    }
  },
  created(){
    this.getKlineData();
  },
  methods:{
    getKlineData() {
      this.axios.get(this.domain+"getSolanaProjectTvl").then(res=>{
          if (res.data.success) {
            this.totalTVL=res.data.data.totalTVL
            this.tps=res.data.data.tps
            this.txn=res.data.data.txn
            this.tvlPercentChange=(res.data.data.tvlPercentChange*100).toFixed(2)
            let dataList = res.data.data.list;
            if(dataList){
              this.klineTimeList = dataList.map((v) => v.showDate.slice(5,11));
              this.klineDataList = dataList.map((v) =>v.tvl);
            }else{
              this.klineTimeList = null;
              this.klineDataList = null
            }

          } else {
            this.klineDataList = null;
          }
        }).catch((err) => {
        console.log(err);
      });
    },
  }
};
</script>
<style scoped>
.kline-echarts{
  margin-top: 8px;
}
.tvl-part{
  margin-bottom: 40px;
}
.banner{
  padding-bottom: 40px;
  flex-wrap: wrap;
}
.banner li{
  width: 32%;
  padding: 24px;
  color: #000;
  border-radius: 4px;
}
.bg-light-green{
  background: #e0f9f7;
}
.bg-light-blue{
  background: #e7f4fc;
}
.bg-light-purple{
  background: #f8effd;
}
.banner h3{
  margin-top: 4px;
  word-break: break-all;
}
@media(max-width: 996px) {
  .banner li{
    width: 100%;
  }
  .banner li:nth-child(n+2){
    margin-top: 24px;
  }
}
@media(max-width:768px){
  .tvl-part h3{
    font-size: 16px;
  }
}
</style>