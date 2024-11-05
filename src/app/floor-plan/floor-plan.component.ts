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
    // 初始化 Konva 舞台
    const stage = new Konva.Stage({
      container: 'container', // 容器 ID，對應 HTML 中的 div
      width: 800, // 調整大小為需要的值
      height: 600,
    });

    // 創建圖層
    const layer = new Konva.Layer();
    stage.add(layer);

    // 添加底圖
    Konva.Image.fromURL('assets/floor-plan.png', (image) => {
      image.setAttrs({
        x: 0,
        y: 0,
        width: 800,
        height: 600,
      });
      layer.add(image);
      layer.draw();
    });

    // 添加 BS、UE、RIS 的位置標示
    const bs = new Konva.Circle({
      x: 200,
      y: 200,
      radius: 20,
      fill: 'red',
      draggable: false, // 第一版不允許拖曳
    });
    layer.add(bs);

    const ue = new Konva.Circle({
      x: 400,
      y: 300,
      radius: 20,
      fill: 'blue',
      draggable: false,
    });
    layer.add(ue);

    const ris = new Konva.Circle({
      x: 600,
      y: 400,
      radius: 20,
      fill: 'green',
      draggable: false,
    });
    layer.add(ris);

    layer.draw();
  }
}
