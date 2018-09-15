import { Component, NgZone } from '@angular/core';
import { NavController } from 'ionic-angular';
import { ToastController } from 'ionic-angular';
import { BLE } from '@ionic-native/ble';
import { DetailPage } from '../detail/detail';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  
  devices: any[] = [];
  statusMessage: string;

  constructor(public navCtrl: NavController, 
              private toastCtrl: ToastController,
              private ble: BLE,
              private ngZone: NgZone) { 
  }

  ionViewDidEnter() {
    console.log('ionViewDidEnter');
    this.scan();
  }

  scan() {
    this.setStatus('Scanning for Bluetooth LE Devices');
    this.devices = [];  // clear list
    this.ble.scan([], 5).subscribe(
      device => this.onDeviceDiscovered(device), 
      error => this.scanError(error)
    );

    setTimeout(this.setStatus.bind(this), 5000, 'Scan complete');
  }

  onDeviceDiscovered(device) {
    console.log('Discovered ' + JSON.stringify(device, null, 2));
    this.ngZone.run(() => {
      this.devices.push(device);
    });
  }

  // If location permission is denied, you'll end up here
  scanError(error) {
    this.setStatus('Error ' + error);
    let toast = this.toastCtrl.create({
      message: 'Error scanning for Bluetooth low energy devices',
      position: 'middle',
      duration: 5000
    });
    toast.present();
  }

  setStatus(message) {
    console.log(message);
    this.ngZone.run(() => {
      this.statusMessage = message;
    });
  }

  deviceSelected(device) {
    // let characteristics;
    // this.ble.connect(device.id).subscribe(data => {
    //   characteristics = data.characteristics;
    // });
    console.log(JSON.stringify(device) + ' selected');
    this.navCtrl.push(DetailPage, {
      device: device
      // characteristics: characteristics
    });
  }


}
// import { Component, OnInit } from '@angular/core';
// import { NavController } from 'ionic-angular';
// import {Platform} from 'ionic-angular';

// import { IBeacon } from '@ionic-native/ibeacon';
// import { DetailPage } from '../detail/detail';

// @Component({
//   selector: 'page-home',
//   templateUrl: 'home.html'
// })
// export class HomePage implements OnInit {
//   delegate:any;
//   region:any;  
//   ibeacon: IBeacon;
//   beacons: IBeacon[] = [];
//   detailPage = DetailPage;
  
//   constructor(public navCtrl: NavController,ibeacon: IBeacon,public plt: Platform) {
//     // this.plt.ready (). then ((readySource) => {
//       // initialize plugin
//       this.ibeacon = ibeacon;

       
//     // });
//   }

//   ngOnInit() {
//     this.initScanner();
//     this.startRanging();
//   }

//   // ionViewDidEnter() {
//   //   this.initScanner();
//   //   this.startRanging();
//   // }
  
//   onDetailPage() {
//     this.navCtrl.push(this.detailPage);
    
//   }
//   ionViewDidEnter() {
   
//     this.ibeacon.startRangingBeaconsInRegion(this.region);
//     this.delegate.didRangeBeaconsInRegion().subscribe(data => {
//       this.beacons = data.beacons;
//       console.log('didRangeBeaconsInRegion:', JSON.stringify(data,null,4))  ;   
//       console.log('UUID: ' + data.beacons[0].uuid);
//       console.log('MAJOR: ' + data.beacons[0].major);     
//       console.log('RSSI: ' + data.beacons[0].rssi);    
//       this.ibeacon.stopRangingBeaconsInRegion(this.region).then(()=>console.log('Stopped RANGIN BEACONS!'));              
//     },
//     error=> console.log('didRangeBeaconsInRegion Error: ', error));
//   }

//   initScanner(){
//       // this.ibeacon.requestAlwaysAuthorization()
//       // this.ibeacon.requestWhenInUseAuthorization()
//       this.delegate = this.ibeacon.Delegate();        
//       // this.delegate.didChangeAuthorizationStatus().subscribe(data=>console.log('didChangeAuthorizationStatus has completed', JSON.stringify(data)))
//       this.delegate.didRangeBeaconsInRegion().subscribe(data => {
//           this.beacons = data.beacons;
//           console.log('didRangeBeaconsInRegion:', JSON.stringify(data,null,4))  ;   
//           console.log('UUID: ' + data.beacons[0].uuid);
//           console.log('MAJOR: ' + data.beacons[0].major);     
//           console.log('RSSI: ' + data.beacons[0].rssi);    
//           this.ibeacon.stopRangingBeaconsInRegion(this.region).then(()=>console.log('Stopped RANGIN BEACONS!'));              
//         },
//         error=> console.log('didRangeBeaconsInRegion Error: ', error));

//       this.delegate.didStartMonitoringForRegion().subscribe(data=>console.log('didStartMonitoringForRegion:',JSON.stringify(data),error=>console.log(error)));
//       this.region = this.ibeacon.BeaconRegion('desktop','B9407F30-F5F8-466E-AFF9-25556B579999');

//       this.ibeacon.startMonitoringForRegion(this.region).then(
//         () => console.log('Native layer recieved the request to monitoring:',JSON.stringify(this.region)),
//         error => console.log('Native layer failed to begin monitoring: ', error))      
//   } 
//   startRanging() {    
//     this.ibeacon.startRangingBeaconsInRegion(this.region).then(()=>console.log('startRangingBeaconsInRegion'));
//   }
// }