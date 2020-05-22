import { Injectable } from '@angular/core';
import { Tezos, TezosToolkit, LegacyWalletProvider } from '@taquito/taquito';
import {
  OriginateParams,
  TransferParams,
} from '@taquito/taquito/dist/types/operations/types';

import { NetworkSelectService } from './components/network-select/network-select.service';
import { Network, NetworkType } from './models/network.model';
import { TezBridgeWallet } from '@taquito/tezbridge-wallet';
import { BeaconWallet } from '@taquito/beacon-wallet';

@Injectable({
  providedIn: 'root',
})
export class TaquitoService {
  private taquito: TezosToolkit = Tezos;

  constructor(private networkSelect: NetworkSelectService) {}

  public setNetwork(network: NetworkType) {
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
    this.taquito.setProvider({
      wallet: this.taquito.getFactory(LegacyWalletProvider)(),
    });
  }

  public selectTezBridgeSigner() {
    this.taquito.setProvider({
      wallet: new TezBridgeWallet(),
    });
  }

  public async selectBeaconWallet() {
    const wallet = new BeaconWallet({ name: 'test' });
    const network = this.networkSelect.selectedNetwork$.getValue();
    await wallet.requestPermissions({
      network: Network.getNetwork(network),
    });
    this.taquito.setProvider({ wallet });
  }

  public originate(contract: OriginateParams) {
    return this.taquito.wallet.originate(contract).send();
  }

  public transfer(params: TransferParams) {
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
