import { Component, ViewChild, ElementRef, NgZone } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Camera } from '@ionic-native/camera';
import { IonicPage, NavController, ViewController, NavParams} from 'ionic-angular';
import { Platform, ActionSheetController, LoadingController } from 'ionic-angular';
import { BarcodeScanner, BarcodeScannerOptions } from '@ionic-native/barcode-scanner';
import { QRScanner, QRScannerStatus } from '@ionic-native/qr-scanner';
import { CardIO } from '@ionic-native/card-io';

import Tesseract from 'tesseract.js';

@IonicPage()
@Component({
  selector: 'page-item-create',
  templateUrl: 'item-create.html'
})
export class ItemCreatePage {
  @ViewChild('imageResult') private imageResult: ElementRef;
  @ViewChild('demoImg') private demoImg: ElementRef;

  @ViewChild('fileInput') fileInput;
  scanData : {};
   encodeData : string ;
   encodedData : {} ;
   options :BarcodeScannerOptions;

  isReadyToSave: boolean;

  item: any;

  marca: any;

  form: FormGroup;
  private recognizedText: string;

image: string = '';
_zone: any;
_ocrIsLoaded: boolean = false;

brightness: number = 12;
contrast: number = 52;
unsharpMask: any = { radius: 100, strength: 2 };
hue: number = -100;
saturation: number = -100;

showEditFilters: boolean = false;

debugText: string = '';


  constructor(
    private camera: Camera,
    public navCtrl: NavController,
    public loadingCtrl: LoadingController,
    public actionsheetCtrl: ActionSheetController,
    public platform: Platform,
    public navParams: NavParams,
    public viewCtrl: ViewController,
    formBuilder: FormBuilder,
    private cardIO: CardIO,
    private qrScanner: QRScanner,
    private barcodeScanner: BarcodeScanner) {

      this._zone = new NgZone({ enableLongStackTrace: false });

    this.marca = navParams.get('marca');
    console.log(this.marca.name);

    this.form = formBuilder.group({
      img: [this.marca.img],
      name: [this.marca.name, Validators.required],
      about: [this.marca.about],
      type: [this.marca.type],
      color: [this.marca.color],
      code: [this.marca.code],
    });

    // Watch the form for changes, and
    this.form.valueChanges.subscribe((v) => {
      this.isReadyToSave = this.form.valid;
    });
  }

  encodeText(type, data){
      this.barcodeScanner.encode(type,data).then((encodedData) => {
          this.encodedData = encodedData;
          this.demoImg.nativeElement.src = encodedData.file;
          //this.image = encodedData.file;
          console.log(encodedData.file);
          //this.form.patchValue({ 'img': encodedData.file });
      }, (err) => {
          console.log("Error occured : " + err);
      });
}

scan(){
    this.options = {
        prompt : "Scan your barcode "
    }
    this.barcodeScanner.scan(this.options).then((barcodeData) => {
        console.log(barcodeData.text);
        console.log(barcodeData.format);
        console.log(barcodeData.cancelled);
        this.scanData = barcodeData;
    }, (err) => {
        console.log("Error occured : " + err);
    });
}

  //BARCODE SCANNER
  ScanBarcode(){
    this.barcodeScanner.scan().then((barcodeData) => {
    // Success! Barcode data is here
      console.log('Success! Barcode data is here'+ barcodeData);
      console.log(barcodeData.text);
      console.log(barcodeData.format);
      console.log(barcodeData.cancelled);
      console.log(barcodeData.Encode);
      this.scanData = barcodeData;
      this.form.patchValue({ 'code': barcodeData });
      this.encodeText(this.barcodeScanner.Encode.TEXT_TYPE,this.encodeData)
    }, (err) => {
      // An error occurred
      console.log('An error occurred'+ err);
    });
  }

  //QR SCANNER
  ScanQR(){
  // Optionally request the permission early
  this.qrScanner.prepare()
  .then((status: QRScannerStatus) => {
     if (status.authorized) {
       // camera permission was granted


       // start scanning
       let scanSub = this.qrScanner.scan().subscribe((text: string) => {
         console.log('Scanned something', text);
         this.form.patchValue({ 'code': text });
         this.qrScanner.hide(); // hide camera preview
         scanSub.unsubscribe(); // stop scanning
       });

       // show camera preview
       this.qrScanner.show();

       // wait for user to scan something, then the observable callback will be called

     } else if (status.denied) {
       // camera permission was permanently denied
       // you must use QRScanner.openSettings() method to guide the user to the settings page
       // then they can grant the permission from there
     } else {
       // permission was denied, but not permanently. You can ask for permission again at a later time.
     }
  })
  .catch((e: any) => console.log('Error is', e));
  }

