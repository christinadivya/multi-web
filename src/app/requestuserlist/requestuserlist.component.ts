import { Component, OnInit } from '@angular/core';
import { PostService } from '../service/post.service';
import { Router } from '@angular/router';
import { LanguageService } from '../service/language.service';
import { HttpParams } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-requestuserlist',
  templateUrl: './requestuserlist.component.html',
  styleUrls: ['./requestuserlist.component.scss']
})
export class RequestuserlistComponent implements OnInit {

  radioButton = false;
  search = '';
  searchMessage = '';
  sendRefButton = true;
  currentPage = 1;
  pageSize = 10;
  total = 0;
  postid: any;
  postList: any = [];
  // userList: any = [];
  userList = [{
    id: null,
    ischeck: false,
    name: 'User Name',
    companyname: 'Company Name',
    location: 'Location',
    profileimage: './assets/images/default-user.jpg',
    requesteruserid: null,
    acctypeshortname: 'Company Type'
  }];
  localpage = null;
  isSelectAllButton = false;
  buttonShow = 'Select All';
  public loading = false;
  cloudeURL = environment.cloudFrontURL;
  userId: string;
  hideSelectButton = false;
  hideSendReferralButton = false;
  hideAcceptButton = true;
  hideRejectButton = true;
  pitchid: any = [];
  requestValue: any;

  langData: any = { common: '', sendReferralPage: '', searchPage: '', viewPostPage: '' };

  constructor(private router: Router, private postService: PostService,
    private language: LanguageService, private toastr: ToastrService) { }

  ngOnInit() {
    this.userId = localStorage.getItem('UserId');
    this.loading = true;
    this.fetchLanguage();
    this.getVurl();
    // this.getRequestUserList();
    // this.getAllPostForPitch(1);
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
    const geturl = this.router.url;
    console.log(geturl);
    if (geturl.includes('requestuserlist')) {
      const params = geturl.split('requestuserlist/');
      console.log(params);
      this.postid = params[1];
      this.getuser(this.postid);
      this.getAllPostForPitch(1);
    }
    if (geturl.includes('businesspitch')) {
      this.getAllPostForPitch(2);
    }
  }

  getAllPostForPitch(val) {
    console.log('val ', val);
    this.postService.postListForBusinessPitch().subscribe(res => {
      console.log(res);
      if (res && res['status'] && res['status']['status'] === 200) {
        this.loading = false;
        if (res['entity']['postList'] !== null) {
          this.postList = res['entity']['postList'];
          if (this.postList.length > 0) {
            if (val === 2) {
              this.postid = this.postList[0].postid;
              this.getuser(this.postid);
            }
          }
        } else {
          this.userList = [];
          if (val === 2) {
            this.toastr.error('No post for Business Pitch Access');
          }
        }
      }
    });
  }

  getuser(value) {
    this.currentPage = 1;
    console.log(value);
    this.postid = value;
    this.isSelectAllButton = true;
    this.buttonClicked();
    this.getRequestUserList();
  }

  getRequestUserList() {
    console.log(this.postid);
    let params = new HttpParams();
    params = params.append('pagenumber', this.currentPage.toString());
    params = params.append('pagerecord', this.pageSize.toString());
    params = params.append('postid', this.postid);
    this.postService.userListForBusinessPitch(params.toString()).subscribe(res => {
      console.log('response ', res);
      this.userList = [];
      if (res && res['status'] && res['status']['status'] === 200) {
        if (res['entity'].length > 0) {
          res['entity'].map(async (ele) => {
            const cityname = (ele.cityname !== null) ? (ele.cityname + ',') : '';
            const statename = (ele.statename !== null) ? (ele.statename + ',') : '';
            const countryname = (ele.countryname !== null) ? ele.countryname : '';
            let location = cityname + statename + countryname;
            location = Array.from(new Set(location.split(','))).toString();
            if (this.isSelectAllButton === true) {
              this.userList.push({
                id: ele.id,
                requesteruserid: ele.requesteruserid,
                ischeck: true,
                name: ele.name,
                companyname: ele.companyname,
                acctypeshortname: ele.acctypeshortname,
                location: location,
                profileimage: (ele.profileimage === null) ? null :
                  ele.profileimage
              });
            } else {
              this.userList.push({
                id: ele.id,
                requesteruserid: ele.requesteruserid,
                ischeck: false,
                name: ele.name,
                companyname: ele.companyname,
                acctypeshortname: ele.acctypeshortname,
                location: location,
                profileimage: (ele.profileimage === null) ? null :
                  ele.profileimage
              });
            }
            this.total = res['count'];
          });
        }
        this.loading = false;
      } else {
        // this.postid = '';
        this.loading = false;
        this.userList = [];
        this.total = 0;
      }
    });
  }

  profileChange(pageNo) {
    window.scrollTo(0, 0);
    this.loading = true;
    this.localpage = pageNo;
    this.currentPage = pageNo;
    this.pageSize = 10;
    this.getRequestUserList();
  }

  buttonClicked() {
    console.log(this.isSelectAllButton);
    this.isSelectAllButton = !this.isSelectAllButton;
    this.buttonShow = (this.isSelectAllButton === false) ? 'Select All' : 'Deselect All';
    this.hideAcceptButton = (this.isSelectAllButton === false) ? true : false;
    this.hideRejectButton = (this.isSelectAllButton === false) ? true : false;
    this.getRequestUserList();
  }

  async selectAll() {
    // let data;
    // console.log(this.isSelectAllButton);
    // if (this.isSelectAllButton) {
    //   this.selectedrefferals = [];
    //   this.currentPage = 0;
    //   this.pageSize = 0;
    // }
  }

  async selectedProfile(value, isChecked, i) {
    console.log(value, isChecked, i);
    if (value['ischeck']) {
      this.userList.map((val, index) => {
        if (val['id'] === value['id']) {
          this.userList[i].ischeck = false;
        }
      });
    } else {
      this.userList[i].ischeck = true;
    }
    console.log(this.userList);
  }

  async sendAllResponse(value) {
    console.log(this.userList);
    this.loading = true;
    this.pitchid = [];
    this.currentPage = 0;
    this.pageSize = 0;
    let params = new HttpParams();
    params = params.append('pagenumber', this.currentPage.toString());
    params = params.append('pagerecord', this.pageSize.toString());
    params = params.append('postid', this.postid);
    this.postService.userListForBusinessPitch(params.toString()).subscribe(async (res) => {
      console.log(res['entity']);
        for (let i = 0; i < res['entity'].length; i++) {
          for (let j = 0; j < this.userList.length; j++) {
            if (res['entity'][i].id === this.userList[j].id && this.userList[j].ischeck === true) {
              this.pitchid.push(res['entity'][i].id);
            }
          }
        }
      if (this.pitchid.length > 0) {
        console.log('ppp', this.pitchid);
        this.requestValue = value;
        this.sendBusinessPitchResponse();
      }
    });
  }

  sendResponse(array, value) {
    this.pitchid = [];
    this.pitchid.push(array.id);
    this.requestValue = value;
    this.sendBusinessPitchResponse();
  }

  sendBusinessPitchResponse() {
    const data = {
      'businessPitchId': this.pitchid,
      'pitchRequest': this.requestValue
    };
    console.log(data);
    this.postService.sendBusinessPitchResponse(data).subscribe((res: any) => {
      if (res['status'] === 200) {
        this.loading = false;
        this.toastr.success(res['msg']);
        this.getRequestUserList();
      } else {
        this.toastr.error(res['msg']);
      }
      console.log(res);
    });
  }
}
