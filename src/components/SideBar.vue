<template>
  <section :class="['sidebar-container', { heightAll: isSideShow }]">
    <nav>
      <div class="float-right">
        <img
          :src="
            require('@/assets/img/icon/' +
              (isSideShow ? 'upward.png' : 'menu.png'))
          "
          width="24"
          @click="toggleSidebar(!isSideShow)"
        />
      </div>
      <span>{{
        selectedTab.includes("Project") ? selectedCategory.title : selectedTab
      }}</span>
    </nav>
    <article class="sidebar" v-show="isSideShow">
      <div class="logo hidden-xs">
        <img src="@/assets/img/icon/logo.png" height="40" />
      </div>
      <div class="scroll-content">
        <ul class="tabs">
          <li
            v-for="(item,type) in sidebar"
            :key="type"
            :class="{ active: selectedTab == type && !isMobile }"
            @click="goRoute(type)"
          >
            <img :src="require('@/assets/img/sidebar/'+type+'.png')" width="24" />
            <span>{{item}}</span>
          </li>
        </ul>
        <div class="flex-between category-title">
          <p class="text-white">Project</p>
          <router-link to="/submit" class="submit text-white"
            >+ Submit Project</router-link
          >
        </div>
        <ul class="blockchain">
          <li
            v-for="item in category"
            :key="item.ID"
            @click="switchCategory(item)"
            :class="{
              active:
                selectedCategory.ID == item.ID &&
                !isMobile &&
                selectedTab.includes('Project'),
            }"
          >
            {{ item.title }} <span>{{ item.count }}</span>
          </li>
        </ul>
      </div>
      <div class="fixed-bottom">
        <!-- <div class="dropdown">
          <button v-if="!account" class="border-btn" @click="login">
            Login
          </button>
          <a
            v-else
            :class="['border-btn', { open: accountDropdownShow }]"
            @click="accountDropdownShow = !accountDropdownShow"
          >
            <span>{{ webUtil.formatStrByDot(account.address) }}</span>
            <img src="@/assets/img/icon/downward_white.png" width="16" />
          </a>
          <a
            href="javascript:;"
            class="dropdown-menu"
            v-show="accountDropdownShow"
            @click="logoutAction"
          >
            Logout
          </a>
        </div> -->
        <p></p>
        <p class="foot-contact">
          <!-- <a href="javascript:;">
            <img src="@/assets/img/icon/wechat.png" width="20"/>
            <img class="qrcode" src="@/assets/img/sidebar/weixin.jpg" width="140"/>
          </a> -->
          <a href="https://twitter.com/SolanaProject" target="_blank" rel="noreferror"
            ><img src="@/assets/img/icon/twitter.png" width="20"
          /></a>
        </p>
      </div>
    </article>
  </section>
</template>

