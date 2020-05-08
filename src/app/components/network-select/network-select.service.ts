import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Network, NetworkType } from 'src/app/models/network.model';

@Injectable({
  providedIn: 'root',
})
export class NetworkSelectService {
  public networkOptions$ = new BehaviorSubject([]);
  public selectedNetwork$ = new BehaviorSubject<NetworkType>(null);

  constructor() {
    this.networkOptions$.next(
      Network.values().map((network) => ({
        network: network,
        disabled: false,
      }))
    );
  }

  select(network: NetworkType) {
    this.selectedNetwork$.next(network);
  }

  disable(networks: NetworkType[], disable: boolean) {
    this.networkOptions$.next(
      this.networkOptions$.value.map((option) =>
        networks.includes(option.network)
          ? { ...option, disabled: disable }
          : option
      )
    );
  }
}
