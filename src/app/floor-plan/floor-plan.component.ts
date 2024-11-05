import { Component, OnInit } from '@angular/core';
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

  // 設備的公尺位置定義
  private equipments = [
    { type: 'BS', x: 5, y: 4, imageUrl: 'assets/img/gnb.png' },    // BS 位於 (5m, 4m)
    { type: 'UE', x: 10, y: 8, imageUrl: 'assets/img/ue.png' },     // UE 位於 (10m, 8m)
    { type: 'RIS', x: 15, y: 6, imageUrl: 'assets/img/ris.png' },   // RIS 位於 (15m, 6m)
    { type: 'UE', x: 9, y: 7, imageUrl: 'assets/img/ue.png' }
  ];

  constructor() { }

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
              id: equipment.type,
            });
            layer.add(equipImage);
            console.log(`${equipment.type} image loaded and added to layer.`);
            resolve();
          });
        });
      });

      // 等待所有設備加載完成後再繪製
      Promise.all(equipmentPromises).then(() => {
        // 初始化 Tooltip
        const tooltip = new Konva.Text({
          text: '',
          fontSize: 16,
          padding: 5,
          visible: false,
          fill: 'black',
          backgroundColor: 'white',
        });
        layer.add(tooltip);

        // 設備懸停顯示 tooltip
        this.equipments.forEach((equipment) => {
          const equipmentNode = layer.findOne(`#${equipment.type}`);
          if (equipmentNode) {
            equipmentNode.on('mouseover', () => {
              console.log(`Mouse over ${equipment.type}`);
              const xMeters = equipment.x;
              const yMeters = equipment.y;
              showTooltip(equipmentNode.x(), equipmentNode.y(), `${equipment.type}: x: ${xMeters}, y: ${yMeters}`);
            });
            equipmentNode.on('mousemove', () => {
              console.log(`Mouse move over ${equipment.type}`);
              const xMeters = equipment.x;
              const yMeters = equipment.y;
              showTooltip(equipmentNode.x(), equipmentNode.y(), `${equipment.type}: x: ${xMeters}, y: ${yMeters}`);
            });
            equipmentNode.on('mouseout', () => {
              console.log(`Mouse out from ${equipment.type}`);
              hideTooltip();
            });
          }
        });

        // 函數用來顯示 tooltip
        const showTooltip = (x: number, y: number, text: string) => {
          tooltip.text(text);
          tooltip.position({ x: x + 10, y: y + 10 });
          tooltip.visible(true);
          layer.batchDraw(); // 使用 batchDraw 以提高性能
          console.log('Tooltip shown with text:', text);
        };

        // 函數用來隱藏 tooltip
        const hideTooltip = () => {
          tooltip.visible(false);
          layer.batchDraw();
          console.log('Tooltip hidden');
        };

        layer.draw();
      });
    });
  }
}
