import { Component, OnInit, Input, Output, EventEmitter, TemplateRef } from '@angular/core';
import { PostService } from '../service/post.service';
import { MomentModule } from 'ngx-moment';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import * as moment from 'moment-timezone';
import { LanguageService } from '../service/language.service';
import { HttpParams } from '@angular/common/http';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { GeneralService } from '../service/general.service';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.scss']
})
export class PostListComponent implements OnInit {
  userId: any;
  postName: any = [];
  cloudeURL = environment.cloudFrontURL;

  langData: any = { common: '', postListPage: '' };

  currentDate = new Date();
  activeCount = 0;
  pausedCount = 0;
  deletedCount = 0;
  deletePostId: any;
  modalRef: BsModalRef;
  currentPage = 1;
  pageSize = 10;
  total = 0;
  tabActive = 1;
  orderName = 'postname';
  orderType = 'ASC';
  search: any;
  public loading = false;
  constructor(private postService: PostService, private modalService: BsModalService, private router: Router,
    private toastr: ToastrService,
    private language: LanguageService, private generalService: GeneralService) { }
  openModal(template: TemplateRef<any>, postId) {
    this.deletePostId = postId;
    this.modalRef = this.modalService.show(template, { class: 'gray modal-dialog-centered modal-custom modal-sm' });
  }

  ngOnInit() {
    this.generalService.tabActive.next('/post-list');
    localStorage.removeItem('myPostData');
    this.userId = localStorage.getItem('UserId');
    this.getAllPost();
    this.fetchLanguage();
    this.postTotal();
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

  postTotal() {
    let params = new HttpParams();
    params = params.append('userid', this.userId.toString());
    this.postService.getPostCount(params).subscribe((postCount: any) => {
      if (postCount && postCount['entity']) {
        this.activeCount = postCount['entity']['activepostcount'];
        this.pausedCount = postCount['entity']['pausedpostcount'];
        this.deletedCount = postCount['entity']['deletedpostcount'];
      }
    });

  }
  onSearchChange(searchValue: string) {
    this.search = searchValue.trim();
    this.currentPage = 1;
    this.getAllPost();
  }

  getAllPost() {
    this.loading = true;
    let params = new HttpParams();
    if (this.search) {
      params = params.append('search', this.search.toString());
    }
    params = params.append('pageNumber', this.currentPage.toString());
    params = params.append('pageSize', this.pageSize.toString());
    params = params.append('statusid', this.tabActive.toString());
    params = params.append('userid', this.userId.toString());
    params = params.append('sortparam', this.orderName);
    params = params.append('sorttype', this.orderType);
    this.postService.getPostList(params.toString()).subscribe((postRes: any) => {
      if (postRes && postRes['status'] && postRes['status']['status'] === 200) {
        if (postRes['entity']) {
          this.postName = postRes['entity'];
          this.total = postRes.count;
        } else {
          console.log(this.postName);
        }
      } else {
        this.postName = [];
        this.total = 0;
      }
      this.loading = false;
    }, (error) => {
      console.log(error);
    });
  }

  postChange(pageNo) {
    this.currentPage = pageNo;
    this.getAllPost();
  }

  viewPost(postId) {
    if (postId) {
      this.postService.userIdidentify = postId.userid;
      let userId = postId.userid;
      localStorage.removeItem('ReferalPost');
      this.postService.viewPost(postId.postid, userId).subscribe((responseview) => {
        console.log(responseview);
        if (responseview['status']['status'] === 200 ||
          responseview['status']['status'] === 228 || responseview['status']['status'] === 227) {
          localStorage.setItem('myPostData', JSON.stringify(responseview['entity']));
          this.router.navigate(['/view-post', postId.postid]);
        }
      }, err => {
        this.loading = false;
        localStorage.removeItem('myPostData');
      });

    }
  }

  editPost(postId) {

    //  behavioral subject asign value
    this.postService.currentPost(postId);
    // navigate to view post page
    this.router.navigate(['/create-a-post']);

  }

  convertutctolocal(value): string {
    const time = value.toString().split(' ');
    return this.setLocaldatetime(time[0], time[1]);
  }

  setLocaldatetimewithsecond(date, time) {
    let now_utc1 = '0';
    let local;
    if (date && time) {
      const now1 = new Date(date + ' ' + time);
      local = moment(now1).subtract(this.currentDate.getTimezoneOffset(), 'm').toDate();
      now_utc1 = local.getFullYear() + '-' + this.chkLength((local.getMonth() + 1)) + '-' + this.chkLength(local.getDate()) + ' ' + this.chkLength((local.getHours())) + ':' + this.chkLength(local.getMinutes(+':00'));
    }
    return now_utc1;
  }

  setLocaldatetime(date, time): string {
    let now_utc1 = '0';
    let local;
    if (date && time) {
      const now1 = new Date(date + ' ' + time);
      local = moment(now1).subtract(this.currentDate.getTimezoneOffset(), 'm').toDate();
      now_utc1 = local.getFullYear() + '-' + this.chkLength((local.getMonth() + 1)) + '-' + this.chkLength(local.getDate()) + ' ' + this.chkLength((local.getHours())) + ':' + this.chkLength(local.getMinutes());
    }
    return now_utc1;
  }

  convert24to12(value): string {
    let timevalue = '';
    let time = value.toString().split(' ');
    if (time && time[1]) {
      time = time[1].toString().match(/^([01]\d|2[0-3])(:)([0-5]\d)(:[0-5]\d)?$/) || [time];

      if (time.length > 1) { // If time format correct
        time = time.slice(1); // Remove full string match value
        time[5] = +time[0] < 12 ? ' AM' : ' PM'; // Set AM/PM
        time[0] = +time[0] % 12 || 12; // Adjust hours
      }
      timevalue = time.join(''); // return adjusted time or original string
    }
    return timevalue;
  }

  chkLength(data) {
    if (data.toString().length === 1) {
      return '0' + data.toString();
    } else {
      return data;
    }
  }

  tabChange(input) {
    console.log(input);
    this.tabActive = input;
    this.postName = [];
    this.total = 0;
    this.currentPage = 1;
    this.getAllPost();
  }

  orderBy(field) {
    console.log(field);
    if (this.orderName === field) {
      this.orderType === 'ASC' ? this.orderType = 'DESC' : this.orderType = 'ASC';
    }
    if (this.orderName !== field) {
      this.orderType = 'ASC';
    }
    if (this.postName.length > 0) {
      this.orderName = field;
      this.postName = [];
      this.total = 0;
      this.currentPage = 1;
      this.getAllPost();
    }


  }

  changeStatus(postID, type) {
    let params = new HttpParams();
    params = params.append('postid', postID.toString());
    params = params.append('statusid', type.toString());
    this.postService.changePostStatus(params).subscribe((response: any) => {
      console.log(response);
      if (response.status.status === 200) {
        this.toastr.success('Your post status changed successfully');
        this.postName = [];
        this.total = 0;
        this.currentPage = 1;
        this.getAllPost();
        this.postTotal();
      }
    });

  }
  deletePost() {
    let params = new HttpParams();
    params = params.append('postid', this.deletePostId);
    this.postService.deletePost(params).subscribe((response: any) => {
      console.log(response);
      if (response.status.status === 200) {
        this.toastr.success('Your post deleted successfully');
        this.modalRef.hide();
        this.postName = [];
        this.total = 0;
        this.currentPage = 1;
        this.getAllPost();
        this.postTotal();
      }
    });
  }

}
