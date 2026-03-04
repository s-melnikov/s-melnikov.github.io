import { getCollection, setCollection, clearAllCollections } from './indexeddb-store';
import type { ApiClient, ApiResponse, RequestParams } from './types';

const MOCK_DELAY_MS = 150;

/** Simulate network latency */
function delay(ms = MOCK_DELAY_MS): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function buildResponse<T>(data: T, status = 200): ApiResponse<T> {
  return { data, status, ok: status >= 200 && status < 300 };
}

/**
 * Parse a REST-style route into collection name and optional item id.
 *
 * Convention:
 *   /users          → collection = "users",  id = undefined
 *   /users/123      → collection = "users",  id = "123"
 *   /users/1/posts  → collection = "users/1/posts", id = undefined
 *   /users/1/posts/5 → collection = "users/1/posts", id = "5"
 *
 * Rules:
 *   - 1 segment  → collection only
 *   - 2+ segments → last segment is the id, the rest form the collection path
 */
function parseRoute(route: string): { collection: string; id?: string } {
  const path = route.replace(/^\/+|\/+$/g, '');
  const segments = path.split('/');

  if (segments.length < 2) {
    return { collection: path };
  }

  return {
    collection: segments.slice(0, -1).join('/'),
    id: segments[segments.length - 1],
  };
}

type MockItem = Record<string, unknown> & { id: string };

/**
 * Mock API client that stores data in IndexedDB.
 *
 * Usage:
 *   const res = await api.get<User[]>("/users");
 *   const res = await api.get<User>("/users/123");
 *   const res = await api.post<User>("/users", { name: "John" });
 *   const res = await api.put<User>("/users/123", { name: "Jane" });
 *   const res = await api.patch<User>("/users/123", { name: "Jane" });
 *   const res = await api.delete<User>("/users/123");
 *
 * Seed mock data:
 *   await api.seed("users", [{ id: "1", name: "John" }]);
 *
 * Clear all data:
 *   await api.clear();
 */
export const api: ApiClient = {
  async get<T = unknown>(route: string, params?: RequestParams): Promise<ApiResponse<T>> {
    await delay();

    const { collection, id } = parseRoute(route);
    let items = await getCollection<MockItem>(collection);

    if (id) {
      const item = items.find((i) => i.id === id);
      if (!item) {
        return buildResponse(null as T, 404);
      }
      return buildResponse(item as T);
    }

    // Apply filters from params
    if (params) {
      items = items.filter((item) =>
        Object.entries(params).every(([key, value]) => String(item[key]) === String(value)),
      );
    }

    return buildResponse(items as T);
  },

  async post<T = unknown>(
    route: string,
    payload?: unknown,
    _params?: RequestParams,
  ): Promise<ApiResponse<T>> {
    await delay();

    // For POST, the entire route is the collection (no id extraction)
    const collection = route.replace(/^\/+|\/+$/g, '');
    const items = await getCollection<MockItem>(collection);

    const newItem: MockItem = {
      id: crypto.randomUUID(),
      ...(payload as Record<string, unknown>),
    };

    items.push(newItem);
    await setCollection(collection, items);

    return buildResponse(newItem as T, 201);
  },

  async put<T = unknown>(
    route: string,
    payload?: unknown,
    _params?: RequestParams,
  ): Promise<ApiResponse<T>> {
    await delay();

    const { collection, id } = parseRoute(route);
    if (!id) return buildResponse(null as T, 400);

    const items = await getCollection<MockItem>(collection);
    const index = items.findIndex((i) => i.id === id);

    if (index === -1) return buildResponse(null as T, 404);

    items[index] = { id, ...(payload as Record<string, unknown>) };
    await setCollection(collection, items);

    return buildResponse(items[index] as T);
  },

  async patch<T = unknown>(
    route: string,
    payload?: unknown,
    _params?: RequestParams,
  ): Promise<ApiResponse<T>> {
    await delay();

    const { collection, id } = parseRoute(route);
    if (!id) return buildResponse(null as T, 400);

    const items = await getCollection<MockItem>(collection);
    const index = items.findIndex((i) => i.id === id);

    if (index === -1) return buildResponse(null as T, 404);

    items[index] = { ...items[index], ...(payload as Record<string, unknown>), id };
    await setCollection(collection, items);

    return buildResponse(items[index] as T);
  },

  async delete<T = unknown>(route: string, _params?: RequestParams): Promise<ApiResponse<T>> {
    await delay();

    const { collection, id } = parseRoute(route);
    if (!id) return buildResponse(null as T, 400);

    const items = await getCollection<MockItem>(collection);
    const index = items.findIndex((i) => i.id === id);

    if (index === -1) return buildResponse(null as T, 404);

    const [removed] = items.splice(index, 1);
    await setCollection(collection, items);

    return buildResponse(removed as T);
  },

  async seed<T extends { id: string }>(collection: string, items: T[]): Promise<void> {
    const key = collection.replace(/^\/+|\/+$/g, '');
    await setCollection(key, items);
  },

  async clear(): Promise<void> {
    await clearAllCollections();
  },
};
