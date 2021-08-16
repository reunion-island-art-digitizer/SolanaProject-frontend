import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import axios from "axios";
import lodash from 'lodash'
import Toast from "./components/Toast";
import Loading from "./components/Loading";
import LoginModal from "./components/LoginModal";
import VueClipboard from "vue-clipboard2";
import ba from "vue-ba";
import webUtil from "./assets/js/util";
import BigNumber from 'bignumber.js'
import "./assets/css/index.css";

Vue.config.productionTip = false;
Vue.use(VueClipboard);
Vue.use(Toast);
Vue.use(Loading);
Vue.use(LoginModal);

// 百度统计
Vue.use(ba, "db992b5b0ee194da97a5cc3936643e2b");
Vue.use(ba, { siteId: "db992b5b0ee194da97a5cc3936643e2b" });

import { mapGetters, mapActions } from "vuex";
Vue.mixin({
  data() {
    return {
      lodash:lodash,
      mainColor:'#00be94',
      mainDarkColor:'#1b1c36',
      webUtil: webUtil,
      BigNumber: BigNumber,
      axios: axios,
      marketDomain: "https://market.maiziqianbao.net/",
      domain: process.env.NODE_ENV === "production" ? "https://api.staked.xyz/apiSolana/" : "/api/",
      contact: [
        "website",
        "email",
        "twitter",
        "telegram",
        "github",
        "coinmarketcap",
        "discord",
        "medium"
      ],
      sidebar:{
        Home:"Home",
        // Index:"Index",
        Rank:"Rank",
        RPCServer:"RPC Server",
      },
    };
  },
  computed: {
    ...mapGetters({
      account: "account",
      accountList: "accountList",
      category: "category",
      screenWidth: "screenWidth",
      selectedCategory: "selectedCategory",
    }),
  },
  methods: {
    ...mapActions(["setAccount","setAccountList","setSelectedCategory"]),
    logoError(e){
      let img = e.srcElement;
      img.src = require('@/assets/img/icon/default.png');
      img.style.boxShadow = 'none';
      img.onerror = null; //防止闪图
    },
    // 复制
    copyAction(val = window.location.href) {
      this.$copyText(val).then(
        () => {
          this.$toast("Successfully copied");
        },
        () => {
          this.$toast("Copy failed");
        }
      );
    },
    openLink(link, type) {
      if (type == "email") {
        window.location.href = "mailto:" + link;
      } else {
        window.open(link, "_blank");
      }
    },
    cateTitleByID(project) {
      if (this.category.length > 1) {
        let category = this.category.filter((v) => v.ID == project.cateID)[0];
        return category ? category.title : null;
      }
      return null;
    },
  },
});

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount("#app");
