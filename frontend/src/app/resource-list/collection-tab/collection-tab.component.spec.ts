import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CollectionTabComponent } from './collection-tab.component';

describe('CollectionTabComponent', () => {
  let component: CollectionTabComponent;
  let fixture: ComponentFixture<CollectionTabComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CollectionTabComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CollectionTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
