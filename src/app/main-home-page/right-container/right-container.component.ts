import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-right-container',
  templateUrl: './right-container.component.html',
  styleUrls: ['./right-container.component.less']
})
export class RightContainerComponent implements OnInit {


  constructor(private router: Router) { }

  ngOnInit(): void {
  }


}
