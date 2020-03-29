import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-word',
  templateUrl: './word.component.html',
  styleUrls: ['./word.component.css']
})
export class WordComponent implements OnInit {

  constructor(private authService: AuthService) { }

  ngOnInit() {
  }
  getWord() {
    alert('Get Word');
  }

  postWord() {
    alert('Post Word');
  }

}
