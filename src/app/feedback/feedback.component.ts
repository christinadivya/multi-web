import { Component, OnInit } from '@angular/core';
import { LanguageService } from '../service/language.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { GeneralService } from '../service/general.service';
import { Router } from '@angular/router';
import { RegisterService } from '../service/register.service';

@Component({
  selector: 'app-feedback',
  templateUrl: './feedback.component.html'
})
export class FeedbackComponent implements OnInit {

  feedbackForm: FormGroup;
  userid: any;
  userDetail: any;
  emailid: any = '';
  submitted = false;
  invalidcomment = false;
  answer1Value: any;
  answer2Value: any;
  answer3Value: any;
  langData: any = {common: '', loginFooterPage: '', createPostPage: '', contactUsPage: '', feedbackPage: ''};

  answer1List = [
    { id: 1, heading: 'Very Satisfied' },
    { id: 2, heading: 'Satisfied' },
    { id: 3, heading: 'Neutral' },
    { id: 4, heading: 'Dissatisfied'  },
    { id: 5, heading: 'Very Dissatisfied' }
  ];

  answer2List = [
    { id: 1, heading: 'Definitely Yes' },
    { id: 2, heading: 'Maybe' },
    { id: 3, heading: 'I’d rather not' }
  ];

  answer3List = [
    { id: 1, heading: 'Yes' },
    { id: 2, heading: 'Still Looking' },
    { id: 3, heading: 'No' }
  ];

  constructor(private language: LanguageService, private formBuilder: FormBuilder,
    private toastr: ToastrService, private generalService: GeneralService,
    private router: Router, private registerService: RegisterService) { }

  ngOnInit() {
    console.log(localStorage.getItem('currentUser'));
    this.userid = localStorage.getItem('UserId');
    if (this.userid !== null) {
      this.getUserDetails();
    }
    window.scrollTo(0, 0);
    this.fetchLanguage();
    this.createForm();
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

  showError(showError: any) {
    this.toastr.clear();
    this.toastr.error(showError);
  }

  showSuccess(showSuccess: any) {
    this.toastr.clear();
    this.toastr.success(showSuccess);
  }

  getUserDetails() {
    this.registerService.userDetails(this.userid).subscribe( res => {
      console.log(res);
      if (res) {
        this.userDetail = res['entity'];
        this.emailid = res['entity']['email'];
        this.feedbackForm['controls']['email'].setValue(this.emailid);
      }
    });
  }

  createForm() {
    this.feedbackForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$')]],
      answerOne: ['', Validators.required],
      answerTwo: ['', Validators.required],
      answerThree: ['', Validators.required],
      comments: ['', Validators.required]
    });
  }

  changeanswer1(ans1) {
    this.answer1Value = ans1['heading'];
    console.log(this.answer1Value);
  }

  changeanswer2(ans2) {
    this.answer2Value = ans2['heading'];
    console.log(this.answer2Value);
  }

  changeanswer3(ans3) {
    this.answer3Value = ans3['heading'];
    console.log(this.answer3Value);
  }

  onSubmit() {
    console.log(this.feedbackForm);
    this.submitted = true;

    if (this.feedbackForm.get('comments').value !== undefined) {
      this.invalidcomment = false;
    }
    if (this.feedbackForm.get('comments').value.length > 0) {
      if (this.feedbackForm.get('comments').value.trim().length === 0) {
        this.invalidcomment = true;
      } else {
        this.invalidcomment = false;
      }
    }

    const data = {
      'email': this.feedbackForm['controls']['email'].value.trim(),
      'answer1': this.answer1Value,
      'answer2': this.answer2Value,
      'answer3': this.answer3Value,
      'comments': this.feedbackForm['controls']['comments'].value.trim(),
    };
    console.log('data ', data);
    console.log('feedbackForm Valid :', this.feedbackForm.valid);
    if (this.feedbackForm.invalid) {
      this.showError('Please fill required fields');
    }

    if (this.feedbackForm.valid) {
      this.generalService.saveFeedback(data).subscribe( res => {
        console.log(res);
        if (res && res['status'] && res['status'] === 200) {
          this.showSuccess('Your Feedback send to Admin successfully!');
          if (this.userid !== null) {
            this.router.navigate(['/user-home']);
          } else {
            this.router.navigate(['/home']);
          }
          window.scrollTo(0, 0);
        }
      });
    }
  }

}
