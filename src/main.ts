import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import { singleton } from "@/common/singleton.ts";
import { Config, RunMode } from "@/config/config.ts";

import ElementPlus from "element-plus";
import "element-plus/lib/theme-chalk/index.css";

(async () => {
  // Applying config
  const rConfig = await fetch(process.env.BASE_URL + "env.json");
  const env: { mode: RunMode } = await rConfig.json();
  const config = singleton.get(Config);
  config.apply(env.mode);

  // Create main App
  const app = createApp(App);
  app.use(router);
  app.use(ElementPlus);
  app.mount("#app");
})();
