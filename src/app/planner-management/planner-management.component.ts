import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { CommonService } from '../shared/common.service';
import { LanguageService } from '../shared/service/language.service';
import * as _ from 'lodash';
//import Chart from 'chart.js/auto';
import { Chart, ChartConfiguration, ChartData, ChartOptions, ScatterDataPoint } from 'chart.js/auto';
import ChartAnnotation from 'chartjs-plugin-annotation';
// For import APIs of RIS Management 
import { ApiForRISMgmt } from '../shared/api/For_RIS_Mgmt';

export interface Position {
  x: number;
  y: number;
  icon: string;
  name: string;
  width: number;
  height: number;
  mappedX?: number;
  mappedY?: number;
  iconSize?: number;
}

export interface Getfield {
  profile_id: string;
  ris_name: string;
  reflection_polar :number;
  reflection_azimuth :number;
  orientation_polar :number;
  orientation_azimuth :number;
  size_width :number;
  size_height :number;
  x :number;
  y :number;
  material :string;
}

@Component({
  selector: 'app-planner-management',
  templateUrl: './planner-management.component.html',
  styleUrls: ['./planner-management.component.scss']
})

export class PlannerManagementComponent implements OnInit, OnDestroy {
  sessionId: string = '';
  refreshTimeout!: any;
  refreshTime: number = 5;
  private chart: Chart | any;
  constructor(
    private dialog: MatDialog,
    private router: Router,
    private commonService: CommonService,
    private fb: FormBuilder,
    public languageService: LanguageService,
    public apiForRISMgmt: ApiForRISMgmt,
  ) {
  }

  ngOnInit(): void {
    Chart.register(ChartAnnotation);
    this.sessionId = this.commonService.getSessionId();
    this.getFieldInfo();
    this.createChart();
    //this.drawcanvas();
  }

  ngOnDestroy() {
    clearTimeout(this.refreshTimeout);
  }
  showXAxisGrid: boolean = true;
  showYAxisGrid: boolean = true;
  showLine: boolean = true;
  panelX: number = 0;
  panelY: number = 0;
  maxMapX: number = 150;
  maxMapY: number = 70;

  positions: Position[] = [
    //RIS
    { x: 50, y: 5, icon: 'assets/img/ris.png', name: 'RIS1', width: 80, height: 100 },
    { x: 60, y: 65, icon: 'assets/img/ris.png', name: 'RIS2', width: 80, height: 100 },
    //Gnb
    { x: 15, y: 60, icon: 'assets/img/gnb.png', name: 'GNB', width: 70, height: 90 },
    //UE
    { x: 90, y: 25, icon: 'assets/img/ue.png', name: 'UE1', width: 70, height: 90 },
    { x: 90, y: 60, icon: 'assets/img/ue.png', name: 'UE2', width: 70, height: 90 },
    //Chair
    { x: 45, y: 30, icon: 'assets/img/chair.png', name: 'Chair', width: 50, height: 70 },
    { x: 70, y: 30, icon: 'assets/img/chair.png', name: 'Chair', width: 50, height: 70 },
    //Table
    { x: 70, y: 55, icon: 'assets/img/table.png', name: 'Table', width: 60, height: 80 },
    { x: 75, y: 55, icon: 'assets/img/table.png', name: 'Table', width: 60, height: 80 },
    { x: 45, y: 35, icon: 'assets/img/table.png', name: 'Table', width: 60, height: 80 },
    { x: 75, y: 30, icon: 'assets/img/table.png', name: 'Table', width: 60, height: 80 },
  ];

