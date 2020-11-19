import { ElementRef, ViewChild } from '@angular/core';
import { timer } from 'rxjs';
import { ProgressHelperService } from './progress-helper.service';

export enum UiState {
  ACTIVE = 'active',
  COMPLETE = 'complete',
}

export class UiHelper {
  @ViewChild('container', { static: false }) public container: ElementRef<
    HTMLDivElement
  >;

  constructor(protected progressHelper: ProgressHelperService) {}

  protected initActiveElement(activeIndex): void {
    this.elementList[activeIndex].classList.add(UiState.ACTIVE);
    this.elementList[activeIndex].children[1].classList.add(UiState.ACTIVE);
  }

  protected completeLastStep() {
    const savedInd = this.activeProgressElement.activeInd;
    this.elementList[savedInd].classList.remove(UiState.ACTIVE);
    this.elementList[savedInd].classList.add(UiState.COMPLETE);
  }

  protected removeLastComplete() {
    const savedInd =
      this.activeProgressElement.activeInd ||
      this.completedProgressElement.completedElIndex;
    this.elementList[savedInd].classList.remove(UiState.COMPLETE);
    this.elementList[savedInd].classList.add(UiState.ACTIVE);
  }

  protected switchActiveElement(index): void {
    const savedInd = this.activeProgressElement.activeInd;
    const hasProgress = !!this.elementList[savedInd].children[1];

    this.elementList[savedInd].classList.remove(UiState.ACTIVE);
    this.elementList[savedInd].classList.add(UiState.COMPLETE);

    if (hasProgress) {
      this.elementList[savedInd].children[1].classList.remove(UiState.ACTIVE);
      this.elementList[savedInd].children[1].classList.add(UiState.COMPLETE);
    }

    this.elementList[index].classList.add(UiState.ACTIVE);

    timer(500).subscribe({
      complete: () => {
        let hasProgressAtIndex = !!this.elementList[index].children[1];
        if (hasProgressAtIndex) {
          this.elementList[index].children[1].classList.add(UiState.ACTIVE);
        }
      },
    });
  }

  protected switchActiveElementPrev(index) {
    const savedInd =
      this.activeProgressElement.activeInd ||
      this.completedProgressElement.completedElIndex;
    const hasProgress = !!this.elementList[savedInd].children[1];

    this.elementList[savedInd].classList.remove(UiState.ACTIVE);
    this.elementList[savedInd].classList.remove(UiState.COMPLETE);

    if (hasProgress) {
      this.elementList[savedInd].children[1].classList.remove(UiState.ACTIVE);
      this.elementList[savedInd].children[1].classList.remove(UiState.COMPLETE);
    }

    this.elementList[index].classList.add(UiState.ACTIVE);
    this.elementList[index].classList.remove(UiState.COMPLETE);

    timer(500).subscribe({
      complete: () => {
        let hasProgressAtIndex = !!this.elementList[index].children[1];
        if (hasProgressAtIndex) {
          this.elementList[index].children[1].classList.add(UiState.ACTIVE);
          this.elementList[index].children[1].classList.remove(
            UiState.COMPLETE
          );
        }
      },
    });
  }

  protected get activeProgressElement() {
    let obj = {} as { activeEl: HTMLElement; activeInd: number };
    this.elementList.forEach((el, i) => {
      if (el && el.classList && el.classList.contains(UiState.ACTIVE)) {
        obj = {
          ...obj,
          activeEl: el,
          activeInd: i,
        };
      }
    });
    return obj;
  }

  protected get completedProgressElement() {
    let obj = {} as { completedEl: HTMLElement; completedElIndex: number };
    this.elementList.forEach((el, i) => {
      if (el && el.classList && el.classList.contains(UiState.COMPLETE)) {
        obj = {
          ...obj,
          completedEl: el,
          completedElIndex: i,
        };
      }
    });
    return obj;
  }

  /**
   * cast the HTMLCollection into an Array of HTMLElement
   */
  protected get elementList(): HTMLElement[] {
    if (this.listExists) {
      return Array.prototype.slice.call(this.container.nativeElement.children);
    }
  }

  protected get listExists(): boolean {
    return (
      this.container &&
      this.container.nativeElement &&
      this.container.nativeElement.childNodes &&
      this.container.nativeElement.childNodes.length > 0
    );
  }
}
