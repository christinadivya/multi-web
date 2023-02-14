
import { Injectable, EventEmitter } from '@angular/core';
 import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { BehaviorSubject } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { throwError, Observable } from 'rxjs';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json'
  })
};
@Injectable({
  providedIn: 'root'
})
export class MysubscriptionService {
  constructor(private http: HttpClient) { }
  applyingBlur = new EventEmitter();
  billingEmit = new EventEmitter();
  emitgold = new EventEmitter();
  tabEmit = new EventEmitter();
  // behaviour subject
  profileClicked = new EventEmitter();
  settingsClicked = new EventEmitter();
  privacyClicked = new EventEmitter();
  userIdidentify: any;
  url = 'businessinPayment/';
  stripeToken = 'sk_test_xKv5pfjEBtFt7bXwGojsFcBL001rm9yvXd';

  public updatedPlanName: BehaviorSubject<string> = new BehaviorSubject<string>('');
  public userData: BehaviorSubject<any> = new BehaviorSubject<any>('');

  getMySubscription(params) {
    const header = new HttpHeaders();
    header.append('Content-Type', 'application/json;charset=UTF-8');
    return this.http.get(environment.resourceUrl + this.url + `mysubscription?${params}`);
  }

  listMyCards() {
    const header = new HttpHeaders({
      Authorization: 'bearer ' + this.stripeToken
    });
    let data = {
      customerId: localStorage.getItem('stripeId')
    };
    return this.http.get('https://api.stripe.com/v1/customers/' + data.customerId + '/sources?object=card', { headers: header }).pipe(
      catchError(error => {
        return this.handleError(error);
      })
    );
  }

