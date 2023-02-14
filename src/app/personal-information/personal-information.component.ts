import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { ImageCroppedEvent } from 'ngx-image-cropper';
import { RegisterService } from '../service/register.service';
import { ToastrService } from 'ngx-toastr';
import { debounceTime } from 'rxjs/operators';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import * as AWS from 'aws-sdk/global';
import * as S3 from 'aws-sdk/clients/s3';
import { FormControl } from '@angular/forms';
import { Observer, Observable } from 'rxjs';
import { LanguageService } from '../service/language.service';
import { PostService } from '../service/post.service';
import { MysubscriptionService } from '../service/mysubscription.service';

@Component({
  selector: 'app-personal-information',
  templateUrl: './personal-information.component.html'
})
export class PersonalInformationComponent implements OnInit {
  addrObj = { 'City': 'cityid', 'State': 'stateid', 'Country': 'countryid', 'Continent': 'continentid' };
  phonemask = '00000-00000';
  logindat: any;
  transferdata: any;
  locaionresult: any = { entity: null };
  isModalShown = false;
  modalRef: BsModalRef;
  modalconfig = {
    backdrop: true,
    ignoreBackdropClick: true,
    keyboard: false
  };
  locations: any;
  currentAdddres: any;
  newRegData: any;
  maplocation: any = '';
  preferredlocation: any = [];
  userIndustry: any = [];
  registerData: any = {
    userid: null,
    language: null,
    countryid: null,
    stateid: null,
    cityid: null
  };
  flagCheck = false;
  acctype: any;
  extenstion: any;
  fileName: any;
  fileExtenstion: any;
  uploadFinish: boolean;
  logoUpload: any;
  compani_logo: any;
  FOLDER: number;
  populate = 'false';
  emailExist = false;
  phoneNumberExist = false;
  phonenumberpattern: any;
  phonenumberlimit: number;
  lat;
  lng;

  languageData: any = [];
  public countryData: any = [];
  inputfirstDisabled = false;
  inputlastDisabled = false;
  inputemailDisabled = false;
  stateData: any = [];
  cityData: any = [];
  acctypeData: any = [];
  allindustryData: any = [];

  pages = 1;

  mobileView = false;
  desktopView = true;

  options: any;

  selectedlocation: any = [];
  selectedIndus: any = [];
  selectedAccTyp: any = [];
  pickedIndstryName: any = [];
  registerprofile: FormControl;
  imageFile: FileList;
  croppedImage: any = '';
  uploadCroppedImg: any;
  base64Image: string;
  langData: any = { common: '', personalInfo: '' };
  searchfield = '';
  acctypradio: any;
  generalId = '';
  showHeader = true;
  loading: boolean;
  currentnumber: any;
  finalNumber: any;
  selectOptiontemplateStatus: any = true;
  businessModelTemplateStatus: any = false;
  startNewBusinessModelStatus: any = false;
  accountTypeBasedOnNeedStatus: any = false;
  ExpendingYourBusinessStatus: any = false;
  BasedOnYourAnswerStatus: any = false;
  BasedOnYourAnswerInvestorStatus: any = false;
  BasedOnYourAnswerCompaniesStatus: any = false;
  BasedOnYourAnswerFranchiseStatus: any = false;
  BasedOnYourAnswerFranchiseesStatus: any = false;
  BasedOnYourAnswerDistributorsStatus: any = false;
  inves: any;
  public accountName: any;
  profiledetail: any;

  constructor(private modalService: BsModalService,
    private router: Router,
    private service: RegisterService,
    private toastr: ToastrService,
    private language: LanguageService,
    private postService: PostService, private mysubsciption: MysubscriptionService) {
    window.onresize = (e) => {
      this.ngAfterViewInit();
    };
  }

  // getRegisterData() {
  //   this.service.data.subscribe(data => {
  //     this.newRegData = data;
  //     console.log(this.newRegData);
  //   });
  // }


  getLang() {
    this.service.getAllLanguage().subscribe(res => {
      if (res) {
        if (res['entity'] !== null) {
          this.languageData = res['entity'];
        }
      }
    });
  }

  getCountry() {
    this.service.getAllCountry().subscribe(res => {
      if (res) {
        if (res['entity'] !== null) {
          this.countryData = res['entity'];
          this.autoPopulateCountry(this.countryData);
        }
      }
    });
  }

