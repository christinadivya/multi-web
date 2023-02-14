import { Injectable } from '@angular/core';
import { HttpClient, HttpInterceptor, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { BehaviorSubject } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class RefferalService {
  constructor(private http: HttpClient) { }

  // behaviour subject
  private postdata = new BehaviorSubject<any>('');
  private currentdata = new BehaviorSubject<any>('');
  private postitle = new BehaviorSubject<any>('');
  typesList = new BehaviorSubject<any>('');
  cast = this.postdata.asObservable();
  cpost = this.currentdata.asObservable();
  potitle = this.postitle.asObservable();
  contactInfo: number;
  general = 'businessinGeneral/';
  userIdidentify: any;

  getMyRefferal(params) {
    return this.http.get(environment.apiUrl + `getreferral?${params}`);
  }

  getsendreferral(params) {
    return this.http.get(environment.apiUrl + `getsendreferrallist?${params}`);
  }

  getReferrerDetails(params) {
    console.log(params)
    return this.http.get(environment.apiUrl + `getprofileview?${params}`);
  }

  getreceiverreferral(params) {
    return this.http.get(environment.apiUrl + `getreceivedreferrallist?${params}`);
  }

  getreferrerslist(data) {
    // return this.http.get(environment.apiUrl + `getprofilelistforreferral?${params}`);
    const header = new HttpHeaders();
    header.append('Content-Type', 'application/json;charset=UTF-8');
    return this.http.post(environment.apiUrl + `getprofilelistforreferral`, data, { headers: header });
  }

  sendReferralData(data) {
    const header = new HttpHeaders();
    header.append('Content-Type', 'application/json;charset=UTF-8');
    return this.http.post(environment.apiUrl + `sendreferral`, data, { headers: header });
  }

  resendReferral(data) {
    const header = new HttpHeaders();
    header.append('Content-Type', 'application/json;charset=UTF-8');
    return this.http.post(environment.apiUrl + `resendreferral`, data, { headers: header });
  }

}