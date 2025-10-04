export type CategoryOption = { value: string; label: string };

let categoriesCache: CategoryOption[] | null = null;
let categoriesFetchedAt = 0;
const CACHE_TTL = 5 * 60 * 1000; // 5 мин

function normalizeCategories(input: any[]): CategoryOption[] {
  if (!Array.isArray(input)) return [];
  // Вариант 1: ["smartphones", "laptops", ...]
  if (input.length > 0 && typeof input[0] === 'string') {
    return input.map((s: string) => ({ value: s, label: s }));
  }
  // Вариант 2: [{ slug, name, url }, ...]
  return input.map((o: any) => {
    const value = typeof o?.slug === 'string' ? o.slug : String(o?.name ?? '');
    const label = typeof o?.name === 'string' ? o.name : String(o?.slug ?? value);
    return { value, label };
  });
}

export async function getProductCategories(): Promise<CategoryOption[]> {
  const now = Date.now();
  if (categoriesCache && now - categoriesFetchedAt < CACHE_TTL) {
    return categoriesCache;
  }

  const res = await fetch('https://dummyjson.com/products/categories');
  if (!res.ok) {
    throw new Error('Не удалось загрузить категории');
  }
  const raw = await res.json();
  const data = normalizeCategories(raw);

  categoriesCache = data;
  categoriesFetchedAt = now;
  return data;
}

export async function addDummyProduct(title: string) {
    const res = await fetch('https://dummyjson.com/products/add', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      // В реальном проекте передаём полные данные, но по ТЗ — только title
      body: JSON.stringify({ title }),
    });
    if (!res.ok) {
      const txt = await res.text().catch(() => '');
      throw new Error(`Ошибка отправки: ${res.status} ${txt}`);
    }
    return res.json(); // объект ответа от DummyJSON
  }