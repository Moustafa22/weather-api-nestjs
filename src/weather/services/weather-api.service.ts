import { Injectable, NotFoundException } from '@nestjs/common';
import axios from 'axios';
import { RealtimeWeatherData } from '../@types/realtime-weather.type';
import { WeatherForecasts } from '../@types/forecasts.type';

@Injectable()
export class WeatherAPIService {
  public constructor() {}

  /**
   * Gets the current weather data (realtime)
   * @param cityName : string, the name of the requested city weather
   * @returns Promise<RealtimeWeatherData>
   * */
  public async getRealtimeWeather(cityName: string): Promise<RealtimeWeatherData> {
    const weatherInfo = await this.fetchWeatherData(cityName);
    return weatherInfo.data.current;
  }

  /**
   * Get X days weather forecast data
   * @param cityName : string, the name of the requested city weather
   * @returns
   */
  public async getWeatherForecasts(cityName: string): Promise<WeatherForecasts[]> {
    const daysToForecast = parseInt(process.env.DAYS_TO_FORECAST);
    const forecasts = await this.fetchWeatherData(cityName, daysToForecast);
    return forecasts.data.forecast.forecastday;
  }

  /**
   * Calls the API and fetches the data
   * Note: in forcasts API they return the current weather, so this call is used for both forecasts and realtime weather
   * @param locationName: string
   * @param days? (Optional)
   * @returns any
   */
  private async fetchWeatherData(locationName: string, days?: number) {
    let query = `key=${process.env.WEATHER_API_KEY}&q=${locationName}`;
    if (days) query += `&days=${days}`;
    try {
      let response = await axios.get(`http://api.weatherapi.com/v1/forecast.json?${query}`);
      return response;
    } catch (e) {
      throw new NotFoundException('City Not Found');
    }
  }
}
