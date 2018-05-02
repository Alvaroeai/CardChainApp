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
  imageCode: string ;
  options :BarcodeScannerOptions;
  isReadyToSave: boolean;
  item: any;
  marca: any;
  form: FormGroup;
  image: string = '';

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

    this.marca = navParams.get('marca');
    console.log(this.marca.name);
    console.log('custom:'+this.marca.custom);

    //  this.image_front = this.marca.image_front;
  //    this.image_back = this.marca.image_back;

    this.form = formBuilder.group({
      img: [this.marca.img],
      name: [this.marca.name, Validators.required],
      about: [this.marca.about],
      type: [this.marca.type],
      color: [this.marca.color],
      code: [this.marca.code],
      format: [this.marca.format],
      code_image: [this.marca.code_image],
      category: [this.marca.category],
      custom: [this.marca.custom],
      image_back: [this.marca.image_back],
      image_front: [this.marca.image_front],
    });

    // Watch the form for changes, and
    this.form.valueChanges.subscribe((v) => {
      this.isReadyToSave = this.form.valid;
    });
  }

  encodeText(type, data){
    this.barcodeScanner.encode(type,data).then((encodedData) => {
        console.log('type:'+type);
        console.log('data:'+data);

        this.encodedData = encodedData;
        //this.demoImg.nativeElement.src = encodedData.file;
        this.form.patchValue({ 'code_image': encodedData.file });
          this.imageCode = encodedData.file;
        //this.imageCode.nativeElement.src = encodedData.file;
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
    this.options = {
        prompt : "Scan your barcode "
    }
    this.barcodeScanner.scan(this.options).then((barcodeData) => {
    // Success! Barcode data is here
      console.log('Success! Barcode data is here'+ barcodeData);
      this.scanData = barcodeData;
      this.form.patchValue({ 'code': barcodeData.text });
      this.form.patchValue({ 'format': barcodeData.format });

      this.encodeText(barcodeData.format,barcodeData.text)
      //this.encodeText(this.barcodeScanner.Encode.TEXT_TYPE,this.scanData)
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
