import type {
  CreateCustomerInput,
  ListCustomersQuery,
  UpdateCustomerInput,
} from "../validation/customer";

export interface CustomerRecord {
  id: string;
  name: string;
  phone: string | null;
  email: string | null;
  business_name: string;
  status: "active" | "inactive";
  created_at: string;
  updated_at: string;
}

const CUSTOMER_COLUMNS =
  "id, name, phone, email, business_name, status, created_at, updated_at";

export async function listCustomers(
  db: D1Database,
  query: ListCustomersQuery,
): Promise<CustomerRecord[]> {
  const search = query.search ? `%${query.search}%` : null;
  const result = await db
    .prepare(
      `SELECT ${CUSTOMER_COLUMNS}
       FROM customers
       WHERE (?1 IS NULL OR status = ?1)
         AND (
           ?2 IS NULL
           OR name LIKE ?2 COLLATE NOCASE
           OR phone LIKE ?2
           OR email LIKE ?2 COLLATE NOCASE
           OR business_name LIKE ?2 COLLATE NOCASE
         )
       ORDER BY created_at DESC, id ASC
       LIMIT ?3 OFFSET ?4`,
    )
    .bind(query.status ?? null, search, query.limit, query.offset)
    .all<CustomerRecord>();

  return result.results;
}

export async function findCustomer(
  db: D1Database,
  id: string,
): Promise<CustomerRecord | null> {
  return db
    .prepare(`SELECT ${CUSTOMER_COLUMNS} FROM customers WHERE id = ?1`)
    .bind(id)
    .first<CustomerRecord>();
}

export async function createCustomer(
  db: D1Database,
  id: string,
  customer: CreateCustomerInput,
): Promise<CustomerRecord | null> {
  await db
    .prepare(
      `INSERT INTO customers (id, name, phone, email, business_name, status)
       VALUES (?1, ?2, ?3, ?4, ?5, ?6)`,
    )
    .bind(
      id,
      customer.name,
      customer.phone,
      customer.email,
      customer.business_name,
      customer.status,
    )
    .run();

  return findCustomer(db, id);
}

export async function updateCustomer(
  db: D1Database,
  id: string,
  customer: UpdateCustomerInput,
): Promise<boolean> {
  const has = (key: keyof UpdateCustomerInput) =>
    Object.hasOwn(customer, key) ? 1 : 0;

  const result = await db
    .prepare(
      `UPDATE customers SET
         name = CASE WHEN ?1 = 1 THEN ?2 ELSE name END,
         phone = CASE WHEN ?3 = 1 THEN ?4 ELSE phone END,
         email = CASE WHEN ?5 = 1 THEN ?6 ELSE email END,
         business_name = CASE WHEN ?7 = 1 THEN ?8 ELSE business_name END,
         status = CASE WHEN ?9 = 1 THEN ?10 ELSE status END,
         updated_at = strftime('%Y-%m-%dT%H:%M:%fZ', 'now')
       WHERE id = ?11`,
    )
    .bind(
      has("name"),
      customer.name ?? null,
      has("phone"),
      customer.phone ?? null,
      has("email"),
      customer.email ?? null,
      has("business_name"),
      customer.business_name ?? null,
      has("status"),
      customer.status ?? null,
      id,
    )
    .run();

  return result.meta.changes > 0;
}

export async function deleteCustomerIfUnlinked(
  db: D1Database,
  id: string,
): Promise<boolean> {
  const result = await db
    .prepare(
      `DELETE FROM customers
       WHERE id = ?1
         AND NOT EXISTS (
           SELECT 1 FROM websites WHERE customer_id = ?1
         )`,
    )
    .bind(id)
    .run();

  return result.meta.changes > 0;
}

export function isUniqueConstraintError(error: unknown): boolean {
  return /unique constraint failed/i.test(
    error instanceof Error ? error.message : String(error),
  );
}

export function isForeignKeyConstraintError(error: unknown): boolean {
  return /foreign key constraint failed/i.test(
    error instanceof Error ? error.message : String(error),
  );
}