  drawcanvas() {
    const canvas = document.getElementById('myCanvas') as HTMLCanvasElement;
    const context = canvas.getContext('2d');

    if (context) {
      // Canvas dimensions = width="1500" height="700"
      const canvasWidth = canvas.width;
      const canvasHeight = canvas.height;
      let clickX :any;
      let clickY :any;
      this.positions.forEach(pos => {
        const img = new Image();
        let imgLoaded = false;
        img.src = pos.icon;
        console.log(`Draw all the item ${pos.name} to ${pos.icon}`);
        img.onload = () => {
          if (!imgLoaded) {
            imgLoaded = true;
            const mappedX = (pos.x / this.maxMapX) * canvasWidth;
            const mappedY = canvasHeight - (pos.y / this.maxMapY) * canvasHeight;
            const iconSize = 35;
            context.drawImage(img, mappedX - iconSize / 2, mappedY - iconSize / 2, iconSize, iconSize);
            pos.mappedX = mappedX;
            pos.mappedY = mappedY;
            pos.iconSize = iconSize;
            console.log(`Draw all the item ${pos.name} to ${pos.icon}`);
            // canvas.addEventListener('click', (event) => {
            // clickX = event.clientX - canvas.getBoundingClientRect().left;
            // clickY = event.clientY - canvas.getBoundingClientRect().top;
            // if (clickX >= mappedX - iconSize / 2 && clickX <= mappedX + iconSize / 2 &&
            //     clickY >= mappedY - iconSize / 2 && clickY <= mappedY + iconSize / 2) {
            //     console.log('Clicked on icon:', pos.name);
            //     console.log('Clicked on X:', clickX);
            //     console.log('Clicked on Y:', clickY);
            //     this.drawPanel(pos.name, clickX, clickY, pos.x, pos.y, pos.width,pos.height);
            //   } 
            // });
          }
        };
      });
      

      if (this.showXAxisGrid) {
        const gridSpacingX = 50;
        context.strokeStyle = 'black';
        context.lineWidth = 0.3;

        for (let x = gridSpacingX; x <= canvasWidth; x += gridSpacingX) {
          context.beginPath();
          context.moveTo(x, 0);
          context.lineTo(x, canvasHeight);
          context.stroke();
        }
      }

      if (this.showYAxisGrid) {
        const gridSpacingY = 50;
        context.strokeStyle = 'black';
        context.lineWidth = 0.3;

        for (let y = gridSpacingY; y <= canvasHeight; y += gridSpacingY) {
          context.beginPath();
          context.moveTo(0, y);
          context.lineTo(canvasWidth, y);
          context.stroke();
        }
      }
      if (this.showLine) {
        const startX = (35 / this.maxMapX) * canvasWidth;
        const startY = canvasHeight - (45 / this.maxMapY) * canvasHeight;
        const endX = (110 / this.maxMapX) * canvasWidth;
        const endY = canvasHeight - (45 / this.maxMapY) * canvasHeight;
        context.beginPath();
        context.moveTo(startX, startY);
        context.lineTo(endX, endY);
        context.lineWidth = 30;
        context.strokeStyle = 'black';
        context.stroke();
      }
      if (this.showLine) {
        const startX = (60 / this.maxMapX) * canvasWidth;
        const startY = canvasHeight - (15 / this.maxMapY) * canvasHeight;
        const endX = (60 / this.maxMapX) * canvasWidth;
        const endY = canvasHeight - (60 / this.maxMapY) * canvasHeight;
        context.beginPath();
        context.moveTo(startX, startY);
        context.lineTo(endX, endY);
        context.lineWidth = 30;
        context.strokeStyle = 'black';
        context.stroke();
      }
    }    
  }

  drawPanel(name: string, x: number, y: number, posx: number, posy: number, width: number, height: number) {
    const canvas = document.getElementById('myCanvas') as HTMLCanvasElement;
    const context = canvas.getContext('2d');
    const panelWidth = 90;
    const panelHeight = 115;
    if (context) {
      context.fillStyle = 'rgb(255, 243, 230)';
      context.fillRect(x, y, panelWidth, panelHeight);
      context.fillStyle = 'black'; // Text color
      context.font = '12px Arial'; // Text font
      context.fillText(`Name: ${name}`, x + 10, y + 20);
      context.fillText(`Width: ${width}`, x + 10, y + 40);
      context.fillText(`Height: ${height}`, x + 10, y + 60);
      context.fillText(`Position X: ${posx}`, x + 10, y + 80);
      context.fillText(`Position Y: ${posy}`, x + 10, y + 100);
    }
  }

  clearPanel(x: number, y: number) {
    const canvas = document.getElementById('myCanvas') as HTMLCanvasElement;
    const context = canvas.getContext('2d');
    const canvasWidth = canvas.width;
    const canvasHeight = canvas.height;
    if (context) {
      //context.clearRect(x, y, width, height);
      context.clearRect(x, y, 90, 100);
    }
    
  }
  
  getIconByName = (name: string): HTMLImageElement => {
    const icon = new Image();
    switch(name) {
      case 'Chair':
        icon.src = 'assets/img/chair.png';
        break;
      case 'Table':
        icon.src = 'assets/img/table.png';
        break;
      case 'GNB':
        icon.src = 'assets/img/gnb.png';
        break;
      case 'UE1':
      case 'UE2':
        icon.src = 'assets/img/ue.png';
        break;
      case 'RIS1':
      case 'RIS2':
        icon.src = 'assets/img/ris.png';
        break;
    }
    return icon;
  };
  
  getfield: Getfield [] = [];
  getFieldInfo() {
    clearTimeout(this.refreshTimeout);
    if (this.commonService.isLocal) {
      /* local file test */
      this.getfield = this.commonService.getfield;
    } else {
      this.apiForRISMgmt.getField().subscribe(
        res => {
          console.log('getfield:');
          this.getfield = res;
          res.profile_id;
          console.log(res);
        }
      );
    }
  }
  
