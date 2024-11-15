import { Controller, Get, Param, UseInterceptors } from '@nestjs/common';
import { WeatherAPIService } from '../services/weather-api.service';
import { ResponseInterceptor } from '../..//utils/interceptors/response.interceptor';
import { WeatherAPICacheWrapperService } from '../services/weather-api-cache.service';

@Controller()
@UseInterceptors(ResponseInterceptor)
export class WeatherController {
  public constructor(protected weatherAPICacheWrapperService: WeatherAPICacheWrapperService) {}

  @Get('/weather/:city')
  public async getRealtimeWeather(@Param('city') city: string) {
    return this.weatherAPICacheWrapperService.getCachedRealtimeWeather(city);
  }

  @Get('/forecast/:city')
  public async getWeatherForecasts(@Param('city') city: string) {
    return this.weatherAPICacheWrapperService.getCachedWeatherForecasts(city);
  }
}
