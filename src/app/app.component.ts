import { Component, OnInit, HostListener } from '@angular/core';
import { Router, NavigationEnd, NavigationStart, RouteConfigLoadStart, RouteConfigLoadEnd } from '@angular/router';
import { UserIdleService } from 'angular-user-idle';

import Swal from 'sweetalert2';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit{
  title = 'demo1';
  showSidebar: boolean = true;
  showNavbar: boolean = true;
  showFooter: boolean = true;
  isLoading: boolean;

  constructor(private router: Router,private userIdle : UserIdleService,private authService : AuthService) {
    // Removing Sidebar, Navbar, Footer for Documentation, Error and Auth pages
    router.events.forEach((event) => {
      if(event instanceof NavigationStart) {
        if((event['url'] == '/')||(event['url'] == '')||(event['url'] == '/auth/login')||(event['url'] == '/user-pages/login') || (event['url'] == '/user-pages/register') || (event['url'] == '/error-pages/404') || (event['url'] == '/error-pages/500') ) {
          this.showSidebar = false;
          this.showNavbar = false;
          this.showFooter = false;
          document.querySelector('.main-panel').classList.add('w-100');
          document.querySelector('.page-body-wrapper').classList.add('full-page-wrapper');
          document.querySelector('.content-wrapper').classList.remove('auth', 'auth-img-bg', );
          document.querySelector('.content-wrapper').classList.remove('auth', 'lock-full-bg');
          if((event['url'] == '/error-pages/404') || (event['url'] == '/error-pages/500')) {
            document.querySelector('.content-wrapper').classList.add('p-0');
          }
        } else {
          this.showSidebar = true;
          this.showNavbar = true;
          this.showFooter = true;
          document.querySelector('.main-panel').classList.remove('w-100');
          document.querySelector('.page-body-wrapper').classList.remove('full-page-wrapper');
          document.querySelector('.content-wrapper').classList.remove('auth', 'auth-img-bg');
          document.querySelector('.content-wrapper').classList.remove('p-0');
          //Start timer when user idle
          this.userIdle.startWatching();

          // Start watching when user idle is starting.
          this.userIdle.onTimerStart().subscribe();

          // Start watch when time is up.
          this.userIdle.onTimeout().subscribe(() =>
          this.onTimeout()
          );
          if(!localStorage.getItem("token")){
            Swal.fire({
              title: "Stop",
              text: "Maaf, anda tidak memiliki akses! siahkan login terlebih dahulu!",
              icon: "error",
              confirmButtonText: "Tutup",
            });
            this.router.navigate(["auth/login"]);
          }
        }
      }
    });

    // Spinner for lazyload modules
    router.events.forEach((event) => {
      if (event instanceof RouteConfigLoadStart) {
          this.isLoading = true;
      } else if (event instanceof RouteConfigLoadEnd) {
          this.isLoading = false;
      }
    });


  }



  ngOnInit() {
    // Scroll to top after route change
    this.router.events.subscribe((evt) => {
      if (!(evt instanceof NavigationEnd)) {
          return;
      }
      window.scrollTo(0, 0);
    });

  }
  onTimeout(){
    this.userIdle.stopTimer();
    this.userIdle.stopWatching();
    this.authService.logout(localStorage.getItem("token")).subscribe((res:any)=>{
      Swal.fire({
        title: "Timeout",
        text: "Maaf, anda Offline Terlalu lama, silahkan lakukan login kembali",
        icon: "info",
        confirmButtonText: "Tutup",
      });
      localStorage.clear()
      this.router.navigate(["/"])
    })

  }
  @HostListener('window:mousemove') refreshUserState() {
    this.userIdle.resetTimer();
  }
  @HostListener('window:keydown')handleKeyDown(event: KeyboardEvent) {
    this.userIdle.resetTimer();
  }
}
