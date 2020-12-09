import { Pipe, PipeTransform } from '@angular/core';
import { TezosToolkit } from '@taquito/taquito';
import BigNumber from 'bignumber.js';

@Pipe({
  name: 'tz',
})
export class TzPipe implements PipeTransform {
  transform(amount: any, ...args: any[]): any {
    const bigNum = new BigNumber(amount);
    if (bigNum.isNaN()) {
      return amount;
    }
    const Tezos = new TezosToolkit('https://api.tez.ie/rpc/delphinet');

    return `${new BigNumber(Tezos.format('mutez', 'tz', amount)).toFixed(2)} ꜩ`;
  }
}
