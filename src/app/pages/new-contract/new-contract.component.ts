import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import {
  Contract,
  ContractAbstraction,
} from '@taquito/taquito/dist/types/contract/contract';
import { BehaviorSubject, Subject, Subscription } from 'rxjs';
import { NetworkSelectService } from 'src/app/components/network-select/network-select.service';
import { NetworkType } from 'src/app/models/network.model';

import { TaquitoService } from '../../taquito.service';

import 'brace/index';
import 'brace/theme/eclipse';
import 'brace/mode/json';

@Component({
  selector: 'tz-new-contract',
  templateUrl: './new-contract.component.html',
  styleUrls: ['./new-contract.component.scss'],
})
export class NewContractComponent implements OnInit, OnDestroy {
  private sampleCode = `parameter string;
storage string;

code {
  CAR;
  PUSH string "Hello ";
  CONCAT;
  NIL operation;
  PAIR
};
`;

  public newContract = this.fb.group({
    code: [this.sampleCode, Validators.required],
    init: ['"world"', Validators.required],
    balance: [1],
    fee: [30000],
    gasLimit: [90000],
    storageLimit: [2000],
    delegate: [''],
    delegatable: [false],
    spendable: [false],
  });

  public aceOptions = {
    printMargin: false,
    useWorker: false
  };

  public error$ = new Subject();
  public deploying$ = new BehaviorSubject<boolean>(false);

  private defaultSupportedNetwork = NetworkType.DELPHINET;
  private unsupportedNetworks = [NetworkType.MAINNET];
  private selectedNetwork;

  private subscriptions = new Subscription();

  constructor(
    private networkSelect: NetworkSelectService,
    private taquito: TaquitoService,
    private fb: FormBuilder,
    private router: Router
  ) {}

  ngOnInit() {
    this.networkSelect.disable(this.unsupportedNetworks, true);

    this.subscriptions.add(
      this.networkSelect.selectedNetwork$.subscribe((selection) => {
        this.selectedNetwork = selection;

        if (this.unsupportedNetworks.includes(selection)) {
          this.taquito.setNetwork(this.defaultSupportedNetwork);
        }
      })
    );

    this.subscriptions.add(
      this.deploying$.subscribe((deploying) => {
        deploying ? this.newContract.disable() : this.newContract.enable();
      })
    );
  }

  ngOnDestroy() {
    this.networkSelect.disable(this.unsupportedNetworks, false);
    this.subscriptions.unsubscribe();
  }

  navigateTo(contract: ContractAbstraction<any>) {
    this.deploying$.next(false);
    this.error$.next(null);

    this.router
      .navigate([this.selectedNetwork, contract.address])
      .catch((error) => console.log(error));
  }

  displayError(error) {
    console.error(error);

    this.deploying$.next(false);
    this.error$.next(
      error.body && error.body.length !== 0
        ? error.body
        : 'Unable to fulfill the request.'
    );
  }

  onDeploy() {
    this.deploying$.next(true);

    this.taquito
      .originate(this.newContract.value)
      .then((op) => op.contract())
      .then((contract) => this.navigateTo(contract))
      .catch((error) => this.displayError(error));
  }
}
