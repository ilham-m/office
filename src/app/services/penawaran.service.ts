import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpUrlEncodingCodec } from '@angular/common/http';
import { Observable } from 'rxjs';
import { baseUrl } from 'src/environments/environment';
@Injectable({
  providedIn: 'root'
})
export class PenawaranService {

  constructor(private http:HttpClient) { }

  async getPenawaran(token):Promise<any>{
    var reqHeader = new HttpHeaders({
      'accept': 'application/json',
      'Authorization': 'Bearer ' + token
   });
    const res = await this.http.get<any>(baseUrl+ "penawaran", { headers : reqHeader } ).toPromise();
    return res
  }
  async getOnePenawaran(no_penawaran,token):Promise<any>{
    let encode = no_penawaran
    encode = encode.replace(/\//g,'_')
    console.log(encode)
    var reqHeader = new HttpHeaders({
      'accept': 'application/json',
      'Authorization': 'Bearer ' + token
   });
    const res = await this.http.get<any>(baseUrl+ "penawaran/"+encode,{ headers : reqHeader }).toPromise();
    return res
  }
  storePenawaran(data,token):Observable<any>{
    var reqHeader = new HttpHeaders({
      'accept': 'application/json',
      'Authorization': 'Bearer ' + token
   });
    return this.http.post<any>(baseUrl+ "penawaran",data,{ headers : reqHeader })
  }
  editPenawaran(data,no_penawaran,token):Observable<any>{
    let encode = no_penawaran
    encode = encode.replace(/\//g,'-')
    var reqHeader = new HttpHeaders({
      'accept': 'application/json',
      'Authorization': 'Bearer ' + token
   });
    return this.http.patch<any>(baseUrl+ "penawaran/"+encode,data,{ headers : reqHeader })
  }
  deletePenawaran(no_penawaran,token):Observable<any>{
    let encode = no_penawaran
    encode = encode.replace(/\//g,'_')
    console.log(encode)
    var reqHeader = new HttpHeaders({
      'accept': 'application/json',
      'Authorization': 'Bearer ' + token
   });
    return this.http.delete<any>(baseUrl+ "penawaran/"+encode,{ headers : reqHeader })
  }
}
