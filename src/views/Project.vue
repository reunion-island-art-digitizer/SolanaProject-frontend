<template>
  <section class="project-detail" v-if="project">
    <!-- <router-link :to="backPath" class="close">Back</router-link> -->
    <p class="close" @click="goBackPath">Back</p>
    <main class="clearfix container">
      <article class="float-left">
        <div class="basic-info clearfix">
          <div class="logo">
            <img
              v-if="project.img"
              :src="
                'https://medishares-cn.oss-cn-hangzhou.aliyuncs.com/solana_project/' +
                project.img
              "
              width="96"
              height="96"
            />
            <img
              v-else
              src="@/assets/img/icon/default.png"
              width="96"
              height="96"
            />
          </div>
          <div class="float-left">
            <h4 class="dapp-title">{{ project.title }}</h4>
            <div
              class="dapp-shortdes"
              v-html="webUtil.getFormatCode(project.introduction)"
            ></div>
            <div class="dapp-type">
              <label>{{ cateTitleByID(project) }}</label>
              <template v-if="project.tags.length > 0">
                <label v-for="(item, index) in project.tags" :key="index"
                  >{{ item }}
                </label>
              </template>
            </div>
          </div>
          <!-- 点赞 -->
          <!-- <div :class="['like-info',{active:isLiked}]" @click="likeAction">
            <h2>👍</h2>
            <div>
              <p>{{project.voters?project.voters:'366'}}</p>
              <span>Voters</span>
            </div>
          </div> -->
        </div>
        <!-- 价格曲线 -->
        <div
          class="kline-part"
          v-if="klineTimeList&&klineTimeList.length>1"
        >
          <h2>
            <img
              :src="project.token.img"
              width="24"
              class="mr-6"
              @error="logoError"
            />
            <span>{{ project.token.name }}</span>
          </h2>
          <h2>
            <span class="mr-6">${{ project.token.price }}</span>
            <label v-if="project.token.percentChange < 0" class="color-down">{{project.token.percentChange }}%</label>
            <label v-else class="olor-up">+{{ project.token.percentChange }}%</label>
          </h2>
          <KlinePart isDetail="1" :timeList="klineTimeList" :dataList="klinePriceList"/>
          <ul class="select-kline-type">
            <li
              v-for="item in klineType"
              :key="item.name"
              :class="{ active: selectedKline.name == item.name }"
              @click="selectKline(item)"
            >
              {{ item.name }}
            </li>
          </ul>
        </div>
        <!-- tvl -->
        <div class="dev-active dev-active-single" v-if="project.dappradar">
          <h6>Total Value Locked</h6>
          <h2>{{project.dappradar.tvlShort?project.dappradar.tvlShort:'--'}}</h2>
        </div>
        <!-- <ul class="dev-active flex-between" v-if="project.dappradar">
          <li>
            <h6>Total Value Locked</h6>
            <h2>{{project.dappradar.tvlShort?project.dappradar.tvlShort:'--'}}</h2>
          </li>
          <li>
            <h6>Address</h6>
            <h2>{{project.dappradar.addressShort?project.dappradar.addressShort:'--'}}</h2>
          </li>
          <li>
            <h6>Txn</h6>
            <h2>{{project.dappradar.txnShort?project.dappradar.txnShort:'--'}}</h2>
          </li>
        </ul> -->
        <div class="about" v-if="project.description">
          <h2>About {{ project.title }}</h2>
          <div
            class="dapp-slogan"
            v-html="webUtil.getFormatCode(project.description)"
          ></div>
        </div>
      </article>
      <article class="float-right">
        <!-- 邮箱等链接 -->
        <div class="detail-contact">
          <p
            class="website"
            v-if="project.website"
            @click.stop="openLink(project.website)"
          >
            Visit Website
          </p>
          <ul>
            <li
              v-for="(item, i) in contactList"
              :key="i"
              @click.stop="openLink(project[item], item)"
            >
              <img :src="require('@/assets/img/tag/' + item + '.png')" />
              <span style="text-transform: capitalize">{{ item }}</span>
            </li>
          </ul>
          <a href="javascript:;" class="share-btn" @click="copyAction()">Share</a>
        </div>
        <!-- voters -->
        <!-- <div class="border-top" v-if="voters&&voters.length>0">
          <h2>{{voters.length}} Voters</h2>
          <p class="voters-list">
            <a v-for="(address,i) in voters" :key="i" target="_blank" rel="noopener noreferrer" :href="'https://bscscan.com/address/'+address">{{webUtil.formatStrByDot(address,8,8)}}</a>
          </p>
        </div> -->
      </article>
      <article class="float-left">
        <a
          :href="
            'mailto:solanaproject@protonmail.com?subject=Update-' + project.title
          "
          class="update-project"
          >Submit an update on this project</a
        >
        <p class="color-grey tip">
          All info in this site is purely educational and should only be used to
          inform your own research. We're not offering investment advice,
          endorsement of any project or approach, or promise of any outcome.
        </p>
      </article>
    </main>
  </section>
