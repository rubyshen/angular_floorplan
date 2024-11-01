
import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient, HttpParams  } from '@angular/common/http';
import { FormGroup } from '@angular/forms';
import * as _ from 'lodash';
import { Observable } from 'rxjs';
import { Item } from './models/item';

//6G-SandBox
import { AllRisDevice } from './../ris-management/ris-management.component';
import { RisProfile, RisInfo, RisLogs, AlarmMessage } from '../ris-management/ris-info/ris-info.component';
import { Getfield } from './../planner-management/planner-management.component';

export interface NowTime {
  year: string;
  month: string;
  day: string;
  hour: string;
  minute: string;
  second: string;
}

@Injectable({
  providedIn: 'root'
})
export class CommonService {

      isLocal !: boolean;
     restPath !: string;
      options = { headers: new HttpHeaders({ 'Content-Type': 'multipart/form-data' }) };
  constructor ( 
    
    private http: HttpClient
    
  ) {}
  
  loadConfig(): Promise<boolean> {
    return new Promise((resolve, reject) => {
      this.http.get('./assets/config/connection.json').subscribe({
        next: (res: any) => {
          this.isLocal = res['local'];
          this.restPath = res['url'] + ':' + res['port'] + res['root'];
          resolve(true);
        },
        error: (error) => {
          console.error('Could not load config', error);
          reject(error);
        }
      });
    });
  }
  
  setSessionId(sessionId: string) {
    window.sessionStorage.setItem('sessionId', sessionId);
  }

  getSessionId(): string {
    return window.sessionStorage.getItem('sessionId') as string;
  }

  removeSessionId() {
    window.sessionStorage.removeItem('sessionId');
  }

  colorOne(): string {
    const styleType = window.sessionStorage.getItem('styleType');
    if (styleType === 'black') {
      return '#4FFF4F';
    } else {
      return '#27a327';
    }
  }

  colorTwo(): string {
    const styleType = window.sessionStorage.getItem('styleType');
    if (styleType === 'black') {
      return '#FFC14F';
    } else {
      return '#fc8f2a';
    }
  }

  colorThree(): string {
    const styleType = window.sessionStorage.getItem('styleType');
    if (styleType === 'black') {
      return '#FF3B3B';
    } else {
      return '#e90000';
    }
  }

  getNowTime(): NowTime {
    const d = new Date();
    const year = _.toString(d.getFullYear());
    const month = this.addZero(d.getMonth() + 1);
    const day = this.addZero(d.getDate());
    const hour = this.addZero(d.getHours());
    const minute = this.addZero(d.getMinutes());
    const second = this.addZero(d.getSeconds());
    return {
      year: year,
      month: month,
      day: day,
      hour: hour,
      minute: minute,
      second: second
    }
  }

  addZero(t: number): string {
    const tStr = _.toString(t);
    if (tStr.length === 1) {
      return '0' + tStr;
    } else {
      return tStr;
    }
  }

  dealPostDate(time: any): string {
    const date = new Date(time);
    const year = date.getFullYear();
    const month = this.addZero(date.getMonth() + 1);
    const day = this.addZero(date.getDate());
    const hour = this.addZero(date.getHours());
    const minute = this.addZero(date.getMinutes());
    return `${year}-${month}-${day} ${hour}:${minute}`;
  }

  severityText(severity: string): string {
    if (severity.toUpperCase() === 'CRITICAL') {
      return 'Critical';
    } else if (severity.toUpperCase() === 'MAJOR') {
      return 'Major';
    } else if (severity.toUpperCase() === 'MINOR') {
      return 'Minor';
    } else if (severity.toUpperCase() === 'WARNING') {
      return 'Warning';
    } else {
      return '';
    }
  }

  IRM_severityText(severity: string): string {
    // 將傳入的 severity 字串轉換成大寫，並檢查是否等於 'CRITICAL'
    if (severity.toUpperCase() === 'alarmCriticalNum') {
      // 如果是 'alarmCriticalNum'，則返回字串 'Critical'
      return 'Critical';
    } else if (severity.toUpperCase() === 'alarmMajorNum') {
      // 如果 severity 為 'alarmMajorNum'，則返回字串 'Major'
      return 'Major';
    } else if (severity.toUpperCase() === 'alarmMinorNum') {
      // 如果 severity 為 'alarmMinorNum'，則返回字串 'Minor'
      return 'Minor';
    } else if (severity.toUpperCase() === 'alarmWarningNum') {
      // 如果 severity 為 'alarmWarningNum'，則返回字串 'Warning'
      return 'Warning';
    } else {
      // 如果 severity 不是上述任何一個值，則返回空字串
      return '';
    }
  }
  /* 第一個字母大寫，其餘小寫 */
  textTransfer(text: string) {
    if (text) {
      return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
    } else {
      return '';
    }
  }

  /* Json Model */
  allRisDevice: AllRisDevice[] = [
    {
      id: "1",
      name: "RIS01",
      risUrl: "10.0.2.15", 
    },
    {
      id: "2",
      name: "RIS02",
      risUrl: "10.0.2.16",
    },
    {
      id: "3",
      name: "RIS03",
      risUrl: "10.0.2.17",
    },
    {
      id: "4",
      name: "RIS04",
      risUrl: "10.0.2.16", 
    },
    {
      id: "5",
      name: "RIS05",
      risUrl: "10.0.2.17",
    },
    {
      id: "6",
      name: "RIS06",
      risUrl: "10.0.2.16",
    },
    {
      id: "7",
      name: "RIS07",
      risUrl: "10.0.2.17",
    },
    {
      id: "8",
      name: "RIS08",
      risUrl: "10.0.2.16",
    },
    {
      id: "9",
      name: "RIS09",
      risUrl: "10.0.2.17",
    },
    {
      id: "10",
      name: "RIS10",
      risUrl: "10.0.2.16",
    },
    {
      id: "11",
      name: "RIS11",
      risUrl: "10.0.2.17",
    }
  ];

