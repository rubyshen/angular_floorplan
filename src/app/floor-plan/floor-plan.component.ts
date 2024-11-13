import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ApiForRISMgmt } from '../shared/api/For_RIS_Mgmt';
import Konva from 'konva';

@Component({
  selector: 'app-floor-plan',
  templateUrl: './floor-plan.component.html',
  styleUrls: ['./floor-plan.component.css']
})

export class FloorPlanComponent implements OnInit {
  allRisDevices: any[] = [];
  targetRisId: string = "";
  QUB_RIS_URL = "http://ris.m10.site/api";
  isLoading: boolean = false;
  
  private realWidthMeters = 20;
  private realHeightMeters = 16;

  private equipments = [
    { type: 'BS', name: 'Tx', x: 5, y: 1, imageUrl: 'assets/img/gnb.png' },
    { type: 'RIS', name: 'QUB RIS', x: 18, y: 1, imageUrl: 'assets/img/ris.png' },
    { type: 'UE', name: 'Rx', x: 7, y: 9, imageUrl: 'assets/img/ue.png', apiUrl: 'http://localhost:5000/rsrp' },
  ];

  
  // export class FloorPlanComponent implements OnInit {
  // private realWidthMeters = 50;
  // private realHeightMeters = 40;

  // private equipments = [
  //   { type: 'BS', name: 'Tx', x: 26, y: 2, imageUrl: 'assets/img/gnb.png' },
  //   { type: 'RIS', name: 'QUB RIS', x: 48, y: 2, imageUrl: 'assets/img/ris.png' },
  //   { type: 'UE', name: 'Rx', x: 30, y: 30, imageUrl: 'assets/img/ue.png', apiUrl: 'http://localhost:5000/rsrp' },
  // ]; 

  private tooltip!: Konva.Text;
  private rsrpGroup!: Konva.Group;
  private rsrpInterval: any;
  selectedUeName: string | null = null;
  rsrpValue: string | null = null;

  constructor(private risMgmtService: ApiForRISMgmt, private http: HttpClient) { }

  ngOnInit(): void {
    
    this.fetchRisDevices();
    const containerElement = document.getElementById('container');
    const stageWidth = containerElement?.clientWidth || 800;
    const stageHeight = containerElement?.clientHeight || 600;
    console.log(`stageWidth: ${stageWidth}, stageHeight: ${stageHeight}`);
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
              // this.showTooltip(equipImage.x(), equipImage.y(), `${equipment.name}:\n (${xMeters}, ${yMeters})`);
              this.showTooltip(equipImage.x(), equipImage.y(), `${equipment.name}`);
            });
            equipImage.on('mousemove', () => {
              console.log(`Mouse move over ${equipment.name}`);
              const xMeters = equipment.x;
              const yMeters = equipment.y;
              // this.showTooltip(equipImage.x(), equipImage.y(), `${equipment.name}:\n (${xMeters}, ${yMeters})`);
              this.showTooltip(equipImage.x(), equipImage.y(), `${equipment.name}`);
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
          y: stageHeight - 100,
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

        closeButton.on('click', () => {
          console.log('Close button clicked');
          this.stopUpdatingRsrp();
        });

        closeButtonText.on('click', () => {
          console.log('Close button Text clicked');
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
    this.tooltip.position({ x: x - 20, y: y + 50 });
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
          console.log("Received data:", data); // 添加除錯，檢查 JSON 整體內容
  
          // 直接從 data 提取 min_value 和 max_value
          const min = data.min_value;
          const max = data.max_value;
  
          // 顯示正確的內容
          this.rsrpValue = `${equipmentName} - Max: ${max}, Min: ${min}`;
          console.log(`Received Power for ${equipmentName}: Max=${max}, Min=${min}`);
  
          const rsrpText = this.rsrpGroup.findOne<Konva.Text>('#rsrpText');
          rsrpText?.text(`${equipmentName} RSRP\nMax: ${max}\nMin: ${min}`);
          
          layer.batchDraw();
        } catch (error) {
          console.error('Failed to parse JSON response', error);
        }
      },
      (error) => {
        console.error(`Failed to get received power for ${equipmentName}`, error);
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
    console.log('Stopped updating RSRP and hid rsrpGroup.');
  }

  applyOptimizedProfile(): void {
    if (!this.targetRisId) {
      console.error('Target RIS ID not found. Cannot apply profile.');
      return;
    }
  
    // Set loading state
    this.isLoading = true;
  
    // Define the request body, similar to `applyRisProfile`
    const body: any = {
      risUrl: this.QUB_RIS_URL,             // Using the constant URL
      globalRisId: this.targetRisId,        // Target RIS ID retrieved earlier
      profileId: 12                         // Apply profile ID 12
    };
  
    this.risMgmtService.apply_ris_profile(body).subscribe({
      next: (res) => {
        console.log('apply_ris_profile:', res);
        if (res !== null) {
          this.isLoading = false;
          console.log(`Successfully applied profile ID 12 to RIS ID: ${this.targetRisId}`);
          // Optionally, refresh data or update UI if necessary
          this.fetchRisDevices();           // Refresh RIS devices if needed
        }
      },
      error: (error) => {
        console.error('Error applying RIS profile:', error);
        setTimeout(() => {
          this.isLoading = false;
        }, 3000);
      }
    });
  }
  
  
  fetchRisDevices(): void {
    this.risMgmtService.getAllRisDevice().subscribe((devices: any[]) => {
      this.allRisDevices = devices;

    // Log each device's risUrl
    this.allRisDevices.forEach(device => {
      console.log('RIS URL:', device.risUrl);
    });

      const targetDevice = this.allRisDevices.find(device => device.risUrl === 'http://ris.m10.site/api');
      if (targetDevice) {
        this.targetRisId = targetDevice.id;
        console.log('QUB RIS ID:', this.targetRisId);
      }
      else{
        console.log('QUB RIS ID Not Found');
      }
    });
  }

}
