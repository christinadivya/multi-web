import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { catchError } from 'rxjs/operators';
import { throwError, Observable, BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GeneralService {

  paymentUrl = 'businessinPayment/';
  generalUrl = 'businessinGeneral/';
  notifyUrl = 'businessinNotification/';
  businessauth = 'businessinAuth/';

  public tabActive: BehaviorSubject<any> = new BehaviorSubject<any>('');
  public overAllMessageCount: BehaviorSubject<any> = new BehaviorSubject<any>('');
  public notificationType: BehaviorSubject<string> = new BehaviorSubject<string>('');
  public notificationDate: BehaviorSubject<any> = new BehaviorSubject<any>('');
  public viewType: BehaviorSubject<string> = new BehaviorSubject<string>('');
  public overAllNotificationCount: BehaviorSubject<any> = new BehaviorSubject<any>('');
  public subEnable: BehaviorSubject<any> = new BehaviorSubject<boolean>(false);
  public referralNotification: BehaviorSubject<any> = new BehaviorSubject<any>('');

  constructor(private http: HttpClient) { }

  handleError(error: Response) {
    if (error.status === 401) {
      localStorage.removeItem('currentUserToken');
      // this.router.navigate(['/signup']);
      return throwError(error);
    } else {
      return throwError(error);
    }
  }

  getAllPlansForPricing(data: any) {
    const header = new HttpHeaders();
    header.append('Content-Type', 'application/json;charset=UTF-8');
    return this.http.get(environment.resourceUrl + this.paymentUrl + 'getallplansbytype?pagenumber=' + data.pagenumber + '&pagerecord=' + data.pagerecord + '&sorttype=' + data.sorttype + '&type=' + data.type + '&published=' + data.published, { headers: header });
  }

  getAllMessageCount(data: any) {
    const header = new HttpHeaders();
    header.append('Accept', '*/*');
    return this.http.get(environment.apiurl + '/chatrequest/getunread_count?userId=' + data.userid, { headers: header });
  }

  saveContactUs(data: any) {
    const header = new HttpHeaders();
    header.append('Content-Type', 'application/json');
    return this.http.post(environment.resourceUrl + this.generalUrl + 'addcontactusdetails', data, { headers: header });
  }

  getSubscriptionStatus() {
    return this.http.get(environment.resourceUrl + this.paymentUrl + 'getsubscriptiondisablestatus');
  }
  requestOTP(data){
    const header = new HttpHeaders();
    header.append('Content-Type', 'application/json');
    return this.http.post(environment.resourceUrl + this.businessauth + 'generateotp', data, { headers: header });

  }
  verifyOTP(data){
    const header = new HttpHeaders();
    header.append('Content-Type', 'application/json');
    return this.http.post(environment.resourceUrl + this.businessauth + 'verifyforgotpasswordotp', data, { headers: header });

  }  

  changePhoneEmailPrivacy(userid: any) {
    const header = new HttpHeaders();
    header.append('Content-Type', 'application/json;charset=UTF-8');
    return this.http.put(environment.apiUrl + 'changephonenoprivatestatus?userid=' + userid, { headers: header });
  }

  getNotificationStatus() {
    const header = new HttpHeaders();
    return this.http.get(environment.resourceUrl + this.notifyUrl + 'getnotificationstatus', { headers: header });
  }

  updateNotificationStatus(data: any) {
    const header = new HttpHeaders();
    header.append('Content-Type', 'application/json');
    return this.http.post(environment.resourceUrl + this.notifyUrl + 'addorupdatenotifystatus', data, { headers: header });
  }

  getAllFAQ(headerid: any) {
    const header = new HttpHeaders();
    return this.http.get(environment.resourceUrl + this.generalUrl + 'getallfaqbyheaderid?headerId=' + headerid, { headers: header });
  }

  changeNotificationStatusToSeen(id: any) {
    const header = new HttpHeaders();
    return this.http.post(environment.resourceUrl + this.notifyUrl + 'changemultiplenotificationbyreceiveridtoseen?id=' + id, { headers: header });
  }

  getAllNotification(params: any) {
    const header = new HttpHeaders();
    return this.http.get(environment.resourceUrl + this.notifyUrl + `getallnotificationbyreceiverid?${params}`, { headers: header });
  }

  getAllUnseenNotification(params: any) {
    const header = new HttpHeaders();
    return this.http.get(environment.resourceUrl + this.notifyUrl + `getallunseennotificationbyreceiverid?${params}`, { headers: header });
  }

  getProfileView(params: any) {
    const header = new HttpHeaders();
    return this.http.get(environment.resourceUrl + this.notifyUrl + `getprofileviewedusers?${params}`, { headers: header });
  }

  getPostView(params: any) {
    const header = new HttpHeaders();
    return this.http.get(environment.resourceUrl + this.notifyUrl + `getpostviewedusers?${params}`, { headers: header });
  }

  changeUnreadToReadStatus(params: any) {
    const header = new HttpHeaders();
    return this.http.post(environment.resourceUrl + this.notifyUrl + `changereadstatusbynotificatonid?${params}`, { headers: header });
  }

  saveFeedback(data: any) {
    const header = new HttpHeaders();
    header.append('Content-Type', 'application/json');
    return this.http.post(environment.resourceUrl + this.generalUrl + 'addfeedbackdata', data, { headers: header });
  }
}
