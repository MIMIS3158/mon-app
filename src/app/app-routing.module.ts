import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './shared/guards/auth.guard';
import { GuestGuard } from './shared/guards/guest.guard';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
  {
    path: 'home',
    loadChildren: () =>
      import('./home/home.module').then((m) => m.HomePageModule),
    canActivate: [GuestGuard],
  },
  {
    path: 'signup',
    loadChildren: () =>
      import('./signup/signup.module').then((m) => m.SignupPageModule),
    canActivate: [GuestGuard],
  },

  {
    path: 'signin',
    loadChildren: () =>
      import('./login/login.module').then((m) => m.SigninPageModule),
    canActivate: [GuestGuard],
  },
  {
    path: 'forgot-password',
    loadChildren: () =>
      import('./forgot-password/forgot-password.module').then(
        (m) => m.ForgotPasswordPageModule,
      ),
    canActivate: [GuestGuard],
  },
  // {
  //   path: 'reset-password',
  //   loadChildren: () =>
  //     import('./reset-password/reset-password.module').then(
  //       m => m.ResetPasswordPageModule
  //     )
  // },

  // {
  //   // fixme: pas besoin de page pour le logout, un bouton suffit, appel le back,
  //   // vide le local storage et redirige vers la page d'accuil
  //   path: 'signout',
  //   loadChildren: () =>
  //     import('./signout/signout.module').then(m => m.SignoutPageModule),
  //   canActivate: [AuthGuard]
  // },
  {
    path: 'folder/:id',
    loadChildren: () =>
      import('./folder/folder.module').then((m) => m.FolderPageModule),
    canActivate: [AuthGuard],
  },

  {
    path: 'chat',
    loadChildren: () =>
      import('./chat/chat.module').then((m) => m.ChatPageModule),
    canActivate: [AuthGuard],
  },
  {
    path: 'profile-dev',
    loadChildren: () =>
      import('./profile-dev/profile-dev.module').then(
        (m) => m.ProfileDevPageModule,
      ),
    canActivate: [AuthGuard],
  },
  {
    path: 'profile-entrepreneur',
    loadChildren: () =>
      import('./profile-entrepreneur/profile-entrepreneur.module').then(
        (m) => m.ProfileEntrepreneurPageModule,
      ),
    canActivate: [AuthGuard],
  },
  {
    path: 'project/publish',
    loadChildren: () =>
      import('./publier-projet/publier-projet.module').then(
        (m) => m.PublishProjectPageModule,
      ),
    canActivate: [AuthGuard],
  },
  {
    path: 'postulation',
    loadChildren: () =>
      import('./postulation/postulation.module').then(
        (m) => m.PostulationPageModule,
      ),
    canActivate: [AuthGuard],
  },
  {
    path: 'accueil-entrepreneur',
    loadChildren: () =>
      import('./accueil-entrepreneur/accueil-entrepreneur.module').then(
        (m) => m.AccueilEntrepreneurPageModule,
      ),
    canActivate: [AuthGuard],
  },
  {
    path: 'accueil-developpeur',
    loadChildren: () =>
      import('./accueil-developpeur/accueil-developpeur.module').then(
        (m) => m.AccueilDeveloppeurPageModule,
      ),
    canActivate: [AuthGuard],
  },
  {
    path: 'projets',
    loadChildren: () =>
      import('./projets/projets.module').then((m) => m.ProjetsPageModule),
    canActivate: [AuthGuard],
  },
  /*{
    path: 'conversation',
    loadChildren: () => import('./notif/notif.module').then( m => m.ConversationPageModule)
  },*/
  {
    path: 'projet-creation',
    loadChildren: () =>
      import('./projet-creation/projet-creation.module').then(
        (m) => m.ProjetCreationPageModule,
      ),
    canActivate: [AuthGuard],
  },
  {
    path: 'description',
    loadChildren: () =>
      import('./description/description.module').then(
        (m) => m.DescriptionPageModule,
      ),
    canActivate: [AuthGuard],
  },
  {
    path: 'notification',
    loadChildren: () =>
      import('./notification/notification.module').then(
        (m) => m.NotificationPageModule,
      ),
    canActivate: [AuthGuard],
  },
  {
    path: 'evaluation',
    loadChildren: () =>
      import('./evaluation/evaluation.module').then(
        (m) => m.EvaluationPageModule,
      ),
    canActivate: [AuthGuard],
  },

  {
    path: 'parametres',
    loadChildren: () =>
      import('./parametres/parametres.module').then(
        (m) => m.ParametresPageModule,
      ),
    canActivate: [AuthGuard],
  },
  {
    path: 'sauvegarder',
    loadChildren: () =>
      import('./sauvegarder/sauvegarder.module').then(
        (m) => m.SauvegarderPageModule,
      ),
    canActivate: [AuthGuard],
  },
  {
    path: 'mes-evaluations',
    loadChildren: () =>
      import('./mes-evaluations/mes-evaluations.module').then(
        (m) => m.MesEvaluationsPageModule,
      ),
    canActivate: [AuthGuard],
  },
  {
    path: 'conversations',
    loadChildren: () =>
      import('./conversations/conversations.module').then(
        (m) => m.ConversationsPageModule,
      ),
    canActivate: [AuthGuard],
  },

  {
    path: 'dark-mode-settings',
    loadChildren: () =>
      import('./dark-mode-settings/dark-mode-settings.module').then(
        (m) => m.DarkModeSettingsPageModule,
      ),
    canActivate: [AuthGuard],
  },
  {
    path: 'recommended',
    loadChildren: () =>
      import('./recommended/recommended.module').then(
        (m) => m.RecommendedPageModule,
      ),
    canActivate: [AuthGuard],
  },
  {
    path: 'dashboard-entrepreneur',
    loadChildren: () =>
      import('./dashboard-entrepreneur/dashboard-entrepreneur.module').then(
        (m) => m.DashboardEntrepreneurPageModule,
      ),
    canActivate: [AuthGuard],
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
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
