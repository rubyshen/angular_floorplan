import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import Konva from 'konva';

@Component({
  selector: 'app-floor-plan',
  templateUrl: './floor-plan.component.html',
  styleUrls: ['./floor-plan.component.css']
})
export class FloorPlanComponent implements OnInit {
  private realWidthMeters = 20;
  private realHeightMeters = 15;

  private equipments = [
    { type: 'BS', name: 'Base Station 1', x: 0.5, y: 13.5, imageUrl: 'assets/img/gnb.png' },
    { type: 'RIS', name: 'RIS Unit 1', x: 6, y: 7, imageUrl: 'assets/img/ris.png' },
    { type: 'UE', name: 'User Equipment 1', x: 12, y: 10, imageUrl: 'assets/img/ue.png', apiUrl: 'http://localhost:5000/rsrp' },
    { type: 'UE', name: 'User Equipment 2', x: 15, y: 13.5, imageUrl: 'assets/img/ue.png', apiUrl: 'http://localhost:5000/rsrp' }
  ];

  private tooltip!: Konva.Text;
  private rsrpGroup!: Konva.Group;
  private rsrpInterval: any;
  selectedUeName: string | null = null;
  rsrpValue: string | null = null;

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    const containerElement = document.getElementById('container');
    const stageWidth = containerElement?.clientWidth || 800;
    const stageHeight = containerElement?.clientHeight || 600;

    const stage = new Konva.Stage({
      container: 'container',
      width: stageWidth,
      height: stageHeight,
    });

    const layer = new Konva.Layer();
    stage.add(layer);

    const scaleX = stageWidth / this.realWidthMeters;
    const scaleY = stageHeight / this.realHeightMeters;

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

    backgroundImagePromise.then(() => {
      const equipmentPromises = this.equipments.map((equipment) => {
        return new Promise<void>((resolve) => {
          Konva.Image.fromURL(equipment.imageUrl, (equipImage) => {
            equipImage.setAttrs({
              x: equipment.x * scaleX,
              y: equipment.y * scaleY,
              width: 1 * scaleX,
              height: 1 * scaleY,
              draggable: false,
              id: equipment.name,
            });
            layer.add(equipImage);
            console.log(`${equipment.type} image loaded and added to layer.`);

            if (equipment.type === 'UE' && equipment.apiUrl) {
              equipImage.on('click', () => {
                if (this.selectedUeName === equipment.name) {
                  return;
                }
                console.log(`Clicked ${equipment.name}`);
                this.selectedUeName = equipment.name;
                this.startUpdatingRsrp(equipment.apiUrl, equipment.name, layer);
              });
            }

            equipImage.on('mouseover', () => {
              console.log(`Mouse over ${equipment.name}`);
              const xMeters = equipment.x;
              const yMeters = equipment.y;
              this.showTooltip(equipImage.x(), equipImage.y(), `${equipment.name}:\n (${xMeters}, ${yMeters})`);
            });
            equipImage.on('mousemove', () => {
              console.log(`Mouse move over ${equipment.name}`);
              const xMeters = equipment.x;
              const yMeters = equipment.y;
              this.showTooltip(equipImage.x(), equipImage.y(), `${equipment.name}:\n (${xMeters}, ${yMeters})`);
            });
            equipImage.on('mouseout', () => {
              console.log(`Mouse out from ${equipment.name}`);
              this.hideTooltip();
            });

            resolve();
          });
        });
      });

      Promise.all(equipmentPromises).then(() => {
        this.tooltip = new Konva.Text({
          text: '',
          fontSize: 16,
          padding: 5,
          visible: false,
          fill: 'black',
          backgroundColor: 'white',
        });
        layer.add(this.tooltip);
        this.tooltip

        this.rsrpGroup = new Konva.Group({
          x: stageWidth - 350,
          y: 20,
          visible: false,
        });

        const background = new Konva.Rect({
          width: 300,
          height: 80,
          fill: 'lightgray',
          cornerRadius: 10,
          shadowBlur: 10,
        });

        const rsrpText = new Konva.Text({
          text: '',
          fontSize: 16,
          padding: 10,
          lineHeight: 1.5,
          fill: 'blue',
          id: 'rsrpText',
        });

        const closeButton = new Konva.Circle({
          x: 280,
          y: 20,
          radius: 10,
          fill: 'white',
          stroke: 'black',
          strokeWidth: 2,
        });

        const closeButtonText = new Konva.Text({
          text: 'X',
          x: 273,
          y: 11,
          fontSize: 20,
          fill: 'black',
          fontStyle: 'bold',
        });

        // closeButton.on('click', () => {
        //   console.log('Close button clicked');
        //   this.stopUpdatingRsrp();
        // });

        closeButtonText.on('click', () => {
          console.log('Close button clicked');
          this.stopUpdatingRsrp();
        });

        this.rsrpGroup.add(background);
        this.rsrpGroup.add(rsrpText);
        this.rsrpGroup.add(closeButton);
        this.rsrpGroup.add(closeButtonText);
        layer.add(this.rsrpGroup);

        layer.draw();
      });
    });
  }

  private showTooltip(x: number, y: number, text: string) {
    this.tooltip.text(text);
    this.tooltip.position({ x: x + 30, y: y - 20 });
    this.tooltip.visible(true);
    this.tooltip
    this.tooltip.getLayer()?.batchDraw();
    console.log('Tooltip shown with text:', text);
  }

  private hideTooltip() {
    this.tooltip.visible(false);
    this.tooltip.getLayer()?.batchDraw();
    console.log('Tooltip hidden');
  }

  private updateRsrp(apiUrl: string, equipmentName: string, layer: Konva.Layer) {
    this.http.get(apiUrl, { responseType: 'text' }).subscribe(
      (response) => {
        try {
          const data = JSON.parse(response);
          const rsrp = data.rsrp;
          this.rsrpValue = `${equipmentName} - RSRP: ${rsrp}`;
          console.log(`RSRP for ${equipmentName}: ${rsrp}`);
          const rsrpText = this.rsrpGroup.findOne<Konva.Text>('#rsrpText');
          rsrpText?.text(`${equipmentName}\nRSRP: ${rsrp}`);
          layer.batchDraw();
        } catch (error) {
          console.error('Failed to parse JSON response', error);
        }
      },
      (error) => {
        console.error(`Failed to get RSRP for ${equipmentName}`, error);
      }
    );
  }

  private startUpdatingRsrp(apiUrl: string, equipmentName: string, layer: Konva.Layer) {
  // 立即执行一次HTTP请求以获取RSRP值
  this.updateRsrp(apiUrl, equipmentName, layer);

  // 设置定时器，每秒更新RSRP值
  if (this.rsrpInterval) {
    clearInterval(this.rsrpInterval);
  }
  this.rsrpInterval = setInterval(() => {
    this.updateRsrp(apiUrl, equipmentName, layer);
  }, 1000);

  // 显示RSRP信息组
  this.rsrpGroup.visible(true);
  layer.batchDraw();
  }

  stopUpdatingRsrp() {
    if (this.rsrpInterval) {
      clearInterval(this.rsrpInterval);
      this.rsrpInterval = null;
    }
    this.selectedUeName = null;
    this.rsrpValue = null;
    this.rsrpGroup.visible(false);
    this.rsrpGroup.getLayer()?.batchDraw();
  }
}
