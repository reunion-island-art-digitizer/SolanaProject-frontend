<template>
  <section>
    <main class="container">
      <h2 class="title">RPC Server</h2>
      <ul class="mb-80" v-if="links && links.length > 0">
        <li class="flex-between-center" v-for="(item, i) in links" :key="i">
          <p>{{ item.url }}</p>
          <div class="flex-between-center">
            <p v-if="item.speed > 0" class="max-width">
              <i :class="getSpeedType(item.speed)">{{ item.speed }} ms </i>
              <span>Height {{ item.height }}</span>
            </p>
            <p v-else-if="item.speed < 0" class="max-width">
              <i class="text-error red">Error</i>
            </p>
            <p v-else>Loading...</p>
            <a class="btn" href="javascript:;" @click="copyAction(item.url)"
              >Copy</a
            >
          </div>
        </li>
      </ul>
      <div class="null" v-else>No Information</div>
    </main>
  </section>
</template>
<script>
export default {
  data() {
    return {
      links: [
        {
          url: "https://solana-api.projectserum.com",
          speed: 0,
        },
        {
          url: "https://api.mainnet-beta.solana.com",
          speed: 0,
        },
      ],
    };
  },
  created() {
    this.links &&
      this.links.length > 0 &&
      this.links.map((item) => {
        this.getBlock(item);
      });
  },
  methods: {
    getBlock(item) {
      let time = Date.now();
      this.axios
        .post(item.url, { jsonrpc: "2.0", id: 1, method: "getEpochInfo" })
        .then((res) => {
            let speed = Date.now() - time;
            if (res && res.data && res.data.result) {
              this.$set(item, "height", res.data.result.blockHeight - 0);
              this.$set(item, "speed", speed);
            } else {
              this.$set(item, "speed", -1);
            }
        })
        .catch(() => this.$set(item, "speed", -1));
    },
    getSpeedType(num) {
      if (num > 2000 || num <= 0) {
        return "red";
      } else if (num > 501) {
        return "orange";
      }
    },
  },
};
</script>
<style scoped>
.mb-80 {
  margin-bottom: 80px;
}
li {
  padding: 16px 0;
  font-size: 16px;
  line-height: 1.5;
}
li > p {
  word-break: break-all;
  padding-right: 16px;
}
li i {
  display: block;
  padding-right: 16px;
  position: relative;
  white-space: nowrap;
}
li i:after {
  content: "";
  position: absolute;
  right: 0;
  top: 8px;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #4cd964;
}
li .orange:after {
  background: #ffcc00;
}
li .red:after {
  background: #ff3b30;
}
li span {
  font-size: 12px;
  line-height: 16px;
  color: var(--greyColor);
  display: block;
  word-break: break-all;
}
li a {
  margin-left: 48px;
}
.max-width {
  width: 180px;
  text-align: right;
}
.text-underline {
  display: block;
  font-size: 16px;
  line-height: 1.5;
  padding-top: 24px;
  color: #000;
}
@media (max-width: 786px) {
  .mb-80 {
    margin-bottom: 40px;
  }
  li {
    font-size: 14px;
  }
  .max-width {
    width: 100px;
  }
  li a {
    margin-left: 16px;
    font-size: 14px;
  }
  li i {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    padding-right: 12px;
  }
  li span {
    font-size: 12px;
  }
}
</style>