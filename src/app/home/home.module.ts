import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AlertController, IonicModule, NavController } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { HomePage } from './home.page';

import { HomePageRoutingModule } from './home-routing.module';
import { BluetoothSerial } from '@awesome-cordova-plugins/bluetooth-serial/ngx';
import { AndroidPermissions } from '@awesome-cordova-plugins/android-permissions/ngx';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HomePageRoutingModule
  ],
  providers: [BluetoothSerial, AndroidPermissions],
  declarations: [HomePage]
})
export class HomePageModule { }
