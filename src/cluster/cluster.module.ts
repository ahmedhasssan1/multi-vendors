import { Module } from '@nestjs/common';
import { ClusterService } from './cluster.service';
import { ClusterResolver } from './cluster.resolver';

@Module({
  providers: [ClusterResolver, ClusterService],
})
export class ClusterModule {}
