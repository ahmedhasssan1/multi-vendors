import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Transaction } from './entity/transaction.entity';
import { Repository } from 'typeorm';

@Injectable()
export class TransactionsService {
    constructor(@InjectRepository(Transaction) private TransactionsRepo:Repository<Transaction>){}
    async findoneByStripeTransferId(id:string){
        const transaction=await this.TransactionsRepo.findOne({
            where:{
            stripeTransferId:id
            }
        })
        if(!transaction){
            throw new NotFoundException("this tranaction not exist")
        }
        return transaction
    }
}
