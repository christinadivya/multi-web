import { Component, OnInit, TemplateRef, ElementRef, ViewChild, NgZone } from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap';
import { Router } from '@angular/router';
import { RegisterService } from '../service/register.service';
import { LanguageService } from '../service/language.service';
import { MysubscriptionService } from '../service/mysubscription.service';
import { HttpParams } from '@angular/common/http';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { RefferalService } from '../service/refferal.service';
import { GeneralService } from '../service/general.service';

@Component({
  selector: 'app-subscription',
  templateUrl: './subscription.component.html'
})
export class SubscriptionComponent implements OnInit {

  modalRef: BsModalRef;
  page = 1;
  plans: any;
  cardForm: FormGroup;
  currentUser = localStorage.getItem('currentusertoken');
  public plantype;
  intervalType = localStorage.getItem('intervaltype');
  desktopView = true;
  mobileView = false;
  yearplans: any;
  showcontent = false;
  dt = new Date();
  years = [];
  months: any[] = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'];
  startyear = this.dt.getFullYear();
  month = 1 + this.dt.getMonth();
  planObject: any = {};
  currentPlan: any;
  cvvDisabled = true;
  monthlyHide = true;
  hideRadio: any;
  editValue = false;
  cvvLength: any;
  cardType: any;
  subscriptionPage = false;
  choosenPlan: any;
  planSelected: any;
  choosed: any;
  amount: any;
  managePlanId: any;
  checkedYearly: any;
  checkedMonthly: any;
  submitted: any;
  mycard: any;
  deletingCard: any;
  showMainContent: any;
  editMode: any;
  editModePage: any;
  ngxLoader: any;
  cardnumber: any;
  expmonth: any;
  expyear: any;
  cvv: any;
  token: any;
  cardObject: any;
  message: any;
  failureVal: any;
  userEmail: any;
  customerId: any;
  brandImage: any;
  sub_subscription_Id: any;
  itemsSubscribeId: any;
  CancelShow: any;
  showPlanContent: any;
  showContent: any;
  congratzmodalRef: BsModalRef;
  failuremodalRef: BsModalRef;
  showPaymentContent: any;
  showPlatinumContent: any;
  alreadySubscribed: any;
  cardDetails: any;
  userId: any;
  deletecardDetails: any;
  stripeCusId: any;
  GoldPlanMonthly: any;
  GoldPlanYearly: any;
  PlatinumPlanMonthly: any;
  PlatinumPlanYearly: any;
  goldMonthly: any;
  platinumMonthly: any;
  goldYearly: any;
  platinumYearly: any;
  LimitedPlan: any;
  @ViewChild('congratulations') public congratz: TemplateRef<any>;
  @ViewChild('cvvInput') searchInput: ElementRef;
  @ViewChild('failure') public failure: TemplateRef<any>;

  langData: any = { common: '', subscriptionPage: '' };

  constructor(private modalService: BsModalService,
    private router: Router,
    private service: RegisterService,
    private formBuilder: FormBuilder,
    private toastr: ToastrService,
    private generalService: GeneralService,

    private language: LanguageService, public mysubscription: MysubscriptionService,
    private ngZone: NgZone, private refferalService: RefferalService) {
    if (this.plantype !== undefined && this.plantype !== 1) {
      this.showcontent = true;
    }

    window.onresize = (e) => {
      this.ngAfterViewInit();
    };
  }

