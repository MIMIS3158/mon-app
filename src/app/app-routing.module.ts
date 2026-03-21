import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  }, 
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then( m => m.HomePageModule)
  },
 {
    path: 'signup',
    loadChildren: () => import('./signup/signup.module').then( m => m.SignupPageModule)
  },
  
 {
    path: 'signin',
    loadChildren: () => import('./login/login.module').then( m => m.SigninPageModule)
  },
  {
    path: 'folder/:id',
    loadChildren: () => import('./folder/folder.module').then( m => m.FolderPageModule)
  },
 
  {
    path: 'chat',
    loadChildren: () => import('./chat/chat.module').then( m => m.ChatPageModule)
  },
  {
    path: 'profile-dev',
    loadChildren: () => import('./profile-dev/profile-dev.module').then( m => m.ProfileDevPageModule)
  },
  {
    path: 'profile-entrepreneur',
    loadChildren: () => import('./profile-entrepreneur/profile-entrepreneur.module').then( m => m.ProfileEntrepreneurPageModule)
  },
  {
    path: 'project/publish',
    loadChildren: () => import('./publier-projet/publier-projet.module').then( m => m.PublishProjectPageModule)
  },
  {
    path: 'postulation',
    loadChildren: () => import('./postulation/postulation.module').then( m => m.PostulationPageModule)
  },
  {
    // fixme: pas besoin de page pour le logout, un bouton suffit, appel le back, 
    // vide le local storage et redirige vers la page d'accuil
    path: 'signout', 
    loadChildren: () => import('./signout/signout.module').then( m => m.SignoutPageModule)
  },
  
  /*
  {
    path: 'reset-password',
    loadChildren: () => import('./reset-password/reset-password.module').then( m => m.ResetPasswordPageModule)
  },*/
  {
    path: 'accueil-entrepreneur',
    loadChildren: () => import('./accueil-entrepreneur/accueil-entrepreneur.module').then( m => m.AccueilEntrepreneurPageModule)
  },
  {
    path: 'accueil-developpeur',
    loadChildren: () => import('./accueil-developpeur/accueil-developpeur.module').then( m => m.AccueilDeveloppeurPageModule)
  },
  {
    path: 'projets',
    loadChildren: () => import('./projets/projets.module').then( m => m.ProjetsPageModule)
  },
  /*{
    path: 'conversation',
    loadChildren: () => import('./notif/notif.module').then( m => m.ConversationPageModule)
  },*/
  {
    path: 'projet-creation',
    loadChildren: () => import('./projet-creation/projet-creation.module').then( m => m.ProjetCreationPageModule)
  },
  {
    path: 'description',
    loadChildren: () => import('./description/description.module').then( m => m.DescriptionPageModule)
  },
  {
    path: 'notification',
    loadChildren: () => import('./notification/notification.module').then( m => m.NotificationPageModule)
  },
  {
    path: 'evaluation',
    loadChildren: () => import('./evaluation/evaluation.module').then( m => m.EvaluationPageModule)
  },
  
  {
    path: 'parametres',
    loadChildren: () => import('./parametres/parametres.module').then( m => m.ParametresPageModule)
  },
  {
    path: 'sauvegarder',
    loadChildren: () => import('./sauvegarder/sauvegarder.module').then( m => m.SauvegarderPageModule)
  },
  {
    path: 'mes-evaluations',
    loadChildren: () => import('./mes-evaluations/mes-evaluations.module').then( m => m.MesEvaluationsPageModule)
  },
  {
    path: 'conversations',
    loadChildren: () => import('./conversations/conversations.module').then( m => m.ConversationsPageModule)
  },
   
  {
    path: 'dark-mode-settings',
    loadChildren: () => import('./dark-mode-settings/dark-mode-settings.module').then( m => m.DarkModeSettingsPageModule)
  },
  {
    path: 'forgot-password',
    loadChildren: () => import('./forgot-password/forgot-password.module').then( m => m.ForgotPasswordPageModule)
  },  {
    path: 'recommended',
    loadChildren: () => import('./recommended/recommended.module').then( m => m.RecommendedPageModule)
  },
  {
    path: 'dashboard-entrepreneur',
    loadChildren: () => import('./dashboard-entrepreneur/dashboard-entrepreneur.module').then( m => m.DashboardEntrepreneurPageModule)
  },


/*
  {
    path: 'verify-code',
    loadChildren: () => import('./verify-code/verify-code.module').then( m => m.VerifyCodePageModule)
  },*/
  /*{
    path: 'forgot-password',
    loadChildren: () => import('./forgot-password/forgot-password.module').then( m => m.ForgotPasswordPageModule)
  },
  {
    path: 'new-password',
    loadChildren: () => import('./new-password/new-password.module').then( m => m.NewPasswordPageModule)
  }*/








];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
