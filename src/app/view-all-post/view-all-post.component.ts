import { Component, OnInit } from '@angular/core';
import { PostService } from '../service/post.service';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';
import { LanguageService } from '../service/language.service';

@Component({
  selector: 'app-view-all-post',
  templateUrl: './view-all-post.component.html'
})
export class ViewAllPostComponent implements OnInit {

  cloudeURL = environment.cloudFrontURL;
  viewallpost: any;
  currentPage = 1;
  pageSize = 10;
  total: any;
  langData: any = { common: '', userHomePage: '' };
  constructor(private router: Router, private postService: PostService, private language: LanguageService) { }

  ngOnInit() {
    this.fetchTopPicks();
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

  fetchTopPicks() {
    const data = {
      'userId': localStorage.getItem('UserId'),
      'pageNumber': this.currentPage,
      'pageSize': this.pageSize
    };
    // const count = 1000;
    // const userId = localStorage.getItem('UserId');
     this.postService.topPicks(data).subscribe(res => {

      if (res['status']['status'] === 200) {
        this.viewallpost = res['entity'];
        this.total = res['count'];
        console.log(this.viewallpost);
      }
     }, err => {
       console.log(err);
     });
  }

  postChange(pageNo) {
    this.currentPage = pageNo;
    this.fetchTopPicks();
  }

  viewPost(postId) {

    if (postId) {

      // navigate to view post page

      this.router.navigate(['/view-post', postId]);

    }

  }

}
