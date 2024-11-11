import { Injectable } from '@nestjs/common';
import { LocationService } from '../../location/services/location.service';
import { sleep } from '../../utils/helpers/sleep';
import { WeatherAPICacheWrapperService } from '../../weather/services/weather-api-cache.service';
import { FiveSecondsInMs } from '../../utils/helpers/time';

@Injectable()
export class ForecastsWeatherCachingWorker {
  public constructor(
    protected locationService: LocationService,
    protected weatherCacheService: WeatherAPICacheWrapperService,
  ) {}

  public async runTask() {
    const locations = await this.locationService.findAll();

    for (let i = 0; i < locations.length; i++) {
      const cityName = locations[i].city;

      await this.weatherCacheService.refreshForecastWeatherCache(cityName);

      // to avoid rate limit (free api plan)
      await sleep(FiveSecondsInMs);
    }
  }
}
