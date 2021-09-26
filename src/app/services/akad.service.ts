import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { baseUrl } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AkadService {

  constructor(private http:HttpClient) { }

  async getAkad(token):Promise<any>{
    var reqHeader = new HttpHeaders({
      'accept': 'application/json',
      'Authorization': 'Bearer ' + token
   });
    const res = await this.http.get<any>(baseUrl+ "perjanjian", { headers : reqHeader } ).toPromise();
    return res
  }
  async getOneAkad(no_akad,token):Promise<any>{
    let encode = no_akad
    encode = encode.replace(/\//g,'_')
    var reqHeader = new HttpHeaders({
      'accept': 'application/json',
      'Authorization': 'Bearer ' + token
   });
    const res = await this.http.get<any>(baseUrl+ "perjanjian/"+encode,{ headers : reqHeader }).toPromise();
    return res
  }
  storeAkad(data,token):Observable<any>{
    var reqHeader = new HttpHeaders({
      'accept': 'application/json',
      'Authorization': 'Bearer ' + token
   });
    return this.http.post<any>(baseUrl+ "perjanjian",data,{ headers : reqHeader })
  }
  editAkad(data,no_akad,token):Observable<any>{
    let encode = no_akad
    encode = encode.replace(/\//g,'_')
    var reqHeader = new HttpHeaders({
      'accept': 'application/json',
      'Authorization': 'Bearer ' + token
   });
    return this.http.patch<any>(baseUrl+ "perjanjian/"+encode,data,{ headers : reqHeader })
  }
  deleteAkad(no_akad,token){
    let encode = no_akad
    encode = encode.replace(/\//g,'_')
    var reqHeader = new HttpHeaders({
      'accept': 'application/json',
      'Authorization': 'Bearer ' + token
   });
    return this.http.delete<any>(baseUrl+ "perjanjian/"+encode,{ headers : reqHeader })
  }
}
