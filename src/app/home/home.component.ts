import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { RegisterService } from '../service/register.service';
import { Router, NavigationEnd } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { map } from 'rxjs/operators';
import { ActivatedRoute } from '@angular/router';
import { environment } from 'src/environments/environment';
import { LanguageService } from '../service/language.service';
import * as io from 'socket.io-client';
import { GeneralService } from '../service/general.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html'
})
export class HomeComponent implements OnInit {

  // private url = 'http://52.37.78.247:9004/';
  // private url = 'https://businessinchatdev.optisolbusiness.com/';
  socket;

  result: any;

  socialData: any;
  registration: any;

  togglePassword = false;
  passEye: any = './assets/images/businessin-icons/eye-slash.svg';
  input_type: any = 'password';

  registerData: any = {};
  registerSocial: any = {};
  transferdata: any;
  loginmail: any;

  // 1 - login , 2 - register
  mobileview = 1;
  geturl = '';
  verifyLink: any = {
    vurl: null
  };

  d = new Date();
  year = this.d.getFullYear();
  langData: any = { common: '', loginhome: '', loginFooterPage: '' };
  registerflag = false;
  subscriptionDisableStatus;
  urlValue
  constructor(private service: RegisterService,
    private router: Router,
    private toastr: ToastrService,
    private route: ActivatedRoute,
    private language: LanguageService,
    private generalService: GeneralService
  ) {
    router.events.subscribe((val) => {
      console.log(val);
    });
    this.socket = io(environment.url);


  }

  ngOnInit() {
    window.scrollTo(0, 0);
    this.service.cast.subscribe(res => this.transferdata = res);
    this.service.authlog.subscribe(res => this.loginmail = res);
    this.getVurl();
    this.getSubscriptionStatus();

    // checking whether user logedin
    const currentUser = localStorage.getItem('currentusertoken');
    this.urlValue = this.router.url.split('/')
    console.log("currrrrrrrrr",currentUser)
    if (currentUser !== undefined && currentUser!==null) {
      if (this.urlValue[1] == 'userlisthome') {
        if (localStorage.getItem('UserId') == this.urlValue[3]) {
          this.router.navigate(['/requestuserlist/' + this.urlValue[2]])
        }
        else {
          this.toastr.error("You don't have access to view this page");
          this.router.navigate(['/user-home']);

        }

      }
      else {
        this.router.navigate(['/user-home']);
      }

    }


    //  signou social login
    this.signOut();

    // Linkedin Fetch AuthCode

    this.fetchLanguage();
    this.getLinkedinAuthCode();
  }

  fetchLanguage() {
    this.language.getLanguageData(1)
      .subscribe(
        (response: any) => {
          console.log(response);
          this.langData = response;
        },
        (error) => {
          console.log(error);
        }
      );
  }

  getVurl() {
    let params;
    this.geturl = this.router.url;
    // console.log(this.geturl);
    params = this.geturl.split('?vurl=');
    // console.log(params);
    this.verifyLink.vurl = params[1];
    // console.log(this.verifyLink);
    this.verifyURL();
  }

  getSubscriptionStatus() {
    this.generalService.getSubscriptionStatus()
      .subscribe(res => {
        console.log('lllll', res);
        localStorage.setItem('subscriptionDisableStatus', res['SubscriptionEnable']);
        this.subscriptionDisableStatus = res['SubscriptionEnable'];
      });
  }

  verifyURL() {
    if (this.verifyLink.vurl !== '' && this.verifyLink.vurl !== null && this.verifyLink.vurl !== undefined) {
      this.service.verfyUser(this.verifyLink).subscribe(res => {
        console.log(res);
        const verifyemail = res['entity'].email;
        localStorage.setItem('Verifieduser', res['entity']['userid']);
        localStorage.setItem('FirstTimeUser', 'true');
        //  behavioral subject
        this.service.updatedDataLogin(verifyemail);
        if (res['status'].status === 200) {
          this.toastr.success(res['status'].msg);
        }
        if (res['status'].status === 302) {
          this.toastr.success(res['status'].msg);
        }
      }, err => {
        console.log(err);
      });
    }
  }


  // firebase login's starts

