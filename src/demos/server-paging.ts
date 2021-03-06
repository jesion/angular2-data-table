import { Component, NgModule } from '@angular/core';

import {
  TableOptions,
  TableColumn,
  ColumnMode
} from '../angular2-data-table';

import { AppModule } from './module';
import '../themes/material.scss';

@NgModule({
  imports: [ AppModule ]
})
@Component({
  selector: 'app',
  template: `
    <div>
      <h3>server-paging</h3>
      <datatable
        class='material'
        [rows]='rows'
        [options]='options'
        (onPageChange)='onPage($event)'>
      </datatable>
    </div>
  `
})
export class App {

  rows = [];

  options = new TableOptions({
    columnMode: ColumnMode.force,
    headerHeight: 50,
    footerHeight: 50,
    rowHeight: 'auto',
    externalPaging: true,
    limit: 10,
    columns: [
      new TableColumn({ name: 'Name' }),
      new TableColumn({ name: 'Gender' }),
      new TableColumn({ name: 'Company' })
    ]
  });

  constructor() {
    this.page();
  }

  page() {
    this.fetch((results) => {
      this.options.count = results.length;
      let start = this.options.offset * this.options.limit;
      let end = start + this.options.limit;

      // let paged = results.slice(start, end);

      // splice doesn't let u insert at
      // a new out of bounds index :(
      // this.rows.splice(0, this.rows.length);
      // this.rows.push(...paged)
      // this.rows.splice(start, 0, ...paged);

      for (let i = start; i < end; i++) {
        this.rows[i] = results[i];
      }

      console.log('updated', start, end, this.rows);
    });
  }

  fetch(cb) {
    const req = new XMLHttpRequest();
    req.open('GET', `assets/data/company.json`);

    req.onload = () => {
      cb(JSON.parse(req.response));
    };

    req.send();
  }

  onPage({ offset, limit, count }) {
    console.log('Paged!', offset, limit, count);
    this.page();
  }

}
