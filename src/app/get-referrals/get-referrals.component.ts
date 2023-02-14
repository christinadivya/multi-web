import { Component, OnInit, TemplateRef, ViewChild, ElementRef } from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { Router } from '@angular/router';
import { FormControl } from '@angular/forms';
import { RegisterService } from '../service/register.service';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { RefferalService } from '../service/refferal.service';
import { PostService } from '../service/post.service';
import { ToastrService } from 'ngx-toastr';
import * as _ from 'lodash';
import { ThrowStmt } from '@angular/compiler';
import * as AWS from 'aws-sdk/global';
import { environment } from 'src/environments/environment';
import { S3UploadService } from '../service/s3.service';
import * as S3 from 'aws-sdk/clients/s3';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { LanguageService } from '../service/language.service';
@Component({
  selector: 'app-get-referrals',
  templateUrl: './get-referrals.component.html',
  styleUrls: ['./get-referrals.component.scss']
})
export class GetReferralsComponent implements OnInit {
  textareacount = `Dear

  Have you heard about <Sender Company Name> ?

  <Sender Company Name / Sender Profile Name is located in Company Location since <Company founded>.

  <Business Summary>

  Click here to learn more about <Company name> // link to post

  Sincerely,
  Team BusinessIn
  `;
  customMessage = '';
  htmlContent = '';
  maxlength = 0;
  timestamp;
  hideLocation = false;
  editorConfig: AngularEditorConfig = {
    editable: true,
    spellcheck: true,
    height: 'auto',
    minHeight: '10',
    maxHeight: 'auto',
    width: 'auto',
    minWidth: '0',
    translate: 'yes',
    enableToolbar: true,
    showToolbar: true,
    placeholder: 'Enter text here...',
    defaultParagraphSeparator: '',
    defaultFontName: '',
    defaultFontSize: '',
    fonts: [
      { class: 'arial', name: 'Arial' },
      { class: 'times-new-roman', name: 'Times New Roman' },
      { class: 'calibri', name: 'Calibri' },
      { class: 'comic-sans-ms', name: 'Comic Sans MS' }
    ],
    customClasses: [
      {
        name: 'quote',
        class: 'quote',
      },
      {
        name: 'redText',
        class: 'redText'
      },
      {
        name: 'titleText',
        class: 'titleText',
        tag: 'h1',
      },
    ],
    uploadUrl: 'v1/image',
    sanitize: true,
    toolbarPosition: 'top',
  };
  public tools: object = {
    items: [
      'Bold', 'Italic', 'Underline', 'StrikeThrough', '|',
      'FontName', 'FontSize', 'FontColor', 'BackgroundColor', '|',
      'LowerCase', 'UpperCase', '|', 'Undo', 'Redo', '|',
      'Formats', 'Alignments', '|', 'OrderedList', 'UnorderedList', '|',
      'Indent', 'Outdent', '|', 'CreateLink', 'CreateTable',
      'Image', '|', 'ClearFormat', 'Print', 'SourceCode', '|', 'FullScreen']
  };

  selectchange = false;
  addrObj = { 'City': 'cityid', 'State': 'stateid', 'Country': 'countryid', 'Continent': 'continentid' };
  referralData: any = {
    postid: null
  };
  messagelength = false;
  referralType = '';
  referralflag = false;
  selectedFiles: FileList;
  filestype: any;
  selectedIndus: any = [];
  referrerprofile: FormControl;
  selectedlocation: any = [];
  locaionresult: any = { entity: null };
  locations: any;
  langData: any = { common: '', viewPostPage: '', getReferralPage: '' };
  allindustryData: any = [];
  pickedIndstryName: any = [];
  createreferralForm: FormGroup;
  submitted = false;
  userId;
  myFiles = [];
  postObj: any;
  mypost: Object;
  isPost = true;
  sendPost: any;
  public loading = false;
  postview: any;
  industry = [];
  imageCount = 0;
  fileCount = 0;
  sendReferralData: any;
  addedlocation = false;
  messages = '';
  companyname = '';
  companyNameNew = '';
  companylocation = '';
  businesssummary = '';
  documentList: FormArray;
  docuerror = false;
  remainingPercentage: any;
  sizeRestriction = '';
  extendsionRestriction = '';
  extendsionRestrictionMessage = '';
  filesuploaded: any;
  locationpresent = false;
  nopostobj = {};
  i = 0;
  postid = '';
  value = '';
  valueflag = false;
  fileuploadDiabled = false;
  username = '';
  selectedpost = {};
  postmessage = '';
  welcomeMessage;
  @ViewChild('fileInput') myFileInput: ElementRef;
  companyFounded: any;
  userdetail: any;
  profilename = '';
  planBased = false;
  greetingMessage1: any = '';
  greetingMessage2: any = '';

  constructor(private service: RegisterService, private formBuilder: FormBuilder,
    private refferalService: RefferalService, private router: Router,
    private postservices: PostService, private toastr: ToastrService, private s3upload: S3UploadService,
    private language: LanguageService) { }

