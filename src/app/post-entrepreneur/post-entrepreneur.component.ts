import { RegisterService } from '../service/register.service';
import { PostService } from '../service/post.service';

import { Component, OnInit, TemplateRef, ViewChild, ElementRef } from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { S3UploadService } from '../service/s3.service';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { ImageCroppedEvent } from 'ngx-image-cropper';
import { environment } from 'src/environments/environment';
import { Observable, Observer } from 'rxjs';
import { PlatformLocation } from '@angular/common';
import { MysubscriptionService } from 'src/app/service/mysubscription.service';
import { GeneralService } from 'src/app/service/general.service';
import * as AWS from 'aws-sdk/global';
import * as S3 from 'aws-sdk/clients/s3';
import { element } from '@angular/core/src/render3';
import { Router } from '@angular/router';
import { LanguageService } from '../service/language.service';
import { CanComponentDeactivate } from '../shared/interface';
import * as moment from 'moment';
import { HttpParams } from '@angular/common/http';

@Component({
  selector: 'app-post-entrepreneur',
  templateUrl: './post-entrepreneur.component.html',
  styleUrls: ['./post-entrepreneur.component.scss']
})

export class PostEntrepreneurComponent implements OnInit {

  uploaddocarray = [];
  textareacount = '';
  formvalid = false;
  directcontact = true;
  fileuploadDiabled = false;
  videuploadDiabled = false;
  currentAdddres: any;
  lat;
  lng;
  locationid: any;
  companysize: any;
  amountrange: any;
  countrycode: any = '';
  countrycurrency: any;
  mobileView = false;
  desktopView = true;
  pages = 1;
  accValue: any = [{
    selectedInd: false
  }];
  pitchValue: any = [{
    selectedPitch: false
  }];
  investCheck = false;
  checkEntp = false;
  accId: any;
  inves: any;
  locationresult: any;
  suggestedLocation: any;
  selectedcityid: any;
  searchfield = '';
  addrObj = { 'City': 'cityid', 'State': 'stateid', 'Country': 'countryid', 'Continent': 'continentid' };
  // serachdropdown
  public items: any[] = this.suggestedLocation;
  private _ngxDefault;
  private _ngxDefaultTimeout;
  private _ngxDefaultInterval;

  phonemask = '00000-00000';
  indusValue: any;
  checkContent: boolean;
  suggestions: boolean;
  addressCheck = true;
  selectedlocation: any = [];
  fileExtension;
  loadImage = false;
  imageList: any = [];
  uploadImageUrl: any;
  createPostForm: FormGroup;
  arrAddress: FormArray;
  documentList: FormArray;
  videoList: FormArray;
  videoUrlList: FormArray;
  modalRef: BsModalRef;
  imageChangedEvent: any = '';
  croppedImage: any = '';
  filename: any;
  base64DefaultURL: any;
  submitted = false;
  isRedirect = true;

  // documentupload flow
  uploadFinish = false;
  selectedFiles: FileList;
  generalvalidationMessage = '';
  sizeRestriction = '';
  extendsionRestriction = '';
  extendsionRestrictionMessage = '';
  i = 0;
  docuerror = false;
  remainingPercentage: any;
  langData: any = { common: '', createPostPage: '' };

  postName;
  homepostName;
  @ViewChild('fileInput') myFileInput: ElementRef;
  @ViewChild('cancelmodal') public cancelmodal: TemplateRef<any>;
  @ViewChild('imagecropper') public imagecropper: TemplateRef<any>;
  accountTypeId: any;
  businessPitch: any = [];
  businessPitchTypeId: any = 2;
  pitchSelect = true;
  invesId: any;
  industryArray: any = [];
  location: any = [];
  allcountryData: any;
  logokey: any = null;
  filesuploaded: any;
  youtubeurlmatched: boolean;
  filestype: any;
  editpostid: any;
  editpostbehaveid: any;
  responseData: any;
  validyear = false;
  currentyearvalid = false;
  typeofpostchoosen: any;
  typeofinvestor = false;
  mycontactinfo: any = 1;
  editUrlArray: any[];
  editDocArray: any = [];
  pickedMyIndstryName: any = [];
  userIndustry: any = [];

  contactbuilder: FormArray;
  phonenumberlimit: number;
  changeValue = {};
  postField = {};
  phonenumberpattern = '^(0|[1-9][0-9]*)$';
  modelDate = '';
  mytime: Date;
  arrayCheck: any = [];
  public loading = false;
  submitDisabled = false;
  contactinfo: any = [];

  constructor(private regService: RegisterService,
    private router: Router,
    private s3upload: S3UploadService,
    private postService: PostService,
    private toastr: ToastrService,
    private modalService: BsModalService,
    private formBuilder: FormBuilder,
    private service: RegisterService,
    location: PlatformLocation,
    private language: LanguageService, private generalService: GeneralService, private mysubscription: MysubscriptionService) {
    // Calls the function  when window resized
    window.onresize = (e) => {
      this.ngAfterViewInit();
    };

    // const these = this;
    // location.onPopState(() => {
    //     // these.cancelPost('cancelmodal');
    //     // window.history.forward()
    // });
    // this.cancelPost(this.cancelmodal);
  }

