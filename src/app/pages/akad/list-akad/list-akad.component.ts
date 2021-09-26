import { Component, OnInit } from '@angular/core';
import { downloadUrl } from 'src/environments/environment';
import Swal from "sweetalert2";
import { Subject } from 'rxjs';
import { Router } from '@angular/router';
import { AkadService } from 'src/app/services/akad.service';


@Component({
  selector: 'app-list-akad',
  templateUrl: './list-akad.component.html',
  styleUrls: ['./list-akad.component.scss']
})
export class ListAkadComponent implements OnInit {
  akadData : any
  loading : boolean
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject<any>();
  constructor(private service : AkadService,private router : Router) { }

  ngOnInit(): void {
    this.dtOptions = {
      retrieve : true,
      pagingType: 'full_numbers',
      pageLength: 10,
      processing: true,
    };
    this.fetchAkad()
  }
  ngOnDestroy(): void {
    // Do not forget to unsubscribe the event
    this.dtTrigger.unsubscribe();
  }
  async fetchAkad(){
    this.loading = true
    const res = await this.service.getAkad(localStorage.getItem("token")).catch(err=>{
      Swal.fire({
        title: 'Data Kosong !',
        text: "Klik Ya untuk Membuat Akad",
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
          this.router.navigate(["/pages/form-akad"]);
        }else{
          this.dtTrigger.next()
          this.loading = false
          this.akadData = null


        }
      })
    })
    if(res.data.info_akad==''){
      Swal.fire({
        title: 'Data Kosong !',
        text: "Klik Ya untuk Membuat Akad",
        icon: "info",
        showCancelButton: true,
        confirmButtonText: `Ya`,
        denyButtonText: `tidak`,
      }).then((result) => {
        /* Read more about isConfirmed, isDenied below */
        if (result.isConfirmed) {
          this.loading = false
          this.dtTrigger.next()
          this.router.navigate(["/pages/form-akad"]);
        }else{
          this.akadData = null
          this.dtTrigger.next()
          this.loading = false
        }
      })
    }
    else{
      this.akadData = res.data
      this.dtTrigger.next()
      this.loading = false
    }
  }
  deleteAkad(no_akad){
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
        this.service.deleteAkad(no_akad,localStorage.getItem("token")).subscribe(
        (res : any)=>{
          this.fetchAkad()
          this.loading = false
          console.warn(res)
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
          this.fetchAkad()
          this.loading = false
        })
      }
    })
  }
  getAkad(action,akad){
    let encode = akad
    encode = encode.replace(/\//g,'_')
    window.open(downloadUrl+action+"/akad/"+encode, "_blank");
  }

}
