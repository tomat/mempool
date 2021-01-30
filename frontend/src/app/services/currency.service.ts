import { Inject, Injectable, LOCALE_ID } from '@angular/core';
import { getLocaleCurrencyCode } from '@angular/common';
import { Country, currencies, Currency } from '../app.constants';
import { Observable, ReplaySubject } from 'rxjs';
import { CountryService } from './country.service';

@Injectable({
  providedIn: 'root'
})
export class CurrencyService {
  defaultCurrencyCode: string;

  currency$ = new ReplaySubject<Currency>(1);
  country$: Observable<Country>;

  constructor(
    private countryService: CountryService,
    @Inject(LOCALE_ID) private locale: string,
  ) {
    this.country$ = this.countryService.country$.asObservable();
    this.defaultCurrencyCode = getLocaleCurrencyCode(this.locale);
    this.loadCurrencyFromCookie();
  }

  public setCurrency(currency: Currency) {
    if (this.defaultCurrencyCode === currency.code) {
      document.cookie = `currency=; expires=Thu, 1 Jan 1970 12:00:00 UTC; path=/`;
    } else {
      try {
        document.cookie = `currency=${currency.code}; expires=Thu, 18 Dec 2050 12:00:00 UTC; path=/`;
      } catch (e) { }
    }

    this.loadCurrencyFromCookie();
  }

  public loadCurrencyFromCookie() {
    let currencyCode = this.defaultCurrencyCode;
    try {
      const value = `; ${document.cookie}`;
      const parts = value.split(`; currency=`);
      if (parts.length >= 2) {
        currencyCode = parts.pop().split(';').shift();
      }
    } catch (e) {}

    this.currency$.next(currencies.filter((c) => c.code === currencyCode)[0]);
  }
}
