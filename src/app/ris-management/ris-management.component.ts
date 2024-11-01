import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { CommonService } from '../shared/common.service';
import { LanguageService } from '../shared/service/language.service';
import * as _ from 'lodash';
// For import APIs of RIS Management 
import { ApiForRISMgmt } from '../shared/api/For_RIS_Mgmt';

export interface AllRisDevice {
  id: string;
  name: string;
  risUrl: string;
}

@Component({
  selector: 'app-ris-management',
  templateUrl: './ris-management.component.html',
  styleUrls: ['./ris-management.component.scss']
})

export class RISManagementComponent implements OnInit, OnDestroy {
  sessionId: string = '';
  @ViewChild('createRISModal') createRISModal: any;
  @ViewChild('deleteModal') deleteModal: any;
  //RIS
  createModalRef!: MatDialogRef<any>;
  deleteModalRef!: MatDialogRef<any>;
  refreshTimeout!: any;
  refreshTime: number = 5;
  
  createForm!: FormGroup;
  p: number = 1;            // 當前頁數
  pageSize: number = 10;    // 每頁幾筆
  totalItems: number = 0;   // 總筆數
  formValidated = false;
  isLoading = false;

  constructor(
    private dialog: MatDialog,
    private router: Router,
    private commonService: CommonService,
    private fb: FormBuilder,
    public languageService: LanguageService,
    public apiForRISMgmt: ApiForRISMgmt,
  ) {
  }

  ngOnInit(): void {
    this.sessionId = this.commonService.getSessionId();
    this.getAllRisDevice();
  }

  ngOnDestroy() {
    clearTimeout(this.refreshTimeout);
  }

  //All RIS Device
  selectRISDevice!: AllRisDevice;
  allRisDevice: AllRisDevice [] = [];
  getAllRisDevice() {
    clearTimeout(this.refreshTimeout);
    if (this.commonService.isLocal) {
      /* local file test */
      this.allRisDevice = this.commonService.allRisDevice;
      console.log(this.allRisDevice);
    } else {
      this.apiForRISMgmt.getAllRisDevice().subscribe({
        next: ( res ) => {
          console.log('getAllRisDevice:');
          console.log(res);
          this.allRisDevice = res;
          this.risListDeal();
        },
        error: ( error ) => {
          // 請求出現錯誤
          console.error('Error fetching RIS Device:', error);
        },
        complete: () => {
          console.log('RIS Device List fetch completed');
        }
      });
    }
  }

  openCreateModal() {
    this.formValidated = false;
    this.createForm = this.fb.group({
      'name': new FormControl('', [Validators.required]),
      'risUrl': new FormControl('', [Validators.required, this.urlValidator()])
    });
    this.createModalRef = this.dialog.open(this.createRISModal, { id: 'createRISModal' });
    this.createModalRef.afterClosed().subscribe(() => {
      this.formValidated = false;
    });
  }
  urlValidator() {
    return (control: FormControl) => {
      const urlPattern = /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/i;
      if (control.value && !urlPattern.test(control.value)) {
        return { invalidUrl: true };
      }
      return null;
    };
  }

  create() {
    this.formValidated = true;
    if (!this.createForm.valid) {
      return;
    }
    this.isLoading = true;
    const body = this.createForm.value;
    console.log(body);
    this.apiForRISMgmt.createRisDevice(body).subscribe({
      next: ( res ) => {
        console.log('createRisDevice:');
        console.log(res.status);
        if (res !== null) {
          this.createModalRef.close();
          this.getAllRisDevice();
          this.isLoading = false;
        }
      },
      error: ( error ) => {
        console.error('Error Integrate RIS Device:', error);
        setTimeout(() => {
          this.isLoading = false;
        }, 3000);
        this.createModalRef.close();
      }
    });
  }

  openDeleteModal(allRisDevice: AllRisDevice) {
    this.selectRISDevice = allRisDevice;
    this.deleteModalRef = this.dialog.open(this.deleteModal, { id: 'deleteModal' });
  }

  delete() {
    if (this.commonService.isLocal) {
      /* local file test */
      for (let i = 0; i < this.commonService.allRisDevice.length; i++) {
        if (this.selectRISDevice.id === this.commonService.allRisDevice[i].id) {
          this.commonService.allRisDevice.splice(i, 1);
          break;
        }
      }
      this.deleteModalRef.close();
    } else {
      this.apiForRISMgmt.deleteRisDevice( this.selectRISDevice.id ).subscribe({
        next: ( response ) => {
          console.log( 'RIS removed successfully', response );
          this.deleteModalRef.close();
          this.getAllRisDevice();
        },
        error: ( error ) => {
          console.error('Failed to remove RIS:', error);
        }
      });
    }
  }
  risListDeal() {
    // refresh
    this.refreshTimeout = window.setTimeout(() => this.getAllRisDevice(), this.refreshTime * 1000);
  }

  pageChanged(page: number) {
    this.p = page;
  }

  viewPage(allRisDevice: AllRisDevice) {
    this.router.navigate(['/main/ris-mgr/info', allRisDevice.id,allRisDevice.name, allRisDevice.risUrl]);
  }

}
