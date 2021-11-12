import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { LoginComponent } from '../modals/login/login.component';
import { TaskComponent } from '../modals/task/task.component';
import { StatuscardComponent } from './statuscard/statuscard.component';
import { TaskcardComponent } from './taskcard/taskcard.component';

@NgModule({
  imports: [FormsModule, CommonModule, IonicModule],
  declarations: [StatuscardComponent, TaskcardComponent],
  exports: [StatuscardComponent, TaskcardComponent]
})
export class ComponentsModule {}