  ngOnInit() {
    this.planBased = (localStorage.getItem('userPlanType') === 'Silver' ||
    localStorage.getItem('userPlanType') === 'Limited Platinum') ? true : false;
    this.loading = true;
    this.userId = localStorage.getItem('UserId');
    this.getUserDetail();
    this.getIndustry();
    this.createForm();
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

  getUserDetail() {
    this.postservices.getViewData(localStorage.getItem('UserId')).subscribe( res => {
      console.log(res);
      if (res && res['status'] && res['status']['status'] === 200) {
        this.userdetail = res['entity']['userprofile'];
        if (this.userdetail['firstname'] !== null && this.userdetail['lastname'] !== null) {
          this.profilename = this.userdetail['firstname'] + ' ' + this.userdetail['lastname'];
        }
        if (this.userdetail['firstname'] !== null && this.userdetail['lastname'] === null) {
          this.profilename = this.userdetail['firstname'];
        }
        if (this.userdetail['firstname'] === null && this.userdetail['lastname'] !== null) {
          this.profilename = this.userdetail['lastname'];
        }
      }
    });
  }

  postmessagechange() {
    this.maxlength = this.postmessage.length;
  }

  async getpost(postid) {
    let yearfounded;
    let address1 = '',
      address2 = '',
      address3 = '';
    if (localStorage.getItem('userPlanType') === 'Silver' || localStorage.getItem('userPlanType') === 'Limited Platinum') {
      this.hideLocation = true;
    } else {
      this.hideLocation = false;
    }
    if (this.selectedIndus.length > 0) {
      await this.allindustryData.map(async (ele, index) => {
        await this.selectedIndus.map((ind, i) => {
          if (ind['data']['industryname'] === ele['industryname']) {
            this.allindustryData[index].flag = false;
            this.selectedIndus.splice(i, 1);
          }
        });
      });
    }
    console.log(this.selectedIndus);
    this.sendPost = this.postObj.map((obj) => {
      if (obj['postid'] === postid) {
        return obj;
      }
    });
    console.log(this.sendPost);
    for (let r = 0; r < this.sendPost.length; r++) {
      if (this.sendPost[r] === undefined) {
        console.log('undefined');
      } else {
        this.selectedpost = this.sendPost[r];
      }
    }

    this.selectchange = true;
    this.postservices.viewPost(postid, this.userId)
      .subscribe(async res => {
        if (res && res['status'] && res['status']['status'] === 200) {
          this.postview = res['entity'];
          this.referralflag = true;
          console.log(res['entity']);

          if (this.postview['companyname'] !== '') {
            this.companyname = this.postview['companyname'] + '?';
            this.companyNameNew = this.postview['companyname'];
          } else {
            this.companyname = this.profilename + '?';
            this.companyNameNew = 'The post of ' + this.profilename;
          }

          this.companyFounded = this.postview['companyfounded'];
          if (this.postview['city'] !== null) {
            address1 = (this.postview['city']['cityname'] !== null ||
              this.postview['city']['cityname'] !== '') ?
              (this.postview['city']['cityname'] + ',') : '';

            address2 = (this.postview['city']['state'] !== null ||
              this.postview['city']['state'] !== '') ?
              (this.postview['city']['state'] + ',') : '';

            address3 = (this.postview['city']['countryname'] !== null ||
              this.postview['city']['state'] !== '') ?
              (this.postview['city']['countryname']) : '';
            this.companylocation = address1 + address2 + address3;
            this.companylocation = Array.from(new Set(this.companylocation.split(','))).toString();
            console.log(this.companylocation);
          }
          this.businesssummary = this.postview['postsummary'];
          if (this.companylocation !== '') {
            if (this.companyFounded) {
              yearfounded = ` since ${this.companyFounded}`;
            } else {
              yearfounded = '';
            }

            this.greetingMessage1 = 'Sincerely,';
            this.greetingMessage2 = 'Team BusinessIn';
            this.welcomeMessage = 'Dear BusinessIn User';
            this.postmessage =
              `${this.welcomeMessage},\nHave you heard about ` + this.companyname + '\n'
              + this.companyNameNew + ` is located in ` + this.companylocation + yearfounded + '\n'
              + this.businesssummary;
          } else {
            this.welcomeMessage = 'Dear BusinessIn User';
            this.postmessage =
              `${this.welcomeMessage},\nHave you heard about ` + this.companyname + '\n'
              + this.businesssummary;
          }
          this.valueflag = false;
          console.log(this.postmessage.length);
          this.maxlength = this.postmessage.length;
          if (this.maxlength > 500) {
            var length = 500;
            var myTruncatedString = this.postmessage.substring(0, length);
            this.postmessage = myTruncatedString;
            this.maxlength = this.postmessage.length;
          }
          this.selectedlocation = this.postview.postlocation;
          if (this.selectedlocation !== []) {
            this.selectedlocation = this.selectedlocation.map((resi) => {
              resi.locationFinal = '';
              if (resi['city'] === null && resi['state'] === null && resi['country'] === null && resi['continent'] !== null) {
                resi.continentname = resi['continent']['continentname'];
                resi.searchedby = 'Continent';
              }
              if (resi['city'] === null && resi['state'] === null && resi['country'] !== null && resi['continent'] !== null) {
                resi.countryname = resi['country']['countryname'];
                resi.searchedby = 'Country';
              }
              if (resi['city'] === null && resi['state'] === null && resi['country'] !== null && resi['continent'] === null) {
                resi.countryname = resi['country']['countryname'];
                resi.searchedby = 'Country';
              }
              // tslint:disable-next-line:max-line-length
              if (resi['city'] === null && resi['state'] !== null && resi['country'] !== null && resi['continent'] !== null) {
                resi.statename = resi['state']['statename'];
                resi.searchedby = 'State';
              }
              if (resi['city'] === null && resi['state'] !== null && resi['country'] === null && resi['continent'] === null) {
                resi.statename = resi['state']['statename'];
                resi.searchedby = 'State';
              }
              // tslint:disable-next-line:max-line-length
              if (resi['city'] !== null && resi['state'] !== null && resi['country'] !== null && resi['continent'] !== null) {
                resi.cityname = resi['city']['cityname'];
                resi.searchedby = 'City';
              }
              if (resi['city'] !== null && resi['state'] === null && resi['country'] === null && resi['continent'] === null) {
                resi.cityname = resi['city']['cityname'];
                resi.searchedby = 'City';
              }
              return resi;
            });
          }
          if (this.postview.postindustry.length > 0) {
            await this.postview.postindustry.map((selectedIndustry) => {
              this.industry.push(selectedIndustry.industryname);
            });
          }
          if (this.industry.length > 0) {
            await this.allindustryData.map((ind, i) => {
              if (this.industry.includes(ind['industryname'])) {
                this.allindustryData[i].flag = true;
                this.selectedIndus.push({
                  position: i,
                  status: true,
                  data: this.allindustryData[i],
                });
              }
            });
          }

          let arrayOfObjAfter = _.map(
            _.uniq(
              _.map(this.selectedIndus, function (obj) {
                return JSON.stringify(obj);
              })
            ), function (obj) {
              return JSON.parse(obj);
            }
          );

          this.selectedIndus = arrayOfObjAfter;
        }
      });
  }

  async nopostuser() {
    let address1,
      address2,
      address3;
    console.log(this.postObj);
    this.nopostobj = this.postObj['userprofile'];
    this.companyname = this.nopostobj['companyname'];
    this.username = this.nopostobj['firstname'] + this.nopostobj['lastname'];
    // this.businesssummary = this.nopostobj['postsummary'];
    if (this.nopostobj['address']['city']
      !== null) {
      address1 = (this.nopostobj['address']['city']['cityname'] !== null ||
        this.nopostobj['address']['city']['cityname'] !== '') ?
        (this.nopostobj['address']['city']['cityname'] + ',') : '';

      address2 = (this.nopostobj['address']['city']['state'] !== null ||
        this.nopostobj['address']['city']['state'] !== '') ?
        (this.nopostobj['address']['city']['state'] + ',') : '';

      address3 = (this.nopostobj['address']['city']['countryname'] !== null ||
        this.nopostobj['address']['city']['state'] !== '') ?
        (this.nopostobj['address']['city']['countryname']) : '';
      this.companylocation = address1 + address2 + address3;
      this.companylocation = Array.from(new Set(this.companylocation.split(','))).toString();
      console.log(this.companylocation);
    }
    this.welcomeMessage = `Dear BusinessIn User, `;
    this.postmessage =
      this.welcomeMessage + '\n' + this.username + ` would like to share their profile on BusinessIn with  you`;
    console.log(this.postmessage.length);
    this.maxlength = this.postmessage.length;
    this.valueflag = false;
    // if (this.maxlength > 500) {
    //   this.messagelength = true;
    //   return;
    // }
    this.selectedlocation = this.nopostobj['userLocation'];
    if (this.selectedlocation !== []) {
      this.selectedlocation = this.selectedlocation.map((resi) => {
        resi.locationFinal = '';
        if (resi['city'] === null && resi['state'] === null && resi['country'] === null && resi['continent'] !== null) {
          resi.continentname = resi['continent']['continentname'];
          resi.searchedby = 'Continent';
        }
        if (resi['city'] === null && resi['state'] === null && resi['country'] !== null && resi['continent'] !== null) {
          resi.countryname = resi['country']['countryname'];
          resi.searchedby = 'Country';
        }
        if (resi['city'] === null && resi['state'] === null && resi['country'] !== null && resi['continent'] === null) {
          resi.countryname = resi['country']['countryname'];
          resi.searchedby = 'Country';
        }
        // tslint:disable-next-line:max-line-length
        if (resi['city'] === null && resi['state'] !== null && resi['country'] !== null && resi['continent'] !== null) {
          resi.statename = resi['state']['statename'];
          resi.searchedby = 'State';
        }
        if (resi['city'] === null && resi['state'] !== null && resi['country'] === null && resi['continent'] === null) {
          resi.statename = resi['state']['statename'];
          resi.searchedby = 'State';
        }
        // tslint:disable-next-line:max-line-length
        if (resi['city'] !== null && resi['state'] !== null && resi['country'] !== null && resi['continent'] !== null) {
          resi.cityname = resi['city']['cityname'];
          resi.searchedby = 'City';
        }
        if (resi['city'] !== null && resi['state'] === null && resi['country'] === null && resi['continent'] === null) {
          resi.cityname = resi['city']['cityname'];
          resi.searchedby = 'City';
        }
        return resi;
      });
    }

    if (localStorage.getItem('userPlanType') === 'Silver' || localStorage.getItem('userPlanType') === 'Limited Platinum') {
      this.hideLocation = true;
    } else {
      this.hideLocation = false;
    }
    if (this.nopostobj['userIndustry'].length > 0) {
      this.nopostobj['userIndustry'].map((selectedIndustry) => {
        this.industry.push(selectedIndustry['industry']['industryname']);
      });
    }
    if (this.industry.length > 0) {
      await this.allindustryData.map((ind, i) => {
        console.log(this.industry.includes(ind['industryname']));
        if (this.industry.includes(ind['industryname'])) {
          this.allindustryData[i].flag = true;
          this.selectedIndus.push({
            position: i,
            status: true,
            data: this.allindustryData[i],
          });
        }
      });
    }

    let arrayOfObjAfter = await _.map(
      _.uniq(
        _.map(this.selectedIndus, function (obj) {
          return JSON.stringify(obj);
        })
      ), function (obj) {
        return JSON.parse(obj);
      }
    );

    this.selectedIndus = arrayOfObjAfter;

    this.loading = false;
    window.scrollTo(0, 0);

  }

  removeLocation(index) {
    this.toastr.clear();
    console.log(this.selectedlocation.length, localStorage.getItem('userPlanType'));

    if (this.selectedlocation.length > 0 &&
      (localStorage.getItem('userPlanType') === 'Silver' || localStorage.getItem('userPlanType') === 'Limited Platinum')) {
      console.log('if', this.selectedlocation.length, localStorage.getItem('userPlanType'));
      this.toastr.error('Please upgrade your plan to enable this feature');
    } else {
      console.log(this.selectedlocation);
      this.selectedlocation.splice(index, 1);
      console.log(this.selectedlocation);
      // this.getSearchResult();
    }
  }

  removeDocument(id) {
    // this.documentList.removeAt(id);
    this.createreferralForm.controls['documentList']['controls'].splice(id, 1);
    this.filesuploaded = this.createreferralForm.controls['documentList']['length'];

    console.log(this.createreferralForm.controls['documentList']);
    console.log(id);

    if (this.createreferralForm.controls['documentList']['controls'].length > 6) {
      this.fileuploadDiabled = true;
    } else {
      this.fileuploadDiabled = false;
    }
  }

  async getFileDetails(e) {
    let attachFile = e.target.files;
    if (this.fileCount === 3 && attachFile[0]['type'].includes('application')) {
      this.toastr.error('Cannot attach more than 3 documents');
    } else if (this.imageCount === 3 && attachFile[0]['type'].includes('image')) {
      this.toastr.error('Cannot attach more than 3 images');
    } else {
      for (let i = 0; i < attachFile.length; i++) {
        if (attachFile[0]['type'].includes('image')) {
          this.imageCount = this.imageCount + 1;
        } else if (attachFile[0]['type'].includes('application')) {
          this.fileCount = this.fileCount + 1;
        }
        this.myFiles.push(e.target.files[i]);
      }
    }
  }

  reomvefile(data, i) {
    if (data.type.includes('application')) {
      (this.fileCount !== 0) ? this.fileCount = this.fileCount - 1 : this.fileCount = 0;
      let index = this.myFiles.indexOf(data);
      if (index > -1) {
        this.myFiles.splice(index, 1);
      }
    }
    if (data.type.includes('image')) {
      (this.imageCount !== 0) ? this.imageCount = this.imageCount - 1 : this.imageCount = 0;
      let index = this.myFiles.indexOf(data);
      if (index > -1) {
        this.myFiles.splice(index, 1);
      }
    }
  }

  createForm() {
    let message = '';
    this.createreferralForm = this.formBuilder.group({
      // Message: ['', Validators.required],
      postid: (this.isPost === true) ? ['', Validators.required] : [],
      targetedlocations: ['', Validators.required],
      documentList: this.formBuilder.array([]),
    });
    if (this.postObj && this.postObj.length === 1) {
      this.createreferralForm.get('postid').setValue(this.postObj[0]['postname']);
      this.getpost(this.postObj[0].postid);
    }
    // this.createreferralForm.get('Message').setValue(message);
  }

  textmessage() {
    console.log(this.textareacount);
  }
  reomveLocation(data, id) {
    console.log(data);
    console.log(this.selectedlocation);
    console.log(id);
    for (let j = 0; j < this.selectedlocation.length; j++) {
      if (this.selectedlocation[j].id === data.id) {
        console.log(this.selectedlocation[j].id);
        console.log(data.id);
        this.selectedlocation.splice(j, 1);
        console.log(this.selectedlocation);
        break;
      }
    }
    console.log(this.selectedlocation);
  }

  SearchLocation() {
    this.toastr.clear();

    if ((localStorage.getItem('userPlanType') === 'Silver' ||
      localStorage.getItem('userPlanType') === 'Limited Platinum') && this.loading === false) {
      this.toastr.error('Please upgrade your plan to enable this feature');
    } else {
      console.log(this.locations);
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
  }

  addPreferredLocation(addr) {
    console.log(addr);
    console.log(this.selectedlocation);
    this.locations = '';
    if (this.selectedlocation.length === 0) {
      this.selectedlocations(addr);
    } else {
      for (let i = 0; i < this.selectedlocation.length; i++) {
        this.addedlocation = false;
        if (addr.searchedby === this.selectedlocation[i].searchedby) {
          console.log(addr.searchedby);
          console.log(this.selectedlocation[i].searchedby);
          this.addedlocation = true;
          if (addr.searchedby === 'City') {
            if (this.selectedlocation[i].cityname === addr.cityname) {
              break;
            } else {
              if (this.selectedlocation.length === i + 1) {
                this.selectedlocations(addr);
              }
            }
            // break;
          }
          if (addr.searchedby === 'State') {
            if (this.selectedlocation[i].statename === addr.statename) {
              break;
            } else {
              if (this.selectedlocation.length === i + 1) {
                this.selectedlocations(addr);
              }
            }
            // break;
          }
          if (addr.searchedby === 'Continent') {
            if (this.selectedlocation[i].continentname === addr.continentname) {
              break;
            } else {
              if (this.selectedlocation.length === i + 1) {
                this.selectedlocations(addr);
              }
            }
            // break;
          }
          if (addr.searchedby === 'Country') {
            console.log(addr);
            console.log(this.selectedlocation[i].countryname);
            console.log(addr.countryname);
            if (this.selectedlocation[i].countryname === addr.countryname) {
              console.log(this.selectedlocation[i].countryname);
              console.log(addr.countryname);
              break;
            } else {
              console.log(this.selectedlocation.length);
              console.log(i);
              if (this.selectedlocation.length === i + 1) {
                this.selectedlocations(addr);
              }
            }
            // break;
          }
        }
      }
      if (this.addedlocation === false) {
        // alert(this.addedlocation)
        this.selectedlocations(addr);
      }
    }
  }

  selectedlocations(addr) {
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

  getIndustry() {
    this.service.getAllIndustry().subscribe(async (res) => {
      this.allindustryData = res['entity'];
      await this.allindustryData.map((ele) => {
        ele.flag = false;
      });
      this.getMyPost();
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
        }
      }
    }

    for (let ind = 0; ind < this.allindustryData.length; ind++) {
      if (this.selectedIndus[ind] && this.selectedIndus[ind] !== undefined) {
        this.pickedIndstryName[ind] = this.selectedIndus[ind];
      }
    }
    let arrayOfObjAfter = _.map(
      _.uniq(
        _.map(this.selectedIndus, function (obj) {
          return JSON.stringify(obj);
        })
      ), function (obj) {
        return JSON.parse(obj);
      }
    );
    this.selectedIndus = arrayOfObjAfter;
  }
  messagechange(value) {
    console.log(value);
    if (this.value === '') {
      this.valueflag = true;
    } else {
      this.valueflag = false;
    }
  }

  onSubmit() {
    console.log(this.postmessage);
    console.log(this.value);
    // this.router.navigate(['/send-referral']);
    this.submitted = true;
    console.log('Form Details', this.createreferralForm);
    console.log('Industry list', this.selectedIndus);
    console.log('selectedlocation', this.selectedlocation);
    if (this.selectedlocation.length > 0) {
      console.log(this.createreferralForm.get('targetedlocations'));
      this.createreferralForm.get('targetedlocations').setErrors(null);
    } else {
      this.createreferralForm.get('targetedlocations').setValidators([Validators.required]);
    }
    if (this.postmessage === '') {
      this.valueflag = true;
    } else {
      this.valueflag = false;
    }
    console.log('postid', this.createreferralForm.get('postid'));
    console.log('post details', this.sendPost);
    console.log('Referral Type', this.referralType);
    console.log('Files Details', this.myFiles);
    if (this.createreferralForm.invalid) {
      return;
    } else {
      if (this.selectedIndus.length === 0) {
        return;
      }
      if (this.valueflag) {
        return;
      } else {
        if (this.maxlength > 500) {
          this.messagelength = true;
          return;
        }
      }

      const documentsarray = this.createreferralForm.get('documentList')['controls'];
      if (this.referralType === 'post') {
        this.sendReferralData = {
          'referralType': this.referralType,
          'postId': this.selectedpost['postid'],
          'postName': this.selectedpost['postname'],
        };
        let userid = localStorage.getItem('UserId');
        this.sendReferralData.senderId = userid;
        if (this.selectedlocation !== []) {
          var locationarray = [];
          for (let i = 0; i < this.selectedlocation.length; i++) {
            let wholepusheditems = {};
            console.log(this.selectedlocation[i]);
            if ((this.selectedlocation[i].city && this.selectedlocation[i].city !== null) || this.selectedlocation[i].cityname !== null) {
              console.log('1');
              let pusheditems = {};
              var flag1 = false;
              if (this.selectedlocation[i].city && this.selectedlocation[i].city !== null) {
                console.log('2');
                flag1 = true;
                pusheditems['cityid'] = this.selectedlocation[i].city.cityid;
                wholepusheditems['cityid'] = pusheditems;
                console.log(wholepusheditems);
                // }
              } else {
                pusheditems['cityid'] = 0;
                wholepusheditems['cityid'] = pusheditems;
              }
              if (flag1 === false) {
                console.log('3');
                if (this.selectedlocation[i].cityname && this.selectedlocation[i].cityname !== null) {
                  console.log('4');
                  console.log(this.selectedlocation[i].cityname);
                  pusheditems['cityid'] = this.selectedlocation[i].cityid;
                  wholepusheditems['cityid'] = pusheditems;
                  console.log(wholepusheditems);
                } else {
                  pusheditems['cityid'] = 0;
                  wholepusheditems['cityid'] = pusheditems;
                }
              }
            }
            if ((this.selectedlocation[i].state && this.selectedlocation[i].state !== null) || this.selectedlocation[i].statename !== null) {
              let pusheditems = {};
              var flag2 = false;
              if (this.selectedlocation[i].state && this.selectedlocation[i].state != null) {
                flag2 = true;
                pusheditems['stateid'] = this.selectedlocation[i].state.stateid;
                wholepusheditems['stateid'] = pusheditems;
              } else {
                pusheditems['stateid'] = 0;
                wholepusheditems['stateid'] = pusheditems;
              }
              if (flag2 === false) {
                if (this.selectedlocation[i].statename && this.selectedlocation[i].statename !== null) {
                  pusheditems['stateid'] = this.selectedlocation[i].stateid;
                  wholepusheditems['stateid'] = pusheditems;
                } else {
                  pusheditems['stateid'] = 0;
                  wholepusheditems['stateid'] = pusheditems;
                }
              }

              console.log(wholepusheditems);

            }
            if ((this.selectedlocation[i].country && this.selectedlocation[i].country !== null) || this.selectedlocation[i].countryname !== null) {
              let pusheditems = {};
              var flag3 = false;
              if (this.selectedlocation[i].country && this.selectedlocation[i].country != null) {
                flag3 = true;
                pusheditems['countryid'] = this.selectedlocation[i].country.countryid;
                wholepusheditems['countryid'] = pusheditems;
              } else {
                pusheditems['countryid'] = 0;
                wholepusheditems['countryid'] = pusheditems;
              }
              if (flag3 === false) {
                if (this.selectedlocation[i].countryname && this.selectedlocation[i].countryname !== null) {
                  pusheditems['countryid'] = this.selectedlocation[i].countryid;
                  wholepusheditems['countryid'] = pusheditems;
                } else {
                  pusheditems['countryid'] = 0;
                  wholepusheditems['countryid'] = pusheditems;
                }
              }

              console.log(wholepusheditems);
            }
            if ((this.selectedlocation[i].continent && this.selectedlocation[i].continent !== null) || this.selectedlocation[i].continentname !== null) {
              let pusheditems = {};
              var flag4 = false;
              if (this.selectedlocation[i].continent && this.selectedlocation[i].continent != null) {
                flag4 = true;
                pusheditems['continentid'] = this.selectedlocation[i].continent.continentid;
                wholepusheditems['continentid'] = pusheditems;
              } else {
                pusheditems['continentid'] = 0;
                wholepusheditems['continentid'] = pusheditems;
              }
              if (flag4 === false) {
                if (this.selectedlocation[i].continentname && this.selectedlocation[i].continentname !== null) {
                  pusheditems['continentid'] = this.selectedlocation[i].continentid;
                  wholepusheditems['continentid'] = pusheditems;
                } else {
                  pusheditems['continentid'] = 0;
                  wholepusheditems['continentid'] = pusheditems;
                }
                console.log(wholepusheditems);
              }
            }
            console.log(wholepusheditems);
            if (wholepusheditems) {

              if (!wholepusheditems['cityid']) {
                let pusheditems = {};
                pusheditems['cityid'] = 0;
                wholepusheditems['cityid'] = pusheditems;
              }
              if (!wholepusheditems['stateid']) {
                let pusheditems = {};
                pusheditems['stateid'] = 0;
                wholepusheditems['stateid'] = pusheditems;
              }
              if (!wholepusheditems['countryid']) {
                let pusheditems = {};
                pusheditems['countryid'] = 0;
                wholepusheditems['countryid'] = pusheditems;
              }
              if (!wholepusheditems['continentid']) {
                let pusheditems = {};
                pusheditems['continentid'] = 0;
                wholepusheditems['continentid'] = pusheditems;
              }
            }
            locationarray.push(wholepusheditems);
            console.log(locationarray);
            this.sendReferralData['referralLocation'] = locationarray;
          }
        }
        if (this.selectedIndus !== null) {
          var industryrray = [];

          for (let j = 0; j < this.selectedIndus.length; j++) {
            let induspusheditems = {};
            induspusheditems['industryid'] = this.selectedIndus[j]['data']['industryid'];
            industryrray.push(induspusheditems);
          }
          this.sendReferralData['referralIndustry'] = industryrray;
        }
        let mymessage = this.postmessage.split('\n');
        mymessage.splice(0, 1);
        this.sendReferralData['message'] = mymessage.join('\n');
        this.sendReferralData['welcomemessage'] = this.postmessage.split('\n')[0];
        if (this.sendReferralData['message'] === '') {
          let mysplitmessage = this.postmessage.split('.');
          mysplitmessage.splice(0, 1);
          this.sendReferralData['message'] = mysplitmessage.join('.');
          this.sendReferralData['welcomemessage'] = this.postmessage.split('.')[0];
        }

        const documentsarray = this.createreferralForm.get('documentList')['controls'];
        if (documentsarray !== []) {
          console.log(documentsarray);

          let docobject = {

            filetype: null,
            url: null
          };

          let uploaddocarray = [];

          for (let index = 0; index < documentsarray.length; index++) {
            if (documentsarray[index]['value']['extension'] === '.png' ||
              documentsarray[index]['value']['extension'] === '.jpg' ||
              documentsarray[index]['value']['extension'] === '.jpeg') {
              docobject = {

                filetype: 'image',
                url: documentsarray[index].value.uploaddoc
              };

            } else {
              docobject = {

                filetype: 'doc',
                url: documentsarray[index].value.uploaddoc
              };

            }




            uploaddocarray.push(docobject);
          }
          this.sendReferralData['referralFiles'] = uploaddocarray;
        }


        console.log(this.sendReferralData);
        localStorage.setItem('sendreferraldata', JSON.stringify(this.sendReferralData));
        // this.submitted = true;
      } else {
        this.sendReferralData = {
          'referralType': this.referralType,
          'postId': '',
          'postName': '',
          'profileId': this.postObj['userprofile']['profileid']

        };

        let userid = localStorage.getItem('UserId');
        this.sendReferralData.senderId = userid;
        if (this.selectedlocation !== []) {

          var locationarray = [];


          for (let i = 0; i < this.selectedlocation.length; i++) {
            let wholepusheditems = {};
            console.log(this.selectedlocation[i]);
            if ((this.selectedlocation[i].city && this.selectedlocation[i].city !== null) || this.selectedlocation[i].cityname !== null) {
              console.log('1');
              let pusheditems = {};
              var flag1 = false;
              if (this.selectedlocation[i].city && this.selectedlocation[i].city !== null) {
                console.log('2');
                flag1 = true;
                pusheditems['cityid'] = this.selectedlocation[i].city.cityid;
                wholepusheditems['cityid'] = pusheditems;
                console.log(wholepusheditems);
                // }
              } else {
                pusheditems['cityid'] = 0;
                wholepusheditems['cityid'] = pusheditems;
              }
              if (flag1 === false) {
                console.log('3');
                if (this.selectedlocation[i].cityname && this.selectedlocation[i].cityname !== null) {
                  console.log('4');
                  console.log(this.selectedlocation[i].cityname);
                  pusheditems['cityid'] = this.selectedlocation[i].cityid;
                  wholepusheditems['cityid'] = pusheditems;
                  console.log(wholepusheditems);
                } else {
                  pusheditems['cityid'] = 0;
                  wholepusheditems['cityid'] = pusheditems;
                }
              }
            }
            if ((this.selectedlocation[i].state && this.selectedlocation[i].state !== null) || this.selectedlocation[i].statename !== null) {
              let pusheditems = {};
              var flag2 = false;
              if (this.selectedlocation[i].state && this.selectedlocation[i].state != null) {
                flag2 = true;
                pusheditems['stateid'] = this.selectedlocation[i].state.stateid;
                wholepusheditems['stateid'] = pusheditems;
              } else {
                pusheditems['stateid'] = 0;
                wholepusheditems['stateid'] = pusheditems;
              }
              if (flag2 === false) {
                if (this.selectedlocation[i].statename && this.selectedlocation[i].statename !== null) {
                  pusheditems['stateid'] = this.selectedlocation[i].stateid;
                  wholepusheditems['stateid'] = pusheditems;
                } else {
                  pusheditems['stateid'] = 0;
                  wholepusheditems['stateid'] = pusheditems;
                }
              }

              console.log(wholepusheditems);

            }
            if ((this.selectedlocation[i].country && this.selectedlocation[i].country !== null) || this.selectedlocation[i].countryname !== null) {
              let pusheditems = {};
              var flag3 = false;
              if (this.selectedlocation[i].country && this.selectedlocation[i].country != null) {
                flag3 = true;
                pusheditems['countryid'] = this.selectedlocation[i].country.countryid;
                wholepusheditems['countryid'] = pusheditems;
              } else {
                pusheditems['countryid'] = 0;
                wholepusheditems['countryid'] = pusheditems;
              }
              if (flag3 === false) {
                if (this.selectedlocation[i].countryname && this.selectedlocation[i].countryname !== null) {
                  pusheditems['countryid'] = this.selectedlocation[i].countryid;
                  wholepusheditems['countryid'] = pusheditems;
                } else {
                  pusheditems['countryid'] = 0;
                  wholepusheditems['countryid'] = pusheditems;
                }
              }

              console.log(wholepusheditems);
            }
            if ((this.selectedlocation[i].continent && this.selectedlocation[i].continent !== null) || this.selectedlocation[i].continentname !== null) {
              let pusheditems = {};
              var flag4 = false;
              if (this.selectedlocation[i].continent && this.selectedlocation[i].continent != null) {
                flag4 = true;
                pusheditems['continentid'] = this.selectedlocation[i].continent.continentid;
                wholepusheditems['continentid'] = pusheditems;
              } else {
                pusheditems['continentid'] = 0;
                wholepusheditems['continentid'] = pusheditems;
              }
              if (flag4 === false) {
                if (this.selectedlocation[i].continentname && this.selectedlocation[i].continentname !== null) {
                  pusheditems['continentid'] = this.selectedlocation[i].continentid;
                  wholepusheditems['continentid'] = pusheditems;
                } else {
                  pusheditems['continentid'] = 0;
                  wholepusheditems['continentid'] = pusheditems;
                }
                console.log(wholepusheditems);
              }
            }
            console.log(wholepusheditems);
            if (wholepusheditems) {

              if (!wholepusheditems['cityid']) {
                let pusheditems = {};
                pusheditems['cityid'] = 0;
                wholepusheditems['cityid'] = pusheditems;
              }
              if (!wholepusheditems['stateid']) {
                let pusheditems = {};
                pusheditems['stateid'] = 0;
                wholepusheditems['stateid'] = pusheditems;
              }
              if (!wholepusheditems['countryid']) {
                let pusheditems = {};
                pusheditems['countryid'] = 0;
                wholepusheditems['countryid'] = pusheditems;
              }
              if (!wholepusheditems['continentid']) {
                let pusheditems = {};
                pusheditems['continentid'] = 0;
                wholepusheditems['continentid'] = pusheditems;
              }
            }
            locationarray.push(wholepusheditems);
            console.log(locationarray);
            this.sendReferralData['referralLocation'] = locationarray;
          }
        }
        if (this.selectedIndus !== null) {
          var industryrray = [];

          for (let j = 0; j < this.selectedIndus.length; j++) {
            let induspusheditems = {};
            induspusheditems['industryid'] = this.selectedIndus[j]['data']['industryid'];
            industryrray.push(induspusheditems);
          }
          this.sendReferralData['referralIndustry'] = industryrray;
        }
        let mymessage = this.postmessage.split('\n');
        mymessage.splice(0, 1);
        this.sendReferralData['message'] = mymessage.join('\n');
        this.sendReferralData['welcomemessage'] = this.postmessage.split('\n')[0];

        if (this.sendReferralData['message'] === '') {
          let mysplitmessage = this.postmessage.split('.');
          mysplitmessage.splice(0, 1);
          this.sendReferralData['message'] = mysplitmessage.join('.');
          this.sendReferralData['welcomemessage'] = this.postmessage.split('.')[0];
        }
        const documentsarray = this.createreferralForm.get('documentList')['controls'];
        if (documentsarray !== []) {
          console.log(documentsarray);

          let docobject = {

            filetype: null,
            url: null
          };

          let uploaddocarray = [];

          for (let index = 0; index < documentsarray.length; index++) {
            if (documentsarray[index]['value']['extension'] === '.png' ||
              documentsarray[index]['value']['extension'] === '.jpg' ||
              documentsarray[index]['value']['extension'] === '.jpeg') {
              docobject = {

                filetype: 'image',
                url: documentsarray[index].value.uploaddoc
              };

            } else {
              docobject = {

                filetype: 'doc',
                url: documentsarray[index].value.uploaddoc
              };
            }
            uploaddocarray.push(docobject);
          }
          this.sendReferralData['referralFiles'] = uploaddocarray;
        }
        console.log(this.sendReferralData);
        localStorage.setItem('sendreferraldata', JSON.stringify(this.sendReferralData));
      }
      this.timestamp = new Date().getUTCMilliseconds();
      console.log(this.timestamp);
      localStorage.setItem('referalReferenceNo', this.timestamp);
      this.router.navigate(['/send-referral']);
    }
  }

  showError(showError) {
    this.toastr.clear();
    this.toastr.error(showError);
  }

  showSuccess(showSuccess) {
    this.toastr.clear();
    this.toastr.success(showSuccess);
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
  awsUploadFile(file, params, i, filetype) {
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

  progressBarValue(percentage, i, filetype) {
    console.log(i);
    this.remainingPercentage = percentage;

    if (filetype === 1) {
      this.documentList['controls'][i - 1]['controls']['percentage'].setValue(this.remainingPercentage);
      if (this.documentList['controls'][i - 1]['controls']['percentage']['value'] === 100) {
        console.log('next record will trigger');
        this.i += 1;
        this.fileChangeEvent(this.selectedFiles, this.filestype);
      }
    }

    // if (filetype == 2) {
    //   this.videoList['controls'][i - 1]['controls']['percentage'].setValue(this.remainingPercentage);
    //   if (this.videoList['controls'][i - 1]['controls']['percentage']['value'] == 100) {
    //     console.log('next record will trigger');
    //     this.i += 1;
    //     this.fileChangeEvent(this.selectedFiles, this.filestype);
    //   }
    // }
  }
  fileChangeEvent(files, filetype) {
    console.log(files);
    if (files.length <= 6) {

      this.filestype = filetype;
      this.selectedFiles = files;
      const file = this.selectedFiles;

      console.log(this.createreferralForm.controls['documentList']['controls'].length);

      // Document
      // alert(this.createreferralForm.controls['documentList']['controls'].length)
      if (filetype === 1 && this.createreferralForm.controls['documentList']['controls'].length >= 6) {
        if (files.length > 6) {
          this.showError('Only 3 Documents and 3 images are allowed');
          // alert('**')
          this.fileuploadDiabled = true;
        }
      }

      // if (filetype == 2 && (this.createreferralForm.controls['videoList']['controls'].length +
      //   this.createreferralForm.controls['videoUrlList']['controls'].length) >= 3) {
      //   this.showError('Only 3 videos allowed');
      //   this.videuploadDiabled = true;
      // }
      else {
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
          var validation1 = false;
          var validation2 = false;

          if (filetype === 1) {
            if (((checkValidFile.fileExtenstion.toLowerCase() === '.docx') || (checkValidFile.fileExtenstion.toLowerCase()) === '.doc' ||
              (checkValidFile.fileExtenstion.toLowerCase()) === '.rtf') || (checkValidFile.fileExtenstion.toLowerCase()) === '.pdf' ||
              (checkValidFile.fileExtenstion.toLowerCase()) === '.xls' || (checkValidFile.fileExtenstion.toLowerCase()) === '.xlsx' ||
              (checkValidFile.fileExtenstion.toLowerCase()) === '.png' || (checkValidFile.fileExtenstion.toLowerCase()) === '.jpg' ||
              (checkValidFile.fileExtenstion.toLowerCase()) === '.jpeg') {
              if (this.createreferralForm.controls['documentList']['controls'].length >= 3) {
                // alert('1')
                // check 3 images

                // console.log(this.createreferralForm.controls['documentList']['controls'])
                var imagesdone = 0;
                var documentsdone = 0;
                for (let h = 0; h < this.createreferralForm.controls['documentList']['controls'].length; h++) {

                  if (this.createreferralForm.controls['documentList']['controls'][h]['value']['extension'] === '.png' ||
                    this.createreferralForm.controls['documentList']['controls'][h]['value']['extension'] === '.jpg' ||
                    this.createreferralForm.controls['documentList']['controls'][h]['value']['extension'] === '.jpeg') {
                    console.log(imagesdone);
                    imagesdone += 1;
                    console.log(imagesdone);
                    validation = true;
                    // alert('2')

                    if (imagesdone === 3) {
                      console.log(checkValidFile.fileExtenstion);
                      // alert('3')

                      if (checkValidFile.fileExtenstion.toLowerCase() === '.docx' || checkValidFile.fileExtenstion.toLowerCase() === '.rtf'
                        || checkValidFile.fileExtenstion.toLowerCase() === '.xls'
                        || checkValidFile.fileExtenstion.toLowerCase() === '.doc'
                        || checkValidFile.fileExtenstion.toLowerCase() === '.pdf'
                        || checkValidFile.fileExtenstion.toLowerCase() === '.xlsx'
                      ) {
                        // alert('4')
                        validation = true;
                      } else {
                        // alert('5')
                        validation = false;
                        validation1 = true;
                      }
                      // this.showError('Only  3 images are allowed');
                    } else if (documentsdone > 3) {
                      if (checkValidFile.fileExtenstion.toLowerCase() === '.docx' || checkValidFile.fileExtenstion.toLowerCase() === '.rtf'
                        || checkValidFile.fileExtenstion.toLowerCase() === '.xls'
                        || checkValidFile.fileExtenstion.toLowerCase() === '.xlsx'
                        || checkValidFile.fileExtenstion.toLowerCase() === '.doc' || checkValidFile.fileExtenstion.toLowerCase() === '.pdf') {
                        validation = true;
                        // alert('6')
                      } else {
                        // alert('7')
                        validation = false;
                        validation1 = true;
                      }
                    } else {
                      // alert('8')
                      if (checkValidFile.fileExtenstion.toLowerCase() === '.docx' || checkValidFile.fileExtenstion.toLowerCase() === '.rtf'
                        || checkValidFile.fileExtenstion.toLowerCase() === '.xls' || checkValidFile.fileExtenstion.toLowerCase() === '.xlsx'
                        || checkValidFile.fileExtenstion.toLowerCase() === '.doc' || checkValidFile.fileExtenstion.toLowerCase() === '.pdf') {
                        if (documentsdone === 3) {
                          // alert('9')
                          validation = false;
                          validation2 = true;
                        }
                      }
                    }
                    // else if (imagesdone>3){
                    //   validation1 = true;
                    //   validation = false;
                    // }
                  } else {
                    // alert('10')
                    if (this.createreferralForm.controls['documentList']['controls'][h]['value']['extension'] === '.docx' ||
                      this.createreferralForm.controls['documentList']['controls'][h]['value']['extension'] === '.doc' ||
                      this.createreferralForm.controls['documentList']['controls'][h]['value']['extension'] === '.rtf' ||
                      this.createreferralForm.controls['documentList']['controls'][h]['value']['extension'] === '.pdf' ||
                      this.createreferralForm.controls['documentList']['controls'][h]['value']['extension'] === '.xls' ||
                      this.createreferralForm.controls['documentList']['controls'][h]['value']['extension'] === '.xlsx') {
                      documentsdone += 1;
                      validation = true;
                      // alert('11')
                      if (documentsdone === 3) {
                        // alert('12')
                        if (checkValidFile.fileExtenstion.toLowerCase() === '.png' || checkValidFile.fileExtenstion.toLowerCase() === '.jpg' || checkValidFile.fileExtenstion.toLowerCase() === '.jpeg'
                        ) {
                          // alert('13')
                          validation = true;
                        } else {
                          // alert('14')
                          validation = false;
                          validation2 = true;
                        }
                        // this.showError('Only  3 documents are allowed');
                      } else if (documentsdone > 3) {
                        if (checkValidFile.fileExtenstion.toLowerCase() === '.png' || checkValidFile.fileExtenstion.toLowerCase() === '.jpg' || checkValidFile.fileExtenstion.toLowerCase() === '.jpeg'
                        ) {
                          // alert('15')
                          validation = true;
                        } else {
                          // alert('16')
                          validation = false;
                          validation2 = true;
                        }
                      } else {
                        if (checkValidFile.fileExtenstion.toLowerCase() === '.png' || checkValidFile.fileExtenstion.toLowerCase() === '.jpg' || checkValidFile.fileExtenstion.toLowerCase() === '.jpeg'
                        ) {
                          // alert('17')
                          if (imagesdone === 3) {
                            // alert('18')
                            validation = false;
                            validation1 = true;
                          }
                        }
                      }
                    }
                  }
                }
              } else {
                // alert('19')
                validation = true;
              }
            }
          }
          // else if (filetype == 2) {
          //   if ((checkValidFile.fileExtenstion.toLowerCase() == '.mp4')) {
          //     validation = true;
          //   }
          // }

          if (validation) {
            var w = file[this.i].size;
            if (w > 0 && +w <= 50000000) {
              const params = this.getParams(file[this.i], checkValidFile);
              var key = params.Key;


              if (filetype === 1) {
                this.documentList = this.createreferralForm.get('documentList') as FormArray;
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
              // if (filetype == 2) {
              //   this.videoList = this.createPostForm.get('videoList') as FormArray;
              //   this.videoList.push(this.formBuilder.group({
              //     id: [''],
              //     documentoriginalname: [checkValidFile.fileName],
              //     extension: [checkValidFile.fileExtenstion],
              //     percentage: [0],
              //     filetype: filetype,
              //     uploaddoc: [key]
              //   })
              //   );
              //   this.awsUploadFile(file[this.i], params, this.videoList.length, filetype);
              // }

              console.log(this.documentList);

              this.filesuploaded = this.createreferralForm.controls['documentList']['length'];

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
              if (validation1 === true) {
                this.showError('Upload maximum of 3 images');
              } else if (validation2 === true) {
                this.showError('Upload maximum of 3 documents');
              } else {
                this.showError('Upload PDF, EXCEL, WORD,PNG ,JPG,JPEG documents only');
              }
            }
            // } else if (filetype === 2) {
            //   this.showError('Upload Mp4 Files only');
            // }
            this.i += 1;
            this.fileChangeEvent(this.selectedFiles, filetype);
          }
        } else {
          this.i = 0;
          console.log('else 22');
        }
      }
    } else {
      this.showError('Upload not more than 6 Files');
    }
  }


  getMyPost() {
    this.refferalService.getMyRefferal(this.userId).subscribe((res) => {
      if (res['status']['status'] === 200) {

        this.mypost = res['entity'];
        if (this.mypost['postList'] !== null) {

          this.referralType = 'post';
          this.postObj = this.mypost['postList'];
          console.log(this.postObj);
          this.isPost = true;
          this.createForm();
          this.loading = false;
          window.scrollTo(0, 0);
        } else if (this.mypost['profileEntity'] !== null) {
          this.isPost = false;
          this.referralflag = true;
          this.referralType = 'profile';
          this.postObj = this.mypost['profileEntity'];
          console.log(this.postObj);
          this.createForm();
          this.nopostuser();

        }
      }
    });
  }

  viewpost(postid) {
    console.log(postid);
  }

}