  tryFacebookLogin() {
    this.registerSocial = {};
    this.service.doFacebookLogin()
      .then(res => {
        console.log(res);
        // this.router.navigate(['/user']);
        this.registerSocial.origin = 2;
        this.registerSocial.firstname = res['additionalUserInfo'].profile.first_name;
        this.registerSocial.lastname = res['additionalUserInfo'].profile.last_name;
        this.registerSocial.password = res['additionalUserInfo'].profile.id;
        this.registerSocial.facebookid = res['additionalUserInfo'].profile.id;
        this.registerSocial.email = res['additionalUserInfo'].profile.email;
        this.socialData = {
          userid: null,
          origin: this.registerSocial.origin,
          imgurl: res['additionalUserInfo'].profile.picture.data.url,
          firstname: res['additionalUserInfo'].profile.first_name,
          lastname: res['additionalUserInfo'].profile.last_name,
          email: res['additionalUserInfo'].profile.email,
          fbid: res['additionalUserInfo'].profile.id,
        };


        this.socialRegistrationLogin(this.registerSocial);
      });
  }

  tryTwitterLogin() {
    this.registerSocial = {};
    this.service.doTwitterLogin()
      .then(res => {
        console.log(res);
        console.log(res);
        // this.router.navigate(['/user']);
        this.registerSocial.origin = 5;
        this.registerSocial.firstname = res['additionalUserInfo'].profile.name;
        this.registerSocial.lastname = null;
        this.registerSocial.password = res['additionalUserInfo'].profile.id;
        this.registerSocial.twitterid = res['additionalUserInfo'].profile.id;

        this.socialData = {
          userid: null,
          origin: this.registerSocial.origin,
          imgurl: res['additionalUserInfo'].profile.profile_image_url,
          firstname: res['additionalUserInfo'].profile.name,
          lastname: null,
          twtrid: res['additionalUserInfo'].profile.id,
        };

        this.socialRegistrationLogin(this.registerSocial);
      });
  }

  tryGoogleLogin() {
    this.registerSocial = {};
    this.service.doGoogleLogin()
      .then(res => {
        console.log(res);
        // this.router.navigate(['/user']);

        this.registerSocial.origin = 3;
        this.registerSocial.firstname = res['additionalUserInfo'].profile.given_name;
        this.registerSocial.lastname = res['additionalUserInfo'].profile.family_name;
        this.registerSocial.password = res['additionalUserInfo'].profile.id;
        this.registerSocial.gmailid = res['additionalUserInfo'].profile.id;
        this.registerSocial.email = res['additionalUserInfo'].profile.email;

        this.socialData = {
          userid: null,
          origin: this.registerSocial.origin,
          imgurl: res['additionalUserInfo'].profile.picture,
          firstname: res['additionalUserInfo'].profile.given_name,
          lastname: res['additionalUserInfo'].profile.family_name,
          email: res['additionalUserInfo'].profile.email,
          gid: res['additionalUserInfo'].profile.id,
        };

        this.socialRegistrationLogin(this.registerSocial);
      });
  }
  tryLinkedinLogin() {
    // tslint:disable-next-line:max-line-length
    window.location.href = `https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=${environment.linkedinClientId}&redirect_uri=${environment.linkedinredirect}&scope=r_liteprofile%20r_emailaddress%20w_member_social`;
    // window.location.href = "https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=" + environment.linkedinClientId + "&redirect_uri="+ environment.linkedinredirect +"&scope=r_liteprofile%20r_emailaddress%20w_member_social";
  }
  signOut() {
    this.service.doLogout()
      .then((res) => {
        // this.location.back();
        console.log(res);

      }, (error) => {
        console.log('Logout error', error);
      });
  }

  getLinkedinAuthCode() {
    let params;
    let geturl;
    geturl = this.router.url;
    console.log(geturl);
    params = geturl.split('?code=');
    console.log(params);
    const code = params[1];
    this.loginLinkedin(code);
  }

  loginLinkedin(code) {
    this.registerSocial = {};
    console.log(code);
    this.service.doLinkedinLogin(code).subscribe(res => {
      console.log(res);
      this.registerSocial.origin = 4;
      this.registerSocial.firstname = res['localizedFirstName'];
      this.registerSocial.lastname = res['localizedLastName'];
      this.registerSocial.password = res['id'];
      this.registerSocial.linkedinid = res['id'];
      this.socialData = {
        userid: null,
        origin: this.registerSocial.origin,
        imgurl: '',
        firstname: res['localizedFirstName'],
        lastname: res['localizedLastName'],
        linkedinid: res['id']
      };
      this.socialRegistrationLogin(this.registerSocial);
    }, err => {
      console.log(err);
    });
  }

