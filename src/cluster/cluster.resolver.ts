import { Resolver } from '@nestjs/graphql';
import { ClusterService } from './cluster.service';

@Resolver()
export class ClusterResolver {
  constructor(private readonly clusterService: ClusterService) {}
}