  getState() {

    this.registerData.stateid = null;
    this.registerData.cityid = null;
    this.cityData = [];
    this.stateData = [];
    this.service.getAllState(this.registerData.countryid).subscribe(res => {
      if (res) {
        if (res['entity'] !== null) {
          this.stateData = res['entity'];
          if (this.stateData === []) {
            this.flagCheck = true;
          }
          this.autoPopulateState(this.stateData);
        }
      }

    });


    for (let index = 0; index < this.countryData.length; index++) {
      if ((+this.registerData.countryid) === (+this.countryData[index].countryid)) {
        this.registerData.phonecode = this.countryData[index].countrydialcode;
      }
    }
    this.changeMask(this.registerData.phonecode);

  }

  getCity() {
    if (this.registerData.stateid) {
      this.service.getAllCity(this.registerData.stateid).subscribe(res => {
        if (res) {
          if (res['entity'] !== null) {
            this.cityData = res['entity'];

            this.autoPopulateCity(this.cityData);
          }
        }
      });
    }
  }


  getAccountType() {
    this.service.getAccType().subscribe(res => {
      if (res) {
        this.acctypeData = res['entity'];
      }
    });
  }

  getSubAccountType() {
    this.postService.getSubPost(3).subscribe((insValue) => {
      this.inves = insValue['entity'];
      console.log(this.inves);
    });
  }

  async getIndustry() {
    await this.service.getAllIndustry().subscribe(res => {
      this.allindustryData = res['entity'];

      this.allindustryData = this.allindustryData.map((ele) => {
        ele.flag = false;
        return ele;
      });
      if (this.generalId === 'true') {
        this.loading = true;
        this.populate = 'true';
        const that = this;
        that.getprofiledetail();
      } else {
        this.mysubsciption.tabEmit.subscribe((res) => {
          if (res === 'true') {
            this.generalId = 'true';
            this.getprofiledetail();
          }
        });
      }
    });
  }

  selectedIndustry(value, industry, index) {
    this.allindustryData[index].flag = value;
    if (value === true) {
      this.selectedIndus.push({
        position: index,
        status: value,
        data: industry,
      });
    } else {
      for (let i = 0; i < this.selectedIndus.length; i++) {
        if (this.selectedIndus[i].position === index) {
          this.selectedIndus.splice(i, 1);
          // this.removeIndustry(index);
        }
      }
    }

    for (let ind = 0; ind < this.allindustryData.length; ind++) {
      if (this.selectedIndus[ind] && this.selectedIndus[ind] !== undefined) {
        this.pickedIndstryName[ind] = this.selectedIndus[ind];
      }

    }
  }

  // removeIndustry(position) {
  //   console.log(position);
  //   for (let index = 0; index < this.pickedIndstryName.length; index++) {
  //     if (this.pickedIndstryName[index].position === position) {
  //       // console.log('enter first loop');
  //       for (let i = 0; i < this.allindustryData.length; i++) {
  //         console.log(this.allindustryData.length);
  //         console.log(this.allindustryData);

  //         if (this.pickedIndstryName[index].data.industryid === this.allindustryData[i].industryid) {
  //           // uncheck the checkbox
  //           this.allindustryData[i].flag = false;
  //           break;
  //         }
  //       }
  //       this.pickedIndstryName.splice(index, 1);
  //       this.selectedIndus.splice(index, 1);
  //     }
  //   }

  // }

  selectedAccType(selectedacctype) {
    console.log(selectedacctype);
    this.selectedAccTyp = selectedacctype;
    this.registerData.acctype = this.selectedAccTyp.accounttypeid;
    //  this.userIndustry = ({'industry': {industryid: this.selectedAccTyp.accounttypeid}});
  }

  checkEmailIsExist(email) {
    this.service.checkMail(email).subscribe(res => {
      if (res['status'] === 229) {
        this.emailExist = false;
      }
    }, err => {
      if (err['error'].status === 302) {
        this.emailExist = true;
      }
    }
    );
  }

  checkPhoneNumberIsExist(phone) {
    console.log(phone, '$$$');
    this.populate = 'false';
    if (phone === this.currentnumber && this.generalId === 'true') {
    } else {
      this.service.checkPhone(phone).subscribe(res => {
        if (res['status'] === 229) {
          this.phoneNumberExist = false;
          this.finalNumber = phone;
        }
      }, err => {
        if (err['error'].status === 302) {
          this.phoneNumberExist = true;
        }
      }
      );
    }

  }

  openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(
      template,
      Object.assign({}, { class: 'modal-custom' })
    );
  }

  filterModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(
      template,
      Object.assign({}, { class: 'mobile-filter-modal' })
    );
    this.locaionresult = '';
  }

  doSelectOptions(value) {
  }
  ngOnInit() {
    this.accountName = '';
    this.getLang();
    this.ngAfterViewInit();
    this.getIndustry();
    this.getAccountType();
    this.getSubAccountType();
    this.getCurrentLocation();
    this.getCountry();
    const geturl = this.router.url;
    const params = geturl.split('settings/');
    this.generalId = params[1];
    if (this.generalId === '' || this.generalId === undefined) {
      this.populate = 'false';
      this.autoPopulateRegisterUser();
    } else if (this.generalId === 'true') {
      this.showHeader = false;
      this.populate = 'true';
      this.loading = true;
    } else {
      this.mysubsciption.tabEmit.subscribe((res) => {
        this.showHeader = false;
        this.generalId = 'true';
      });
    }

    this.fetchLanguage();
  }

  fetchLanguage() {
    this.language.getLanguageData(1)
      .subscribe(
        (response: any) => {
          this.langData = response;
        },
        (error) => {
          console.log(error);
        }
      );
  }

  checkUserId(uid) {
    const that = this;
    setTimeout(function () {
      if (uid === '' || uid == null || uid === undefined) {
        that.router.navigate(['/home']);
      } else {
        console.log(uid);
      }
    }, 1000);
  }

  emailValidation(emailValue) {
    if (this.inputemailDisabled === false) {
      this.checkEmailIsExist(emailValue);
    }
  }

  autoPopulateRegisterUser() {
    // behavioural Subject
    this.service.cast.subscribe(res => this.transferdata = res);
    if (this.transferdata.origin && this.transferdata.origin != null) {

      if (this.transferdata.firstname !== null) {
        this.inputfirstDisabled = true;
      }
      if (this.transferdata.lastname !== null) {
        this.inputlastDisabled = true;
      }
      if (this.transferdata.email && this.transferdata.email !== null) {
        this.inputemailDisabled = true;
      }
      // binding social registration data
      this.croppedImage = this.transferdata.imgurl;
      this.registerData.origin = this.transferdata.origin;
      this.registerData.firstname = this.transferdata.firstname;
      this.registerData.lastname = this.transferdata.lastname;
      this.registerData.email = this.transferdata.email;
      this.registerData.userid = this.transferdata.userid;
      this.registerData.facebookid = this.transferdata.fbid;
      this.registerData.gmailid = this.transferdata.gid;
      this.registerData.twitterid = this.transferdata.twtrid;
      this.registerData.linkedinid = this.transferdata.linkedinid;

      if (this.inputemailDisabled === false) {
        this.checkEmailIsExist(this.registerData.email);
      }
      // Upload Social Image in Server
      this.getSocialLoginImage(this.croppedImage);

      // validating email is already exist

    } else {
      if (this.transferdata != null && this.transferdata !== '') {
        // binding  email Registration
        this.registerData.origin = 1;
        this.registerData.firstname = this.transferdata['entity'].userprofile.firstname;
        this.registerData.lastname = this.transferdata['entity'].userprofile.lastname;
        this.registerData.email = this.transferdata['entity'].email;
        this.registerData.userid = this.transferdata['entity'].userid;
        if (this.registerData.firstname !== null) {
          this.inputfirstDisabled = true;
        }
        if (this.registerData.lastname !== null) {
          this.inputlastDisabled = true;
        }
        // if (this.registerData.email !== null) {
        //   this.inputemailDisabled = true;
        // }
      }
      // Delay for Checking User Id
      this.checkUserId(this.registerData.userid);
      // setTimeout(function() { alert(); }, 2000);
    }

  }

  ngAfterViewInit() {
    this.onResize(window.innerWidth);
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

  // handleAddressChange(addr) {
  //   console.log(addr);
  //   this.maplocation = '';
  // if (this.selectedlocation.length > 0) {
  //   let addressrepeat = false;
  //   for (let index = 0; index < this.selectedlocation.length; index++) {
  //     if (this.selectedlocation[index].lat == addr.geometry.location.lat() &&
  //        this.selectedlocation[index].lng == addr.geometry.location.lng()) {
  //       addressrepeat = true;
  //     }
  //   }
  //   if (addressrepeat == false) {
  //     this.selectedlocation.push({
  //         lat: addr.geometry.location.lat(),
  //         lng: addr.geometry.location.lng(),
  //         fulladdress: addr.formatted_address,
  //         id: addr.id
  //       });
  //   }
  // } else {
  //   this.selectedlocation.push({
  //     lat: addr.geometry.location.lat(),
  //     lng: addr.geometry.location.lng(),
  //     fulladdress: addr.formatted_address,
  //     id: addr.id
  //   });
  // }

  // }

  reomveLocation(id) {
    this.selectedlocation = this.selectedlocation.filter((ele) => {
      return ele[this.addrObj[ele['searchedby']]] !== id[this.addrObj[id['searchedby']]];
    });
    // for (let index = 0; index < this.selectedlocation.length; index++) {
    //   if (this.selectedlocation[index].cityid === id) {
    //     this.selectedlocation.splice(index, 1);
    //   }
    // }
  }


  prevpages() {
    if (this.pages > 0) {
      --this.pages;
    }
  }

  nextPage() {
    this.pages++;
  }

  // Image cropper

  fileChangeEvent(event: any, template): void {
    this.imageFile = event;
    console.log(event);

    const filename = event.target.files[0].name;
    const extension = filename.split('.');

    if (extension[1] === 'jpg' || extension[1] === 'png' || extension[1] === 'jpeg' || extension[1] === 'JPEG') {
      this.modalRef = this.modalService.show(
        template,
        Object.assign(this.modalconfig, { class: 'modal-custom' })
      );
    } else {
      this.showError('Please Upload only .png  & .jpg');
    }
  }

  uploadfile() {
    const file = this.imageFile['target'].files[0];
    this.uploadImageInServer(file);
  }

  uploadImageInServer(file) {
    AWS.config.region = 'us-west-2'; // 1. Enter your region
    AWS.config.credentials = new AWS.CognitoIdentityCredentials({
      IdentityPoolId: 'us-west-2:24156852-9a85-4b7d-8846-b5f44dd05590' // 2. Enter your identity pool
    });

    if (file) {
      const fileDetails = this.getCredential(file);
      const params = this.getParams(file, fileDetails);
      if (params['Key']) {
        this.registerData.profileimage = params['Key'];
        // this.showSuccess('Awesome, that's a great picture');
      }
      const bucket = new S3({ params: { Bucket: params.Bucket } });
      bucket.upload(params).on('httpUploadProgress', function (evt) {
      }).send(function (err, response) {

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

  imageCroppedFile1(event) {

  }

  imageCropped(event: Promise<ImageCroppedEvent>) {

    this.croppedImage = event['base64'];
    this.uploadCroppedImg = event;

    this.registerData.profileimage = this.croppedImage;
  }
  // imageLoaded() {
  //     // show cropper
  // }
  // cropperReady() {
  //     // cropper ready
  // }
  // loadImageFailed() {
  //     // show message
  // }


  // -- Image cropper


  getCurrentLocation() {
    if (window.navigator && window.navigator.geolocation) {
      window.navigator.geolocation.getCurrentPosition(
        (showPosition) => {
          this.lat = showPosition.coords.latitude;
          this.lng = showPosition.coords.longitude;
          this.getAddressBasedonLatandLng(this.lat, this.lng, 'initial');
        },
        showError => {
          this.getCurrentIPAddress();
        });
    } else {
      this.getCurrentIPAddress();
    }
  }

  getCurrentIPAddress() {
    this.service.getCurrentIPAddress().subscribe(
      res => {
        if (res && res['ip']) {
          this.getAddressBasedonCurrentIp(res['ip']);
        }
      },
      err => {
        console.log(err);
      }
    );
  }

  getAddressBasedonCurrentIp(ip) {
    this.service.getAddressBasedonCurrentIp(ip).subscribe(
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

    if (latitude && longitude) {

      this.service.getAddressFromGoogle(latitude, longitude).subscribe(
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


              this.getCountry();

            }
          }

        },
        err => {
          console.log(err);
        }
      );
    }

  }


  showError(showError) {
    this.toastr.error(showError);
  }

  showSuccess(showSuccess) {
    this.toastr.success(showSuccess);
  }


  autoPopulateCountry(countdata: any) {
    // console.log(this.currentAdddres);

    if (this.currentAdddres !== '' && this.currentAdddres != null && countdata.length > 0) {
      for (let index = 0; index < countdata.length; index++) {
        // currentAdddres === cntry.country

        if (countdata[index].countryname === this.currentAdddres.country) {

          // console.log(countdata[index].countryid);
          this.registerData.countryid = countdata[index].countryid;

        }

        if (countdata[index].countrycode === this.currentAdddres.country_short_name) {
          this.registerData.phonecode = countdata[index].countrydialcode;

          // change pattern for phone number based on location
          // this.phonenumberPatterChanged();

        }
      }
      this.getState();
    }
  }


  autoPopulateState(statedata: any) {

    if (this.currentAdddres !== '' && this.currentAdddres != null && statedata.length > 0) {
      for (let index = 0; index < statedata.length; index++) {
        if (statedata[index].statename === this.currentAdddres.state) {

          this.registerData.stateid = statedata[index].stateid;

          // console.log(this.registerData.stateid);

        }
      }
      this.getCity();
    }
  }

  autoPopulateCity(citydata: any) {
    // this.currentAdddres.city = this.currentAdddres['city'].toLowerCase();
    if (this.currentAdddres !== '' && this.currentAdddres != null && citydata.length > 0) {
      for (let index = 0; index < citydata.length; index++) {
        citydata[index].cityname = citydata[index].cityname.toLowerCase();
        if (citydata[index].cityname === this.currentAdddres.city) {
          // console.log(citydata[index].cityname);
          this.registerData.cityid = citydata[index].cityid;
        }
      }
    }
  }

  // phonenumberPatterChanged() {

  //   if(this.registerData.phonecode == '+91'){
  //     // india
  //      this.phonenumberpattern = '^([0-9]{10})$';
  //      this.phonenumberlimit = 10;
  //   } else if(this.registerData.phonecode == '+1'){
  //     // USA
  //     this.phonenumberpattern = '^(0|[1-9][0-9]*)$';
  //     this.phonenumberlimit = null;
  //   }
  // }

  async changeMask(value) {
    console.log(value);
    this.phonemask = await this.postService.checkDialCode(value);
    console.log(this.phonemask);
  }

  SearchLocation() {

    this.service.searchLocations(this.locations).subscribe(res => {
      console.log(this.locations);
      if (res && res != null) {
        this.locaionresult = res['entity'];
        this.locaionresult = this.locaionresult.map((res) => {
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
      }

    }, err => {
      console.log(err);
    });

  }

  addPreferredLocation(addr) {
    console.log(addr);
    this.locations = '';
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
    console.log(this.selectedlocation, 'addr', addr);
  }

  // Image Upload From Social Login ---

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
    const canvas = document.createElement('canvas');
    canvas.width = img.width;
    canvas.height = img.height;
    const ctx = canvas.getContext('2d');
    // This will draw image
    ctx.drawImage(img, 0, 0);
    // Convert the drawn image to Data URL
    const dataURL = canvas.toDataURL('image/png');
    return dataURL.replace(/^data:image\/(png|jpg);base64,/, '');
  }


  getSocialLoginImage(imageUrl) {
    this.getBase64ImageFromURL(imageUrl).subscribe(base64data => {
      // this is the image as dataUrl
      this.base64Image = 'data:image/jpg;base64,' + base64data;
      // Naming the image
      const date = new Date().valueOf();
      let text = '';

      const possibleText = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
      for (let i = 0; i < 5; i++) {
        text += possibleText.charAt(Math.floor(Math.random() * possibleText.length));
      }

      var byteString = atob(this.base64Image.split(',')[1]);

      // separate out the mime component
      var mimeString = this.base64Image.split(',')[0].split(':')[1].split(';')[0];

      // write the bytes of the string to an ArrayBuffer
      var ab = new ArrayBuffer(byteString.length);

      // create a view into the buffer
      var ia = new Uint8Array(ab);

      // set the bytes of the buffer to the correct values
      for (var i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
      }

      // write the ArrayBuffer to a blob, and you're done
      var blob = new Blob([ab], { type: mimeString });

      // Replace extension according to your media type
      const imageName = date + '.' + text + '.jpeg';

      const imageFile = new File([blob], imageName, { type: 'image/jpeg' });

      console.log('file');
      console.log(imageFile);
      this.uploadImageInServer(imageFile);

    });


  }


  dataURItoBlob(dataURI) {
    // const byteString = window.atob(dataURI);
    // const arrayBuffer = new ArrayBuffer(byteString.length);
    // const int8Array = new Uint8Array(arrayBuffer);
    // for (let i = 0; i < byteString.length; i++) {
    //   int8Array[i] = byteString.charCodeAt(i);
    // }
    // const blob = new Blob([int8Array], { type: 'image/jpeg' });

    // convert base64 to raw binary data held in a string
    // doesn't handle URLEncoded DataURIs - see SO answer #6850276 for code that does this
    var byteString = atob(dataURI.split(',')[1]);

    // separate out the mime component
    var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];

    // write the bytes of the string to an ArrayBuffer
    var ab = new ArrayBuffer(byteString.length);

    // create a view into the buffer
    var ia = new Uint8Array(ab);

    // set the bytes of the buffer to the correct values
    for (var i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }

    // write the ArrayBuffer to a blob, and you're done
    var blob = new Blob([ab], { type: mimeString });
    return blob;


  }



  // --- Image Upload From Social Login


  // Registration --
  profileRegistration(data) {
    console.log('generalid', this.generalId);
    console.log(this.selectedIndus.length, this.selectedlocation.length);

    console.log(data);
    // (this.emailExist == false) &&
    if ((this.phoneNumberExist === false) &&
      (this.selectedIndus.length > 0) && (this.selectedlocation.length > 0)) {

      // prefered location list
      for (let index = 0; index < this.selectedlocation.length; index++) {
        this.preferredlocation.push({
          city: {
            cityid: this.selectedlocation[index].cityid
          },
          state:
          {
            stateid: this.selectedlocation[index].stateid
          },
          country:
          {
            countryid: this.selectedlocation[index].countryid
          },
          continent:
          {
            continentid: this.selectedlocation[index].continentid
          }
        });
        console.log(this.preferredlocation);
      }

      // user industry
      for (let ind = 0; ind < this.selectedIndus.length; ind++) {
        // this.userIndustry.push({
        //   industryid: this.selectedIndus[ind].industryid
        // });
        this.userIndustry.push({
          industry: {
            industryid: this.selectedIndus[ind].data.industryid
          }
        });

        console.log(this.userIndustry);
      }

      // providing verification link for web application
      this.registerData.usertype = 1;

      this.registerData.preferredlocation = this.preferredlocation;
      this.registerData.userIndustry = this.userIndustry;


      // alert('success');

      console.log(this.registerData);

      if (this.generalId === '' || this.generalId === undefined) {
        console.log('if not id');
        this.registerData.phonenumber = this.finalNumber;
        this.service.registringUser(this.registerData).subscribe(res => {
          if (res && res['status']['status'] === 200) {
            this.isModalShown = true;
          }
          if (res && res['status']['status'] === 299) {
            this.isModalShown = false;
            console.log(res);
            localStorage.setItem('currentusertoken', res['entity']['login']['access_token']);
            localStorage.setItem('UserId', res['entity']['userid']);
            this.router.navigate(['/user-home']);
          }
        }, err => {
          console.log(err);
        });
      }
      if (this.generalId === 'true') {
        console.log('if id', this.registerData);
        if (this.finalNumber === null || this.finalNumber === '' || this.finalNumber === undefined) {
          console.log(this.registerData.phonenumber, this.currentnumber);
          this.registerData.phonenumber = this.currentnumber;
        } else {
          this.registerData.phonenumber = this.finalNumber;

        }
        console.log(this.registerData, '%%%');
        this.service.editProfile(this.registerData).subscribe(res => {
          console.log(res);
          if (res && res['status'] && res['status']['status'] === 200) {
            this.toastr.success(res['status']['msg']);
            this.router.navigate(['/user-home']);
          }
        }, err => {
          console.log(err);
        });
      }
    } else {
      this.toastr.error('Please fill required fields');
    }
    // user industry
  }

  // -- Registration
  redirect() {
    this.router.navigate(['/home']);
  }

  async getprofiledetail() {
    this.loading = true;
    var userid = localStorage.getItem('UserId');
    this.registerData.userid = userid;
    await this.service.userDetails(userid)
      .subscribe(async (res) => {
        console.log(res['entity']['userprofile']);
        if (res && res['status'] && res['status']['status'] === 200) {
          if (res['entity'] !== null) {
            this.profiledetail = res['entity'];
            if (this.registerData.phonecode = res['entity']['userprofile']['phonecode'] !== null) {
              this.registerData.phonecode = res['entity']['userprofile']['phonecode'];
            }
            await this.changeMask(this.registerData.phonecode);
            console.log(this.phonemask, 'Mask');
            this.registerData.phonenumber = res['entity']['userprofile']['phonenumber'];

            this.currentnumber = res['entity']['userprofile']['phonenumber'];
            console.log(typeof this.registerData.phonenumber, 'type');
            console.log(this.registerData.phonenumber, 'phonenumber');
            console.log(this.currentnumber, 'Mask');



            // image upload

            if (res['entity']['userprofile']['profileimage']) {
              this.croppedImage = environment.cloudFrontURL + res['entity']['userprofile']['profileimage'];
              this.registerData.profileimage = res['entity']['userprofile']['profileimage'];
            } else {
              this.croppedImage = './assets/images/mobile-logo.png';
            }

            this.registerData.firstname = res['entity']['userprofile']['firstname'];
            this.registerData.lastname = res['entity']['userprofile']['lastname'];
            this.registerData.email = res['entity']['email'];
            this.inputemailDisabled = true;
            if (res['entity']['langid'] !== null) {
              this.registerData.language = res['entity']['langid']['id'];
            }
            console.log('this.registerData.language ', this.registerData.language);

            // acctype
            this.selectedAccTyp = res['entity']['accounttype'];
            this.registerData.acctype = res['entity']['accounttype']['accounttypeid'];
            this.acctypradio = res['entity']['accounttype']['accounttypeid'];
            this.accountName = res['entity']['accounttype']['accounttypeshortname'];

            // business info
            this.registerData.companyname = res['entity']['userprofile']['companyname'];
            this.registerData.companyein = res['entity']['userprofile']['companyEIN'];
            console.log(this.registerData.companyein, 'EIN');

            this.registerData.addressline1 = res['entity']['userprofile']['address']['addressline1'];
            if (res['entity']['userprofile']['address']['country'] !== null) {
              this.registerData.countryid = res['entity']['userprofile']['address']['country']['countryid'];
            }
            if (this.registerData.countryid) {
              this.getState();
            }
            if (res['entity']['userprofile']['address']['state'] !== null) {
              this.registerData.stateid = res['entity']['userprofile']['address']['state']['stateid'];
            }
            if (this.registerData.stateid) {
              this.getCity();
            }
            if (res['entity']['userprofile']['address']['city'] !== null) {
              this.registerData.cityid = res['entity']['userprofile']['address']['city']['cityid'];
            }
            if (res['entity']['userprofile']['address']['zipcode'] !== null) {
              this.registerData.zipcode = res['entity']['userprofile']['address']['zipcode'];
            }
            if (res['entity']['userprofile']['companywebsite'] !== null) {
              this.registerData.companywebsite = res['entity']['userprofile']['companywebsite'];
            }

            // location
            // this.location = [];
            this.searchfield = '';
            await this.profiledetail['userprofile']['userLocation'].forEach((element, index) => {
              if (element['city'] === null && element['state'] === null && element['country'] === null && element['continent'] !== null) {
                this.searchfield = 'Continent';
              }
              if (element['city'] === null && element['state'] === null && element['country'] !== null && element['continent'] !== null) {
                this.searchfield = 'Country';
              }
              if (element['city'] === null && element['state'] !== null && element['country'] !== null && element['continent'] !== null) {
                this.searchfield = 'State';
              }
              if (element['city'] !== null && element['state'] !== null && element['country'] !== null && element['continent'] !== null) {
                this.searchfield = 'City';
              }
              this.selectedlocation.push({
                searchedby: this.searchfield,
                cityid: element['city'] !== null ?
                  element['city']['cityid'] : 0,
                cityname: element['city'] !== null ?
                  element['city']['cityname'] : null,
                stateid: element['state'] !== null ?
                  element['state']['stateid'] : 0,
                statename: element['state'] !== null ?
                  element['state']['statename'] : null,
                countryid: element['country'] !== null ?
                  element['country']['countryid'] : 0,
                countryname: element['country'] !== null ?
                  element['country']['countryname'] : null,
                continentid: element['continent'] !== null ?
                  element['continent']['continentid'] : 0,
                continentname: element['continent'] !== null ?
                  element['continent']['continentname'] : null,
              });
            });

            // industry
            const industryId = this.profiledetail['userprofile']['userIndustry'].reduce((response, ele) => {
              response.push(ele.industry.industryid);
              return response;
            }, []);


            await this.allindustryData.map(element => {
              if (industryId.includes(element.industryid)) {
                element.flag = true;
              }
              return element;
            });
            await this.allindustryData.forEach((element, k) => {
              if (element.flag) {
                this.selectedIndus.push({
                  position: k,
                  status: true,
                  data: element,
                });
              }
            });
            this.loading = false;
            window.scrollTo(0, 0);

          }

          console.log(this.registerData, '6666');
        }
      });
    console.log(this.registerData, '77');
  }

  onChange(phone) {
    this.registerData.phonenumber = phone;
    this.populate = 'false';
    if (phone === this.currentnumber && this.generalId === 'true') {
    } else {
      this.service.checkPhone(phone).subscribe(res => {
        if (res['status'] === 229) {
          this.phoneNumberExist = false;
        }
      }, err => {
        if (err['error'].status === 302) {
          this.phoneNumberExist = true;
        }
      }
      );
    }
  }

  // Select Option for your  need
  selectOptionForYourNeed(selectOptiontemplate) {

    this.selectOptiontemplateStatus = false;
    this.businessModelTemplateStatus = false;
    this.startNewBusinessModelStatus = false;
    this.accountTypeBasedOnNeedStatus = false;
    this.ExpendingYourBusinessStatus = false;
    this.BasedOnYourAnswerStatus = false;
    this.BasedOnYourAnswerInvestorStatus = false;
    this.BasedOnYourAnswerCompaniesStatus = false;
    this.BasedOnYourAnswerFranchiseStatus = false;
    this.BasedOnYourAnswerFranchiseesStatus = false;
    this.BasedOnYourAnswerDistributorsStatus = false;

    this.selectOptiontemplateStatus = true;

    this.modalRef = this.modalService.show(
      selectOptiontemplate,
      Object.assign(this.modalconfig, { class: 'modal-lg' })
    );
  }

  businessModel(businessModelTemplate) {
    this.modalRef = this.modalService.show(
      businessModelTemplate,
      Object.assign(this.modalconfig, { class: 'modal-lg' })
    );
  }

  // Open text model
  openNextModel(modelName, acctype) {
    if (acctype !== undefined && acctype !== null && acctype !== '') {
      this.accountName = acctype;
    }
    this.selectOptiontemplateStatus = false;
    this.businessModelTemplateStatus = false;
    this.startNewBusinessModelStatus = false;
    this.accountTypeBasedOnNeedStatus = false;
    this.ExpendingYourBusinessStatus = false;
    this.BasedOnYourAnswerStatus = false;
    this.BasedOnYourAnswerInvestorStatus = false;
    this.BasedOnYourAnswerCompaniesStatus = false;
    this.BasedOnYourAnswerFranchiseStatus = false;
    this.BasedOnYourAnswerFranchiseesStatus = false;
    this.BasedOnYourAnswerDistributorsStatus = false;

    if (modelName === 'selectOptiontemplateStatus') {
      this.selectOptiontemplateStatus = true;
    } else if (modelName === 'businessModelTemplateStatus') {
      this.businessModelTemplateStatus = true;
    } else if (modelName === 'startNewBusinessModelStatus') {
      this.startNewBusinessModelStatus = true;
    } else if (modelName === 'accountTypeBasedOnNeedStatus') {
      this.accountTypeBasedOnNeedStatus = true;
    } else if (modelName === 'ExpendingYourBusinessStatus') {
      this.ExpendingYourBusinessStatus = true;
    } else if (modelName === 'BasedOnYourAnswerStatus') {
      this.BasedOnYourAnswerStatus = true;
    } else if (modelName === 'BasedOnYourAnswerInvestorStatus') {
      this.BasedOnYourAnswerInvestorStatus = true;
    } else if (modelName === 'BasedOnYourAnswerCompaniesStatus') {
      this.BasedOnYourAnswerCompaniesStatus = true;
    } else if (modelName === 'BasedOnYourAnswerFranchiseStatus') {
      this.BasedOnYourAnswerFranchiseStatus = true;
    } else if (modelName === 'BasedOnYourAnswerFranchiseesStatus') {
      this.BasedOnYourAnswerFranchiseesStatus = true;
    } else if (modelName === 'BasedOnYourAnswerDistributorsStatus') {
      this.BasedOnYourAnswerDistributorsStatus = true;
    }
  }

  saveId(accid: any, accname: any) {
    console.log('before ', this.accountName);
    console.log(accid, accname);
    if (accid === 3 || accid === 4) {
      this.accountName = '';
    }
    console.log('after ', this.accountName);

    this.registerData.acctype =  accid;
    this.acctypradio = accid;
    this.selectedAccTyp = {
      'accounttypeid': accid,
      'accounttypename': accname,
      'accounttypeshortname': accname
    };
    this.modalRef.hide();
  }
}
