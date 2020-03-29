import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-excel',
  templateUrl: './excel.component.html',
  styleUrls: ['./excel.component.css']
})
export class ExcelComponent implements OnInit {
  curUser ;
  excelData = [] ;
  constructor(private authService: AuthService) {
    this.curUser = this.authService.user;
  }
  ngOnInit() {
  }

  async postExcel(): Promise<void> {
    await this.authService.addInfoToExcel(this.curUser);
  }

  async getExcel(): Promise<void> {
  await this.authService.getInfoFromExcel()
  .subscribe(data => {
      this.showData(data);
  });
  }

  showData(retreived) {
    this.excelData = [];
    const rows = retreived.value;
    rows.forEach(rowData => {
      this.excelData.push(rowData.values[0]);
    });
    console.log(this.excelData);
  }
  change(i) {
    alert(i)
  }

}
