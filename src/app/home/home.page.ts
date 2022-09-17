import { Component } from '@angular/core';
import { BluetoothSerial } from '@awesome-cordova-plugins/bluetooth-serial/ngx';
import { AlertController, ToastController } from '@ionic/angular';
import { AndroidPermissions } from '@awesome-cordova-plugins/android-permissions/ngx';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  pairedList: pairedlist;
  listToggle = false;
  pairedDeviceID = 0;
  dataSend = '';

  // eslint-disable-next-line max-len
  constructor(private alertCtrl: AlertController, private bluetoothSerial: BluetoothSerial, private toastCtrl: ToastController, private androidPermissions: AndroidPermissions) {
    this.checkBluetoothEnabled();
    this.androidPermissions.checkPermission(this.androidPermissions.PERMISSION.BLUETOOTH_CONNECT).then(
      result => console.log('Has permission?', result.hasPermission),
      err => this.androidPermissions.requestPermission(this.androidPermissions.PERMISSION.BLUETOOTH_CONNECT)
    );
  }

  checkBluetoothEnabled() {
    this.bluetoothSerial.isEnabled().then(success => {
      console.log(success);
      this.listPairedDevices();
    }, error => {
      console.log(error);
      this.showError('Please Enable Bluetooth');
    });
  }

  listPairedDevices() {
    this.bluetoothSerial.list().then(success => {
      console.log(success);
      this.pairedList = success;
      this.listToggle = true;
    }, error => {
      console.log(error);
      this.showError('Please Enable Bluetooth');
      this.listToggle = false;
    });
  }

  selectDevice() {
    const connectedDevice = this.pairedList[this.pairedDeviceID];
    if (!connectedDevice.address) {
      this.showError('Select Paired Device to connect');
      return;
    }
    const address = connectedDevice.address;
    this.connect(address);
  }

  connect(address) {
    // Attempt to connect device with specified address, call app.deviceConnected if success
    this.bluetoothSerial.connect(address).subscribe(success => {
      this.deviceConnected();
      this.showToast('Successfully Connected');
    }, error => {
      console.log('Error:Connecting to Device');
    });
  }

  deviceConnected() {
    // Subscribe to data receiving as soon as the delimiter is read
    this.bluetoothSerial.subscribe('\n').subscribe(success => {
      //this.handleData(success);
      this.showToast('Connected Successfullly');
    }, error => {
      this.showError(error);
    });
  }

  deviceDisconnected() {
    // Unsubscribe from data receiving
    this.bluetoothSerial.disconnect();
    this.showToast('Device Disconnected');
  }

  handleData(data) {
    this.showToast(data);
  }

  sendData(state) {
    let message = '';
    if (state === true) {
      message = 'on';
    } else {
      message = 'off';
    }
    message += '\n';
    this.showToast(message);

    this.bluetoothSerial.write(message).then(success => {
      this.showToast(success);
    }, error => {
      this.showError(error);
    });
  }

  async showError(error) {
    const alert = await this.alertCtrl.create({
      header: 'Error',
      subHeader: error,
      buttons: ['Dismiss']
    });
    await alert.present();
  }

  async showToast(msj) {
    const toast = await this.toastCtrl.create({
      message: msj,
      duration: 500
    });
    await toast.present();

  }

}

// eslint-disable-next-line @typescript-eslint/naming-convention
interface pairedlist {
  'class': number;
  'id': string;
  'address': string;
  'name': string;
}
