import { Component, OnInit, ViewChild, Renderer2, ElementRef, AfterViewChecked } from '@angular/core';
import { Router } from '@angular/router';
import { ChatserviceService } from '../service/chatservice.service';
import * as io from 'socket.io-client';
import { RegisterService } from '../service/register.service';
import * as moment from 'moment-timezone';
import * as AWS from 'aws-sdk/global';
import * as S3 from 'aws-sdk/clients/s3';
import { environment } from 'src/environments/environment';
import { IoT1ClickProjects, Lightsail } from 'aws-sdk/clients/all';
import { ToastrService } from 'ngx-toastr';
import { HttpParams } from '@angular/common/http';
import { PostService } from '../service/post.service';
import { LanguageService } from '../service/language.service';
import { split, over } from 'lodash';
import { GeneralService } from '../service/general.service';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.scss']
})
export class MessagesComponent implements OnInit, AfterViewChecked {

  showthreedotspopup = false;
  filterlistspopup = false;
  showpostlist = false;
  isarchive = false;
  archievetype: any;
  mutetype: any;
  muted: any;
  cloudeURL = environment.cloudFrontURL;
  socket;
  public unreadmessagecount: number;
  public message = '';
  public searchparam = '';
  public filename = '';
  public profileid: any;
  public userdetail: any = [];
  public chatroomdetail: any;
  public sendingmessage: any;
  public selectedDateModel: any = {
    beginDate: null
  };
  public currentDate = new Date();
  public recentlogs: any = [];
  public chatroommesaage: any = [];
  public loginUserId: any;
  public postlist: any = [];
  public imagearray = [];
  public filearray = [];
  public postrecentlogs: any = [];
  public chatroomname: any;

  public selectedFiles: FileList;
  public mtype = 'textmessage';
  public fileType: string;
  public metaData = '';
  public file: any;
  public fileExtenstion: any;
  public fileName: string;
  public filestype: any;
  i = 0;
  public docuerror = false;
  public remainingPercentage: any;
  public extendsionRestriction = '';
  public extendsionRestrictionMessage = '';
  public imageuploadDisabled = false;
  public fileuploadDiabled = false;
  public filesuploaded: any;
  public imageuploaded: any;
  public uploadPercentage: any;
  public filenamearray: any = [];
  public filemessagearray: any = [];
  public filetypearray: any = [];
  public imagenamearray: any = [];
  public imagemessagearray: any = [];
  public imagetypearray: any = [];
  public selectedPostLogo: any;
  public selectedPostName: any;
  public archieve: any;
  public postArray: any = [];
  public postuserentity: any;
  public postusername: any;
  public showUserName = false;
  public sendDisabled: boolean;
  public show = false;
  public isPostVar: any;
  public deleteUserId: any;
  public archivedata = '';
  public showEmojiPicker = false;
  firstTime = true;
  scrolledVal = false;
  loading = true;
  currIndex = 0;
  links: any = [];
  linkdataurl: any;
  linktitle: any;
  linkdescription: any;
  linkimage: any;
  sendmessagedata: {};
  langData: any = { common: '', messagePage: '' };
  @ViewChild('toggleButton') toggleButton: ElementRef;
  @ViewChild('toggleButton1') toggleButton1: ElementRef;
  @ViewChild('menu1') menu1: ElementRef;
  @ViewChild('menu') menu: ElementRef;
  @ViewChild('scrollBottom') scrollBottom: ElementRef;

  ngAfterViewChecked() {
    this.scrollToBottom();
  }

  scrolled(data) {
    this.scrolledVal = true;
  }

  scrollToBottom(): void {
    try {
      if (this.scrollBottom.nativeElement.scrollTop !== this.scrollBottom.nativeElement.scrollHeight && this.scrolledVal === false) {
        this.scrollBottom.nativeElement.scrollTop = this.scrollBottom.nativeElement.scrollHeight;
      }
    } catch (err) { }
  }

  constructor(private router: Router,
    private chatservice: ChatserviceService, private regservice: RegisterService,
    private toastr: ToastrService, private postService: PostService, private language: LanguageService,
    private renderer: Renderer2, private generalService: GeneralService) {
    this.socket = io(environment.url);
    this.receive();
    this.renderer.listen('window', 'click',  (e: Event) => {
      /**
       * Only run when toggleButton is not clicked
       * If we don't check this, all clicks (even on the toggle button) gets into this
       * section which in the result we might never see the menu open!
       * And the menu itself is checked here, and it's where we check just outside of
       * the menu and button the condition abbove must close the menu
       */
      if (this.toggleButton !== undefined && this.menu !== undefined) {
        if (e.target !== this.toggleButton.nativeElement && e.target !== this.menu.nativeElement) {
          this.showthreedotspopup = false;
          this.showEmojiPicker = false;
        }
      }
      if (this.toggleButton1 !== undefined) {
        if (e.target !== this.toggleButton1.nativeElement) {
           this.showEmojiPicker = false;
        }
      }
    });
  }

