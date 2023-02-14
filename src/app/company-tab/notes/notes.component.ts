import { Component, OnInit } from '@angular/core';
// Importing the reactive form module classes.
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { PostService } from 'src/app/service/post.service';
import { ToastrService } from 'ngx-toastr';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import * as moment from 'moment-timezone';
import { LanguageService } from 'src/app/service/language.service';
@Component({
  selector: 'app-notes',
  templateUrl: './notes.component.html'
})
export class NotesComponent implements OnInit {

  modalRef: BsModalRef;
  currentDate = new Date();
  notes;
  mynote: FormGroup;
  submitted = false;
  postdata: any ;
  notesList: any ;
  currentNote: any;
  langData: any = {common: '', viewPostPage: ''};
  constructor(private fb: FormBuilder,
              private modalService: BsModalService,
              private Postservices: PostService,
              private toastr: ToastrService,
              private language: LanguageService) { }

  ngOnInit() {

    // behavioural Subject Fetching Value
    this.Postservices.cast.subscribe(res => this.postdata = res);

    this.createForm();

    this.viewMyNote();
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

  createForm() {
    this.mynote = this.fb.group({
        note: ['', Validators.compose([Validators.required])]
    });
  }

  noteSubmit() {
    this.submitted = true;

    if (this.mynote.valid) {

      // console.log(this.mynote.getRawValue());

      const notedata = {
        userid : localStorage.getItem('UserId'),
        postid : this.postdata.postid,
        description : this.mynote.getRawValue().note,
      };

      this.Postservices.addNote(notedata).subscribe(res => {
        console.log(res);
        this.viewMyNote();
        this.submitted = false;
         if (res['status']['status'] === 200) {

            this.notes = '';
          }

      }, err => {
          console.log(err);

      });

    }
  }


  viewMyNote() {
    const that = this;
    setTimeout(function () {
    const uId = localStorage.getItem('UserId');
    const postid = that.postdata.postid;

      that.Postservices.viewNote(uId, postid).subscribe(res => {
        // console.log(res);
        if (res && res !== null && res['status'].status === 200) {
          //  console.log(res['status']['msg']);
           that.notesList = res['entity'];
        } else if (res == null) {
          // console.log(res);
          that.notesList = null;
        }
      }, err => {
        console.log(err);
      });
   }, 1000);

  }

  deleteNote(template, noteId) {
    this.currentNote =  noteId;
    this.modalRef = this.modalService.show(
      template,
      Object.assign({}, { class: 'gray modal-dialog-centered  modal-custom modal-md'})
    );
  }


  deleteCurrentNote() {
    this.Postservices.deleteNote(this.currentNote).subscribe(res => {
      if (res['status']['status'] === 200) {
      this.showSuccess(res['status']['msg']);
      this.viewMyNote();
      this.modalRef.hide();
      }
    }, err => {
      console.log(err);
    });
}

  showError(showError) {
    this.toastr.error(showError);
  }

  showSuccess(showSuccess) {
    this.toastr.success(showSuccess);
  }

  convertutctolocal(value): string {
    const time = value.toString().split('');
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

}