</template>
<script>
import KlinePart from '../components/KlinePart.vue';
export default {
  components: { KlinePart },
  props: ["id"],
  data() {
    return {
      project: null,
      isLiked:false,
      contactList: [],
      klineTimeList:[],
      klinePriceList:[],
      klineType:[{
        type:'5min',
        name:'1D',
        limit:'288'
      },{
        type:'1h',
        name:'1W',
        limit:'168'
      },{
        type:'4h',
        name:'1M',
        limit:'180'
      }],
      selectedKline:{
        type:'5min',
        name:'1D',
        limit:'288'
      },
      USDRmbPrice:'6.48',
      voters:null,
      backPath:'/projects'
    };
  },
  created() {
    this.getProjectInfo();
  },
  methods: {
    goBackPath(){
      if(window.history.length>1){
        this.$router.back();
      }else{
        this.$router.push('/projects');
      }
    },
    getProjectInfo() {
      if (this.id) {
        this.axios
          .get(this.domain + "getProjectById?v=1.0&id=" + this.id)
          .then((res) => {
            if (res.data.success) {
              this.project = res.data.data;
              this.contactList = this.contact
                .slice(1)
                .filter((v) => this.project[v]);

              if(this.project&&this.project.token){
                this.project.token.price = new this.BigNumber(this.project.token.last2Rmb).div(this.USDRmbPrice).toFormat(4);
              }
              if(this.project.marketID&&this.project.marketID>0){
                this.getKlineData();
              }else{
                this.klineTimeList = null
              }
            }
          })
          .catch((err) => {
            console.log(err);
          });
      }
    },
    selectKline(item) {
      this.selectedKline = item;
      this.getKlineData();
    },
    getKlineData() {
      this.axios.get(this.marketDomain+"api/pricePoint?tokenID=" +
          this.project.marketID +
          "&type=" +
          this.selectedKline.type +
          "&limit=" +
          this.selectedKline.limit +
          "&baseCoin=USD").then(res=>{
          if (res.data.success && res.data.data.price) {
            var dataList = res.data.data.price.reverse();
            this.USDRmbPrice = res.data.data.baseCoin.rmb;
            this.project.token.price = new this.BigNumber(
              this.project.token.last2Rmb
            )
              .div(this.USDRmbPrice)
              .toFormat(4);
            this.klineTimeList = dataList.map((v) => v.time);
            this.klinePriceList = dataList.map((v) =>
              new this.BigNumber(v.last2Rmb).div(this.USDRmbPrice).toFixed(4)
            );
          } else {
            this.klinePriceList = null;
            this.klineTimeList = null;
          }
        }).catch((err) => {
        console.log(err);
      });
    },
    likeAction(){
      this.isLiked = true;
      if(this.isLiked){
        return false;
      }
      if(this.account){
        this.isLiked = true;
      }else{
        // this.login().then(()=>{
        //   this.isLiked = true;
        // })
      }
    }
  },
  watch:{
    id(){
      this.getProjectInfo();
    }
  }
};
</script>
<style scoped>
/*详情页*/
.project-detail{
  position: fixed;
  top: 0;
  left: 320px;
  right: 0;
  padding-top: 48px;
  z-index: 1200;
  background: #fff;
}
.project-detail h2 {
  font: bold 20px/24px Rubik-Medium;
  margin-bottom: 24px;
}

