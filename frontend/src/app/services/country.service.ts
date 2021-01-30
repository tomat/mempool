import { Inject, Injectable, LOCALE_ID } from '@angular/core';
import { countries, Country } from '../app.constants';
import { ReplaySubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CountryService {
  defaultCountryCode: string;

  country$ = new ReplaySubject<Country>(1);

  constructor(
    @Inject(LOCALE_ID) private locale: string,
  ) {
    this.defaultCountryCode = countries.filter((c) => c.locale === this.locale)[0].code;
    this.loadCountryFromCookie();
  }

  public setCountry(country: Country) {
    if (this.defaultCountryCode === country.code) {
      document.cookie = `country=; expires=Thu, 1 Jan 1970 12:00:00 UTC; path=/`;
    } else {
      try {
        document.cookie = `country=${country.code}; expires=Thu, 18 Dec 2050 12:00:00 UTC; path=/`;
      } catch (e) { }
    }

    this.loadCountryFromCookie();
  }

  public loadCountryFromCookie() {
    let countryCode = this.defaultCountryCode;
    try {
      const value = `; ${document.cookie}`;
      const parts = value.split(`; country=`);
      if (parts.length >= 2) {
        countryCode = parts.pop().split(';').shift();
      }
    } catch (e) {}

    this.country$.next(countries.filter((c) => c.code === countryCode)[0]);
  }
}
