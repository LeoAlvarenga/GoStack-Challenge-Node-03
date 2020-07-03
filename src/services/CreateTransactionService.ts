import AppError from '../errors/AppError';

import Transaction from '../models/Transaction';
import TransactionsRepository from '../repositories/TransactionsRepository';
import { getCustomRepository, getRepository } from 'typeorm';
import Category from '../models/Category';

interface RequestDTO{
  title: string;
  value: number;
  type: 'income' | 'outcome';
  category: string;
}
class CreateTransactionService {
  
  public async execute({ title, value, type, category }: RequestDTO): Promise<Transaction> {
    const transactionRepository = getCustomRepository(TransactionsRepository)

    const balance = await transactionRepository.getBalance()
    console.log("value", value)
    console.log("total", balance.total)

    if(type === 'outcome' && value > balance.total){
      throw new AppError('you cannot outcome a bigger value than your account total', 400)
    }

    const categoryRepo = getRepository(Category)

    let categoryTransaction = await categoryRepo.findOne({
      where: {title: category}
    })

    if(!categoryTransaction){
      categoryTransaction = categoryRepo.create({title: category})
      await categoryRepo.save(categoryTransaction)
    }

    const transaction = transactionRepository.create({title, value, type, category_id: categoryTransaction?.id})

    await transactionRepository.save(transaction)

    return transaction
  }
}

export default CreateTransactionService;