  risProfile: RisProfile[] = [
    {
      risid: "7F84023F-7D47-4876-8513-BB1B31CE7228",
      profileid: "00001",
      angle: {
        polar: 30,
        azimuth: 45
      },
      horz_gain: [
        [-19.6,-25.5,-20.3,-4.4,-2.2,-9.4,-20.1,-25.5,-0.8,-0.2,-28.4,-5.3,-27.2,-2.4,-17,-3.4,-7.9,-16.4,-16.4,-14.5,-13.9,-13.4,-25.4,-15.1,-17],
        [-7,-15.4,-2,-17.9,-25,-21.1,-13.9,-7.7,-11.3,-18,-11.2,-11.3,-15.1,-13.8,-0.7,-17.8,-16.4,-21,-9,-7.8,-19.9,-10.4,-15.6,-5.6,-4.8],
        [-7.5,-7.3,-16.2,-25.1,-4.7,-7.5,-6.9,-4.9,-4.6,-9,-1,-15.2,-28.1,-24.3,-4.6,-12.5,-4.3,-29.2,-2.8,-5.9,-7.2,-2.3,-11.5,-17.2,-16.6],
        [-0.7,-11.9,-11.3,-16.6,-3.9,-8.1,-13.4,-28.2,-8.9,-2.5,-27.7,-28.7,-15.9,-13.8,-8.1,-1.2,-19.8,-7,-0.5,-4.2,-22.5,-6.2,-8.9,-29.8,-12.4],
        [-21.2,-20.1,-8.7,-21.3,-12.2,-18.2,-24,-23.1,-26.2,-9.3,-15.8,-20.4,-11.3,-4.3,-14.2,-9,-23,-3.5,-25.2,-0.8,-19.3,-8.9,-10,-12,-18.6],
        [-28.8,-23.1,-16.1,-7.2,-16.5,-12.2,-6.8,-27.1,-7.3,-7,-9.4,-10.3,-1.8,-27.1,-18.9,-8,-28.1,-8.1,-14.6,-5.7,-3.8,-4.8,-30,-0.8,-17.9],
        [-17.7,-6.7,-17.8,-28,-19.5,-3.4,-2.9,-6.3,-6.1,-22.9,-17.5,-2.4,-24.4,-11.3,-15.2,-2.6,-16.1,-14.9,-26.7,-20.7,-26.8,-0.9,-26.8,-6.6,-22.9],
        [-8.6,-11,-5.2,-0.1,-6.6,-18.3,-23.5,-8.8,-16.3,-15.8,-27.9,-3.1,-1,-11.9,-19.9,-20.2,-24.8,-24.7,-16.7,-19.5,-25.5,-19.5,-8.2,-8.1,-25.6],
        [-9.8,-9.5,-1.2,-19.3,-24.1,-29.8,-16,-8.9,-27.9,-0.3,-4.5,-2.6,-11.6,-29.7,-22.4,-22.3,-7.5,-12.9,-17.7,-17.3,-21,-7.3,-13.6,-18,-25],
        [-2.2,-14,-15.8,-5.7,-2.9,-2.9,-28.5,-10.7,-24,-22.7,-17.1,-0.7,-17.4,-14.3,-16.7,-27.7,-17.3,-19.3,-15.2,-11.7,-11.1,-1.7,-16,-19.1,-16.7],
        [-10,-3.9,-14.9,-4.4,-9.5,-12.6,-1.3,-1.7,-8.2,-8.5,-12.2,-18.7,-16.5,-18.6,-5.8,-7.2,-22.9,-22.7,-1.4,-20,-27.1,-14.6,-8.9,-17,-11],
        [-27.3,-3.4,-3.5,-16.5,-14.6,-9.5,-7.7,-19.7,-3.3,-21.5,-9.8,-6.3,-7.7,-28.9,-12,-4.4,-10.2,-27.4,-15.5,-15.5,-13.7,-26.5,-13.7,-14.9,-19.5],
        [-17,-12.6,-26.6,-21.5,-1.6,-5.6,-8.7,-6.6,-2.6,-26,-26.2,-4.6,-19.5,-11.7,-0.6,-7,-1.9,-7.8,-6.3,-5.2,-28.2,-26.8,-2.1,-26.5,-25.2]
      ],
      vert_gain: [
        [-19.6,-25.5,-20.3,-4.4,-2.2,-9.4,-20.1,-25.5,-0.8,-0.2,-28.4,-5.3,-27.2,-2.4,-17,-3.4,-7.9,-16.4,-16.4,-14.5,-13.9,-13.4,-25.4,-15.1,-17],
        [-7,-15.4,-2,-17.9,-25,-21.1,-13.9,-7.7,-11.3,-18,-11.2,-11.3,-15.1,-13.8,-0.7,-17.8,-16.4,-21,-9,-7.8,-19.9,-10.4,-15.6,-5.6,-4.8],
        [-7.5,-7.3,-16.2,-25.1,-4.7,-7.5,-6.9,-4.9,-4.6,-9,-1,-15.2,-28.1,-24.3,-4.6,-12.5,-4.3,-29.2,-2.8,-5.9,-7.2,-2.3,-11.5,-17.2,-16.6],
        [-0.7,-11.9,-11.3,-16.6,-3.9,-8.1,-13.4,-28.2,-8.9,-2.5,-27.7,-28.7,-15.9,-13.8,-8.1,-1.2,-19.8,-7,-0.5,-4.2,-22.5,-6.2,-8.9,-29.8,-12.4],
        [-21.2,-20.1,-8.7,-21.3,-12.2,-18.2,-24,-23.1,-26.2,-9.3,-15.8,-20.4,-11.3,-4.3,-14.2,-9,-23,-3.5,-25.2,-0.8,-19.3,-8.9,-10,-12,-18.6],
        [-28.8,-23.1,-16.1,-7.2,-16.5,-12.2,-6.8,-27.1,-7.3,-7,-9.4,-10.3,-1.8,-27.1,-18.9,-8,-28.1,-8.1,-14.6,-5.7,-3.8,-4.8,-30,-0.8,-17.9],
        [-17.7,-6.7,-17.8,-28,-19.5,-3.4,-2.9,-6.3,-6.1,-22.9,-17.5,-2.4,-24.4,-11.3,-15.2,-2.6,-16.1,-14.9,-26.7,-20.7,-26.8,-0.9,-26.8,-6.6,-22.9],
        [-8.6,-11,-5.2,-0.1,-6.6,-18.3,-23.5,-8.8,-16.3,-15.8,-27.9,-3.1,-1,-11.9,-19.9,-20.2,-24.8,-24.7,-16.7,-19.5,-25.5,-19.5,-8.2,-8.1,-25.6],
        [-9.8,-9.5,-1.2,-19.3,-24.1,-29.8,-16,-8.9,-27.9,-0.3,-4.5,-2.6,-11.6,-29.7,-22.4,-22.3,-7.5,-12.9,-17.7,-17.3,-21,-7.3,-13.6,-18,-25],
        [-2.2,-14,-15.8,-5.7,-2.9,-2.9,-28.5,-10.7,-24,-22.7,-17.1,-0.7,-17.4,-14.3,-16.7,-27.7,-17.3,-19.3,-15.2,-11.7,-11.1,-1.7,-16,-19.1,-16.7],
        [-10,-3.9,-14.9,-4.4,-9.5,-12.6,-1.3,-1.7,-8.2,-8.5,-12.2,-18.7,-16.5,-18.6,-5.8,-7.2,-22.9,-22.7,-1.4,-20,-27.1,-14.6,-8.9,-17,-11],
        [-27.3,-3.4,-3.5,-16.5,-14.6,-9.5,-7.7,-19.7,-3.3,-21.5,-9.8,-6.3,-7.7,-28.9,-12,-4.4,-10.2,-27.4,-15.5,-15.5,-13.7,-26.5,-13.7,-14.9,-19.5],
        [-17,-12.6,-26.6,-21.5,-1.6,-5.6,-8.7,-6.6,-2.6,-26,-26.2,-4.6,-19.5,-11.7,-0.6,-7,-1.9,-7.8,-6.3,-5.2,-28.2,-26.8,-2.1,-26.5,-25.2]
      ],
      horz_element_array: [
        [1,1,0,0],[1,1,1,1],[0,1,1,0],[0,1,1,1]
      ],
      vert_element_array: [
        [1,1,0,0],[1,1,1,1],[0,1,1,0],[0,1,1,1]
      ]
    },
    {
      risid: "7F84023F-7D47-4876-8513-BB1B31CE7228",
      profileid: "00002",
      angle: {
        polar: 33,
        azimuth: 45
      },
      horz_gain: [
        [-19.6,-25.5,-20.3,-4.4,-2.2,-9.4,-20.1,-25.5,-0.8,-0.2,-28.4,-5.3,-27.2,-2.4,-17,-3.4,-7.9,-16.4,-16.4,-14.5,-13.9,-13.4,-25.4,-15.1,-17],
        [-7,-15.4,-2,-17.9,-25,-21.1,-13.9,-7.7,-11.3,-18,-11.2,-11.3,-15.1,-13.8,-0.7,-17.8,-16.4,-21,-9,-7.8,-19.9,-10.4,-15.6,-5.6,-4.8],
        [-7.5,-7.3,-16.2,-25.1,-4.7,-7.5,-6.9,-4.9,-4.6,-9,-1,-15.2,-28.1,-24.3,-4.6,-12.5,-4.3,-29.2,-2.8,-5.9,-7.2,-2.3,-11.5,-17.2,-16.6],
        [-0.7,-11.9,-11.3,-16.6,-3.9,-8.1,-13.4,-28.2,-8.9,-2.5,-27.7,-28.7,-15.9,-13.8,-8.1,-1.2,-19.8,-7,-0.5,-4.2,-22.5,-6.2,-8.9,-29.8,-12.4],
        [-21.2,-20.1,-8.7,-21.3,-12.2,-18.2,-24,-23.1,-26.2,-9.3,-15.8,-20.4,-11.3,-4.3,-14.2,-9,-23,-3.5,-25.2,-0.8,-19.3,-8.9,-10,-12,-18.6],
        [-28.8,-23.1,-16.1,-7.2,-16.5,-12.2,-6.8,-27.1,-7.3,-7,-9.4,-10.3,-1.8,-27.1,-18.9,-8,-28.1,-8.1,-14.6,-5.7,-3.8,-4.8,-30,-0.8,-17.9],
        [-17.7,-6.7,-17.8,-28,-19.5,-3.4,-2.9,-6.3,-6.1,-22.9,-17.5,-2.4,-24.4,-11.3,-15.2,-2.6,-16.1,-14.9,-26.7,-20.7,-26.8,-0.9,-26.8,-6.6,-22.9],
        [-8.6,-11,-5.2,-0.1,-6.6,-18.3,-23.5,-8.8,-16.3,-15.8,-27.9,-3.1,-1,-11.9,-19.9,-20.2,-24.8,-24.7,-16.7,-19.5,-25.5,-19.5,-8.2,-8.1,-25.6],
        [-9.8,-9.5,-1.2,-19.3,-24.1,-29.8,-16,-8.9,-27.9,-0.3,-4.5,-2.6,-11.6,-29.7,-22.4,-22.3,-7.5,-12.9,-17.7,-17.3,-21,-7.3,-13.6,-18,-25],
        [-2.2,-14,-15.8,-5.7,-2.9,-2.9,-28.5,-10.7,-24,-22.7,-17.1,-0.7,-17.4,-14.3,-16.7,-27.7,-17.3,-19.3,-15.2,-11.7,-11.1,-1.7,-16,-19.1,-16.7],
        [-10,-3.9,-14.9,-4.4,-9.5,-12.6,-1.3,-1.7,-8.2,-8.5,-12.2,-18.7,-16.5,-18.6,-5.8,-7.2,-22.9,-22.7,-1.4,-20,-27.1,-14.6,-8.9,-17,-11],
        [-27.3,-3.4,-3.5,-16.5,-14.6,-9.5,-7.7,-19.7,-3.3,-21.5,-9.8,-6.3,-7.7,-28.9,-12,-4.4,-10.2,-27.4,-15.5,-15.5,-13.7,-26.5,-13.7,-14.9,-19.5],
        [-17,-12.6,-26.6,-21.5,-1.6,-5.6,-8.7,-6.6,-2.6,-26,-26.2,-4.6,-19.5,-11.7,-0.6,-7,-1.9,-7.8,-6.3,-5.2,-28.2,-26.8,-2.1,-26.5,-25.2]
      ],
      vert_gain: [
        [-19.6,-25.5,-20.3,-4.4,-2.2,-9.4,-20.1,-25.5,-0.8,-0.2,-28.4,-5.3,-27.2,-2.4,-17,-3.4,-7.9,-16.4,-16.4,-14.5,-13.9,-13.4,-25.4,-15.1,-17],
        [-7,-15.4,-2,-17.9,-25,-21.1,-13.9,-7.7,-11.3,-18,-11.2,-11.3,-15.1,-13.8,-0.7,-17.8,-16.4,-21,-9,-7.8,-19.9,-10.4,-15.6,-5.6,-4.8],
        [-7.5,-7.3,-16.2,-25.1,-4.7,-7.5,-6.9,-4.9,-4.6,-9,-1,-15.2,-28.1,-24.3,-4.6,-12.5,-4.3,-29.2,-2.8,-5.9,-7.2,-2.3,-11.5,-17.2,-16.6],
        [-0.7,-11.9,-11.3,-16.6,-3.9,-8.1,-13.4,-28.2,-8.9,-2.5,-27.7,-28.7,-15.9,-13.8,-8.1,-1.2,-19.8,-7,-0.5,-4.2,-22.5,-6.2,-8.9,-29.8,-12.4],
        [-21.2,-20.1,-8.7,-21.3,-12.2,-18.2,-24,-23.1,-26.2,-9.3,-15.8,-20.4,-11.3,-4.3,-14.2,-9,-23,-3.5,-25.2,-0.8,-19.3,-8.9,-10,-12,-18.6],
        [-28.8,-23.1,-16.1,-7.2,-16.5,-12.2,-6.8,-27.1,-7.3,-7,-9.4,-10.3,-1.8,-27.1,-18.9,-8,-28.1,-8.1,-14.6,-5.7,-3.8,-4.8,-30,-0.8,-17.9],
        [-17.7,-6.7,-17.8,-28,-19.5,-3.4,-2.9,-6.3,-6.1,-22.9,-17.5,-2.4,-24.4,-11.3,-15.2,-2.6,-16.1,-14.9,-26.7,-20.7,-26.8,-0.9,-26.8,-6.6,-22.9],
        [-8.6,-11,-5.2,-0.1,-6.6,-18.3,-23.5,-8.8,-16.3,-15.8,-27.9,-3.1,-1,-11.9,-19.9,-20.2,-24.8,-24.7,-16.7,-19.5,-25.5,-19.5,-8.2,-8.1,-25.6],
        [-9.8,-9.5,-1.2,-19.3,-24.1,-29.8,-16,-8.9,-27.9,-0.3,-4.5,-2.6,-11.6,-29.7,-22.4,-22.3,-7.5,-12.9,-17.7,-17.3,-21,-7.3,-13.6,-18,-25],
        [-2.2,-14,-15.8,-5.7,-2.9,-2.9,-28.5,-10.7,-24,-22.7,-17.1,-0.7,-17.4,-14.3,-16.7,-27.7,-17.3,-19.3,-15.2,-11.7,-11.1,-1.7,-16,-19.1,-16.7],
        [-10,-3.9,-14.9,-4.4,-9.5,-12.6,-1.3,-1.7,-8.2,-8.5,-12.2,-18.7,-16.5,-18.6,-5.8,-7.2,-22.9,-22.7,-1.4,-20,-27.1,-14.6,-8.9,-17,-11],
        [-27.3,-3.4,-3.5,-16.5,-14.6,-9.5,-7.7,-19.7,-3.3,-21.5,-9.8,-6.3,-7.7,-28.9,-12,-4.4,-10.2,-27.4,-15.5,-15.5,-13.7,-26.5,-13.7,-14.9,-19.5],
        [-17,-12.6,-26.6,-21.5,-1.6,-5.6,-8.7,-6.6,-2.6,-26,-26.2,-4.6,-19.5,-11.7,-0.6,-7,-1.9,-7.8,-6.3,-5.2,-28.2,-26.8,-2.1,-26.5,-25.2]
      ],
      horz_element_array: [
        [1,1,0,0],[1,1,1,1],[0,1,1,0],[0,1,1,1]
      ],
      vert_element_array: [
        [1,1,0,0],[1,1,1,1],[0,1,1,0],[0,1,1,1]
      ]
    },
    {
      risid: "7F84023F-7D47-4876-8513-BB1B31CE7228",
      profileid: "00003",
      angle: {
        polar: 38,
        azimuth: 33
      },
      horz_gain: [
        [-19.6,-25.5,-20.3,-4.4,-2.2,-9.4,-20.1,-25.5,-0.8,-0.2,-28.4,-5.3,-27.2,-2.4,-17,-3.4,-7.9,-16.4,-16.4,-14.5,-13.9,-13.4,-25.4,-15.1,-17],
        [-7,-15.4,-2,-17.9,-25,-21.1,-13.9,-7.7,-11.3,-18,-11.2,-11.3,-15.1,-13.8,-0.7,-17.8,-16.4,-21,-9,-7.8,-19.9,-10.4,-15.6,-5.6,-4.8],
        [-7.5,-7.3,-16.2,-25.1,-4.7,-7.5,-6.9,-4.9,-4.6,-9,-1,-15.2,-28.1,-24.3,-4.6,-12.5,-4.3,-29.2,-2.8,-5.9,-7.2,-2.3,-11.5,-17.2,-16.6],
        [-0.7,-11.9,-11.3,-16.6,-3.9,-8.1,-13.4,-28.2,-8.9,-2.5,-27.7,-28.7,-15.9,-13.8,-8.1,-1.2,-19.8,-7,-0.5,-4.2,-22.5,-6.2,-8.9,-29.8,-12.4],
        [-21.2,-20.1,-8.7,-21.3,-12.2,-18.2,-24,-23.1,-26.2,-9.3,-15.8,-20.4,-11.3,-4.3,-14.2,-9,-23,-3.5,-25.2,-0.8,-19.3,-8.9,-10,-12,-18.6],
        [-28.8,-23.1,-16.1,-7.2,-16.5,-12.2,-6.8,-27.1,-7.3,-7,-9.4,-10.3,-1.8,-27.1,-18.9,-8,-28.1,-8.1,-14.6,-5.7,-3.8,-4.8,-30,-0.8,-17.9],
        [-17.7,-6.7,-17.8,-28,-19.5,-3.4,-2.9,-6.3,-6.1,-22.9,-17.5,-2.4,-24.4,-11.3,-15.2,-2.6,-16.1,-14.9,-26.7,-20.7,-26.8,-0.9,-26.8,-6.6,-22.9],
        [-8.6,-11,-5.2,-0.1,-6.6,-18.3,-23.5,-8.8,-16.3,-15.8,-27.9,-3.1,-1,-11.9,-19.9,-20.2,-24.8,-24.7,-16.7,-19.5,-25.5,-19.5,-8.2,-8.1,-25.6],
        [-9.8,-9.5,-1.2,-19.3,-24.1,-29.8,-16,-8.9,-27.9,-0.3,-4.5,-2.6,-11.6,-29.7,-22.4,-22.3,-7.5,-12.9,-17.7,-17.3,-21,-7.3,-13.6,-18,-25],
        [-2.2,-14,-15.8,-5.7,-2.9,-2.9,-28.5,-10.7,-24,-22.7,-17.1,-0.7,-17.4,-14.3,-16.7,-27.7,-17.3,-19.3,-15.2,-11.7,-11.1,-1.7,-16,-19.1,-16.7],
        [-10,-3.9,-14.9,-4.4,-9.5,-12.6,-1.3,-1.7,-8.2,-8.5,-12.2,-18.7,-16.5,-18.6,-5.8,-7.2,-22.9,-22.7,-1.4,-20,-27.1,-14.6,-8.9,-17,-11],
        [-27.3,-3.4,-3.5,-16.5,-14.6,-9.5,-7.7,-19.7,-3.3,-21.5,-9.8,-6.3,-7.7,-28.9,-12,-4.4,-10.2,-27.4,-15.5,-15.5,-13.7,-26.5,-13.7,-14.9,-19.5],
        [-17,-12.6,-26.6,-21.5,-1.6,-5.6,-8.7,-6.6,-2.6,-26,-26.2,-4.6,-19.5,-11.7,-0.6,-7,-1.9,-7.8,-6.3,-5.2,-28.2,-26.8,-2.1,-26.5,-25.2]
      ],
      vert_gain: [
        [-19.6,-25.5,-20.3,-4.4,-2.2,-9.4,-20.1,-25.5,-0.8,-0.2,-28.4,-5.3,-27.2,-2.4,-17,-3.4,-7.9,-16.4,-16.4,-14.5,-13.9,-13.4,-25.4,-15.1,-17],
        [-7,-15.4,-2,-17.9,-25,-21.1,-13.9,-7.7,-11.3,-18,-11.2,-11.3,-15.1,-13.8,-0.7,-17.8,-16.4,-21,-9,-7.8,-19.9,-10.4,-15.6,-5.6,-4.8],
        [-7.5,-7.3,-16.2,-25.1,-4.7,-7.5,-6.9,-4.9,-4.6,-9,-1,-15.2,-28.1,-24.3,-4.6,-12.5,-4.3,-29.2,-2.8,-5.9,-7.2,-2.3,-11.5,-17.2,-16.6],
        [-0.7,-11.9,-11.3,-16.6,-3.9,-8.1,-13.4,-28.2,-8.9,-2.5,-27.7,-28.7,-15.9,-13.8,-8.1,-1.2,-19.8,-7,-0.5,-4.2,-22.5,-6.2,-8.9,-29.8,-12.4],
        [-21.2,-20.1,-8.7,-21.3,-12.2,-18.2,-24,-23.1,-26.2,-9.3,-15.8,-20.4,-11.3,-4.3,-14.2,-9,-23,-3.5,-25.2,-0.8,-19.3,-8.9,-10,-12,-18.6],
        [-28.8,-23.1,-16.1,-7.2,-16.5,-12.2,-6.8,-27.1,-7.3,-7,-9.4,-10.3,-1.8,-27.1,-18.9,-8,-28.1,-8.1,-14.6,-5.7,-3.8,-4.8,-30,-0.8,-17.9],
        [-17.7,-6.7,-17.8,-28,-19.5,-3.4,-2.9,-6.3,-6.1,-22.9,-17.5,-2.4,-24.4,-11.3,-15.2,-2.6,-16.1,-14.9,-26.7,-20.7,-26.8,-0.9,-26.8,-6.6,-22.9],
        [-8.6,-11,-5.2,-0.1,-6.6,-18.3,-23.5,-8.8,-16.3,-15.8,-27.9,-3.1,-1,-11.9,-19.9,-20.2,-24.8,-24.7,-16.7,-19.5,-25.5,-19.5,-8.2,-8.1,-25.6],
        [-9.8,-9.5,-1.2,-19.3,-24.1,-29.8,-16,-8.9,-27.9,-0.3,-4.5,-2.6,-11.6,-29.7,-22.4,-22.3,-7.5,-12.9,-17.7,-17.3,-21,-7.3,-13.6,-18,-25],
        [-2.2,-14,-15.8,-5.7,-2.9,-2.9,-28.5,-10.7,-24,-22.7,-17.1,-0.7,-17.4,-14.3,-16.7,-27.7,-17.3,-19.3,-15.2,-11.7,-11.1,-1.7,-16,-19.1,-16.7],
        [-10,-3.9,-14.9,-4.4,-9.5,-12.6,-1.3,-1.7,-8.2,-8.5,-12.2,-18.7,-16.5,-18.6,-5.8,-7.2,-22.9,-22.7,-1.4,-20,-27.1,-14.6,-8.9,-17,-11],
        [-27.3,-3.4,-3.5,-16.5,-14.6,-9.5,-7.7,-19.7,-3.3,-21.5,-9.8,-6.3,-7.7,-28.9,-12,-4.4,-10.2,-27.4,-15.5,-15.5,-13.7,-26.5,-13.7,-14.9,-19.5],
        [-17,-12.6,-26.6,-21.5,-1.6,-5.6,-8.7,-6.6,-2.6,-26,-26.2,-4.6,-19.5,-11.7,-0.6,-7,-1.9,-7.8,-6.3,-5.2,-28.2,-26.8,-2.1,-26.5,-25.2]
      ],
      horz_element_array: [
        [1,1,0,0],[1,1,1,1],[0,1,1,0],[0,1,1,1]
      ],
      vert_element_array: [
        [1,1,0,0],[1,1,1,1],[0,1,1,0],[0,1,1,1]
      ]
    }
  ];

