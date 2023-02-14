import { Component, OnInit, TemplateRef, ViewChild, NgZone, Input, ElementRef, Renderer } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { PostService } from '../service/post.service';
import { environment } from 'src/environments/environment';
import { LanguageService } from '../service/language.service';
import { HttpParams } from '@angular/common/http';
import { MysubscriptionService } from '../service/mysubscription.service';
import * as moment from 'moment-timezone';
import { RefferalService } from '../service/refferal.service';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';
import { editAreaClick } from '@syncfusion/ej2-angular-richtexteditor';
import { BehaviorSubject } from 'rxjs';
@Component({
  selector: 'app-billing-tab',
  templateUrl: './billing-tab.component.html'
})

export class BillingTabComponent implements OnInit {
  @ViewChild('congratulations') public congratz: TemplateRef<any>;
  @ViewChild('failure') public failure: TemplateRef<any>;
  @ViewChild('CancelSubscribe') public CancelSubscribe: TemplateRef<any>;
  @ViewChild('deletepopup') public deletepopup: TemplateRef<any>;
  @ViewChild('name') nameElement: ElementRef;
  @ViewChild('myname') mynameElement: ElementRef;
  @ViewChild('cvvInput') searchInput: ElementRef;
  @ViewChild('mycvv') myInput: ElementRef;

  @Input() showContent: boolean;
  @Input() showPlanContent: boolean;
  editModePage = false;
  cvvDisabled = true;
  cardNumberShow = false;
  years: any = [];
  months: any[] = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'];
  currentDate = new Date();
  userId: string;
  mycard = false;
  plans = [];
  mySubscription;
  type = '';
  planType = '';
  planDuration = '';
  cardForm: FormGroup;
  reasonForm: FormGroup;
  submitted: boolean;
  template: any;
  cardnumber: any;
  expmonth: any;
  expyear: any;
  cvv: any;
  dt = new Date();
  startyear = this.dt.getFullYear();
  month = 1 + this.dt.getMonth();
  token: any;
  cardObject: any;
  trailPlan: any;
  customerId: any;
  myCard = false;
  userEmail: any;
  listCard: any;
  exists: boolean;
  cardDetails;
  showMainContent: any = false;
  showPlatinumContent: any = false;
  showPaymentContent = false;
  cardId: any;
  name: any;
  modalRef: BsModalRef;
  congratzmodalRef: BsModalRef;
  failuremodalRef: BsModalRef;
  deletemodalRef: BsModalRef;
  editMode = false;
  subscriptionPage = false;
  planObject: any;
  stripeCusId: any;
  planSelected = null;
  goldMonthly: any;
  platinumMonthly: any;
  goldYearly: any;
  platinumYearly: any;
  GoldPlanMonthly;
  GoldPlanYearly;
  PlatinumPlanMonthly;
  PlatinumPlanYearly;
  LimitedPlan;
  choosed = '';
  amount = '';
  hideRadio = true;
  managePlanId: any;
  showGold = true;
  showPlat = true;
  alreadySubscribed = false;
  sub_subscription_Id: any;
  itemsSubscribeId: any;
  showLimit = true;
  upgradeShow = true;
  CancelShow = false;
  ngxLoader = false;
  currentPlan: any;
  checkedYearly = false;
  checkedMonthly = false;
  editValue = false;
  brandImage = '';
  reasonsubmitted: boolean;
  message: any;
  monthlyHide = false;
  deletingCard = false;
  deletecardDetails: any;
  hideAutoRenewal = false;
  autoRenewal: any;
  subscriptionDate: any;
  choosenPlan: string;
  cardType: string;
  cardLength = 19;
  cardMask = '0000 0000 0000 0000';
  cvvLength = 4;
  invalidcard: boolean;
  index = -1;
  planName: any;
  showButton = true;
  showTextArea = false;

  langData: any = { common: '', billingPage: '' };

  constructor(private router: Router,
    private formBuilder: FormBuilder,
    private toastr: ToastrService,
    private postService: PostService,
    private language: LanguageService, private renderer: Renderer,
    private mysubscription: MysubscriptionService, private elementref: ElementRef,
    private refferalService: RefferalService, private modalService: BsModalService,
    private ngZone: NgZone) { }

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

  openModal(template: TemplateRef<any>) {
    console.log(template);

    this.modalRef = this.modalService.show(
      template,
      Object.assign({}, { class: 'br-5 cancel-subscription-modal' })
    );
  }

  openCongratzModal(congratulations: TemplateRef<any>) {
    console.log(congratulations);
    this.getmySubscription();
    this.congratzmodalRef = this.modalService.show(
      congratulations,
      Object.assign({}, { class: 'modal-custom  congrats-popup br-5' })
    );
  }

  openFailureModal(failure: TemplateRef<any>) {
    console.log(failure);
    // this.ngxLoader = false;
    this.failuremodalRef = this.modalService.show(
      failure,
      Object.assign({}, { class: 'modal-custom failure-popup br-44' })
    );
  }

  openDeleteModal(deletepopup: TemplateRef<any>) {
    console.log(deletepopup);
    this.ngxLoader = false;
    this.deletemodalRef = this.modalService.show(
      deletepopup,
      Object.assign({}, { class: 'modal-custom delete-popup br-44' })
    );
  }

  cancelOpen() {
    if (this.CancelShow) {
      this.openModal(this.CancelSubscribe);
    }
  }

