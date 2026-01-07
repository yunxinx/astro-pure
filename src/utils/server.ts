import type { CollectionEntry, CollectionKey } from 'astro:content'

export {
  getAllTags,
  getBlogCollection,
  getUniqueTags,
  getUniqueTagsWithCount,
  prod
} from 'astro-pure/server'

type Collections = CollectionEntry<CollectionKey>[]

function getYearFromCollection<T extends CollectionKey>(
  collection: CollectionEntry<T>
): number | undefined {
  const dateStr = collection.data.publishDate
  return dateStr ? new Date(dateStr).getFullYear() : undefined
}

export function groupCollectionsByYear<T extends CollectionKey>(
  collections: Collections
): [number, CollectionEntry<T>[]][] {
  const collectionsByYear = collections.reduce((acc, collection) => {
    const year = getYearFromCollection(collection)
    if (year !== undefined) {
      if (!acc.has(year)) {
        acc.set(year, [])
      }
      acc.get(year)?.push(collection)
    }
    return acc
  }, new Map<number, Collections>())

  return Array.from(
    collectionsByYear.entries() as IterableIterator<[number, CollectionEntry<T>[]]>
  ).sort((a, b) => b[0] - a[0])
}

export function sortMDByDate(collections: Collections): Collections {
  return collections.sort((a, b) => {
    const aDate = new Date(a.data.publishDate ?? 0).valueOf()
    const bDate = new Date(b.data.publishDate ?? 0).valueOf()
    return bDate - aDate
  })
}

