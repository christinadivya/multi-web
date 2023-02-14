import { Component, OnInit, TemplateRef, } from '@angular/core';
import { LanguageService } from '../service/language.service';
import { HttpParams } from '@angular/common/http';
import { PostService } from '../service/post.service';
import { environment } from 'src/environments/environment';
import { ToastrService } from 'ngx-toastr';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { Router } from '@angular/router';
import { GeneralService } from '../service/general.service';
@Component({
  selector: 'app-bookmarks',
  templateUrl: './bookmarks.component.html',
  styleUrls: ['./bookmarks.component.scss']
})
export class BookmarksComponent implements OnInit {

  langData: any = { common: '', bookmarkPage: '' };
  userId: string;
  currentPage = 1;
  pageSize = 10;
  total = 0;
  totalPage = 1;
  bookmarkList = [];
  search = '';
  public loading = false;
  cloudeURL = environment.cloudFrontURL;
  constructor(private postService: PostService, private modalService: BsModalService,
    private toastr: ToastrService,
    private language: LanguageService,
    private router: Router, private generalService: GeneralService) { }
  modalRef: BsModalRef;
  ngOnInit() {
    this.generalService.tabActive.next('/bookmarks');
    this.userId = localStorage.getItem('UserId');
    this.fetchLanguage();
    this.getAllBookmarks();
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
  viewPost(postId) {
    console.log(postId);
    if (postId) {
      this.postService.userIdidentify = postId.userid;
      this.router.navigate(['/view-post', postId.postid]);

    }
  }

  postChange(pageNo) {
    let params = new HttpParams();
    this.currentPage = pageNo;
    params = params.append('pageNumber', this.currentPage.toString());
    params = params.append('pageSize', this.pageSize.toString());
    params = params.append('userid', this.userId.toString());
    params = params.append('search', this.search.toString());
    console.log(params);
    this.postService.getBookmarks(params.toString()).subscribe((response: any) => {
      console.log(response);
      if (response && response['status'] && response['status']['status'] === 200) {
        if (response['entity']) {
          this.bookmarkList = response['entity'];
          this.total = response['count'];
          this.totalPage = Math.ceil(this.total / this.pageSize);
        }
      } else {
        this.bookmarkList = [];
        this.total = 0;
      }
    });
    // this.getAllBookmarks();
  }

  getAllBookmarks() {
    this.loading = true;
    let params = new HttpParams();
    // if(this.search) {
      params = params.append('pageNumber', this.currentPage.toString());
      params = params.append('pageSize', this.pageSize.toString());
      params = params.append('userid', this.userId.toString());
      params = params.append('search', this.search.toString());
    // }
    // if(!this.search) {
    //   params = params.append('pageNumber', this.currentPage.toString());
    //   params = params.append('pageSize', this.pageSize.toString());
    //   params = params.append('userid', this.userId.toString());
    //   params = params.append('search', this.search.toString());
    // }
    //  if (this.search !== '') {
    //      this.onSearchChange(this.search);
    //  } else {
    this.postService.getBookmarks(params.toString()).subscribe((response: any) => {
      this.loading = false;
      if (response && response['status'] && response['status']['status'] === 200) {
        if (response['entity']) {
          this.bookmarkList = response['entity'];
          this.total = response['count'];
          this.totalPage = Math.ceil(this.total / this.pageSize);
        }
      } else {
        this.bookmarkList = [];
        this.total = 0;
      }
    });
  }

  removeBookmark(bookmark) {
    let params = new HttpParams();
    params = params.append('postid', bookmark.postid.toString());
    params = params.append('userid', this.userId.toString());
    this.postService.addBookmark(params).subscribe((response: any) => {
      if (response.status.status === 200) {
        this.toastr.success('Bookmarked Post is Removed successfully');
        this.getAllBookmarks();
      }
    });

  }

  onSearchChange(searchValue: string) {
    this.search = searchValue.trim();
    this.currentPage = 1;
    this.getAllBookmarks();
    // let params = new HttpParams();
    // params = params.append('pageNumber', this.currentPage.toString());
    // params = params.append('pageSize', this.pageSize.toString());
    // params = params.append('userid', this.userId.toString());
    // this.postService.searchBookmarks(params.toString()).subscribe((response: any) => {
    //   if (response && response['status'] && response['status']['status'] === 200) {
    //     if (response['entity']) {
    //       this.bookmarkList = response['entity'];
    //       console.log(this.bookmarkList, this.search);
    //       this.total = response['count'];
    //       this.totalPage = Math.ceil(this.total / this.pageSize);
    //       console.log(this.bookmarkList);
    //     }
    //   } else {
    //     this.bookmarkList = [];
    //     this.total = 0;
    //     console.log(this.bookmarkList);
    //   }
    // });
  }


}
