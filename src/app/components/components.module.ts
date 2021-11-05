import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { StatuscardComponent } from './statuscard/statuscard.component';
import { TaskcardComponent } from './taskcard/taskcard.component';

@NgModule({
  imports: [],
  declarations: [StatuscardComponent, TaskcardComponent],
  exports: [StatuscardComponent, TaskcardComponent]
})
export class ComponentsModule {}
