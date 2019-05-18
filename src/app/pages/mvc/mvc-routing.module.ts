import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MvcComponent } from './mvc.component';

const routes: Routes = [{
  path: '',
  component: MvcComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MvcRoutingModule { }
