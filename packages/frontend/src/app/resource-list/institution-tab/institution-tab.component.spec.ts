import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InstitutionTabComponent } from './institution-tab.component';

describe('InstitutionTabComponent', () => {
  let component: InstitutionTabComponent;
  let fixture: ComponentFixture<InstitutionTabComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InstitutionTabComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InstitutionTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
