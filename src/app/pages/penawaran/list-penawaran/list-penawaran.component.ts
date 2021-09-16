import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormControl, FormGroup, Validators, FormArray } from '@angular/forms';
import Swal from "sweetalert2";
import { downloadUrl } from 'src/environments/environment';
import { PenawaranService } from 'src/app/services/penawaran.service';
@Component({
  selector: 'app-list-penawaran',
  templateUrl: './list-penawaran.component.html',
  styleUrls: ['./list-penawaran.component.scss']
})
export class ListPenawaranComponent implements OnInit {

  loading : boolean
  penawaranData : any

  constructor(private service : PenawaranService, private router:Router) { }

  ngOnInit(): void {
    this.fetchPenawaran()
  }
  async fetchPenawaran(){
    this.loading = true
    const res = await this.service.getPenawaran(localStorage.getItem("token")).catch(err=>{
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
          this.loading = false
          this.router.navigate(["/pages/form-penawaran"]);
        }else{
          this.loading = false
        }
      })
    })
    if(res==null){
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
          this.loading = false
          this.router.navigate(["/pages/form-invoice"]);
        }else{
          this.loading = false
          this.penawaranData = null
        }
      })
    }
    else{
      this.penawaranData = res.data
      this.loading = false
    }
  }
  deletePenawaran(no_penawaran){
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
        this.service.deletePenawaran(no_penawaran,localStorage.getItem("token")).subscribe(
        (res : any)=>{
          this.fetchPenawaran()
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
          this.fetchPenawaran()
          this.loading = false
        })
      }
    })
  }
  getPenawaran(action,no_penawaran){
    let encode = no_penawaran
    encode = encode.replace(/\//g,'_')
    window.open(downloadUrl+action+"/penawaran/"+encode, "_blank");
  }

}
