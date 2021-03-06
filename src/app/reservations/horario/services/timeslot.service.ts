import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs'
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { retry, catchError } from 'rxjs/operators'
import { Timeslot } from '../classes/timeslot'
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

/* const token = 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjoiYWRtaW4iLCJwYXNzd29yZCI6ImFkbWluIn0.hzg6dOCbW23eFXw4n71jjquAOsFGt19vT6l1cOWV2aA'
const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': token})
} */

@Injectable({
  providedIn: 'root'
})
export class TimeslotService {

  private url = `${environment.apiUrl}centro-exames/4/timeslot`

  constructor(private http: HttpClient) { }

  addTimeslot(timeslot: any): Observable<Timeslot> {
    return this.http.post<any>(this.url, timeslot)
  }

  getTimeslots(date: Date): Observable<Timeslot[]> {
    let week = this.getWeekNumber(date)
    return this.http.get<Timeslot[]>(`${this.url}?week=${(week[1])}&year=${week[0]}`)
    // return this.http.get<Timeslot[]>(`${this.url}?week=31&year=2019`, httpOptions)
  }

  getWeekNumber(d) {
    d = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
    d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay()||7));
    var yearStart = new Date(Date.UTC(d.getUTCFullYear(),0,1));
    var weekNo = Math.ceil(( ( (d - +yearStart) / 86400000) + 1)/7);
    return [d.getUTCFullYear(), weekNo];
  }

  updateTimeslot(idTimeslot, newData) {
    return this.http.patch<any>(`${this.url}?idTimeslot=${idTimeslot}`, newData)
  }

  deleteTimeslot(idTimeslot) {
    return this.http.delete<any>(`${this.url}?idTimeslot=${idTimeslot}`)
  }
}
