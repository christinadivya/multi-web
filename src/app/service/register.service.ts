import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { HttpClient, HttpInterceptor, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { BehaviorSubject } from 'rxjs';
// import { Data } from '../personal-information/personal-information.component';

// firebase
import 'rxjs/add/operator/toPromise';
import { AngularFireAuth } from '@angular/fire/auth';
import * as firebase from 'firebase/app';

import * as AWS from 'aws-sdk/global';
import * as S3 from 'aws-sdk/clients/s3';
import { element } from '@angular/core/src/render3';

@Injectable({
  providedIn: 'root'
})
export class RegisterService {

  private dataSource = new BehaviorSubject<any>('');
  cast = this.dataSource.asObservable();

  private loginSource = new BehaviorSubject<any>('');
  authlog = this.loginSource.asObservable();


  general = 'businessinGeneral';
  businessauth = 'businessinAuth';
  businessprofile = 'businessinProfile';

  extenstion: any;
  fileName: any;
  fileExtenstion: any;
  uploadFinish: boolean;
  logoUpload: any;
  compani_logo: any;
  FOLDER: number;
  accountDetails_1 = {};

  constructor(private http: HttpClient,  public afAuth: AngularFireAuth, private  router: Router) { }


  // firebase loogin

  doFacebookLogin() {
    return new Promise<any>((resolve, reject) => {
      let provider = new firebase.auth.FacebookAuthProvider();
      this.afAuth.auth
      .signInWithPopup(provider)
      .then(res => {
        resolve(res);
      }, err => {
        console.log(err);
        reject(err);
      });
    });
  }

  doTwitterLogin() {
    return new Promise<any>((resolve, reject) => {
      let provider = new firebase.auth.TwitterAuthProvider();
      this.afAuth.auth
      .signInWithPopup(provider)
      .then(res => {
        resolve(res);
      }, err => {
        console.log(err);
        reject(err);
      });
    });
  }

  doGoogleLogin() {
    return new Promise<any>((resolve, reject) => {
      let provider = new firebase.auth.GoogleAuthProvider();
      provider.addScope('profile');
      provider.addScope('email');
      this.afAuth.auth
      .signInWithPopup(provider)
      .then(res => {
        resolve(res);
      }, err => {
        console.log(err);
        reject(err);
      });
    });
  }

  doLinkedinLogin(code) {

    let input = new FormData();
    input.append('clientid',  environment.linkedinClientId);
    input.append('clientsecret', environment.linkedinClientSecret);
    input.append('granttype', 'authorization_code');
    input.append('redirecturi', environment.linkedinredirect);
    input.append('code', code);

    const header = new HttpHeaders();
    header.append('Content-Type', 'application/x-www-form-urlencoded');
    return this.http.post(environment.resourceUrl + this.businessauth + '/linkedinprofile' , input  , {headers: header});
  }



  doLogout() {
    return new Promise((resolve, reject) => {
      if (firebase.auth().currentUser) {
        this.afAuth.auth.signOut();
        resolve();
      }
      else {
        reject();
      }
    });
  }

  //  firebase  login ends 

  loggeduserIn() {
    let url = this.router.url;
    localStorage.setItem
    ('URL', url);
   return !!localStorage.getItem('currentusertoken');
  }

  verfyUser(verifyurl) {
    const header = new HttpHeaders();
    header.append('Content-Type', 'application/json');
    return this.http.post(environment.resourceUrl + this.businessauth + '/verificationlink' , verifyurl , {headers: header});
  }

  updatedDataSelection(userData) {
    return this.dataSource.next(userData);
  }

  updatedDataLogin(logdat) {
    return this.loginSource.next(logdat);
  }


  isAuthenticated(): boolean {
    return sessionStorage.getItem('currentusertoken') != null || localStorage.getItem('currentusertoken') != null;
  }

  getAddressFromGoogle(lat, lng) {
    return this.http.get('https://maps.googleapis.com/maps/api/geocode/json?latlng=' + lat + ',' + lng + '&key=' + environment.googlekey);
  }

  getCurrentIPAddress() {
    return this.http.get('https://jsonip.com/', {});
  }

  getAddressBasedonCurrentIp(ip) {
    return this.http.get('http://ip-api.com/json/' + ip);
  }

  loginUser(logData) {
    let input = new FormData();
    input.append('username', logData.username);
    input.append('password', logData.password);
    let header = new HttpHeaders();
    header.append('Content-Type', 'application/x-www-form-urlencoded');
    return this.http.post<any>(environment.resourceUrl + this.businessauth + '/login', input, { headers: header });
  }

  usersRegister(registerData) {
    const header = new HttpHeaders();
    header.append('Content-Type', 'application/json');
    return this.http.post(environment.resourceUrl + this.businessauth + '/register' , registerData , {headers: header});
  }

  getAllLanguage() {
    const header = new HttpHeaders();
    header.append('Content-Type', 'application/json;charset=UTF-8');
    return this.http.get(environment.resourceUrl + this.general + '/getalllanguage' , {headers: header});
  }

  getAccType() {
    const header = new HttpHeaders();
    header.append('Content-Type', 'application/json;charset=UTF-8');
    return this.http.get(environment.resourceUrl + this.general + '/getallaccounts' , {headers: header});
  }

  getAllIndustry() {
    const header = new HttpHeaders();
    header.append('Content-Type', 'application/json;charset=UTF-8');
    return this.http.get(environment.resourceUrl + this.general + '/getallIndustry' , {headers: header});
  }

  getAllCountry() {
    const header = new HttpHeaders();
    header.append('Content-Type', 'application/json;charset=UTF-8');
    return this.http.get(environment.resourceUrl + this.general + '/getallcountry' , {headers: header});
  }

  getAllState(counryId) {
    const header = new HttpHeaders();
    header.append('Content-Type', 'application/json;charset=UTF-8');
    return this.http.get(environment.resourceUrl + this.general + '/getallStatesByCountry?countryId=' + counryId);
  }

  getAllCity(stateId) {
    const header = new HttpHeaders();
    header.append('Content-Type', 'application/json;charset=UTF-8');
    return this.http.get(environment.resourceUrl + this.general + '/getallCityByState?stateid=' + stateId);
  }



  // Location search API

    searchLocations(location) {
      const header = new HttpHeaders();
      header.append('Content-Type', 'application/json;charset=UTF-8');
      console.log(location);
      return this.http.get(environment.resourceUrl + this.general + '/getalllocationbysearch?search=' + location +
      '&pageNumber=1&pageSize=20');
    }

    checkMail(mail) {
      const header = new HttpHeaders();
      header.append('Content-Type', 'application/json');
      return this.http.get(environment.resourceUrl + this.general + '/findexistinguser?origin=1&credential=' + mail , {headers: header});
    }

    checkPhone(phone) {
      const header = new HttpHeaders();
      header.append('Content-Type', 'application/json');
      return this.http.get(environment.resourceUrl + this.general + '/findexistinguser?origin=2&credential=' + phone , {headers: header});
    }


    uploadfile(file) {
      AWS.config.region = environment.awsRegion; // 1. Enter your region
      AWS.config.credentials = new AWS.CognitoIdentityCredentials({
        IdentityPoolId: environment.awsIdentityPoolId // 2. Enter your identity pool
      });
      console.log(AWS.config.region);

      console.log(AWS);
      if (file) {
        const fileDetails = this.getCredential(file);
        console.log(fileDetails);
        const params = this.getParams(file, fileDetails);
        console.log(params);
        const bucket = new S3({ params: { Bucket: params.Bucket } });
        bucket.upload(params).on('httpUploadProgress', function (evt) {
        }).send(function (err, response) {
          console.log(err);
          console.log(response);
  });
      }
    }

  getCredential(file): any {
    this.extenstion = file.name.slice(file.name.lastIndexOf('.'));
    this.fileName = file.name;
    this.fileExtenstion = this.extenstion;
    const credentials = {
      fileExtenstion: this.extenstion,
      fileName: file.name,
    };
    return credentials;
  }

  getParams(file, fileDetails): any {
    const params = {
      Bucket: 'businessin-dev',
      Key: 'businessin/' + Math.floor(Math.random() * 100000) + Date.now().toString() + fileDetails.fileExtenstion,
      Body: file
    };
    return params;
  }

  // register user

  registringUser(regData) {
    const header = new HttpHeaders();
    header.append('Content-Type', 'application/json');
    return this.http.put(environment.resourceUrl + this.businessauth + '/updateregister' , regData , {headers: header});
  }

  userDetails(userId) {
    return this.http.get(environment.resourceUrl + this.businessprofile + '/viewprofile?userid=' + userId);
  }

  getAllPlans() {
    const header = new HttpHeaders();
    header.append('Content-Type', 'application/json;charset=UTF-8');
    return this.http.get(environment.resourceUrl + this.general + '/getallplans', {headers: header});
  }

  subscription(userid) {
     return this.http.put(environment.resourceUrl + this.businessauth + '/subscription?userid=' + userid , '');
  }

  getSearchItem(data) {
    const header = new HttpHeaders();
    header.append('Content-Type', ' application/json');
    return this.http.post(environment.resourceUrl  + 'businessinProfile/searchallpostfilter', data, { headers: header });
  }

  editProfile(regData) {
    console.log("edit");
    
    const header = new HttpHeaders();
    header.append('Content-Type', 'application/json');
    return this.http.put(environment.resourceUrl + this.businessprofile + '/editprofile' , regData , {headers: header});
  }
}
