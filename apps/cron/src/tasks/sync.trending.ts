import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { BullMqClient } from '@kursor/nestjs-libraries/bull-mq-transport/client/bull-mq.client';

@Injectable()
export class SyncTrending {
  constructor(
    private _workerServiceProducer: BullMqClient
  ) {}
  @Cron('0 * * * *')
  async syncTrending() {
    this._workerServiceProducer.emit('sync_trending', {}).subscribe();
  }
}
