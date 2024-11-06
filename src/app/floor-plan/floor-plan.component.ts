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

  private tooltip!: Konva.Text;

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

            // 當點擊 UE 時，查詢即時 RSRP 值
            if (equipment.type === 'UE' && equipment.apiUrl) {
              equipImage.on('click', () => {
                this.queryRsrp(equipment.apiUrl as string, equipment.name);
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
        this.tooltip.zIndex(999); // 確保 tooltip 在最上層

        layer.draw();
      });
    });
  }

  // 函數用來顯示 tooltip
  private showTooltip(x: number, y: number, text: string) {
    this.tooltip.text(text);
    this.tooltip.position({ x: x + 10, y: y + 10 });
    this.tooltip.visible(true);
    this.tooltip.zIndex(999); // 確保每次顯示 tooltip 時它都在最上層
    this.tooltip.getLayer()?.batchDraw(); // 使用 batchDraw 以提高性能
    console.log('Tooltip shown with text:', text);
  }

  // 函數用來隱藏 tooltip
  private hideTooltip() {
    this.tooltip.visible(false);
    this.tooltip.getLayer()?.batchDraw();
    console.log('Tooltip hidden');
  }

  // 查詢 UE 的即時 RSRP 值
  private queryRsrp(apiUrl: string, equipmentName: string) {
    this.http.get(apiUrl, { responseType: 'text' }).subscribe(
      (rsrp) => {
        console.log(`RSRP for ${equipmentName}: ${rsrp}`);
        alert(`${equipmentName} RSRP: ${rsrp}`); // 可以用更好的 UI 替代
      },
      (error) => {
        console.error(`Failed to get RSRP for ${equipmentName}`, error);
      }
    );
  }
}
