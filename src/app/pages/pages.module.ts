import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ListInvoiceComponent } from './invoice/list-invoice/list-invoice.component';
import { FormInvoiceComponent } from './invoice/form-invoice/form-invoice.component';
import { FormPenawaranComponent } from './penawaran/form-penawaran/form-penawaran.component';
import { ListPenawaranComponent } from './penawaran/list-penawaran/list-penawaran.component';
import { DataTablesModule } from 'angular-datatables';
import { FormAkadComponent } from './akad/form-akad/form-akad.component';
import { ListAkadComponent } from './akad/list-akad/list-akad.component';
import { InfoPerusahaanComponent } from './info-perusahaan/info-perusahaan.component';

// import { baseUrl, downloadUrl } from '../app.module';



const routes: Routes = [
  { path: 'form-invoice', component: FormInvoiceComponent },
  { path: 'list-invoice', component: ListInvoiceComponent },
  { path: 'form-invoice/edit/:invoice', component: FormInvoiceComponent },
  // { path: 'form-akad', component: AkadComponent },
  { path: 'form-penawaran', component: FormPenawaranComponent},
  { path: 'list-penawaran', component: ListPenawaranComponent},
  { path: 'form-penawaran/edit/:no_penawaran', component: FormPenawaranComponent},
  { path: 'form-akad', component: FormAkadComponent},
  { path: 'list-akad', component: ListAkadComponent},
  { path: 'info-perusahaan', component: InfoPerusahaanComponent},
  { path: 'form-akad/edit/:no_akad', component: FormAkadComponent},

]

@NgModule({
  declarations: [ListInvoiceComponent, FormInvoiceComponent, FormPenawaranComponent, ListPenawaranComponent, FormAkadComponent, ListAkadComponent, InfoPerusahaanComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    ReactiveFormsModule,
    FormsModule,
    DataTablesModule
  ]
})
export class PagesModule { }
