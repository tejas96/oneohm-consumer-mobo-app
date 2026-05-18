/**
 * Query String Builder — Shared utility
 *
 * Purpose: Build URL query strings from params objects.
 * Extracted as a shared utility so services never duplicate this logic.
 *
 * Layer: core/api
 * Dependency direction: None (leaf node)
 */

/**
 * Build a URL query string from a params object.
 * Filters out undefined and null values automatically.
 *
 * @example
 * buildQueryString({ page: 1, search: 'test', status: undefined })
 * // Returns: "page=1&search=test"
 */
export function buildQueryString(
  params: Record<string, string | number | boolean | undefined | null>,
): string {
  const searchParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      searchParams.append(key, String(value));
    }
  });
  return searchParams.toString();
}

/**
 * Append query string to a URL path.
 *
 * @example
 * appendQueryString('/customers', { page: 1 })
 * // Returns: "/customers?page=1"
 */
export function appendQueryString(
  path: string,
  params: Record<string, string | number | boolean | undefined | null>,
): string {
  const qs = buildQueryString(params);
  return qs ? `${path}?${qs}` : path;
}
