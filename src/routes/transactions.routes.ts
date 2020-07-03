import { Router } from 'express';

import TransactionsRepository from '../repositories/TransactionsRepository';
import CreateTransactionService from '../services/CreateTransactionService';
import DeleteTransactionService from '../services/DeleteTransactionService';
import ImportTransactionsService from '../services/ImportTransactionsService';
import { getCustomRepository } from 'typeorm';
import multer from 'multer';

const transactionsRouter = Router();

import uploadConfig from '../config/uploads';
const upload = multer(uploadConfig);



transactionsRouter.get('/', async (request, response) => {
  try {
    const transactionsRepository = getCustomRepository(TransactionsRepository)

    const transactions = await transactionsRepository.find({
      select: ['id', 'title', 'value', 'type', 'created_at', 'updated_at'],
      relations: ['category'],
    });
    console.log(transactions)
    const balance = await transactionsRepository.getBalance()

    response.json({ transactions: transactions, balance: balance })
  } catch (err) {
    
  }
});

transactionsRouter.post('/', async (request, response) => {
  try {
    const {title, value, type, category} = request.body
    console.log(request.body)

    const createTransaction = new CreateTransactionService()

    const transaction = await createTransaction.execute({
      title, 
      value, 
      type,
      category
    })

    return response.json(transaction)

  } catch (err) {
    return response.status(400).json({ status: 'error', message: err.message });
  }
});

transactionsRouter.delete('/:id', async (request, response) => {
  const { id } = request.params
try {
  const deleteTransactionService = new DeleteTransactionService()

  await deleteTransactionService.execute(id)
  return response.status(204).send()
} catch (error) {
  return response.status(400).json({ error: error.message })
}


});

transactionsRouter.post('/import', upload.single('file'), async (request, response) => {
  const importTransactions = new ImportTransactionsService();
    const transactions = await importTransactions.execute(request.file.path);

    response.json(transactions);
});

export default transactionsRouter;
