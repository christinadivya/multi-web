import { Component, OnInit } from '@angular/core';
import { PostService } from 'src/app/service/post.service';
import { LanguageService } from 'src/app/service/language.service';

@Component({
  selector: 'app-summary',
  templateUrl: './summary.component.html'
})
export class SummaryComponent implements OnInit {

  postdata: any = {};
  locationFinal: any = [];
  sendReferralLocation = [];
  myResi: any = [];
  mypostobj;
  langData: any = { common: '', viewPostPage: '' };
  constructor(private Postservices: PostService,
    private language: LanguageService) { }

  ngafterViewInit() {
    this.setLocationFinal();
  }

  async ngOnInit() {
    // behavioural Subject Fetching Value
    this.Postservices.postdata.subscribe(res => {
      console.log("resssssss????", res)
      this.mypostobj = res;
      this.locationFinal = this.mypostobj['postlocation'];
      this.setLocationFinal();
      this.postdata = this.mypostobj;
    });
    // (localStorage.getItem('myPostData'));
    // if (localStorage.getItem('myPostData')) {

    // }

    // this.Postservices.cast.subscribe(res => {
    //   console.log(res, '$$$$');
    //   this.locationFinal = res.postlocation;
    //   if (this.locationFinal !== []) {
    //     this.locationFinal = this.locationFinal.map((resi) => {
    //       resi.final = '';
    //       console.log(typeof resi);
    //       if (resi['city'] === null && resi['state'] === null && resi['country'] === null && resi['continent'] !== null) {
    //         resi.final = resi['continent']['continentname'];
    //       }
    //       // tslint:disable-next-line:max-line-length
    //       if (resi['city'] === null && resi['state'] === null && resi['country'] !== null && resi['continent'] !== null) {
    //         resi.final = resi['country']['countryname'];
    //       }
    //       // tslint:disable-next-line:max-line-length
    //       if (resi['city'] === null && resi['state'] !== null && resi['country'] !== null && resi['continent'] !== null) {
    //         resi.final = resi['state']['statename'];
    //       }
    //       // tslint:disable-next-line:max-line-length
    //       if (resi['city'] !== null && resi['state'] !== null && resi['country'] !== null && resi['continent'] !== null) {
    //         resi.final = resi['city']['cityname'];
    //       }
    //       return resi;
    //     });
    //   }
    //   console.log(this.locationFinal);
    //   this.postdata = res;
    // });
    console.log("posttt", this.postdata);
    this.fetchLanguage();
  }


  async setLocationFinal() {
    if (this.locationFinal != undefined && this.locationFinal != null) {
      if (this.locationFinal.length > 0) {
        console.log(this.locationFinal, '$$$');
        // this.sendReferralLocation = this.locationFinal;
        await this.locationFinal.map((resi) => {
          console.log(typeof resi);
          if (resi['city'] === null && resi['state'] === null && resi['country'] == null && resi['continent'] !== null) {
            resi['final'] = resi['continent']['continentname'];
          }
          // tslint:disable-next-line:max-line-length
          if (resi['city'] === null && resi['state'] === null && resi['country'] !== null && resi['continent'] !== null) {
            resi['final'] = resi['country']['countryname'];
          }
          // tslint:disable-next-line:max-line-length
          if (resi['city'] === null && resi['state'] !== null && resi['country'] !== null && resi['continent'] !== null) {
            resi['final'] = resi['state']['statename'];
          }
          // tslint:disable-next-line:max-line-length
          if (resi['city'] !== null && resi['state'] !== null && resi['country'] !== null && resi['continent'] !== null) {
            resi['final'] = resi['city']['cityname'];
          }
          return resi;
        });
      }

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

}
