import { Module } from '@nestjs/common';
import { ShareModule } from '../../core/share/share.module';
import { PortfolioController } from './portfolio.controller';

@Module({
  imports: [ShareModule],
  controllers: [PortfolioController],
})
export class PortfolioModule {}
