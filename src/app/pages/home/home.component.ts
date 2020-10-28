import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { map } from 'rxjs/operators';
import { NetworkSelectService } from 'src/app/components/network-select/network-select.service';
import { NetworkType } from 'src/app/models/network.model';

@Component({
  selector: 'tz-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  private contracts = {
    [NetworkType.CARTHAGENET]: [
      // TODO: Replace these examples
      '/carthagenet/KT1Ajb75sjgyntGu6SAsEQGggXF1TUJMeMFK',
      '/carthagenet/KT1CsaxmFiaBRXHXcRmzKvY8cbQeDyMU6JSU',
    ],
    [NetworkType.MAINNET]: [
      '/mainnet/KT1GgUJwMQoFayRYNwamRAYCvHBLzgorLoGo',
      '/mainnet/KT1Q1kfbvzteafLvnGz92DGvkdypXfTGfEA3',
    ],
    [NetworkType.DELPHINET]: [
      '/delphinet/KT1RWfwg7ct6J8AcGji9eEpXCEg5enMbiKKx',
      '/delphinet/KT1Nf1CPvF1FFmAan5LiRvcyukyt3Nf4Le9B',
    ],
  };

  public disableNewContractButton$ = this.networkSelect.selectedNetwork$.pipe(
    map((network) => network !== NetworkType.CARTHAGENET)
  );

  private network;

  constructor(
    private networkSelect: NetworkSelectService,
    private router: Router
  ) {}

  ngOnInit() {
    this.networkSelect.selectedNetwork$.subscribe(
      (network) => (this.network = network)
    );
  }

  onNewContract() {
    this.router.navigate(['new']).catch(console.error);
  }

  onTransfer() {
    this.router.navigate(['transfer']).catch(console.error);
  }

  onSearch(event) {
    this.router.navigate([this.network, event.contract]).catch(console.error);
  }

  onPickRandom() {
    const contracts = this.contracts[this.network];
    const i = Math.floor(Math.random() * Math.floor(contracts.length));
    this.router.navigateByUrl(contracts[i]).catch(console.error);
  }
}
