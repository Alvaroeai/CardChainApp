import { Component, ViewChild, ElementRef, NgZone } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Camera } from '@ionic-native/camera';
import { IonicPage, NavController, ViewController, NavParams} from 'ionic-angular';
import { Platform, ActionSheetController, LoadingController } from 'ionic-angular';
import { BarcodeScanner, BarcodeScannerOptions } from '@ionic-native/barcode-scanner';
import { QRScanner, QRScannerStatus } from '@ionic-native/qr-scanner';
import { CardIO } from '@ionic-native/card-io';
import { CameraPreview, CameraPreviewPictureOptions, CameraPreviewOptions, CameraPreviewDimensions } from '@ionic-native/camera-preview';


import Tesseract from 'tesseract.js';
import JsBarcode from 'jsbarcode';

@IonicPage()
@Component({
  selector: 'page-item-create',
  templateUrl: 'item-create.html'
})
export class ItemCreatePage {
  @ViewChild('imageResult') private imageResult: ElementRef;
  @ViewChild('demoImg') private demoImg: ElementRef;

  @ViewChild('fileInput') fileInput;
  @ViewChild('barcode') barcode: ElementRef;
  scanData : {};
  encodeData : string ;
  encodedData : {} ;
  imageCode: string ;
  codeVisible: boolean ;
  SuperTitle: string ;
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
    private cameraPreview: CameraPreview,
    public viewCtrl: ViewController,
    formBuilder: FormBuilder,
    private cardIO: CardIO,
    private qrScanner: QRScanner,
    private barcodeScanner: BarcodeScanner) {

    this.marca = navParams.get('marca');
    console.log(this.marca.name);
    console.log('custom:'+this.marca.custom);



    //  this.image_front = this.marca.image_front;
    //  this.image_back = this.marca.image_back;


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

    if(this.marca.custom==false){
      this.form.patchValue({ 'name': ''});
      this.form.patchValue({ 'img': ''});
  }

    // Watch the form for changes, and
    this.form.valueChanges.subscribe((v) => {
      this.isReadyToSave = this.form.valid;
    });
  }

  encodeText() {
    console.log(this.form.controls.code.value);
    this.codeVisible = true;
    JsBarcode(this.barcode.nativeElement, this.form.controls.code.value);



    // this.barcodeScanner.encode(format,text).then((encodedData) => {
    //   console.log(encodedData);
    //   this.encodedData = encodedData;
    // //  this.imageCode = encodedData.file
    //   this.form.patchValue({ 'imageCode': encodedData.file });
    //   //this.imageCode.nativeElement.src = encodedData.file;
    // }, (err) => {
    //   console.log("Error occured : " + err);
    // });
  }

  titleText() {
    console.log(this.form.controls.name.value);

    this.SuperTitle = this.form.controls.name.value;
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
          this.encodeData = barcodeData.text;
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
      console.log(barcodeData);
      this.scanData = barcodeData;
      this.encodeData = barcodeData.text;
      this.form.patchValue({ 'code': barcodeData.text });
      this.form.patchValue({ 'format': barcodeData.format });
      JsBarcode(this.barcode.nativeElement, barcodeData.text);
      //this.encodeText(this.barcodeData.Encode.TEXT_TYPE,barcodeData.text);
      //this.encodeText(this.barcodeScanner.Encode.TEXT_TYPE,this.scanData);
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

     // camera options (Size and location). In the following example, the preview uses the rear camera and display the preview in the back of the webview
   const cameraPreviewOpts: CameraPreviewOptions = {
     x: 0,
     y: 0,
     width: window.screen.width,
     height: window.screen.height,
     camera: 'rear',
     tapPhoto: true,
     previewDrag: true,
     toBack: true,
     alpha: 1
   };

   //  alert(this.marca.type);
     if(this.marca.type=='barcode'){
       //this.ScanBarcode();

       // Switch camera
      this.cameraPreview.switchCamera();

      // set color effect to negative
      this.cameraPreview.setColorEffect('negative');




      // start camera
      this.cameraPreview.startCamera(cameraPreviewOpts).then(
        (res) => {
          console.log(res)
        },
        (err) => {
          console.log(err)
        });

      // Set the handler to run every time we take a picture
      // this.cameraPreview.setOnPictureTakenHandler().subscribe((result) => {
      //   console.log(result);
      //   // do something with the result
      // });


      // picture options
      const pictureOpts: CameraPreviewPictureOptions = {
        width: 1280,
        height: 1280,
        quality: 85
      }

      // take a picture
      // this.cameraPreview.takePicture(this.pictureOpts).then((imageData) => {
      //   this.picture = 'data:image/jpeg;base64,' + imageData;
      // }, (err) => {
      //   console.log(err);
      //   this.picture = 'assets/img/test.jpg';
      // });
      // Stop the camera preview
      //this.cameraPreview.stopCamera();

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