  openModalWithClass(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(
      template,
      Object.assign({}, { class: 'gray modal-dialog-centered  modal-custom modal-lg w-auto' })
    );
  }
  onOpenCalendar(container) {
    this.mytime = new Date();
    container.yearSelectHandler = (event: any): void => {
      container._store.dispatch(container._actions.select(event.date));
    };
    container.setViewMode('year');
  }
  checkSubscription() {
    this.generalService.getSubscriptionStatus()
      .subscribe((response: any) => {
        let params = new HttpParams();
        params = params.append('userId', localStorage.getItem('UserId').toString());
        this.mysubscription.getMySubscription(params).subscribe((res) => {
          if (res['entity'] == null || res['entity'] === undefined) {
            this.router.navigate(['/subscription']);
          }
        });
      });
  }
  ngOnInit() {
    this.generalService.tabActive.next('/create-a-post');
    this.checkSubscription();
    window.scrollTo(0, 0);
    this.fetchLanguage();
    this.getAcc();
    this.getIndust();
    this.uploadImageUrl = './assets/images/mobile-logo.png';
    this.getPhoneCode();
    this.getCurrentLocation();
    this.fetchCompanySize();
    this.fetchAmountRange();
    this.fetchCurrency();
    this.fetchBusinessPitch();
    this.autoPopulate();
    // behavioural Subject
    this.postService.cpost.subscribe(res => this.editpostbehaveid = res);

    this.editpostid = this.editpostbehaveid;
    if (this.editpostid) {
      this.fetchEditPostData(this.editpostid);
      this.contactbuilder = this.formBuilder.array([]);
    } else {
      // this.createPostForm.controls['arrAddress']['controls'].push();
      this.contactbuilder = this.formBuilder.array([this.createItem()]);
    }

    this.createForm();


    // behavioural Subject
    this.postService.potitle.subscribe(res => this.homepostName = res);
    this.postName = this.homepostName;
    this.postService.updatedPostTitle('');



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



  // ----------------- Get Current Location Of User -------------


  getCurrentLocation() {
    if (window.navigator && window.navigator.geolocation) {
      window.navigator.geolocation.getCurrentPosition(
        (showPosition) => {
          this.lat = showPosition.coords.latitude;
          this.lng = showPosition.coords.longitude;
          this.getAddressBasedonLatandLng(this.lat, this.lng, 'initial');
        },
        showError => {
          console.log(showError);
          this.getCurrentIPAddress();
        });
    } else {
      this.getCurrentIPAddress();
    }
  }

  getCurrentIPAddress() {
    this.regService.getCurrentIPAddress().subscribe(
      res => {
        if (res && res['ip']) {
          // console.log(res['ip']);
          this.getAddressBasedonCurrentIp(res['ip']);
        }
      },
      err => {
        console.log(err);
      }
    );
  }

  getAddressBasedonCurrentIp(ip) {
    this.regService.getAddressBasedonCurrentIp(ip).subscribe(
      res => {
        // console.log(res);
        if (res && res['status'] === 'success' && res['lat'] && res['lon']) {
          localStorage.setItem('lat', res['lat']); // = res['lat'];
          localStorage.setItem('lng', res['lon']);
          this.getAddressBasedonLatandLng(res['lat'], res['lon'], 'initial');
        }
      },
      err => {
        console.log(err);
      }
    );
  }

  getAddressBasedonLatandLng(latitude, longitude, type) {
    // console.log('lat'+ latitude);
    // console.log('lng'+ longitude);
    if (latitude && longitude) {

      this.regService.getAddressFromGoogle(latitude, longitude).subscribe(
        res => {

          this.currentAdddres = {
            country: null,
            city: null,
            state: null,
            country_short_name: null
          };

          if (res && res['status'] && (res['status'] === 'ok' || res['status'] === 'OK')) {

            if (res['results'][0]) {
              // console.log(res['results'][0]);


              for (let index = 0; index < res['results'][0]['address_components'].length; index++) {

                if (res['results'][0]['address_components'][index]['types'][0] === 'country') {

                  this.currentAdddres.country = res['results'][0]['address_components'][index]['long_name'];
                  this.currentAdddres.country_short_name = res['results'][0]['address_components'][index]['short_name'];

                }

                if (res['results'][0]['address_components'][index]['types'][0] === 'administrative_area_level_2') {
                  this.currentAdddres.city = res['results'][0]['address_components'][index]['long_name'];
                }

                if (res['results'][0]['address_components'][index]['types'][0] === 'administrative_area_level_1') {
                  this.currentAdddres.state = res['results'][0]['address_components'][index]['long_name'];
                }

              }

              console.log(this.currentAdddres);

            }
          }

        },
        err => {
          console.log(err);
        }
      );
    }

  }
  // ----------------- Get Current Location Of User -------------


  dynamicvalidation() {


    const plocation = this.createPostForm.get('myLocation');
    const founded = this.createPostForm.get('foundedYear');
    const psizeofcompany = this.createPostForm.get('sizeCompany');
    const pcompanywebsite = this.createPostForm.get('companyWebsite');
    const pcompanyname = this.createPostForm.get('companyName');

    if (this.typeofpostchoosen === 4) {
      console.log('4test', this.typeofpostchoosen);
      pcompanyname.clearValidators();
      pcompanywebsite.clearValidators();
      pcompanywebsite.setValidators(Validators.compose([
        Validators.pattern('^(http[s]?:\/\/){0,1}(www\.){0,1}[a-zA-Z0-9\.\-]+\.[a-zA-Z]{2,5}[\.]{0,1}')
      ]));
      founded.clearValidators();
      psizeofcompany.clearValidators();
    } else {
      pcompanyname.setValidators(Validators.compose([Validators.required]));
      pcompanywebsite.setValidators(Validators.compose([Validators.required, Validators.pattern('^(http[s]?:\/\/){0,1}(www\.){0,1}[a-zA-Z0-9\.\-]+\.[a-zA-Z]{2,5}[\.]{0,1}')]));
    }

    if (this.typeofpostchoosen !== 3 && this.typeofpostchoosen !== 4) {
      pcompanyname.setValidators(Validators.compose([Validators.required]));
      // plocation.setValidators(Validators.compose([Validators.required]));
      // pname.setValidators(Validators.compose([Validators.required]));
      founded.setValidators(Validators.compose([Validators.required]));
      psizeofcompany.setValidators(Validators.compose([Validators.required]));
      plocation.setValidators(Validators.compose([Validators.required]));
      // pcompanywebsite.setValidators(Validators.compose([Validators.required]));

      this.investCheck = false;
      this.validyear = false;

    } else if ((this.typeofpostchoosen === 3 && this.invesId === 1) || this.typeofpostchoosen === 4) {
      this.investCheck = true;
      this.validyear = true;


      // plocation.clearValidators();
      // pname.clearValidators();
      founded.clearValidators();
      psizeofcompany.clearValidators();
      pcompanywebsite.clearValidators();
      pcompanyname.clearValidators();

      // pcompanywebsite.setValidators(Validators.compose([
      //   Validators.pattern('^(http[s]?:\/\/){0,1}(www\.){0,1}[a-zA-Z0-9\.\-]+\.[a-zA-Z]{2,5}[\.]{0,1}')
      // ]));

    } else {
      // plocation.setValidators(Validators.compose([Validators.required]));
      // pname.setValidators(Validators.compose([Validators.required]));
      pcompanyname.setValidators(Validators.compose([Validators.required]));
      founded.setValidators(Validators.compose([Validators.required]));
      psizeofcompany.setValidators(Validators.compose([Validators.required]));
      plocation.setValidators(Validators.compose([Validators.required]));
      // pcompanywebsite.clearValidators();
    }

    plocation.updateValueAndValidity();
    // pname.updateValueAndValidity();
    founded.updateValueAndValidity();
    psizeofcompany.updateValueAndValidity();
    plocation.updateValueAndValidity();
    pcompanywebsite.updateValueAndValidity();
    pcompanyname.updateValueAndValidity();
  }

  createForm() {
    this.createPostForm = this.formBuilder.group({
      postName: ['', Validators.required],
      myLocation: ['', Validators.required],
      companyName: ['', Validators.required],
      foundedYear: ['', Validators.required],
      sizeCompany: ['', Validators.required],
      companyWebsite: ['', Validators.required],
      bussinessSummary: ['', Validators.required],
      accountType: ['', Validators.required],
      businessPitchType: [''],
      investType: [''],
      currencyCountry: [''],
      myamountRange: [''],
      locationState: [''],
      targetIndustry: [''],
      contact: [''],
      arrAddress: this.contactbuilder,
      documentList: this.formBuilder.array([]),
      videoList: this.formBuilder.array([]),
      videoUrlList: this.formBuilder.array([])
    });
  }
  //
  createItem() {
    return this.formBuilder.group({
      contacttitle: ['', Validators.required],
      contactname: ['', Validators.required],
      contactemail: ['', [Validators.required, Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$')]],
      contactphoneno: ['', Validators.required],
      contactphonecode: [this.countrycode, Validators.required],
      phonemask: ['']
    });
  }

  addItem() {
    this.arrAddress = this.createPostForm.get('arrAddress') as FormArray;

    if ((this.createPostForm.controls['arrAddress']['controls'].length) >= 5) {
      this.showError('Only 5 contacts allowed');
    } else {
      this.arrAddress.push(this.createItem());
    }

  }

  removeItem(contactid) {
    console.log(contactid);
    console.log(this.arrAddress);
    // this.arrAddress['controls'].splice(1,contactid);
    // this.createPostForm.get('arrAddress')['controls'].splice(contactid, 1);
    this.arrAddress.removeAt(contactid);
    console.log(this.arrAddress);
  }

  validate() {
    console.log(this.createPostForm);
    const amountneeded = this.createPostForm.get('myamountRange');
    const contcurrncy = this.createPostForm.get('currencyCountry');
    if (this.accountTypeId && this.accountTypeId === 4) {
      amountneeded.setValidators(Validators.compose([Validators.required]));
      contcurrncy.setValidators(Validators.compose([Validators.required]));
    } else {
      amountneeded.clearValidators();
      contcurrncy.clearValidators();
    }
    amountneeded.updateValueAndValidity();
    contcurrncy.updateValueAndValidity();


    // check it is investor
    if (this.accountTypeId) {
      if (this.accountTypeId && this.accountTypeId === 3) {
        if (!this.invesId && this.accountTypeId === 3) {
          this.formvalid = false;
        } else {
          this.formvalid = true;
        }
      } else if (this.accountTypeId && this.accountTypeId !== 3) {
        this.formvalid = true;
      }
    } else {
      this.formvalid = false;
    }


    if (this.createPostForm.valid) {
    } else if (!this.validyear) {
      this.showError('Please enter valid founded year');
    } else if (!this.accountTypeId) {
      this.showError('Please choose type of post');
    } else if (!this.formvalid) {
      this.showError('Please choose type of Investors');
    } else if (!(this.selectedlocation.length > 0)) {
      this.showError('Please select Target Location(s)');
    } else if (!(this.userIndustry.length > 0)) {
      this.showError('Please select Target Industry(s)');
    }

  }


  postIndustryArry() {
    // user industry
    this.userIndustry = [];
    for (let ind = 0; ind < this.indusValue.length; ind++) {
      if (this.indusValue[ind].selected === true) {
        this.userIndustry.push({
          industryid: this.indusValue[ind].industryid
        });
      }
    }
    console.log(this.userIndustry);
  }

  onSubmit() {
    console.log(this.fileuploadDiabled, this.videuploadDiabled, this.submitDisabled);
    console.log(this.createPostForm);
    this.submitted = true;
    console.log(this.createPostForm['controls']['arrAddress']['controls'].length);

    for (let index = 0; index < this.createPostForm['controls']['arrAddress']['controls'].length; index++) {
      if (this.createPostForm['controls']['arrAddress']['controls'][index]['controls']['contactphoneno'].valid === false) {
        return;
      }
    }
    this.validateYear();
    let contactarray = [];
    // get contact list & storing
    this.createPostForm['controls']['postName'].setValue(this.createPostForm['controls']['postName'].value.trim());
    this.createPostForm['controls']['companyName'].setValue(this.createPostForm['controls']['companyName'].value.trim());
    this.createPostForm['controls']['companyWebsite'].setValue(this.createPostForm['controls']['companyWebsite'].value.trim());
    this.createPostForm['controls']['bussinessSummary'].setValue(this.createPostForm['controls']['bussinessSummary'].value.trim());

    let contactdata = this.createPostForm['controls']['arrAddress']['controls'];

    for (let i = 0; i < contactdata.length; i++) {
      contactarray.push(contactdata[i].value);
    }

    console.log('this.mycontactinfo ', this.mycontactinfo);

    let contactvalid;
    if (this.mycontactinfo === 1) {
      if (this.mycontactinfo === 1 && this.createPostForm.controls.arrAddress.valid === true) {
        contactvalid = true;
      } else {
        contactvalid = false;
      }
    } else if (this.mycontactinfo === 2) {
      console.log('222222222222');
      contactvalid = true;
    }

    // Check Enteraperner Or other  (Dynamic Validation)

    const amountneeded = this.createPostForm.get('myamountRange');
    const contcurrncy = this.createPostForm.get('currencyCountry');
    if (this.accountTypeId && this.accountTypeId === 4) {
      amountneeded.setValidators(Validators.compose([Validators.required]));
      contcurrncy.setValidators(Validators.compose([Validators.required]));
    } else {
      amountneeded.clearValidators();
      contcurrncy.clearValidators();
    }
    amountneeded.updateValueAndValidity();
    contcurrncy.updateValueAndValidity();

    // check it is investor
    if (this.accountTypeId) {
      if (this.accountTypeId && this.accountTypeId === 3) {
        if (!this.invesId && this.accountTypeId === 3) {
          this.formvalid = false;
        } else {
          this.formvalid = true;
        }
      } else if (this.accountTypeId && this.accountTypeId !== 3) {
        this.formvalid = true;
      }
    } else {
      this.formvalid = false;
    }

    const documentsarray = this.createPostForm.get('documentList')['controls'];
    const videourlsarray = this.createPostForm.get('videoUrlList')['controls'];
    const videosarray = this.createPostForm.get('videoList')['controls'];

    console.log(videourlsarray);


    let docobject = {
      type: null,
      filetype: null,
      url: null
    };

    this.uploaddocarray = [];

    for (let index = 0; index < documentsarray.length; index++) {

      docobject = {
        type: 1,
        filetype: 'doc',
        url: documentsarray[index].value.uploaddoc
      };

      this.uploaddocarray.push(docobject);
    }


    for (let index = 0; index < videourlsarray.length; index++) {

      let convertembedurl;


      convertembedurl = this.generateEmbedCodeFromUrl(videourlsarray[index]['controls']['videourl'].value);



      docobject = {
        type: 2,
        filetype: 'video',
        url: convertembedurl
      };

      this.uploaddocarray.push(docobject);

    }


    for (let index = 0; index < videosarray.length; index++) {
      docobject = {
        type: 2,
        filetype: 'video',
        url: videosarray[index].value.uploaddoc
      };

      this.uploaddocarray.push(docobject);

    }


    this.postIndustryArry();


    let yearFormat = '';
    console.log(this.uploaddocarray);
    console.log(this.createPostForm.get('arrAddress') as FormArray);
    console.log(this.createPostForm.controls['foundedYear'].value, 'hhhhhhhhhhhhhhhhhh');
    console.log(this.createPostForm.get('myLocation').value, 'locatiiiiiionnnnnnnnnnnnnn');
    console.log(this.createPostForm.controls['sizeCompany'].value, 'sizeeeeeeeeeeee');

    if (this.createPostForm.controls['foundedYear'].value !== '' && this.createPostForm.controls['foundedYear'].value !== null) {
      console.log('yesssssssssssssssss');
      yearFormat = moment(this.createPostForm.controls['foundedYear'].value).format('YYYY');
    } else {
      yearFormat = '';
    }
    console.log(yearFormat);

    this.postField = {
      postid: this.editpostid,
      userid: localStorage.getItem('UserId'),
      postname: this.createPostForm.controls['postName'].value,
      location: this.createPostForm.get('myLocation').value,
      companyname: this.createPostForm.controls['companyName'].value,
      companysize: this.createPostForm.controls['sizeCompany'].value,
      companyfounded: yearFormat,
      companywebsite: this.createPostForm.controls['companyWebsite'].value,
      postlogo: this.logokey,
      postsummary: this.createPostForm.controls['bussinessSummary'].value,
      acctype: this.accountTypeId,
      businesspitch: this.businessPitchTypeId,
      contactinfo: this.mycontactinfo,
      subacctype: this.invesId,
      amount: this.createPostForm.controls['myamountRange'].value,
      postindustry: this.userIndustry,
      postlocation: this.location,
      contactlist: contactarray,
      uploadfiles: this.uploaddocarray
    };
    console.log('dd', this.postField, this.accountTypeId);
    console.log(this.editpostid, this.accountTypeId);

    console.log('createPostForm Valid :', this.createPostForm.valid);
    if (this.createPostForm.invalid) {
      console.log('createPostForm Valid :', this.createPostForm.valid);
      this.showError('Please fill required fields');
    } else if (!this.validyear) {
      console.log('valid year:', this.validyear);
      this.showError('Please enter valid founded year');
    } else if (!this.accountTypeId) {
      console.log('accountTypeId:', this.accountTypeId);
      this.showError('Please choose type of post');
    } else if (!this.formvalid) {
      console.log('formvalid:', this.formvalid);
      this.showError('Please choose type of Investors');
    } else if (!(this.selectedlocation.length > 0)) {
      console.log('selectedlocation :', (this.selectedlocation.length > 0));
      this.showError('Please select Target Location(s)');
    } else if (!(this.userIndustry.length > 0)) {
      console.log('Industry :', (this.industryArray.length > 0));
      this.showError('Please select Target Industry(s)');
    }

    if (this.validyear && this.accountTypeId && (this.userIndustry.length > 0) &&
      this.formvalid && (this.selectedlocation.length > 0) && this.createPostForm.valid) {

      if (this.editpostid) {

        this.postField['postid'] = this.editpostid;

        // Edit Post
        this.postService.editPost(this.postField).subscribe(res => {
          console.log('result', res);

          // Duplicated Contact List
          if (res['status']['status'] === 230) {
            this.showError(res['status']['msg']);
          }

          if (res['status']['status'] === 200) {
            console.log('success post');

            // this.showSuccess(res['status']['msg']);
            this.toastr.clear();
            this.toastr.success(res['status']['msg']);

            setTimeout(() => {
              this.router.navigate(['/post-list']);
            }, 1000);

            console.log('after router');

            //  behavioral subject asign value
            this.postService.currentPost('');
          }

        }, err => {
          console.log(err);

          this.showError(err['error']['status']['msg']);

        });

      } else {

        // create Post
        this.postService.createPost(this.postField).subscribe(res => {
          console.log('result', res);

          // Duplicated Contact List
          if (res['status']['status'] === 230) {
            this.showError(res['status']['msg']);
          }

          if (res['status']['status'] === 200) {
            console.log('success post ****');
            this.showSuccess(res['status']['msg']);
            this.router.navigate(['/post-list']);
          }

        }, err => {
          console.log(err);
          this.showError(err['error']['status']['msg']);
        });

      }
    } else {
      // this.showError('Please fill required fields')
    }
  }
  // tslint:disable-next-line:use-life-cycle-interface
  ngAfterViewInit() {
    this.onResize(window.innerWidth);
  }

  validateYear() {
    let d = new Date();
    const currentyear = d.getFullYear();
    console.log(this.createPostForm.get('foundedYear').value);

    if (this.createPostForm.get('foundedYear').value) {
      const yearValue = moment(this.createPostForm.controls['foundedYear'].value).format('YYYY');
      if ((currentyear.toString() >= yearValue) && (yearValue > '1000')) {
        console.log('right');
        this.validyear = true;
        this.currentyearvalid = true;
      } else {
        console.log('wrong');
        this.validyear = false;
        this.currentyearvalid = false;
      }
    }
  }

  cancelPost(template) {
    const change = this.createPostForm;
    console.log(!change.dirty);
    console.log('trigger cancel post');


    if (!change.dirty) {
      this.router.navigate(['/post-list']);
    } else {
      this.modalRef = this.modalService.show(
        template,
        Object.assign({}, { class: 'gray align-center-lg modal-custom' })
      );
    }
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


  imageCropped(event: ImageCroppedEvent) {
    this.croppedImage = event.base64;
  }

  getBase64ImageFromURL(url: string) {
    return Observable.create((observer: Observer<string>) => {
      // create an image object
      const img = new Image();
      img.crossOrigin = 'Anonymous';
      img.src = url;
      if (!img.complete) {
        // This will call another method that will create image from url
        img.onload = () => {
          observer.next(this.getBase64Image(img));
          observer.complete();
        };
        img.onerror = (err) => {
          observer.error(err);
        };
      } else {
        observer.next(this.getBase64Image(img));
        observer.complete();
      }
    });
  }

  getBase64Image(img: HTMLImageElement) {
    // We create a HTML canvas object that will create a 2d image
    let canvas, ctx, dataURL;
    canvas = document.createElement('canvas');
    canvas.width = img.width;
    canvas.height = img.height;
    ctx = canvas.getContext('2d');
    // This will draw image
    ctx.drawImage(img, 0, 0);
    // Convert the drawn image to Data URL
    dataURL = canvas.toDataURL('image/png');
    this.base64DefaultURL = dataURL;
    return dataURL.replace(/^data:image\/(png|jpg);base64,/, '');
  }
  dataURItoBlob(dataURI): Observable<Blob> {
    return Observable.create((observer: Observer<Blob>) => {
      const byteString = window.atob(dataURI);
      const arrayBuffer = new ArrayBuffer(byteString.length);
      const int8Array = new Uint8Array(arrayBuffer);
      for (let i = 0; i < byteString.length; i++) {
        int8Array[i] = byteString.charCodeAt(i);
      }
      const blob = new Blob([int8Array], { type: 'image/jpeg' });
      observer.next(blob);
      observer.complete();
    });
  }
  uploadImageFile() {
    this.uploadImageUrl = './assets/images/mobile-logo.png';
    this.loadImage = true;
    this.modalRef.hide();
    if (this.croppedImage) {
      this.getBase64ImageFromURL(this.croppedImage).subscribe((base64TrimmedURL: string) => {
        this.dataURItoBlob(base64TrimmedURL).subscribe(imageBlob => {
          const imageFile = new File([imageBlob], this.filename, { type: 'image/png' });
          this.s3upload.uploadfile(imageFile).then((data: any) => {
            this.loadImage = false;
            this.uploadImageUrl = environment.cloudFrontURL + data.key;
            this.imageList.push({ imageName: data.key });
            this.logokey = data.key;
            console.log(this.logokey);
            // this.createPostForm.controls['imageinfo'].setValue(this.imageList);
          }).catch((err) => {
            this.toastr.clear();
            this.toastr.error(err);
          });
        });
      });
    }
  }

  onFileChange(event) {
    const [file] = event.target.files;
    this.fileExtension = file.name.replace(/^.*\./, '');
    this.filename = file.name;

    if (this.fileExtension === 'png' || this.fileExtension === 'jpeg' || this.fileExtension === 'jpg') {
      this.imageChangedEvent = event;
      this.openModalWithClass(this.imagecropper);
    } else {
      this.loadImage = false;
      this.toastr.clear();
      this.toastr.error('Please upload only image file');
    }
  }

  getAcc() {
    this.regService.getAccType().subscribe((getvalue) => {
      this.accValue = getvalue['entity'];
      // console.log(this.accValue);
    }, (error) => {
      console.log(error);
    });
  }

  indGetValue(value, index) {
    this.indusValue[index].selected = value;
    this.postIndustryArry();
  }

  removeIndustry(position) {
    console.log(position);
    this.indusValue[position].selected = false;
    this.postIndustryArry();
  }

  getIndust() {
    this.regService.getAllIndustry().subscribe((indRes) => {
      this.indusValue = indRes['entity'];
      for (let index = 0; index < this.indusValue.length; index++) {
        this.indusValue[index].selected = false;
      }
      // console.log('>>>>>>>>>' , this.indusValue);
    }, (error) => {
      console.log(error);
    });
  }

  changeBusinessPitch(pitchValue) {
    console.log(pitchValue['pitchid']);
    this.businessPitchTypeId = pitchValue['pitchid'];
  }

  changeCompany(value) {
    console.log(value['accounttypeid']);
    this.accountTypeId = value['accounttypeid'];
    this.typeofpostchoosen = value['accounttypeid'];
    console.log(this.typeofpostchoosen);

    //  Investor == 3
    if (value['accounttypeid'] === 3) {
      this.typeofinvestor = true;
    } else {
      this.typeofinvestor = false;
    }
    this.investValue(value);
    this.dynamicvalidation();
    //  Entrepreneur == 4
    if (value['accounttypeid'] === 4) {
      this.checkEntp = true;
      this.autopopulateCurrency();
    } else {
      this.checkEntp = false;
    }
  }

  investValue(value) {
    console.log(value);
    this.accId = value['accounttypeid'];
    if (value['accounttypeid'] === 3) {
      this.fetchSubindustValue(this.accId);
    }
  }

  // typeofpostchoosen

  fetchSubindustValue(id) {
    this.postService.getSubPost(id).subscribe((insValue) => {
      this.inves = insValue['entity'];
      for (let index = 0; index < insValue['entity'].length; index++) {
        this.inves[index].subchecked = false;
      }
      console.log(this.inves);
    });
  }

  invesGetId(value) {
    this.invesId = value['subacctypeid'];
    console.log('name:', this.invesId);
    this.dynamicvalidation();
    if (this.typeofpostchoosen === 3 && this.invesId === 1) {
      this.investCheck = true;
      this.validyear = true;
    } else {
      this.investCheck = false;
      this.validyear = false;
    }
  }

  locationSearch(value) {
    console.log(value);
    if (value !== '') {
      this.checkContent = true;
      this.regService.searchLocations(value).subscribe((location) => {
        this.locationresult = location['entity'];
        console.log(this.locationresult);
        this.locationresult = this.locationresult.map((res) => {
          res.locationFinal = '';
          if (res.continentname !== null) {
            res.locationFinal = res.continentname;
          }
          if (res.countryname !== null) {
            res.locationFinal = `${res.countryname}`;
          }
          if (res.statename !== null) {
            res.locationFinal = `${res.countryname}, ${res.statename}`;
          }
          if (res.cityname !== null) {
            if (res.cityname === res.statename) {
              res.locationFinal = `${res.countryname}, ${res.cityname}`;
            }
            if (res.cityname !== res.statename) {
              res.locationFinal = `${res.countryname}, ${res.statename}, ${res.cityname}`;
            }
          }
          res.locationFinal = res.locationFinal.split(',');
          res.locationFinal = res.locationFinal.reverse().join(', ');
          return res;
        });
        console.log(this.locationresult);
      });
    } else {
      this.locationresult = [];
      this.checkContent = false;
    }
  }
  // locationChanges(location) {
  //   const addrObj = {
  //     'City': ['cityid', 'cityname'],
  //     'State': ['stateid', 'statename'],
  //     'Country': ['countryid', 'countryname'],
  //     'Continent': ['continentid', 'continentname']
  //    };
  //    if (this.selectedlocation.length > 0) {
  //      const isSelected = this.selectedlocation.find((ele) => {
  //        console.log(ele['searchedby']);
  //        return ele[addrObj[ele['searchedby']][0]] === location[0].data[addrObj[location[0].data['searchedby']][0]];
  //      });
  //      if (isSelected === undefined) {
  //        const obj = {};
  //        obj['cityid'] = location[0].data[addrObj[location[0].data['searchedby']][0]];
  //        obj['displayName'] = location[0].data[addrObj[location[0].data['searchedby']][1]];
  //        obj['searchedby'] = location[0].data['searchedby'];
  //        this.selectedlocation.push(obj);
  //        console.log(this.selectedlocation);
  //        this.selectedcityid = this.selectedlocation.slice(-1)[0]['displayName'];
  //      }
  //    } else {
  //     const obj = {};
  //     obj['cityid'] = location[0].data[addrObj[location[0].data['searchedby']][0]];
  //     obj['displayName'] = location[0].data[addrObj[location[0].data['searchedby']][1]];
  //     obj['searchedby'] = location[0].data['searchedby'];
  //     this.selectedlocation.push(obj);
  //    }
  //    console.log(this.selectedlocation);
  //  }

  mylocationSearch(value) {
    if (value !== '') {
      this.suggestions = true;
      this.regService.searchLocations(value).subscribe((location) => {
        if (location && location['entity']) {
          this.suggestedLocation = location['entity'];
          this.suggestedLocation = this.suggestedLocation.map((res) => {
            if (res.cityname !== null) {
              if (res.cityname === res.statename) {
                if (res.statename === res.countryname) {
                  res.citywithstate = `${res.cityname}`;
                } else {
                  res.citywithstate = `${res.cityname}, ${res.countryname}`;
                }
              } else {
                res.citywithstate = `${res.cityname}, ${res.statename}, ${res.countryname}`;
              }
              return res;
            }
          });
          this.items = this.suggestedLocation;
        }
      });
    } else {
      this.suggestedLocation = [];
      this.suggestions = false;
    }
  }

  // mylocationSearch(value) {
  //   if (value !== '') {
  //     this.suggestions = true;
  //     this.regService.searchLocations(value).subscribe((location) => {
  //       if (location && location['entity']) {
  //         this.suggestedLocation = location['entity'];
  //         console.log(this.suggestedLocation);
  //         this.suggestedLocation = this.suggestedLocation.map((res) => {
  //           res.final = '';
  //           if (res.continentname !== null && res.countryname === null && res.statename === null && res.cityname === null) {
  //             res.final = res.continentname;
  //           }
  //           if (res.continentname !== null && res.countryname !== null && res.statename === null && res.cityname === null) {
  //             res.final = `${res.continentname}, ${res.countryname}`;
  //           }
  //           if (res.continentname !== null && res.countryname !== null && res.statename !== null && res.cityname === null) {
  //             res.final = `${res.countryname}, ${res.statename}`;
  //           }
  //           if (res.continentname !== null && res.countryname !== null && res.statename !== null && res.cityname !== null) {
  //             res.final = `${res.countryname}, ${res.cityname}`;
  //           }
  //           res.final =  res.final.split(',');
  //           res.final = res.final.reverse().join(', ');
  //           return res;
  //         });
  //         this.items = this.suggestedLocation;
  //       }
  //     });
  //   } else {
  //     this.suggestedLocation = [];
  //     this.suggestions = false;
  //   }
  // }

  addPreferredLocation(addr) {
    console.log(addr);
    this.checkContent = false;
    const isSelected = this.selectedlocation.find((ele) => {
      return ele[this.addrObj[ele['searchedby']]] === addr[this.addrObj[addr['searchedby']]];
    });
    if (this.selectedlocation.length > 0) {
      if (isSelected === undefined) {
        this.selectedlocation.push({
          cityname: addr.cityname,
          cityid: addr.cityid === null ? 0 : addr.cityid,
          latitude: addr.latitude,
          longitude: addr.longitude,
          statename: addr.statename,
          stateid: addr.stateid === null ? 0 : addr.stateid,
          countryname: addr.countryname,
          countryid: addr.countryid === null ? 0 : addr.countryid,
          continentname: addr.continentname,
          continentid: addr.continentid === null ? 0 : addr.continentid,
          searchedby: addr.searchedby
        });
      }
    } else {
      this.selectedlocation.push({
        cityname: addr.cityname,
        cityid: addr.cityid === null ? 0 : addr.cityid,
        latitude: addr.latitude,
        longitude: addr.longitude,
        statename: addr.statename,
        stateid: addr.stateid === null ? 0 : addr.stateid,
        countryname: addr.countryname,
        countryid: addr.countryid === null ? 0 : addr.countryid,
        continentname: addr.continentname,
        continentid: addr.continentid === null ? 0 : addr.continentid,
        searchedby: addr.searchedby
      });
    }
    this.location.push({
      city: {
        cityid: addr.cityid === null ? 0 : addr.cityid,
      },
      state: {
        stateid: addr.stateid === null ? 0 : addr.stateid,
      },
      country: {
        countryid: addr.countryid === null ? 0 : addr.countryid,
      },
      continent: {
        continentid: addr.continentid === null ? 0 : addr.continentid,
      }
    });
    console.log(this.selectedlocation);
  }

  reomveLocation(addr) {
    console.log(this.selectedlocation);
    this.selectedlocation = this.selectedlocation.filter((ele) => {
      return ele[this.addrObj[ele['searchedby']]] !== addr[this.addrObj[addr['searchedby']]];
    });
    this.location = [];
    for (let i = 0; i < this.selectedlocation.length; i++) {
      this.location.push({
        city: {
          cityid: this.selectedlocation[i]['cityid'] !== 0 ? this.selectedlocation[i]['cityid'] : 0,
        },
        state: {
          stateid: this.selectedlocation[i]['stateid'] !== 0 ? this.selectedlocation[i]['stateid'] : 0,
        },
        country: {
          countryid: this.selectedlocation[i]['countryid'] !== 0 ? this.selectedlocation[i]['countryid'] : 0,
        },
        continent: {
          continentid: this.selectedlocation[i]['continentid'] !== 0 ? this.selectedlocation[i]['continentid'] : 0,
        }
      });
    }
    console.log(this.location);
  }

  changeAddres(value) {
    this.mycontactinfo = value;
    console.log(value);
    this.createPostForm['controls']['contact'].setValue(value);

    if (value === 1) {
      // this.contactbuilder = this.formBuilder.array([this.createItem()]);
      this.addressCheck = true;
    }
    if (value === 2) {
      this.addressCheck = false;
      this.createPostForm['controls']['contact'].setValue(value);
      this.contactbuilder.removeAt(0);
      // this.createPostForm.get('arrAddress')['controls'] = [];
      this.createPostForm.get('arrAddress').clearValidators();
      // let carrAddress = this.createPostForm.get('arrAddress')['controls'][0]
      // carrAddress.clearValidators();
      // carrAddress.updateValueAndValidity();
      console.log(this.createPostForm.get('contact'));
      console.log(this.createPostForm.get('arrAddress'));
    }
    console.log(this.addressCheck);
    console.log(this.createPostForm);
  }

  prevpages() {
    if (this.pages > 0) {
      --this.pages;
    }
  }

  filterModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(
      template,
      Object.assign({}, { class: 'mobile-filter-modal' })
    );
  }

  getPhoneCode() {
    this.service.getAllCountry().subscribe(res => {
      this.allcountryData = res['entity'];
      console.log(this.allcountryData);
    });
  }

  removeDocument(id) {
    // this.documentList.removeAt(id);
    this.createPostForm.controls['documentList']['controls'].splice(id, 1);
    this.filesuploaded = this.createPostForm.controls['documentList']['length'];

    console.log(this.createPostForm.controls['documentList']);
    console.log(id);

    if (this.createPostForm.controls['documentList']['controls'].length > 3) {
      this.fileuploadDiabled = true;
    } else {
      this.fileuploadDiabled = false;
    }

  }


  removeVideo(id) {
    // this.videoList.removeAt(id);
    this.createPostForm.controls['videoList']['controls'].splice(id, 1);
    // this.filesuploaded = this.createPostForm.controls['videoList']['length'];

    console.log(this.createPostForm.controls['videoList']);
    console.log(id);

    if ((this.createPostForm.controls['videoList']['controls'].length +
      this.createPostForm.controls['videoUrlList']['controls'].length) > 3) {
      this.videuploadDiabled = true;
    } else {
      this.videuploadDiabled = false;
    }

  }

   fileChangeEvent(files, filetype) {
    console.log(files);
    if (files.length <= 3) {

      this.filestype = filetype;
      this.selectedFiles = files;
      const file = this.selectedFiles;

      console.log(this.createPostForm.controls['documentList']['controls'].length);

      // Document
      if (filetype === 1 && this.createPostForm.controls['documentList']['controls'].length >= 3) {
        this.showError('Only 3 Documents allowed');
        // this.fileuploadDiabled = true;
      }

      if (filetype === 2 && (this.createPostForm.controls['videoList']['controls'].length +
        this.createPostForm.controls['videoUrlList']['controls'].length) >= 3) {
        this.showError('Only 3 videos allowed');
        // this.videuploadDiabled = true;
      }

      if (file && file.length > 0) {
        if (this.i >= file.length) {
          console.log('here', this.docuerror);
          this.i = 0;
          if (this.docuerror) {

            var sizemessage = '';
            var extnmessage = '';
            if (this.sizeRestriction && !this.extendsionRestriction) {
              sizemessage = this.sizeRestriction;
            }
            if (this.sizeRestriction && this.extendsionRestriction) {
              sizemessage = ',' + this.sizeRestriction;
            }
            if (this.extendsionRestriction) {
              extnmessage = this.extendsionRestriction + 'invalid file format ';
            }
            this.extendsionRestrictionMessage = extnmessage + sizemessage;
            setTimeout(() => {
              this.extendsionRestriction = '';
              this.sizeRestriction = '';
              this.extendsionRestrictionMessage = '';
            }, 5000);
          }
          return;

        }
        const checkValidFile = this.getCredential(file[this.i]);
        console.log(checkValidFile.fileExtenstion);

        var validation = false;

        if (filetype === 1) {
          if (((checkValidFile.fileExtenstion.toLowerCase() === '.docx') || (checkValidFile.fileExtenstion.toLowerCase()) === '.doc' ||
            (checkValidFile.fileExtenstion.toLowerCase()) === '.rtf') || (checkValidFile.fileExtenstion.toLowerCase()) === '.pdf' ||
            (checkValidFile.fileExtenstion.toLowerCase()) === '.xls' || (checkValidFile.fileExtenstion.toLowerCase()) === '.xlsx') {
            validation = true;
          }
        } else if (filetype === 2) {
          if ((checkValidFile.fileExtenstion.toLowerCase() === '.mp4')) {
            validation = true;
          }
        }

        if (validation) {
          var w = file[this.i].size;
          if (w > 0 && +w <= 52912901) {
            const params = this.getParams(file[this.i], checkValidFile);
            var key = params.Key;


            if (filetype === 1) {
              this.documentList = this.createPostForm.get('documentList') as FormArray;
              this.documentList.push(this.formBuilder.group({
                id: [''],
                documentoriginalname: [checkValidFile.fileName],
                extension: [checkValidFile.fileExtenstion],
                percentage: [0],
                filetype: filetype,
                uploaddoc: [key]
              })
              );
              this.awsUploadFile(file[this.i], params, this.documentList.length, filetype);
            }
            if (filetype === 2) {
              this.videoList = this.createPostForm.get('videoList') as FormArray;
              this.videoList.push(this.formBuilder.group({
                id: [''],
                documentoriginalname: [checkValidFile.fileName],
                extension: [checkValidFile.fileExtenstion],
                percentage: [0],
                filetype: filetype,
                uploaddoc: [key]
              })
              );
              this.awsUploadFile(file[this.i], params, this.videoList.length, filetype);
            }

            console.log(this.documentList);

            this.filesuploaded = this.createPostForm.controls['documentList']['length'];

            //  this.validateUploadedLength();

          } else {
            this.docuerror = true;
            this.sizeRestriction += 'File Should be below 50 MB' + ' ';
            this.showError(this.sizeRestriction);
            this.i += 1;
            this.fileChangeEvent(this.selectedFiles, filetype);
          }
        } else {
          this.docuerror = true;
          this.extendsionRestriction += '.' + checkValidFile.fileExtenstion + ' ';
          if (filetype === 1) {
            this.showError('Upload PDF, EXCEL, WORD documents only');
          } else if (filetype === 2) {
            this.showError('Upload Mp4 Files only');
          }
          this.i += 1;
          this.fileChangeEvent(this.selectedFiles, filetype);
        }
      } else {
        this.i = 0;
        console.log('else 22');
      }
    } else {
      this.showError('Upload not more than 3 Files');
    }
  }

  awsUploadFile(file, params, i, filetype) {
    this.submitDisabled = true;
    if (filetype === 1) {
      this.fileuploadDiabled = true;
    }
    if (filetype === 2) {
      this.videuploadDiabled = true;
    }
    console.log(this.fileuploadDiabled, this.videuploadDiabled);

    AWS.config.region = environment.awsRegion;
    AWS.config.credentials = new AWS.CognitoIdentityCredentials({
      IdentityPoolId: environment.awsIdentityPoolId
    });
    console.log('awsupload');
    if (file) {
      console.log(file);

      var Obj = this;
      const bucket = new S3({ params: { Bucket: params.Bucket } });
      bucket.upload(params).on('httpUploadProgress', function (evt) {
        this.uploadPercentage = ((evt.loaded * 100) / (+evt.total));
        Obj.progressBarValue(this.uploadPercentage, i, filetype);

      }).send(function (err, response) {
        console.log(response);
      });
    }
  }

  updateArray(localfilename, fileextension, uppercent) {
    this.documentList = this.createPostForm.get('documentList') as FormArray;
    this.documentList.push(this.formBuilder.group({
      id: [''],
      documentoriginalname: [localfilename],
      extension: [fileextension],
      percentage: [uppercent],
    })
    );
  }

  updateUrlArray() {

    this.videoUrlList = this.createPostForm.get('videoUrlList') as FormArray;

    console.log(this.createPostForm.get('videoUrlList'));

    if ((this.createPostForm.controls['videoList']['controls'].length
      + this.createPostForm.controls['videoUrlList']['controls'].length) >= 3) {
      this.showError('Only 3 videos allowed');
      this.videuploadDiabled = true;
    } else {
      this.videoUrlList.push(this.createurlItem());
      this.videuploadDiabled = false;
    }

  }


  removeUrlItem(id) {
    console.log('lksjdflkjsflkjsdklfj');
    // this.videoUrlList.removeAt(id);
    console.log(this.createPostForm.controls['videoUrlList']);
    console.log(this.createPostForm.controls['videoUrlList']['controls'][id]);

    this.createPostForm.controls['videoUrlList']['controls'].splice(+id, 1);
    // console.log(this.createPostForm.get('videoUrlList'));

    if ((this.createPostForm.controls['videoList']['controls'].length +
      this.createPostForm.controls['videoUrlList']['controls'].length) > 3) {
      this.showError('Only 3 videos allowed');
      this.videuploadDiabled = true;
    } else {
      this.videuploadDiabled = false;
    }

  }

  createurlItem() {
    return this.formBuilder.group({
      videourl: ['', [
        Validators.required,
        Validators.pattern('^(https?\:\/\/)?(www\.youtube\.com|youtu\.?be)\/.+$')
      ]
      ]
    });
  }


  // updatePercentage(percent, index) {
  //   this.createPostForm.get('documentList')['controls'][index].controls.percentage.setValue(+percent);
  //   if (this.createPostForm.get('documentList')['controls'][index].controls.percentage['value'] == 100) {
  //     this.i += 1;
  //     this.fileChangeEvent(this.i, filetype);
  //   }
  // }

  progressBarValue(percentage, i, filetype) {
    console.log(i);
    this.remainingPercentage = percentage;

    if (filetype === 1) {
      this.documentList['controls'][i - 1]['controls']['percentage'].setValue(this.remainingPercentage);
      if (this.documentList['controls'][i - 1]['controls']['percentage']['value'] === 100) {
        console.log('1st i ', i, this.fileuploadDiabled);
        
        this.fileuploadDiabled = false;
        this.submitDisabled = false;
        console.log('next record will trigger');
        this.i += 1;
        this.fileChangeEvent(this.selectedFiles, this.filestype);
      }
      console.log('2nd  i ', i, this.fileuploadDiabled);
    }

    if (filetype === 2) {
      this.videoList['controls'][i - 1]['controls']['percentage'].setValue(this.remainingPercentage);
      if (this.videoList['controls'][i - 1]['controls']['percentage']['value'] === 100) {
        this.videuploadDiabled = false;
        this.submitDisabled = false;
        console.log('next record will trigger');
        this.i += 1;
        this.fileChangeEvent(this.selectedFiles, this.filestype);
      }
    }
    console.log('progress bar ', this.fileuploadDiabled, this.videuploadDiabled);
  }

  getCredential(file): any {
    const extenstion = file.name.slice(file.name.lastIndexOf('.'));
    const credentials = {
      fileExtenstion: extenstion,
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

  fetchCompanySize() {
    this.postService.getCompanySize().subscribe(res => {
      if (res['status']['status'] === 200) {
        // console.log(res);
        this.companysize = res['entity'];
      }
    }, err => {
      console.log(err);

    });
  }

  fetchAmountRange() {
    const cuserid = localStorage.getItem('UserId');
    this.postService.getAmountRange(cuserid).subscribe(res => {
      console.log(res);
      if (res['status'] != null && res['status']['status'] === 200) {
        // console.log(res);
        this.amountrange = res['entity'];
      }
    }, err => {
      console.log(err);
    });
  }

  fetchCurrency() {

    this.postService.getCurrency().subscribe(res => {
      console.log(res);
      if (res['status']['status'] === 200) {
        console.log('test', res);
        this.countrycurrency = res['entity'];
      }
    }, err => {
      console.log(err);
    });
  }

  fetchBusinessPitch() {
    this.postService.getBusinessPitch().subscribe( res => {
      console.log(res);
      if (res['status']['status'] === 200) {
        console.log('test', res);
        this.businessPitch = res['entity'];
      }
    });
  }

  fetchAmountRangeByCurrency() {
    const currencyunit = this.createPostForm.get('currencyCountry').value;
    this.fetchAmtServer(currencyunit);
  }

  fetchAmtServer(moneyunit) {
    this.postService.getamountrangebycurrency(moneyunit).subscribe(res => {
      // console.log(res);

      if (res['status']['status'] === 200) {
        // console.log(res);
        this.amountrange = res['entity'];
      }

    }, err => {
      console.log(err);
    });

  }



  autoPopulate() {

    var that = this;
    setTimeout(function () {

      if (that.allcountryData && that.currentAdddres) {
        for (let index = 0; index < that.allcountryData.length; index++) {

          if (that.allcountryData[index].countrycode === that.currentAdddres['country_short_name']) {
            console.log(that.allcountryData[index].countrydialcode);
            that.countrycode = that.allcountryData[index].countrydialcode;
            console.log(that.countrycode);
          }
        }
        //  auto populating country phone code
        that.createPostForm.get('arrAddress')['controls'][0].controls.contactphonecode.setValue(that.countrycode);

      }
    }, 1000);

  }

  phonenumberPatterChanged() {
    console.log(this.createPostForm);

    let phonecodeval = this.createPostForm.get('arrAddress')['controls'][0]['controls']['contactphonecode'].value;

    for (let index = 0; index < this.createPostForm.get('arrAddress')['controls'].length; index++) {

      if (phonecodeval === '+91') {
        // india
        this.phonenumberpattern = '^([0-9]{10})$';
        this.phonenumberlimit = 10;
      } else if (phonecodeval === '+1') {
        // USA
        this.phonenumberpattern = '^(0|[1-9][0-9]*)$';
        this.phonenumberlimit = null;
      }

    }
  }


  autopopulateCurrency() {
    console.log(this.currentAdddres);
    if (this.currentAdddres['country_short_name'] === 'IN') {

      // console.log(this.createPostForm.get('currencyCountry'));

      //  auto populating Currency phone code
      this.createPostForm.get('currencyCountry').setValue('INR');
      this.fetchAmtServer('INR');


    } else if (this.currentAdddres['country_short_name'] === 'AE') {

      //  UAE
      this.createPostForm.get('currencyCountry').setValue('AED');
      this.fetchAmtServer('AED');

    } else if (this.currentAdddres['country_short_name'] === 'US') {
      //  USA;
      this.createPostForm.get('currencyCountry').setValue('USD');
      this.fetchAmtServer('USD');

    } else if (this.currentAdddres['country_short_name'] === 'GB') {
      //  USA
      this.createPostForm.get('currencyCountry').setValue('GBP');
      this.fetchAmtServer('GBP');
    } else {
      //  USA
      this.createPostForm.get('currencyCountry').setValue('USD');
      this.fetchAmtServer('USD');
    }


  }


  generateEmbedCodeFromUrl(url) {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    if (match && match[2].length === 11) {
      const embedurl = 'https://www.youtube.com/embed/' + match[2];
      this.youtubeurlmatched = true;
      return embedurl;
    } else {
      this.youtubeurlmatched = false;
      return 'error';
    }
  }


  fetchEditPostData(postid) {
    this.loading = true;
    const uId = localStorage.getItem('UserId');

    this.postService.viewPostEdit(postid, uId).subscribe((responseview) => {
      console.log(responseview);

      if (responseview['status']['status'] === 200) {
        this.responseData = responseview['entity'];
        console.log(this.responseData['companysize']);

        this.loading = false;
        this.createPostForm.get('postName').setValue(this.responseData['postname']);
        this.createPostForm.get('companyName').setValue(this.responseData['companyname']);
        if (this.responseData['companysize'] !== null) {
          this.createPostForm.get('sizeCompany').setValue(this.responseData['companysize']['id']);
        } else {
          this.createPostForm.get('sizeCompany').setValue('');
        }

        this.createPostForm.get('companyWebsite').setValue(this.responseData['companywebsite']);
        this.createPostForm.get('bussinessSummary').setValue(this.responseData['postsummary']);
        this.createPostForm.get('foundedYear').setValue(this.responseData['companyfounded']);
        console.log(this.responseData['contactinfo']['contactinfoid']);

        if (+this.responseData['contactinfo']['contactinfoid'] === 1) {
          console.log('if 1');

          this.createPostForm.get('contact').setValue(1);
          this.mycontactinfo = 1;
        }
        if (+this.responseData['contactinfo']['contactinfoid'] === 2) {
          console.log('if 2');
          this.addressCheck = false;
          this.createPostForm.get('contact').setValue(2);
          this.mycontactinfo = 2;
          this.contactbuilder.removeAt(0);
        }
        // this.createPostForm.get('contact').setValue(this.responseData['contactinfo']['contactinfoid']);

        console.log(this.createPostForm.get('contact'));


        this.createPostForm.get('accountType').setValue(this.responseData['accounttype']['accounttypeid']);
        if (this.responseData['accounttype']['accounttypeid'] === 4) {
          this.accId = 4;
        }
        console.log(this.createPostForm.get('currencyCountry').value);

        this.createPostForm.get('businessPitchType').setValue(this.responseData['businesspitch']['pitchid']);
        this.businessPitchTypeId = this.responseData['businesspitch']['pitchid'];

        // populate Logo
        if (this.responseData && this.responseData['postlogo']) {
          this.uploadImageUrl = environment.cloudFrontURL + this.responseData['postlogo'];
          this.logokey = this.responseData['postlogo'];
        } else {
          this.uploadImageUrl = './assets/images/mobile-logo.png';
        }

        // populate Locations

        this.location = [];
        this.searchfield = '';
        for (let index = 0; index < this.responseData['postlocation'].length; index++) {
          console.log(this.responseData['postlocation'][index]['continent']);
          // tslint:disable-next-line:max-line-length
          if (this.responseData['postlocation'][index]['city'] === null && this.responseData['postlocation'][index]['state'] === null && this.responseData['postlocation'][index]['country'] === null && this.responseData['postlocation'][index]['continent'] !== null) {
            this.searchfield = 'Continent';
          }
          // tslint:disable-next-line:max-line-length
          if (this.responseData['postlocation'][index]['city'] === null && this.responseData['postlocation'][index]['state'] === null && this.responseData['postlocation'][index]['country'] !== null && this.responseData['postlocation'][index]['continent'] !== null) {
            this.searchfield = 'Country';
          }
          // tslint:disable-next-line:max-line-length
          if (this.responseData['postlocation'][index]['city'] === null && this.responseData['postlocation'][index]['state'] !== null && this.responseData['postlocation'][index]['country'] !== null && this.responseData['postlocation'][index]['continent'] !== null) {
            this.searchfield = 'State';
          }
          // tslint:disable-next-line:max-line-length
          if (this.responseData['postlocation'][index]['city'] !== null && this.responseData['postlocation'][index]['state'] !== null && this.responseData['postlocation'][index]['country'] !== null && this.responseData['postlocation'][index]['continent'] !== null) {
            this.searchfield = 'City';
          }
          this.selectedlocation.push({
            searchedby: this.searchfield,
            // tslint:disable-next-line:max-line-length
            cityid: this.responseData['postlocation'][index]['city'] !== null ? this.responseData['postlocation'][index]['city']['cityid'] : 0,
            // tslint:disable-next-line:max-line-length
            cityname: this.responseData['postlocation'][index]['city'] !== null ? this.responseData['postlocation'][index]['city']['cityname'] : null,
            // tslint:disable-next-line:max-line-length
            stateid: this.responseData['postlocation'][index]['state'] !== null ? this.responseData['postlocation'][index]['state']['stateid'] : 0,
            // tslint:disable-next-line:max-line-length
            statename: this.responseData['postlocation'][index]['state'] !== null ? this.responseData['postlocation'][index]['state']['statename'] : null,
            //  tslint:disable-next-line:max-line-length
            countryid: this.responseData['postlocation'][index]['country'] !== null ? this.responseData['postlocation'][index]['country']['countryid'] : 0,
            // tslint:disable-next-line:max-line-length
            countryname: this.responseData['postlocation'][index]['country'] !== null ? this.responseData['postlocation'][index]['country']['countryname'] : null,
            // tslint:disable-next-line:max-line-length
            continentid: this.responseData['postlocation'][index]['continent'] !== null ? this.responseData['postlocation'][index]['continent']['continentid'] : 0,
            // tslint:disable-next-line:max-line-length
            continentname: this.responseData['postlocation'][index]['continent'] !== null ? this.responseData['postlocation'][index]['continent']['continentname'] : null,
          });
          console.log(this.selectedlocation, 'dddddddddddddddd');
          this.location.push({
            city: {
              // tslint:disable-next-line:max-line-length
              cityid: this.responseData['postlocation'][index]['city'] !== null ? this.responseData['postlocation'][index]['city']['cityid'] : 0,
            },
            state: {
              // tslint:disable-next-line:max-line-length
              stateid: this.responseData['postlocation'][index]['state'] !== null ? this.responseData['postlocation'][index]['state']['stateid'] : 0,
            },
            country: {
              // tslint:disable-next-line:max-line-length
              countryid: this.responseData['postlocation'][index]['country'] !== null ? this.responseData['postlocation'][index]['country']['countryid'] : 0,
            },
            continent: {
              // tslint:disable-next-line:max-line-length
              continentid: this.responseData['postlocation'][index]['continent'] !== null ? this.responseData['postlocation'][index]['continent']['continentid'] : 0,
            },
          });
        }
        console.log(this.location);
        // if(this.responseData['postindustry']){

        console.log(this.createPostForm);
        // }
        // populate Industry

        this.industryArray = [];
        for (let index = 0; index < this.responseData['postindustry'].length; index++) {
          // console.log(this.responseData['postindustry'][index]['industryid']);
          // console.log(this.indusValue);

          for (let jindex = 0; jindex < this.indusValue.length; jindex++) {

            if (+this.responseData['postindustry'][index]['industryid'] === +this.indusValue[jindex]['industryid']) {

              this.indusValue[jindex].selected = true;
              // this.createPostForm.get('targetIndustry').setValue(true)
            }

          }

          // this.industryArray.push({
          //   position: index,
          //   status: true,
          //   industryid: this.responseData['postindustry'][index]['industryid']
          // });

        }

        console.log(this.indusValue);

        // populate Type of Post

        // validating for
        this.typeofpostchoosen = this.responseData['accounttype']['accounttypeid'];

        if (this.responseData['subaccounttype'] && this.responseData['subaccounttype']['subacctypeid']) {
          this.invesId = this.responseData['subaccounttype']['subacctypeid'];
        }

        this.dynamicvalidation();


        if (this.responseData['accounttype']['accounttypeid'] === 4) {
          this.typeofinvestor = true;
          this.checkEntp = true;
        } else {
          this.typeofinvestor = false;
          this.checkEntp = false;
        }

        for (let i = 0; i < this.pitchValue.length; i++) {
          if (this.responseData['businesspitch']['pitchid'] === this.pitchValue[i]['pitchid']) {
            this.pitchValue[i].selectedPitch = true;
            this.businessPitchTypeId = this.responseData['businesspitch']['pitchid'];
          }
        }


        for (let index = 0; index < this.accValue.length; index++) {
          // console.log(this.accValue);

          if (this.responseData['accounttype']['accounttypeid'] === this.accValue[index]['accounttypeid']) {
            this.accValue[index].selectedInd = true;
            this.accountTypeId = this.responseData['accounttype']['accounttypeid'];

            if (this.responseData['accounttype']['accounttypeid'] === 3 && this.responseData['subaccounttype']['subacctypeid'] === 1) {
              this.typeofpostchoosen = this.responseData['accounttype']['accounttypeid'];
              this.investCheck = true;
              this.validyear = true;

            } else {
              this.typeofpostchoosen = this.responseData['accounttype']['accounttypeid'];
              this.investCheck = false;
              this.validyear = false;
            }

            if (this.accValue[index]['accounttypeid'] === 3) {
              this.typeofinvestor = true;
              this.fetchSubindustValue(this.accValue[index]['accounttypeid']);
            } else {
              this.typeofinvestor = false;
            }

            if (this.accValue[index]['accounttypeid'] === 4) {
              this.checkEntp = true;
              this.validyear = true;

              //  console.log(this.responseData['amount']['currencycode']);

              this.createPostForm.get('currencyCountry').setValue(this.responseData['amount']['currencycode']);

              if (this.responseData['amount']['range1']) {
                this.fetchAmtServer(this.responseData['amount']['currencycode']);
                this.createPostForm.get('myamountRange').setValue(this.responseData['amount']['id']);

              }

            } else {
              this.checkEntp = false;
            }


          }
        }


        // populate Type of Investors
        const that = this;
        setTimeout(function () {
          if (that.inves && that.inves.length > 0) {
            for (let index = 0; index < that.inves.length; index++) {
              const checkedid = parseInt(that.inves[index]['subacctypeid']);
              if (checkedid === that.responseData['subaccounttype']['subacctypeid']) {
                that.inves[index]['subchecked'] = true;
                that.invesId = that.responseData['subaccounttype']['subacctypeid'];
              }
            }
          }
          console.log(that.inves);
        }, 1000);

        //  this.createPostForm.controls['myamountRange'].value,

        // Empty contact list array
        this.createPostForm.get('arrAddress')['controls'] = [];

        if (this.responseData['contactList'].length > 0) {
          // 1 mean to Check directly throught businessin
          // this.changeAddres(1);
          this.directcontact = true;
        } else {
          this.directcontact = false;
        }

        for (let index = 0; index < this.responseData['contactList'].length; index++) {

          // Populating Contact List

          console.log(this.createPostForm.get('arrAddress'));

          const value = this.formBuilder.group({
            contacttitle: [this.responseData['contactList'][index]['contacttitle']],
            contactname: [this.responseData['contactList'][index]['contactname']],
            contactemail: [this.responseData['contactList'][index]['contactemail']],
            contactphoneno: [this.responseData['contactList'][index]['contactphoneno']],
            contactphonecode: [this.responseData['contactList'][index]['contactphonecode']],
            phonemask: ['']
          });
          this.createPostForm.get('arrAddress')['controls'].push(value);

          this.createPostForm['controls']['arrAddress']['controls'][index]['controls']['phonemask'].setValue(this.postService.checkDialCode(this.responseData['contactList'][index]['contactphonecode']));
        }



        this.uploaddocarray = [];
        for (let tindex = 0; tindex < this.responseData['uploadfiles'].length; tindex++) {

          console.log(this.responseData['uploadfiles'][tindex]);
          console.log(this.uploaddocarray);
          const mydocobject = {
            type: this.responseData['uploadfiles'][tindex]['type'],
            filetype: this.responseData['uploadfiles'][tindex]['filetype'],
            url: this.responseData['uploadfiles'][tindex]['url']
          };

          this.editDocArray.push(mydocobject);
          //  this.editDocArray = this.uploaddocarray;


          if (this.responseData['uploadfiles'][tindex]['type'] === 1) {
            console.log(this.responseData['uploadfiles'][tindex]['url']);

            if (this.responseData['uploadfiles'][tindex]['url'] &&
              this.responseData['uploadfiles'][tindex]['url'] != null) {

              let docext = this.responseData['uploadfiles'][tindex]['url'].split('.');


              if (docext && docext.length > 1) {
                const filevalue = this.formBuilder.group({
                  fileid: [this.responseData['uploadfiles'][tindex]['fileid']],
                  filetype: [this.responseData['uploadfiles'][tindex]['filetype']],
                  type: [this.responseData['uploadfiles'][tindex]['type']],
                  url: [this.responseData['uploadfiles'][tindex]['url']],
                  extension: '.' + [docext[1]],
                  documentoriginalname: [docext[0]],
                  percentage: 100,
                  uploaddoc: [this.responseData['uploadfiles'][tindex]['url']]

                });
                this.createPostForm.get('documentList')['controls'].push(filevalue);
              }

            }
          }

          if (this.responseData['uploadfiles'][tindex]['type'] === 2) {

            let videotype = this.responseData['uploadfiles'][tindex]['url'].split('https://');


            console.log(videotype && videotype.length > 1);

            if (videotype && videotype.length > 1) {

              const videourlvalue = this.formBuilder.group({
                fileid: [this.responseData['uploadfiles'][tindex]['fileid']],
                filetype: [this.responseData['uploadfiles'][tindex]['filetype']],
                type: [this.responseData['uploadfiles'][tindex]['type']],
                videourl: [this.responseData['uploadfiles'][tindex]['url']],
                uploaddoc: [this.responseData['uploadfiles'][tindex]['url']]
              });

              this.createPostForm.get('videoUrlList')['controls'].push(videourlvalue);

            } else {

              let videoext = this.responseData['uploadfiles'][tindex]['url'].split('.');

              console.log(videotype);

              if (videoext && videoext.length > 1) {
                const videovalue = this.formBuilder.group({
                  fileid: [this.responseData['uploadfiles'][tindex]['fileid']],
                  filetype: [this.responseData['uploadfiles'][tindex]['filetype']],
                  type: [this.responseData['uploadfiles'][tindex]['type']],
                  url: [this.responseData['uploadfiles'][tindex]['url']],
                  uploaddoc: [this.responseData['uploadfiles'][tindex]['url']],
                  extension: '.' + [videoext[1]],
                  documentoriginalname: [videoext[0]],

                  percentage: 100
                });

                this.createPostForm.get('videoList')['controls'].push(videovalue);
              }

            }

          }


        }

        console.log(this.createPostForm.get('videoList')['controls']);

        console.log(this.responseData);
        let cityValue;
        cityValue = `${this.responseData.city.cityname},`;
        let locati = [{
          cityid: this.responseData.city.cityid,
          cityname: cityValue,
          countryid: this.responseData.city.countryid,
          countryname: this.responseData.city.countryname,
          latitude: this.responseData.latitude,
          longitude: this.responseData.longitude,
          state: this.responseData.city.state,
          stateid: this.responseData.city.stateid,
          continent: this.responseData.city.continentname,
          continentid: this.responseData.city.continentid,
          citywithstate: `${this.responseData.city.cityname}, ${this.responseData.city.state}, ${this.responseData.city.countryname}`
        }];

        // Preloading location
        this.items = locati;

        console.log(this.createPostForm['myLocation']);
        this.items.push(this.responseData);

        var those = this;

        this._ngxDefaultTimeout = setTimeout(() => {

          // auto poulating company Location - single
          those.selectedcityid = locati[1]['city']['cityid'];

        }, 100);

      }
    });

    //  behavioral subject asign value
    this.postService.currentPost('');

  }

  public doNgxDefault(): any {
    return this._ngxDefault;
  }

  showError(showError) {
    this.toastr.clear();
    this.toastr.error(showError);
  }

  showSuccess(showSuccess) {
    this.toastr.clear();
    this.toastr.success(showSuccess);
  }

  changeMask(value, index) {
    console.log(value, index);
    console.log('sdlkfklsdflksdjf');
    this.createPostForm['controls']['arrAddress']['controls'][index]['controls']['phonemask'].setValue(this.postService.checkDialCode(value));
    console.log(this.createPostForm['controls']['arrAddress']['controls'][index]['controls']['phonemask'].value);

  }
  redirect() {
    this.isRedirect = true;
    this.modalRef.hide();
    this.router.navigate(['/post-list']);
  }
  cancelPopup() {
    this.isRedirect = false;
    this.modalRef.hide();
  }

  // canDeactivate() {
  //   console.log('lklk');

  //   const changess = this.createPostForm;
  //   if (changess.dirty && !this.isRedirect) {
  //     //this.cancelPost(this.cancelmodal);
  //   } else {
  //     return true;
  //   }
  // }

  changeFunctions(selected, i) {
    this.indusValue[i].selected = !selected;
    this.postIndustryArry();
  }

  getcontactinfo() {
    console.log('contact');
    this.postService.getcontactinfo().subscribe(res => {
      console.log(res);
      if (res && res['status'] && res['status']['status'] === 200) {
        this.contactinfo = res['entity'];
        console.log(this.contactinfo);
      }
    });
  }
}
