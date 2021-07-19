<template>
  <el-container style="height: 100vh; border: 1px solid #eee">
    <el-header>
      <el-row :gutter="20">
        <el-col :span="8">
          <div class="grid-content" style="text-align: left">
            <img
              style="width: auto; height: auto; vertical-align: middle"
              src="https://img.icons8.com/color/48/26e07f/christmas-penguin.png"
            />
            <span
              style="
                font-size: 18px;
                font-weight: bold;
                font-family: 'Helvetica, sans-serif';
                margin-left: 10px;
              "
            >
              Your awesome app
            </span>
          </div>
        </el-col>
        <el-col :span="16">
          <div
            v-if="connectedAcc"
            class="grid-content"
            style="text-align: right"
          >
            <el-tag type="success">{{ connectedAcc }}</el-tag>
            <el-tag type="info">{{ balance }} ETH</el-tag>
          </div>
          <div v-else class="grid-content" style="text-align: right">
            <el-button type="danger" round @click="connectMM"
              >Connect</el-button
            >
          </div>
        </el-col>
      </el-row>
    </el-header>
    <el-container>
      <el-aside
        width="200px"
        style="background-color: rgb(238, 241, 246); text-align: left"
      >
        <el-menu :default-openeds="['1', '2']" router="true">
          <el-menu-item index="/">
            <i class="el-icon-s-home"></i>
            <span>Home</span>
          </el-menu-item>
          <el-submenu index="1">
            <template #title
              ><i class="el-icon-takeaway-box"></i>Sub Menu</template
            >
            <el-menu-item index="1-2">Option 1</el-menu-item>
            <el-menu-item index="1-3">Option 2</el-menu-item>
          </el-submenu>
          <el-menu-item index="/about">
            <i class="el-icon-info"></i>
            <span>About</span>
          </el-menu-item>
        </el-menu>
      </el-aside>
      <el-container>
        <el-main>
          <router-view />
        </el-main>
        <el-footer>Copyright&copy; 2021</el-footer>
      </el-container>
    </el-container>
  </el-container>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { singleton } from "@/common/singleton.ts";
import { EthClient } from "@/services/eth-client.ts";
import { Config } from "@/config/config";

export default defineComponent({
  name: "App",
  data() {
    return {
      connectedAcc: null,
      balance: 0.0,
    };
  },
  methods: {
    async connectMM() {
      const config: Config = singleton.get(Config);
      const ethClient: EthClient = singleton.get(EthClient);
      const ret = await ethClient.connect(
        config.networkId,
        (newAcc) => {
        this.updateUI(newAcc);
      });
      if (!ret.success) {
        this.$alert(`Connect failed: ${JSON.stringify(ret.error)}`, "Error", {
          confirmButtonText: "OK",
          type: "error",
        });
      }
      // Update page displaying
      this.updateUI(ethClient.web3.defaultAccount).then();
    },
    async updateUI(connectedAcc: string) {
      const ethClient: EthClient = singleton.get(EthClient);
      const web3 = ethClient.web3;
      this.connectedAcc = connectedAcc;
      const balInWei = await web3.eth.getBalance(connectedAcc);
      this.balance = Number(web3.utils.fromWei(balInWei, "ether")).toFixed(3);
    },
  },
});
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

body {
  margin: 0;
}

#nav a {
  font-weight: bold;
  color: #2c3e50;
}

#nav a.router-link-exact-active {
  color: #42b983;
}

.el-header,
.el-footer {
  background-color: #d9d9d9;
  color: #333;
  text-align: center;
  line-height: 60px;
  height: 30px;
}

.el-aside {
  background-color: #d3dce6;
  color: #333;
  text-align: center;
  line-height: 200px;
}

.el-main {
  background-color: #e9eef3;
  color: #333;
  text-align: center;
  min-height: 360px;
}

body > .el-container {
  margin-bottom: 40px;
}

.el-container:nth-child(5) .el-aside,
.el-container:nth-child(6) .el-aside {
  line-height: 260px;
}

el-container:nth-child(7) .el-aside {
  line-height: 320px;
}
</style>
