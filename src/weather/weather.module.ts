import { Module } from '@nestjs/common';
import { WeatherController } from './controllers/weather.controller';
import { WeatherAPIService } from './services/weather-api.service';

@Module({
  imports: [],
  exports: [WeatherAPIService],
  providers: [WeatherAPIService],
  controllers: [WeatherController],
})
export class WeatherModule {}
