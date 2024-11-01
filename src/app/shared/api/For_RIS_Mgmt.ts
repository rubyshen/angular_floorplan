import { HttpHeaders, HttpClient, HttpParams  } from '@angular/common/http';
import { Injectable }    from '@angular/core';
import { Observable }    from 'rxjs';
import { CommonService } from '../common.service';

@Injectable({
  providedIn: 'root'
})
export class ApiForRISMgmt {

  constructor(
    private http: HttpClient,
    private commonService: CommonService 
  ) {}
  
  restPath = this.commonService.restPath;
  sessionId = this.commonService.getSessionId();

  getAllRisDevice(): Observable<any> {
    const url = `${this.restPath}/getAllRisDevice`;
    return this.http.get(url);
  }
  getRisDeviceProfileList(id: string): Observable<any> {
    const url = `${this.restPath}/getRisDeviceProfileList/${id}`;
    return this.http.get(url);
  }
  getRisDeviceInfo(id: string): Observable<any> {
    const url = `${this.restPath}/getRisDeviceInfo/${id}`;
    return this.http.get(url);
  }
  createRisDevice(body: any): Observable<any> {
    const url = `${this.restPath}/createRisDevice`;
    const bodyStr = JSON.stringify(body);
    return this.http.post(url, bodyStr);
  }
  deleteRisDevice(id: string): Observable<any> {
    const url = `${this.restPath}/deleteRisDevice/${id}`;
    return this.http.delete( url );
  }
  apply_ris_profile(body: any): Observable<any> {
    const url = `${this.restPath}/apply_ris_profile`;
    const bodyStr = JSON.stringify(body);
    return this.http.post(url, bodyStr);
  }
  getRisLog(id: string): Observable<any> {
    const url = `${this.restPath}/getRisLog/${id}`;
    return this.http.get(url);
  }
  getAlarms(id: string): Observable<any> {
    const url = `${this.restPath}/getAlarms/${id}`;
    return this.http.get(url);
  }
  getField(): Observable<any> {
    const url = `${this.restPath}/getfield`;
    return this.http.get(url);
  }
}