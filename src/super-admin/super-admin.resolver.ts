import { Resolver } from '@nestjs/graphql';
import { SuperAdminService } from './super-admin.service';

@Resolver()
export class SuperAdminResolver {
  constructor(private readonly superAdminService: SuperAdminService) {}
}
