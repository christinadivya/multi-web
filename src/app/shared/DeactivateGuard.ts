import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CanDeactivate } from '@angular/router';
import { CanComponentDeactivate } from './interface';
@Injectable()
export class GurdGuard implements CanDeactivate<CanComponentDeactivate> {
  canDeactivate(component: CanComponentDeactivate) {   
    return component.canDeactivate ? component.canDeactivate() : true;  }
}
