import { Component, OnInit } from '@angular/core';
import { LanguageService } from 'src/app/service/language.service';
import { PostService } from 'src/app/service/post.service';
import { RegisterService } from 'src/app/service/register.service';
import { HttpParams } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { timingSafeEqual } from 'crypto';
import { GeneralService } from '../service/general.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit {
  cloudeURL = environment.cloudFrontURL;
  langData: any = { common: '', header: '', searchPage: '' };
  typeList = [];
  industryList = [];
  seletedIndustry = [];
  seletedLocation = [];
  accValue: any;
  moreFilter = false;
  showInvertorType = false;
  inves: any;
  companysize: any;
  isFilter = false;
  search = '';
  innersearch = '';
  suggestions: boolean;
  suggestedLocation: any;
  acctype: any;
  public items: any[] = this.suggestedLocation;
  origin: any;
  userId: any;
  overalResult: any;
  subacctype: any;
  companySize: any;
  foundedfrom: any;
  foundedto: any;
  toppicksforyou: any;
  typeId = 100;
  indusId = 500;
  selectedcityid = 'ddd';
  currentPage = 1;
  pageSize = 5;
  total = 0;
  obj_2 = {};
  loginLocationList = [];
  loginIndustryList = [];
  planBased = false;
  data = {
    'userid': '',
    'origin': '',
    'search': '',
    'acctype': '',
    'subacctype': '',
    'foundedfrom': '',
    'foundedto': '',
    'companysize': '',
    'amount': '',
    'indusid': [],
    'cityid': [],
    'pageNumber': '',
    'pageSize': ''
  };
  applyBlur = false;
  loading: boolean;
  tooltipStatus = '';
  pagechange = false;

  constructor(private language: LanguageService,
    private postService: PostService,
    private regService: RegisterService,
    private router: Router,
    private toaster: ToastrService,
    private generalService: GeneralService
  ) { }

  ngOnInit() {
    this.generalService.tabActive.next('/search');
    localStorage.setItem('generalId', null);
    console.log(localStorage.getItem('userPlanType'), '%%%%');
    this.fetchLanguage();
    this.getTypes();
    this.getAcc();
    this.getIndustryList();
    this.getTopPost();
    this.userId = localStorage.getItem('UserId');
    this.planBased = (localStorage.getItem('userPlanType') === 'Silver') ? true : false;
    if (this.planBased === true) {
      this.tooltipStatus = 'Please upgrade your plan to enable this feature';
    }
    console.log(this.regService.accountDetails_1);
    if (this.regService.accountDetails_1) {
      this.acctype = this.regService.accountDetails_1['acctype'];
      this.origin = this.regService.accountDetails_1['origin'];
      this.userId = this.regService.accountDetails_1['userId'];
      this.search = this.regService.accountDetails_1['search'];
      this.getSearchResult();
      this.getALLData();
    }
  }
  getALLData() {
    this.postService.getViewData(this.userId).subscribe((getRes) => {
      if (getRes && getRes != null) {
        this.loginLocationList = getRes['entity']['userprofile']['userLocation'];
        this.loginIndustryList = getRes['entity']['userprofile']['userIndustry'];
        if (this.loginLocationList !== []) {
          this.loginLocationList = this.loginLocationList.map((res) => {
            console.log(res);
            this.obj_2 = {};
            if (res.continent !== null && res.country === null && res.state === null && res.city === null) {
              this.obj_2 = {
                'displayName': res.continent.continentname,
                'cityid': res.continent.continentid,
                'searchedby': 'Continent',
              };
            }
            if (res.continent !== null && res.country !== null && res.state === null && res.city === null) {
              this.obj_2 = {
                'displayName': res.country.countryname,
                'cityid': res.country.countryid,
                'searchedby': 'Country',
              };
            }
            if (res.continent !== null && res.country !== null && res.state !== null && res.city === null) {
              this.obj_2 = {
                'displayName': res.state.statename,
                'cityid': res.state.stateid,
                'searchedby': 'State',
              };
            }
            if (res.continent !== null && res.country !== null && res.state !== null && res.city !== null) {
              this.obj_2 = {
                'displayName': res.city.cityname,
                'cityid': res.city.cityid,
                'searchedby': 'City',
              };
            }
            return this.obj_2;
          });
        }
        this.seletedLocation = this.loginLocationList;
        console.log(this.seletedLocation);

      }
      if (this.loginIndustryList !== []) {
        this.loginIndustryList = this.loginIndustryList.map((res) => {
          this.seletedIndustry.push(res.industry);
          return res;
        });
      }
    }, (error) => {
    });
  }
  receiveMessage(value) {
    console.log(value);

    if (value === 1) {
      // this.ngOnInit();
      console.log('this.regService.accountDetails_1 ', this.regService.accountDetails_1);
      if (this.regService.accountDetails_1) {
        this.acctype = this.regService.accountDetails_1['acctype'];
        this.origin = 3;
        this.userId = this.regService.accountDetails_1['userId'];
        this.search = this.regService.accountDetails_1['search'];
        this.typeId = this.regService.accountDetails_1['acctype'];
        this.getSearchResult();
        // this.getALLData();
      }
    }
  }
  viewPost(postId) {
    if (postId) {
      // navigate to view post page
      this.postService.userIdidentify = postId.userid;
      this.postService.viewPost(postId.postid, postId.userid).subscribe((responseview) => {
        console.log(responseview);
        if (responseview['status']['status'] === 200) {
          localStorage.setItem('myPostData', JSON.stringify(responseview['entity']));
          this.router.navigate(['/view-post', postId.postid]);
        } else if (responseview['status']['status'] === 228 || responseview['status']['status'] === 227) {
          localStorage.removeItem('myPostData');
          localStorage.setItem('ReferalPost', 'true');
          this.router.navigate(['/view-post', postId.postid]);
        }
      }, err => {
        localStorage.removeItem('myPostData');
        // this.toastr.error('Sorry, the user has temporarily removed this post');
      });
    }
  }

  viewcontactPost(postId) {
    if (postId) {
      // navigate to view post page
      this.postService.contactInfo = 1;
      this.router.navigate(['/view-post', postId]);
    }
  }
  getTopPost() {
    const data = {
      'userId': localStorage.getItem('UserId'),
      'pageNumber': this.currentPage,
      'pageSize': 3
    };
    // const count = 3;
    // const userId = localStorage.getItem('UserId');
    this.postService.topPicks(data).subscribe(res => {
      console.log(res, '$$$');
      if (res['status']['status'] === 200) {
        this.toppicksforyou = res['entity'];
      }
    }, err => {
    });
  }
  showMoreFilter() {
    this.moreFilter = !this.moreFilter;
    this.postService.getCompanySize().subscribe(res => {
      if (res['status']['status'] === 200) {
        // console.log(res);
        this.companysize = res['entity'];
      }
    }, err => {
      console.log(err);

    });
  }
  // onSearchChange(searchValue: string) {
  //   this.innersearch = searchValue.trim();
  //   this.isFilter = true;
  //   this.getSearchResult();
  // }
  getTypes() {
    this.postService.getTypeList().subscribe((types: any) => {
      if (types.status && types.status.status === 200) {
        this.typeList = types.entity;
        if (this.regService.accountDetails_1) {
          this.typeList.forEach(element => {
            console.log(element);
            if (element.accounttypeid === this.regService.accountDetails_1['acctype']) {
              this.typeId = this.regService.accountDetails_1['acctype'];
              if (this.regService.accountDetails_1['acctype'] === 3) {
                this.postService.getSubPost(3).subscribe((insValue) => {
                  this.inves = insValue['entity'];
                });
                this.showInvertorType = true;
              } else {
                this.showInvertorType = false;
              }
            }
          });
        }
        this.postService.typesList.next(this.typeList);
      }
    });
  }
  getAcc() {
    this.regService.getAccType().subscribe((getvalue) => {
      this.accValue = getvalue['entity'];
    }, (error) => {
      console.log(error);
    });
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
  mylocationSearch(value) {
    if (value !== '') {
      this.suggestions = true;
      this.regService.searchLocations(value).subscribe((location) => {
        if (location && location['entity']) {
          this.suggestedLocation = location['entity'];
          console.log(this.suggestedLocation);
          this.suggestedLocation = this.suggestedLocation.map((res) => {
            res.final = '';
            if (res.continentname !== null && res.countryname === null && res.statename === null && res.cityname === null) {
              res.final = res.continentname;
            }
            if (res.continentname !== null && res.countryname !== null && res.statename === null && res.cityname === null) {
              res.final = `${res.countryname}`;
            }
            if (res.continentname !== null && res.countryname !== null && res.statename !== null && res.cityname === null) {
              res.final = `${res.statename}, ${res.countryname}`;
            }
            if (res.continentname !== null && res.countryname !== null && res.statename !== null && res.cityname !== null) {
              res.final = `${res.cityname}, ${res.statename}, ${res.countryname}`;
            }
            return res;
          });
          this.items = this.suggestedLocation;
        }
      });
    } else {
      this.suggestedLocation = [];
      this.suggestions = false;
    }
  }

  getIndustryList() {
    this.regService.getAllIndustry().subscribe((industry: any) => {
      if (industry.status && industry.status.status === 200) {
        this.industryList = industry.entity;
      }
    });
  }
  locationChanges(location) {
    console.log('location ', location);
    console.log('this.seletedLocation ', this.seletedLocation);
    const addrObj = {
      'City': ['cityid', 'cityname'],
      'State': ['stateid', 'statename'],
      'Country': ['countryid', 'countryname'],
      'Continent': ['continentid', 'continentname']
    };
    console.log('this.seletedLocation ', this.seletedLocation);

    if (this.seletedLocation.length > 0) {
      const isSelected = this.seletedLocation.find((ele) => {
        console.log(ele['cityid'] === location[0].data[addrObj[location[0].data['searchedby']][0]]);
        return ele['cityid'] === location[0].data[addrObj[location[0].data['searchedby']][0]];
      });
      console.log('isSelected ', isSelected);
      if (isSelected === undefined) {
        const obj = {};
        obj['cityid'] = location[0].data[addrObj[location[0].data['searchedby']][0]];
        obj['displayName'] = location[0].data[addrObj[location[0].data['searchedby']][1]];
        obj['searchedby'] = location[0].data['searchedby'];
        this.seletedLocation.push(obj);
        console.log(this.seletedLocation);
        this.selectedcityid = this.seletedLocation.slice(-1)[0]['displayName'];
        this.origin = 3;
        this.getSearchResult();
      }
    } else {
      console.log('else');
      const obj = {};
      obj['cityid'] = location[0].data[addrObj[location[0].data['searchedby']][0]];
      obj['displayName'] = location[0].data[addrObj[location[0].data['searchedby']][1]];
      obj['searchedby'] = location[0].data['searchedby'];
      this.seletedLocation.push(obj);
      this.origin = 3;
      this.getSearchResult();
    }
    console.log(this.seletedLocation);
  }
  onTypeChange(type) {
    this.subacctype = '';
    console.log(type);
    this.acctype = type;
    if (type) {
      this.origin = 3;
      const typeDetail = this.typeList.find((data) => data.accounttypeid === +type);
      console.log(typeDetail);
      if (typeDetail.accounttypeshortname === 'Investors') {
        this.subacctype = 'all';
        this.showInvertorType = true;
        this.postService.getSubPost(typeDetail.accounttypeid).subscribe((insValue) => {
          this.inves = insValue['entity'];
        });

      } else {
        this.subacctype = '';
        this.showInvertorType = false;
      }
    }
    this.getSearchResult();
  }
  removeLocation(index) {
    if (this.seletedLocation.length > 0 && this.planBased === true) {
      const content = 'remove is restricted';
      this.toaster.error('Please upgrade your plan to enable this feature');
      this.origin = '';
    } else {
      this.origin = '';
      this.seletedLocation.splice(index, 1);
      this.getSearchResult();
    }
  }

  removeIndustry(index) {
    this.origin = '';
    this.seletedIndustry.splice(index, 1);
    this.getSearchResult();
  }

  onIndChange(ind, value) {
    this.indusId = ind;
    if (ind) {
      const details = this.industryList.find((industry) => industry.industryid === + ind);
      const index = this.seletedIndustry.findIndex((industry) => industry.industryid === details.industryid);
      if (index === -1) {
        this.seletedIndustry.push(details);
        this.origin = 3;
        this.getSearchResult();
      }
    }
  }
  subInvestor(content) {
    console.log('content ', content);
    if (content === 0) {
      this.subacctype = 'all';
    } else {
      console.log('else ');
      this.subacctype = content.subacctypeid;
    }
    console.log(this.subacctype);
    this.getSearchResult();
  }

  getCompanySize(content) {
    console.log('content ', content);
    this.origin = 3;
    if (content === 0) {
      this.companySize = 'all';
    } else {
      this.companySize = content.id;
    }
    this.getSearchResult();
  }
  getBussinessYear(content) {
    const year = new Date().getFullYear();
    if (content === 1) {
      this.foundedfrom = year - 1;
      this.foundedto = year;
    }
    if (content === 2) {
      this.foundedfrom = year - 5;
      this.foundedto = year;
    }
    if (content === 3) {
      this.foundedfrom = year - 6;
      this.foundedto = '';
    }
    this.origin = 3;
    this.getSearchResult();
  }

  postChange(pageNo) {
    this.loading = true;
    window.scrollTo(0, 0);
    this.currentPage = pageNo;
    this.pagechange = true;
    // console.log(pageNo, '%%%', localStorage.getItem('userPlanType'));
    if (pageNo > 2 && localStorage.getItem('userPlanType') === 'Silver' ) {
      this.applyBlur = true;
    } else {
      this.applyBlur = false;
    }
    this.getSearchResult();
  }

  getSearchResult() {

    if (!this.pagechange) {
      this.currentPage = 1;
    }
    this.loading = true;
    this.data.pageNumber = this.currentPage.toString();
    this.data.pageSize = this.pageSize.toString();
    if (this.search !== null || this.search !== '') {
      this.data.search = this.search;
    }

    if (this.acctype) {
      this.data.acctype = this.acctype;
    }

    this.data.cityid = [];
    this.data.indusid = [];

    if (this.seletedLocation.length > 0 && this.origin !== 2 && this.origin !== 1) {
      this.origin = 3;
      const locationValue = this.seletedLocation.map(res => this.data.cityid.push(res.cityid));
    }
    if (this.seletedIndustry.length > 0 && this.origin !== 2 && this.origin !== 1) {
      this.origin = 3;
      const indusId = this.seletedIndustry.map(res => this.data.indusid.push(res.industryid));
    }
    if (this.userId) {
      this.data.userid = this.userId;
    }

    if (this.subacctype !== '' && this.origin === 3) {
      if (this.acctype === 3) {
        this.origin = 3;
        this.data.subacctype = this.subacctype;
      } else {
        this.origin = 3;
        this.data.subacctype = '';
      }
    }

    if (this.subacctype === '' && this.origin === 3) {
      if (this.acctype === 3) {
        this.origin = 3;
        this.data.subacctype = this.subacctype;
      } else {
        this.origin = 3;
        this.subacctype = '';
        this.data.subacctype = '';
      }
    }

    if (this.companySize) {
      this.origin = 3;
      this.data.companysize = this.companySize;
    }
    if (this.foundedfrom && this.foundedto) {
      this.origin = 3;
      this.data.foundedfrom = this.foundedfrom;
      this.data.foundedto = this.foundedto;
    }
    if (this.foundedfrom && !this.foundedto) {
      this.origin = 3;
      this.data.foundedfrom = this.foundedfrom;
      this.data.foundedto = '';
    }
    if (this.origin) {
      this.data.origin = this.origin;
    }
    console.log(this.data);
    this.regService.getSearchItem(this.data).subscribe((res) => {
      console.log(res);
      if (res && res['status'] && res['status']['status'] === 230) {
        if (res['status']['msg'] !== 'Origin value Required') {
          this.toaster.clear();
          this.toaster.error(res['status']['msg']);
        }
        this.overalResult = [];
        this.total = 0;
      }
      if (res && res['status'] && res['status']['status'] === 200) {
        this.overalResult = res['entity'];
        this.total = res['count'];
        this.loading = false;
      } else {
        this.overalResult = [];
        this.total = 0;
        this.loading = false;
        console.log(this.overalResult);
      }
    }, (error) => {
      this.loading = false;
      console.log(error);
    });
    this.pagechange = false;
  }

  clearFilter() {
    this.seletedIndustry = [];
    this.seletedLocation = [];
    this.typeId = 100;
    this.foundedfrom = '';
    this.foundedto = '';
    this.companySize = '';
    this.indusId = 500;
    this.selectedcityid = '';
    this.origin = localStorage.getItem('origin') ? localStorage.getItem('origin') : '';
    this.getSearchResult();
  }

  checkCurrentCheckbox(id, investorvalue) {
    console.log('investorvalue ', investorvalue, 'id', id);
    const checkBox = document.getElementById(id);
    if (checkBox['checked'] === true) {
      checkBox['checked'] = false;
    } else {
      checkBox['checked'] = true;
    }
    this.subInvestor(investorvalue);
  }

  checkCompanyCheckbox(id, companies) {
    console.log('companies ', companies, 'id', id);
    const checkBox = document.getElementById(id);
    if (checkBox['checked'] === true) {
      checkBox['checked'] = false;
    } else {
      checkBox['checked'] = true;
    }
    this.getCompanySize(companies);
  }

  checkYearCheckbox(id, year) {
    console.log('companies ', year, 'id', id);
    const checkBox = document.getElementById(id);
    if (checkBox['checked'] === true) {
      checkBox['checked'] = false;
    } else {
      checkBox['checked'] = true;
    }
    this.getBussinessYear(year);
  }
}
