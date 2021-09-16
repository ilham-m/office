import { Component, OnInit } from '@angular/core';
import { Router,ActivatedRoute  } from '@angular/router';
import { FormControl, FormGroup, Validators, FormArray } from '@angular/forms';
import { Observable } from 'rxjs';
import Swal from "sweetalert2";
import { ArrayType } from '@angular/compiler';
import { downloadUrl } from 'src/environments/environment';
import { PenawaranService } from 'src/app/services/penawaran.service';
@Component({
  selector: 'app-form-penawaran',
  templateUrl: './form-penawaran.component.html',
  styleUrls: ['./form-penawaran.component.scss']
})
export class FormPenawaranComponent implements OnInit {
  formGroup : FormGroup
  newGroup : FormGroup
  id : any = null
  loading : boolean
  res : any
  penawaran_produk : any
  penawaranData
  constructor(private service :  PenawaranService,private route : ActivatedRoute,private router : Router) { }

  ngOnInit(): void {
     let sub =  this.route.params.subscribe(params => {
      this.id = params['no_penawaran'];
      console.log(this.id)
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
    this.res = await this.service.getPenawaran(localStorage.getItem("token")).then((res:any)=>{
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
    this.res = await this.service.getOnePenawaran(this.id,localStorage.getItem("token")).then((res:any)=>{
      // this.id = history.state
      this.initForm(res,this.id)
      console.log('edit penawaran')
      this.loading = false
    })
  }

  initForm(res,id){
    if(id==null){
      // let no_penawaran = this.no_penawaranNum(res)
      this.formGroup = new FormGroup({
        no_surat_penawaran : new FormControl('',[Validators.required]),
        nama : new FormControl('',[Validators.required]),
        ket_penawaran : new FormControl('',[Validators.required]),
        penawaran : new FormArray([
          new FormGroup({
            penawaran : new FormControl('',[Validators.required]),
            harga : new FormControl('',[Validators.required]),
          })
        ])
      })
      return this.penawaran_produk = this.formGroup.get('penawaran') as FormArray;
    }
    else{
      let penawaran = res.data.info
      console.log(penawaran)
      this.formGroup = new FormGroup({
        no_surat_penawaran : new FormControl(penawaran.no_surat_penawaran,[Validators.required]),
        nama : new FormControl(penawaran.nama,[Validators.required]),
        ket_penawaran  : new FormControl(penawaran.ket_penawaran,[Validators.required]),
        penawaran : new FormArray([])
      })
      this.penawaran_produk = this.formGroup.get('penawaran') as FormArray;
      this.penawaranData = res.data.detail
      this.penawaranData.forEach(element => {
        this.newGroup = new FormGroup({
          penawaran : new FormControl(element.penawaran,[Validators.required]),
          harga : new FormControl(element.harga,[Validators.required]),
        })
        this.penawaran_produk.push(this.newGroup)
      });
    }
  }

  storePenawaran(action){
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
          this.service.storePenawaran(this.formGroup.value,localStorage.getItem("token")).subscribe(res=>{
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
              this.getPenawaranPDF(action)
              this.initData();
            }

          },(Error)=>{
            Swal.fire({
              title: "Gagal Menyimpan!",
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
  editPenawaran(){
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
          this.service.editPenawaran(this.formGroup.value,this.id,localStorage.getItem("token")).subscribe(res=>{
            Swal.fire({
              title: "Sukses!",
              text: "Data Berhasil tersimpan",
              icon: "success",
              confirmButtonText: "Tutup",
            });
            this.loading = false
            this.router.navigate(["/pages/list-penawaran"]);
          },(Error)=>{
            Swal.fire({
              title: "Gagal Menyimpan!",
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
  addNewDesk(){
    this.newGroup = new FormGroup({
      penawaran : new FormControl('',[Validators.required]),
      harga : new FormControl('',[Validators.required]),
    })
    this.penawaran_produk.push(this.newGroup)
  }
  removeDesk(index){
    this.penawaran_produk.removeAt(index)
  }
  getPenawaranPDF(action){
    let encode = this.formGroup.get('no_surat_penawaran').value
    console.warn(encode)
    encode = encode.replace(/\//g,'_')
    window.open(downloadUrl+action+"/penawaran/"+encode, "_blank");
  }
}
