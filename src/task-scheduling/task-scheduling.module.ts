import { Module } from '@nestjs/common';
import { TaskManagerService } from './services/task-manager.service';
import { RealtimeWeatherCachingWorker } from './workers/realtime-weather-caching.worker';
import { ForecastsWeatherCachingWorker } from './workers/forecasts-weather-caching.worker';
import { LocationModule } from '../location/location.module';
import { WeatherModule } from '../weather/weather.module';

@Module({
  imports: [LocationModule, WeatherModule],
  exports: [TaskManagerService, RealtimeWeatherCachingWorker, ForecastsWeatherCachingWorker],
  providers: [TaskManagerService, RealtimeWeatherCachingWorker, ForecastsWeatherCachingWorker],
})
export class TaskSchedulingModule {}
