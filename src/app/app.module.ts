import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ToastrModule } from 'ngx-toastr';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { environment } from '../environments/environment';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { PersonalInformationComponent } from './personal-information/personal-information.component';
import { ModalModule, BsDropdownModule, TabsModule, TooltipModule } from 'ngx-bootstrap';
// import { NgxSelectModule } from 'ngx-select-ex';
import { SubscriptionComponent } from './subscription/subscription.component';
import { AuthHeaderComponent } from './auth-header/auth-header.component';
import { AppLayoutComponent } from './layout/app-layout/app-layout.component';
import { HeaderComponent } from './layout/header/header.component';
import { AuthFooterComponent } from './auth-footer/auth-footer.component';
import { UserHomeComponent } from './user-home/user-home.component';
// import { GooglePlaceModule } from "ngx-google-places-autocomplete";
import { ImageCropperModule } from 'ngx-image-cropper';
import { AuthLoginComponent } from './auth-login/auth-login.component';

import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { RegisterService } from './service/register.service';
import { PostService } from './service/post.service';
import { GetlocationService } from './service/getlocation.service';
import { LanguageService } from './service/language.service';

import { HashLocationStrategy, LocationStrategy, PathLocationStrategy } from '@angular/common';
import { AuthGuard } from './auth.guard';

import { CompanyDetailComponent } from './company-detail/company-detail.component';
import { SummaryComponent } from './company-tab/summary/summary.component';
import { BusinessPitchComponent } from './company-tab/business-pitch/business-pitch.component';
import { CommunicationsComponent } from './company-tab/communications/communications.component';
import { NotesComponent } from './company-tab/notes/notes.component';
import { ContactInfoComponent } from './company-tab/contact-info/contact-info.component';

import { PostEntrepreneurComponent } from './post-entrepreneur/post-entrepreneur.component';
import { PopoverModule } from 'ngx-bootstrap/popover';
import { PostListComponent } from './post-list/post-list.component';

import {AutosizeModule} from 'ngx-autosize';
import {NgxPaginationModule} from 'ngx-pagination';

// firebase
import { AngularFireModule } from '@angular/fire';
import { AngularFireAuthModule } from '@angular/fire/auth';

import { MomentModule } from 'ngx-moment';
import { NgxSelectModule } from 'ngx-select-ex';


