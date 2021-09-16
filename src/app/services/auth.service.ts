import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { baseUrl } from 'src/environments/environment';
@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http:HttpClient) { }

  loginProcess(data):Observable<any>{
    return this.http.post<any>(baseUrl+"login",data)
  }
  logout(token):Observable<any>{
    var reqHeader = new HttpHeaders({
      'accept': 'application/json',
      'Authorization': 'Bearer ' + token
   });
    return this.http.get<any>(baseUrl+"auth/logout", { headers : reqHeader } )
  }
}
