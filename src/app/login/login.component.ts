import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonService } from '../shared/common.service';
import { ResponseMessage } from '../shared/models/ResponseMessage';
import { LanguageService } from '../shared/service/language.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  userId: string = '';
  password: string = '';
  errorPorperty: string = '';
  userRole: number | null = null;

  constructor(
    private router: Router,
    private http: HttpClient,
    private commonService: CommonService,
    public languageService: LanguageService
  ) { }

  ngOnInit(): void {
    // 語系預設
    if (navigator.language === 'zh-TW') {
      this.languageService.language = 'TW';
    } else {
      this.languageService.language = 'EN';
    }
    this.languageService.setLanguage();

    // window.sessionStorage.setItem('401_error', 'logon.401');  // 測試 httpErrorMsg
    if (window.sessionStorage.getItem('401_error')) {
      this.showErrMssage(window.sessionStorage.getItem('401_error') as string)
    }
  }

  onLoggedin() {
    this.errorPorperty = '';
    window.sessionStorage.removeItem('401_error');
    if (this.userId === '' || this.password === '') {
      this.showErrMssage('logon.required_error');     // 顯示"請輸入帳密"訊息
      return;
    }

    if (this.commonService.isLocal) {

      if (this.userId.toLowerCase() === 'admin' && this.password.toLowerCase() === 'admin') {

        this.commonService.setSessionId('sessionId_test_0800'); // 預設的 local Session ID ( 無任何作用 )
        this.router.navigate(['/main/ris-mgr']);
      } else {
        this.showErrMssage(this.languageService.i18n['logon.password_error']);  // 顯示"輸入帳密錯誤"訊息
      }

    } else {
      const url = `${this.commonService.restPath}/login`;
      const body = {
        id: this.userId,
        key: this.password
      };

      this.http.post(url, JSON.stringify(body)).subscribe({
        next: (res: any) => {
          if (res !== 'userID or password invalid') {
            this.commonService.setSessionId(res['session']); // 儲存 sessionId sessionId -> session 以符合後端 API 的 Response
            console.log(res['session']);
              this.router.navigate(['/main/ris-mgr'], { queryParams: { role: res.role } }); // 導向主頁  
          } else {
            this.showErrMssage(this.languageService.i18n['logon.password_error']);  // 顯示"輸入帳密錯誤"訊息
          }
        },
        error: (err: ResponseMessage) => {
          this.showErrMssage(err.respMsg as string);
        },
        complete: () => {
          console.log('Login request completed');
        }
      });
    }
  }

  keypressHandler(event: any) {
    if (event.keyCode === 13) {
      this.onLoggedin();
    }
  }

  /**
   * @param property i18n key
   */
  showErrMssage(property: string) {
    this.errorPorperty = property;
  }

}
