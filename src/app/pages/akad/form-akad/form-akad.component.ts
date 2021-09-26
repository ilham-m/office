import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators, FormArray } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AkadService } from 'src/app/services/akad.service';
import { downloadUrl } from 'src/environments/environment';
import Swal from "sweetalert2";


@Component({
  selector: 'app-form-akad',
  templateUrl: './form-akad.component.html',
  styleUrls: ['./form-akad.component.scss']
})
export class FormAkadComponent implements OnInit {
  formGroup : FormGroup
  newGroup : FormGroup
  sub : any
  id : any
  loading: boolean;
  res: any;
  objek_perjanjian : any
  kewajiban_1 : any
  kewajiban_2 : any
  obj : number = 0
  kew1 : number = 0
  kew2 : number = 0
  akad_data : any

  constructor(private route : ActivatedRoute,private router : Router, private service : AkadService) { }

  ngOnInit(): void {
    this.sub = this.route.params.subscribe(params => {
      this.id = params['no_akad'];
    });
    if (this.id==null){
      this.initData()
    }
    else{
      this.editData()
    }
  }

  storeAkad(action){
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
          this.service.storeAkad(this.formGroup.value,localStorage.getItem("token")).subscribe(res=>{
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
              this.getAkadPDF(action)
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

  editAkad(){
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
          this.service.editAkad(this.formGroup.value,this.id,localStorage.getItem("token")).subscribe(res=>{
            Swal.fire({
              title: "Sukses!",
              text: "Data Berhasil tersimpan",
              icon: "success",
              confirmButtonText: "Tutup",
            });
            this.loading = false
            this.router.navigate(["/pages/list-akad"]);
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

  async initData(){
    this.loading = true
    this.res = await this.service.getAkad(localStorage.getItem("token")).then((res:any)=>{
      this.initForm(res,this.id)
      console.log('tambah invoice')
      this.loading = false
    },(Error)=>{
      this.initForm('',this.id)
      console.log('tambah invoice')
      this.loading = false
    })
  }

  async editData(){
    this.loading = true
    this.res = await this.service.getOneAkad(this.id,localStorage.getItem("token")).then((res:any)=>{
      // this.id = history.state
      this.obj = res.data.objek_perjanjian.length - 1
      this.initForm(res,this.id)
      console.log('edit invoice')
      this.loading = false
    })
  }

  initForm(res,id){
    if(id==null){
      // let invoice = this.invoiceNum(res)
      this.formGroup = new FormGroup({
        nomor_akad : new FormControl('',[Validators.required]),
        nama : new FormControl('',[Validators.required]),
        nik : new FormControl('',[Validators.required]),
        alamat : new FormControl('',[Validators.required]),
        nama_2 : new FormControl('',[Validators.required]),
        nik_2 : new FormControl('',[Validators.required]),
        alamat_2 : new FormControl('',[Validators.required]),
        ket : new FormControl('',[Validators.required]),
        perjanjian : new FormControl('',[Validators.required]),
        jangka_waktu : new FormControl('',[Validators.required]),
        nominal_jasa : new FormControl('',[Validators.required]),
        objek : new FormArray([
          new FormGroup({
            objek_perjanjian : new FormControl('',[Validators.required]),
            subjek_perjanjian : new FormControl('',[Validators.required]),
            ket_objek : new FormControl('',[Validators.required]),
          })
        ]),
        kewajiban_1 : new FormArray([
          new FormGroup({
            kewajiban : new FormControl('',[Validators.required]),
          })
        ]),
        kewajiban_2 : new FormArray([
          new FormGroup({
            kewajiban : new FormControl('',[Validators.required]),
          })
        ])

      })
      this.objek_perjanjian = this.formGroup.get('objek') as FormArray;
      this.kewajiban_1 = this.formGroup.get('kewajiban_1') as FormArray;
      this.kewajiban_2 = this.formGroup.get('kewajiban_2') as FormArray
    }
    else{
      let data = res.data.akad_info
      this.formGroup = new FormGroup({
        nomor_akad : new FormControl(data.nomor_akad,[Validators.required]),
        nama : new FormControl(data.nama,[Validators.required]),
        nik : new FormControl(data.nik,[Validators.required]),
        alamat : new FormControl(data.alamat,[Validators.required]),
        nama_2 : new FormControl(data.nama_2,[Validators.required]),
        nik_2 : new FormControl(data.nik_2,[Validators.required]),
        alamat_2 : new FormControl(data.alamat_2,[Validators.required]),
        ket : new FormControl(data.ket,[Validators.required]),
        perjanjian : new FormControl(data.perjanjian,[Validators.required]),
        jangka_waktu : new FormControl(data.jangka_waktu,[Validators.required]),
        nominal_jasa : new FormControl(data.nominal_jasa,[Validators.required]),
        objek : new FormArray([]),
        kewajiban_1 : new FormArray([]),
        kewajiban_2 : new FormArray([])
      })
      this.objek_perjanjian = this.formGroup.get('objek') as FormArray;
      this.kewajiban_1 = this.formGroup.get('kewajiban_1') as FormArray;
      this.kewajiban_2 = this.formGroup.get('kewajiban_2') as FormArray
      this.akad_data = res.data.objek_perjanjian
      this.akad_data.forEach(element => {
        this.newGroup = new FormGroup({
          objek_perjanjian : new FormControl(element.objek_perjanjian,[Validators.required]),
          subjek_perjanjian : new FormControl(element.subjek_perjanjian,[Validators.required]),
          ket_objek : new FormControl(element.ket_objek,[Validators.required]),
        })
        this.objek_perjanjian.push(this.newGroup)
      });
      let kewajiban1 = res.data.kewajiban_pihak_pertama
      kewajiban1.forEach(element => {
        this.newGroup = new FormGroup({
          kewajiban : new FormControl(element.kewajiban,[Validators.required]),
        })
        this.kewajiban_1.push(this.newGroup)
      });
      let kewajiban2 = res.data.kewajiban_pihak_kedua
      kewajiban2.forEach(element => {
        this.newGroup = new FormGroup({
          kewajiban : new FormControl(element.kewajiban,[Validators.required]),
        })
        this.kewajiban_2.push(this.newGroup)
      });
    }
  }

  addObj(){
    this.newGroup = new FormGroup({
      objek_perjanjian : new FormControl('',[Validators.required]),
      subjek_perjanjian : new FormControl('',[Validators.required]),
      ket_objek : new FormControl('',[Validators.required]),
    })
    this.obj++
    this.objek_perjanjian.push(this.newGroup)

  }
  addSub(){
    this.newGroup = new FormGroup({
      objek_perjanjian : new FormControl(this.objek_perjanjian.value[this.obj]['objek_perjanjian'],[Validators.required]),
      subjek_perjanjian : new FormControl('',[Validators.required]),
      ket_objek : new FormControl('',[Validators.required]),
    })
    this.obj++
    this.objek_perjanjian.push(this.newGroup)

  }
  addKet(){
    this.newGroup = new FormGroup({
      objek_perjanjian : new FormControl(this.objek_perjanjian.value[this.obj]['objek_perjanjian'],[Validators.required]),
      subjek_perjanjian : new FormControl(this.objek_perjanjian.value[this.obj]['subjek_perjanjian'],[Validators.required]),
      ket_objek : new FormControl('',[Validators.required]),
    })
    this.objek_perjanjian.push(this.newGroup)
    this.obj++

  }
  clearForm(){
    this.objek_perjanjian.clear()
    this.newGroup = new FormGroup({
      objek_perjanjian : new FormControl('',[Validators.required]),
      subjek_perjanjian : new FormControl('',[Validators.required]),
      ket_objek : new FormControl('',[Validators.required]),
    })
    this.objek_perjanjian.push(this.newGroup)
    this.obj=0

  }

  delObj(index){
    this.objek_perjanjian.removeAt(index)
    this.obj--

  }
  addKew1(){
    this.newGroup = new FormGroup({
      kewajiban : new FormControl('',[Validators.required]),
    })
    this.kewajiban_1.push(this.newGroup)
    this.kew1++
  }
  delKew1(index){
    this.kewajiban_1.removeAt(index)
    this.kew1--
  }
  addKew2(){
    this.newGroup = new FormGroup({
      kewajiban : new FormControl('',[Validators.required]),
    })
    this.kewajiban_2.push(this.newGroup)
    this.kew1++
  }
  delKew2(index){
    this.kewajiban_2.removeAt(index)
    this.kew1--
  }
  getAkadPDF(action){
    let encode = this.formGroup.get('nomor_akad').value
    console.warn(encode)
    encode = encode.replace(/\//g,'_')
    window.open(downloadUrl+action+"/akad/"+encode, "_blank");
  }
}
