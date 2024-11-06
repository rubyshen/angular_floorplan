import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import Konva from 'konva';

@Component({
  selector: 'app-floor-plan',
  templateUrl: './floor-plan.component.html',
  styleUrls: ['./floor-plan.component.css']
})
export class FloorPlanComponent implements OnInit {
  // 假設 floor-plan 的實際大小為 20m x 15m
  private realWidthMeters = 20;
  private realHeightMeters = 15;

  private equipments = [
    { type: 'BS', name: 'Base Station 1', x: 5, y: 4, imageUrl: 'assets/img/gnb.png' },
    { type: 'UE', name: 'User Equipment 1', x: 10, y: 8, imageUrl: 'assets/img/ue.png', apiUrl: 'http://localhost:5000/rsrp' },
    { type: 'RIS', name: 'RIS Unit 1', x: 15, y: 6, imageUrl: 'assets/img/ris.png' },
    { type: 'UE', name: 'User Equipment 2', x: 9, y: 7, imageUrl: 'assets/img/ue.png', apiUrl: 'http://localhost:5000/rsrp' }
  ];

  private tooltip!: Konva.Text; // 用於設備懸停的 tooltip
  private rsrpText!: Konva.Text; // 用於顯示 UE 的 RSRP 值的文字框
  private closeButton!: Konva.Rect; // 關閉按鈕

  // 存儲目前正在查詢 RSRP 的 UE 的相關資訊
  selectedUeName: string | null = null;
  rsrpValue: string | null = null;
  rsrpInterval: any;

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    const containerElement = document.getElementById('container');
    const stageWidth = containerElement?.clientWidth || 800;
    const stageHeight = containerElement?.clientHeight || 600;

    // 初始化 Konva 舞台
    const stage = new Konva.Stage({
      container: 'container', // 容器 ID，對應 HTML 中的 div
      width: stageWidth,
      height: stageHeight,
    });

    // 創建圖層
    const layer = new Konva.Layer();
    stage.add(layer);

    // 計算縮放比例
    const scaleX = stageWidth / this.realWidthMeters;
    const scaleY = stageHeight / this.realHeightMeters;

    // 設置底圖的 Promise
    const backgroundImagePromise = new Promise<void>((resolve) => {
      Konva.Image.fromURL('assets/img/floor-plan.png', (image) => {
        image.setAttrs({
          x: 0,
          y: 0,
          width: stageWidth,
          height: stageHeight,
        });
        layer.add(image);
        console.log('Background image added.');
        resolve();
      });
    });

