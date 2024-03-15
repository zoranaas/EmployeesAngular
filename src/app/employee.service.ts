import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Employee } from './employee';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {
  private apiUrl = 'https://rc-vault-fap-live-1.azurewebsites.net/api/gettimeentries?code=vO17RnE8vuzXzPJo5eaLLjXjmRW07law99QTD90zat9FfOQJKKUcgQ==';

  constructor(private http: HttpClient) { }

  getEmployees(): Observable<Employee[]> {
    return this.http.get<Employee[]>(this.apiUrl).pipe(
      map(data => {
       
        const uniqueNames = Array.from(new Set(data.map(item => item.EmployeeName)));

        const employeesWithTotalTime: Employee[] = uniqueNames.map(name => {
          const entriesForName = data.filter(item => item.EmployeeName === name);
          let totalTimeMilliseconds = 0;
          for (const entry of entriesForName) {
            const startTime = new Date(entry.StarTimeUtc);
            const endTime = new Date(entry.EndTimeUtc);
            totalTimeMilliseconds += endTime.getTime() - startTime.getTime();
          }
          
          const totalTimeHours = (totalTimeMilliseconds / (1000 * 60 * 60)).toFixed(1);
          
          return {
            EmployeeName: name,
            StarTimeUtc: entriesForName[0].StarTimeUtc,
            EndTimeUtc: entriesForName[0].EndTimeUtc,
            TotalTimeWorked: parseFloat(totalTimeHours)
          };
        });

        return employeesWithTotalTime;
      })
    );
  }
}

