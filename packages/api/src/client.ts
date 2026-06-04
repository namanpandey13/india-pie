type SupabaseError = {
  code?: string;
  message?: string;
};

type AuthUserRow = {
  id: string;
  email?: string | null;
  user_metadata?: Record<string, unknown> | null;
};

type AuthResult = {
  data?: {
    user?: AuthUserRow | null;
  };
  error?: SupabaseError | null;
};

export type SupabaseQueryResult<T> = {
  data: T | null;
  error: SupabaseError | null;
};

export type SupabaseQueryBuilder<T = unknown> = {
  select(columns?: string): SupabaseQueryBuilder<T>;
  insert(values: unknown): SupabaseQueryBuilder<T>;
  upsert(values: unknown, options?: Record<string, unknown>): SupabaseQueryBuilder<T>;
  update(values: unknown): SupabaseQueryBuilder<T>;
  delete(): SupabaseQueryBuilder<T>;
  eq(column: string, value: unknown): SupabaseQueryBuilder<T>;
  in(column: string, values: readonly unknown[]): SupabaseQueryBuilder<T>;
  order(column: string, options?: Record<string, unknown>): SupabaseQueryBuilder<T>;
  limit(count: number): SupabaseQueryBuilder<T>;
  single(): Promise<SupabaseQueryResult<T>>;
  maybeSingle(): Promise<SupabaseQueryResult<T>>;
  then<TResult1 = SupabaseQueryResult<T>, TResult2 = never>(
    onfulfilled?: ((value: SupabaseQueryResult<T>) => TResult1 | PromiseLike<TResult1>) | null,
    onrejected?: ((reason: unknown) => TResult2 | PromiseLike<TResult2>) | null,
  ): PromiseLike<TResult1 | TResult2>;
};

export type HausyApiClient = {
  auth: {
    getUser(): Promise<AuthResult>;
  };
  from<T = unknown>(table: string): SupabaseQueryBuilder<T>;
};

// Adapter to convert Supabase client to HausyApiClient interface
export function createHausyApiClient(supabaseClient: any): HausyApiClient {
  return {
    auth: {
      getUser: () => supabaseClient.auth.getUser(),
    },
    from<T = unknown>(table: string): SupabaseQueryBuilder<T> {
      return new QueryBuilder(supabaseClient.from(table));
    },
  };
}

class QueryBuilder<T = unknown> implements SupabaseQueryBuilder<T> {
  private query: any;

  constructor(supabaseQuery: any) {
    this.query = supabaseQuery;
  }

  select(columns?: string): SupabaseQueryBuilder<T> {
    this.query = this.query.select(columns);
    return this;
  }

  insert(values: unknown): SupabaseQueryBuilder<T> {
    this.query = this.query.insert(values);
    return this;
  }

  upsert(values: unknown, options?: Record<string, unknown>): SupabaseQueryBuilder<T> {
    this.query = this.query.upsert(values, options);
    return this;
  }

  update(values: unknown): SupabaseQueryBuilder<T> {
    this.query = this.query.update(values);
    return this;
  }

  delete(): SupabaseQueryBuilder<T> {
    this.query = this.query.delete();
    return this;
  }

  eq(column: string, value: unknown): SupabaseQueryBuilder<T> {
    this.query = this.query.eq(column, value);
    return this;
  }

  in(column: string, values: readonly unknown[]): SupabaseQueryBuilder<T> {
    this.query = this.query.in(column, Array.from(values));
    return this;
  }

  order(column: string, options?: Record<string, unknown>): SupabaseQueryBuilder<T> {
    const ascending = options?.ascending ?? true;
    this.query = this.query.order(column, { ascending });
    return this;
  }

  limit(count: number): SupabaseQueryBuilder<T> {
    this.query = this.query.limit(count);
    return this;
  }

  single(): Promise<SupabaseQueryResult<T>> {
    return this.query.single();
  }

  maybeSingle(): Promise<SupabaseQueryResult<T>> {
    return this.query.maybeSingle();
  }

  then<TResult1 = SupabaseQueryResult<T>, TResult2 = never>(
    onfulfilled?: ((value: SupabaseQueryResult<T>) => TResult1 | PromiseLike<TResult1>) | null,
    onrejected?: ((reason: unknown) => TResult2 | PromiseLike<TResult2>) | null,
  ): PromiseLike<TResult1 | TResult2> {
    return this.query.then(onfulfilled, onrejected);
  }
}

let apiClient: HausyApiClient | null = null;

export function configureApiClient(supabaseClient: any) {
  apiClient = supabaseClient ? createHausyApiClient(supabaseClient) : null;
}

export function getApiClient() {
  return apiClient;
}

export async function getAuthenticatedProfileId() {
  const client = getApiClient();

  if (!client) {
    return null;
  }

  const { data } = await client.auth.getUser();
  return data?.user?.id ?? null;
}
