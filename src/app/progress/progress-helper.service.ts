import { EventEmitter, Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ProgressHelperService {
  public eventHelper = new Subject<{ prev: boolean; next: boolean }>();
  constructor() {}
}
