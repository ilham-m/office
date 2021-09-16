import { Component, OnInit } from '@angular/core';
import { Router,ActivatedRoute  } from '@angular/router';
import { FormControl, FormGroup, Validators, FormArray } from '@angular/forms';
import { InvoiceService } from 'src/app/services/invoice.service';
import { Observable } from 'rxjs';
import Swal from "sweetalert2";
import { ArrayType } from '@angular/compiler';
import { downloadUrl } from 'src/environments/environment';
@Component({
  selector: 'app-form-invoice',
  templateUrl: './form-invoice.component.html',
  styleUrls: ['./form-invoice.component.scss']
})
export class FormInvoiceComponent implements OnInit {

  formGroup : FormGroup
  newGroup : FormGroup
  tagihan : any
  id : any = null
  tagihanData : any
  invoiceData : any
  res : any
  sub : any
  loading : boolean
  str : string
  constructor(private service : InvoiceService ,private route : ActivatedRoute,private router : Router) { }

  // NYK/INV/08 /0000
  ngOnInit(): void {
    this.sub = this.route.params.subscribe(params => {
      this.id = params['invoice'];
    });
    if (this.id==null){
      this.initData()
    }
    else{
      this.editData()
    }
  }

  async initData(){
    this.loading = true
    this.res = await this.service.getInvoice(localStorage.getItem("token")).then((res:any)=>{
      this.initForm(res,this.id)
      console.log('tambah invoice')
      this.loading = false
    },(Error)=>{
      this.initForm(null,this.id)
      console.log('tambah invoice')
      this.loading = false
    })
  }
  async editData(){
    this.loading = true
    this.res = await this.service.getOneInvoice(this.id,localStorage.getItem("token")).then((res:any)=>{
      // this.id = history.state
      this.initForm(res,this.id)
      console.log('edit invoice')
      this.loading = false
    })
  }
  editInvoice(){
    Swal.fire({
      title: 'Edit data ?',
      text: "Klik 'Ya' untuk mengedit",
      icon: "info",
      showCancelButton: true,
      confirmButtonText: `Ya`,
      denyButtonText: `tidak`,
    }).then((result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        if (this.formGroup.valid){
          this.loading = true
          this.service.editInvoice(this.formGroup.value,this.id,localStorage.getItem("token")).subscribe(res=>{
            Swal.fire({
              title: "Sukses!",
              text: "Data Berhasil tersimpan",
              icon: "success",
              confirmButtonText: "Tutup",
            });
            this.loading = false
            this.router.navigate(["/pages/list-invoice"]);
          },(Error)=>{
            Swal.fire({
              title: "Menyimpan!",
              text: "Ada Kesalahan! Silahkan Coba lagi",
              icon: "error",
              confirmButtonText: "Tutup",
            });
            this.loading = false
          })
        }else{
          Swal.fire({
            title: "Perhatian!",
            text: "Data tidak Boleh Kosong",
            icon: "info",
            confirmButtonText: "Tutup",
          });
        }
      }else{
      }
    })
  }
  storeInvoice(action){
    Swal.fire({
      title: 'Simpan data ?',
      text: "Klik 'Ya' untuk menyimpan",
      icon: "info",
      showCancelButton: true,
      confirmButtonText: `Ya`,
      denyButtonText: `tidak`,
    }).then((result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        if (this.formGroup.valid){
          this.loading = true
          this.service.storeInvoice(this.formGroup.value,localStorage.getItem("token")).subscribe(res=>{
            Swal.fire({
              title: "Sukses!",
              text: "Data Berhasil tersimpan",
              icon: "success",
              confirmButtonText: "Tutup",
            });
            if(action == null){
              this.loading = false
              this.initData();
            }
            else if(action){
              this.loading = false
              this.getInvoicePDF(action)
              this.initData();
            }

          },(Error)=>{
            Swal.fire({
              title: "Menyimpan!",
              text: "Ada Kesalahan! Silahkan Coba lagi",
              icon: "error",
              confirmButtonText: "Tutup",
            });
            this.loading = false
            console.log(Error)
          })
        }else{
          Swal.fire({
            title: "Perhatian!",
            text: "Data tidak Boleh Kosong",
            icon: "info",
            confirmButtonText: "Tutup",
          });
        }
      }else{
      }
    })
  }
  initForm(res,id){
    if(id==null){
      let invoice = this.invoiceNum(res)
      this.formGroup = new FormGroup({
        invoice : new FormControl(invoice,[Validators.required]),
        nama : new FormControl('',[Validators.required]),
        alamat : new FormControl('',[Validators.required]),
        tagihan : new FormArray([
          new FormGroup({
            deskripsi_tagihan : new FormControl('',[Validators.required]),
            tagihan : new FormControl('',[Validators.required]),
          })
        ])
      })
      return this.tagihan = this.formGroup.get('tagihan') as FormArray;
    }
    else{
      let invoice = res.data.info
      console.log(invoice)
      this.formGroup = new FormGroup({
        invoice : new FormControl(invoice.invoice,[Validators.required]),
        nama : new FormControl(invoice.nama,[Validators.required]),
        alamat : new FormControl(invoice.alamat,[Validators.required]),
        tagihan : new FormArray([])
      })
      this.tagihan = this.formGroup.get('tagihan') as FormArray;
      this.tagihanData = res.data.detail
      this.tagihanData.forEach(element => {
        this.newGroup = new FormGroup({
          deskripsi_tagihan : new FormControl(element.deskripsi_tagihan,[Validators.required]),
          tagihan : new FormControl(element.tagihan,[Validators.required]),
        })
        this.tagihan.push(this.newGroup)
      });
    }
  }
  resetForm(){
    this.id = null
  }
  addNewDesk(){
    this.newGroup = new FormGroup({
      deskripsi_tagihan : new FormControl('',[Validators.required]),
      tagihan : new FormControl('',[Validators.required]),
    })
    this.tagihan.push(this.newGroup)
  }
  removeDesk(index){
    this.tagihan.removeAt(index)
  }
  public padIntegerLeftWithZeros(rawInteger: number, numberOfDigits: number): string {
    let paddedInteger: string = rawInteger + '';
    while (paddedInteger.length < numberOfDigits) {
        paddedInteger = '0' + paddedInteger;
    }
    return paddedInteger;
  }
  invoiceNum(res){
    let invoice
    if(res==null){
      invoice = 1
    }
    else{
      invoice = res.data.latest_invoice.id
      console.log(res.data)
      invoice = invoice + 1
    }
    let month = this.month_();
    invoice = this.padIntegerLeftWithZeros(invoice,5)
    let possible = "1234567890";
    const lengthOfCode = 4;
    let uniqId = this.makeRandom(lengthOfCode, possible);
    invoice = "NYK/INV/"+uniqId+"/"+month+"/"+invoice
    return invoice
  }
  month_(){
    let date = new Date
    let M = date.getMonth()
    M = M+1
    let month  = this.padIntegerLeftWithZeros(M,2)
    return month
  }
  getInvoicePDF(action){
    let encode = this.formGroup.get('invoice').value
    console.warn(encode)
    encode = encode.replace(/\//g,'-')
    window.open(downloadUrl+action+"/invoice/"+encode, "_blank");
  }
  makeRandom(lengthOfCode: number, possible: string) {
    let text = "";
    for (let i = 0; i < lengthOfCode; i++) {
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
      return text
  }

}
