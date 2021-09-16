import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpUrlEncodingCodec } from '@angular/common/http';
import { Observable } from 'rxjs';
import { baseUrl } from 'src/environments/environment';


@Injectable({
  providedIn: 'root'
})
export class InvoiceService {

  constructor(private http:HttpClient) { }

  async getInvoice(token):Promise<any>{
    var reqHeader = new HttpHeaders({
      'accept': 'application/json',
      'Authorization': 'Bearer ' + token
   });
    const res = await this.http.get<any>(baseUrl+ "invoice", { headers : reqHeader } ).toPromise();
    return res
  }
  async getOneInvoice(invoice,token):Promise<any>{
    let encode = invoice
    encode = encode.replace(/\//g,'-')
    var reqHeader = new HttpHeaders({
      'accept': 'application/json',
      'Authorization': 'Bearer ' + token
   });
    const res = await this.http.get<any>(baseUrl+ "invoice/"+encode,{ headers : reqHeader }).toPromise();
    return res
  }
  storeInvoice(data,token):Observable<any>{
    var reqHeader = new HttpHeaders({
      'accept': 'application/json',
      'Authorization': 'Bearer ' + token
   });
    return this.http.post<any>(baseUrl+ "invoice",data,{ headers : reqHeader })
  }
  editInvoice(data,invoice,token):Observable<any>{
    let encode = invoice
    encode = encode.replace(/\//g,'-')
    var reqHeader = new HttpHeaders({
      'accept': 'application/json',
      'Authorization': 'Bearer ' + token
   });
    return this.http.patch<any>(baseUrl+ "invoice/"+encode,data,{ headers : reqHeader })
  }
  deleteInvoice(invoice,token){
    let encode = invoice
    encode = encode.replace(/\//g,'-')
    var reqHeader = new HttpHeaders({
      'accept': 'application/json',
      'Authorization': 'Bearer ' + token
   });
    return this.http.delete<any>(baseUrl+ "invoice/"+encode,{ headers : reqHeader })
  }
}