  ngOnInit() {
    this.fetchLanguage();
    for (let i = 0; i <= 20; i++) {
      this.years.push(this.startyear + i);
    }
    this.mysubscription.billingEmit.subscribe((value) => {
      if (value === 'Billing') {
        this.showContent = true;
        this.showPlanContent = false;
        this.showPlatinumContent = false;
        this.showPaymentContent = false;
        this.subscriptionPage = false;
        this.deletingCard = false;
        this.editModePage = false;
        this.invalidcard = false;
      }
    });
    this.userId = localStorage.getItem('UserId');
    this.getAllCard();
    this.getallPlans();
    this.viewProfile();
    this.getmySubscription();
    if (localStorage.getItem('userPlan') !== null) {
      this.mySubscription = localStorage.getItem('userPlan');
      this.mySubscription = JSON.parse(this.mySubscription);
      localStorage.setItem('stripeId', this.mySubscription.stripecustomerid);
      if (this.mySubscription['plantype'] === 'Trail Platinum') {
        this.type = 'Free';
        this.planType = 'Trail Platinum';
        this.checkplantype('Platinum');
        this.hideAutoRenewal = false;
        this.subscriptionDate = this.mySubscription['expiredon'];
      } else if (this.mySubscription['plantype'] === 'Silver') {
        this.type = 'Basic Plan';
        this.planType = 'Silver';
        this.CancelShow = true;
        this.hideAutoRenewal = false;
        this.subscriptionDate = this.mySubscription['expiredon'];
      } else {
        this.type = '$' + this.mySubscription['price'];
        this.planType = this.mySubscription['plantype'];
        this.hideAutoRenewal = true;
        this.subscriptionDate = this.mySubscription['expiredon'];
        const renewal = moment(this.mySubscription['expiredon']).format('YYYY-MM-DD');
        this.autoRenewal = moment(renewal).add(1, 'days').format('YYYY-MM-DD 00:00:00');

      }
    }
    this.reasonForm = this.formBuilder.group({
      reason: ['', [Validators.required]]
    });
  }

  viewProfile() {
    let params = new HttpParams();
    params = params.append('userid', this.userId);
    params = params.append('pageNumber', '1');
    params = params.append('pageSize', '5');
    this.refferalService.getReferrerDetails(params).subscribe((res) => {
      if (res['status']['status'] === 200) {
        this.userEmail = res['entity']['userProfile']['email'];
      }
    });
  }

  getAllCard() {
    let params = new HttpParams();
    params = params.append('userId', this.userId.toString());
    this.mysubscription.getAllMyCard(params).subscribe((res) => {
      if (res['status']['status'] === 200) {
        if (res['entity'].length > 0) {
          this.mycard = true;
          this.cardDetails = res['entity'][0];
          this.getbrandImage(this.cardDetails.brand);
          if (this.deletingCard) {
            this.deletecardDetails = res['entity'][0];
            this.deleteCard();
          }
          // this.listmystripeCard();
        } else {
          this.mycard = false;
          this.cardDetails = {};
        }
      }
    }, err => {
      this.ngxLoader = false;
      console.log(err);
    });
  }

  getallPlans() {
    this.mysubscription.getAllPlans().subscribe(async (res) => {
      if (res['status']['status'] === 200) {
        console.log('res--------------------------->', res);
        if (res['entity']) {
          this.goldMonthly = res['entity']['goldmonthamount'];
          this.goldYearly = res['entity']['goldyearamount'];
          this.platinumMonthly = res['entity']['platinummonthamount'];
          this.platinumYearly = res['entity']['platinumyearamount'];

          await res['entity']['managePlanList'].map((ele) => {
            if (ele['planname'] === 'Gold' && ele['intervaltype'] === 'month') {
              this.plans.push(ele);
              this.GoldPlanMonthly = ele;
            }
            if (ele['planname'] === 'Gold' && ele['intervaltype'] === 'year') {
              this.plans.push(ele);
              this.GoldPlanYearly = ele;
            }
            if (ele['planname'] === 'Platinum' && ele['intervaltype'] === 'month') {
              this.plans.push(ele);
              this.PlatinumPlanMonthly = ele;
            }
            if (ele['planname'] === 'Platinum' && ele['intervaltype'] === 'year') {
              this.plans.push(ele);
              this.PlatinumPlanYearly = ele;
            }
            if (ele['planname'] === 'Limited Platinum') {
              this.plans.push(ele);
              this.LimitedPlan = ele;
            }
            if (ele['planname'] === 'Silver') {
              this.plans.push(ele);
              // this.LimitedPlan = ele;
            }
            console.log('plansss----------------------->', this.plans);
          });
          if (this.plans.length > 0) {
            if (this.planType === 'Trail Platinum') {
              this.checkplantype('Platinum');
            } else {
            this.checkplantype(this.planType);
            }
          }
        } else {
          this.plans = [];
        }
      }
    }, err => {
      this.plans = [];
    });
  }

checkplantype(planType) {
  this.index = this.plans.findIndex((item => item.planname === planType));
}

  convertutctolocal(value): string {
    if (value) {
      const time = value.toString().split(' ');
      return this.setLocaldatetime(time[0], time[1]);
    }
  }

  setLocaldatetimewithsecond(date, time) {
    let now_utc1 = '0';
    let local;
    if (date && time) {
      const now1 = new Date(date + ' ' + time);
      local = moment(now1).subtract(this.currentDate.getTimezoneOffset(), 'm').toDate();
      now_utc1 = local.getFullYear() + '-' + this.chkLength((local.getMonth() + 1)) + '-' + this.chkLength(local.getDate());
    }
    return now_utc1;
  }

