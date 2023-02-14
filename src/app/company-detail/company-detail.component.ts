
import { Component, OnInit, ViewChild } from '@angular/core';
import { PostService } from '../service/post.service';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { LanguageService } from '../service/language.service';
import { HttpParams } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { TabsetComponent } from 'ngx-bootstrap';
import * as io from 'socket.io-client';
import { ChatserviceService } from '../service/chatservice.service';
import { BusinessPitchComponent } from '../company-tab/business-pitch/business-pitch.component';
import { DomSanitizer } from '@angular/platform-browser';
import { BsModalService, BsModalRef } from 'ngx-bootstrap';


@Component({
  selector: 'app-company-detail',
  templateUrl: './company-detail.component.html'
})
export class CompanyDetailComponent implements OnInit {
  // private url = 'http://54.202.218.249:9005/';
  // private url = 'https://businessinchattest.optisolbusiness.com/';
  socket;
  @ViewChild('tabset') tabset: TabsetComponent;
  postCreatedUser: string;
  postId: string;
  userId: string;
  responseData: any;
  cloudeURL = environment.cloudFrontURL;
  noteCon = true;
  contactInfoTab = false;
  communicationTab = false;
  bookedresponse: any = true;
  tooltipStatus: string;
  bookmarkStatus = false;
  accountTypeName: string;
  public loading = false;
  hideMessage = '';
  langData: any = { common: '', viewPostPage: '' };
  hideLayer = false;
  showInputBox = true;
  communicationCheck: any = {};
  chatroomdetail: any = [];
  chatroommesaage: any = [];
  pitchDet: any = {};
  businesspitch;

  constructor(private postservices: PostService,
    private router: Router,
    private sanitizer: DomSanitizer,
    private modalService: BsModalService,

    private toastr: ToastrService, private chatservice: ChatserviceService,
    private language: LanguageService) {
    this.socket = io(environment.url);
  }

