import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Transaction } from './transaction.entity';

@Injectable()
export class TransactionsService {
  constructor(
    @InjectRepository(Transaction)
    private transactionsRepository,
  ) {}

  parseMpesaSMS(smsText) {
    try {
      // Example SMS: "QJ12345678 Confirmed. You have received Ksh1,000.00 from JOHN DOE 254712345678 on 28/5/25 at 1:54 PM. New M-Pesa balance is Ksh2,500.00."
      const regex = /(\w{10})\s+Confirmed\.\s+(You have received|Sent)\s+Ksh([\d,]+\.\d{2})\s+from\s+([\w\s]+)\s+(\d{12})\s+on\s+(\d{1,2}\/\d{1,2}\/\d{2})\s+at\s+(\d{1,2}:\d{2}\s+(?:AM|PM))/;
      const match = smsText.match(regex);

      if (!match) {
        throw new Error('Invalid M-Pesa SMS format');
      }

      const [, transactionCode, type, amountStr, sender, , dateStr, timeStr] = match;
      const amount = parseFloat(amountStr.replace(/,/g, ''));
      const dateTimeStr = `${dateStr} ${timeStr}`;
      const date = new Date(dateTimeStr.replace(/(\d{1,2})\/(\d{1,2})\/(\d{2})/, '20$3-$2-$1'));

      return {
        transactionCode,
        type: type === 'You have received' ? 'Received' : 'Sent',
        amount,
        sender,
        date,
      };
    } catch (error) {
      throw new Error(`Error parsing SMS: ${error.message}`);
    }
  }

  async saveTransaction(smsText) {
    const parsedData = this.parseMpesaSMS(smsText);
    const transaction = this.transactionsRepository.create(parsedData);
    await this.transactionsRepository.save(transaction);
    return parsedData;
  }

  async getAllTransactions() {
    return await this.transactionsRepository.find();
  }
}
