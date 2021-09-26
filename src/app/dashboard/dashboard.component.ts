import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { baseUrl } from 'src/environments/environment';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  info: any
  logo : any = baseUrl+"get-logo"
  loading: boolean;
  constructor(private http:HttpClient) { }

  async ngOnInit() {
    this.loading = true
    this.info = await this.fetchInfo()
    this.loading = false
  }

  date: Date = new Date();

  async fetchInfo():Promise<any>{
   let res = await this.http.get<any>(baseUrl+"get-info").toPromise()
   return res
  }
}