  createChart() {
    const ctx = (document.getElementById('scatterChart') as HTMLCanvasElement).getContext('2d');
    const chairIcon = new Image();
    chairIcon.src = 'assets/img/chair.png';
    const wallIcon = new Image();
    wallIcon.src = 'assets/img/table.png';
    const tableIcon = new Image();
    tableIcon.src = 'assets/img/table.png';
    const gnbIcon = new Image();
    gnbIcon.src = 'assets/img/gnb.png';
    const risIcon = new Image();
    risIcon.src = 'assets/img/ris.png';
    // risIcon.width = 10;
    // risIcon.height = 10;
    const ueIcon = new Image();
    ueIcon.src = 'assets/img/ue.png';

    const iconsLoaded = new Promise<void>((resolve) => {
      const allIcons = [chairIcon, tableIcon, gnbIcon, ueIcon, risIcon];
      let loadedCount = 0;
      allIcons.forEach(icon => {
        icon.onload = () => {
          loadedCount++;
          if (loadedCount === allIcons.length) {
            resolve();
          }
        };
      });
    });
    
    iconsLoaded.then(() => {
      let positions = [
        //RIS
        { x: 15, y: 0, name: 'RIS1', width: 40, height: 40 },
        { x: 15, y: 39, name: 'RIS2', width: 40, height: 40 },
        //GNB
        { x: 5, y: 34, name: 'GNB', width: 70, height: 90 },
        //UE
        { x: 24, y: 18, name: 'UE1', width: 7, height: 15 },
        { x: 24, y: 34, name: 'UE2', width: 7, height: 15 },
        //Chair
        { x: 17, y: 30, name: 'Chair', width: 56, height: 83.5 },
        { x: 18, y: 20, name: 'Chair', width: 56, height: 83.5 },
        //Table
        { x: 18, y: 30, name: 'Table', width: 120, height: 90 },
        { x: 19, y: 30, name: 'Table', width: 120, height: 90 },
        { x: 18, y: 16, name: 'Table', width: 120, height: 90 }
      ];
      const scatterData: ChartData<'scatter', { x: number, y: number, width?: number, height?: number }[]> = {
        datasets: positions.map(position => ({
          label: position.name,
          data: [{ x: position.x, y: position.y, width: position.width, height: position.height }],
          pointRadius: 10,
          pointStyle: this.getIconByName(position.name),
        }))
      };

      const scatterOptions: ChartOptions<'scatter'> = {
        responsive: true,
        scales: {
          x: {
            type: 'linear',
            position: 'bottom',
            max: 40, min: 0,
            grid: { display: true },
            border: { display: true },
            ticks: { display: true, stepSize: 1 },
            title: {
              display: false,
              text: 'Diameter (m)',
            }
          },
          y: {
            type: 'linear',
            position: 'left',
            max: 40, min: 0,
            grid: { display: true },
            border: { display: true },
            ticks: { display: true, stepSize: 2 },
            title: {
              display: false,
              text: 'Height (m)',
            }
          }
        },
        plugins: {
          tooltip: {
            callbacks: {
              label: (context) => {
                const datasetLabel = context.dataset.label || '';
                const dataPoint = context.raw as { x: number, y: number, width?: number, height?: number };
                return [
                  `${datasetLabel}: (${dataPoint.x}, ${dataPoint.y})`,
                  `Width (cm): ${dataPoint.width}`,
                  `Height (cm): ${dataPoint.height}`
                ];
              }
            }
          },
          legend: {
            display: false // Hide the legend
          },
          //custom legend
          // legend: { 
          //   labels: {
          //     generateLabels: (chart) => {
          //       const data = chart.data;
          //       return data.datasets.map((dataset, i) => {
          //         const pointStyle = (dataset as any).pointStyle;
          //         return {
          //           text: dataset.label || '',
          //         fillStyle: pointStyle,
          //         hidden: !chart.isDatasetVisible(i),
          //         datasetIndex: i,
          //         pointStyle: pointStyle
          //         };
          //       });
          //     }
          //   }
          // },
          annotation: {
            annotations: [{
              type: 'box',
              xMin: 10,
              xMax: 30,
              yMin: 25,
              yMax: 25,
              borderWidth: 30,
              borderColor: 'black'
            }, {
              type: 'box',
              xMin: 15,
              xMax: 15,
              yMin: 5,
              yMax: 35,
              borderWidth: 30,
              borderColor: 'black'
            }]
          }
        },
        animation: {
          duration: 0 // Disable animation
        }
      };

      const config: ChartConfiguration<'scatter'> = {
        type: 'scatter',
        data: scatterData,
        options: scatterOptions,
      };

      if (ctx) {
        this.chart = new Chart(ctx, config);
      }
    });
  }

}
