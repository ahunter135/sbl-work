import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { TaskComponent } from '../modals/task/task.component';
import { StatuscardComponent } from './statuscard/statuscard.component';
import { TaskcardComponent } from './taskcard/taskcard.component';

@NgModule({
  imports: [FormsModule, CommonModule],
  declarations: [StatuscardComponent, TaskcardComponent, TaskComponent],
  exports: [StatuscardComponent, TaskcardComponent, TaskComponent]
})
export class ComponentsModule {}
