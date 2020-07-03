import AppError from '../errors/AppError';
import { getRepository } from 'typeorm';
import Transaction from '../models/Transaction';

class DeleteTransactionService {
  public async execute(id: string): Promise<void> {
    const transactionRepository = getRepository(Transaction)

    const deleted = await transactionRepository.delete(id)

    console.log(deleted)

    if(!deleted.affected){
      throw new AppError('Object not find with this ID')
    }

    return 
  }
}

export default DeleteTransactionService;
