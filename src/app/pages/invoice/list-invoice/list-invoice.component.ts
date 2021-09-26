import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormControl, FormGroup, Validators, FormArray } from '@angular/forms';
import { InvoiceService } from 'src/app/services/invoice.service';
import Swal from "sweetalert2";
import { downloadUrl } from 'src/environments/environment';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-list-invoice',
  templateUrl: './list-invoice.component.html',
  styleUrls: ['./list-invoice.component.scss']
})
export class ListInvoiceComponent implements OnInit {
  loading : boolean
  invoiceData : any
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject<any>();
  constructor(private service : InvoiceService,private router : Router) { }

  ngOnInit(): void {
    this.dtOptions = {
      // order:[2,'desc'],
      // pageLength: 1,
      // processing: true,
      // retrieve : true,
      pagingType: 'full_numbers',
      pageLength: 10,
      processing: true,
      retrieve : true,
    };
    this.fetchInvoice()
  }

  ngOnDestroy(): void {
    // Do not forget to unsubscribe the event
    this.dtTrigger.unsubscribe();
  }

  async fetchInvoice(){
    this.loading = true
    const res = await this.service.getInvoice(localStorage.getItem("token")).catch(err=>{
      Swal.fire({
        title: 'Data Kosong !',
        text: "Klik Ya untuk Membuat Invoice",
        icon: "info",
        showCancelButton: true,
        confirmButtonText: `Ya`,
        denyButtonText: `tidak`,
      }).then((result) => {
        this.dtTrigger.next()
        /* Read more about isConfirmed, isDenied below */
        if (result.isConfirmed) {
          this.dtTrigger.next()
          this.loading = false
          this.router.navigate(["/pages/form-invoice"]);
        }else{
          this.dtTrigger.next()
          this.loading = false
          this.invoiceData = null


        }
      })
    })

    if(res.data.info_tagihan==''){
      Swal.fire({
        title: 'Data Kosong !',
        text: "Klik Ya untuk Membuat Invoice",
        icon: "info",
        showCancelButton: true,
        confirmButtonText: `Ya`,
        denyButtonText: `tidak`,
      }).then((result) => {
        /* Read more about isConfirmed, isDenied below */
        if (result.isConfirmed) {
          this.dtTrigger.next()
          this.loading = false
          this.router.navigate(["/pages/form-invoice"]);
        }else{
          this.invoiceData = null
          this.dtTrigger.next()
          this.loading = false
        }
      })
    }
    else{
      this.invoiceData = res.data
      this.dtTrigger.next()
      this.loading = false
    }
  }

  deleteInvoice(invoice){
    Swal.fire({
      title: 'Anda Yakin ?',
      text: "Data akan terhapus secara permanen",
      icon: "info",
      showCancelButton: true,
      confirmButtonText: `Ya`,
      denyButtonText: `tidak`,
    }).then((result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        this.loading = true
        this.service.deleteInvoice(invoice,localStorage.getItem("token")).subscribe(
        (res : any)=>{
          this.fetchInvoice()
          this.loading = false
          Swal.fire('File Berhasil Terhapus', '', 'success')
        },
        (Error)=>{
          console.log(Error)
          Swal.fire({
            title: "Oops!",
            text: "Ada Kesalahan! Silahkan Coba lagi",
            icon: "error",
            confirmButtonText: "Tutup",
          });
          this.fetchInvoice()
          this.loading = false
        })
      }
    })
  }
  getInvoice(action,invoice){
    let encode = invoice
    encode = encode.replace(/\//g,'-')
    window.open(downloadUrl+action+"/invoice/"+encode, "_blank");
  }

}