  setLocaldatetime(date, time2): string {
    const timeobj = time2.split(':');
    const time1 = timeobj[0] + ':' + timeobj[1] + ':00';
    let now_utc1 = '0';
    let local;
    if (date && time1) {
      const now1 = new Date(date + ' ' + time1);
      local = moment(now1).subtract(this.currentDate.getTimezoneOffset(), 'm').toDate();
      now_utc1 = local.getFullYear() + '-' + this.chkLength((local.getMonth() + 1))
        + '-' + this.chkLength(local.getDate()) + ' ' + this.chkLength((local.getHours())) + ':' + this.chkLength(local.getMinutes());
    }
    return now_utc1;
  }

  chkLength(data) {
    if (data.toString().length === 1) {
      return '0' + data.toString();
    } else {
      return data;
    }
  }

  createCardToken() {
    this.cardForm = this.formBuilder.group({
      name: ['', Validators.required],
      cardnumber: ['', Validators.required],
      expmonth: ['', Validators.required],
      expyear: ['', Validators.required],
      cvv: ['', Validators.required],
    });
  }

  createToken() {
    this.toastr.clear();
    const cvvNumber = this.cardForm.value['cvv'];
    this.submitted = true;
    if (this.cardForm.invalid) {
      return;
    }
    // tslint:disable-next-line:radix
    if (this.cardForm.value['name'].trim().length === 0) {
      this.toastr.error('Enter Proper Card Holder Name');
    } else if (cvvNumber.toString().length > 4) {
      this.toastr.error('Enter Only 3 to 4 digits');
    } else if (this.subscriptionPage === true && this.mycard === false &&
      this.checkedMonthly === false && this.choosed !== 'limited' && this.checkedYearly === false
      && this.deletingCard === false) {
      this.toastr.clear();
      this.toastr.error('Please select the payment interval');
    } else if (parseInt(this.cardForm.value['expmonth']) < this.month && this.startyear === parseInt(this.cardForm.value['expyear'])) {
      this.toastr.error('Card Expired');

    } else {
      window.scrollTo(0, 0);
      this.showMainContent = false;
      this.editMode = false;
      this.editModePage = false;
      this.submitted = false;
      this.ngxLoader = true;
      this.cardnumber = this.cardForm.value['cardnumber'];
      this.expmonth = this.cardForm.value['expmonth'];
      this.expyear = this.cardForm.value['expyear'];
      this.cvv = this.cardForm.value['cvv'];
      let cardDetails = {};
      cardDetails = {
        number: this.cardnumber,
        exp_month: this.expmonth,
        exp_year: this.expyear,
        cvc: this.cvv,
        name: this.cardForm.value['name'].trim()
      };

      (<any>window).Stripe.card.createToken(cardDetails, (status: number, response: any) => {
        if (status === 200) {
          if (response && response.id) {
            console.log(response);
            this.token = response.id;
            this.cardObject = response.card;
            this.createCustomer();
            //  this.toastr.success('Subscribed successfully');
            this.cardForm.reset();
            this.submitted = false;
          }
        } else if (status === 402 || status === 400) {
          this.cardForm.reset();
          this.message = response.error.message;
          this.openFailureModal(this.failure);
          this.ngZone.run(() => {
            this.ngxLoader = false;
          });
        }
        // else if (status === 400) {
        //   this.cardForm.reset();
        //   this.message = response.error.message;
        //   this.openFailureModal(this.failure);
        //   this.ngZone.run(() => {
        //     this.ngxLoader = false;
        //   });
        // }
      }, err => {
        this.cardForm.reset();
        this.message = err.error.message;
        this.openFailureModal(this.failure);
        this.ngZone.run(() => {
          this.ngxLoader = false;
        });
      });
    }
  }

  createCustomer() {
    this.cardForm.reset();
    const data = {
      source: this.token,
      email: this.userEmail
    };
    if (this.stripeCusId === null) {
      this.mysubscription.createStripeCustomer(data).subscribe(async (res) => {
        if (res) {
          localStorage.setItem('stripeId', res['id']);
          this.stripeCusId = res['id'];
          // this.listmystripeCard();
          this.customerId = res['id'];
          const card = res['sources']['data'][0];
          // To build the req for saving card
          const cardDetails = {
            last4: card['last4'],
            exp_month: card['exp_month'],
            exp_year: card['exp_year'],
            cvc_check: card['cvc_check'],
            brand: card['brand'],
            country: card['country'],
            stripeCardId: card['id'],
            stripe_cus_id: res['id'],
            cardHolderName: card['name']
          };
          // to save card
          if (card['cvc_check'] !== null && card['country'] !== null) {
            this.saveCard(cardDetails, '');
          }
        } else {
          this.message = 'Card Invalid';
          this.cardForm.reset();
          this.openFailureModal(this.failure);
          this.ngZone.run(() => {
            this.ngxLoader = false;
          });
        }
      }, err => {
        this.cardForm.reset();
        this.message = err.error.error.message;
        this.openFailureModal(this.failure);
        this.ngZone.run(() => {
          this.ngxLoader = false;
        });
      });
    } else {
      this.mysubscription.retriveToken(this.token).subscribe((token) => {
        console.log(typeof token['card']['fingerprint']);
        const addCard = {
          customerId: (localStorage.getItem('stripeId') === null) ? this.customerId : localStorage.getItem('stripeId'),
          source: this.token
        };
        this.mysubscription.addCardToStripeCustomer(addCard).subscribe((res) => {
          if (res) {
            const card = res;
            console.log(card);
            // To build the req for saving card
            const cardDetails = {
              last4: card['last4'],
              exp_month: card['exp_month'],
              exp_year: card['exp_year'],
              cvc_check: card['cvc_check'],
              brand: card['brand'],
              country: card['country'],
              stripeCardId: card['id'],
              stripe_cus_id: card['customer'],
              cardHolderName: card['name']
            };
            // to save card
            const data = {
              customerId: (localStorage.getItem('stripeId') === null) ? this.stripeCusId : localStorage.getItem('stripeId'),
              default_source: card['id']
            };
            this.mysubscription.changeDefaultCardStripe(data).subscribe((res) => {
              if (res) {
                if (cardDetails['cvc_check'] !== null && cardDetails['country'] !== null) {
                  this.saveCard(cardDetails, '');
                }
              }
            }, err => {
              this.cardForm.reset();
              this.message = err.error.error.message;
              this.openFailureModal(this.failure);
              this.ngZone.run(() => {
                this.ngxLoader = false;
              });
            });
          }
        }, err => {
          this.cardForm.reset();
          this.message = err.error.error.message;
          this.openFailureModal(this.failure);
          this.ngZone.run(() => {
            this.ngxLoader = false;
          });
        });
      }, error => {
        this.cardForm.reset();
        this.message = error.error.message;
        this.openFailureModal(this.failure);
        this.ngZone.run(() => {
          this.ngxLoader = false;
        });
      });
    }
  }

