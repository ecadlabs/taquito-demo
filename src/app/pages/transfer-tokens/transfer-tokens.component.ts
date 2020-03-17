import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { TaquitoService } from 'src/app/taquito.service';
import { ReplaySubject } from 'rxjs';
import { TransactionWalletOperation } from '@taquito/taquito';
import { switchMap, map, startWith } from 'rxjs/operators';

@Component({
  selector: 'tz-transfer-tokens',
  templateUrl: './transfer-tokens.component.html',
  styleUrls: ['./transfer-tokens.component.scss']
})
export class TransferTokensComponent implements OnInit {

  public operation$ = new ReplaySubject<TransactionWalletOperation>(1);

  public operationHash$ = this.operation$.pipe(map((op) => {
    return op.opHash;
  }))

  public confirmation$ = this.operation$.pipe(switchMap((op) => {
    return op.confirmationObservable(3).pipe(startWith({
      currentConfirmation: 0,
      expectedConfirmation: 3,
      isInCurrentBranch: async () => true,
    }));
  }))

  public confirmationState$ = this.confirmation$.pipe(map((conf) => {
    if (conf.currentConfirmation === 0) {
      return 'Waiting for inclusion...'
    } else if (conf.currentConfirmation === conf.expectedConfirmation) {
      return 'Confirmed!'
    } else {
      return 'Awaiting confirmation...'
    }
  }))

  public isInCurrentBranch$ = this.confirmation$.pipe(switchMap((confirmation) => {
    return confirmation.isInCurrentBranch()
  }))

  public receipt$ = this.operation$.pipe(
    switchMap((op) => op.receipt()),
    map((receipt) => {
      return {
        storageBurn: receipt.totalStorageBurn.multipliedBy(1000).toString(),
        consumedGas: receipt.totalGas.toString(),
        fee: receipt.totalFee.toString()
      }
    }))


  public transferForm = this.fb.group({
    amount: [1, Validators.required],
    mutez: [true],
    to: ['']
  });

  constructor(
    private fb: FormBuilder,
    private taquito: TaquitoService
  ) { }

  ngOnInit() {
  }

  async onTransfer() {
    const op = await this.taquito.transfer(this.transferForm.value);
    this.operation$.next(op);
  }

}
