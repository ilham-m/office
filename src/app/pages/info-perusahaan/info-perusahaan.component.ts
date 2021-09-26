import { HttpClient, HttpHeaders } from '@angular/common/http';
import { FormControl, FormGroup, Validators, FormArray } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { Subject,Observable } from 'rxjs';
import Swal from "sweetalert2";
import { baseUrl } from 'src/environments/environment';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-info-perusahaan',
  templateUrl: './info-perusahaan.component.html',
  styleUrls: ['./info-perusahaan.component.scss']
})
export class InfoPerusahaanComponent implements OnInit {
  formGroup : FormGroup
  loading : boolean
  info: any;
  logoName: any = ""
  constructor(private http:HttpClient,private modalService: NgbModal) { }
  logo = baseUrl+"get-logo"
  logoInput : any
  act : any
  id : any
  async ngOnInit(){
    this.loading = true
    this.info = await this.fetchInfo()
    this.loading = false
  }

  async fetchInfo():Promise<any>{
    let res = await this.http.get<any>(baseUrl+"get-info").toPromise()
    this.info = res
    return res
   }
   openModal( modal,id ) {
     this.id = id
    this.modalService.open( modal, { size : 'md' } );
    if(id){
      this.editForm(id)
    }
    else if(!id){
      this.initForm()
    }
  }
  uploadLogo($event){
    this.logoName = $event.target.files[0].name
    this.logoInput = $event.target.files[0]
    console.warn(this.logoInput)
    this.editForm(this.id)
  }
  initForm(){
    this.formGroup = new FormGroup({
      nama_perusahaan : new FormControl('',[Validators.required]),
      alamat : new FormControl('',[Validators.required]),
      phone : new FormControl('',[Validators.required]),
      logo : new FormControl(this.logoInput,[Validators.required]),
    })
  }
  async editForm(id):Promise<any>{
    console.log(id)
    this.act="edit"
    var reqHeader = new HttpHeaders({
      'accept': 'application/json',
      'Authorization': 'Bearer ' + localStorage.getItem("token"),
    });
    this.loading = true
    let res = await this.http.get<any>(baseUrl+"info-perusahaan/"+id,{ headers : reqHeader }).toPromise()
    console.log(res.data)
    this.loading = false
    this.formGroup = new FormGroup({
      nama_perusahaan : new FormControl(res.data.data.nama_perusahaan,[Validators.required]),
      alamat : new FormControl(res.data.data.alamat,[Validators.required]),
      phone : new FormControl(res.data.data.phone,[Validators.required]),
      logo : new FormControl(this.logoInput,[Validators.required]),
    })
    console.warn(this.formGroup.get("logo").value)
  }

  async submit():Promise<any>{
    console.warn(this.formGroup.value)
    if(this.act == "edit"){
      var Header = new HttpHeaders({
        'X-HTTP-Method-Override' : 'PATCH',
        'Authorization': 'Bearer ' + localStorage.getItem("token"),
      });
      const formData: FormData = new FormData();
      formData.append("nama_perusahaan", this.formGroup.get("nama_perusahaan").value);
      formData.append("alamat", this.formGroup.get("alamat").value);
      formData.append("phone", this.formGroup.get("phone").value);
      formData.append("logo", this.logoInput, this.logoName);
      this.http.post<any>(baseUrl+"info-perusahaan/"+this.id,formData,{ headers : Header }).toPromise().then(res=>{
        Swal.fire({
          title: "Sukses!",
          text: "Data Berhasil tersimpan",
          icon: "success",
          confirmButtonText: "Tutup",
        });
      },(error)=>{
        console.warn(error)
      })
    }
    else if(this.act == "buat"){

    }
  }

}