  PlanSelected(value) {
    this.planSelected = value;
    this.choosed = (this.planSelected === 'monthly') ? 'monthly' : 'yearly';
    if (this.choosenPlan === 'Gold' && this.planSelected === 'monthly') {
      this.planObject = this.GoldPlanMonthly;
    } else if (this.choosenPlan === 'Gold' && this.planSelected === 'yearly') {
      this.planObject = this.GoldPlanYearly;
    }
    if (this.choosenPlan === 'Platinum' && this.planSelected === 'monthly') {
      this.planObject = this.PlatinumPlanMonthly;
    } else if (this.choosenPlan === 'Platinum' && this.planSelected === 'yearly') {
      this.planObject = this.PlatinumPlanYearly;
    }
    if (this.choosenPlan === 'Platinum' && this.planSelected === 'yearly'
      && this.currentPlan['plantype'] === 'Gold' && this.currentPlan['planduration'] === 'year') {
      this.amount = (parseFloat(this.planObject['price']) - parseFloat(this.currentPlan['price'])).toString();
    } else {
      this.amount = this.planObject['price'];
    }
    this.managePlanId = this.planObject['stripeplanid'];
    if (this.planSelected === 'yearly') {
      if (this.planObject['planname'] === 'Gold') {
        this.planObject = this.GoldPlanYearly;
      } else if (this.planObject['planname'] === 'Platinum') {
        this.planObject = this.PlatinumPlanYearly;
      }
    }
    if (this.planSelected === 'yearly') {
      this.checkedYearly = true;
      this.checkedMonthly = false;
    } else {
      this.checkedYearly = false;
      this.checkedMonthly = true;
    }
  }

  saveCard(card: any, value: string) {
    this.toastr.clear();
    let cardData;
    console.log(card);
    if (value === '') {
      cardData = {
        'expmonth': card.exp_month,
        'expyear': card.exp_year,
        'brand': card.brand,
        'cardholdername': card.cardHolderName,
        'country': card.country,
        'cvccheck': card.cvc_check,
        'last4': card.last4,
        'stripecardid': card.stripeCardId,
      };
    } else if (value === 'edit') {
      cardData = {
        'expmonth': card.exp_month,
        'expyear': card.exp_year,
        'brand': card.brand,
        'cardholdername': card.cardHolderName,
        'country': card.country,
        'cvccheck': card.cvc_check,
        'last4': card.last4,
        'stripecardid': card.stripeCardId,
        'id': card.id
      };
    }

    this.mysubscription.createCard(cardData).subscribe((res) => {
      this.getbrandImage(cardData.brand);
      if (this.subscriptionPage === false) {
        if (res['status']['status'] === 200) {
          if (value === 'edit') {
            this.toastr.success('Card details are updated successfully');
          } else {
            this.toastr.success('Card details are created successfully');
          }
          this.getAllCard();
          this.ngZone.run(() => {
            this.ngxLoader = false;
          });
        }
      } else {
        if (this.subscriptionPage && this.deletingCard === false && this.alreadySubscribed === false) {
          this.showPaymentContent = false;
          this.showPlatinumContent = false;
          this.createSubscription();
        } else if (this.subscriptionPage && this.deletingCard === false && this.alreadySubscribed) {
          this.showPaymentContent = false;
          this.showPlatinumContent = false;
          this.updateSubscription();
        }
        if (this.deletingCard) {
          this.toastr.success(res['status']['msg']);
          this.getAllCard();
          this.getmySubscription();
        }
      }
    }, err => {
      this.ngxLoader = false;
      console.log(err);
    });
  }

