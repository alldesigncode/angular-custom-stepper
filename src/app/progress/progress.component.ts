import {
  AfterContentInit,
  AfterViewInit,
  Component,
  ContentChildren,
  EventEmitter,
  Input,
  OnInit,
  Output,
  QueryList,
} from '@angular/core';
import { ProgressHelperService } from './progress-helper.service';
import { ProgressStepComponent } from './progress-step/progress-step.component';
import { UiHelper } from './uiHelper';

@Component({
  selector: 'app-progress',
  templateUrl: './progress.component.html',
  styleUrls: ['./progress.component.scss'],
})
export class ProgressComponent
  extends UiHelper
  implements OnInit, AfterContentInit, AfterViewInit {
  itemLength: number;
  itemProgressList: number[] = [];

  public activeIndex = 0;

  @Input() public set selectedIndex(value) {
    this.activeIndex = value || 0;
  }

  @Output() public stateChange = new EventEmitter<{
    activeIndex: number;
    activeStep: ProgressStepComponent;
  }>();

  @ContentChildren(ProgressStepComponent) public steps: QueryList<
    ProgressStepComponent
  >;

  constructor(protected progressHelper: ProgressHelperService) {
    super(progressHelper);
  }

  ngOnInit(): void {
    this.progressHelper.eventHelper.subscribe({
      next: ({ prev, next }) => {
        if (next) {
          this.next();
        }

        if (prev) {
          this.prev();
        }
      },
    });
  }

  ngAfterContentInit() {
    this.initProgress(this.progressSteps.length);
    this.setActiveActiveStep(this.activeIndex);
    this.initStepIndex();
  }

  ngAfterViewInit() {
    this.initActiveElement(this.activeIndex);
  }

  public next() {
    this.increaseStep();
  }

  public prev() {
    this.decreaseStep();
  }

  private increaseStep() {
    if (
      this.activeIndex === this.itemLength - 1 &&
      this.completedProgressElement.completedElIndex !== this.activeIndex
    ) {
      this.completeLastStep();
    }

    if (this.activeIndex < this.itemLength - 1) {
      this.activeIndex++;
      this.switchActiveElement(this.activeIndex);
      this.setActiveActiveStep(this.activeIndex);
      this.emitStateChange();
    }
  }

  private decreaseStep() {
    if (
      this.activeIndex === this.itemLength - 1 &&
      this.completedProgressElement.completedElIndex === this.activeIndex
    ) {
      this.removeLastComplete();
    } else {
      if (this.activeIndex > 0) {
        this.activeIndex--;
        this.switchActiveElementPrev(this.activeIndex);
        this.setActiveActiveStep(this.activeIndex);
        this.emitStateChange();
      }
    }
  }

  private emitStateChange(): void {
    this.stateChange.emit({
      activeIndex: this.activeIndex,
      activeStep: this.activeStep,
    });
  }

  private setActiveActiveStep(index: number): void {
    if (this.stepsExists) {
      this.removeActiveStep();
      this.updateActiveStep(index);
    }
  }

  private updateActiveStep(index) {
    this.progressSteps[index].activeState = this.progressSteps[index];
  }

  private removeActiveStep() {
    this.progressSteps.map((step) => {
      if (step.isActive) {
        step.isActive = false;
      }
    });
  }

  private initStepIndex() {
    this.progressSteps.forEach((step, i) => (step.stepIndex = i));
  }

  public get activeStep(): ProgressStepComponent {
    return this.progressSteps[this.activeIndex];
  }

  private get stepsExists(): boolean {
    return this.progressSteps && Array.isArray(this.progressSteps);
  }

  private get progressSteps(): ProgressStepComponent[] {
    return this.steps.toArray();
  }

  private initProgress(value): void {
    this.itemLength = value || 0;
    this.itemProgressList = this.generateProgressArray(this.itemLength);
  }

  private generateProgressArray(length): number[] {
    return [...Array(length).keys()];
  }
}