    // 確保背景圖先加載完成，再繪製設備
    backgroundImagePromise.then(() => {
      const equipmentPromises = this.equipments.map((equipment) => {
        return new Promise<void>((resolve) => {
          Konva.Image.fromURL(equipment.imageUrl, (equipImage) => {
            equipImage.setAttrs({
              x: equipment.x * scaleX,
              y: equipment.y * scaleY,
              width: 1 * scaleX, // 設備圖標的寬度（設為 1m 對應於畫布縮放後的寬度）
              height: 1 * scaleY, // 設備圖標的高度
              draggable: false, // 第一版不允許拖曳
              id: equipment.name,
            });
            layer.add(equipImage);
            console.log(`${equipment.type} image loaded and added to layer.`);

            // 當點擊 UE 時，查詢即時 RSRP 值並開始不斷刷新
            if (equipment.type === 'UE' && equipment.apiUrl) {
              equipImage.on('click', () => {
                if (this.selectedUeName === equipment.name) {
                  return; // 如果已經選中了相同的 UE，則不重複操作
                }
                console.log(`Clicked ${equipment.name}`);
                this.selectedUeName = equipment.name;
                this.startUpdatingRsrp(equipment.apiUrl, equipment.name, stage);
              });
            }

            // 設備懸停顯示 tooltip
            equipImage.on('mouseover', () => {
              console.log(`Mouse over ${equipment.name}`);
              const xMeters = equipment.x;
              const yMeters = equipment.y;
              this.showTooltip(equipImage.x(), equipImage.y(), `${equipment.name}: x: ${xMeters}, y: ${yMeters}`);
            });
            equipImage.on('mousemove', () => {
              console.log(`Mouse move over ${equipment.name}`);
              const xMeters = equipment.x;
              const yMeters = equipment.y;
              this.showTooltip(equipImage.x(), equipImage.y(), `${equipment.name}: x: ${xMeters}, y: ${yMeters}`);
            });
            equipImage.on('mouseout', () => {
              console.log(`Mouse out from ${equipment.name}`);
              this.hideTooltip();
            });

            resolve();
          });
        });
      });

      // 等待所有設備加載完成後再繪製
      Promise.all(equipmentPromises).then(() => {
        // 初始化 Tooltip
        this.tooltip = new Konva.Text({
          text: '',
          fontSize: 16,
          padding: 5,
          visible: false,
          fill: 'black',
          backgroundColor: 'white',
        });
        layer.add(this.tooltip);
        this.tooltip.zIndex(7); // 確保 tooltip 在最上層

        // 初始化顯示 RSRP 的文字框
        this.rsrpText = new Konva.Text({
          text: '',
          x: stageWidth - 350, // 設置在右上角
          y: 20,
          fontSize: 16,
          padding: 5,
          fill: 'blue',
          visible: false,
          id: 'rsrpText',
        });
        layer.add(this.rsrpText);
        this.rsrpText.zIndex(6); // 確保 RSRP 顯示在最上層

        // 初始化關閉按鈕
        this.closeButton = new Konva.Rect({
          x: stageWidth - 50, // 設置在右上角顯示框旁邊
          y: 20,
          width: 20,
          height: 20,
          fill: 'red',
          visible: false,
          id: 'closeButton',
        });
        layer.add(this.closeButton);
        this.closeButton.zIndex(6); // 確保關閉按鈕在最上層

        // 關閉按鈕的點擊事件
        this.closeButton.on('click', () => {
          console.log('Close button clicked');
          this.stopUpdatingRsrp();
        });

        layer.draw();
      });
    });
  }

  // 函數用來顯示 tooltip
  private showTooltip(x: number, y: number, text: string) {
    this.tooltip.text(text);
    this.tooltip.position({ x: x + 10, y: y - 20 });
    this.tooltip.visible(true);
    this.tooltip.zIndex(6); // 確保每次顯示 tooltip 時它都在最上層
    this.tooltip.getLayer()?.batchDraw(); // 使用 batchDraw 以提高性能
    console.log('Tooltip shown with text:', text);
  }

  // 函數用來隱藏 tooltip
  private hideTooltip() {
    this.tooltip.visible(false);
    this.tooltip.getLayer()?.batchDraw();
    console.log('Tooltip hidden');
  }

  // 查詢 UE 的即時 RSRP 值，並開始不斷刷新
  private startUpdatingRsrp(apiUrl: string, equipmentName: string, stage: Konva.Stage) {
    // 如果已有正在更新的 Interval，先清除
    if (this.rsrpInterval) {
      clearInterval(this.rsrpInterval);
    }

    // 設定定時器，每隔 2 秒查詢一次 RSRP 值
    this.rsrpInterval = setInterval(() => {
      this.http.get(apiUrl, { responseType: 'text' }).subscribe(
        (response) => {
          try {
            const data = JSON.parse(response); // 解析 JSON 字符串
            const rsrp = data.rsrp; // 提取 rsrp 值
            this.rsrpValue = `${equipmentName} - RSRP: ${rsrp}`;
            console.log(`RSRP for ${equipmentName}: ${rsrp}`);
            this.updateRsrpText(this.rsrpValue);
          } catch (error) {
            console.error('Failed to parse JSON response', error);
          }
        },
        (error) => {
          console.error(`Failed to get RSRP for ${equipmentName}`, error);
        }
      );
    }, 2000);


    // 顯示 RSRP 顯示框和關閉按鈕
    this.rsrpText.visible(true);
    this.rsrpText.zIndex(7); // 確保 RSRP 顯示在最上層
    this.closeButton.visible(true);
    this.closeButton.zIndex(7); // 確保關閉按鈕在最上層
    this.rsrpText.getLayer()?.batchDraw();
  }

  // 更新右上角的 RSRP 顯示框
  private updateRsrpText(text: string) {
    this.rsrpText.text(text);
    this.rsrpText.getLayer()?.batchDraw();
  }

  // 停止查詢 RSRP
  stopUpdatingRsrp() {
    if (this.rsrpInterval) {
      clearInterval(this.rsrpInterval);
      this.rsrpInterval = null;
    }
    this.selectedUeName = null;
    this.rsrpValue = null;
    this.rsrpText.visible(false);
    this.closeButton.visible(false);
    this.rsrpText.getLayer()?.batchDraw();
  }
}
