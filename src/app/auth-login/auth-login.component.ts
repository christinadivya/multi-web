import { Component, OnInit, EventEmitter, Output, TemplateRef } from '@angular/core';
import { RegisterService } from '../service/register.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';
import { ActivatedRoute } from '@angular/router';
import { LanguageService } from '../service/language.service';
import * as io from 'socket.io-client';
import { environment } from 'src/environments/environment';
import { GeneralService } from '../service/general.service';

@Component({
  selector: 'app-auth-login',
  templateUrl: './auth-login.component.html'
})
export class AuthLoginComponent implements OnInit {

  // private url = 'http://52.37.78.247:9004/';
  // private url = 'https://businessinchatdev.optisolbusiness.com/';
  socket;

  @Output() forgotpassword = new EventEmitter<boolean>();
  modalRef: BsModalRef;
  isModalShown = false;
  transferdata: any;
  togglePassword = false;
  passEyelogin: any = './assets/images/businessin-icons/eye-slash.svg';
  input_type_login: any = 'password';
  vurl: any;
  loginData: any = {};
  loginmail: any;
  subscriptionDisableStatus: any;
  urlValue;
  langData: any = {common: '', loginPage: ''};

  constructor(private services: RegisterService,
              private router: Router,
              private modalService: BsModalService,
              private toastr: ToastrService,
              private language: LanguageService,
              private generalService: GeneralService

              ) {
               }

  ngOnInit() {
    this.urlValue = this.router.url.split('/');
    this.services.cast.subscribe(res => this.transferdata = res);
    this.services.authlog.subscribe(res => this.loginmail = res);
    this.autoPopulateVerfiedUser();

    this.fetchLanguage();

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

  autoPopulateVerfiedUser() {
    const that = this;
    setTimeout(function () {
        if (that.loginmail !== '' && that.loginmail !== null) {
          that.loginData.username = that.loginmail;
          that.loginData.password = '';
          console.log(that.loginmail);
        }
    }, 3000);
  }

  forgotPassword() {
    this.forgotpassword.emit();
    console.log('test');
  }

  userLogin() {
    localStorage.setItem('thirdParty', null);
    console.log('subscriptionStatus ', localStorage.getItem('subscriptionDisableStatus'));
    this.generalService.getSubscriptionStatus()
    .subscribe(resVal => {
      console.log('lllll', resVal);
      localStorage.setItem('subscriptionDisableStatus', resVal['SubscriptionEnable']);
      this.subscriptionDisableStatus = resVal['SubscriptionEnable'];
      this.services.loginUser(this.loginData).subscribe(res => {
        console.log(res);
        if (res) {
          localStorage.setItem('UserId', res.User_id);
          localStorage.setItem('currentUser', res.access_token);

        const incompletedUser = {
          entity: {
          userprofile : {
            firstname : res['User_firstName'],
            lastname  : res['User_lastName'],
          },
          email     : this.loginData.username,
          userid    : res['User_id']
        }
        };
        if (res['Account_status']) {
        if (res['Account_status'].accstatus === 'Incomplete') {
          this.toastr.error('Please Complete Your Profile');
          //  behavioral subject
          this.services.updatedDataSelection(incompletedUser);

          this.router.navigate(['/personal-information']);
          this.loginData.username = '';
          this.loginData.password = '';

        } else if (res['Account_status'].accstatus === 'Verified') {
          this.socketConnection();
          localStorage.setItem('currentusertoken', res['access_token']);
          if (res['Subscription_status'] === false) {
            this.generalService.subEnable.next(true);
            localStorage.setItem('subEnable', 'true');
            this.router.navigate(['/subscription']);
          } else {
            if (this.urlValue[1] === 'userlisthome') {
              if (localStorage.getItem('UserId') === this.urlValue[3]) {
                this.router.navigate(['/requestuserlist/' + this.urlValue[2]]);
              } else {
                this.toastr.error("You don't have access to view this page");
                this.router.navigate(['/user-home']);
              }
            } else {
            this.router.navigate(['/user-home']);
            }
          }
        } else if (res['Account_status'].accstatus === 'Unverified') {
          this.isModalShown = true;
        }
      }
        if (res['error_code'] === 1) {
          // Invalid Credentials
          this.toastr.clear();
          this.toastr.error(res['error_description']);
        } else if (res['error_code'] === 4) {
          // User not found
          this.toastr.clear();
          this.toastr.error(res['error_description']);
        } else if (res['error_code'] === 5) {
          // Admin Account
          this.toastr.clear();
          this.toastr.error(res['error_description']);
        }
      }
    },
    err => {
      console.log(err);
    });
  });
  }

  passwordToggle() {
    this.togglePassword = !this.togglePassword;
    if (this.togglePassword) {
      this.passEyelogin = './assets/images/businessin-icons/eye.svg';
      this.input_type_login = 'text';
    } else {
      this.passEyelogin = './assets/images/businessin-icons/eye-slash.svg';
      this.input_type_login = 'password';
    }
  }


  openModal(template: TemplateRef<any>) {
    console.log(template);
    this.modalRef = this.modalService.show(
      template,
      Object.assign({}, { class: 'modal-custom' })
    );
  }

  socketConnection() {
    this.socket = io(environment.url);
    const data = {
      'userId': localStorage.getItem('UserId')
    };
    console.log(data);
    this.socket.emit('new-user', data);
    this.socket.on('callback', function(res, data) {
      console.log(res, data);
    });
  }

}
