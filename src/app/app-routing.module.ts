import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { PersonalInformationComponent } from './personal-information/personal-information.component';
import { SubscriptionComponent } from './subscription/subscription.component';
import { AppLayoutComponent } from './layout/app-layout/app-layout.component';
import { UserHomeComponent } from './user-home/user-home.component';
import { CompanyDetailComponent } from './company-detail/company-detail.component';
import { AuthGuard } from './auth.guard';
import { PostEntrepreneurComponent } from './post-entrepreneur/post-entrepreneur.component';
import { PostListComponent } from './post-list/post-list.component';

import { ViewAllPostComponent } from './view-all-post/view-all-post.component';
import { BookmarksComponent } from './bookmarks/bookmarks.component';
import { SearchComponent } from './search/search.component';
import { GurdGuard } from './shared/DeactivateGuard';
import { GetReferralsComponent } from './get-referrals/get-referrals.component';
import { ViewReferralsComponent } from './view-referrals/view-referrals.component';
import { ReceivedReferralsComponent } from './received-referrals/received-referrals.component';
import { ViewpostComponent } from './viewpost/viewpost.component';
import { ViewProfileComponent } from './view-profile/view-profile.component';
import { SendReferrelComponent } from './send-referrel/send-referrel.component';
import { SettingsComponent } from './settings/settings.component';
import { BillingTabComponent } from './billing-tab/billing-tab.component';
import { MessagesComponent } from './messages/messages.component';
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
import { NotificationsComponent } from './notifications/notifications.component';
import { RequestuserlistComponent } from './requestuserlist/requestuserlist.component';
import { FeedbackComponent } from './feedback/feedback.component';
import { ReferralsComponent } from './referrals/referrals.component';
const routes: Routes = [
  // {
  //   path: '',
  //   redirectTo: 'home',
  //   pathMatch: 'full'
  // },
  // { path: 'aboutus', component: AboutusComponent },
  // { path: 'contactus', component: ContactusComponent },
  // { path: 'pricing-plan', component: PricingPlanComponent },
  // { path: 'companies', component: CompaniesComponent },
  // { path: 'distributor', component: DistributorComponent },
  // { path: 'investors', component: InvestorsComponent },
  // { path: 'enterpreneurs', component: EnterpreneursComponent },
  // { path: 'franchasis', component: FranchasisComponent },
  // { path: 'faq', component: FaqComponent },


  // { path: 'subscription', component: SubscriptionComponent},

//  canActivate: [AuthGuard],
  {
    path: '',
    component: AppLayoutComponent,
    children: [
      {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full'
      },
      { path: 'home', component: HomeComponent },
      { path: 'userlisthome/:postid/:userid', component: HomeComponent },
      { path: 'aboutus', component: AboutusComponent },
      { path: 'contactus', component: ContactusComponent },
      { path: 'pricing-plan', component: PricingPlanComponent },
      { path: 'companies', component: CompaniesComponent },
      { path: 'distributor', component: DistributorComponent },
      { path: 'investors', component: InvestorsComponent },
      { path: 'enterpreneurs', component: EnterpreneursComponent },
      { path: 'franchasis', component: FranchasisComponent },
      { path: 'faq', component: FaqComponent },
      { path: 'personal-information', component: PersonalInformationComponent },
      { path: 'feedback', component: FeedbackComponent },
      
      { path: 'subscription', component: SubscriptionComponent, canActivate: [AuthGuard]},
      { path: 'user-home', component: UserHomeComponent, canActivate: [AuthGuard] },
      { path: 'view-post/:postid', component: CompanyDetailComponent, canActivate: [AuthGuard] },
      { path: 'post-list', component: PostListComponent, canActivate: [AuthGuard] },
      { path: 'create-a-post', component: PostEntrepreneurComponent, canDeactivate: [GurdGuard] },
      { path: 'view-all-post', component: ViewAllPostComponent, canActivate: [AuthGuard] },
      { path: 'bookmarks', component: BookmarksComponent, canActivate: [AuthGuard] },
      { path: 'messages', component: MessagesComponent, canActivate: [AuthGuard] },
      { path: 'search', component: SearchComponent, canActivate: [AuthGuard] },
      { path: 'get-referral', component: GetReferralsComponent, canActivate: [AuthGuard] },
      { path: 'view-referral', component: ViewReferralsComponent, canActivate: [AuthGuard] },
      { path: 'received-referrals', component: ReceivedReferralsComponent, canActivate: [AuthGuard] },
      { path: 'view-post', component: ViewpostComponent, canActivate: [AuthGuard] },
      { path: 'view-profile/:userid', component: ViewProfileComponent, canActivate: [AuthGuard] },
      { path: 'send-referral', component: SendReferrelComponent, canActivate: [AuthGuard] },
      { path: 'settings', component: SettingsComponent, canActivate: [AuthGuard] },
      { path: 'settings/:generalid', component: SettingsComponent, canActivate: [AuthGuard] },
      { path: 'viewed-profile', component: ViewedProfileComponent, canActivate: [AuthGuard] },
      { path: 'notifications', component: NotificationsComponent, canActivate: [AuthGuard] },
      { path: 'requestuserlist/:postid', component: RequestuserlistComponent, canActivate: [AuthGuard] },
      { path: 'businesspitch', component: RequestuserlistComponent, canActivate: [AuthGuard] },
      { path: 'referal', component: ReferralsComponent }

      // { path: 'changepassword', component: ChangepasswordComponent },
      // { path: 'report-spam', component: ReportSpamComponent },
      // { path: 'reported-user', component: ReportedUserComponent }
    ]
  }
];
@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: false })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