  cardImage = 'assets/imgs/credit_card.png';

  card = {
    cardType: '',
    cardNumber: '',
    redactedCardNumber: '',
    expiryMonth: null,
    expiryYear: null,
    cvv: '',
    postalCode: ''
  };

//SCAN CARD IO
getCardIO() {

  this.cardIO.canScan()
    .then(
    (res: boolean) => {
      if (res) {
        const options = {
          scanExpiry: true,
          hideCardIOLogo: true,
          scanInstructions: 'Por favor coloque su tarjeta dentro del marco',
          keepApplicationTheme: true,
          requireCCV: false,
          requireExpiry: false,
          requirePostalCode: false,
          requireCardholderName: false
        };
        this.cardIO.scan(options).then(response => {
          console.log('Scan complete');

          const {
            cardType,
            cardNumber,
            redactedCardNumber,
            expiryMonth,
            expiryYear,
            cvv,
            postalCode
          } = response;

          this.card = {
            cardType,
            cardNumber,
            redactedCardNumber,
            expiryMonth,
            expiryYear,
            cvv,
            postalCode
          };
        });
      }
    });
}

  getPicture() {
    if (Camera['installed']()) {
      this.camera.getPicture({
        destinationType: this.camera.DestinationType.DATA_URL,
        targetWidth: 96,
        targetHeight: 96
      }).then((data) => {
        this.form.patchValue({ 'img': 'data:image/jpg;base64,' + data });
        console.log('loaded')
        this.analyze(data, true);

      }, (err) => {
        alert('Unable to take photo');
      })
    } else {
      this.fileInput.nativeElement.click();
    }
  }

  processWebImage(event) {
    let reader = new FileReader();
    reader.onload = (readerEvent) => {

      let imageData = (readerEvent.target as any).result;
      this.form.patchValue({ 'img': imageData });
    };

    reader.readAsDataURL(event.target.files[0]);
  }

  getProfileImageStyle() {
    return 'url(' + this.form.controls['img'].value + ')'
  }

  /**
   * The user cancelled, so we dismiss without sending data back.
   */
  cancel() {
    this.viewCtrl.dismiss();
  }

  /**
   * The user is done and wants to create the item, so return it
   * back to the presenter.
   */
  done() {
    if (!this.form.valid) { return; }
    this.viewCtrl.dismiss(this.form.value);
  }



         openMenu() {
           if (this._ocrIsLoaded === true) {
             let actionSheet;
             if (!this.image) {
               actionSheet = this.actionsheetCtrl.create({
                 title: 'Actions',
                 cssClass: 'action-sheets-basic-page',
                 buttons: [
                   {
                     text: 'Random demo',
                     icon: !this.platform.is('ios') ? 'shuffle' : null,
                     handler: () => {
                       this.randomDemo()
                     }
                   },
                   {
                     text: 'Take Photo',
                     icon: !this.platform.is('ios') ? 'camera' : null,
                     handler: () => {
                       this.takePicture()
                     }
                   },
                   {
                     text: 'Cancel',
                     role: 'cancel', // will always sort to be on the bottom
                     icon: !this.platform.is('ios') ? 'close' : null,
                     handler: () => {
                       console.log('Cancel clicked');
                     }
                   }
                 ]
               });
             }
             else {
               actionSheet = this.actionsheetCtrl.create({
                 title: 'Actions',
                 cssClass: 'action-sheets-basic-page',
                 buttons: [
                   {
                     text: 'Random demo',
                     icon: !this.platform.is('ios') ? 'shuffle' : null,
                     handler: () => {
                       this.randomDemo()
                     }
                   },
                   {
                     text: 'Re-Take photo',
                     icon: !this.platform.is('ios') ? 'camera' : null,
                     handler: () => {
                       this.takePicture()
                     }
                   },
                   {
                     text: 'Apply filters',
                     icon: !this.platform.is('ios') ? 'barcode' : null,
                     handler: () => {
                       //this.filter()
                     }
                   },
                   {
                     text: 'Clean filters',
                     icon: !this.platform.is('ios') ? 'refresh' : null,
                     handler: () => {
                       this.restoreImage()
                     }
                   },
                   {
                     text: this.showEditFilters == false ? 'Customize filters' : 'Hide customization filters',
                     icon: !this.platform.is('ios') ? 'hammer' : null,
                     handler: () => {
                       this.showEditFilters = this.showEditFilters == false ? true : false;
                     }
                   },
                   {
                     text: 'Read image',
                     icon: !this.platform.is('ios') ? 'analytics' : null,
                     handler: () => {
                       this.analyze(this.imageResult.nativeElement.src, false);
                     }
                   },
                   {
                     text: 'Cancel',
                     role: 'cancel', // will always sort to be on the bottom
                     icon: !this.platform.is('ios') ? 'close' : null,
                     handler: () => {
                       console.log('Cancel clicked');
                     }
                   }
                 ]
               });
             }
             actionSheet.present();
           }
           else {
             alert('OCR API is not loaded');
           }
         }