  getbrandImage(brand) {
    if (brand === 'Visa') {
      this.brandImage = './assets/images/visa.svg';
    }
    if (brand === 'MasterCard') {
      this.brandImage = '/./assets/images/mastercard-old.svg';
    }
    if (brand === 'Discover') {
      this.brandImage = './assets/images/discover.svg';
    }
    if (brand === 'American Express') {
      this.brandImage = './assets/images/amex.svg';
    }
    if (brand === 'Diners Club') {
      this.brandImage = './assets/images/diners.svg';

    }
    if (brand === 'JCB') {
      this.brandImage = './assets/images/jcb.svg';

    }
    if (brand === 'UnionPay') {
      this.brandImage = './assets/images/unionpay.svg';

    }
  }

  onSubmitSubscription() {
    this.toastr.clear();
    console.log(this.choosed, '%%%%');
    if (this.mycard === true) {
      if (this.checkedMonthly === false && this.choosed !== 'limited' && this.checkedYearly === false) {
        this.toastr.error('Please select the payment interval');
      } else {
        if (this.subscriptionPage === true && this.alreadySubscribed === false) {
          this.showPaymentContent = false;
          this.showPlatinumContent = false;
          this.ngxLoader = true;
          this.createSubscription();
        } else if (this.subscriptionPage === true && this.alreadySubscribed === true) {
          this.showPaymentContent = false;
          this.showPlatinumContent = false;
          this.ngxLoader = true;
          this.updateSubscription();
        }
      }
    } else {
      this.toastr.error(`You don't have card. Please save card`);
    }
  }

  updateSubscription() {
    let params;
    if (this.planObject['planname'] === 'Limited Platinum') {
      params = {
        cancel_at_period_end: true,
        userId: localStorage.getItem('userId'),
        planId: this.managePlanId,
        subscriptionId: this.sub_subscription_Id,
        itemsSubscribeId: this.itemsSubscribeId,
        cancel: true
      };
    } else {
      params = {
        userId: localStorage.getItem('userId'),
        planId: this.managePlanId,
        subscriptionId: this.sub_subscription_Id,
        itemsSubscribeId: this.itemsSubscribeId,
        cancel: true
      };
    }


    if (this.mycard === false) {
      this.ngxLoader = false;
      this.toastr.error(`You don't have any card, kindly add card`);
    } else {
      this.mysubscription.updateStripeSubscription(params).subscribe((res) => {
        console.log(res);
        const data = {
          userId: localStorage.getItem('UserId'),
          manageplanId: this.planObject.manageplanid,
          // subscriptionId: this.subscriptionId,
          stripe_subcription_id: res['id'],
          itemSubscriptionId: res['items']['data'][0]['id'],
          interval_type: res['items']['data'][0]['plan']['interval'],
          interval_count: res['items']['data'][0]['plan']['interval_count']
        };
        this.mysubscription.addSubscription(data).subscribe((datas) => {
          console.log(datas);
          if (datas && datas['status']['status'] === 200) {
            // this.toastr.success(datas['status']['msg']);
            this.getAllCard();
            this.CancelShow = false;
            this.showMainContent = false;
            this.showPlatinumContent = false;
            this.showPaymentContent = false;
            this.subscriptionPage = false;
            this.showPlanContent = false;
            this.showContent = true;
            this.ngxLoader = false;
            this.message = `Subscription Upgraded successfully to the ${this.planObject['planname']} plan`;
            this.openCongratzModal(this.congratz);
          }
        });
      }, err => {
        this.message = `Subscribed Failed to the ${this.planObject['planname']} plan`;
        this.openFailureModal(this.failure);
        this.ngZone.run(() => {
          this.ngxLoader = false;
        });
      });
    }
  }

  getmySubscription() {
    this.type = '';
    this.planType = '';
    this.subscriptionDate = '';
    this.planDuration = '';
    const today_Date = new Date();
    let params = new HttpParams();
    params = params.append('userId', this.userId.toString());
    this.mysubscription.getMySubscription(params).subscribe((res) => {
      if (res['status']['status'] === 200) {
        this.currentPlan = res['entity'];
        console.log(res['entity']);

        localStorage.setItem('userPlanType', this.currentPlan['plantype']);
        this.planName = localStorage.getItem('userPlanType');
        const currentDate = res['entity']['updateon'];
        this.showLimit = (res['entity']['limitedplatinumcount'] === true) ? false : true;
        this.sub_subscription_Id = res['entity']['stripesubscriptionid'];
        this.itemsSubscribeId = res['entity']['stripeitemsubscriptionid'];
        this.checkplantype(this.currentPlan['plantype']);
        if (this.currentPlan['plantype'] === 'Trail Platinum') {
          this.showButton = false;
          this.type = 'Free';
          this.planType = 'Trail Platinum';
          this.checkplantype('Platinum');
          this.hideAutoRenewal = false;
          this.subscriptionDate = res['entity']['expiredon'];
        } else if (this.currentPlan['plantype'] === 'Silver') {
          // this.CancelShow = true;
          this.type = 'Basic Plan';
          this.planType = 'Silver';
          this.planDuration = '';
          this.hideAutoRenewal = false;
          this.subscriptionDate = res['entity']['expiredon'];
        } else {
          this.type = '$' + res['entity']['price'];
          this.planType = res['entity']['plantype'];
          this.planDuration = '/' + res['entity']['planduration'];
          this.hideAutoRenewal = true;
          this.subscriptionDate = res['entity']['expiredon'];
          const renewal = moment(res['entity']['expiredon']).format('YYYY-MM-DD');
          this.autoRenewal = moment(renewal).add(1, 'days').format('YYYY-MM-DD 00:00:00');
        }
        if (res['entity']['plantype'] === 'Gold') {
          if (res['entity']['planduration'] === 'year') {
            this.showGold = false;
          } else {
            this.monthlyHide = true;
            this.showGold = true;
          }
          if (moment(today_Date).format('YYYY-MM-DD') >=
            moment(currentDate).add(this.currentPlan.validmonth, 'M').format('YYYY-MM-DD')) {
            this.CancelShow = true;
          }
        }
        if (res['entity']['plantype'] === 'Limited Platinum') {
          this.showLimit = false;
          this.showGold = true;
          this.showPlat = true;
        }
        if (res['entity']['plantype'] === 'Platinum') {
          this.showLimit = false;
          this.showGold = false;
          if (res['entity']['planduration'] === 'year') {
            this.monthlyHide = true;
            this.showPlat = false;
          }
          if (moment(today_Date).format('YYYY-MM-DD') >=
            moment(currentDate).add(this.currentPlan.validmonth, 'M').format('YYYY-MM-DD')) {
            this.CancelShow = true;
          }
        }
        if (res['entity']['plantype'] === 'Platinum' || res['entity']['plantype'] === 'Gold' ||
          res['entity']['plantype'] === 'Limited Platinum') {
          this.alreadySubscribed = true;
        }
        localStorage.setItem('userPlanType', res['entity']['plantype']);
        localStorage.setItem('userPlan', JSON.stringify(res['entity']));
        localStorage.setItem('stripeId', res['entity']['stripecustomerid']);
        this.stripeCusId = res['entity']['stripecustomerid'];
        console.log(localStorage.getItem('userPlanType'));
        this.mysubscription.updatedPlanName.next(localStorage.getItem('userPlanType'));
      } else if (res['status']['status'] === 204) {
        localStorage.setItem('userPlanType', '');
        localStorage.setItem('userPlan', null);
      }
      console.log(this.alreadySubscribed);
      this.ngZone.run(() => {
        this.ngxLoader = false;
      });
    });
  }

