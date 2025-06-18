# ✨ Better TypeORM Naming Strategies

[![npm version](https://badge.fury.io/js/better-typeorm-naming-strategies.svg)](https://badge.fury.io/js/better-typeorm-naming-strategies)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

A modern, drop-in naming strategy for [TypeORM](https://typeorm.io/) that makes your database schema more readable and consistent. Say goodbye to cryptic, auto-generated database names and hello to clean, snake_cased tables and columns, and human-readable constraint names.

This package provides a `BetterNamingStrategy` that can be configured to your needs.

## 🤔 Why?

TypeORM's default naming strategy can lead to database schemas that are hard to read. For example, it preserves `camelCase` from your entity definitions and generates long, unreadable hash-based names for foreign keys and indices.

This package fixes that by providing two main features:

- **🐍 `snake_case` everything**: Automatically transforms your `camelCase` entity properties into `snake_case` table and column names.
- **🏷️ Readable constraints**: Generates clear, descriptive names for your primary keys, foreign keys, and indices based on the tables and columns they affect.

## 🚀 Installation

Install with your favorite package manager:

```sh
# npm
npm install better-typeorm-naming-strategies

# yarn
yarn add better-typeorm-naming-strategies

# pnpm
pnpm add better-typeorm-naming-strategies
```

## Usage

Import and add `BetterNamingStrategy` to your TypeORM data source options.

### With a `DataSource` instance:

```typescript
import { DataSource } from 'typeorm';
import { BetterNamingStrategy } from 'better-typeorm-naming-strategies';

const myDataSource = new DataSource({
  // ... other options
  namingStrategy: new BetterNamingStrategy(),
});
```

### With an `ormconfig` file:

For a CommonJS `ormconfig.js` file:

```javascript
const { BetterNamingStrategy } = require('better-typeorm-naming-strategies');

module.exports = {
  // ... other options
  namingStrategy: new BetterNamingStrategy(),
};
```

For an ES Modules `ormconfig.ts` file:

```typescript
import { BetterNamingStrategy } from 'better-typeorm-naming-strategies';
import { DataSourceOptions } from 'typeorm';

const config: DataSourceOptions = {
  // ... other options
  namingStrategy: new BetterNamingStrategy(),
};

export default config;
```

The strategy works out of the box with sensible defaults, but you can configure it to your liking.

## ⚙️ Options

The `BetterNamingStrategy` constructor accepts an options object:

```typescript
new BetterNamingStrategy(options?: {
  snakeCase?: boolean;
  betterConstraintAndIndexNames?: boolean;
});
```

| Option                          | Description                                     | Default |
| ------------------------------- | ----------------------------------------------- | :-----: |
| `snakeCase`                     | Use `snake_case` for tables and columns.        | `true`  |
| `betterConstraintAndIndexNames` | Use readable names for constraints and indices. | `true`  |

### Example Configuration

```typescript
// This will ONLY enable snake_case naming
const strategy = new BetterNamingStrategy({
  snakeCase: true,
  betterConstraintAndIndexNames: false,
});
```

## ✨ Features in Detail

### 🐍 snake_case

When `snakeCase: true`, your entity's `camelCase` properties are automatically converted to `snake_case` in the database.

**Before:**
An entity like this...

```typescript
@Entity()
export class UserProfile {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  displayName: string;

  @Column()
  photoUrl: string;
}
```

...would create a table named `user_profile` with columns `display_name` and `photo_url`.

### 🏷️ Readable Constraint and Index Names

When `betterConstraintAndIndexNames: true`, your constraints and indices get simple, readable names.

**Before (default TypeORM):**

```
FK_b75a68b1ca018c3daa0bb77731b
IDX_f8ade2f823f9b1e3b3b1c6d3b3
```

**After:**

```
FK_user_profile_user_id
IDX_user_profile_display_name
```

No more guessing what a constraint does!

## 🙏 Acknowledgements

This package is heavily inspired by the great work done in [`typeorm-naming-strategies`](https://www.npmjs.com/package/typeorm-naming-strategies) by tonivj5. This version modernizes the package, adds more flexible configuration, and provides more comprehensive tests.

## License

This project is licensed under the MIT License.
