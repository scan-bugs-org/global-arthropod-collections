import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UploadMapperComponent } from './upload-mapper.component';

describe('UploadMapperComponent', () => {
  let component: UploadMapperComponent;
  let fixture: ComponentFixture<UploadMapperComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UploadMapperComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UploadMapperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
