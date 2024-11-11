import { Module } from '@nestjs/common';
import { LocationService } from './services/location.service';
import { LocationController } from './controllers/location.controller';
import { Location } from './entities/location.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module';
import { LocationResolver } from './resolvers/location.resolver';

@Module({
  imports: [TypeOrmModule.forFeature([Location]), AuthModule],
  controllers: [LocationController],
  providers: [LocationService, LocationResolver],
  exports: [LocationService],
})
export class LocationModule {}
