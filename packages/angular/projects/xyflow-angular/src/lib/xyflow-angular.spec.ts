import { ComponentFixture, TestBed } from '@angular/core/testing';

import { XyflowAngular } from './xyflow-angular';

describe('XyflowAngular', () => {
  let component: XyflowAngular;
  let fixture: ComponentFixture<XyflowAngular>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [XyflowAngular]
    })
    .compileComponents();

    fixture = TestBed.createComponent(XyflowAngular);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
