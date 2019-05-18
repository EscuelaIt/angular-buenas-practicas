import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NoMvcRoutingModule } from './no-mvc-routing.module';
import { NoMvcComponent } from './no-mvc.component';

@NgModule({
  declarations: [NoMvcComponent],
  imports: [
    CommonModule,
    NoMvcRoutingModule
  ]
})
export class NoMvcModule { }
