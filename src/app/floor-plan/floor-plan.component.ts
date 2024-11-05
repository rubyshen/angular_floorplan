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
      // width: 800, // 調整大小為需要的值
      // height: 600,
      width: stageWidth,
      height: stageHeight,
    });

    // 創建圖層
    const layer = new Konva.Layer();
    stage.add(layer);

    // 添加底圖
    Konva.Image.fromURL('assets/img/floor-plan.png', (image) => {
      image.setAttrs({
        x: 0,
        y: 0,
        width: 800,
        height: 600,
      });
      layer.add(image);
      layer.draw();
    });

    // 添加 BS 的位置標示（使用圖片）
    Konva.Image.fromURL('assets/img/gnb.png', (bsImage) => {
      bsImage.setAttrs({
        x: 200,
        y: 150,
        width: 50,
        height: 50,
        draggable: false, // 第一版不允許拖曳
      });
      layer.add(bsImage);
      layer.draw();
    });

    // 添加 UE 的位置標示（使用圖片）
    Konva.Image.fromURL('assets/img/ue.png', (ueImage) => {
      ueImage.setAttrs({
        x: 300,
        y: 300,
        width: 50,
        height: 50,
        draggable: false,
      });
      layer.add(ueImage);
      layer.draw();
    });

    // 添加 RIS 的位置標示（使用圖片）
    Konva.Image.fromURL('assets/img/ris.png', (risImage) => {
      risImage.setAttrs({
        x: 300,
        y: 200,
        width: 50,
        height: 50,
        draggable: false,
      });
      layer.add(risImage);
      layer.draw();
    });
  }
}
