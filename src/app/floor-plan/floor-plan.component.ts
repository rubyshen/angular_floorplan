import { Component, OnInit } from '@angular/core';
import Konva from 'konva';

@Component({
  selector: 'app-floor-plan',
  templateUrl: './floor-plan.component.html',
  styleUrls: ['./floor-plan.component.css']
})
export class FloorPlanComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
    const containerElement = document.getElementById('container');
    const containerWidth = containerElement?.clientWidth || 800;
    const containerHeight = containerElement?.clientHeight || 600;

    // 定義 floor-plan 實際大小（假設是 10m x 7.5m）
    const floorPlanRealWidth = 10; // 實際寬度 10m
    const floorPlanRealHeight = 7.5; // 實際高度 7.5m

    // 初始化 Konva 舞台
    const stage = new Konva.Stage({
      container: 'container', // 容器 ID，對應 HTML 中的 div
      width: containerWidth,
      height: containerHeight,
    });

    // 創建圖層
    const layer = new Konva.Layer();
    stage.add(layer);

    // 創建 tooltip 文本
    const tooltip = new Konva.Text({
      text: '',
      fontSize: 18,
      fontFamily: 'Calibri',
      fill: 'yellow', // 改為顯眼的顏色
      background: 'black',
      visible: false,
    });
    layer.add(tooltip);

    // 添加底圖
    Konva.Image.fromURL('assets/img/floor-plan.png', (image) => {
      // 計算比例尺（將 floor-plan 圖片縮放到容器大小）
      const scaleX = containerWidth / image.width();
      const scaleY = containerHeight / image.height();
      const scale = Math.min(scaleX, scaleY);

      // 設定底圖屬性並縮放
      image.setAttrs({
        x: 0,
        y: 0,
        width: image.width() * scale,
        height: image.height() * scale,
      });
      layer.add(image);
      layer.draw();

      // 定義 BS、UE、RIS 的實際位置（相對於實際尺寸，以公尺為單位）
      const locations = {
        bs: { x: 2, y: 1.5 },  // BS 位置（2m, 1.5m）
        ue: { x: 3, y: 3 },     // UE 位置（3m, 3m）
        ris: { x: 6, y: 4 }     // RIS 位置（6m, 4m）
      };

      // 將實際位置轉換為容器內的像素位置
      const convertToPixels = (realPosition: { x: number, y: number }) => {
        return {
          x: realPosition.x / floorPlanRealWidth * (image.width() * scale),
          y: realPosition.y / floorPlanRealHeight * (image.height() * scale)
        };
      };

      // 添加 BS 的位置標示（使用圖片）
      Konva.Image.fromURL('assets/img/gnb.png', (bsImage) => {
        const pixelPosition = convertToPixels(locations.bs);
        bsImage.setAttrs({
          x: pixelPosition.x,
          y: pixelPosition.y,
          width: 50,
          height: 50,
          draggable: false, // 第一版不允許拖曳
        });
        layer.add(bsImage);

        bsImage.on('mouseover', () => {
          console.log("Mouse over BS");
          showTooltip(bsImage.x(), bsImage.y(), `BS: x: ${locations.bs.x}, y: ${locations.bs.y}`);
        });
        bsImage.on('mouseout', () => {
          console.log("Mouse out from BS");
          hideTooltip();
        });
      });

      // 添加 UE 的位置標示（使用圖片）
      Konva.Image.fromURL('assets/img/ue.png', (ueImage) => {
        const pixelPosition = convertToPixels(locations.ue);
        ueImage.setAttrs({
          x: pixelPosition.x,
          y: pixelPosition.y,
          width: 50,
          height: 50,
          draggable: false,
        });
        layer.add(ueImage);

        ueImage.on('mouseover', () => {
          console.log("Mouse over UE");
          showTooltip(ueImage.x(), ueImage.y(), `UE: x: ${locations.ue.x}, y: ${locations.ue.y}`);
        });
        ueImage.on('mouseout', () => {
          console.log("Mouse out from UE");
          hideTooltip();
        });
      });

      // 添加 RIS 的位置標示（使用圖片）
      Konva.Image.fromURL('assets/img/ris.png', (risImage) => {
        const pixelPosition = convertToPixels(locations.ris);
        risImage.setAttrs({
          x: pixelPosition.x,
          y: pixelPosition.y,
          width: 50,
          height: 50,
          draggable: false,
        });
        layer.add(risImage);

        risImage.on('mouseover', () => {
          console.log("Mouse over RIS");
          showTooltip(risImage.x(), risImage.y(), `RIS: x: ${locations.ris.x}, y: ${locations.ris.y}`);
        });
        risImage.on('mouseout', () => {
          console.log("Mouse out from RIS");
          hideTooltip();
        });
      });

      layer.draw();
    });

    // 函數用來顯示 tooltip
    const showTooltip = (x: number, y: number, text: string) => {
      tooltip.text(text);
      tooltip.position({ x: x + 10, y: y + 10 });
      // 設置 tooltip 為最高層級
      tooltip.zIndex(layer.getChildren().length - 1);
      tooltip.visible(true);
      layer.batchDraw(); // 使用 batchDraw 以提高性能
      console.log("Tooltip shown at x:", x, "y:", y, "with text:", text);
    };

    // 函數用來隱藏 tooltip
    const hideTooltip = () => {
      tooltip.visible(false);
      layer.batchDraw(); // 使用 batchDraw 以提高性能
      console.log("Tooltip hidden");
    };
  }
}
