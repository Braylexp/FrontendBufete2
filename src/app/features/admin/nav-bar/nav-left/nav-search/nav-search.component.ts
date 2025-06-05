// angular import
import { Component } from '@angular/core';
import { SharedModule } from '../../../../shared/shared.module';

// project import


@Component({
  selector: 'app-nav-search',
  imports: [SharedModule],
  templateUrl: './nav-search.component.html',
  styleUrls: ['./nav-search.component.scss']
})
export class NavSearchComponent {
  // public props
  searchOn: boolean;

  // constructor
  constructor() {
    this.searchOn = false;
  }
}
