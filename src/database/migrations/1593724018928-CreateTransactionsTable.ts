import {MigrationInterface, QueryRunner, Table, TableForeignKey} from "typeorm";

export class CreateTransactionsTable1593724018928 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        queryRunner.createTable(new Table({
            name: 'transactions',
            columns: [
                {
                    name: 'id',
                    type: 'uuid',
                    isPrimary: true,
                    generationStrategy: 'uuid',
                    default: 'uuid_generate_v4()'
                },
                {
                    name: 'title',
                    type: 'varchar',
                    isNullable: false
                },
                {
                    name: 'type',
                    type: 'varchar',
                    isNullable: false
                },
                {
                    name: 'value',
                    type: 'decimal',
                    isNullable: false
                },
                {
                    name: 'category_id',
                    type: 'uuid',
                    isNullable: false
                },
                {
                    name: "created_at",
                    type: "timestamp",
                    default: "now()",
                  },
                  {
                    name: "updated_at",
                    type: "timestamp",
                    default: "now()",
                  },
            ]
        }))

        await queryRunner.createForeignKey('transactions', new TableForeignKey({
            name: "TransactionsCategory",
            columnNames: ['category_id'],
            referencedTableName: 'categories',
            referencedColumnNames:['id'],
            onDelete: 'SET NULL',
            onUpdate: 'CASCADE'
        }))
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.dropForeignKey('transactions', 'category_id')

        await queryRunner.dropTable('transactions')
    }

}
