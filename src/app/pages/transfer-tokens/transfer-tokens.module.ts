import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TransferTokensComponent } from './transfer-tokens.component';
import { NbCardModule, NbInputModule, NbButtonModule } from '@nebular/theme';
import { ReactiveFormsModule } from '@angular/forms';
import { SignerSelectModule } from '../../components/signer-select/signer-select.module';
import { MatProgressBarModule } from '@angular/material';



@NgModule({
  declarations: [TransferTokensComponent],
  imports: [
    CommonModule,
    NbCardModule,
    ReactiveFormsModule,
    NbInputModule,
    NbButtonModule,
    SignerSelectModule,
    MatProgressBarModule
  ],
  exports: [TransferTokensComponent]
})
export class TransferTokensModule { }
