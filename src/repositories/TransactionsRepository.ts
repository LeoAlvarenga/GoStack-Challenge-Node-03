import { EntityRepository, Repository } from 'typeorm';

import Transaction from '../models/Transaction';

interface Balance {
  income: number;
  outcome: number;
  total: number;
}
@EntityRepository(Transaction)
class TransactionsRepository extends Repository<Transaction> {

  public async getBalance(): Promise<Balance> {


    const income = await this.find({select: ["value"], where: { type: "income" }})
    const outcome = await this.find({select: ["value"], where: { type: "outcome" }})

    console.log(income)
    console.log(outcome)

    const incomeReduce = income.reduce((previousValue, element) => previousValue += Number(element.value), 0)
    const outcomeReduce = outcome.reduce((previousValue, element) => previousValue += Number(element.value), 0)

    console.log(incomeReduce)
    console.log(outcomeReduce)

    const total = incomeReduce - outcomeReduce

    const balance = {
      income: incomeReduce,
      outcome: outcomeReduce,
      total
    }

    return balance
  }

  
}

export default TransactionsRepository;
