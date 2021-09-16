import { Component, OnInit } from '@angular/core';
import { Router,ActivatedRoute  } from '@angular/router';
import { FormControl, FormGroup, Validators, FormArray } from '@angular/forms';

import { Observable } from 'rxjs';
import Swal from "sweetalert2";
import { AuthService } from 'src/app/services/auth.service';
import { UserIdleService } from 'angular-user-idle';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  formGroup : FormGroup
  constructor(private router : Router,private authService : AuthService, private userIdle : UserIdleService) { }

  ngOnInit(): void {
    this.initForm()
  }

  initForm(){
    this.formGroup = new FormGroup({
      email : new FormControl('',[Validators.required]),
      password : new FormControl('',[Validators.required])
    })
  }
  login(){
    Swal.showLoading()
    if(this.formGroup.valid){

      this.authService.loginProcess(this.formGroup.value).subscribe(
      (res:any)=>{
        if(res){
          localStorage.setItem("token",res.data.user.token);
          localStorage.setItem("name", res.data.user.user.name);
          Swal.fire({
            title: "Sukses!",
            text: "Selamat datang",
            icon: "success",
            confirmButtonText: "Tutup",
          });
          this.userIdle.startWatching()
          this.router.navigate(["/dashboard"]);
        }
      },
      (Error)=>{
        Swal.fire({
          title: "Gagal Login!",
          text: "email / password Salah! Silahkan Coba lagi",
          icon: "error",
          confirmButtonText: "Tutup",
        });
      }
      )
    }else{
      Swal.fire({
        title: "Gagal Login!",
        text: "email / password tidak Boleh Kosong",
        icon: "error",
        confirmButtonText: "Tutup",
      });
    }
  }
}
