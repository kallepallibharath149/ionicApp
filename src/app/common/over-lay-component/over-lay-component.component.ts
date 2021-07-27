import { Component, OnInit, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-over-lay-component',
  templateUrl: './over-lay-component.component.html',
  styleUrls: ['./over-lay-component.component.less']
})
export class OverLayComponentComponent implements OnInit {
  @Input() ImageUrl;
  @Input() videoUrl;
  @Input() ProfileDetails;
  constructor(public activeModal: NgbActiveModal) { }

  ngOnInit(): void {
  }

}
