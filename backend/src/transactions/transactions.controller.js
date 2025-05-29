import { Controller, Post, Body, Get } from '@nestjs/common';
import { TransactionsService } from './transactions.service';

@Controller('transactions')
export class TransactionsController {
  constructor(private readonly transactionsService) {}

  @Post('parse')
  async parseSMS(@Body('sms') smsText) {
    return await this.transactionsService.saveTransaction(smsText);
  }

  @Get()
  async getTransactions() {
    return await this.transactionsService.getAllTransactions();
  }
}
