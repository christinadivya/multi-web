import { Component, OnInit, TemplateRef, Input } from '@angular/core';
import { PostService } from 'src/app/service/post.service';
import { environment } from 'src/environments/environment';
import { DomSanitizer } from '@angular/platform-browser';
import { BsModalService, BsModalRef } from 'ngx-bootstrap';
import { LanguageService } from 'src/app/service/language.service';
import { HttpParams } from '@angular/common/http';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-business-pitch',
  templateUrl: './business-pitch.component.html'
})
export class BusinessPitchComponent implements OnInit {

  modalRef: BsModalRef;
  pitchDet: any = {};
  doc: any;
  pitchdata: any = {
    fileext: null,
    urltype: null
  };
  docarray: any = [];
  videoArray: any = [];
  cloudeURL = environment.cloudFrontURL;
  postId: any;
  responseData: any;
  userId: any;
  showButton: any;
  message = '';
  showContent: any;
  loader = false;
  langData: any = { common: '', viewPostPage: '' };
  constructor(private Postservices: PostService,
    private sanitizer: DomSanitizer,
    private modalService: BsModalService,
    private language: LanguageService, public router: Router, public toastr: ToastrService) {
    this.getVurl();
  }

  ngOnInit() {
    this.fetchbusinesspitch();
    this.fetchLanguage();
  }

  getVurl() {
    const geturl = this.router.url;
    const params = geturl.split('view-post/');
    this.postId = params[1];
    this.createPostView();
    this.getRequestvalue();
  }

  getRequestvalue() {
    let params = new HttpParams();
    params = params.append('postid', this.postId);
    this.Postservices.getbusinesspitchdatabyuserid(params).subscribe((result) => {
      console.log('resultttttttt', result);
      if (result === null) {
        this.showButton = true;
      } else {
        if (result['entity']['seenBusinessPitch'] === false) {
          this.showButton = false;
          this.message = 'Waiting for approval.';
        } else if (result['entity']['viewBusinessPitch'] === true) {
          this.showButton = false;
          this.showContent = true;
        } else {
          this.showButton = false;
          this.message = 'Your Request was Rejected, Please Contact Post owner.';
        }
      }
    });
  }

  createPostView() {
    // to fetch Post id
    this.userId = localStorage.getItem('UserId');
    this.Postservices.viewPost(this.postId, this.userId).subscribe((responseview) => {
      if (responseview['status']['status'] === 200) {
        this.responseData = responseview['entity'];
        this.pitchDet = {
          pitchid: this.responseData.businesspitch.pitchid,
          type: this.responseData.businesspitch.type,
          createdUser: this.responseData.userid,
          postid: this.responseData.postid
        };
        console.log(this.pitchDet);
        if (this.pitchDet.createdUser !== localStorage.getItem('UserId') && (+this.pitchDet.pitchid) === 1) {
          this.showContent = false;
        } else {
          this.showContent = true;
        }
      }
    }, err => {

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

  fetchbusinesspitch() {
    const that = this;
    setTimeout(function () {
      // behavioural Subject Fetching Value
      that.Postservices.cast.subscribe(res => that.pitchdata = res['uploadfiles']);
      console.log('this pitch');
      console.log(that.pitchdata);
      for (let index = 0; index < that.pitchdata.length; index++) {
        if (that.pitchdata[index].url) {
          const videourlsplit = that.pitchdata[index].url.split('https://');
          if (videourlsplit && videourlsplit > 1) {
            console.log('videourlsplit', videourlsplit);
          } else {
            const extension = that.pitchdata[index].url.split('.');
            let fileextension;
            if (extension && extension.length > 0) {
              fileextension = extension[1];
            }
            that.pitchdata[index].fileext = fileextension;
            that.pitchdata[index].urltype = 'yu';
          }
        }
        // Checking wheter it is video
        if (that.pitchdata[index] && that.pitchdata[index].type === 2) {
          that.videoArray.push(that.pitchdata[index]);
        } else if (that.pitchdata[index] && that.pitchdata[index].type === 1) {
          that.docarray.push(that.pitchdata[index]);
        }
      }
      // console.log(that.videoArray);
      console.log(that.docarray);
      that.passValue(that.videoArray);
    }, 1000);
  }

  requireaccess(data) {
    this.loader = true;
    const params = {'postid': this.pitchDet.postid};
    this.Postservices.sendBusinessPitchRequest(params).subscribe((response: any) => {
      if (response['status']['status'] === 200) {
        this.loader = false;
        this.getRequestvalue();
        this.toastr.success(response['status']['msg']);
      } else {
        this.loader = false;
        this.toastr.error(response['status']['msg']);
      }
      console.log('rppp', response);
    }, err => {
      this.loader = false;
      this.toastr.error('something went wrong.');
    });
  }

  passValue(value) {
    this.videoArray = value;
    console.log(this.videoArray);
    for (let index = 0; index < this.videoArray.length; index++) {
      if (this.videoArray[index].url) {
        const linktype = this.videoArray[index].url;
        const urlsplit = linktype.split('https://');
        console.log(urlsplit[0]);
        if (urlsplit && urlsplit.length > 1) {
          this.videoArray[index].urltype = 'embed';
        } else {
          this.videoArray[index].urltype = 'local';
        }
      }
    }
  }

  viewDocumentModal(template: TemplateRef<any>, document) {
    this.doc = this.cloudeURL + document;
    this.modalRef = this.modalService.show(
      template,
      Object.assign({}, { class: 'modal-custom modal-lg w-80vw' })
    );
  }
}
