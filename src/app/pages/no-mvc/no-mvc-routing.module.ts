import { NgModule, Component } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { NoMvcComponent } from './no-mvc.component';

const routes: Routes = [{
  path: '',
  component: NoMvcComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class NoMvcRoutingModule { }
