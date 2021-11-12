/* eslint-disable max-len */
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  baseUrl = 'https://atworksblapi.achuhealth.com/api/';
  accessToken = '';
  refreshToken = '';
  userAccount = {};
  retries = 0;
  constructor(private http: HttpClient) {
    let tokens = window.localStorage.getItem('tokens') as any;
    if (tokens) {
      tokens = JSON.parse(tokens);
      this.accessToken = tokens.accessToken;
      this.refreshToken = tokens.refreshToken;
    }
  }

  async post(endpoint, data) {
    try {
      const url = this.baseUrl + endpoint;

      const response = await this.http.post(url, data, {
        headers: new HttpHeaders().set('content-type', 'application/json').set('Authorization', this.accessToken ? ('Bearer ' + this.accessToken) : '')
      }).toPromise() as any;

      if (response == null) {
        return response;
      }
      if (response.isAuthSuccessful) {
        this.accessToken = response.accessToken;
        this.refreshToken = response.refreshToken;
        window.localStorage.setItem('tokens', JSON.stringify({
          accessToken: this.accessToken,
          refreshToken: this.refreshToken
        }));
      } else {
        // Failed Try Again
      }

      return response;
    } catch(error) {
      if (error.status === 401) {
        if (this.retries < 3) {
          this.retries++;
          return this.post(endpoint, data);
        } else {
          this.clearAndReset();
          return null;
        }
      } else {
        return error;
      }
    }
  }

  async get(endpoint) {
    try {
      const url = this.baseUrl + endpoint;

      const response = await this.http.get(url, {
        headers: new HttpHeaders().set('Authorization', 'Bearer ' + this.accessToken)
      }).toPromise() as any;

      return response;
    } catch (error) {
      if (error.status === 401) {
        if (this.retries < 3) {
          this.retries++;
          return this.get(endpoint);
        } else {
          this.clearAndReset();
          return null;
        }
      } else {
        return error;
      }
    }
  }

  clearAndReset() {
    this.accessToken = null;
    this.refreshToken = null;
    this.retries = 0;
    window.localStorage.clear();
  }

}
