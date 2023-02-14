import { Injectable, EventEmitter } from '@angular/core';
import { HttpClient, HttpInterceptor, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PostService {
  constructor(private http: HttpClient) { }

  // behaviour subject
  image = new EventEmitter();
  public postdata = new BehaviorSubject<any>('');
  private currentdata = new BehaviorSubject<any>('');
  private postitle = new BehaviorSubject<any>('');
  typesList = new BehaviorSubject<any>('');
  cast = this.postdata.asObservable();
  cpost = this.currentdata.asObservable();
  potitle = this.postitle.asObservable();
  contactInfo: number;
  general = 'businessinGeneral/';
  profile='businessinProfile/'
  userIdidentify: any;
  viewPostData(data) {
    console.log(data, '$$$')
    return this.postdata.next(data);
  }

  checkDialCode(dialCode): string {
    if (dialCode && dialCode.toString().trim() && dialCode === '+91') {
      return environment.indiaPhoneMask;
    }
    if (dialCode && dialCode.toString().trim() && dialCode === '+1') {
      return environment.usPhoneMask;
    }
    if (dialCode && dialCode.toString().trim() && dialCode === '+971') {
      return environment.uaePhoneMask;
    }
    if (dialCode && dialCode.toString().trim() && dialCode === '+44') {
      return environment.ukPhoneMask;
    }
    if (dialCode && dialCode.toString().trim() && dialCode === '+598') {
      return environment.uruguveyPhoneMask;
    }
    if (dialCode && dialCode.toString() && dialCode === '+213') {
      return environment.algeriaPhonemask;
    }
    if (dialCode && dialCode.toString() && dialCode === '+54') {
      return environment.argentinePhonemask;
    }
    if (dialCode && dialCode.toString() && dialCode === '+297') {
      return environment.arubaPhonemask;
    }
    if (dialCode && dialCode.toString().trim() && dialCode === '+61') {
      return environment.australiaPhonemask;
    }
    if (dialCode && dialCode.toString().trim() && dialCode === '+43') {
      return environment.australiaPhonemask;
    }
    if (dialCode && dialCode.toString().trim() && dialCode === '+973') {
      return environment.bahrainPhonemask;
    }
    if (dialCode && dialCode.toString().trim() && dialCode === '+880') {
      return environment.bangladeshPhonemask;
    }
    if (dialCode && dialCode.toString().trim() && dialCode === '+32') {
      return environment.belgiumPhonemask;
    }
    if (dialCode && dialCode.toString().trim() && dialCode === '+501') {
      return environment.belizePhonemask;
    }
    if (dialCode && dialCode.toString().trim() && dialCode === '+591') {
      return environment.boliviaPhonemask;
    }
    if (dialCode && dialCode.toString().trim() && dialCode === '+55') {
      return environment.brazilPhonemask;
    }
    if (dialCode && dialCode.toString().trim() && dialCode === '+673') {
      return environment.bruneiPhonemask;
    }
    if (dialCode && dialCode.toString().trim() && dialCode === '+855') {
      return environment.combodiaPhonemask;
    }
    if (dialCode && dialCode.toString().trim() && dialCode === '+56') {
      return environment.chilePhonemask;
    }
    if (dialCode && dialCode.toString().trim() && dialCode === '+86') {
      return environment.chinaPhonemask;
    }
    if (dialCode && dialCode.toString().trim() && dialCode === '+57') {
      return environment.colombiaPhonemask;
    }
    if (dialCode && dialCode.toString().trim() && dialCode === '+506') {
      return environment.costaPhonemask;
    }
    if (dialCode && dialCode.toString().trim() && dialCode === '+357') {
      return environment.cyprusPhonemask;
    }
    if (dialCode && dialCode.toString().trim() && dialCode === '+45') {
      return environment.denmarkPhonemask;
    }
    if (dialCode && dialCode.toString().trim() && dialCode === '+593') {
      return environment.equadorPhonemask;
    }
    if (dialCode && dialCode.toString().trim() && dialCode === '+20') {
      return environment.egyptPhonemask;
    }
    if (dialCode && dialCode.toString().trim() && dialCode === '+503') {
      return environment.elsalvatorPhonemask;
    }
    if (dialCode && dialCode.toString().trim() && dialCode === '+358') {
      return environment.finlandPhonemask;
    }
    if (dialCode && dialCode.toString().trim() && dialCode === '+33') {
      return environment.francePhonemask;
    }
    if (dialCode && dialCode.toString().trim() && dialCode === '+49') {
      return environment.germanyPhonemask;
    }
    if (dialCode && dialCode.toString().trim() && dialCode === '+233') {
      return environment.ghanaPhonemask;
    }
    if (dialCode && dialCode.toString().trim() && dialCode === '+30') {
      return environment.greecePhonemask;
    }
    if (dialCode && dialCode.toString().trim() && dialCode === '+502') {
      return environment.guatamealPhonemask;
    }
    if (dialCode && dialCode.toString().trim() && dialCode === '+592') {
      return environment.guanaPhonemask;
    }
    if (dialCode && dialCode.toString().trim() && dialCode === '+509') {
      return environment.haitiPhonemask;
    }
    if (dialCode && dialCode.toString().trim() && dialCode === '+504') {
      return environment.honduruaPhonemask;
    }
    if (dialCode && dialCode.toString().trim() && dialCode === '+852') {
      return environment.hongkongPhonemask;
    }
    if (dialCode && dialCode.toString().trim() && dialCode === '+36') {
      return environment.hungaryPhonemask;
    }
    if (dialCode && dialCode.toString().trim() && dialCode === '+354') {
      return environment.icelandPhonemask;
    }
    if (dialCode && dialCode.toString().trim() && dialCode === '+62') {
      return environment.indonasiaPhonemask;
    }
    if (dialCode && dialCode.toString().trim() && dialCode === '+39') {
      return environment.italyPhonemask;
    }
    if (dialCode && dialCode.toString().trim() && dialCode === '+81') {
      return environment.japanPhonemask;
    }
    if (dialCode && dialCode.toString().trim() && dialCode === '+962') {
      return environment.jordanPhonemask;
    }
    if (dialCode && dialCode.toString().trim() && dialCode === '+254') {
      return environment.kenyaPhonemask;
    }
    if (dialCode && dialCode.toString().trim() && dialCode === '+82') {
      return environment.koreaPhonemask;
    }
    if (dialCode && dialCode.toString().trim() && dialCode === '+965') {
      return environment.kuwaitPhonemask;
    }
    if (dialCode && dialCode.toString().trim() && dialCode === '+961') {
      return environment.lebanonPhonemask;
    }
    if (dialCode && dialCode.toString().trim() && dialCode === '+352') {
      return environment.luxembourgPhonemask;
    }
    if (dialCode && dialCode.toString().trim() && dialCode === '+853') {
      return environment.macauPhonemask;
    }
    if (dialCode && dialCode.toString().trim() && dialCode === '+261') {
      return environment.madagasgarPhonemask;
    }
    if (dialCode && dialCode.toString().trim() && dialCode === '+60') {
      return environment.malaysiaPhonemask;
    }
    if (dialCode && dialCode.toString().trim() && dialCode === '+960') {
      return environment.maldivesPhonemask;
    }
    if (dialCode && dialCode.toString().trim() && dialCode === '+356') {
      return environment.maltaPhonemask;
    }
    if (dialCode && dialCode.toString().trim() && dialCode === '+222') {
      return environment.mauritaniaPhonemask;
    }
    if (dialCode && dialCode.toString().trim() && dialCode === '+52') {
      return environment.mexicoPhonemask;
    }
    if (dialCode && dialCode.toString().trim() && dialCode === '+377') {
      return environment.monacoPhonemask;
    }
    if (dialCode && dialCode.toString().trim() && dialCode === '+212') {
      return environment.moroccoPhonemask;
    }
    if (dialCode && dialCode.toString().trim() && dialCode === '+31') {
      return environment.netherlandsPhonemask;
    }
    if (dialCode && dialCode.toString().trim() && dialCode === '+64') {
      return environment.newzealandPhonemask;
    }
    if (dialCode && dialCode.toString().trim() && dialCode === '+505') {
      return environment.nicaraguaPhonemask;
    }
    if (dialCode && dialCode.toString().trim() && dialCode === '+234') {
      return environment.nigeriaPhonemask;
    }
    if (dialCode && dialCode.toString().trim() && dialCode === '+47') {
      return environment.norwayPhonemask;
    }
    if (dialCode && dialCode.toString().trim() && dialCode === '+968') {
      return environment.omanPhonemask;
    }
    if (dialCode && dialCode.toString().trim() && dialCode === '+92') {
      return environment.pakistanPhonemask;
    }
    if (dialCode && dialCode.toString().trim() && dialCode === '+970') {
      return environment.palestinePhonemask;
    }
    if (dialCode && dialCode.toString().trim() && dialCode === '+507') {
      return environment.panamaPhonemask;
    }
    if (dialCode && dialCode.toString().trim() && dialCode === '+595') {
      return environment.paraguayPhonemask;
    }
    if (dialCode && dialCode.toString().trim() && dialCode === '+51') {
      return environment.peruPhonemask;
    }
    if (dialCode && dialCode.toString().trim() && dialCode === '+63') {
      return environment.phillipinesPhonemask;
    }
    if (dialCode && dialCode.toString().trim() && dialCode === '+48') {
      return environment.polandPhonemask;
    }
    if (dialCode && dialCode.toString().trim() && dialCode === '+351') {
      return environment.portugalPhonemask;
    }
    if (dialCode && dialCode.toString().trim() && dialCode === '+974') {
      return environment.qatarPhonemask;
    }
    if (dialCode && dialCode.toString().trim() && dialCode === '+40') {
      return environment.romaniaPhonemask;
    }
    if (dialCode && dialCode.toString().trim() && dialCode === '+7') {
      return environment.russiaPhonemask;
    }
    if (dialCode && dialCode.toString().trim() && dialCode === '+966') {
      return environment.saudiPhonemask;
    }
    if (dialCode && dialCode.toString().trim() && dialCode === '+221') {
      return environment.senegalPhonemask;
    }
    if (dialCode && dialCode.toString().trim() && dialCode === '+65') {
      return environment.singaporePhonemask;
    }
    if (dialCode && dialCode.toString().trim() && dialCode === '+27') {
      return environment.southafricaPhonemask;
    }
    if (dialCode && dialCode.toString().trim() && dialCode === '+34') {
      return environment.spainPhonemask;
    }
    if (dialCode && dialCode.toString().trim() && dialCode === '+94') {
      return environment.srilankaPhonemask;
    }
    if (dialCode && dialCode.toString().trim() && dialCode === '+46') {
      return environment.swedanPhonemask;
    }
    if (dialCode && dialCode.toString().trim() && dialCode === '+41') {
      return environment.switzerlandPhonemask;
    }
    if (dialCode && dialCode.toString().trim() && dialCode === '+886') {
      return environment.taiwanPhonemask;
    }
    if (dialCode && dialCode.toString().trim() && dialCode === '+66') {
      return environment.thailandPhonemask;
    }
    if (dialCode && dialCode.toString().trim() && dialCode === '+216') {
      return environment.tunisiaPhonemask;
    }
    if (dialCode && dialCode.toString().trim() && dialCode === '+90') {
      return environment.turkeyPhonemask;
    }
    if (dialCode && dialCode.toString().trim() && dialCode === '+380') {
      return environment.ukrainePhonemask;
    }
    if (dialCode && dialCode.toString().trim() && dialCode === '+58') {
      return environment.venezuelaPhonemask;
    }
    if (dialCode && dialCode.toString().trim() && dialCode === '+84') {
      return environment.vietnamPhonemask;
    }
    if (dialCode && dialCode.toString().trim() && dialCode === '+967') {
      return environment.yemanPhonemask;
    }
    return null;
  }


  currentPost(data) {
    return this.currentdata.next(data);
  }

  updatedPostTitle(data) {
    return this.postitle.next(data);
  }
  // behaviour subject

  viewPost(postId, userId) {
    const header = new HttpHeaders();
    header.append('Content-Type', 'application/json;charset=UTF-8');
    return this.http.get(environment.apiUrl + 'viewpost?postid=' + postId + '&userid=' + userId + '&origin=' + '1', { headers: header });
  }

  viewPostEdit(postId, userId) {
    const header = new HttpHeaders();
    header.append('Content-Type', 'application/json;charset=UTF-8');
    return this.http.get(environment.apiUrl + 'viewpost?postid=' + postId + '&userid=' + userId + '&origin=' + '2', { headers: header });
  }
  getViewData(userId) {
    return this.http.get(environment.apiUrl + `viewprofile?userid=${userId}`);
  }
  getViewPost(params) {
    return this.http.get(environment.apiUrl + `getallmypost?${params}`);
  }
  getPostList(params) {
    return this.http.get(environment.apiUrl + `searchmypost?${params}`);
  }

  // Get Post Count
  getPostCount(params) {
    return this.http.get(environment.apiUrl + `getallpostcount?${params}`);
  }

  getSubPost(accId) {
    return this.http.get(environment.apiUrl + `subaccount?accounttypeid=${accId}`);
  }
  // createPost(postValue) {
  //   return this.http.post(environment.apiUrl + `businessinProfile/createpost`, postValue);
  // }

  addNote(note) {
    const header = new HttpHeaders();
    header.append('Content-Type', 'application/json;charset=UTF-8');
    return this.http.post(environment.apiUrl + `addnotes`, note, { headers: header });
  }

  viewNote(userId, postId) {
    return this.http.get(environment.apiUrl + 'viewnotes?userid=' + userId + '&postid=' + postId);
  }

  deleteNote(noteId) {
    const header = new HttpHeaders();
    header.append('Content-Type', 'application/json;charset=UTF-8');
    return this.http.delete(environment.apiUrl + 'deletenote?notesid=' + noteId, { headers: header });
  }


  topPicks(data) {

    const header = new HttpHeaders();
    header.append('Content-Type', 'application/json;charset=UTF-8');
    // tslint:disable-next-line:max-line-length
    return this.http.get(environment.apiUrl + 'getallotherspost?userid=' + data.userId + '&pageNumber=' + data.pageNumber + '&pageSize=' + data.pageSize, { headers: header });

  }

  getCompanySize() {
    const header = new HttpHeaders();
    header.append('Content-Type', 'application/json;charset=UTF-8');
    return this.http.get(environment.apiUrl + 'getcompanysize', { headers: header });
  }

  getAmountRange(userid) {
    const header = new HttpHeaders();
    header.append('Content-Type', 'application/json;charset=UTF-8');
    return this.http.get(environment.apiUrl + 'getamountrange?userid=' + userid, { headers: header });
  }

  getamountrangebycurrency(cur) {
    const header = new HttpHeaders();
    header.append('Content-Type', 'application/json;charset=UTF-8');
    return this.http.get(environment.apiUrl + 'getamountrangebycurrency?currency=' + cur, { headers: header });
  }

  getCurrency() {
    const header = new HttpHeaders();
    header.append('Content-Type', 'application/json;charset=UTF-8');
    return this.http.get(environment.apiUrl + 'getallcurrency', { headers: header });
  }

  createPost(postdata) {
    const header = new HttpHeaders();
    header.append('Content-Type', ' application/json');
    return this.http.post(environment.apiUrl + 'createpost', postdata, { headers: header });
  }


  editPost(postdata) {
    console.log(postdata);
    const header = new HttpHeaders();
    header.append('Content-Type', ' application/json');
    return this.http.put(environment.apiUrl + 'editpost', postdata, { headers: header });
  }

  // Get My Bookmarks
  getBookmarks(params) {
    return this.http.get(environment.apiUrl + `getbookmarks?${params}`);
  }

  // Search Bookmarks
  searchBookmarks(params) {
    return this.http.get(environment.apiUrl + `searchmybookmarks?${params}`);
  }

  // Add Bookmarks
  addBookmark(params) {
    const header = new HttpHeaders();
    header.append('Content-Type', 'application/json;charset=UTF-8');
    return this.http.post(environment.apiUrl + `addbookmark?${params}`, '', { headers: header });
  }

  // Types List
  getTypeList() {
    return this.http.get(environment.resourceUrl + this.general + `getallaccounts`);
  }

  // Post Status Change
  changePostStatus(params) {
    const header = new HttpHeaders();
    header.append('Content-Type', 'application/json;charset=UTF-8');
    return this.http.put(environment.apiUrl + `changepoststatus?${params}`, '', { headers: header });
  }

  // Delete Post
  deletePost(params) {
    return this.http.delete(environment.apiUrl + `deletepost?${params}`);
  }

  getcontactinfo() {
    const header = new HttpHeaders();
    header.append('Content-Type', 'application/json;charset=UTF-8');
    return this.http.get(environment.apiUrl + 'getcontactinfo', {headers: header});
  }

  getMyPostForMessage(params) {
    return this.http.get(environment.apiUrl + `getmypostformessage?${params}`);
  }

  getBusinessPitch() {
    return this.http.get(environment.apiUrl + 'getbusinesspitch');
  }
  getbusinesspitchdatabyuserid(params){
    const header = new HttpHeaders();
    header.append('Content-Type', 'application/json;charset=UTF-8');
    return this.http.get(environment.resourceUrl + this.profile + `getbusinesspitchdatabyuserid?${params}`, {headers: header});

  }

  sendBusinessPitchRequest(params) {
    const header = new HttpHeaders();
    header.append('Content-Type', 'application/json;charset=UTF-8');
    return this.http.post(environment.apiUrl + 'addbusinesspitchrequest',params, { headers: header });
  }

  userListForBusinessPitch(params) {
    const header = new HttpHeaders();
    return this.http.get(environment.apiUrl + `getallbusinesspitchrequestbyuserid?${params}`, { headers: header });
  }

  postListForBusinessPitch() {
    const header = new HttpHeaders();
    return this.http.get(environment.apiUrl + `getbusinesspitchpost`, { headers: header });
  }

  sendBusinessPitchResponse(data) {
    const header = new HttpHeaders();
    header.append('Content-Type', 'application/json;charset=UTF-8');
    return this.http.post(environment.apiUrl + `changeselectedpitchrequeststatus`, data, { headers: header });
  }

}
// getUserList () {
//   return
// }