  addCardToStripeCustomer(data) {
    const header = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization: 'bearer ' + this.stripeToken
    });
    console.log(data);
    let body = new URLSearchParams();
    body.set('source', data.source);
    return this.http.post('https://api.stripe.com/v1/customers/' + data.customerId + '/sources', body.toString(), { headers: header }).pipe(
      catchError(error => {
        return this.handleError(error);
      })
    );
  }

  cancelSubscriptionPlan(data) {
    const header = new HttpHeaders({
      Authorization: 'bearer ' + this.stripeToken
    });
    return this.http.delete(' https://api.stripe.com/v1/subscriptions/' + data.subscriptionId, { headers: header }).pipe(
      catchError(error => {
        return this.handleError(error);
      })
    );
  }

  createSubscription(data) {
    const header = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization: 'bearer ' + this.stripeToken
    });
    console.log(data);
    let body = new URLSearchParams();
    body.set('customer', data.customer);
    body.set('items[0][plan]', data.planId);

    return this.http.post('https://api.stripe.com/v1/subscriptions', body.toString(), { headers: header }).pipe(
      catchError(error => {
        return this.handleError(error);
      })
    );
  }

  addSubscription(data) {
    const header = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'bearer ' + localStorage.getItem('currentUserToken')
    });
    const params = new HttpParams().set('userId', data.userId).set('manageplanId', data.manageplanId).set('stripe_subcription_id',
     data.stripe_subcription_id).set('itemSubscriptionId', data.itemSubscriptionId).set('interval_type',
     data.interval_type).set('interval_count', data.interval_count);

    return this.http.post(environment.resourceUrl + this.url +  'addorupdatesubscription?' + params, '', {headers: header}).pipe(
      catchError(error => {
        return this.handleError(error);
               })
               );
  }

  retriveToken(data) {
    const header = new HttpHeaders({
      Authorization: 'bearer ' + this.stripeToken
    });
    return this.http.get('https://api.stripe.com/v1/tokens/' + data, { headers: header }).pipe(
      catchError(error => {
        return this.handleError(error);
      })
    );
  }

  updateStripeSubscription(data) {
    const header = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization: 'bearer ' + this.stripeToken
    });
    console.log(data);
    let body = new URLSearchParams();
    body.set('items[0][id]', data.itemsSubscribeId);
    body.set('items[0][plan]', data.planId);
    body.set('cancel_at_period_end', data.cancel);

    return this.http.post('https://api.stripe.com/v1/subscriptions/' + data.subscriptionId, body.toString(), { headers: header }).pipe(
      catchError(error => {
        return this.handleError(error);
      })
    );
  }

  createCard(data) {
    let httpOption = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'bearer ' + localStorage.getItem('currentUserToken')

      })
    };
    return this.http.post(environment.resourceUrl + this.url + 'saveorupdatecarddetails', data, httpOption);
  }

  createStripeCustomer(data) {
    const header = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': 'bearer ' + this.stripeToken
    });
    console.log(data);
    let body = new URLSearchParams();
    body.set('source', data.source);
    body.set('email', data.email);

    return this.http.post('https://api.stripe.com/v1/customers', body.toString(), { headers: header }).pipe(
      catchError(error => {
        return this.handleError(error);
      })
    );
  }

  changeDefaultCardStripe(data) {
    const header = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization: 'bearer ' + this.stripeToken
    });
    console.log(data);
    let body = new URLSearchParams();
    body.set('default_source', data.default_source);
    // tslint:disable-next-line: max-line-length
    return this.http.post('https://api.stripe.com/v1/customers/' + data.customerId, body.toString(), { headers: header }).pipe(
      catchError(error => {
        return this.handleError(error);
      })
    );
  }

  updateStripeCard(data) {
    const header = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization: 'bearer ' + this.stripeToken
    });
    console.log(data);
    let body = new URLSearchParams();
    body.set('exp_month', data.exp_month);
    body.set('exp_year', data.exp_year);
    body.set('name', data.name);
    // tslint:disable-next-line: max-line-length
    return this.http.post('https://api.stripe.com/v1/customers/' + data.customerId + '/sources/' + data.cardId, body.toString(), { headers: header }).pipe(
      catchError(error => {
        return this.handleError(error);
      })
    );
  }

  getAllMyCard(data) {
    const header = new HttpHeaders();
    header.append('Content-Type', 'application/json;charset=UTF-8');
    return this.http.get(environment.resourceUrl + this.url + 'getallcarddetailsbyuserid?' + data, { headers: header }).pipe(
      catchError(error => {
        return this.handleError(error);
      })
    );
  }
  getAllPlansByType(){
    const header = new HttpHeaders();
    header.append('Content-Type', 'application/json;charset=UTF-8');
    return this.http.get(environment.resourceUrl + this.url +
       'getallplansbytype?pagenumber=0&pagerecord=0&sortcolumn=&sorttype=&search=&published=true', { headers: header }).pipe(
      catchError(error => {
        return this.handleError(error);
      })
    );

  }
  getAllPlans() {
    const header = new HttpHeaders();
    header.append('Content-Type', 'application/json;charset=UTF-8');
    return this.http.get(environment.resourceUrl + this.url +
       'getallplans?pagenumber=0&pagerecord=0&sortcolumn=&sorttype=&search=&published=true', { headers: header }).pipe(
      catchError(error => {
        return this.handleError(error);
      })
    );
  }

  deleteCard(data) {
    const header = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + localStorage.getItem('currentUserToken')
    });
    return this.http.delete(environment.resourceUrl + this.url + 'deletecarddetailsbycardid?' + data, { headers: header }).pipe(
      catchError(error => {
        return this.handleError(error);
      }));
  }

  deleteStripeCard(data) {
    const header = new HttpHeaders({
      Authorization: 'bearer ' + this.stripeToken
    });
    return this.http.delete(' https://api.stripe.com/v1/customers/' +
     data.customerId + '/sources/' + data.cardId, { headers: header }).pipe(
      catchError(error => {
        return this.handleError(error);
      })
    );
  }



  cancelmySubscription(data) {
    const header = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'bearer ' + localStorage.getItem('currentUserToken')
    });
    // tslint:disable-next-line: max-line-length
    const params = new HttpParams().set('subscriptionId', data.subscriptionId).set('cancelSubscriptionReason', data.cancelSubscriptionReason).set('userPlanId', data.userPlanId);

    return this.http.post(environment.resourceUrl + this.url + 'cancelsubscription?' + params, '', {headers: header});
  }

  handleError(error: Response) {
    if (error.status === 401) {
      localStorage.removeItem('currentUserToken');
      // this.router.navigate(['/signup']);
      return throwError(error);
    } else {
      return throwError(error);
    }
  }

  getAllPlansByTypeYear() {
    const header = new HttpHeaders();
    header.append('Content-Type', 'application/json;charset=UTF-8');
    return this.http.get(environment.resourceUrl + this.url +
       'getallplansbytype?pagenumber=0&pagerecord=0&sortcolumn=&sorttype=&search=&published=true&type=year', { headers: header }).pipe(
      catchError(error => {
        return this.handleError(error);
      })
    );
  }


}