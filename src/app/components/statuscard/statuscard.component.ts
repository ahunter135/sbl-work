import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-statuscard',
  templateUrl: './statuscard.component.html',
  styleUrls: ['./statuscard.component.scss'],
})
export class StatuscardComponent implements OnInit {
  @Input() statusName = '';
  @Input() statusDescription = '';
  @Input() loading = false;
  constructor() { }

  ngOnInit() {}

}