<script>
import { mapActions } from "vuex";
export default {
  data() {
    return {
      isMobile: false, //是否为移动端
      isSideShow: false, //侧边栏是否显示
      accountDropdownShow: false, //账号下拉框是否显示
      selectedTab: "Home",
    };
  },
  created() {
    this.getCategory();
    // 侧边栏显示与否
    this.toggleSidebar();
    this.debouncedToggleSidebar = this.lodash.debounce(this.toggleSidebar, 200);
    // 在麦子钱包中打开自动登录
    // if (this.webUtil.browserVersions().mdsApp) {
    //   this.login();
    // }
  },
  mounted() {
    window.onresize = () => {
      this.debouncedToggleSidebar();
      this.setScreenWidth(window.innerWidth);
    };
  },
  methods: {
    ...mapActions(["setCategory", "logout","setScreenWidth"]),
    toggleSidebar(n = 0) {
      if (window.innerWidth <= 768) {
        this.isMobile = true;
        if (n == 1) {
          this.isSideShow = true;
        } else {
          this.isSideShow = false;
        }
      } else {
        this.isMobile = false;
        this.isSideShow = true;
      }
    },
    goRoute(item) {
      this.toggleSidebar();
      this.selectedTab = item;
      this.$router.push({ name: item });
    },
    //切换链
    switchCategory(item) {
      this.setSelectedCategory(item);
      this.selectedTab = "Projects";
      this.$router.push('/projects?cateID='+item.ID+'&tagID=0')
      this.toggleSidebar();
    },
    getCategory() {
      this.axios.get(this.domain + "getCategory").then((res) => {
        if (res.data.success) {
          let category = [
            {
              ID: 0,
              title: "All",
              count: "",
            },
          ];

          category[0].count = res.data.data.category.reduce((sum, v) => {
            sum += v.count;
            return sum;
          }, 0);

          category = category
            .concat(res.data.data.category)
            .sort(function (a, b) {
              return a.ID - b.ID;
            });

          this.setCategory(category);
        } else {
          console.log(res.data.data.message);
        }
      });
    },
    // logoutAction() {
    //   this.logout();
    //   this.accountDropdownShow = false;
    // },
  },
  watch:{
    $route(to){
      if(to.path!='/submit'){
        this.selectedTab = to.name
      }
    }
  }
};
</script>
<style scoped>
/*侧边导航*/
.sidebar-container {
  width: 320px;
  float: left;
}
nav {
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  height: 48px;
  padding: 12px 16px;
  font: bold 16px/24px Rubik-Medium;
  background: var(--mainDarkColor);
  z-index: 1100;
  display: none;
  color:#fff;
}
.sidebar {
  background: var(--mainDarkColor);
  height: 100%;
  overflow: hidden;
  position: relative;
  z-index: 1010;
  color: var(--whiteOp);
  user-select: none;
}
.sidebar a {
  color: var(--whiteOp);
}
.sidebar .logo {
  padding: 17px 24px;
}
.scroll-content {
  height: calc(100% - 134px);
  overflow-y: auto;
  overflow-x: hidden;
}
.scroll-content li {
  padding: 12px 24px;
  font: bold 18px/24px Rubik-Medium;
  cursor: pointer;
}
.scroll-content li img {
  margin-right: 12px;
  opacity: 0.6;
}
.scroll-content li.active {
  background: var(--blackOp);
  position: relative;
  color: #fff;
}
.scroll-content li.active img{
  opacity: 1;
}
.category-title {
  font: bold 14px/16px Rubik-Medium;
  padding: 36px 24px 24px;
  border-top: 1px solid rgba(255, 255, 255, 0.3);
  margin-top: 24px;
}
.blockchain li {
  padding: 12px 24px 12px 60px;
}
.blockchain li span {
  font-size: 14px;
  margin-left: 4px;
  vertical-align: baseline;
}
.blockchain li.active:before {
  content: "";
  position: absolute;
  left: 24px;
  top: 20px;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #fff;
}

/*滚动条样式*/

.scroll-content::-webkit-scrollbar {
  width: 6px;
}

.scroll-content::-webkit-scrollbar-thumb {
  border-radius: 6px;
  background: var(--whiteOp);
}

.fixed-bottom {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  padding: 12px 24px 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.fixed-bottom a {
  display: inline-block;
}
.border-btn {
  font: bold 16px/16px Rubik-Medium;
  color: var(--whiteOp);
  border: 1px solid var(--whiteOp);
  border-radius: 16px;
  padding: 8px 16px;
  cursor: pointer;
}
.fixed-bottom img {
  margin-left: 16px;
}
.dropdown {
  position: relative;
}
.dropdown img {
  margin-left: 4px;
}
.open img {
  transform: rotate(180deg);
}

.dropdown .dropdown-menu {
  position: absolute;
  right: 0;
  left: 0;
  bottom: 46px;
  background: #fff;
  color: #000;
  border-radius: 16px;
  padding: 8px 0;
  z-index: 200;
  text-align: center;
  max-width: 204px;
  margin: 0 auto;
  font: 700 16px/1.5 Rubik-Medium;
}
.foot-contact a{
  position: relative;
}
.foot-contact img{
  opacity: 0.6;
}
.foot-contact .qrcode{
  position: absolute;
  right: 0;
  bottom: 24px;
  display: none;
  opacity: 1;
}
.foot-contact a:hover img{
  opacity: 1;
}
.foot-contact a:hover{
  color: #fff;
}
.foot-contact a:hover .qrcode{
  display: block;
}
@media (max-width: 768px) {
  nav {
    display: block;
  }
  nav:after,
  .category-title:after {
    content: "";
    position: absolute;
    z-index: 100;
    bottom: 0;
    left: 16px;
    right: 16px;
    border-bottom: 0.5px solid rgba(255, 255, 255, 0.5);
  }
  .category-title:after {
    top: 0;
    bottom: auto;
  }
  .sidebar-container {
    width: 100vw;
  }
  .scroll-content {
    height: calc(100% - 76px);
    overflow: auto;
  }
  .scroll-content li {
    font-size: 16px;
    line-height: 20px;
    color: rgba(255, 255, 255, 0.7);
  }
  .sidebar,.sidebar a {
    color: rgba(255, 255, 255, 0.7);
  }
  .category-title {
    padding: 24px 16px 12px;
    border: none;
    position: relative;
  }
  .tabs li {
    padding: 12px 16px;
  }
  .blockchain li {
    padding-left: 52px;
  }
  .login-container {
    left: 0;
    padding: 16px;
  }
  .fixed-bottom {
    padding: 12px 16px 34px;
  }
  .fixed-bottom a{
    color: #fff;
  }
}
</style>
