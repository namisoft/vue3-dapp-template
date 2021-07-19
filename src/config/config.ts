/**
 * Author: Vu Duy Tuan - tuanvd@gmail.com
 * Date: 7/15/21
 * Time: 09:41
 */
import { Addresses } from "@/contracts/addresses";
import { InterfaceCloner } from "@/common/class-type.ts";
import { configDev } from "@/config/config-dev.ts";
import { configProd } from "@/config/config-prod.ts";
import { configTest } from "@/config/config-test.ts";

export interface IConfig {
  networkId: string;
  contractAddresses: Addresses;
}

export interface Config extends IConfig {
}

export class Config extends InterfaceCloner<IConfig> {
  apply(mode: RunMode): void {
    let configObj: IConfig = configDev;
    if (mode === "prod") {
      configObj = configProd;
    } else if (mode === "test") {
      configObj = configTest
    }
    // Clone from configObj
    Object.assign(this, configObj);
  }
}

export type RunMode = "dev" | "test" | "prod";
