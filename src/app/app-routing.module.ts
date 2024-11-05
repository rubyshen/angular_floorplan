import { NgModule } from '@angular/core';
import { AuthGuard } from './shared/guard/auth.guard';
import { RouterModule, Routes } from '@angular/router';

// 底畫面 ( 網頁整體最下層 有 Bar 那塊 )
import { MainComponent } from './main/main.component';

// 登入畫面
import { LoginComponent } from './login/login.component';
import { RISManagementComponent } from './ris-management/ris-management.component';    // RIS 管理
import { RISInfoComponent } from './ris-management/ris-info/ris-info.component';
import { PlannerManagementComponent } from './planner-management/planner-management.component';
import { ArchitectureManagementComponent } from './architecture-management/architecture-management.component';
import { FloorPlanComponent } from './floor-plan/floor-plan.component';

// 主畫面 Portal
//import { DashboardComponent } from './dashboard/dashboard.component';   // 主畫面

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  {
    path: 'main', component: MainComponent, canActivate: [AuthGuard],
    children: [
      {
        path: 'ris-mgr',
        children: [
          { path: '', component: RISManagementComponent },
          { path: 'info/:id/:name/:risUrl', component: RISInfoComponent }
        ]
      },
      { 
        path: 'planner-mgr', component: PlannerManagementComponent 
      },
      { 
        path: 'architecture-mgr', component: ArchitectureManagementComponent 
      },
      { 
        path: 'floor-plan', component: FloorPlanComponent  // 新增的 Floor Plan 路由
      }
      
    ]
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