  ngOnInit() {
    this.userId = localStorage.getItem('UserId');
    localStorage.setItem('route', '');
    // localStorage.setItem('navigation', 'false');
    this.getVurl();
    this.fetchLanguage();
    // if (this.postservices.userIdidentify === this.userId) {
    //   this.noteCon = false;
    // } else {
    //   this.noteCon = true;
    // }
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

  pitchFunction() {
    this.businesspitch = new BusinessPitchComponent(this.postservices, this.sanitizer, this.modalService,
      this.language, this.router, this.toastr);
  }

  isCommunication() {
    this.joinroom();
  }

  getVurl() {
    const geturl = this.router.url;
    const params = geturl.split('view-post/');
    this.postId = params[1];
    this.createPostView();
    if (this.postservices.contactInfo === 1) {
      this.selectTab(2);
    }
  }

  selectTab(id) {
    console.log(id);
    this.tabset.tabs[id].active = true;
  }

  createPostView() {
    // to fetch Post id
    this.loading = true;
    this.postservices.viewPost(this.postId, this.userId).subscribe((responseview) => {
      console.log('oooo', responseview);

      if (responseview['status']['status'] === 200) {
        this.responseData = responseview['entity'];
        this.pitchDet = {
          pitchid: this.responseData.businesspitch.pitchid,
          type: this.responseData.businesspitch.type,
          createdUser: this.responseData.userid,
          postid: this.responseData.postid
        };
        localStorage.setItem('myPostData', JSON.stringify(this.responseData));
        console.log(this.responseData);
        this.postservices.viewPostData(this.responseData);
        this.bookmarkStatus = this.responseData.bookmarkedstatus;
        this.accountTypeName = this.responseData.accounttype.accounttypeshortname;
        this.postCreatedUser = this.responseData.userid;
        console.log(this.postCreatedUser);
        console.log(this.userId);
        if (this.postCreatedUser === this.userId) {
          this.noteCon = false;
        } else {
          this.noteCon = true;
        }

        if (this.responseData.contactinfo.contactinfoid === 1) {
          this.contactInfoTab = true;
        }
        if ((this.postCreatedUser === this.userId) && (+this.responseData.contactinfo.contactinfoid === 2)) {
          this.communicationTab = false;
        }
        if ((this.postCreatedUser !== this.userId) && (+this.responseData.contactinfo.contactinfoid === 2)) {
          this.communicationTab = true;
        }
        if (this.responseData.bookmarkedstatus === true) {
          this.tooltipStatus = 'Remove Bookmark';
        } else {
          console.log(this.responseData.bookmarkedstatus);
          this.tooltipStatus = 'Bookmark this Post';
        }
        this.loading = false;
      } else if (responseview['status']['status'] === 228 || responseview['status']['status'] === 227) {
        if (localStorage.getItem('ReferalPost') === 'true') {
          this.hideLayer = true;
          if (responseview['status']['status'] === 228) {
            this.hideMessage = 'Sorry, the user has deleted the post';
          } else {
            this.hideMessage = 'Sorry, the user has temporarily removed this post';
          }
        }
        if (localStorage.getItem('navigation') === 'true') {
          this.hideLayer = true;
          if (responseview['status']['status'] === 228) {
            this.hideMessage = 'Sorry, the user has deleted the post';
          } else {
            this.hideMessage = 'Sorry, the user has temporarily removed this post';
          }
          localStorage.setItem('navigation', 'false');
        } else {
          this.responseData = responseview['entity'];
          localStorage.setItem('myPostData', JSON.stringify(this.responseData));
          console.log(this.responseData);
          this.postservices.viewPostData(this.responseData);
          this.bookmarkStatus = this.responseData.bookmarkedstatus;
          this.accountTypeName = this.responseData.accounttype.accounttypeshortname;
          if (this.responseData.bookmarkedstatus === true) {
            this.tooltipStatus = 'Remove Bookmark';
          } else {
            console.log(this.responseData.bookmarkedstatus);
            this.tooltipStatus = 'Bookmark this Post';
          }
        }
        this.loading = false;
      }
    }, err => {
      this.loading = false;
      localStorage.removeItem('myPostData');
      this.toastr.error('Sorry temporarily the post is not available');
    });
  }


  joinroom() {
    console.log('join room');
    this.socketConnection();
    const data = {
      senderId: this.userId,
      receiverId: this.postId,
      isPost: true
    };
    const that = this;
    console.log(data);
    this.socket.emit('join-user-chat', data, function (resp, err) {
      console.log(resp, err);
    });
    this.socket.on('get-room-id', function (res: any) {
      console.log('on', res);
      localStorage.setItem('chatroomid', res['chatRoomId']);
      localStorage.setItem('chatroomname', res['roomname']);
      that.chatroomdetail = res;
      that.communicationCheck.chatroomid = localStorage.getItem('chatroomid');
      that.getChatRoomMessages(localStorage.getItem('chatroomid'), that.postId);
    });
  }

  socketConnection() {
    console.log('connection');

    const data = {
      'userId': this.postId
    };
    console.log(data);
    this.socket.emit('new-user', data);
  }

  getChatRoomMessages(roomid: any, postid: any) {
    console.log('chat room messages');
    localStorage.setItem('chatroomid', roomid);
    localStorage.setItem('postid', postid);

    const data = {
      'chatroomid': roomid,
      'userid': postid,
      'pagenumber': 1,
      'pagesize': 50,
      'search': ''
    };
    console.log('getChatRoomMessages data ', data);
    this.chatservice.chatroomMessages(data).subscribe(res => {
      if (res && res['statusCode'] === 200) {
        this.chatroommesaage = res['data']['message'];
        console.log(this.chatroommesaage.length);
        if (this.chatroommesaage.length === 0) {
          console.log('00000000000');
          this.showInputBox = true;
          this.communicationCheck.chatroommesaagesarr = this.chatroommesaage;
          this.communicationCheck.showInputBox = true;
          console.log(this.communicationCheck.chatroommesaagesarr);
        } else {
          console.log(' > 00000000>0>  >>>>>>>>>>>>>>>.');
          this.showInputBox = false;
          this.communicationCheck.chatroommesaagesarr = this.chatroommesaage[0];
          this.communicationCheck.showInputBox = false;
          if (this.communicationCheck.chatroommesaagesarr.TMESSAGES_Content.includes('https://') ||
          this.communicationCheck.chatroommesaagesarr.TMESSAGES_Content.includes('http://')) {
            const messageContent = this.communicationCheck.chatroommesaagesarr.TMESSAGES_Content;
            if (this.communicationCheck.chatroommesaagesarr.TMESSAGES_Content.includes('https://')) {
              if (this.communicationCheck.chatroommesaagesarr.TMESSAGES_Content.includes('\n')) {
                console.log('yesssssssss');
                const splitArray = messageContent.replace(/\n/g, ' ').split(' ');
                for (let j = 0; j < splitArray.length; j++) {
                  if (splitArray[j].includes('https://')) {
                    this.communicationCheck.chatroommesaagesarr.anchorContent = splitArray[j];
                  }
                }
              } else {
                const splitArray = messageContent.split(' ');
                for (let j = 0; j < splitArray.length; j++) {
                  if (splitArray[j].includes('https://')) {
                    this.communicationCheck.chatroommesaagesarr.anchorContent = splitArray[j];
                  }
                }
              }
            }
            if (this.communicationCheck.chatroommesaagesarr.TMESSAGES_Content.includes('http://')) {
              const splitArray = messageContent.split(/\n /);
              for (let j = 0; j < splitArray.length; j++) {
                if (splitArray[j].includes('http://')) {
                  this.communicationCheck.chatroommesaagesarr.anchorContent = splitArray[j];
                }
              }
            }
            this.communicationCheck.chatroommesaagesarr.linktype = 'link';
          }
          console.log(this.communicationCheck.chatroommesaagesarr);
        }
      }
    });
  }

  addBookmark() {
    if (this.bookedresponse) {
      this.bookedresponse = false;
      if (this.responseData.bookmarkedstatus === false) {
        let params = new HttpParams();
        params = params.append('postid', this.postId.toString());
        params = params.append('userid', this.userId.toString());
        this.postservices.addBookmark(params).subscribe((response: any) => {
          this.bookedresponse = true;
          console.log(response);
          if (response.status.status === 200) {
            this.toastr.clear();
            this.toastr.success('Your post is Bookmarked successfully');
            this.createPostView();
          }
        }, (error) => {
          this.bookedresponse = true;
          this.toastr.clear();
          this.toastr.error('User can`t able bookmark own post ');
        });
      } else {
        let params = new HttpParams();
        params = params.append('postid', this.postId.toString());
        params = params.append('userid', this.userId.toString());
        this.postservices.addBookmark(params).subscribe((response: any) => {
          console.log(response);
          this.bookedresponse = true;
          if (response.status.status === 200) {
            this.toastr.clear();
            this.toastr.success('Bookmarked Post is Removed successfully');
            this.createPostView();
          }
        }, err => {
          this.bookedresponse = true;
        });
      }

    }
  }
}