         restoreImage() {
           if (this.image) {
             this.imageResult.nativeElement.src = this.image;
           }
         }

         takePicture() {
           let loader = this.loadingCtrl.create({
             content: 'Please wait...'
           });
           loader.present();

           if (Camera['installed']()) {
           // Take a picture saving in device, as jpg and allows edit

           this.camera.getPicture({
             quality: 100,
             destinationType: this.camera.DestinationType.DATA_URL,
             encodingType: this.camera.EncodingType.JPEG,
             targetHeight: 1000,
             sourceType: 1,
            allowEdit: true,
             saveToPhotoAlbum: true,
             correctOrientation: true
           }).then((imageURI) => {
             loader.dismissAll();

             this.image = imageURI;
             this.debugText = imageURI;

             alert(imageURI);

           }, (err) => {
             console.log(`ERROR -> ${JSON.stringify(err)}`);
           });
         } }

         filter() {
           /// Initialization of glfx.js
           /// is important, to use js memory elements
           /// access to Window element through (<any>window)
           try {
             var canvas = (<any>window).fx.canvas();
           } catch (e) {
             alert(e);
             return;
           }

           /// taken from glfx documentation
           var imageElem = this.imageResult.nativeElement; // another trick is acces to DOM element
           var texture = canvas.texture(imageElem);

           canvas.draw(texture)
             .hueSaturation(this.hue / 100, this.saturation / 100)//grayscale
             .unsharpMask(this.unsharpMask.radius, this.unsharpMask.strength)
             .brightnessContrast(this.brightness / 100, this.contrast / 100)
             .update();

           /// replace image src
           imageElem.src = canvas.toDataURL('image/png');
         }

         analyze(image, loadAPI) {
           let loader = this.loadingCtrl.create({
             content: 'Please wait...'
           });
           loader.present();

           if (loadAPI == true) {
             this._ocrIsLoaded = false;
           }
           /// Recognize data from image
           Tesseract.recognize(image, {})
             .progress((progress) => {
               this._zone.run(() => {
                 loader.setContent(`${progress.status}: ${Math.floor(progress.progress * 100)}%`)
                 console.log('progress:', progress);
               })
             })
             .then((tesseractResult) => {
               this._zone.run(() => {
                 loader.dismissAll();
                 if (loadAPI == true) {
                   this._ocrIsLoaded = true;
                 }
                 console.log('Tesseract result: ');
                 console.log(tesseractResult.text);
                this.form.patchValue({ 'code': tesseractResult.text });

                 /// Show a result if data isn't initializtion
                 if (loadAPI != true) { this.recognizedText = tesseractResult.text; }
               });
             });
         }

         randomDemo() {

         }
           ionViewDidLoad() {
           //  alert(this.marca.type);
             if(this.marca.type=='barcode'){
               this.ScanBarcode();
             } else if(this.marca.type=='qr'){
               this.ScanQR();
             } else if(this.marca.type=='ocr'){
               //console.log('loaded')
               this.getCardIO();
               //this.takePicture();
		          //this.analyze(this.demoImg.nativeElement.src, true);
             }



           }

}
