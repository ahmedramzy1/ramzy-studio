import { Module } from '@nestjs/common';
import { PageModule } from '../../core/page/page.module';
import { ShareModule } from '../../core/share/share.module';
import { PortfolioController } from './portfolio.controller';

@Module({
  imports: [
    ShareModule,
    PageModule,
  ],
  controllers: [PortfolioController],
})
export class PortfolioModule {}
