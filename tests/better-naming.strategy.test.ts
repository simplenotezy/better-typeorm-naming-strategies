import { BetterNamingStrategy } from '../src';

describe('BetterNamingStrategy', () => {
  let strategy: BetterNamingStrategy;

  describe('snakeCase', () => {
    beforeAll(() => {
      strategy = new BetterNamingStrategy({
        snakeCase: true,
        betterConstraintAndIndexNames: false,
      });
    });

    describe('tableName', () => {
      it('should return table name in snake format when custom name was not set', () => {
        const testTableName = 'TestTableName';

        const result = strategy.tableName(testTableName, '');

        expect(result).toBe('test_table_name');
      });

      it('should return table name as customName when custom name was set', () => {
        const testTableName = 'TestTableName';

        const result = strategy.tableName(testTableName, testTableName);

        expect(result).toBe(testTableName);
      });
    });

    describe('columnName', () => {
      it('should return column name in snake format when custom name was not set', () => {
        const testColumnName = 'testColumnName';

        const result = strategy.columnName(testColumnName, '', []);

        expect(result).toBe('test_column_name');
      });

      it('should return column name as customName when custom name was set', () => {
        const testColumnName = 'testColumnName';

        const result = strategy.columnName(testColumnName, testColumnName, []);

        expect(result).toBe(testColumnName);
      });

      describe('should add prefixes to column name when embeddedPrefixes was set', () => {
        it('and custom name was not set', () => {
          const testColumnName = 'testColumnName';
          const embeddedPrefixes = ['testPrefix1', 'testPrefix2'];

          const result = strategy.columnName(
            testColumnName,
            '',
            embeddedPrefixes,
          );

          expect(result).toBe('test_prefix1_test_prefix2_test_column_name');
        });

        it('and custom name was set', () => {
          const testColumnName = 'testColumnName';
          const embeddedPrefixes = ['testPrefix1', 'testPrefix2'];

          const result = strategy.columnName(
            testColumnName,
            testColumnName,
            embeddedPrefixes,
          );
          expect(result).toBe('test_prefix1_test_prefix2_testColumnName');
        });
      });
    });

    describe('relationName', () => {
      it('should return property name as snake case', () => {
        const result = strategy.relationName('testPropertyName');
        expect(result).toBe('test_property_name');
      });
    });

    describe('joinColumnName', () => {
      it('should return relation name and referenced column name joined by "_" as snake case', () => {
        const result = strategy.joinColumnName(
          'testRelationName',
          'testReferencedColumnName',
        );
        expect(result).toBe('test_relation_name_test_referenced_column_name');
      });
    });

    describe('joinTableName', () => {
      it('should return table names and first property name as snake case', () => {
        const result = strategy.joinTableName(
          'firstTable',
          'secondTable',
          'first.propertyName',
          'secondProperty',
        );
        expect(result).toBe('first_table_first_property_name_second_table');
      });
    });

    describe('joinTableColumnName', () => {
      it('should return table name and column name as snake case when columnName was set', () => {
        const result = strategy.joinTableColumnName(
          'tableName',
          'propertyName',
          'columnName',
        );
        expect(result).toBe('table_name_column_name');
      });

      it('should return table name and property name as snake case when columnName was not set', () => {
        const result = strategy.joinTableColumnName(
          'tableName',
          'propertyName',
          undefined,
        );
        expect(result).toBe('table_name_property_name');
      });
    });
  });

  describe('betterConstraintAndIndexNames', () => {
    beforeAll(() => {
      strategy = new BetterNamingStrategy({
        snakeCase: false,
        betterConstraintAndIndexNames: true,
      });
    });

    it('primaryKeyName: should return primary key name in a readable format', () => {
      const result = strategy.primaryKeyName('testTable', ['id', 'name']);
      expect(result).toBe('PK_testTable_id_name');
    });

    it('uniqueConstraintName: should return unique constraint name in a readable format', () => {
      const result = strategy.uniqueConstraintName('testTable', ['id', 'name']);
      expect(result).toBe('UQ_testTable_id_name');
    });

    it('indexName: should return index name in a readable format', () => {
      const result = strategy.indexName('testTable', ['name']);
      expect(result).toBe('IDX_testTable_name');
    });

    it('indexName: should return index name with where clause in a readable format', () => {
      const result = strategy.indexName(
        'testTable',
        ['name'],
        'name IS NOT NULL',
      );
      expect(result).toBe('IDX_testTable_name_name IS NOT NULL');
    });

    it('foreignKeyName: should return foreign key name in a readable format', () => {
      const result = strategy.foreignKeyName('testTable', ['id']);
      expect(result).toBe('FK_testTable_id');
    });
  });
});
