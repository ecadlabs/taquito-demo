import { Injectable } from '@angular/core';
import { Tezos, TezosToolkit, Wallet, LegacyWalletProvider } from '@taquito/taquito';
import { OriginateParams, TransferParams } from '@taquito/taquito/dist/types/operations/types';

import { NetworkSelectService } from './components/network-select/network-select.service';
import { Network } from './models/network.model';
import { TezBridgeWallet } from '@taquito/tezbridge-wallet'
import { BeaconWallet } from '@taquito/beacon-wallet';

@Injectable({
  providedIn: 'root',
})
export class TaquitoService {
  private taquito: TezosToolkit = Tezos;

  constructor(private networkSelect: NetworkSelectService) { }

  public setNetwork(network: Network) {
    this.networkSelect.select(network);
    this.taquito.setProvider({ rpc: Network.getUrl(network) });
  }

  public async importFaucetKey(key: any) {
    const email = key.email;
    const password = key.password;
    const mnemonic = key.mnemonic.join(' ');
    const secret = key.secret;

    await this.taquito.importKey(email, password, mnemonic, secret);
    // Reset the default wallet
    this.taquito.setProvider({ wallet: this.taquito.getFactory(LegacyWalletProvider)() })
  }

  public selectTezBridgeSigner() {
    this.taquito.setProvider({ rpc: this.taquito.rpc, wallet: new TezBridgeWallet() });
  }

  public async selectBeaconWallet() {
    const wallet = new BeaconWallet('test')
    await wallet.requestPermissions()
    this.taquito.setProvider({ rpc: this.taquito.rpc, wallet });
  }

  public originate(contract: OriginateParams) {
    return this.taquito.wallet.originate(contract).send();
  }

  public transfer(params: TransferParams) {
    console.log(params)
    return this.taquito.wallet.transfer(params).send();
  }

  public async getContract(address: string) {
    const contract = await this.taquito.contract.at(address);

    return {
      account: await this.taquito.rpc.getContract(address),
      storage: await contract.storage(),
      script: contract.script,
    };
  }
}
