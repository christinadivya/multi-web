import { Component, OnInit } from '@angular/core';
import { RefferalService } from '../service/refferal.service';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';
import { ChatserviceService } from '../service/chatservice.service';
import { HttpParams } from '@angular/common/http';
import * as io from 'socket.io-client';
import { LanguageService } from '../service/language.service';

@Component({
  selector: 'app-view-profile',
  templateUrl: './view-profile.component.html',
  styleUrls: ['./view-profile.component.scss']
})
export class ViewProfileComponent implements OnInit {
  currentPage = 1;
  pageSize = 5;
  // page = 1;
  total = 0;
  cloudeURL = environment.cloudFrontURL;
  totalentity = {};
  userprofile = { firstname: '', lastname: '', companyname: '' };
  userfulladdress: any;
  userAddress: any;
  userAccount = { accounttypeshortname: '' };
  postlistarray = [];
  profileimg;
  public loading = false;
  userprofilepresent = false;
  postlistflag = false;
  userid: any;
  userEmail: any;
  Subject;
  profileId;
  userprofileId: any;
  profilimagePresent = false;
  message = 'Hai';
  // private url = 'http://52.37.78.247:9004/';
  // private url = 'https://businessinchatdev.optisolbusiness.com/';
  socket;
  profileurl: any;
  showPhoneOrEmail: boolean;

  langData: any = { common: '', viewProfilePage: '' };

  constructor(private refferalService: RefferalService, private router: Router,
    private chatservice: ChatserviceService, private language: LanguageService) {
      this.socket = io(environment.url);
    }