  //RIS Info
  risInfo: RisInfo ={
    status: 'ON',
    dimension: {
      rows: 4,
      columns: 4
    },
    size: {
      width: 40,
      height: 40,
      depth: 10
    },
    position: {
      x: 5,
      y: 3,
      z: 2
    },
    orientation: {
      polar: 30,
      azimuth: 45
    },
    material: 'metal',
    temperature: {
      value: 26,
      unit: 'C'
    },
    power_consumption: {
      value: 0.2,
      unit: 'W'
    },
    running_profile: {
      id: '00001',
      angle: {
        polar: 30,
        azimuth: 45
      },
      horz_co_gain: [
        [-19.6,-25.5,-20.3,-4.4,-2.2,-9.4,-20.1,-25.5,-0.8,-0.2,-28.4,-5.3,-27.2,-2.4,-17,-3.4,-7.9,-16.4,-16.4,-14.5,-13.9,-13.4,-25.4,-15.1,-17],
        [-7,-15.4,-2,-17.9,-25,-21.1,-13.9,-7.7,-11.3,-18,-11.2,-11.3,-15.1,-13.8,-0.7,-17.8,-16.4,-21,-9,-7.8,-19.9,-10.4,-15.6,-5.6,-4.8],
        [-7.5,-7.3,-16.2,-25.1,-4.7,-7.5,-6.9,-4.9,-4.6,-9,-1,-15.2,-28.1,-24.3,-4.6,-12.5,-4.3,-29.2,-2.8,-5.9,-7.2,-2.3,-11.5,-17.2,-16.6],
        [-0.7,-11.9,-11.3,-16.6,-3.9,-8.1,-13.4,-28.2,-8.9,-2.5,-27.7,-28.7,-15.9,-13.8,-8.1,-1.2,-19.8,-7,-0.5,-4.2,-22.5,-6.2,-8.9,-29.8,-12.4],
        [-21.2,-20.1,-8.7,-21.3,-12.2,-18.2,-24,-23.1,-26.2,-9.3,-15.8,-20.4,-11.3,-4.3,-14.2,-9,-23,-3.5,-25.2,-0.8,-19.3,-8.9,-10,-12,-18.6],
        [-28.8,-23.1,-16.1,-7.2,-16.5,-12.2,-6.8,-27.1,-7.3,-7,-9.4,-10.3,-1.8,-27.1,-18.9,-8,-28.1,-8.1,-14.6,-5.7,-3.8,-4.8,-30,-0.8,-17.9],
        [-17.7,-6.7,-17.8,-28,-19.5,-3.4,-2.9,-6.3,-6.1,-22.9,-17.5,-2.4,-24.4,-11.3,-15.2,-2.6,-16.1,-14.9,-26.7,-20.7,-26.8,-0.9,-26.8,-6.6,-22.9],
        [-8.6,-11,-5.2,-0.1,-6.6,-18.3,-23.5,-8.8,-16.3,-15.8,-27.9,-3.1,-1,-11.9,-19.9,-20.2,-24.8,-24.7,-16.7,-19.5,-25.5,-19.5,-8.2,-8.1,-25.6],
        [-9.8,-9.5,-1.2,-19.3,-24.1,-29.8,-16,-8.9,-27.9,-0.3,-4.5,-2.6,-11.6,-29.7,-22.4,-22.3,-7.5,-12.9,-17.7,-17.3,-21,-7.3,-13.6,-18,-25],
        [-2.2,-14,-15.8,-5.7,-2.9,-2.9,-28.5,-10.7,-24,-22.7,-17.1,-0.7,-17.4,-14.3,-16.7,-27.7,-17.3,-19.3,-15.2,-11.7,-11.1,-1.7,-16,-19.1,-16.7],
        [-10,-3.9,-14.9,-4.4,-9.5,-12.6,-1.3,-1.7,-8.2,-8.5,-12.2,-18.7,-16.5,-18.6,-5.8,-7.2,-22.9,-22.7,-1.4,-20,-27.1,-14.6,-8.9,-17,-11],
        [-27.3,-3.4,-3.5,-16.5,-14.6,-9.5,-7.7,-19.7,-3.3,-21.5,-9.8,-6.3,-7.7,-28.9,-12,-4.4,-10.2,-27.4,-15.5,-15.5,-13.7,-26.5,-13.7,-14.9,-19.5],
        [-17,-12.6,-26.6,-21.5,-1.6,-5.6,-8.7,-6.6,-2.6,-26,-26.2,-4.6,-19.5,-11.7,-0.6,-7,-1.9,-7.8,-6.3,-5.2,-28.2,-26.8,-2.1,-26.5,-25.2]
      ],
      vert_co_gain: [
        [-19.6,-25.5,-20.3,-4.4,-2.2,-9.4,-20.1,-25.5,-0.8,-0.2,-28.4,-5.3,-27.2,-2.4,-17,-3.4,-7.9,-16.4,-16.4,-14.5,-13.9,-13.4,-25.4,-15.1,-17],
        [-7,-15.4,-2,-17.9,-25,-21.1,-13.9,-7.7,-11.3,-18,-11.2,-11.3,-15.1,-13.8,-0.7,-17.8,-16.4,-21,-9,-7.8,-19.9,-10.4,-15.6,-5.6,-4.8],
        [-7.5,-7.3,-16.2,-25.1,-4.7,-7.5,-6.9,-4.9,-4.6,-9,-1,-15.2,-28.1,-24.3,-4.6,-12.5,-4.3,-29.2,-2.8,-5.9,-7.2,-2.3,-11.5,-17.2,-16.6],
        [-0.7,-11.9,-11.3,-16.6,-3.9,-8.1,-13.4,-28.2,-8.9,-2.5,-27.7,-28.7,-15.9,-13.8,-8.1,-1.2,-19.8,-7,-0.5,-4.2,-22.5,-6.2,-8.9,-29.8,-12.4],
        [-21.2,-20.1,-8.7,-21.3,-12.2,-18.2,-24,-23.1,-26.2,-9.3,-15.8,-20.4,-11.3,-4.3,-14.2,-9,-23,-3.5,-25.2,-0.8,-19.3,-8.9,-10,-12,-18.6],
        [-28.8,-23.1,-16.1,-7.2,-16.5,-12.2,-6.8,-27.1,-7.3,-7,-9.4,-10.3,-1.8,-27.1,-18.9,-8,-28.1,-8.1,-14.6,-5.7,-3.8,-4.8,-30,-0.8,-17.9],
        [-17.7,-6.7,-17.8,-28,-19.5,-3.4,-2.9,-6.3,-6.1,-22.9,-17.5,-2.4,-24.4,-11.3,-15.2,-2.6,-16.1,-14.9,-26.7,-20.7,-26.8,-0.9,-26.8,-6.6,-22.9],
        [-8.6,-11,-5.2,-0.1,-6.6,-18.3,-23.5,-8.8,-16.3,-15.8,-27.9,-3.1,-1,-11.9,-19.9,-20.2,-24.8,-24.7,-16.7,-19.5,-25.5,-19.5,-8.2,-8.1,-25.6],
        [-9.8,-9.5,-1.2,-19.3,-24.1,-29.8,-16,-8.9,-27.9,-0.3,-4.5,-2.6,-11.6,-29.7,-22.4,-22.3,-7.5,-12.9,-17.7,-17.3,-21,-7.3,-13.6,-18,-25],
        [-2.2,-14,-15.8,-5.7,-2.9,-2.9,-28.5,-10.7,-24,-22.7,-17.1,-0.7,-17.4,-14.3,-16.7,-27.7,-17.3,-19.3,-15.2,-11.7,-11.1,-1.7,-16,-19.1,-16.7],
        [-10,-3.9,-14.9,-4.4,-9.5,-12.6,-1.3,-1.7,-8.2,-8.5,-12.2,-18.7,-16.5,-18.6,-5.8,-7.2,-22.9,-22.7,-1.4,-20,-27.1,-14.6,-8.9,-17,-11],
        [-27.3,-3.4,-3.5,-16.5,-14.6,-9.5,-7.7,-19.7,-3.3,-21.5,-9.8,-6.3,-7.7,-28.9,-12,-4.4,-10.2,-27.4,-15.5,-15.5,-13.7,-26.5,-13.7,-14.9,-19.5],
        [-17,-12.6,-26.6,-21.5,-1.6,-5.6,-8.7,-6.6,-2.6,-26,-26.2,-4.6,-19.5,-11.7,-0.6,-7,-1.9,-7.8,-6.3,-5.2,-28.2,-26.8,-2.1,-26.5,-25.2]
      ],
      horz_element_array: [
        [1,1,0,0],[1,1,1,1],[0,1,1,0],[0,1,1,1]
      ],
      vert_element_array: [
        [1,1,0,0],[1,1,1,1],[0,1,1,0],[0,1,1,1]
      ]
    }
  };

