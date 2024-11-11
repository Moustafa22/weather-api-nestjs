import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { RealtimeWeatherCachingWorker } from '../workers/realtime-weather-caching.worker';
import { ForecastsWeatherCachingWorker } from '../workers/forecasts-weather-caching.worker';

@Injectable()
export class TaskManagerService {
  public constructor(
    private realtimeWorker: RealtimeWeatherCachingWorker,
    private forecastsWorker: ForecastsWeatherCachingWorker,
  ) {}

  @Cron(CronExpression.EVERY_HOUR)
  public async refreshRealtimeWeatherCache() {
    // preparation if any
    this.realtimeWorker.runTask();
  }

  @Cron(CronExpression.EVERY_12_HOURS)
  public async refreshForecastWeatherCache() {
    // preparation if any
    this.forecastsWorker.runTask();
  }
}
