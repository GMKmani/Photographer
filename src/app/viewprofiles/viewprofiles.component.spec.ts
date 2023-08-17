import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewprofilesComponent } from './viewprofiles.component';

describe('ViewprofilesComponent', () => {
  let component: ViewprofilesComponent;
  let fixture: ComponentFixture<ViewprofilesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewprofilesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewprofilesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
