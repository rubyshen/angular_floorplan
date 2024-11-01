
// LanguageService
import { EventEmitter, Injectable, Output } from '@angular/core';
import { Enlanguage } from '../language-models/en-language';
import { TwLanguage } from '../language-models/tw-language';

@Injectable({
  providedIn: 'root'
})
export class LanguageService {

  // 定義一個事件發射器,用於通知語言變化
  @Output() languageChanged = new EventEmitter();

  language = 'TW'; // 'EN' | 'TW'
  i18n: any = {};

  constructor() {
    this.getLanguage();
  }

  getLanguage() {
    // 從 sessionStorage 中獲取語言設置
    if ( window.sessionStorage.getItem('language') ) {
      this.language = window.sessionStorage.getItem('language') as string;
    }
    this.setLanguage();
  }

  // @2024/01/26 Update
  setLanguage() {
    // 將當前語言保存到 sessionStorage 中
    window.sessionStorage.setItem('language', this.language);
    // 根據當前語言設置 i18n 對象
    if (this.language === 'EN') {
      this.i18n = Enlanguage;
    } else {
      this.i18n = TwLanguage;
    }

    // 更新頁面樣式和語言類
    //this.changeLanguageStylesheet(this.language);
    this.updateBodyLanguageClass(this.language); // @2024/01/26 Add
  }

  // @2024/03/21 Add
  changeI18n( language: string ) {
    // 更新當前語言
    this.language = language;
    // 設置新的語言
    this.setLanguage();
    // 發射語言變化事件
    this.languageChanged.emit( language );
  }

  toggleChange() {
    // 切換語言
    if (this.language === 'EN') {
      this.changeI18n('EN');
    } else {
      this.changeI18n('TW');
    }
  }

  // @2024/01/24 Add
  // 函數: 切換語言樣式表
  changeLanguageStylesheet( language: string ) {
    // 在控制台打印當前語言樣式表的訊息
    console.log("The current Language Style is styles." + language.toLowerCase() + ".css");

    // 獲取HTML文檔中的 <head> 元素
    const head = document.getElementsByTagName('head')[0];
    // 嘗試獲取頁面上已存在的用於語言樣式的 <link> 元素
    const existingLinkElement = document.getElementById('language-stylesheet') as HTMLLinkElement;

    // 檢查是否已經存在語言樣式的 <link> 元素
    if ( existingLinkElement ) {
      // 如果存在,則更新該 <link> 元素的 href 屬性,指向新的樣式表文件
      existingLinkElement.href = `assets/css/styles.${language.toLowerCase()}.css`;
    } else {
      // 如果不存在,則創建新的 <link> 元素
      const linkElement = document.createElement('link');
      // 設置新 <link> 元素的 id,以便將來可以識別和選擇它
      linkElement.id = 'language-stylesheet';
      // 設置 <link> 元素的 rel 屬性,表明它是一個樣式表
      linkElement.rel = 'stylesheet';
      // 設置 <link> 元素的 type 屬性,表明它的類型是文字/樣式表
      linkElement.type = 'text/css';
      // 設置 <link> 元素的 href 屬性,指向對應語言的樣式表文件
      linkElement.href = `assets/css/styles.${language.toLowerCase()}.css`;
      // 將新創建的 <link> 元素加入到 <head> 元素中,使其生效
      head.appendChild( linkElement );
    }
  }

  // 新方法: 更新 <body> 標籤的語言類
  updateBodyLanguageClass( language: string ) {
    const body = document.body;
    // 移除 <body> 上的 'en' 和 'tw' 類
    body.classList.remove('en', 'tw');
    // 假設您的樣式表中用 'en' 代表英文,'tw' 代表繁體中文
    const classToAdd = language.toLowerCase() === 'en' ? 'en' : 'tw';
    // 為 <body> 添加對應的語言類
    body.classList.add( classToAdd );
  }
}
