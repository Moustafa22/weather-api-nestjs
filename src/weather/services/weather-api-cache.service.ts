import { Inject, Injectable } from '@nestjs/common';
import { WeatherAPIService } from './weather-api.service';
import { RealtimeWeatherData } from '../@types/realtime-weather.type';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { WeatherForecasts } from '../@types/forecasts.type';
import { HourInMs, TwelveHoursInMs } from '../../utils/helpers/time';

type weatherType = 'realtime' | 'forecast';

@Injectable()
export class WeatherAPICacheWrapperService {
  public constructor(
    private weatherService: WeatherAPIService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  /**
   * Gets the cached current weather data (realtime) and refresh the cache when needed
   * @param cityName : string, the name of the requested city weather
   * @returns Promise<RealtimeWeatherData>
   * */
  public async getCachedRealtimeWeather(cityName: string): Promise<RealtimeWeatherData> {
    // setup the key for caching
    const key = this.getKey('realtime', cityName);

    // get the cached key's data
    let weatherData: RealtimeWeatherData = await this.cacheManager.get(key);

    // cache cleared or expired ttl
    if (!weatherData) {
      // re-call the API and fetch the data
      weatherData = await this.weatherService.getRealtimeWeather(cityName);

      // cache the fresh data for 1 hour ttl
      // set the ttl in milliseconds (cache-manager v5)
      this.cacheManager.set(key, weatherData, HourInMs);
    }

    // return cached/refreshed data
    return weatherData;
  }

  /**
   * Get X cached days weather forecast data and refresh the cache when needed
   * @param cityName : string, the name of the requested city weather
   * @returns
   */
  public async getCachedWeatherForecasts(cityName: string): Promise<WeatherForecasts[]> {
    // setup the key for caching
    const key = this.getKey('forecast', cityName);

    // get the cached key's data
    let forecastsData: WeatherForecasts[] = await this.cacheManager.get(key);

    // cache cleared or expired ttl
    if (!forecastsData) {
      // re-call the API and fetch the data
      forecastsData = await this.weatherService.getWeatherForecasts(cityName);

      // cache the fresh data for 12 hours ttl (future forecasts change interval is more than 12 hours)
      // set the ttl in milliseconds (cache-manager v5)
      this.cacheManager.set(key, forecastsData, TwelveHoursInMs);
    }

    // return cached/refreshed data
    return forecastsData;
  }

  /**
   * Refreshes the city cache
   * @param cityName
   * @returns void
   */
  public async refreshRealtimeWeatherCache(cityName: string) {
    const key = this.getKey('realtime', cityName);

    const weatherData = await this.weatherService.getRealtimeWeather(cityName);

    // cache the fresh data for 1 hour ttl
    // set the ttl in milliseconds (cache-manager v5)
    this.cacheManager.set(key, weatherData, HourInMs);
  }

  /**
   * Refreshes the city cache
   * @param cityName
   * @returns void
   */
  public async refreshForecastWeatherCache(cityName: string) {
    const key = this.getKey('forecast', cityName);

    const forecastsData = await this.weatherService.getWeatherForecasts(cityName);

    // cache the fresh data for 12 hours ttl (future forecasts change interval is more than 12 hours)
    // set the ttl in milliseconds (cache-manager v5)
    this.cacheManager.set(key, forecastsData, TwelveHoursInMs);
  }

  /**
   * Gets Caching Key
   * @param type weather type (forecast/realtime)
   * @param cityName cityName
   * @returns string
   */
  private getKey(type: weatherType, cityName: string) {
    return `${type}-${cityName}`;
  }
}
