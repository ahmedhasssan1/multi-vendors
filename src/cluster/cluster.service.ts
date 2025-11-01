import { Injectable, OnModuleInit } from '@nestjs/common';
import {
  ClientProxy,
  ClientProxyFactory,
  Transport,
} from '@nestjs/microservices';
import { Observable } from 'rxjs';

@Injectable()
export class ClusterService implements OnModuleInit {
  private client: ClientProxy;

  onModuleInit() {
    this.client = ClientProxyFactory.create({
      transport: Transport.TCP,
      options: {
        host: 'localhost',
        port: 8877,
      },
    });

    this.client
      .connect()
      .then(() => {
        console.log('Connected to microservice');
      })
      .catch((err) => {
        console.error('Failed to connect to microservice:', err.message);
      });
  }
 
}
