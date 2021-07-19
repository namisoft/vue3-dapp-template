/**
 * Author: Vu Duy Tuan - tuanvd@gmail.com
 * Date: 7/14/21
 * Time: 16:47
 */
import Web3 from "web3";

export class EthClient {
  readonly web3: Web3;

  constructor() {
    this.web3 = new Web3();
  }

  /*
   * Connect to browser wallet
   * @chainId: must be in decimal number literal (eg. "0xa86a")
   */
  async connect(chainId: string,
                onAccChanged?: (newAcc: string) => void,
                onNetworkChanged?: (newNetworkId: string) => void): Promise<{ success: boolean; error?: any }> {
    const ethereum = (window as any).ethereum;
    if (!ethereum) {
      // wallet extension not installed yet
      return { success: false, error: "MetamaskRequired" };
    }
    // Remove all listener if any
    ethereum.removeAllListeners();

    if (ethereum.chainId !== chainId) {
      // Wrong chain: request to chain switching
      const rSwitch = await ethereum
        .request({
          method: "wallet_switchEthereumChain",
          params: [{ chainId: chainId }]
        })
        .then(() => ({ success: true }))
        .catch((err: any) => ({ success: false, error: err }));
      if (!rSwitch.success) {
        // Switch network failed
        return rSwitch;
      }
    }
    const accounts: string[] = await ethereum.request({
      method: "eth_requestAccounts"
    });
    if (!accounts || accounts.length === 0) {
      return { success: false, error: "AccountNotConnected" };
    }
    this.web3.setProvider(ethereum);
    this.web3.defaultAccount = accounts[0];

    // Handle accounts changed event
    this.web3.givenProvider.on("accountsChanged", (accounts: string[]) => {
      if (accounts.length > 0) {
        // Set default acc to new one
        this.web3.defaultAccount = accounts[0];
        if (onAccChanged) {
          onAccChanged(accounts[0]);
        }
      }
    });

    // Handle chain changed event
    ethereum.on("chainChanged", (newChainId: string) => {
      if (newChainId !== chainId) {
        window.location.reload();
        if (onNetworkChanged) {
          onNetworkChanged(newChainId);
        }
      }
    });

    return { success: true };
  }
}