  planChoosen(data) {
    this.deletingCard = false;
    this.choosenPlan = data;
    this.submitted = false;
    this.checkedYearly = false;
    this.checkedMonthly = false;
    this.choosed = '';
    this.amount = '';
    if (this.mycard) {
      this.editModePage = false;
      this.editMode = false;
      this.editValue = false;
    } else {
      this.editValue = false;
      this.editMode = true;
    }
    if (data === 'Gold') {
      if (this.currentPlan['plantype'] === 'Gold' && this.currentPlan['planduration'] === 'month') {
        this.planObject = this.GoldPlanYearly;
        this.monthlyHide = false;
      } else {
        this.monthlyHide = false;
        this.planObject = this.GoldPlanMonthly;
      }
      this.hideRadio = true;
      this.choosed = '';
      this.managePlanId = this.planObject['stripeplanid'];
    } else if (data === 'Limited') {
      this.planObject = this.LimitedPlan;
      this.choosed = 'limited';
      this.amount = this.planObject['price'];
      this.managePlanId = this.planObject['stripeplanid'];
      this.hideRadio = false;
    } else if (data === 'Platinum') {
      if (this.currentPlan['plantype'] === 'Platinum' && this.currentPlan['planduration'] === 'month') {
        this.planObject = this.PlatinumPlanYearly;
        this.monthlyHide = true;
      } else {
        this.monthlyHide = false;
        this.planObject = this.PlatinumPlanMonthly;
      }
      this.hideRadio = true;
      this.choosed = '';
      this.managePlanId = this.planObject['stripeplanid'];
    }
    if (this.alreadySubscribed === true && this.currentPlan['plantype'] !== 'Limited Platinum') {
      if (data === this.currentPlan['plantype']) {
        (this.currentPlan['planduration'] === 'year') ? this.choosed = 'yearly' : this.choosed = 'monthly';
      }
    }

  }

  createSubscription() {
    let data;
    if (this.planObject['planname'] === 'Limited Platinum') {
      data = {
        cancel_at_period_end: true,
        customer: this.stripeCusId,
        planId: this.managePlanId
      };
    } else {
      data = {
        customer: this.stripeCusId,
        planId: this.managePlanId
      };
    }
    this.mysubscription.createSubscription(data).subscribe((res) => {
      console.log(res, this.planObject);
      if (res) {
        const updateData = {
          userId: localStorage.getItem('UserId'),
          manageplanId: this.planObject['manageplanid'],
          stripe_subcription_id: res['id'],
          itemSubscriptionId: res['items']['data'][0]['id'],
          interval_type: res['items']['data'][0]['plan']['interval'],
          interval_count: res['items']['data'][0]['plan']['interval_count']
        };
        // this.toastr.success('Subscribed c');
        this.mysubscription.addSubscription(updateData).subscribe((response) => {
          if (response) {
            // this.toastr.success(response['status']['msg']);
            localStorage.setItem('subscribed', 'true');
            this.getAllCard();
            this.CancelShow = false;
            this.showMainContent = false;
            this.showPlatinumContent = false;
            this.showPaymentContent = false;
            this.subscriptionPage = false;
            this.showPlanContent = false;
            this.showContent = true;
            this.message = `Subscribed successfully to the ${this.planObject['planname']} plan`;
            this.openCongratzModal(this.congratz);
            this.ngZone.run(() => {
              this.ngxLoader = false;
            });
          }
        }, err => {
          this.message = `Subscribed Failed to the ${this.planObject['planname']} plan`;
          this.openFailureModal(this.failure);
          this.ngZone.run(() => {
            this.ngxLoader = false;
          });
        });
      } else {
        this.cardForm.reset();
        this.submitted = false;
        this.message = `Subscribed Failed to the ${this.planObject['planname']} plan`;
        this.openFailureModal(this.failure);
        this.ngZone.run(() => {
          this.ngxLoader = false;
        });
      }
    }, err => {
      this.message = `Subscribed Failed to the ${this.planObject['planname']} plan`;
      this.openFailureModal(this.failure);
      this.ngxLoader = false;
      this.ngZone.run(() => {
        this.ngxLoader = false;
      });
    });
  }

