import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { LoginComponent } from './login/login.component';
import { CustomPreloadingService } from './services/custom.preloading.service';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
   {path: 'testtt',  data: { preload: true }, loadChildren: () => import('./main-app-module/main-app.module').then(m => m.MainAppModule)},
  { path: '', redirectTo: '/testtt/groupsPosts/details', pathMatch: 'full' },
  { path: '**', component: PageNotFoundComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true,scrollPositionRestoration: 'enabled',preloadingStrategy: CustomPreloadingService})],//,enableTracing:true
  exports: [RouterModule]
})
export class AppRoutingModule { }
