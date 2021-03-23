<template>
  <div id="app">
    <SideBar v-if="hasSidebar"/>
    <router-view />
  </div>
</template>
<script>
import SideBar from "./components/SideBar";
export default {
  components: { SideBar },
  data(){
    return {
      hasSidebar:true,
    }
  },
  created(){
    this.$router.afterEach(item => {
      if(item.name=='Submit'){
        this.hasSidebar = false;
      }else{
        this.hasSidebar = true;
      }
    })
  },
};
</script>
