import { Component, EventEmitter, Injectable, Output, ViewEncapsulation } from '@angular/core';
import { CalendarDayViewComponent, CalendarUtils } from 'angular-calendar';
import { DayView, DayViewEvent, GetDayViewArgs } from 'calendar-utils';
import { DataShareService } from '../services/data-share.service'

const EVENT_WIDTH = 150;

// extend the interface to add the array of groups
interface DayViewScheduler extends DayView {
  groups: any[];
}

@Injectable()
export class DayViewSchedulerCalendarUtils extends CalendarUtils {
  getDayView(args: GetDayViewArgs): DayViewScheduler {
    const view: DayViewScheduler = {
      ...super.getDayView(args),
      groups: []
    };
    view.events.forEach(({ event }) => {
      // assumes group objects are the same references,
      // if 2 groups have the same structure but different object references this will fail
      if (!view.groups.includes(event.meta.group)) {
        view.groups.push(event.meta.group);
      }
    });
    // sort the groups by their names
    view.groups.sort((group1, group2) => {
      return parseInt(group1.title.substr(6)) - parseInt(group2.title.substr(6))
    })
    view.events = view.events.map(dayViewEvent => {
      const index = view.groups.indexOf(dayViewEvent.event.meta.group);
      dayViewEvent.left = index * EVENT_WIDTH; // change the column of the event
      return dayViewEvent;
    });
    view.width = view.groups.length * EVENT_WIDTH;
    return view;
  }
}

@Component({
  // tslint:disable-line max-classes-per-file
  selector: 'mwl-day-view-scheduler',
  styles: [
    `
      .cal-day-view .cal-event {
        color: black !important;
        font-weight: bold !important;
      }
      
      .day-view-column-headers {
        display: flex;
        margin-left: 70px;
        min-width: max-content;
      }
      .day-view-column-header {
        width: 150px;
        border: solid 1px black;
        border-radius: 5px;
        background-color: #c0c0ff;
        text-align: center;
      }
    `

  ],
  encapsulation: ViewEncapsulation.None,
  providers: [
    {
      provide: CalendarUtils,
      useClass: DayViewSchedulerCalendarUtils
    }
  ],
  templateUrl: 'day-view-scheduler.component.html'
})
export class DayViewSchedulerComponent extends CalendarDayViewComponent {
  view: DayViewScheduler;

  @Output() userChanged = new EventEmitter();

  eventDragged(dayEvent: DayViewEvent, xPixels: number, yPixels: number): void {
    super.dragEnded(dayEvent, { y: yPixels, x: 0 } as any); // original behaviour
  }
  hourSegmentHeight = 45

  chooseTimeslot(timeslot) {
    let dataShareService = new DataShareService()
    dataShareService.setChosenTimeslotId(timeslot.id)
  }
}
