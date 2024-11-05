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
    const stageWidth = containerElement?.clientWidth || 800;
    const stageHeight = containerElement?.clientHeight || 600;
    
    // 初始化 Konva 舞台
    const stage = new Konva.Stage({
      container: 'container', // 容器 ID，對應 HTML 中的 div
      width: stageWidth,
      height: stageHeight,
    });
    console.log("Stage initialized with width:", stageWidth, "and height:", stageHeight);

    // 創建圖層
    const layer = new Konva.Layer();
    stage.add(layer);

    // 添加底圖
    Konva.Image.fromURL('assets/img/floor-plan.png', (image) => {
      image.setAttrs({
        x: 0,
        y: 0,
        width: stageWidth,
        height: stageHeight,
      });
      layer.add(image);
      layer.draw();
      console.log("Background image added.");

      // 等待背景圖像載入完成後，再添加其他圖標
      this.addIcons(layer);
    });
  }

  addIcons(layer: Konva.Layer): void {
    // 使用 Promise 機制來確保所有圖標載入完成
    const loadImage = (url: string, attrs: any) => {
      return new Promise<Konva.Image>((resolve) => {
        Konva.Image.fromURL(url, (image) => {
          image.setAttrs(attrs);
          resolve(image);
        });
      });
    };

    Promise.all([
      loadImage('assets/img/gnb.png', {
        x: 200,
        y: 150,
        width: 50,
        height: 50,
        draggable: false,
        name: 'BS'
      }),
      loadImage('assets/img/ue.png', {
        x: 300,
        y: 300,
        width: 50,
        height: 50,
        draggable: false,
        name: 'UE'
      }),
      loadImage('assets/img/ris.png', {
        x: 300,
        y: 200,
        width: 50,
        height: 50,
        draggable: false,
        name: 'RIS'
      })
    ]).then((images) => {
      images.forEach((image) => {
        layer.add(image);
        console.log(`${image.attrs.name} image loaded and added to layer.`);

        // 添加鼠標懸停事件來顯示坐標
        image.on('mouseover', () => {
          console.log(`Mouse over ${image.attrs.name}`);
          this.showTooltip(layer, image.x(), image.y(), `${image.attrs.name}: x: ${image.x()}, y: ${image.y()}`);
        });

        image.on('mouseout', () => {
          console.log(`Mouse out from ${image.attrs.name}`);
          this.hideTooltip(layer);
        });
      });
      layer.draw();
    }).catch((error) => {
      console.error("Error loading images:", error);
    });
  }

  // 函數用來顯示 tooltip
  showTooltip(layer: Konva.Layer, x: number, y: number, text: string): void {
    const tooltip = new Konva.Text({
      x: x + 10,
      y: y + 10,
      text: text,
      fontSize: 16,
      fontFamily: 'Calibri',
      fill: 'black',
      padding: 5,
      visible: true,
      backgroundColor: 'white',
    });
    layer.add(tooltip);
    layer.batchDraw(); // 使用 batchDraw 以提高性能
    console.log("Tooltip shown at x:", x, "y:", y, "with text:", text);
  }

  // 函數用來隱藏 tooltip
  hideTooltip(layer: Konva.Layer): void {
    layer.find('Text').forEach((node) => {
      node.destroy();
    });
    layer.batchDraw();
    console.log("Tooltip hidden");
  }
}
