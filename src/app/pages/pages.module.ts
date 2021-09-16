import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ListInvoiceComponent } from './invoice/list-invoice/list-invoice.component';
import { FormInvoiceComponent } from './invoice/form-invoice/form-invoice.component';
import { FormPenawaranComponent } from './penawaran/form-penawaran/form-penawaran.component';
import { ListPenawaranComponent } from './penawaran/list-penawaran/list-penawaran.component';
// import { baseUrl, downloadUrl } from '../app.module';



const routes: Routes = [
  { path: 'form-invoice', component: FormInvoiceComponent },
  { path: 'list-invoice', component: ListInvoiceComponent },
  { path: 'form-invoice/edit/:invoice', component: FormInvoiceComponent },
  // { path: 'form-akad', component: AkadComponent },
  { path: 'form-penawaran', component: FormPenawaranComponent},
  { path: 'list-penawaran', component: ListPenawaranComponent},
  { path: 'form-penawaran/edit/:no_penawaran', component: FormPenawaranComponent},
]

@NgModule({
  declarations: [ListInvoiceComponent, FormInvoiceComponent, FormPenawaranComponent, ListPenawaranComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    ReactiveFormsModule,
    FormsModule,
  ]
})
export class PagesModule { }
