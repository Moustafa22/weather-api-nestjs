import { Controller, Get, Param, UseInterceptors } from '@nestjs/common';
import { WeatherAPIService } from '../services/weather-api.service';
import { ResponseInterceptor } from '../..//utils/interceptors/response.interceptor';

@Controller()
@UseInterceptors(ResponseInterceptor)
export class WeatherController {
  public constructor(protected weatherService: WeatherAPIService) {}

  @Get('/weather/:city')
  public async getRealtimeWeather(@Param('city') city: string) {
    return this.weatherService.getRealtimeWeather(city);
  }

  @Get('/forecast/:city')
  public async getWeatherForecasts(@Param('city') city: string) {
    return this.weatherService.getWeatherForecasts(city);
  }
}
