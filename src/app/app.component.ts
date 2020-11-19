import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { delay } from 'rxjs/operators';
import { ProgressComponent } from './progress/progress.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit, AfterViewInit {
  testForm = new FormGroup({
    food: new FormControl('', Validators.required),
    comment: new FormControl('', Validators.required),
  });
  ngOnInit() {}

  goNext(progress: ProgressComponent) {
    progress.next();
  }

  onStateChange(event) {
    console.log(event);
  }

  ngAfterViewInit() {}
}
