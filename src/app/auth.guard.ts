import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot, NavigationEnd } from '@angular/router';
import { RegisterService } from './service/register.service';
import { RouterextserviceService } from './service/routerextservice.service';
import { GeneralService } from 'src/app/service/general.service';
import { HttpParams } from '@angular/common/http';
import { MysubscriptionService } from 'src/app/service/mysubscription.service';


@Injectable({
  providedIn: 'root'
})

export class AuthGuard implements CanActivate {
  previousUrl: any;
  currentUrl: string;
  constructor(private service: RegisterService,
    private router: Router, private routerService: RouterextserviceService,
    private generalService: GeneralService, private mysubscription: MysubscriptionService
  ) {
  }
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {

    if (this.service.loggeduserIn()) {
      this.generalService.getSubscriptionStatus()
        .subscribe((response: any) => {
          let params = new HttpParams();
          params = params.append('userId', localStorage.getItem('UserId').toString());
          this.mysubscription.getMySubscription(params).subscribe((res) => {
            if (res['entity'] == null || res['entity'] === undefined) {
              console.log('pppp', this.router.url.split('/'));
              if (state.url === '/subscription') {
                this.router.navigate([state.url]);
                return true;
              } else {
                this.router.navigate(['/subscription']);
                return false;
              }
            } else {
              if ((state.url.includes('view-post')) && this.routerService.getPreviousUrl() === undefined) {
                localStorage.setItem('navigation', 'true');
              }
              return true;

            }
          });
        });
       return true;
    } else {
      const geturl: string = state.url;
      const url = geturl.split('/');
      if (url.includes('view-post')) {
        const params = geturl.split('view-post/');
        localStorage.setItem('route', `/view-post/${params[1]}`);
        localStorage.setItem('navigation', 'true');
        localStorage.setItem('ReferalPost', 'true');
      }
      if (url.includes('view-profile')) {
        const params = geturl.split('view-profile/');
        localStorage.setItem('route', `/view-profile/${params[1]}`);
        localStorage.setItem('navigation', 'true');
      }
      this.router.navigate(['/home']);
      return false;

    }
  }
}
