<template>
  <article>
    <router-link v-if="isHome" to="/rank" class="float-right view-all"
      >View all</router-link
    >
    <h2 class="title">Rank</h2>
    <main class="table-responsive">
      <table v-if="rankList&&rankList.length>0">
        <thead>
          <tr>
            <th>#</th>
            <th>Project</th>
            <th>Tags</th>
            <th :class="['cursor-pointer',{active:sortByWho=='tvl'}]" @click="sortRank('tvl')">
              <i>TVL</i>
              <img v-show="!isHome&&tvl.order=='desc'" src="@/assets/img/icon/down.png" width="12">
              <img v-show="!isHome&&tvl.order=='asc'" src="@/assets/img/icon/up.png" width="12">
            </th>
            <!-- <th :class="['cursor-pointer',{active:sortByWho=='address'}]" @click="sortRank('address')">
              <i>Address</i>
              <img v-show="!isHome&&address.order=='desc'" src="@/assets/img/icon/down.png" width="12">
              <img v-show="!isHome&&address.order=='asc'" src="@/assets/img/icon/up.png" width="12">
            </th>
            <th :class="['cursor-pointer',{active:sortByWho=='txn'}]" @click="sortRank('txn')">
              <i>Txn</i>
              <img v-show="!isHome&&txn.order=='desc'" src="@/assets/img/icon/down.png" width="12">
              <img v-show="!isHome&&txn.order=='asc'" src="@/assets/img/icon/up.png" width="12">
            </th>-->
            <th>Token</th>
            <th>Price</th>
            <th :class="['cursor-pointer',{active:sortByWho=='price'}]" @click="sortRank('price')">
              <i>24h Change</i>
              <img v-show="!isHome&&price.order=='desc'" src="@/assets/img/icon/down.png" width="12">
              <img v-show="!isHome&&price.order=='asc'" src="@/assets/img/icon/up.png" width="12">
            </th>
            <!-- <th :class="['cursor-pointer',{active:sortByWho=='like'}]" @click="sortRank('like')">
              👍
              <img v-show="!isHome&&like.order=='desc'" src="@/assets/img/icon/down.png" width="12">
              <img v-show="!isHome&&like.order=='asc'" src="@/assets/img/icon/up.png" width="12">
            </th> -->
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(item, i) in currentList"
            :key="item.ID"
            @click="goProjectDetail(item)"
          >
            <td>{{ 10*(page-1)+(i+1)}}</td>
            <td>
              <div class="flex-align-center">
                <img :src="'https://medishares-cn.oss-cn-hangzhou.aliyuncs.com/solana_project/' +item.img" width="32" @error="logoError"/>
                <p class="td-max-width">{{item.title}}</p>
              </div>
            </td>
            <td><i v-for="(tag,index) in item.tags" :key="index" class="mr-6">{{tag}}</i></td>
            <td>{{item.tvl>0?item.tvlShort:'--'}}</td>
            <!-- <td>
              {{item.address>0?item.addressShort:'--'}}
            </td>
            <td>
              {{item.txn>0?item.txnShort:'--'}}
            </td> -->
            <td>{{item.token?item.token:'--'}}</td>
            <td v-if="item.price>0">${{webUtil.addCommas(item.price)}}</td>
            <td v-else>--</td>
            <td v-if="item.percentChange||item.percentChange===0">
              <p v-if="item.percentChange>=0" class="color-up">+{{item.percentChange}}%</p>
              <p v-else class="color-down">{{item.percentChange}}%</p>
            </td>
            <td v-else>--</td>
            <!-- <td>{{webUtil.addCommas(item.like)}}</td> -->
          </tr>
        </tbody>
      </table>
      <div class="null" v-else>No information</div>
    </main>
    <Pagination :total="total" :page="page" :limit="limit" @emitPage="getRank" v-if="!isHome"/>
  </article>
</template>
<script>
import Pagination from "@/components/Pagination";
export default {
  components: { Pagination },
  props: ["isHome"],
  data() {
    return {
      // sort表示要排序的字段，支持'tvl', 'address', 'txn', 'price', 'like'
      // order=asc升序 order=desc降序
      tvl:{
        order:'desc'
      },
      address:{
        order:'desc'
      },
      txn:{
        order:'desc'
      },
      price:{
        order:'desc'
      },
      like:{
        order:'desc'
      },
      sortByWho:'tvl',
      sortOrder:'desc',
      total: 0,
      limit:10,//每页几条数据
      page:1,
      rankList: null,
      currentList: null,
    };
  },
  created(){
    this.getRank();
  },
  methods: {
    goProjectDetail(item) {
      if (item.ID) {
        this.$router.push("/project/" + item.ID);
      }
    },
    sortRank(type){
      if(this.isHome){
        return false;
      }
      if(this.sortByWho==type){
        this[type].order=this[type].order=='desc'?'asc':'desc';
      }else{
        this.sortByWho=type
      }
      this.sortOrder = this[type].order
      this.getRank();
    },
    getRank(page=1){
      this.page = page;
      // if(page>1&&this.total>this.limit){
      //   let start = this.limit*(page-1),end = start+this.limit;
      //   this.currentList = this.rankList.slice(start,end);
      //   return false;
      // }
      this.$loading(1);
      // order=asc升序 order=desc降序
      this.axios.get(this.domain+'getSolanaProjectTokensRank?sort='+this.sortByWho+'&order='+this.sortOrder+'&limit='+this.limit+'&page='+page).then(res=>{
        this.$loading(0);
        if(res.data.success){
          this.rankList = res.data.data.list
          this.total = res.data.data.total;
          this.currentList = this.rankList.slice(0,this.limit);
        }
      }).catch(err=>{
        console.log(err);
        this.$loading(0);
      })
    }
  },
};
</script>
<style scoped>
tbody tr,.cursor-pointer {
  cursor: pointer;
  user-select: none;
}
th img{
  opacity: 0.3;
  margin-left: 4px;
}
th.active img{
  opacity: 1;
}
table td:nth-child(2) {
  min-width: 160px;
}
td:nth-child(2) .td-max-width{
  width: calc(100% - 48px);
}
th:nth-child(n+3),td:nth-child(n+3){
  text-align: right;
}
th .flex-align-center{
  justify-content: flex-end;
}
</style>