  socialRegistrationLogin(regdata) {
    console.log(regdata);
    regdata.usertype = 1;
    // providing verification link for web application
    console.log(this.registerData);
    this.service.usersRegister(regdata).subscribe(res => {
      console.log(res);
      if (res['entity'] !== null) {
        this.socialData.userid = res['entity']['userid'];
      }
      // checking status of user
      if (res['status']['status'] === 246) {
        // checking status of incompleted user
        this.toastr.clear();
        this.toastr.success(res['status']['msg']);
        //  behavioral subject
        this.service.updatedDataSelection(this.socialData);
        this.router.navigate(['/personal-information']);

      } else if (res['status']['status'] === 200) {
        this.service.updatedDataSelection(this.socialData);
        this.router.navigate(['/personal-information']);
      } else if (res['status']['status'] === 238) {
        // checking status of email unverified user
        this.toastr.clear();
        this.toastr.error(res['status']['msg']);

      } else if (res['status']['status'] === 248) {
        // checking status of inactive user
        this.toastr.clear();
        this.toastr.error(res['status']['msg']);

      } else if (res['status']['status'] === 210) {
        localStorage.setItem('UserId', res['entity']['userid']);
        this.socketConnection();
        // checking status of user to login
        localStorage.setItem('currentusertoken', res['entity']['login']['access_token']);
        this.toastr.clear();
        // setTimeout(() => {
        //   this.toastr.error(res['status']['msg']);
        // }, 200);
        this.subscriptionDisableStatus = localStorage.getItem('subscriptionDisableStatus');

        if (res['Subscription_status'] === false) {
          localStorage.setItem('subEnable', 'true');
          this.router.navigate(['/subscription']);
        } else {
          if (this.urlValue[1] == 'userlisthome') {
            if (localStorage.getItem('UserId') == this.urlValue[3]) {
              this.router.navigate(['/requestuserlist/' + this.urlValue[2]])
            }
            else {
              this.toastr.error("You don't have access to view this page");
              this.router.navigate(['/user-home']);

            }

          }
          else {
            this.router.navigate(['/user-home']);
          }
        }            // if ( res['entity'].subscriptionstatus === false) {
        //   this.router.navigate(['/user-home']);
        //   //needd to update this
        // } else {
        //   this.router.navigate(['/user-home']);
        // }
      }

    }, err => {
      console.log(err);

      //  if (err.error.status.status === 302) {

      //   localStorage.setItem('UserId', err.error.entity.userid);

      //   // checking status of user to login
      //     localStorage.setItem('currentusertoken', err.error.entity.login.access_token);

      //     console.log(err.error.entity.subscriptionstatus);

      //     // this.router.navigate(['/subscription']);
      //     if (err.error.entity.subscriptionstatus === false) {
      //       this.router.navigate(['/subscription']);
      //     } else {
      //       this.router.navigate(['/user-home']);
      //     }
      //   }
    });
  }

  // firebase login's ends

  passwordToggle() {
    this.togglePassword = !this.togglePassword;

    if (this.togglePassword) {
      this.passEye = './assets/images/businessin-icons/eye.svg';
      this.input_type = 'text';
    } else {
      this.passEye = './assets/images/businessin-icons/eye-slash.svg';
      this.input_type = 'password';
    }
  }


  registerUser() {
    this.registerflag = true;
    this.registerData.origin = 1;
    // providing verification link for web application
    this.registerData.usertype = 1;

    this.service.usersRegister(this.registerData).subscribe(res => {
      this.registerflag = false;
      console.log(res);
      if (res['status'].status === 200) {
        this.router.navigate(['/personal-information']);

        //  behavioral subject
        this.service.updatedDataSelection(res);

      } else if (res['status']['status'] === 246) {
        // checking status of incompleted user
        this.toastr.clear();
        this.toastr.success(res['status']['msg']);
        //  behavioral subject
        this.router.navigate(['/personal-information']);
        this.service.updatedDataSelection(res);


      } else if (res['status']['status'] === 248) {
        // checking status of inactive user
        this.toastr.clear();
        this.toastr.success(res['status']['msg']);

      } else {
        this.toastr.clear();
        this.toastr.error(res['status'].msg);
      }
    },
      err => {
        this.registerflag = false;
        console.log(err);

        // If user Already Exist
        console.log(err['error'].status.status);

        if (err['error'].status.status === 302) {
          this.toastr.error(err['error'].status.msg);
        }

      });

    // console.log(this.registerData);
  }



  successMessage(data: any) {
    this.toastr.clear();
    this.toastr.success(data);
  }

  errorMessage(data: any) {
    this.toastr.clear();
    this.toastr.error(data);
  }

  socketConnection() {
    let data = {};
    data = {
      'userId': localStorage.getItem('UserId')
    };
    console.log(data);
    this.socket.emit('new-user', data);
    this.socket.on('callback', function (res) {
      console.log(res, data);
    });
  }

}

