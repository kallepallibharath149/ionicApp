import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, HostListener, OnInit, Renderer2, ViewChild } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-main-layout',
  templateUrl: './main-layout.component.html',
  styleUrls: ['./main-layout.component.less']
})
export class MainLayoutComponent implements OnInit, AfterViewInit {

  @ViewChild('mainDynamicContainer')mainDynamicContainer:ElementRef;
  @ViewChild('topBanner')topBanner:ElementRef;
  public someHeight: any;
  @HostListener('window:resize', ['$event'])
  onResize($event) {
  this.checkHeight();
  };

  checkHeight(){
    this.setDynamicCOntainerHeight();
    this.someHeight = this.topBanner.nativeElement.getBoundingClientRect().height;
  }

 

  setDynamicCOntainerHeight(){
    
  }
  constructor( private renderer: Renderer2,
    private sanitizer: DomSanitizer,
    private cd:ChangeDetectorRef) { }

  ngOnInit(): void {
  }

  ngAfterViewInit(){
  this.checkHeight();
  this.cd.detectChanges();
  }

}
