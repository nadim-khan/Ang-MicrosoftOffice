import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../auth.service';


@Component({
  selector: 'app-adds-in',
  templateUrl: './adds-in.component.html',
  styleUrls: ['./adds-in.component.css']
})
export class AddsInComponent implements OnInit {
 data;
  constructor(private http: HttpClient, private authService: AuthService) {
    this.authService.getAddsIn().subscribe(data => {
      console.log(this.data);
    });
   }

  ngOnInit() {
  }

}