  //Logs
  risLogs: RisLogs[] = [
    {
      log_time: "2024-05-05 10:22:12",
      log_level: "Error",
      log_msg: "CPU process error",
    },
    {
      log_time: "2024-05-06 10:22:12",
      log_level: "Error",
      log_msg: "CPU process error",
    },
    {
      log_time: "2024-05-07 10:22:12",
      log_level: "Error",
      log_msg: "CPU process error",
    },
    {
      log_time: "2024-05-08 10:22:12",
      log_level: "Error",
      log_msg: "CPU process error",
    },
    {
      log_time: "2024-05-09 10:22:12",
      log_level: "Error",
      log_msg: "CPU process error",
    },
    {
      log_time: "2024-05-10 10:22:12",
      log_level: "Error",
      log_msg: "CPU process error",
    },
    {
      log_time: "2024-05-11 10:22:12",
      log_level: "Error",
      log_msg: "CPU process error",
    },
    {
      log_time: "2024-05-12 10:22:12",
      log_level: "Error",
      log_msg: "CPU process error",
    },
    {
      log_time: "2024-05-13 10:22:12",
      log_level: "Error",
      log_msg: "CPU process error",
    },
    {
      log_time: "2024-05-14 10:22:12",
      log_level: "Error",
      log_msg: "CPU process error",
    },
    {
      log_time: "2024-05-15 10:22:12",
      log_level: "Error",
      log_msg: "CPU process error",
    },
  ];