  ngOnInit() {
    this.userid = localStorage.getItem('UserId');
    this.getVurl();
    this.getUserDetails();
    this.fetchLanguage();
    localStorage.setItem('route', '');
    localStorage.setItem('navigation', 'false');
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

  goToLink() {
    let myProfile = localStorage.getItem('myProfile');
    myProfile = JSON.parse(myProfile);
    console.log(myProfile);
    const name = myProfile['firstname'] + myProfile['lastname'];
    this.profileId = localStorage.getItem('UserId');
    this.Subject = `${name} Shared a link with you to BusinessIn`;
  }

  shareToLink() {
    console.log(this.totalentity['userProfile']['userid']);
    location.href = `mailto:?subject=${this.Subject}&body=https%3A%2F%2Fbusinessintest.optisolbusiness.com
    %2Fview-profile%2F${this.userprofileId}%20check%20this%20link%20to%20know%20about%20me`;
  }

  getVurl() {
    const geturl = this.router.url;
    console.log(geturl);
    const params = geturl.split('view-profile/');
    console.log(params);
    this.profileurl = 'view-profile';
    this.userid = params[1];
    this.getUserDetails();
  }

  getUserDetails() {
    let params = new HttpParams();

    params = params.append('userid', this.userid);
    params = params.append('pageNumber', this.currentPage.toString());
    params = params.append('pageSize', this.pageSize.toString());
    // let params = { userid: localStorage.getItem('UserId'), pagesize: this.pageSize, page: this.currentPage };
    console.log(params);
    this.refferalService.getReferrerDetails(params).subscribe((res) => {
      if (res['status']['status'] === 200) {
        this.totalentity = res['entity'];
        console.log(this.totalentity , this.totalentity['userProfile']['showPhoneNumberEmail']);
        this.showPhoneOrEmail = this.totalentity['userProfile']['showPhoneNumberEmail'];
        this.userEmail = this.totalentity['userProfile']['email'];
        this.goToLink();

        this.userprofileId = this.totalentity['userProfile']['userid'];
        this.userprofile = this.totalentity['userProfile']['userprofile'];

        if (this.userid === localStorage.getItem('UserId')) {
          localStorage.setItem('myProfile', JSON.stringify(this.userprofile));
        }

        this.userfulladdress = this.totalentity['userProfile']['userprofile']['address'];
        if (this.userfulladdress['city'] != null && this.userfulladdress['state'] != null && this.userfulladdress['country'] != null) {
          this.userAddress = this.userfulladdress['city']['cityname'] + ',' +
          this.userfulladdress['state']['statename'] + ',' + this.userfulladdress['country']['countryname'];
        }
        if (this.userfulladdress['city'] == null && this.userfulladdress['state'] != null && this.userfulladdress['country'] != null) {
          this.userAddress = this.userfulladdress['state']['statename'] + ',' + this.userfulladdress['country']['countryname'];
        }
        if (this.userfulladdress['city'] == null && this.userfulladdress['state'] == null && this.userfulladdress['country'] != null) {
          this.userAddress = this.userfulladdress['country']['countryname'];
        }

        this.userAccount = this.totalentity['userProfile']['accounttype'];
        console.log(this.totalentity['userProfile']['userprofile']['profileimage'], '&&&');
        console.log(this.cloudeURL, '###############3333');
        if (this.totalentity['userProfile']['userprofile']['profileimage'] !== null) {
          this.profileimg = this.cloudeURL + this.totalentity['userProfile']['userprofile']['profileimage'];
          this.profilimagePresent = true;
        }
        this.postlistarray = this.totalentity['userProfile']['postview'];
        if (this.postlistarray == null) {
          this.postlistflag = false;
        } else {
          this.postlistflag = true;
          for (let i = 0; i < this.postlistarray.length; i++) {
            console.log('this.postlistarray[i].postsummary.length ', this.postlistarray[i].postsummary.length);
            if (this.postlistarray[i].postsummary.length >= 60) {
              this.postlistarray[i].viewmore = true;
            }

            const parts = this.postlistarray[i]['createdon'].split(' ');
            const x = new Date(parts[0]); // replace this with your retrieved modal text
            const optionsa = { month: 'long', day: '2-digit', year: 'numeric' };
            const tx = x.toLocaleDateString('en-us', optionsa);
            this.postlistarray[i]['date'] = tx;
            const date = new Date(this.postlistarray[i]['createdon']);
            const options = {
              hour: 'numeric',
              minute: 'numeric',
              hour12: true
            };
            const timeString = date.toLocaleString('en-US', options);

            this.postlistarray[i]['time'] = timeString;
          }
        }
        this.total = this.totalentity['count'];
      }

    });
  }
  // viewmorepage(array) {
  //   this.router.navigate(['/view-post', array.postid]);
  // }
  postChange(pageNo) {
    this.currentPage = pageNo;
    this.getUserDetails();
  }

  sendMessage() {
    console.log('%%% Sending Message %%%%');
    const datas = {
      chatRoomId: '2',
      hasMsg: true,
      roomname: 'test',
      msgTime: '',
      isGroup: false,
      userId: 'a7bf8bb7-399e-49a2-b120-a77d572d4462',
      // username: data.username,
      msg: 'Hai gud',
      istype: 'text',
      dazzId: '',
      filename: '',
      messageId: '1'
    };
    this.chatservice.sendMessage(datas);
    this.message = '';
  }

  joinRoom() {
    console.log('join room');
    localStorage.setItem('profileid', this.userid);
    localStorage.setItem('profileurl', this.profileurl);
    this.socketConnection();

    const data = {
      senderId: localStorage.getItem('UserId'),
      receiverId: this.userprofileId
    };
    console.log(data);
    this.socket.emit('join-user-chat', data, function(resp, err) {
      console.log(resp, err);
    });
    this.socket.on('get-room-id', function (res: any) {
      console.log('on', res);
      localStorage.setItem('chatroomid', res['chatRoomId']);
      localStorage.setItem('chatroomname', res['roomname']);
      console.log('in view profile saved id ', localStorage.getItem('chatroomid'));
      console.log('in view profile saved room name ', localStorage.getItem('chatroomname'));
    });
    this.router.navigate(['/messages'], this.userid);
  }

  socketConnection() {
    const data = {
      'userId': this.userprofileId
    };
    console.log(data);
    this.socket.emit('new-user', data);
    this.socket.on('callback', function(res, data) {
      console.log(res, data);
    });
  }

  viewmorepage(array) {
    array['viewmore'] = !array['viewmore'];
  }

  viewpost(array) {
    console.log('post');
    this.router.navigate(['/view-post', array.postid]);
  }
}