.project-detail .close {
  color: var(--mainColor);
  cursor: pointer;
  user-select:none;
  padding: 32px 44px 12px;
  background:#fff url(../assets/img/icon/back.png)no-repeat 24px 32px/16px;
  position: fixed;
  left: 320px;
  right: 0;
  top: 0;
  z-index:1900;
}
.float-left{
  max-width: 620px;
  width: 100%;
}
.float-right{
  max-width: 200px;
  width: 100%;
}
.basic-info {
  position: relative;
  padding: 0 0 var(--px48) 120px;
  border-bottom: var(--border);
  margin-bottom: var(--px48);
}
.basic-info .logo {
  overflow: hidden;
  position: absolute;
  left: 0;
  top: 0;
  border-radius: 2px;
}
/* .basic-info .float-left{
  width: calc(100% - 110px);
} */
.project-detail .dapp-title {
  word-break: break-word;
  white-space: normal;
  font-size: 24px;
  line-height: 28px;
}
.project-detail .dapp-slogan {
  display: block;
  word-break: break-word;
  font-size: 16px;
  line-height: 24px;
}
.project-detail .dapp-shortdes {
  color: #000;
  font-size: 14px;
  margin: 0;
}
.project-detail .dapp-type {
  display: flex;
  flex-wrap: wrap;
}
.project-detail .dapp-type label {
  padding: 4px 12px;
  border-radius: 16px;
  border:var(--border);
  margin: 8px 16px 0 0;
}
.detail-contact {
  padding-bottom: var(--px48);
}
.detail-contact .website,.share-btn{
  font: bold 16px/24px Rubik-Medium;
  cursor: pointer;
  display: inline-block;
  border: 1px solid var(--mainColor);
  padding: 12px 24px 12px 52px;
  border-radius: 24px;
}
.detail-contact .website {
  background: var(--mainColor) url(../assets/img/icon/visit.png)no-repeat left 24px center/20px;
  color: #fff;
  margin-bottom: 24px;
}
.share-btn {
  background: url(../assets/img/icon/share.png)no-repeat left 24px center/20px;
  color: var(--mainColor);
}
.detail-contact li {
  margin-bottom: 16px;
  font-size: 16px;
  line-height: 24px;
  color: #000;
  cursor: pointer;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.detail-contact li img {
  width: 24px;
  margin-right: 8px;
}

.detail-contact li:last-child {
  margin-bottom: var(--px48);
}

.update-project {
  color: var(--mainColor);
  text-decoration: underline;
  padding-bottom: var(--px48);
  margin-bottom: var(--px48);
  padding-left: 32px;
  background: url(../assets/img/icon/edit.png) no-repeat left top/24px;
  border-bottom: var(--border);
  display: block;
  font-size: 16px;
  line-height: 24px;
}
.chain-info {
  cursor: pointer;
  display: flex;
  align-items: center;
  margin-bottom: 16px;
}

.chain-info span {
  margin-left: 8px;
}


/* 点赞 */
.like-info{
  float: right;
  padding: 12px 0;
  background: #efeff4;
  border-radius: 2px;
  font-size: 12px;
  width: 88px;
  text-align: center;
  cursor: pointer;
  user-select: none;
  margin-left: 12px;
}
.like-info h2{
  font-size: 28px;
  line-height: 38px;
  margin-bottom: 5px;
}
.like-info p{
  font:bold 14px/16px Rubik-Medium;
}
.like-info.active{
  background: #FEF2CD;
  color:var(--mainColor);
}

/* 价格曲线图 */
.kline-part {
  padding-bottom: 0;
}

.kline-part h2:first-of-type {
  margin-bottom: 16px;
}

.kline-part label {
  font-size: 16px;
}

/* 开发活跃度 */
.dev-active{
  margin-bottom: var(--px48);
  padding: 16px 8px;
  border:var(--border);
  border-radius: 2px;
  flex-wrap: wrap;
}
.dev-active li{
  width: 33%;
  padding: 8px 16px;
  word-break: break-word;
}
.dev-active h2{
  font-weight: 400;
  font-family: Rubik-Regular;
  margin: 4px 0 0;
}
.dev-active-single{
  padding: 34px 24px;
  display: flex;
  align-items: center;
}
.dev-active-single h2{
  margin: 0 0 0 56px;
}
/* voters */
.voters-list a{
  display: block;
  color:var(--greyColor);
  margin-bottom: 12px;
}
.select-kline-type{
  border-bottom: var(--border);
  margin-bottom: var(--px48) ;
}
.about{
  margin-bottom: var(--px48);
}
@media(max-width: 1220px) {
  .about{
    border-bottom: var(--border);
    padding-bottom: var(--px48);
  }
  .float-left,
  .float-right {
    margin: 0 auto;
    max-width: 640px;
    float: none;
  }
  .basic-info .float-left{
    float: left;
  }
}

@media(max-width:768px){
  .project-detail{
    left: 0;
  }
  .project-detail .close{
    left: 0;
    right: 0;
    padding:20px 16px 12px 36px;
    background-position:16px 20px;
  }
  .basic-info .logo img {
    width: 60px;
    height: 60px;
  }
  .basic-info {
    padding: 0 0 24px 70px;
  }
  .project-detail .dapp-title,
  .project-detail h2 {
    font-size: 16px;
    line-height: 24px;
  }
  .tip,
  .project-detail .dapp-shortdes,
  .project-detail .dapp-type label {
    font-size: 12px;
  }
  .project-detail .dapp-slogan {
    white-space: normal;
    font-size: 12px;
  }
  .detail-contact ul {
    display: flex;
    flex-wrap: wrap;
  }
  .detail-contact li {
    width: 50%;
    font-size: 14px;
  }
  .share-btn,.detail-contact .website{
    font-size: 14px;
    background-size: 16px;
    background-position: left 16px center;
    padding: 8px 16px 8px 40px;
  }
  .subscribe-update {
    padding: 16px;
  }
  /* .basic-info .float-left{
    width: calc(100% - 76px);
  } */
  .like-info{
    width: 64px;
    font-size: 10px;
    padding: 8px 0;
  }
  .like-info p{
    font-size: 12px;
  }
  .dev-active li{
    width: 100%;
  }
}
</style>
