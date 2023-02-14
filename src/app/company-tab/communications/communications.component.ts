import { Component, OnInit, Input } from '@angular/core';
import { PostService } from 'src/app/service/post.service';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import * as io from 'socket.io-client';
import * as moment from 'moment-timezone';
import { ChatserviceService } from 'src/app/service/chatservice.service';
import { LanguageService } from 'src/app/service/language.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-communications',
  templateUrl: './communications.component.html'
})
export class CommunicationsComponent implements OnInit {

  @Input() chatroomid: any;
  postId: string;
  userId: string;
  responseData: any;
  cloudeURL = environment.cloudFrontURL;
  mypostobj: any;
  postdata: any;
  postcreatedUser: any;
  postCompanyName: any;
  // private url = 'http://52.37.78.247:9004/';
  // private url = 'https://businessinchatdev.optisolbusiness.com/';
  socket;
  public message = '';
  public chatroomdetail: any;
  public sendingmessage: any;
  public selectedDateModel: any = {
    beginDate: null
  };
  public currentDate = new Date();
  public chatroommesaage: any = [];
  public loginUserId: any;
  postuserentity: any;
  postusername: any;
  loading = false;
  langData: any = { common: '', viewPostPage: '', messagePage: '' };

  constructor(private postservices: PostService,
    private router: Router, private chatservice: ChatserviceService,
    private language: LanguageService, private toastr: ToastrService) {
    this.socket = io(environment.url);
    this.receive();
    if (this.chatroomid) {
      this.joinroom();
    }
  }

