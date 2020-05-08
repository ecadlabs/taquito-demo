import { Component, OnInit } from '@angular/core';

import { NetworkType } from './models/network.model';
import { TaquitoService } from './taquito.service';

@Component({
  selector: 'tz-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  title = 'Taquito Demo';

  public network = NetworkType.CARTHAGENET;

  constructor(private taquito: TaquitoService) {}

  ngOnInit() {
    this.taquito.setNetwork(this.network);
  }
}