  ngOnInit() {
    this.generalService.tabActive.next('/messages');
    this.fetchLanguage();
    this.getmypost('message');
    this.selectedDateModel = {
      beginDate: {
        year: this.currentDate.getFullYear(),
        month: this.currentDate.getMonth() + 1,
        day: this.currentDate.getDate()
      }
    };
    this.loginUserId = localStorage.getItem('UserId');
    console.log(this.loginUserId);
    console.log(localStorage.getItem('profileid'));
    console.log(localStorage.getItem('profileurl'));
    if (localStorage.getItem('profileid') !== null) {
      this.profileid = localStorage.getItem('profileid');
      this.sendDisabled = false;
      // this.getrecentlogs();
      this.getuserdetail(this.profileid);
      this.joinroom();
    }
    if (localStorage.getItem('profileid') === null) {
      this.sendDisabled = true;
      // this.getrecentlogs();
    }
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

  receive() {
    this.socket.on('new-message', (res: any) => {
      this.socket.on('callback', function (newmsg) {
        console.log('receive message as new message ', newmsg);
      });
      console.log('response receieve ', res);
      // res.TMESSAGES_Content = res.TMESSAGES_Content.replace(/\n/g, ' ');
      if (res.TMESSAGES_Content.includes('https://') || res.TMESSAGES_Content.includes('http://')) {
        const messageContent = res.TMESSAGES_Content;
        if (messageContent.TMESSAGES_Content.includes('https://') || messageContent.TMESSAGES_Content.includes('http://')) {
          if (messageContent.TMESSAGES_Content.includes('https://') || messageContent.TMESSAGES_Content.includes('http://')) {
            const splitArray = messageContent.split(' ');
            const newsplitArray = messageContent.split('\n');
            console.log('new split array', newsplitArray);
            let overAllContent = '';
            if (newsplitArray.length === 0) {
              for (let j = 0; j < splitArray.length; j++) {
                let anchor = '';
                console.log('split array', splitArray[j]);
                if (splitArray[j].includes('https://') || splitArray[j].includes('http://')) {
                  anchor = '<a href=\'' + splitArray[j] + '\' target=\'_blank\' class=\'text-underline\'>' + splitArray[j] + '</a>';
                } else {
                  anchor = splitArray[j];
                }
                overAllContent = overAllContent + ' ' + anchor;
              }
            } else {
              for (let j = 0; j < newsplitArray.length; j++) {
                let anchor = '';
                const curr = newsplitArray[j].split(' ');
                let anchor2 = '';
                let overAllContent1 = '';
                if (curr.length >= 2) {
                  for (let m = 0; m < curr.length; m++) {
                    if (curr[m].includes('https://') || curr[m].includes('http://')) {
                      console.log('mmm', curr);
                      anchor2 = '<a href=\'' + curr[m] + '\' target=\'_blank\' class=\'text-underline\'>' + curr[m] + '</a>';
                    } else {
                      anchor2 = curr[m];
                    }
                    overAllContent1 = overAllContent1 + ' ' + anchor2;
                  }
                } else if (newsplitArray[j].includes('https://') || newsplitArray[j].includes('http://')) {
                  anchor = '<a href=\'' + newsplitArray[j] + '\' target=\'_blank\' class=\'text-underline\'>' + newsplitArray[j] + '</a>';
                } else {
                  anchor = newsplitArray[j];
                }
                console.log('overallcontent', overAllContent);
                console.log('anchor', overAllContent);
                if (overAllContent === '') {
                  overAllContent = anchor + overAllContent1;
                } else {
                  if (overAllContent1 !== '') {
                    overAllContent = overAllContent + '\n' + anchor + overAllContent1;
                  } else {
                    overAllContent = overAllContent + '\n' + anchor;
                  }
                }
              }
            }
            res.anchorContent = overAllContent;
          }
          res.linktype = 'link';
        }
        // if (res.TMESSAGES_Content.includes('https://')) {
        //   var splitArray = messageContent.split(' ');
        //   var overAllContent = '';
        //   for (let j = 0; j < splitArray.length; j++) {
        //     var anchor = '';
        //     if (splitArray[j].includes('https://')) {
        //       anchor = '<a href=\'' + splitArray[j] + '\' target=\'_blank\' class=\'text-underline\'>' + splitArray[j] + '</a>';
        //     }
        //     else {
        //       anchor = splitArray[j];
        //     }
        //     overAllContent = overAllContent + ' ' + anchor;
        //   }
        //   res.anchorContent = overAllContent;
        // }
        // if (res.TMESSAGES_Content.includes('http://')) {
        //   var splitArray = messageContent.split(' ');
        //   var overAllContent = '';
        //   for (let j = 0; j < splitArray.length; j++) {
        //     var anchor = '';
        //     if (splitArray[j].includes('http://')) {
        //       anchor = '<a href=\'' + splitArray[j] + '\' target=\'_blank\' class=\'text-underline\'>' + splitArray[j] + '</a>';
        //     }
        //     else {
        //       anchor = splitArray[j];
        //     }
        //     overAllContent = overAllContent + ' ' + anchor;
        //   }
        //   res.anchorContent = overAllContent;
        // }
        // res.linktype = 'link';
      }
      this.chatroommesaage.push(res);
      console.log(this.chatroommesaage);
    });
  }

  search() {
    console.log(this.searchparam);
    this.searchlogs(this.searchparam);
    // this.searchlogs1(this.searchparam);
  }

  searchlogs1(search: any) {
    console.log(search);
    const data = {
      'userid': localStorage.getItem('UserId'),
      'search': search,
      'pagenumber': 1,
      'pagesize': 50
    };
    console.log(data);
    this.chatservice.searchMessage(data).subscribe(res => {
      console.log(res);
    });
  }

  searchlogs(search: any) {
    console.log(this.showpostlist);
    if (this.showpostlist) {
      this.getPostRecentLogs(localStorage.getItem('userofPostid'));
    } else {
      const data = {
        'userid': localStorage.getItem('UserId'),
        'search': search,
        'pagenumber': 1,
        'pagesize': 50,
        'archiveList': 0,
        'postId': this.postArray
      };
      console.log(' recent logs ', data);
      this.chatservice.myrecentlogs(data).subscribe(res => {
        console.log(res);
        if (res && res['statusCode'] === 200) {
          this.recentlogs = res['data'];
          console.log(this.recentlogs);
          if (this.recentlogs.length >= 1) {
            console.log('if length 1');
            this.archievetype = this.recentlogs[0].TChat_Log_IS_Archive;
            this.mutetype = this.recentlogs[0].TChat_Log_Is_Mute;
          }

          if (this.recentlogs.length > 0 && this.recentlogs[0].HCHAT_ROOM_Is_Post === 0) {
            console.log('profile id null ', this.recentlogs.length);
            this.postusername = '';
            let firstuserid = this.recentlogs[0].dn_id;
            let firstchatid = this.recentlogs[0].TChat_Log_Chat_Room_ID;
            this.deleteUserId = this.recentlogs[0].dn_id;
            this.getuserdetail(firstuserid);
            this.getChatRoomMessages(firstchatid, firstuserid);
          }
          if (this.recentlogs.length > 0 && this.recentlogs[0].HCHAT_ROOM_Is_Post === 1) {
            localStorage.setItem('userofPostid', this.recentlogs[0].dn_postid);
            if (this.recentlogs[0].dc_post_created_by !== this.loginUserId) {
              this.archivedata = localStorage.getItem('UserId');
              this.showUserName = true;
              this.deleteUserId = this.recentlogs[0].dn_postid;
              this.getPostUserName(this.recentlogs[0].dc_post_created_by);
              this.chatroomname = this.recentlogs[0].dc_post_name;
            }
            if (this.recentlogs[0].dc_post_created_by === this.loginUserId) {
              this.archivedata = '';
              this.showUserName = true;
              this.deleteUserId = this.recentlogs[0].dn_id;
              this.chatroomname = this.recentlogs[0].dc_first_name + ' ' + this.recentlogs[0].dc_last_name;
              this.postusername = '(' + this.recentlogs[0].dc_post_name + ')';
            }
            let firstuserid = this.recentlogs[0].dn_postid;
            let firstchatid = this.recentlogs[0].TChat_Log_Chat_Room_ID;
            // this.getuserdetail(firstuserid);
            this.getChatRoomMessages(firstchatid, firstuserid);
          }
          if (this.recentlogs.length === 0) {
            this.chatroomname = '';
            this.postusername = '';
            this.chatroommesaage = [];
            this.toastr.error('No result found ');
          }
        }
      });
    }
    this.searchparam = '';
  }

  getrecentlogs() {
    this.loading = true;
    console.log('recent logs');
    this.postusername = '';
    this.chatroomname = '';
    const data = {
      'userid': localStorage.getItem('UserId'),
      'search': '',
      'pagenumber': 1,
      'pagesize': 50,
      'archiveList': 0,
      'postId': this.postArray
    };
    console.log('recent logs data', data);
    this.chatservice.myrecentlogs(data).subscribe(res => {
      if (res && res['statusCode'] === 200) {
        this.recentlogs = res['data'];
        console.log(this.recentlogs);
        if (this.recentlogs.length >= 1) {
          this.currIndex = 0;
          this.sendDisabled = false;
          console.log('if length 1');
          if (localStorage.getItem('chatroomname') == null) {
            localStorage.setItem('chatroomname', this.recentlogs[0].HCHAT_ROOM_Name);
          }
          this.isPostVar = this.recentlogs[0].HCHAT_ROOM_Is_Post;
          if (this.recentlogs[0].HCHAT_ROOM_Is_Post === 1) {
            localStorage.setItem('userofPostid', this.recentlogs[0].dn_postid);
            if (this.recentlogs[0].dc_post_created_by !== this.loginUserId) {
              this.archivedata = localStorage.getItem('UserId');
              this.deleteUserId = this.recentlogs[0].dn_postid;
            }
            if (this.recentlogs[0].dc_post_created_by === this.loginUserId) {
              this.archivedata = '';
              this.deleteUserId = this.recentlogs[0].dn_id;
            }
          } else {
            this.archivedata = '';
            this.deleteUserId = this.recentlogs[0].dn_id;
          }
          this.archievetype = this.recentlogs[0].TChat_Log_IS_Archive;
          this.mutetype = this.recentlogs[0].TChat_Log_Is_Mute;
          if (this.recentlogs[0].HCHAT_ROOM_Is_Post === 1 && localStorage.getItem('profileurl') !== 'view-profile') {
            localStorage.removeItem('profileid');
          }
        }
        console.log(localStorage.getItem('profileid'));
        console.log(localStorage.getItem('profileurl'));
        if (localStorage.getItem('profileid') !== null) {
          console.log('profile id not null jjjjjjjjjjjjjjjjjjjjj', localStorage.getItem('profileid'));
          this.getuserdetail(localStorage.getItem('profileid'));
          this.getChatRoomMessages(localStorage.getItem('chatroomid'), localStorage.getItem('profileid'));
        }

        if (localStorage.getItem('profileid') == null && this.recentlogs.length > 0 && this.recentlogs[0].HCHAT_ROOM_Is_Post === 0) {
          console.log('profile id null , 1st if............', this.recentlogs.length);
          let firstuserid = this.recentlogs[0].dn_id;
          let firstchatid = this.recentlogs[0].TChat_Log_Chat_Room_ID;
          this.postusername = '';
          this.getuserdetail(firstuserid);
          this.getChatRoomMessages(firstchatid, firstuserid);
        }
        if (localStorage.getItem('profileid') == null && this.recentlogs.length > 0 && this.recentlogs[0].HCHAT_ROOM_Is_Post === 1) {
          console.log('2nd if', this.recentlogs[0].dc_post_name);
          if (this.recentlogs[0].dc_post_created_by !== this.loginUserId) {
            this.showUserName = true;
            this.getPostUserName(this.recentlogs[0].dc_post_created_by);
            this.chatroomname = this.recentlogs[0].dc_post_name;
            this.archivedata = localStorage.getItem('UserId');
            this.deleteUserId = this.recentlogs[0].dn_postid;
            let firstuserid = this.recentlogs[0].dn_postid;
            let firstchatid = this.recentlogs[0].TChat_Log_Chat_Room_ID;
            this.getChatRoomMessages(firstchatid, firstuserid);
          }
          if (this.recentlogs[0].dc_post_created_by === this.loginUserId) {
            this.showUserName = true;
            this.chatroomname = this.recentlogs[0].dc_first_name + ' ' + this.recentlogs[0].dc_last_name;
            this.postusername = '(' + this.recentlogs[0].dc_post_name + ')';
            this.archivedata = '';
            this.deleteUserId = this.recentlogs[0].dn_id;
            let firstuserid = this.recentlogs[0].dn_id;
            let firstchatid = this.recentlogs[0].TChat_Log_Chat_Room_ID;
            this.getChatRoomMessages(firstchatid, firstuserid);
          }
        }
        if (this.recentlogs.length === 0) {
          this.loading = false;
          this.chatroomname = '';
          this.postusername = '';
          if (localStorage.getItem('profileid') !== null) {
            this.sendDisabled = false;
          } else {
            this.sendDisabled = true;
            // this.toastr.error('No Conversation started yet');
          }
        }
      } else {
        this.loading = false;
      }
    });
    console.log('recent log end ', this.chatroomname);
  }

  getPostUserName(postuserid: any) {
    this.postService.getViewData(postuserid).subscribe(res => {
      if (res && res['status'] && res['status']['status'] === 200) {
        this.postuserentity = res['entity']['userprofile'];
        if (this.postuserentity['firstname'] != null && this.postuserentity['lastname'] != null) {
          this.postusername = '(' + this.postuserentity['firstname'] + ' ' + this.postuserentity['lastname'] + ')';
        }
        if (this.postuserentity['firstname'] != null && this.postuserentity['lastname'] == null) {
          this.postusername = '(' + this.postuserentity['firstname'] + ')';
        }
        if (this.postuserentity['firstname'] == null && this.postuserentity['lastname'] != null) {
          this.postusername = '(' + this.postuserentity['lastname'] + ')';
        }
      }
    });
  }

  getuserdetail(profid: any) {
    this.profileid = profid;
    this.regservice.userDetails(this.profileid).subscribe(res => {
      if (res && res['status'] && res['status']['status'] === 200) {
        this.userdetail = res['entity'];
        if (this.userdetail && this.userdetail.userprofile) {
          if (this.userdetail.userprofile.firstname != null && this.userdetail.userprofile.lastname != null) {
            this.chatroomname = this.userdetail.userprofile.firstname + ' ' + this.userdetail.userprofile.lastname;
          }
          if (this.userdetail.userprofile.firstname != null && this.userdetail.userprofile.lastname == null) {
            this.chatroomname = this.userdetail.userprofile.firstname;
          }
          if (this.userdetail.userprofile.firstname == null && this.userdetail.userprofile.lastname != null) {
            this.chatroomname = this.userdetail.userprofile.lastname;
          }
        }
      }
    });
  }

  joinroom() {
    console.log('join room in message');
    const data = {
      senderId: localStorage.getItem('UserId'),
      receiverId: localStorage.getItem('profileid')
    };
    console.log(data);
    this.socket.emit('join-user-chat', data, function (resp, err) {
      console.log(resp, err);
    });
    this.socket.on('get-room-id', function (res: any) {
      console.log('on', res);
      localStorage.setItem('chatroomid', res['chatRoomId']);
      localStorage.setItem('chatroomname', res['roomname']);
      console.log('saved room id ', localStorage.getItem('chatroomid'));
      this.chatroomdetail = res;
    });
    if (this.chatroomdetail) {
      this.getChatRoomMessages(localStorage.getItem('chatroomid'), localStorage.getItem('profileid'));
    }
  }

  getChatRoomMessage(recent: any, type: any, index?) {
    this.loading = true;
    if (index !== undefined) {
      this.recentlogs[index].Unread_msg_count = 0;
      this.currIndex = index;
    }
    this.isPostVar = recent.HCHAT_ROOM_Is_Post;
    localStorage.setItem('chatroomname', recent.HCHAT_ROOM_Name);
    localStorage.setItem('mutetype', recent.TChat_Log_Is_Mute);
    this.mutetype = localStorage.getItem('mutetype');
    localStorage.setItem('archievetype', recent.TChat_Log_IS_Archive);
    this.archievetype = localStorage.getItem('archievetype');

    if (type === 'profile') {
      if (recent.HCHAT_ROOM_Is_Post === 0) {
        console.log(' if profile', this.chatroomname, this.postusername);
        this.deleteUserId = recent.dn_id;
        this.showUserName = false;
        this.getChatRoomMessages(recent.TChat_Log_Chat_Room_ID, recent.dn_id);
      }
      if (recent.HCHAT_ROOM_Is_Post === 1) {
        console.log('2nd if');
        this.showUserName = true;
        localStorage.setItem('userofPostid', recent.dn_postid);
        if (recent.dc_post_created_by !== this.loginUserId) {
          this.archivedata = localStorage.getItem('UserId');
          this.postusername = '';
          this.deleteUserId = recent.dn_postid;
          this.chatroomname = recent.dc_post_name;
          this.getPostUserName(recent.dc_post_created_by);
          this.getChatRoomMessages(recent.TChat_Log_Chat_Room_ID, recent.dn_postid);
        }
        if (recent.dc_post_created_by === this.loginUserId) {
          this.archivedata = '';
          this.deleteUserId = recent.dn_id;
          this.chatroomname = recent.dc_first_name + ' ' + recent.dc_last_name;
          this.postusername = '(' + recent.dc_post_name + ')';
          this.getChatRoomMessages(recent.TChat_Log_Chat_Room_ID, recent.dn_id);
        }
        // this.getChatRoomMessages(recent.TChat_Log_Chat_Room_ID, recent.dn_postid);
      }
    }
    if (type === 'post') {
      this.deleteUserId = recent.dn_id;
      this.postusername = '';
      this.getChatRoomMessages(recent.TChat_Log_Chat_Room_ID, recent.dn_id);
    }
  }

  getChatRoomMessages(roomid: any, userid: any) {
    console.log('get room message roomm mess', this.chatroomname, this.postusername);
    this.socketConnection(userid);
    // this.postusername = '';
    localStorage.setItem('receiverId', userid);
    localStorage.setItem('chatroomid', roomid);
    console.log(this.showpostlist);

    localStorage.setItem('profileid', userid);
    this.getuserdetail(userid);
    const data = {
      'chatroomid': roomid,
      'userid': userid,
      'loginUserId': localStorage.getItem('UserId'),
      'pagenumber': 1,
      'pagesize': 150,
      'search': ''
    };
    if (this.recentlogs[this.currIndex] !== undefined) {
      if (this.recentlogs[this.currIndex].HCHAT_ROOM_Is_Post === 1) {
        if (this.recentlogs[this.currIndex].dc_post_created_by === this.loginUserId) {
          data.loginUserId = this.recentlogs[this.currIndex].dn_postid;
        }
      }
    }
    console.log('getChatRoomMessages data ', data);
    this.chatservice.chatroomMessages(data).subscribe(res => {
      console.log('original data', res);
      if (res && res['statusCode'] === 200) {
        this.loading = false;
        localStorage.removeItem('profileid');
        this.chatroommesaage = res['data']['message'];
        if (this.chatroommesaage) {
          for (let i = 0; i < this.chatroommesaage.length; i++) {
            console.log('messagecontent', this.chatroommesaage[i].TMESSAGES_Content);
            if (this.chatroommesaage[i].TMESSAGES_Content.includes('https://') || this.chatroommesaage[i].TMESSAGES_Content.includes('http://')) {
              // this.chatroommesaage[i].TMESSAGES_Content = this.chatroommesaage[i].TMESSAGES_Content.replace(/\n/g, ' ');
              const messageContent = this.chatroommesaage[i].TMESSAGES_Content;
              if (this.chatroommesaage[i].TMESSAGES_Content.includes('https://') || this.chatroommesaage[i].TMESSAGES_Content.includes('http://')) {
                const splitArray = messageContent.split(' ');
                const newsplitArray = messageContent.split('\n');
                console.log('new split array', newsplitArray);
                let overAllContent = '';
                if (newsplitArray.length === 0) {
                  for (let j = 0; j < splitArray.length; j++) {
                    let anchor = '';
                    if (splitArray[j].includes('https://') || splitArray[j].includes('http://')) {
                      anchor = '<a href=\'' + splitArray[j] + '\' target=\'_blank\' class=\'text-underline\'>' + splitArray[j] + '</a>';
                    } else {
                      anchor = splitArray[j];
                    }
                    overAllContent = overAllContent + ' ' + anchor;
                  }
                } else {
                  for (let j = 0; j < newsplitArray.length; j++) {
                    let anchor = '';
                    const curr = newsplitArray[j].split(' ');
                    let anchor2 = '';
                    let overAllContent1 = '';
                    if (curr.length >= 2) {
                      for (let m = 0; m < curr.length; m++) {
                        if (curr[m].includes('https://') || curr[m].includes('http://')) {
                          console.log('mmm', curr);
                          anchor2 = '<a href=\'' + curr[m] + '\' target=\'_blank\' class=\'text-underline\'>' + curr[m] + '</a>';
                        } else {
                          anchor2 = curr[m];
                        }
                        overAllContent1 = overAllContent1 + ' ' + anchor2;
                      }
                    } else if (newsplitArray[j].includes('https://') || newsplitArray[j].includes('http://')) {
                      anchor = '<a href=\'' + newsplitArray[j] + '\' target=\'_blank\' class=\'text-underline\'>' + newsplitArray[j] + '</a>';
                    } else {
                      anchor = newsplitArray[j];
                    }
                    console.log('overallcontent', overAllContent);
                    console.log('anchor', overAllContent);
                    if (overAllContent === '') {
                      overAllContent = anchor + overAllContent1;
                    } else {
                      if (overAllContent1 !== '') {
                        overAllContent = overAllContent + '\n' + anchor + overAllContent1;
                      } else {
                        overAllContent = overAllContent + '\n' + anchor;
                      }
                    }
                  }
                }
                this.chatroommesaage[i].anchorContent = overAllContent;
              }
              this.chatroommesaage[i].linktype = 'link';
            } else {
              console.log('with \n');
              console.log(this.chatroommesaage[i].TMESSAGES_Content);
            }
          }
          console.log(this.chatroommesaage);
        }
        this.scrolledVal = false;
        this.scrollToBottom();
      } else {
        this.loading = false;
        this.chatroommesaage = [];
      }
    });
    console.log('roomm message end', this.chatroomname);
  }

  uploadfile(filetype: any) {
    this.filestype = filetype;
    if (this.filestype === 1) {
      document.getElementById('customFile1').click();
    }
    if (this.filestype === 2) {
      document.getElementById('customFile2').click();
    }
  }

  fileChangeEvent(files: any, filetype: any) {
    console.log(files.length);
    const fileLength = this.imagearray.length + this.filearray.length;
    console.log('fileLength ', fileLength);

    if (fileLength <= 6) {
      this.filestype = filetype;
      this.selectedFiles = files;
      const file = this.selectedFiles;

      if (file[0].type !== '') {
        this.fileType = file[0].type.split('/')[0];
        if (this.fileType === 'application') {
          this.fileType = file[0].type.split('/')[1];
        }
      } else {
        this.fileType = file[0].name.split('.')[1];
      }

      if (filetype === 1 && this.imagearray.length === 3) {
        this.showError('Only 3 Images allowed');
        this.imageuploadDisabled = true;
      }

      if (filetype === 2 && this.filearray.length === 3) {
        this.showError('Only 3 documents allowed');
        this.fileuploadDiabled = true;
      }

      if (file && file.length > 0) {
        console.log(this.i);
        console.log(file.length);

        if (this.i >= file.length) {
          this.i = 0;
          if (this.docuerror) {
            const sizemessage = '';
            let extnmessage = '';
            if (this.extendsionRestriction) {
              extnmessage = this.extendsionRestriction + 'invalid file format ';
            }
            this.extendsionRestrictionMessage = extnmessage + sizemessage;
            setTimeout(() => {
              this.extendsionRestriction = '';
              this.extendsionRestrictionMessage = '';
            }, 5000);
          }
          return;
        }
        const checkValidFile = this.getCredential(file[this.i]);
        let validation = false;
        if (filetype === 1) {
          if (((checkValidFile.fileExtenstion.toLowerCase() === 'image') || (checkValidFile.fileExtenstion.toLowerCase()) === '.png' ||
            (checkValidFile.fileExtenstion.toLowerCase()) === '.jpg' || (checkValidFile.fileExtenstion.toLowerCase()) === '.jpeg')) {
            console.log(checkValidFile.fileExtenstion.toLowerCase(), 'extension');
            validation = true;
          }
        } else if (filetype === 2) {
          if (((checkValidFile.fileExtenstion.toLowerCase() === '.docx') || (checkValidFile.fileExtenstion.toLowerCase()) === '.doc' ||
            (checkValidFile.fileExtenstion.toLowerCase()) === '.rtf') || (checkValidFile.fileExtenstion.toLowerCase()) === '.pdf' ||
            (checkValidFile.fileExtenstion.toLowerCase()) === '.xls' || (checkValidFile.fileExtenstion.toLowerCase()) === '.xlsx') {
            console.log(checkValidFile.fileExtenstion.toLowerCase(), 'extension');
            validation = true;
          }
        }

        if (validation) {
          const params = this.getParams(file[this.i], checkValidFile);
          const key = params.Key;
          if (filetype === 1 && this.imagearray.length < 3) {
            this.imagearray.push({
              id: '',
              documentoriginalname: checkValidFile.fileName,
              extension: checkValidFile.fileExtenstion,
              percentage: 0,
              filetype: filetype,
              uploaddoc: key
            });
            this.awsUploadImage(file[this.i], params, this.imagearray.length, filetype);
          }
          this.imageuploaded = this.imagearray.length;

          if (filetype === 2 && this.filearray.length < 3) {
            this.filearray.push({
              id: '',
              documentoriginalname: checkValidFile.fileName,
              extension: checkValidFile.fileExtenstion,
              percentage: 0,
              filetype: filetype,
              uploaddoc: key
            });
            this.awsUploadFile(file[this.i], params, this.filearray.length, filetype);
          }
          this.filesuploaded = this.filearray.length;
        } else {
          this.docuerror = true;
          this.extendsionRestriction += '.' + checkValidFile.fileExtenstion + ' ';
          if (filetype === 1) {
            this.showError('Upload Images only');
          } else if (filetype === 2) {
            this.showError('Upload PDF, EXCEL, WORD documents only');
          }
          this.fileChangeEvent(this.selectedFiles, filetype);
        }
      } else {
        this.i = 0;
      }
    } else {
      this.showError('Upload not more than 6 Attachments');
    }
  }

  showError(showError) {
    this.toastr.clear();
    this.toastr.error(showError);
  }

  awsUploadFile(file: any, params: any, i: any, filetype: any) {
    AWS.config.region = environment.awsRegion;
    AWS.config.credentials = new AWS.CognitoIdentityCredentials({
      IdentityPoolId: environment.awsIdentityPoolId
    });
    if (file) {
      const Obj = this;
      const bucket = new S3({ params: { Bucket: params.Bucket } });
      bucket.upload(params).on('httpUploadProgress', function (evt) {
        Obj.uploadPercentage = ((evt.loaded * 100) / (+evt.total));
        Obj.progressBarValue(Obj.uploadPercentage, i, filetype);
      }).send(function (err: any, response: any) {
        console.log(response);
      });
    }
  }

  awsUploadImage(file: any, params: any, i: any, filetype: any) {
    AWS.config.region = environment.awsRegion;
    AWS.config.credentials = new AWS.CognitoIdentityCredentials({
      IdentityPoolId: environment.awsIdentityPoolId
    });
    if (file) {
      const Obj = this;
      const bucket = new S3({ params: { Bucket: params.Bucket } });
      bucket.upload(params).on('httpUploadProgress', function (evt) {
        Obj.uploadPercentage = ((evt.loaded * 100) / (+evt.total));
        Obj.progressBarValue(Obj.uploadPercentage, i, filetype);
      }).send(function (err: any, response: any) {
        console.log(response);
      });
    }
  }

  private getCredential(file: any) {
    const extenstion = file.name.slice(file.name.lastIndexOf('.'));
    this.fileName = file.name;
    this.fileExtenstion = extenstion;
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

  progressBarValue(percentage: any, i: any, filetype: any) {
    this.remainingPercentage = percentage;
    if (filetype === 1) {
      this.imagearray[i - 1].percentage = this.remainingPercentage;
      if (this.imagearray[i - 1].percentage === 100) {
        this.i += 1;
        this.fileChangeEvent(this.selectedFiles, this.filestype);
      }
    }

    if (filetype === 2) {
      this.filearray[i - 1].percentage = this.remainingPercentage;
      if (this.filearray[i - 1].percentage === 100) {
        this.i += 1;
        this.fileChangeEvent(this.selectedFiles, this.filestype);
      }
    }
  }

  removeDocument(id: any) {
    this.i = 0;
    this.filearray.splice(id, 1);
    this.filesuploaded = this.filearray.length;
    if (this.filearray.length > 3) {
      this.fileuploadDiabled = true;
    } else {
      this.fileuploadDiabled = false;
    }
  }

  removeImage(id: any) {
    this.i = 0;
    this.imagearray.splice(id, 1);
    this.imageuploaded = this.imagearray.length;
    if (this.imagearray.length > 3) {
      this.imageuploadDisabled = true;
    } else {
      this.imageuploadDisabled = false;
    }
  }

  send() {
    this.loading = true;
    console.log('messs', this.message);
    console.log('this.message ', this.message.trim(), this.message.trim().length, this.message.length);
    if (this.message !== undefined && this.message !== '' && this.message !== null) {
      if (this.message.trim().length > 0) {
        this.sendMessage(this.message);
      } else {
        this.loading = false;
        this.toastr.error('Enter the valid message content');
        this.message = this.message.trim();
      }
    }
    if (this.filearray.length > 0) {
      for (let i = 0; i < this.filearray.length; i++) {
        this.filenamearray.push(this.filearray[i].documentoriginalname);
        this.filemessagearray.push(this.cloudeURL + this.filearray[i].uploaddoc);
        this.filetypearray.push(this.filearray[i].extension.split('.')[1]);
      }
      this.sendattachedFileMessage(this.filenamearray, this.filemessagearray, this.filetypearray);
    }
    if (this.imagearray.length > 0) {
      for (let j = 0; j < this.imagearray.length; j++) {
        this.imagenamearray.push(this.imagearray[j].documentoriginalname);
        this.imagemessagearray.push(this.cloudeURL + this.imagearray[j].uploaddoc);
        this.imagetypearray.push(this.imagearray[j].extension.split('.')[1]);
      }
      this.sendattachedImageMessage(this.imagenamearray, this.imagemessagearray, this.imagetypearray);
    }

  }

  sendMessage(msg) {
    this.message = msg;
    const fromDate = this.chkLength(this.selectedDateModel.beginDate.year) + '-' + this.chkLength(this.selectedDateModel.beginDate.month) + '-' + this.chkLength(this.selectedDateModel.beginDate.day) + ' ' + this.chkLength(this.currentDate.getHours()) + ':' + this.chkLength(this.currentDate.getMinutes()) + ':' + this.chkLength(this.currentDate.getSeconds());
    const utcfromdate = moment.utc(new Date(fromDate)).format('YYYY-MM-DD HH:mm:ss');
    let data = {};

    if (this.message !== undefined && this.message !== '' && this.message !== null) {
      console.log('here mess', this.message);
      if (this.recentlogs[this.currIndex] !== undefined) {
        data = {
          roomname: localStorage.getItem('chatroomname'),
          chatRoomId: localStorage.getItem('chatroomid'),
          hasMsg: true,
          msgTime: utcfromdate,
          isGroup: false,
          isBroad: false,
          userId: localStorage.getItem('UserId'),
          msg: this.message,
          recent: this.recentlogs[this.currIndex],
          istype: 'text',
          filename: '',
        };
      } else {
        data = {
          roomname: localStorage.getItem('chatroomname'),
          chatRoomId: localStorage.getItem('chatroomid'),
          hasMsg: true,
          msgTime: utcfromdate,
          isGroup: false,
          isBroad: false,
          userId: localStorage.getItem('UserId'),
          msg: this.message,
          recent: { HCHAT_ROOM_Is_Post : 0, dn_id : localStorage.getItem('receiverId'), dc_first_name : this.userdetail.userprofile.firstname, dc_last_name : this.userdetail.userprofile.lastname},
          istype: 'text',
          filename: '',
        };
      }
      console.log('sending message data ', data);
      this.socket.emit('send-message', data);
    }
    this.message = '';
    this.getChatRoomMessages(localStorage.getItem('chatroomid'), localStorage.getItem('profileid'));
    this.getrecentlogs();
  }

  chkLength(data: any) {
    if (data.toString().length === 1) {
      return '0' + data.toString();
    } else {
      return data;
    }
  }

  convertutctolocal(value): string {
    const time = value.toString().split('T');
    return this.setLocaldatetime(time[0], time[1]);
  }

  setLocaldatetime(date, time2): string {
    const timeobj = time2.split(':');
    const time1 = timeobj[0] + ':' + timeobj[1] + ':00';
    let now_utc1 = '0';
    let local;
    if (date && time1) {
      const now1 = new Date(date + ' ' + time1);
      local = moment(now1).subtract(this.currentDate.getTimezoneOffset(), 'm').toDate();
      now_utc1 = local.getFullYear() + '-' + this.chkLength((local.getMonth() + 1)) + '-' + this.chkLength(local.getDate()) + ' ' + this.chkLength((local.getHours())) + ':' + this.chkLength(local.getMinutes());
    }
    return now_utc1;
  }

  sendattachedFileMessage(filename: any, filemsg: any, filetype: any) {
    this.filenamearray = filename;
    this.filemessagearray = filemsg;
    this.filetypearray = filetype;
    const fromDate = this.chkLength(this.selectedDateModel.beginDate.year) + '-' + this.chkLength(this.selectedDateModel.beginDate.month) + '-' + this.chkLength(this.selectedDateModel.beginDate.day) + ' ' + this.chkLength(this.currentDate.getHours()) + ':' + this.chkLength(this.currentDate.getMinutes()) + ':' + this.chkLength(this.currentDate.getSeconds());
    const utcfromdate = moment.utc(new Date(fromDate)).format('YYYY-MM-DD HH:mm:ss');
    for (let i = 0; i < this.filenamearray.length; i++) {
      console.log('if');
      const data = {
        roomname: localStorage.getItem('chatroomname'),
        chatRoomId: localStorage.getItem('chatroomid'),
        hasMsg: false,
        hasFile: true,
        msgTime: utcfromdate,
        isGroup: false,
        userId: localStorage.getItem('UserId'),
        msg: this.filemessagearray[i],
        istype: this.filetypearray[i],
        filename: this.filenamearray[i]
      };
      console.log('sending message data ', data);
      this.socket.emit('send-message', data);
    }
    this.filenamearray = [];
    this.filemessagearray = [];
    this.filetypearray = [];
    this.filearray = [];
    this.message = '';
    this.getChatRoomMessages(localStorage.getItem('chatroomid'), localStorage.getItem('profileid'));
    this.getrecentlogs();
  }

  sendattachedImageMessage(imagename, imagemsg, imagetype) {
    this.imagenamearray = imagename;
    this.imagemessagearray = imagemsg;
    this.imagetypearray = imagetype;
    const fromDate = this.chkLength(this.selectedDateModel.beginDate.year) + '-' + this.chkLength(this.selectedDateModel.beginDate.month) + '-' + this.chkLength(this.selectedDateModel.beginDate.day) + ' ' + this.chkLength(this.currentDate.getHours()) + ':' + this.chkLength(this.currentDate.getMinutes()) + ':' + this.chkLength(this.currentDate.getSeconds());
    const utcfromdate = moment.utc(new Date(fromDate)).format('YYYY-MM-DD HH:mm:ss');
    for (let i = 0; i < this.imagenamearray.length; i++) {
      const data = {
        roomname: localStorage.getItem('chatroomname'),
        chatRoomId: localStorage.getItem('chatroomid'),
        hasMsg: false,
        hasFile: true,
        msgTime: utcfromdate,
        isGroup: false,
        userId: localStorage.getItem('UserId'),
        msg: this.imagemessagearray[i],
        istype: this.imagetypearray[i],
        filename: this.imagenamearray[i]
      };
      console.log('sending message data ', data);
      this.socket.emit('send-message', data);
    }

    this.imagenamearray = [];
    this.imagemessagearray = [];
    this.imagetypearray = [];
    this.imagearray = [];
    this.message = '';
    console.log(localStorage.getItem('chatroomid'));
    console.log(localStorage.getItem('profileid'));
    this.getChatRoomMessages(localStorage.getItem('chatroomid'), localStorage.getItem('profileid'));
    this.getrecentlogs();
  }

  sendattachedMessage(msgtype: any, messagecontent: any, filename: any) {
    this.message = messagecontent;
    this.filename = filename;
    const fromDate = this.chkLength(this.selectedDateModel.beginDate.year) + '-' + this.chkLength(this.selectedDateModel.beginDate.month) + '-' + this.chkLength(this.selectedDateModel.beginDate.day) + ' ' + this.chkLength(this.currentDate.getHours()) + ':' + this.chkLength(this.currentDate.getMinutes()) + ':' + this.chkLength(this.currentDate.getSeconds());
    const utcfromdate = moment.utc(new Date(fromDate)).format('YYYY-MM-DD HH:mm:ss');
    if (this.message !== undefined && this.message !== '' && this.message !== null) {
      const data = {
        chatRoomId: localStorage.getItem('chatroomid'),
        hasMsg: false,
        hasFile: true,
        msgTime: utcfromdate,
        isGroup: false,
        userId: localStorage.getItem('UserId'),
        msg: this.message,
        istype: msgtype,
        filename: this.filename
      };
      console.log('sending message data ', data);
      this.socket.emit('send-message', data);
    }
    this.message = '';
    this.getChatRoomMessages(localStorage.getItem('chatroomid'), localStorage.getItem('profileid'));
    this.getrecentlogs();
  }

  getmypost(type: any) {
    this.toastr.clear();
    this.show = !this.show;
    this.postArray = [];
    let params = new HttpParams();
    params = params.append('userid', this.loginUserId);
    this.postService.getMyPostForMessage(params.toString()).subscribe((postRes) => {
      if (postRes && postRes != null) {
        this.postlist = postRes['entity'];
        for (let i = 0; i < this.postlist.length; i++) {
          this.postArray.push(this.postlist[i].postid);
        }
        if (this.postArray.length === this.postlist.length) {
          for (let i = 0; i < this.postlist.length; i++) {
            this.postlist[i].totalcount = 0;
            const data = {
              'userid': '',
              'search': '',
              'pagenumber': 1,
              'pagesize': 50,
              'archiveList': 0,
              'postId': this.postlist[i].postid
            };
            this.chatservice.myrecentlogs1(data).subscribe(res => {
              this.postlist[i].totalcount = res['data'].length;
            });
          }
        }
        if (!this.showpostlist) {
          this.getrecentlogs();
        }
      } else {
        this.toastr.clear();
        if (type === 'post') {
          setTimeout(() => {
            this.toastr.error('No post For Communication');
          }, 10000);
        }
        this.getrecentlogs();
      }
    });
    console.log('my post end ', this.chatroomname);
  }

  toggleEmojiPicker() {
    this.showEmojiPicker = !this.showEmojiPicker;
  }

  addEmoji(event) {
    const { message } = this;
    const text = `${message}${event.emoji.native}`;
    this.message = text;
    this.showEmojiPicker = false;
  }

  clickFilter() {
    // this.show = !this.show;
    // this.getmypost('');
    this.filterlistspopup = !this.filterlistspopup;
  }

  allFilter() {
    this.filterlistspopup = false;
    this.showpostlist = false;
    localStorage.removeItem('profileid');
    this.getrecentlogs();
  }

  getUserOfPost(post) {
    this.postusername = '';
    this.filterlistspopup = false;
    this.showpostlist = true;
    this.selectedPostLogo = post.postlogo;
    this.selectedPostName = post.postname;
    localStorage.setItem('userofPostid', post.postid);
    this.getPostRecentLogs(post.postid);
  }

  getPostRecentLogs(postid: any) {
    this.loading = true;
    const data = {
      'userid': '',
      'search': this.searchparam ? this.searchparam : '',
      'pagenumber': 1,
      'pagesize': 50,
      'archiveList': 0,
      'postId': postid
    };
    console.log('Post recent logs ', data);

    this.chatservice.myrecentlogs(data).subscribe(res => {
      if (res && res['statusCode'] === 200) {
        this.postrecentlogs = res['data'];
        console.log(this.postrecentlogs);
        if (this.postrecentlogs && this.postrecentlogs.length > 0) {
          this.currIndex = 0;
          if (localStorage.getItem('chatroomname') !== null) {
            localStorage.removeItem('chatroomname');
            localStorage.setItem('chatroomname', this.postrecentlogs[0].HCHAT_ROOM_Name);
          }
          this.archievetype = this.postrecentlogs[0].TChat_Log_IS_Archive;
          this.mutetype = this.postrecentlogs[0].TChat_Log_Is_Mute;
          this.deleteUserId = this.postrecentlogs[0].dn_id;
          console.log('profile id null ', this.postrecentlogs.length);
          let firstuserid = this.postrecentlogs[0].dn_id;
          let firstchatid = this.postrecentlogs[0].TChat_Log_Chat_Room_ID;
          console.log('firstuserid ', firstuserid);

          this.getuserdetail(firstuserid);
          this.getChatRoomMessages(firstchatid, firstuserid);
        }
        if (this.postrecentlogs.length === 0) {
          console.log('00000000000000');
          this.loading = false;
          this.chatroomname = '';
          this.postusername = '';
          this.chatroommesaage = [];
          this.toastr.error('No result found ');
        }
      } else {
        this.loading = false;
      }
    });
  }

  clickThreeDots(value) {
    this.showthreedotspopup = !this.showthreedotspopup;
  }

  archive(roomid: any) {
    this.loading = true;
    console.log(roomid);
    console.log(this.showpostlist);
    console.log(localStorage.getItem('userofPostid'));

    if (this.archievetype === 0) {
      this.archieve = 1;
    }

    if (this.archievetype === 1) {
      this.archieve = 0;
    }
    this.showthreedotspopup = false;
    console.log(localStorage.getItem('profileid'));
    let data = {};
    if (this.showpostlist) {
      data = {
        'roomId': roomid,
        'userId': localStorage.getItem('userofPostid'),
        'isArchive': this.archieve
      };
      console.log(data);
      this.chatservice.archiveChat(data).subscribe(res => {
        console.log(res);
        this.loading = false;
        if (res) {
          console.log('if post');
          this.getPostRecentLogs(localStorage.getItem('userofPostid'));
        }
      });
    } else {
      console.log('archive else');
      console.log('this.isPostVar ', this.isPostVar);
      if (this.isPostVar === 0) {
        data = {
          'roomId': roomid,
          'userId': localStorage.getItem('UserId'),
          'isArchive': this.archieve
        };
      } else if (this.isPostVar === 1) {
        if (this.archivedata === '') {
          data = {
            'roomId': roomid,
            'userId': localStorage.getItem('userofPostid'),
            'isArchive': this.archieve
          };
        } else {
          data = {
            'roomId': roomid,
            'userId': this.archivedata,
            'isArchive': this.archieve
          };
        }
      }
      console.log(data);
      localStorage.removeItem('profileid');
      console.log(localStorage.getItem('UserId'));
      this.chatservice.archiveChat(data).subscribe(res => {
        this.loading = false;
        console.log(res);
        if (res) {
          this.getrecentlogs();
        }
      });
    }
    // this.getmypost('');
  }

  listArchieve() {
    this.loading = true;
    this.filterlistspopup = false;
    this.showpostlist = false;
    console.log('list archive');
    const data = {
      'userid': localStorage.getItem('UserId'),
      'search': '',
      'pagenumber': 1,
      'pagesize': 10,
      'archiveList': 1,
      'postId': this.postArray
    };
    console.log(data);
    console.log(' recent logs ', data);
    this.chatservice.myrecentlogs(data).subscribe(res => {
      console.log(res);
      if (res && res['statusCode'] === 200) {
        this.recentlogs = res['data'];
        console.log(this.recentlogs);
        // console.log(this.recentlogs[0].HCHAT_ROOM_Is_Post, 'post avail');
        // this.archievetype = this.recentlogs[0].TChat_Log_IS_Archive;
        // this.mutetype = this.recentlogs[0].TChat_Log_Is_Mute;
        if (this.recentlogs.length >= 1) {
          this.sendDisabled = false;
          this.currIndex = 0;
          console.log('if length 1');
          this.isPostVar = this.recentlogs[0].HCHAT_ROOM_Is_Post;
          this.archievetype = this.recentlogs[0].TChat_Log_IS_Archive;
          this.mutetype = this.recentlogs[0].TChat_Log_Is_Mute;
        }

        if (this.recentlogs.length > 0 && this.recentlogs[0].HCHAT_ROOM_Is_Post === 0) {

          console.log('profile id null ', this.recentlogs.length);
          let firstuserid = this.recentlogs[0].dn_id;
          this.deleteUserId = this.recentlogs[0].dn_id;
          let firstchatid = this.recentlogs[0].TChat_Log_Chat_Room_ID;
          this.getuserdetail(firstuserid);
          this.getChatRoomMessages(firstchatid, firstuserid);
        }
        if (this.recentlogs.length > 0 && this.recentlogs[0].HCHAT_ROOM_Is_Post === 1) {
          console.log(this.recentlogs[0].dc_post_name);
          localStorage.setItem('userofPostid', this.recentlogs[0].dn_postid);
          if (this.recentlogs[0].dc_post_created_by !== this.loginUserId) {
            this.archivedata = localStorage.getItem('UserId');
            this.showUserName = true;
            this.deleteUserId = this.recentlogs[0].dn_postid;
            this.getPostUserName(this.recentlogs[0].dc_post_created_by);
            this.chatroomname = this.recentlogs[0].dc_post_name;
            let firstuserid = this.recentlogs[0].dn_postid;
            let firstchatid = this.recentlogs[0].TChat_Log_Chat_Room_ID;
            this.getChatRoomMessages(firstchatid, firstuserid);
          }
          if (this.recentlogs[0].dc_post_created_by === this.loginUserId) {
            this.archivedata = '';
            this.showUserName = true;
            this.deleteUserId = this.recentlogs[0].dn_id;
            this.chatroomname = this.recentlogs[0].dc_first_name + ' ' + this.recentlogs[0].dc_last_name;
            this.postusername = '(' + this.recentlogs[0].dc_post_name + ')';
            let firstuserid = this.recentlogs[0].dn_id;
            let firstchatid = this.recentlogs[0].TChat_Log_Chat_Room_ID;
            this.getChatRoomMessages(firstchatid, firstuserid);
          }
        }
        if (this.recentlogs.length === 0) {
          this.loading = false;
          // this.chatroomname = '';
          // this.postusername = '';
          // this.chatroommesaage = [];
          this.toastr.error('No Archived');
        }
      } else {
        this.loading = false;
      }
    });
  }

  mute(roomid: any) {
    console.log(this.showpostlist);
    console.log(localStorage.getItem('userofPostid'));

    if (this.mutetype === 0) {
      this.muted = true;
    }
    if (this.mutetype === 1) {
      this.muted = false;
    }
    this.showthreedotspopup = false;
    let data = {};
    if (this.showpostlist) {
      data = {
        'roomId': roomid,
        'userId': localStorage.getItem('userofPostid'),
        'isMute': this.muted
      };
      console.log(data);
      this.chatservice.muteChat(data).subscribe(res => {
        console.log(res);
        if (res) {
          this.getPostRecentLogs(localStorage.getItem('userofPostid'));
        }
      });
    } else {
      data = {
        'roomId': roomid,
        'userId': localStorage.getItem('UserId'),
        'isMute': this.muted
      };
      console.log(data);
      localStorage.removeItem('profileid');
      this.chatservice.muteChat(data).subscribe(res => {
        console.log(res);
        if (res) {
          this.getrecentlogs();
        }
      });
    }
  }

  delete(roomid: any) {
    console.log(roomid);
    this.showthreedotspopup = false;
    console.log(this.showpostlist);

    const data = {
      userId: this.deleteUserId,
      roomId: roomid
    };
    console.log(data);
    this.chatservice.deleteChat(data).subscribe(res => {
      console.log(res);
    });
    localStorage.removeItem('profileid');
    // this.getChatRoomMessages(roomid, localStorage.getItem('receiverId'));
    if (this.showpostlist) {
      localStorage.getItem('userofPostid');
      this.getPostRecentLogs(localStorage.getItem('userofPostid'));
    } else {
      this.getrecentlogs();
    }
    this.getmypost('');
  }

  socketConnection(userid: any) {
    console.log('connection');
    const data = {
      'userId': userid
    };
    this.socket.emit('new-user', data);
  }

}