  alarmMessage: AlarmMessage[] = [
    {
      alarm_raised_time: "2023-12-12 10:22:12",
      severity: "Critical",
      fault_text: "CPU process error",
      alarm_updated_time: "2023-12-12 10:22:42",
      is_cleared: false,
      alarm_cleared_time: "2023-12-12 10:23:12"
    },
    {
      alarm_raised_time: "2023-12-12 10:22:12",
      severity: "Critical",
      fault_text: "CPU process error",
      alarm_updated_time: "2023-12-12 10:23:12",
      is_cleared: true,
      alarm_cleared_time: "2023-12-12 10:23:12"
    }
  ];

  //GET field planner
  getfield: Getfield[] = [
    {
      profile_id: "00004",
      ris_name: "RIS 1",
      reflection_polar: 30,
      reflection_azimuth: 30,
      orientation_polar: 30,
      orientation_azimuth: 45,
      size_width: 40,
      size_height: 40,
      x: 10,
      y: 15,
      material: "Metal"
    },
    {
      profile_id: "00001",
      ris_name: "RIS 2",
      reflection_polar: 0,
      reflection_azimuth: 25,
      orientation_polar: 30,
      orientation_azimuth: 45,
      size_width: 40,
      size_height: 40,
      x: 10,
      y: 15,
      material: "Steel"
    }
  ];
  