  numberOnly(event): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }

  Showplan() {
    this.toastr.clear();
    this.deletingCard = false;
    if (this.showLimit === false && this.showPlat === false && this.showGold === false) {
      this.toastr.error('No more plans to upgrade');
    } else {
      this.subscriptionPage = true;
      this.showPlanContent = true;
      this.showContent = false;
      this.showMainContent = false;
      this.editValue = false;
    }
  }

  ShowLimitedPlatinum() {

    this.showPlatinumContent = true;
    this.showPaymentContent = true;
    this.subscriptionPage = true;
    this.createCardToken();

  }


  ShowPlatinum() {
    // this.showMainContent = false;
    this.showPlatinumContent = true;
    this.showPaymentContent = true;
    this.subscriptionPage = true;
    this.editValue = false;
    this.createCardToken();

  }

  listmystripeCard() {
    if (localStorage.getItem('stripeId')) {
      this.mysubscription.listMyCards().subscribe((data) => {
        console.log('%%%', data['data']);
        this.listCard = data['data'];
      }, err => {
        // this.toastr.error(err.error.message);
      });
    }
  }

  editOpen() {
    this.focusingName();
    this.editValue = true;
    this.cardNumberShow = true;
    this.cvvDisabled = false;
    this.cardId = this.cardDetails.stripecardid;
    let expmonth;
    if (this.cardDetails.expmonth !== 10 && this.cardDetails.expmonth !== 11 && this.cardDetails.expmonth !== 12) {
      expmonth = '0' + this.cardDetails.expmonth;
    } else {
      expmonth = this.cardDetails.expmonth;
    }
    this.editModePage = (this.subscriptionPage === true) ? true : false;
    if (this.subscriptionPage === true) {
      this.showMainContent = false;
    }

    if (this.subscriptionPage === false || this.subscriptionPage === true) {
      this.cardForm = this.formBuilder.group({
        name: ['', Validators.required],
        cardnumber: ['', Validators.required],
        expmonth: ['', Validators.required],
        expyear: ['', Validators.required],
        cvv: [''],
      });

      this.cardForm.controls['name'].setValue(this.cardDetails.cardholdername);
      this.cardForm.controls['cardnumber'].setValue(`XXXX XXXX XXXX ${this.cardDetails.last4}`);
      console.log(this.cardForm.controls);
      this.cardForm.controls['expmonth'].setValue(expmonth);
      this.cardForm.controls['expyear'].setValue(this.cardDetails.expyear);
    }
  }

  editCard() {
    this.toastr.clear();
    this.submitted = true;
    if (this.cardForm.invalid === true) {
      return;
    }
    // tslint:disable-next-line:radix
    if (this.cardForm.value['name'].trim().length === 0) {
      this.toastr.error('Enter Proper Name');
    } else if (this.subscriptionPage === true && this.mycard === true &&
      this.checkedMonthly === false && this.choosed !== 'limited' && this.checkedYearly === false) {
      this.toastr.error('Please select the payment interval');
    } else if (parseInt(this.cardForm.value['expmonth']) < this.month && this.startyear === parseInt(this.cardForm.value['expyear'])) {
      this.toastr.error('Card Expired');
    } else {
      window.scrollTo(0, 0);
      this.showMainContent = false;
      this.ngxLoader = true;
      this.expmonth = this.cardForm.value['expmonth'];
      this.expyear = this.cardForm.value['expyear'];
      this.name = this.cardForm.value['name'].trim();
      let Details = {};
      Details = {
        exp_month: this.expmonth,
        exp_year: this.expyear,
        name: this.name,
        customerId: this.stripeCusId,
        cardId: this.cardId,
      };
      // console.log(Details, '$$$$$$$$$$$$$$444');
      this.mysubscription.updateStripeCard(Details).subscribe((res) => {
        console.log(res);
        this.cardForm.reset();
        this.submitted = false;
        this.cvvDisabled = true;
        this.editModePage = false;
        this.editMode = false;
        // this.spinner.show();
        const data = {
          'exp_month': this.expmonth,
          'exp_year': this.expyear,
          'brand': this.cardDetails.brand,
          'cardHolderName': this.name,
          'last4': this.cardDetails.last4,
          'stripeCardId': this.cardId,
          'id': this.cardDetails.id,
          'cvc_check': res['cvc_check'],
          'country': res['country']
        };
        if (res['cvc_check'] !== null && res['country'] !== null) {

          this.saveCard(data, 'edit');
        }

      }, err => {
        this.showMainContent = false;
        this.cardForm.reset();
        this.submitted = false;
        this.cvvDisabled = true;
        this.editModePage = false;
        this.editMode = false;
        this.ngxLoader = false;
        // this.openFailureModal(err.error.error.message);
      });
    }
  }

  deleteCard() {
    this.ngxLoader = true;
    let cardDetails = {};
    cardDetails = {
      customerId: this.stripeCusId,
      cardId: this.deletecardDetails.stripecardid
    };
    console.log(cardDetails);
    this.mysubscription.deleteStripeCard(cardDetails).subscribe((res) => {
      console.log(res);
      this.deleteUserCard();
    }, err => {
      this.toastr.error(err.error.error);
      this.ngZone.run(() => {
        this.ngxLoader = false;
      });
    });
  }

  deleteUserCard() {
    let params = new HttpParams();
    params = params.append('cardId', this.deletecardDetails.id);
    this.mysubscription.deleteCard(params).subscribe((res) => {
      console.log(res);
      if (res['status']['status'] === 200) {
        this.deletingCard = false;
        this.getAllCard();
        this.showMainContent = false;
        this.editModePage = false;
        this.editMode = false;
        this.ngZone.run(() => {
          this.ngxLoader = false;
        });
      }
    }, err => {
      console.log(err);
      this.ngZone.run(() => {
        this.ngxLoader = false;
      });
    });
  }

  CancelStripeSubscription() {
    this.reasonsubmitted = true;
    this.toastr.clear();
    const value = this.reasonForm.value['reason'].trim().length;
    if (this.reasonForm.invalid) {
      return;
    }
    if (value === 0) {
      this.toastr.error('Enter the valid reason');
    } else {
      const data = {
        subscriptionId: this.currentPlan['stripesubscriptionid']
      };
      this.ngxLoader = true;
      this.mysubscription.cancelSubscriptionPlan(data).subscribe((response) => {
        console.log(response);
        if (response['status'] === 'canceled') {
          const cancelSub = {
            subscriptionId: this.currentPlan['stripesubscriptionid'],
            userPlanId: this.currentPlan['userplanid'],
            cancelSubscriptionReason: this.reasonForm.value.reason,
          };
          this.mysubscription.cancelmySubscription(cancelSub).subscribe((data) => {
            console.log(data);
            if (data && data['status']['status'] === 200) {
              // this.CancelShow = true;
              this.toastr.success(data['status']['msg']);
              this.modalRef.hide();
              this.getmySubscription();
              this.ngZone.run(() => {
                this.ngxLoader = false;
              });

            }
          }, err => {
            this.toastr.error(err.error.msg);
          });
        }
      }, err => {
        this.toastr.error(`Can't cancel Subscription`);
        this.ngxLoader = false;
      });
    }
  }

  checkLength(value) {
    this.toastr.clear();
    if (value.toString().length > 4) {
      this.toastr.error('Enter Only 3 to 4 digits');
    }
  }

  showPayment() {
    this.createCardToken();
    this.deletemodalRef.hide();
    this.deletingCard = true;
    this.cvvDisabled = true;
    this.editValue = false;
    if (this.subscriptionPage === false) {
      this.showMainContent = true;
      // this.scrollToBottom();
    } else if (this.subscriptionPage) {
      this.editMode = true;
      this.editModePage = true;
    }
  }

  focusingName() {
    if (this.subscriptionPage) {
      setTimeout(() => this.nameElement.nativeElement.focus(), 0);
    } else {
      setTimeout(() => this.mynameElement.nativeElement.focus(), 0);

    }
  }

  closeDelete() {
    this.showMainContent = false;
    this.deletemodalRef.hide();
  }

  closeMainContent() {
    this.showMainContent = false;
  }

  closeShowpaymentcontent() {
    this.editMode = false;
    this.editModePage = false;
  }

  checkCardType() {
    console.log(this.cardForm);
    this.cvvClear();
    this.cvvLength = 3;
    this.cardType = '';
    this.cardForm.controls['cardnumber'].clearValidators();
    this.cardForm.controls['cardnumber'].setValidators([Validators.required, Validators.minLength(16)]);
    this.cardForm.controls['cvv'].clearValidators();
    this.cardForm.controls['cvv'].setValidators([Validators.required, Validators.minLength(3)]);
    if (/^(34)|^(37)/.test(this.cardForm.value['cardnumber'])) {
      this.cardType = 'amex';
      this.cardForm.controls['cardnumber'].setValidators([Validators.required, Validators.minLength(15)]);
      this.cardForm.controls['cvv'].setValidators([Validators.required, Validators.minLength(4)]);
      this.cvvLength = 4;
    }
  }

  cvvClear() {
    if (this.subscriptionPage) {
      setTimeout(() => {
        // this.elementref.nativeElement, 'click', event;
        this.searchInput.nativeElement.focus();
          this.searchInput.nativeElement.value = null;
      }, 0);
    } else {
      setTimeout(() => {
        // this.elementref.nativeElement, 'click', event;
        this.myInput.nativeElement.focus();
        this.myInput.nativeElement.value = null;
      }, 0);
    }
  }

  cardFormat() {
    const value = this.cardForm.controls['cardnumber'].value;
    if (value) {
      const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
      const matches = v.match(/\d{4,16}/g);
      const match = matches && matches[0] || '';
      const parts = [];
      for (let i = 0, len = match.length; i < len; i += 4) {
        parts.push(match.substring(i, i + 4));
      }
      if (parts.length) {
        console.log(parts.join(' '));
        this.cardForm.controls['cardnumber'].setValue(parts.join(' '));
        return parts.join(' ');
      } else {
        return value;
      }
    }

  }

  input(value: any) {
    if (value === 4) {
      this.showTextArea = true;
      this.reasonForm.controls['reason'].setValue('');
    } else {
      this.reasonForm.controls['reason'].setValue(value);
      this.showTextArea = false;
    }
    console.log(this.reasonForm);
  }
}