import { NgxDocViewerModule } from 'ngx-doc-viewer';
import { ViewAllPostComponent } from './view-all-post/view-all-post.component';
import { BookmarksComponent } from './bookmarks/bookmarks.component';
import { SearchComponent } from './search/search.component';
import { JwtInterceptor } from './service/jwt.interceptor';
import { NgxMaskModule } from 'ngx-mask';
import { GurdGuard } from './shared/DeactivateGuard';
import { BsDatepickerModule, BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { TruncateModule } from 'ng2-truncate';
import { FormDirective } from '../app/shared/form.directive';
import { NgxLoadingModule } from 'ngx-loading';
import { GetReferralsComponent } from './get-referrals/get-referrals.component';
import { ViewReferralsComponent } from './view-referrals/view-referrals.component';
import { ReceivedReferralsComponent } from './received-referrals/received-referrals.component';
import { ViewpostComponent } from './viewpost/viewpost.component';
import { ViewProfileComponent } from './view-profile/view-profile.component';
import { SendReferrelComponent } from './send-referrel/send-referrel.component';
// import { HttpClientModule} from '@angular/common/http';
import { AngularEditorModule } from '@kolkov/angular-editor';
import { FroalaEditorModule, FroalaViewModule } from 'angular-froala-wysiwyg';
import { RichTextEditorAllModule } from '@syncfusion/ej2-angular-richtexteditor';
import { SettingsComponent } from './settings/settings.component';
import { SettingsTabComponent } from './settings-tab/settings-tab.component';
import { BillingTabComponent } from './billing-tab/billing-tab.component';
import { PrivacyTabComponent } from './privacy-tab/privacy-tab.component';
import { MessagesComponent } from './messages/messages.component';
import { TextMaskModule } from 'angular2-text-mask';
import { PickerModule } from '@ctrl/ngx-emoji-mart';
import { AboutusComponent } from './aboutus/aboutus.component';
import { ContactusComponent } from './contactus/contactus.component';
import { PricingPlanComponent } from './pricing-plan/pricing-plan.component';
import { CompaniesComponent } from './companies/companies.component';
import { DistributorComponent } from './distributor/distributor.component';
import { InvestorsComponent } from './investors/investors.component';
import { EnterpreneursComponent } from './enterpreneurs/enterpreneurs.component';
import { FranchasisComponent } from './franchasis/franchasis.component';
import { FaqComponent } from './faq/faq.component';
import { ViewedProfileComponent } from './viewed-profile/viewed-profile.component';
import { GeneralService } from './service/general.service';
import { NotificationsComponent } from './notifications/notifications.component';
import { RequestuserlistComponent } from './requestuserlist/requestuserlist.component';
import { FeedbackComponent } from './feedback/feedback.component';
import { NewsComponent } from './news/news.component';
import { ReferralsComponent } from './referrals/referrals.component';

export function provideConfig() {

}

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    AppLayoutComponent,
    PersonalInformationComponent,
    SubscriptionComponent,
    AuthHeaderComponent,
    HeaderComponent,
    AuthFooterComponent,
    UserHomeComponent,
    AuthLoginComponent,
    CompanyDetailComponent,
    SummaryComponent,
    BusinessPitchComponent,
    CommunicationsComponent,
    NotesComponent,
    ContactInfoComponent,
    PostEntrepreneurComponent,
    PostListComponent,
    ViewAllPostComponent,
    BookmarksComponent,
    SearchComponent,
    FormDirective,
    GetReferralsComponent,
    ViewReferralsComponent,
    ReceivedReferralsComponent,
    ViewpostComponent,
    ViewProfileComponent,
    SendReferrelComponent,
    SettingsComponent,
    SettingsTabComponent,
    BillingTabComponent,
    PrivacyTabComponent,
    MessagesComponent,
    AboutusComponent,
    ContactusComponent,
    PricingPlanComponent,
    CompaniesComponent,
    DistributorComponent,
    InvestorsComponent,
    EnterpreneursComponent,
    FranchasisComponent,
    FaqComponent,
    ViewedProfileComponent,
    NotificationsComponent,
    RequestuserlistComponent,
    FeedbackComponent,
    NewsComponent,
    ReferralsComponent,
  ],
  imports: [
    TruncateModule, RichTextEditorAllModule,
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    ToastrModule.forRoot(),
    TooltipModule.forRoot(),
    ModalModule.forRoot(),
    // NgxSelectModule,
    BsDropdownModule.forRoot(),
    BsDatepickerModule.forRoot(),
    FroalaEditorModule.forRoot(), FroalaViewModule.forRoot(),
    // GooglePlaceModule,
    ImageCropperModule,
    HttpClientModule,
    BrowserAnimationsModule,
    TabsModule.forRoot(),
    PopoverModule.forRoot(),
    NgxPaginationModule,
    MomentModule,
    // firebase
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireAuthModule, // imports firebase/auth, only needed for auth features
    AutosizeModule,
    NgxSelectModule,
    NgxDocViewerModule,
    NgxMaskModule.forRoot(),
    BsDatepickerModule.forRoot(), AngularEditorModule,
    NgxLoadingModule.forRoot({}),
    TextMaskModule,
    PickerModule
  ],
  providers: [
    RegisterService,
    PostService,
    GetlocationService,
    AuthGuard,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: JwtInterceptor,
      multi: true
    },
    { provide: LocationStrategy, useClass: PathLocationStrategy }, //  PathLocationStrategy
    LanguageService,
    GurdGuard,
    GeneralService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
