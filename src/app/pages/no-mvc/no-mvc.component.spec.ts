import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NoMvcComponent } from './no-mvc.component';

describe('NoMvcComponent', () => {
  let component: NoMvcComponent;
  let fixture: ComponentFixture<NoMvcComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NoMvcComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NoMvcComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
