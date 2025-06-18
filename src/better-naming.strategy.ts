// Credits to @tonivj5
// https://github.com/tonivj5/typeorm-naming-strategies

import { DefaultNamingStrategy, NamingStrategyInterface } from 'typeorm';
import { snakeCase } from 'typeorm/util/StringUtils';

export type BetterNamingStrategyOptions = {
  /**
   * If true, the naming strategy will use a more readable format for table and column names.
   * Example: `createdAt` (on the entity) -> `created_at` (in the DB)
   *
   * @default true
   */
  snakeCase?: boolean;

  /**
   * If true, the naming strategy will use a more readable format for constraint and index names.
   * Example:
   *
   * class User {
   *   @OneToOne(() => Organization)
   *   organization: Organization;
   * }
   *
   * Before: FK_b75a68b1ca018c3daa0bb77731b
   * After: FK_user_organization_id
   *
   * @default true
   */
  betterConstraintAndIndexNames?: boolean;
};

export class BetterNamingStrategy
  extends DefaultNamingStrategy
  implements NamingStrategyInterface {
  private readonly snakeCase: boolean;
  private readonly betterConstraintAndIndexNames: boolean;

  constructor(options: BetterNamingStrategyOptions = {}) {
    super();
    this.snakeCase = options.snakeCase ?? true;
    this.betterConstraintAndIndexNames =
      options.betterConstraintAndIndexNames ?? true;
  }
  tableName(className: string, customName: string): string {
    if (this.snakeCase) {
      return customName ? customName : snakeCase(className);
    }

    return super.tableName(className, customName);
  }

  columnName(
    propertyName: string,
    customName: string,
    embeddedPrefixes: string[],
  ): string {
    if (this.snakeCase) {
      const prefixes = embeddedPrefixes.map((p) => snakeCase(p)).join('_');
      const columnName = customName ? customName : snakeCase(propertyName);

      if (prefixes) {
        return `${prefixes}_${columnName}`;
      } else {
        return columnName;
      }
    }

    return super.columnName(propertyName, customName, embeddedPrefixes);
  }

  relationName(propertyName: string): string {
    if (this.snakeCase) {
      return snakeCase(propertyName);
    }

    return super.relationName(propertyName);
  }

  primaryKeyName(tableOrName: string | any, columnNames: string[]): string {
    if (this.betterConstraintAndIndexNames) {
      const table =
        typeof tableOrName === 'string' ? tableOrName : tableOrName.name;
      const columns = columnNames
        .map((c) => this.columnName(c, '', []))
        .join('_');
      return `PK_${table}_${columns}`;
    }

    return super.primaryKeyName(tableOrName, columnNames);
  }

  uniqueConstraintName(
    tableOrName: string | any,
    columnNames: string[],
  ): string {
    if (this.betterConstraintAndIndexNames) {
      const table =
        typeof tableOrName === 'string' ? tableOrName : tableOrName.name;
      const columns = columnNames
        .map((c) => this.columnName(c, '', []))
        .join('_');
      return `UQ_${table}_${columns}`;
    }

    return super.uniqueConstraintName(tableOrName, columnNames);
  }

  indexName(
    tableOrName: string | any,
    columnNames: string[],
    where?: string,
  ): string {
    if (this.betterConstraintAndIndexNames) {
      const table =
        typeof tableOrName === 'string' ? tableOrName : tableOrName.name;
      const columns = columnNames
        .map((c) => this.columnName(c, '', []))
        .join('_');
      const base = `IDX_${table}_${columns}`;
      return where ? `${base}_${where}` : base;
    }

    return super.indexName(tableOrName, columnNames, where);
  }

  foreignKeyName(
    tableOrName: string | any,
    columnNames: string[],
    referencedTablePath?: string,
    referencedColumnNames?: string[],
  ): string {
    if (this.betterConstraintAndIndexNames) {
      const table =
        typeof tableOrName === 'string' ? tableOrName : tableOrName.name;
      const columns = columnNames
        .map((c) => this.columnName(c, '', []))
        .join('_');
      return `FK_${table}_${columns}`;
    }

    return super.foreignKeyName(
      tableOrName,
      columnNames,
      referencedTablePath,
      referencedColumnNames,
    );
  }

  joinColumnName(relationName: string, referencedColumnName: string): string {
    if (this.snakeCase) {
      return snakeCase(`${relationName}_${referencedColumnName}`);
    }

    return super.joinColumnName(relationName, referencedColumnName);
  }

  joinTableName(
    firstTableName: string,
    secondTableName: string,
    firstPropertyName: string,
    secondPropertyName: string,
  ): string {
    if (this.snakeCase) {
      return snakeCase(
        `${firstTableName}_${firstPropertyName.replace(
          /\./g,
          '_',
        )}_${secondTableName}`,
      );
    }

    return super.joinTableName(
      firstTableName,
      secondTableName,
      firstPropertyName,
      secondPropertyName,
    );
  }

  joinTableColumnName(
    tableName: string,
    propertyName: string,
    columnName?: string,
  ): string {
    if (this.snakeCase) {
      return snakeCase(`${tableName}_${columnName ?? propertyName}`);
    }

    return super.joinTableColumnName(tableName, propertyName, columnName);
  }
}
