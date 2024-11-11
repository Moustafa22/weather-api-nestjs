import { Module } from '@nestjs/common';
import { WeatherController } from './controllers/weather.controller';
import { WeatherAPIService } from './services/weather-api.service';
import { CacheModule } from '@nestjs/cache-manager';
import { redisStore } from 'cache-manager-redis-yet';
import { WeatherAPICacheWrapperService } from './services/weather-api-cache.service';

@Module({
  imports: [
    CacheModule.registerAsync({
      useFactory: async () => {
        const store = await redisStore({
          socket: {
            host: process.env.REDIS_HOST,
            port: parseInt(process.env.REDIS_PORT),
          },
        });

        return { store };
      },
    }),
  ],
  exports: [WeatherAPIService, WeatherAPICacheWrapperService],
  providers: [WeatherAPIService, WeatherAPICacheWrapperService],
  controllers: [WeatherController],
})
export class WeatherModule {}