  ngOnInit() {
    this.fetchLanguage();
    setInterval(() => {
      if (this.loading === true) {
        this.getChatRoomMessages(localStorage.getItem('chatroomid'), this.postId);
      }
    }, 1000);

    this.selectedDateModel = {
      beginDate: {
        year: this.currentDate.getFullYear(),
        month: this.currentDate.getMonth() + 1,
        day: this.currentDate.getDate()
      }
    };
    this.loginUserId = localStorage.getItem('UserId');
    (localStorage.getItem('myPostData'));
    if (localStorage.getItem('myPostData')) {
      this.mypostobj = localStorage.getItem('myPostData');
      this.mypostobj = JSON.parse(this.mypostobj);
      this.postdata = this.mypostobj;
    }
    console.log(this.postdata);
    this.postCompanyName = this.postdata.companyname;
    this.postcreatedUser = this.postdata.userid;
    console.log('this.postCompanyName , this.postcreatedUser', this.postCompanyName, this.postcreatedUser);

    this.viewPostcreatedUser(this.postcreatedUser);
    console.log(localStorage.getItem('UserId'));
    this.userId = localStorage.getItem('UserId');
    console.log(this.postcreatedUser);
    console.log(this.userId);
    console.log('this.chatroomid ', this.chatroomid);

    this.getVurl();
    if (this.chatroomid) {
      this.joinroom();
    }
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

  receive() {
    console.log('receive');
    this.socket.on('new-message', (res: any) => {
      this.socket.on('callback', function (newmsg) {
        console.log('receive message as new message ', newmsg);
      });
      console.log('response receieve ', res);
      this.chatroommesaage.push(res);
      console.log(this.chatroommesaage);
    });
  }

  viewPostcreatedUser(postcreatedUserid) {
    this.postservices.getViewData(postcreatedUserid).subscribe(res => {
      console.log(res);
      if (res && res['status'] && res['status']['status'] === 200) {
        this.postuserentity = res['entity']['userprofile'];
        if (this.postuserentity['firstname'] != null && this.postuserentity['lastname'] != null) {
          this.postusername = this.postuserentity['firstname'] + ' ' + this.postuserentity['lastname'];
        }
        if (this.postuserentity['firstname'] != null && this.postuserentity['lastname'] == null) {
          this.postusername = this.postuserentity['firstname'];
        }
        if (this.postuserentity['firstname'] == null && this.postuserentity['lastname'] != null) {
          this.postusername = this.postuserentity['lastname'];
        }
      }
    });
  }

  getVurl() {
    const geturl = this.router.url;
    const params = geturl.split('view-post/');
    this.postId = params[1];
    console.log(this.postId);
    if (this.postcreatedUser === this.userId) {
      console.log('if ');
    }
  }

  joinroom() {
    console.log('join room in message');
    this.socketConnection(this.postId);
    this.getChatRoomMessages(this.chatroomid, this.postId);
  }

  send() {
    console.log('sending message');
    this.loading = true;
    const fromDate = this.chkLength(this.selectedDateModel.beginDate.year) + '-' + this.chkLength(this.selectedDateModel.beginDate.month) + '-' + this.chkLength(this.selectedDateModel.beginDate.day) + ' ' + this.chkLength(this.currentDate.getHours()) + ':' + this.chkLength(this.currentDate.getMinutes()) + ':' + this.chkLength(this.currentDate.getSeconds());
    const utcfromdate = moment.utc(new Date(fromDate)).format('YYYY-MM-DD HH:mm:ss');
    if (this.message !== undefined && this.message !== '' && this.message !== null) {
      if (this.message.trim().length > 0) {
        const data = {
          roomname: localStorage.getItem('chatroomname'),
          chatRoomId: localStorage.getItem('chatroomid'),
          hasMsg: true,
          msgTime: utcfromdate,
          isGroup: false,
          isPost: true,
          isBroad: false,
          userId: localStorage.getItem('UserId'),
          recent: { dc_post_created_by: this.postcreatedUser, HCHAT_ROOM_Is_Post: 1 },
          msg: this.message,
          istype: 'text',
          filename: '',
        };
        console.log(data);

        this.socket.emit('send-message', data);
      } else {
        this.toastr.error('Enter the valid message content');
        this.message = this.message.trim();
      }
    }
    this.message = '';

    setInterval(() => {
      if (this.loading === true) {
        this.getChatRoomMessages(localStorage.getItem('chatroomid'), this.postId);
      }
    }, 3000);
  }
  
  getChatRoomMessages(roomid: any, postid: any) {
    console.log('chat room messages');
    localStorage.setItem('chatroomid', roomid);
    localStorage.setItem('postid', postid);

    const data = {
      'chatroomid': roomid,
      'userid': postid,
      'loginUserId': localStorage.getItem('UserId'),
      'pagenumber': 1,
      'pagesize': 50,
      'search': ''
    };
    console.log('getChatRoomMessages data ', data);
    this.chatservice.chatroomMessages(data).subscribe(res => {
      if (res && res['statusCode'] === 200 && res['data']['message'].length > 0) {
        this.chatroomid.chatroommesaagesarr = res['data']['message'][0];
        this.loading = false;

        this.chatroomid.showInputBox = false;
        if (this.chatroomid.chatroommesaagesarr.TMESSAGES_Content.includes('https://') || this.chatroomid.chatroommesaagesarr.TMESSAGES_Content.includes('http://')) {
          const messageContent = this.chatroomid.chatroommesaagesarr.TMESSAGES_Content;
          if (this.chatroomid.chatroommesaagesarr.TMESSAGES_Content.includes('https://')) {
            const splitArray = messageContent.replace(/\n/g, ' ').split(' ');
            for (let j = 0; j < splitArray.length; j++) {
              if (splitArray[j].includes('https://')) {
                this.chatroomid.chatroommesaagesarr.anchorContent = splitArray[j];
              }
            }
          }
          if (this.chatroomid.chatroommesaagesarr.TMESSAGES_Content.includes('http://')) {
            const splitArray = messageContent.split(/\n/);
            for (let j = 0; j < splitArray.length; j++) {
              if (splitArray[j].includes('http://')) {
                this.chatroomid.chatroommesaagesarr.anchorContent = splitArray[j];
              }
            }
          }
          this.chatroomid.chatroommesaagesarr.linktype = 'link';
        }
        console.log(this.chatroomid.chatroommesaagesarr);
      }
    });
  }

  chkLength(data) {
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

  socketConnection(userid) {
    console.log('connection');

    const data = {
      'userId': userid
    };
    console.log(data);
    this.socket.emit('new-user', data);
    // this.socket.on('callback', function(response, data) {
    //   console.log(response, data);
    // })
  }

  goToMessage() {
    console.log('converse');
    console.log(localStorage.getItem('chatroomname'));
    localStorage.removeItem('profileid');
    localStorage.removeItem('profileurl');

    this.router.navigate(['/messages']);
  }

}
