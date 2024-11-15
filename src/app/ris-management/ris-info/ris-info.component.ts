import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonService } from './../../shared/common.service';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import * as _ from 'lodash';
import { LanguageService } from 'src/app/shared/service/language.service';
// For import APIs of RIS Management 
import { ApiForRISMgmt } from 'src/app/shared/api/For_RIS_Mgmt';
//RIS info
export interface RisProfile {
  risid: string;
  profileid: string;
  angle: {
    polar: number;
    azimuth: number;
  };
  horz_gain: number[][];
  vert_gain: number[][];
  horz_element_array: number[][];
  vert_element_array: number[][];
}

export interface RisInfo {
  status: string;
  dimension: {
    rows: number;
    columns: number;
  };
  size: {
    width: number;
    height: number;
    depth: number;
  };
  position: {
    x: number;
    y: number;
    z: number;
  };
  orientation: {
    polar: number;
    azimuth: number;
  };
  material: string;
  temperature: {
    value: number;
    unit: string;
  };
  power_consumption: {
    value: number;
    unit: string;
  };
  running_profile: {
    id: string;
    angle: {
      polar: number;
      azimuth: number;
    };
    horz_co_gain: number[][];
    vert_co_gain: number[][];
    horz_element_array: number[][];
    vert_element_array: number[][];
  };
}

export interface RisLogs {
  log_time: string;
  log_level: string;
  log_msg: string;
}

export interface AlarmMessage {
  alarm_raised_time: string;
  severity: string;
  fault_text: string;
  alarm_updated_time: string;
  is_cleared: boolean;
  alarm_cleared_time: string;
}

@Component({
  selector: 'app-ris-info',
  templateUrl: './ris-info.component.html',
  styleUrls: ['./ris-info.component.scss']
})


