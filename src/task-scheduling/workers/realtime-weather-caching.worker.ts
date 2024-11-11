import { Injectable } from '@nestjs/common';
import { LocationService } from 'src/location/services/location.service';
import { sleep } from '../../utils/helpers/sleep';
import { WeatherAPICacheWrapperService } from 'src/weather/services/weather-api-cache.service';
import { FiveSecondsInMs } from '../../utils/helpers/time';

@Injectable()
export class RealtimeWeatherCachingWorker {
  public constructor(
    protected locationService: LocationService,
    protected weatherCacheService: WeatherAPICacheWrapperService,
  ) {}

  public async runTask() {
    const locations = await this.locationService.findAll();

    for (let i = 0; i < locations.length; i++) {
      const cityName = locations[i].city;

      await this.weatherCacheService.refreshRealtimeWeatherCache(cityName);

      // to avoid rate limit (free api plan)
      await sleep(FiveSecondsInMs);
    }
  }
}
