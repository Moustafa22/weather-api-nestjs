import { Test, TestingModule } from '@nestjs/testing';
import { WeatherController } from './weather.controller';
import { WeatherAPIService } from '../services/weather-api.service';
import { ResponseInterceptor } from '../../utils/interceptors/response.interceptor';
import { RealtimeWeatherData } from '../@types/realtime-weather.type';
import { WeatherForecasts } from '../@types/forecasts.type';

describe('WeatherController', () => {
  let controller: WeatherController;
  let weatherService: WeatherAPIService;

  const mockRealtimeWeatherData: RealtimeWeatherData = {
    humidity: 50,
    last_updated_epoch: 0,
    last_updated: '',
    temp_c: 0,
    temp_f: 0,
    is_day: 0,
    condition: undefined,
    wind_mph: 0,
    wind_kph: 0,
    wind_degree: 0,
    wind_dir: '',
    pressure_mb: 0,
    pressure_in: 0,
    precip_mm: 0,
    precip_in: 0,
    cloud: 0,
    feelslike_c: 0,
    feelslike_f: 0,
    windchill_c: 0,
    windchill_f: 0,
    heatindex_c: 0,
    heatindex_f: 0,
    dewpoint_c: 0,
    dewpoint_f: 0,
    vis_km: 0,
    vis_miles: 0,
    uv: 0,
    gust_mph: 0,
    gust_kph: 0,
  };

  const mockWeatherForecasts: WeatherForecasts[] = [
    {
      date: '',
      date_epoch: 0,
      day: {
        maxtemp_c: 29.7,
        maxtemp_f: 85.4,
        mintemp_c: 26.8,
        mintemp_f: 80.2,
        avgtemp_c: 28.2,
        avgtemp_f: 82.7,
        maxwind_mph: 9.2,
        maxwind_kph: 14.8,
        totalprecip_mm: 0,
        totalprecip_in: 0,
        totalsnow_cm: 0,
        avgvis_km: 10,
        avgvis_miles: 6,
        avghumidity: 60,
        daily_will_it_rain: 0,
        daily_chance_of_rain: 0,
        daily_will_it_snow: 0,
        daily_chance_of_snow: 0,
        condition: {
          text: 'Sunny',
          icon: '//cdn.weatherapi.com/weather/64x64/day/113.png',
          code: 1000,
        },
        uv: 1.2,
      },
      astro: {
        sunrise: '06:33 AM',
        sunset: '05:33 PM',
        moonrise: '02:25 PM',
        moonset: '01:28 AM',
        moon_phase: 'Waxing Gibbous',
        moon_illumination: 69,
        is_moon_up: 0,
        is_sun_up: 0,
      },
      hour: [
        {
          time_epoch: 1731268800,
          time: '2024-11-11 00:00',
          temp_c: 26.9,
          temp_f: 80.4,
          is_day: 0,
          condition: {
            text: 'Clear ',
            icon: '//cdn.weatherapi.com/weather/64x64/night/113.png',
            code: 1000,
          },
          wind_mph: 3.1,
          wind_kph: 5,
          wind_degree: 63,
          wind_dir: 'ENE',
          pressure_mb: 1015,
          pressure_in: 29.98,
          precip_mm: 0,
          precip_in: 0,
          snow_cm: 0,
          humidity: 63,
          cloud: 0,
          feelslike_c: 28.4,
          feelslike_f: 83.2,
          windchill_c: 26.9,
          windchill_f: 80.4,
          heatindex_c: 28.4,
          heatindex_f: 83.2,
          dewpoint_c: 19.3,
          dewpoint_f: 66.8,
          will_it_rain: 0,
          chance_of_rain: 0,
          will_it_snow: 0,
          chance_of_snow: 0,
          vis_km: 10,
          vis_miles: 6,
          gust_mph: 5.4,
          gust_kph: 8.7,
          uv: 0,
        },
      ],
    },
  ];

  const mockWeatherService = {
    getRealtimeWeather: jest.fn().mockResolvedValue(mockRealtimeWeatherData),
    getWeatherForecasts: jest.fn().mockResolvedValue(mockWeatherForecasts),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [WeatherController],
      providers: [{ provide: WeatherAPIService, useValue: mockWeatherService }],
    })
      .overrideInterceptor(ResponseInterceptor)
      .useValue({ intercept: jest.fn() })
      .compile();

    controller = module.get<WeatherController>(WeatherController);
    weatherService = module.get<WeatherAPIService>(WeatherAPIService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getRealtimeWeather', () => {
    it('should return current weather data for the specified city', async () => {
      const city = 'London';
      const result = await controller.getRealtimeWeather(city);

      expect(weatherService.getRealtimeWeather).toHaveBeenCalledWith(city);
      expect(result).toEqual(mockRealtimeWeatherData);
    });
  });

  describe('getWeatherForecasts', () => {
    it('should return weather forecast data for the specified city', async () => {
      const city = 'London';
      const result = await controller.getWeatherForecasts(city);

      expect(weatherService.getWeatherForecasts).toHaveBeenCalledWith(city);
      expect(result).toEqual(mockWeatherForecasts);
    });
  });
});