  // @2024/03/22 Add
  // 格式化日期時間至此格式 'YYYYMMDD_HHmm' 
  formatDateForFileName( date: Date ): string {
    
    return date.getFullYear().toString() +
            (date.getMonth() + 1).toString().padStart(2, '0') +
            date.getDate().toString().padStart(2, '0') + '_' +
            date.getHours().toString().padStart(2, '0') +
            date.getMinutes().toString().padStart(2, '0');
  }

  // @2024/03/27 Add
  // 用於處理時間字符串，去掉秒後的小數部分
  formatTimeWithoutSecondsFraction( timeString: string ): string {
    return timeString.split('.')[0]; // 只保留小數點前的部分
  }

 // @2024/03/27 Add
 // 用於處理位置訊息的格式
 formatPosition( positionJson: string ): string {
    try {
      const positionArray = JSON.parse( positionJson );
      return `( ${positionArray[0]}, ${positionArray[1]} )`;
    } catch ( e ) {
      console.error( 'Error parsing position JSON:', e );
      return '';
    }
  }
  downloadExcelFromBase64( base64String: string, fileName: string ) {
    const link = document.createElement("a");

    if ( link.download !== undefined ) {

      // 支援 HTML5 download 屬性的瀏覽器
      link.setAttribute( "href", 'data:application/vnd.ms-excel;base64,' + base64String );
      link.setAttribute( "download", fileName );
      link.style.visibility = 'hidden';
      document.body.appendChild( link );
      link.click();
      document.body.removeChild( link );

    } else {
      console.error( "您的瀏覽器不支援自動下載文件" );
    }
  }

}
