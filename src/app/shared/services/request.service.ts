import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { DefaultResponseType } from '../../types/default-response.type';
import { RequestType } from '../../types/request.type';

@Injectable({ providedIn: 'root' })
export class RequestService {
  private readonly http = inject(HttpClient);

  sendRequest(request: RequestType): Observable<DefaultResponseType> {
    return this.http.post<DefaultResponseType>(environment.api + 'requests', request);
  }
}