export class RISInfoComponent implements OnInit {
  sessionId: string = '';
  cloudId: string = '';
  cloudName: string = '';
  newip: string = '';
  comId: string = '';
  // 6GSandBox
  risInfo: RisInfo = {} as RisInfo;
  risLogs: RisLogs[] = [];
  name: string = '';
  risUrl: string = '';
  id: string = '';
  elementArray: number[][] = [];
  jsonData: any = {};
  horizontalData: number[][] = [];
  tableData: number[][] = [];
  rowValue: number= 0;
  elementRow: number= 1;
  elementColumn: number= 1;
  selectRISprofileId!: RisProfile;
  refreshTime: number = 3;
  refreshTimeout!: any;
  @ViewChild('faultRISModal') faultRISModal: any;
  @ViewChild('applyRISModal') applyRISModal: any;
  @ViewChild('viewRISProfile') viewRISProfile: any;
  @ViewChild('noticeApplySoftwareModal') noticeApplySoftwareModal: any;
  @ViewChild('applySoftwareStatusModal') applySoftwareStatusModal: any;
  applySoftwareStatusModalRef!: MatDialogRef<any>;
  applySoftwareModalRef!: MatDialogRef<any>;
  updateModalRef!: MatDialogRef<any>;
  updateIPModalRef!: MatDialogRef<any>;
  updateForm!: FormGroup;
  formValidated = false;
  isLoading = false;
  p: number = 1;
  pageSize: number = 10;
  totalItems: number = 0;
  
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    public commonService: CommonService,
    private dialog: MatDialog,
    public languageService: LanguageService,
    public apiForRISMgmt: ApiForRISMgmt
  ) {
  }

  ngOnInit(): void {
    this.sessionId = this.commonService.getSessionId();
    this.route.params.subscribe((params) => {
      this.name = params['name'];
      this.id = params['id'];
      this.risUrl = params['risUrl'];
    });
    this.getRisInfo();
    this.getAllProfile();
  }
  ngOnDestroy() {
    clearTimeout(this.refreshTimeout);
  }
  submit() {
    this.generateTableData(this.elementRow, this.elementColumn);
  }
  generateTableData(rows: number, columns: number): void {
    this.elementRow = rows;
    this.elementColumn = columns;
    this.tableData = [];
    for (let i = 0; i < columns; i++) {
      const row = [];
      for (let j = 0; j < rows; j++) {
        row.push(Math.round(Math.random()));
      }
      this.tableData.push(row);
    }
  }
  //local element
  localcellStyle(row: number, column: number): any {
    const cellSize = Math.min(300 / this.elementColumn, 300 / this.elementRow);
    return {
      'width.px': cellSize,
      'height.px': cellSize,
      'background-color': this.tableData[row][column] === 1 ? 'rgb(233, 79, 79)' : ''
    };
  }
  
  horizontalcellStyle(row: number, column: number): any {
    const cellSize = Math.min(300 / this.risInfo.dimension.rows, 300 / this.risInfo.dimension.columns);
    return {
      'width.px': cellSize,
      'height.px': cellSize,
      'background-color': this.risInfo.running_profile.horz_element_array[row][column] === 1 ? 'rgb(233, 79, 79)' : ''
      };
  }
  verticalcellStyle(row: number, column: number): any {
    const cellSize = Math.min(300 / this.risInfo.dimension.rows, 300 / this.risInfo.dimension.columns);
    return {
      'width.px': cellSize,
      'height.px': cellSize,
      'background-color': this.risInfo.running_profile.vert_element_array[row][column] === 1 ? 'rgb(233, 79, 79)' : ''
      };
  }

  horizontalcellprofile(row: number, column: number): any {
    const cellSize = Math.min(300 / this.risInfo.dimension.rows, 300 / this.risInfo.dimension.columns);
    return {
      'width.px': cellSize,
      'height.px': cellSize,
      'background-color': this.horzElementArray[row][column] === 1 ? 'rgb(233, 79, 79)' : ''
      };
  }
  verticalcellprofile(row: number, column: number): any {
    const cellSize = Math.min(300 / this.risInfo.dimension.rows, 300 / this.risInfo.dimension.columns);
    return {
      'width.px': cellSize,
      'height.px': cellSize,
      'background-color': this.vertElementArray[row][column] === 1 ? 'rgb(233, 79, 79)' : ''
      };
  }

  //RIS Info
  getRisInfo() {
    clearTimeout(this.refreshTimeout);
    if (this.commonService.isLocal) {
      /* local file test */
      this.risInfo = this.commonService.risInfo;
    } else {
      this.apiForRISMgmt.getRisDeviceInfo(this.id).subscribe(
        res => {
          console.log('getRisDeviceInfo: Running Profile ID', res.running_profile.id);
          this.risInfo = res;
          this.elementArray = res.running_profile.elementArray;
          this.refresh();
        }
      );
    }
  }
  
  risProfile: RisProfile[] = [];
  //All Profile
  getAllProfile() {
    if (this.commonService.isLocal) {
      /* local file test */
      this.risProfile = this.commonService.risProfile;
    } else {
      this.apiForRISMgmt.getRisDeviceProfileList(this.id).subscribe({
        next: ( res ) => {
          console.log('getRisDeviceProfileList:');
          console.log(res);
          this.risProfile = res;
        },
        error: ( error ) => {
          // 請求出現錯誤
          console.error('Error fetching RIS Profile:', error);
          //this.isLoading = false;
        },
        complete: () => {
          console.log('RIS Profile List fetch completed');
          //this.isLoading = false;
        }
      });
    }
  }

  
  
  exportToCSV() {
    let dataToExport: RisLogs[] = [];
    if (this.commonService.isLocal) {
      /* local file test */
      dataToExport = this.commonService.risLogs;
    } else {
      this.apiForRISMgmt.getRisLog(this.id).subscribe({
        next: ( res ) => {
          console.log('getRisLog:');
          dataToExport = res;
          console.log(dataToExport);
          const csvData = this.convertToCSV(dataToExport);
          const blob = new Blob([csvData], { type: 'text/csv' });
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          const fileName = `ris_`+this.name+`.csv`;
          a.download = fileName;
          a.click();
          window.URL.revokeObjectURL(url);
        },
        error: ( error ) => {
          // 請求出現錯誤
          console.error('Error fetching RIS Log:', error);
          //this.isLoading = false;
        },
      });
    }
    
  }

  convertToCSV(data: any[]): string {
    const header = Object.keys(data[0]).join(',');
    const rows = data.map(row => {
      return Object.values(row).map(value => {
        const stringValue = typeof value === 'string' ? value : String(value);
        const escapedStringValue = stringValue.replace(/"/g, '""');
        return `"${escapedStringValue}"`;
      }).join(',');
    });
    return [header, ...rows].join('\n');
  }

  refresh() {
    this.refreshTimeout = window.setTimeout(() => this.getRisInfo(), this.refreshTime * 1000);
  }

  back() {
    this.router.navigate(['/main/ris-mgr']);
  }
  
  risProfileModalRef!: MatDialogRef<any>;
  horzElementArray: number[][] = [];
  vertElementArray: number[][] = [];
  openrisProfileModal(risProfile: RisProfile) {
    this.selectRISprofileId = risProfile;
    //this.selectedProfileId = risProfile.profileid;
    //const selectedProfile = this.risProfile.find(profile => profile.profileid === this.selectRISprofileId.profileid);
    if (this.selectRISprofileId) {
      this.horzElementArray = this.selectRISprofileId.horz_element_array;
      this.vertElementArray = this.selectRISprofileId.vert_element_array;
    } else {
      console.error('Profile with ID not found.');
    }
    this.risProfileModalRef = this.dialog.open(this.viewRISProfile, { id: 'viewRISProfile' });
  }

  applyModalRef!: MatDialogRef<any>;
  openApplyModal(risProfile: RisProfile) {
    this.selectRISprofileId = risProfile;
    this.applyModalRef = this.dialog.open(this.applyRISModal, { id: 'applyRISModal' });
  }

  applyRisProfile(){
    this.isLoading = true;
    const body: any = {
      risUrl: this.risUrl,
      globalRisId: this.selectRISprofileId.risid,
      profileId: this.selectRISprofileId.profileid
    };
    this.isLoading = true;
    this.apiForRISMgmt.apply_ris_profile(body).subscribe({
      next: ( res ) => {
        console.log('apply_ris_profile:');
        console.log(res);
        if (res !== null) {
            this.isLoading = false;
          this.applyModalRef.close();
          this.getRisInfo();
          this.getAllProfile();
        }
      },
      error: ( error ) => {
        console.error('Error Integrate RIS Device:', error);
        setTimeout(() => {
          this.isLoading = false;
        }, 3000);
        this.applyModalRef.close();
      }
    });
  }

  faultModalRef!: MatDialogRef<any>;
  openFaultModal() {
    this.faultModalRef = this.dialog.open(this.faultRISModal, { id: 'faultRISModal' });
  }

  alarmMessage: AlarmMessage[] = [];
  alarm(){
    if (this.commonService.isLocal) {
      /* local file test */
      this.alarmMessage = this.commonService.alarmMessage;
      console.log(this.alarmMessage);
    } else {
      this.apiForRISMgmt.getAlarms(this.id).subscribe(
        res => {
          console.log('getAlarm:');
          this.alarmMessage = res;
        }
      );
    }
  }
  pageChanged(page: number) {
    this.p = page;
  }
}