  ngAfterViewInit() {
    this.onResize(window.innerWidth);
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


  onResize(innerWidth) {

    if (innerWidth < 1023) {

      // Mobile
      this.desktopView = false;
      this.mobileView = true;

    } else {
      // desktop
      this.desktopView = true;
      this.mobileView = false;
    }
  }

  ngOnInit() {

    console.log(this.currentUser);
    this.userId = localStorage.getItem('UserId');

    for (let i = 0; i <= 20; i++) {
      this.years.push(this.startyear + i);
    }
    // checking whether user logedin

    // if (this.currentUser === '' || this.currentUser == null || this.currentUser === undefined) {
    //   this.router.navigate(['/home']);
    // } else {
    //   this.router.navigate(['/subscription']);
    // }

    this.fetchPlans();
    this.fetchPlanYears();
    this.viewProfile();
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

  getmySubscription() {
    let params = new HttpParams();
    params = params.append('userId', localStorage.getItem('UserId').toString());
    this.mysubscription.getMySubscription(params).subscribe((res) => {
      if (res['status']['status'] === 200) {
        this.currentPlan = res['entity'];
        console.log('cuuuuuu', this.currentPlan);
        this.plantype = (this.plans.findIndex(item => (item.planname === this.currentPlan.plantype))) + 1;
        if (this.currentPlan != null && this.currentPlan !== undefined) {
          this.generalService.subEnable.next(false);
          this.router.navigate(['/user-home']);
        }
      }
    });
  }

  silverSubscription() {
    const updateData = {
      userId: localStorage.getItem('UserId'),
      manageplanId: this.planObject['manageplanid'],
      interval_type: this.planObject['intervaltype'],
      interval_count: this.planObject['intervalcount']
    };
    // this.toastr.success('Subscribed c');
    this.mysubscription.addSubscription(updateData).subscribe((response) => {
      if (response) {
        // this.toastr.success(response['status']['msg']);
        localStorage.setItem('subscribed', 'true');
        this.generalService.subEnable.next(false);
        this.router.navigate(['/user-home']);
      }
    }, err => {

    });
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
    }
  }
  numberOnly(event): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
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
  choosePlan(plan) {
    this.plantype = plan;
    this.planObject = this.plans[plan - 1];
    this.choosenPlan = this.planObject.planname;
    this.monthlyHide = false;
    if (localStorage.getItem('intervaltype') === 'month') {
      this.checkedMonthly = true;
    } else if (localStorage.getItem('intervaltype') === 'year') {
      this.managePlanId = this.yearplans[this.yearplans.findIndex(item => (item.planname === this.choosenPlan))].stripeplanid;
      this.checkedYearly = true;
    }
    if (this.planObject.planname === 'Limited Platinum') {
      this.hideRadio = false;
      this.managePlanId = this.planObject['stripeplanid'];
    } else {
      this.hideRadio = true;
      if (this.planSelected !== 'yearly') {
        this.managePlanId = this.planObject['stripeplanid'];
      }
    }
    if (this.planObject.planname === 'Silver') {
      this.showcontent = false;
    } else {
      this.showcontent = true;
      this.createCardToken();
    }
  }

  openFailureModal(failure: TemplateRef<any>) {
    console.log(failure);
    this.failureVal = true;
    // this.ngxLoader = false;
    this.failuremodalRef = this.modalService.show(
      failure,
      Object.assign({}, { class: 'modal-custom failure-popup br-44' })
    );
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

  createCustomer() {
    this.cardForm.reset();
    const data = {
      source: this.token,
      email: this.userEmail
    };
    if (this.stripeCusId === null || this.stripeCusId === undefined || this.stripeCusId === '') {
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
        console.log('messageee', this.message);
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
      console.log('responseee', res);
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
        if (this.subscriptionPage) {
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

  openCongratzModal(congratulations: TemplateRef<any>) {
    console.log(congratulations);
    this.getmySubscription();
    this.congratzmodalRef = this.modalService.show(
      congratulations,
      Object.assign({}, { class: 'modal-custom  congrats-popup br-5' })
    );
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
    console.log('dataaaaaaaaaaaaaaaaaaaaaaaaaaaa', data);
    this.mysubscription.createSubscription(data).subscribe((res) => {
      console.log(res, this.planObject);
      if (res) {
        const updateData = {
          userId: localStorage.getItem('UserId'),
          manageplanId: this.planObject['manageplanid'],
          stripe_subcription_id: res['id'],
          itemSubscriptionId: res['items']['data'][0]['id'],
          // interval_type: res['items']['data'][0]['plan']['interval'],
          // interval_count: res['items']['data'][0]['plan']['interval_count']
        };
        // this.toastr.success('Subscribed c');
        if (this.planSelected === 'yearly' || localStorage.getItem('intervaltype') === 'year') {
          updateData.manageplanId = this.yearplans[this.yearplans.findIndex(item => (item.planname === this.choosenPlan))].manageplanid;
        }
        console.log('upadddd', updateData);
        this.mysubscription.addSubscription(updateData).subscribe((response) => {
          if (response) {
            this.toastr.success(response['status']['msg']);
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
            if (this.planSelected === 'yearly' || localStorage.getItem('intervaltype') === 'year') {
              this.message = `Subscribed successfully to the
              ${this.yearplans[this.yearplans.findIndex(item => (item.planname === this.choosenPlan))].planname} Yearly plan`;

            }
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

  getAllCard() {
    this.userId = localStorage.getItem('UserId');
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

  createToken() {
    this.toastr.clear();
    const subNewData = {
      userId: localStorage.getItem('UserId'),
      manageplanId: this.planObject.manageplanid,
      // subscriptionId: this.subscriptionId,
    };
    if (this.planSelected === 'yearly' || localStorage.getItem('intervaltype') === 'year') {
      subNewData.manageplanId = this.yearplans[this.yearplans.findIndex(item => (item.planname === this.choosenPlan))].manageplanid;
    }
    this.mysubscription.addSubscription(subNewData).subscribe((subNewResponse) => {
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
            this.toastr.error(response.error.message);
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
          console.log('errorrrrrrrrrrrrrrrrrr', err);
          this.cardForm.reset();
          this.message = err.error.message;
          this.openFailureModal(this.failure);
          this.ngZone.run(() => {
            this.ngxLoader = false;
          });
        });
      }
    });

  }
  PlanSelected(value) {
    this.planSelected = value;
    this.choosed = (this.planSelected === 'monthly') ? 'monthly' : 'yearly';
    if (this.choosenPlan === 'Gold' && this.planSelected === 'monthly') {
      this.planObject = this.plans[this.plans.findIndex(item => (item.planname === 'Gold'))];
    } else if (this.choosenPlan === 'Gold' && this.planSelected === 'yearly') {
      this.planObject = this.plans[this.plans.findIndex(item => (item.planname === 'Gold'))];
    }
    if (this.choosenPlan === 'Platinum' && this.planSelected === 'monthly') {
      this.planObject = this.plans[this.plans.findIndex(item => (item.planname === 'Platinum'))];
    } else if (this.choosenPlan === 'Platinum' && this.planSelected === 'yearly') {
      this.planObject = this.plans[this.plans.findIndex(item => (item.planname === 'Platinum'))];
    }
    // if (this.choosenPlan === 'Platinum' && this.planSelected === 'yearly'
    //   && this.currentPlan['plantype'] === 'Gold' && this.currentPlan['planduration'] === 'year') {
    //   this.amount = (parseFloat(this.planObject['price']) - parseFloat(this.currentPlan['price'])).toString();
    // } else {
    this.amount = this.planObject['price'];
    // }
    this.managePlanId = this.planObject['stripeplanid'];

    if (this.planSelected === 'yearly') {
      this.checkedYearly = true;
      this.checkedMonthly = false;
      this.managePlanId = this.yearplans[this.yearplans.findIndex(item => (item.planname === this.choosenPlan))].stripeplanid;
      console.log(this.managePlanId);
    } else {
      this.checkedYearly = false;
      this.checkedMonthly = true;
    }
  }

  openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(
      template,
      Object.assign({}, { class: 'mobile-filter-modal' })
    );
  }

  fetchPlans() {
    this.mysubscription.getAllPlansByType().subscribe(async (res) => {
      if (res['status']['status'] === 200) {
        console.log(res, '***');
        if (res['entity']) {
          this.plans = res['entity']['managePlanList'];
          this.getmySubscription();
          this.plantype = localStorage.getItem('plantype');
          if (this.plantype === 1) {
            this.silverSubscription();
          } else if (this.plantype > 1) {
            this.choosePlan(this.plantype);
          }
          this.goldMonthly = res['entity']['goldmonthamount'];
          this.goldYearly = res['entity']['goldyearamount'];
          this.platinumMonthly = res['entity']['platinummonthamount'];
          this.platinumYearly = res['entity']['platinumyearamount'];


        } else {
          this.plans = [];
        }
      }
    }, err => {
      this.plans = [];
    });
  }

  fetchPlanYears() {
    this.mysubscription.getAllPlansByTypeYear().subscribe(async (res) => {
      if (res['status']['status'] === 200) {
        console.log(res, '***');
        if (res['entity']) {
          this.yearplans = res['entity']['managePlanList'];
          console.log(this.yearplans);
        }
      }
    });
  }

  choosemyplan() {
    const userid = localStorage.getItem('UserId');

    this.service.subscription(userid).subscribe(res => {

      console.log(res);


      if (res['status'] === 200) {
        this.generalService.subEnable.next(false);

        this.router.navigate(['/user-home']);
      }

    }, err => {
      console.log(err);

    });


  }

}

