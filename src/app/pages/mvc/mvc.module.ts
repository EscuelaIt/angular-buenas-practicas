import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MvcRoutingModule } from './mvc-routing.module';
import { MvcComponent } from './mvc.component';

@NgModule({
  declarations: [MvcComponent],
  imports: [
    CommonModule,
    MvcRoutingModule
  ]
})
export class MvcModule { }
