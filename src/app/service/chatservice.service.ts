import { Injectable, EventEmitter } from '@angular/core';
import * as io from 'socket.io-client';
import { database } from 'firebase';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ChatserviceService {

  private socket;

  private dataSource = new BehaviorSubject<any>('');
  cast = this.dataSource.asObservable();
   
  constructor(private http: HttpClient, private router: Router) {
    this.socket = io(environment.url);
  }
  messageemit = new EventEmitter();

  linkPreview(msgUrl) {
    const header = new HttpHeaders();
    header.append('Content-Type','application/x-www-form-urlencoded; charset=UTF-8');
    return this.http.get('https://api.linkpreview.net/?key=42ae1d5e7ae7c9325a18c63efe6b77eb&q=' +msgUrl, { headers: header});
  }

  // linkPreview(msgUrl) {
  //   const header = new HttpHeaders();
  //   header.append('Content-Type','application/x-www-form-urlencoded; charset=UTF-8');
  //   let data = {
  //     key: '42ae1d5e7ae7c9325a18c63efe6b77eb',
  //     q : msgUrl
  //   }
  //   return this.http.post('https://api.linkpreview.net/' , data, { headers: header});
  // }

  myrecentlogs(data: any) {
    console.log("mylogs ",data.postId);
    const header = new HttpHeaders();
    header.append('Accept', '*/*');
    return this.http.get(environment.apiurl + '/chatrequest/my_logs?limit=' + data.pagesize + '&page=' + data.pagenumber + '&userId=' + data.userid + '&search=' + data.search + '&archiveList=' + data.archiveList + '&postId=' + data.postId, { headers: header })
  }

  myrecentlogs1(data: any) {
    console.log("mylogs ");
    const header = new HttpHeaders();
    header.append('Accept', '*/*');
    return this.http.get(environment.apiurl + '/chatrequest/mylogs?limit=' + data.pagesize + '&page=' + data.pagenumber + '&userId=' + data.userid + '&search=' + data.search + '&archiveList=' + data.archiveList + '&postId=' + data.postId, { headers: header })
  }

  searchMessage(data: any) {
    const header = new HttpHeaders();
    header.append('Accept', '*/*');
    return this.http.get(environment.apiurl + '/chatrequest/search_list?limit=' + data.pagesize + '&page=' + data.pagenumber + '&userId=' + data.userid + '&search=' + data.search, { headers: header })
  }

  chatroomMessages(data: any) {
    console.log("room messages");
    const header = new HttpHeaders();
    header.append('Accept', '*/*');
    return this.http.get(environment.apiurl + '/chatrooms/messages?roomId=' + data.chatroomid + '&userId=' + data.userid + '&loginUserId=' + data.loginUserId + '&limit=' + data.pagesize + '&page=' + data.pagenumber + '&search=' + data.search, { headers: header })
  }

  archiveChat(data: any) {
    const header = new HttpHeaders();
    header.append('Content-Type', ' application/json');
    return this.http.put(environment.apiurl + '/chatrooms/updateArchive', data, { headers: header });
  }

  archieveList(data: any) {
    const header = new HttpHeaders();
    header.append('Accept', '*/*');
    return this.http.get(environment.apiurl + '/chatrooms/ListArchive?userId=' + data.userId , { headers: header });
  }

  muteChat(data: any) {
    const header = new HttpHeaders();
    header.append('Content-Type', ' application/json');
    return this.http.put(environment.apiurl + '/chatrooms/mute_chat', data, { headers: header });
  }

  deleteChat(data: any) {
    const header = new HttpHeaders();
    header.append('Content-Type', ' application/json');
    return this.http.put(environment.apiurl + '/chatrooms/clearChat', data, { headers: header });
  }

  public sendMessage(message) {
    console.log("$$$$$$$$$ service call")
    this.socket.emit('send-message', message);
    this.socket.on('callback', function (res, data) {
      console.log(res, data);
    });
  }

  public createnewuser(data) {
    this.socket.emit('new-user', data);
  }

  joinusertoparticularroom(data) {
    console.log("chat service");
    this.socket.emit('join-user-chat', data);
    this.socket.on('get-room-id', function (res, data) {
      console.log("on", res, data);
      console.log(res, data, "&&&&");
      // this.socket.on('user-joined', function (response, joinUser) {
      //   console.log(response, joinUser, "&&&&######################3");

      // });
    });
    return this.socket;
  }

  updatedDataSelection(userData) {
    return this.dataSource.next(userData);
  }

}