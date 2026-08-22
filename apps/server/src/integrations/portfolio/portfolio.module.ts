import { Module } from '@nestjs/common';
import { CollaborationModule } from '../../collaboration/collaboration.module';
import { TokenModule } from '../../core/auth/token.module';
import { PageModule } from '../../core/page/page.module';
import { ShareModule } from '../../core/share/share.module';
import { PortfolioController } from './portfolio.controller';
import { PortfolioSessionService } from './portfolio-session.service';

@Module({
  imports: [
    ShareModule,
    PageModule,
    TokenModule,
    CollaborationModule,
  ],
  controllers: [PortfolioController],
  providers: [PortfolioSessionService],
})
export class PortfolioModule {}
