import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  {
    path: 'mvc',
    loadChildren: './pages/mvc/mvc.module#MvcModule'
  },
  {
    path: 'no-mvc',
    loadChildren: './pages/no-mvc/no-mvc.module#NoMvcModule'
  },
  {
    path: '**',
    redirectTo: '/no-mvc',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
