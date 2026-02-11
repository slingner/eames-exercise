/**
 * Data Transformation Logic
 *
 * Transforms messy Eames Institute sample data into clean, normalized format.
 */

import type { Record as SampleRecord, L as DimensionValue } from '../scripts/quicktype-generated'
import type { Item, ItemFlags } from '../types/item'

// Type aliases for readability - derived from the quicktype-generated Record type
// These stay in sync automatically if the schema is regenerated
type SampleCreator = SampleRecord['creator']
type SampleDate = SampleRecord['date']
type SampleMaterials = SampleRecord['materials']
type SampleDimensions = SampleRecord['dimensions']
type SampleFlags = SampleRecord['flags']
type SampleRelated = SampleRecord['related']
type SampleExternalIds = SampleRecord['external_ids']
type SampleRights = SampleRecord['rights']
type SampleGeo = SampleRecord['geo']
type SampleSeries = SampleRecord['series']
type SampleLocation = SampleRecord['location']
type SampleEdition = SampleRecord['edition']

/* ============================================================================
 * PUBLIC API - Main transformation functions
 * ========================================================================= */

/**
 * Transforms a single raw sample record into a normalized Item
 *
 * @param record - Raw data from the sample export
 * @returns Clean, normalized Item with consistent types
 */
export function transformRecord(record: SampleRecord): Item {
  return {
    // Main fields
    id: record.object_id,
    accessionNumber: normalizeString(record.accession_number),
    title: record.title || 'Unknown Title',  // Provide fallback for missing titles
    creator: normalizeCreator(record.creator),
    date: normalizeDate(record.date),
    objectType: record.object_type,
    department: record.department,
    materials: normalizeMaterials(record.materials),
    dimensions: normalizeDimensions(record.dimensions),
    flags: normalizeFlags(record.flags),
    related: normalizeRelated(record.related),

    // Additional fields (for modal)
    notes: normalizeArray(record.notes),
    externalIds: normalizeExternalIds(record.external_ids),
    keywords: normalizeArray(record.keywords),
    description: normalizeString(record.description),
    rights: normalizeRights(record.rights),
    variants: normalizeArray(record.variants),
    tags: normalizeArray(record.tags),
    creditLine: normalizeString(record.credit_line),
    condition: normalizeString(record.condition),
    geo: normalizeGeo(record.geo),
    inventoryLocation: record.inventory_location ?? null,
    transcription: normalizeString(record.transcription),
    series: normalizeSeries(record.series),
    location: normalizeLocation(record.location),
    edition: normalizeEdition(record.edition),
    status: normalizeString(record.status),
    provenance: normalizeArray(record.provenance),
  }
}

/**
 * Transforms an array of raw sample records
 *
 * @param records - Array of raw sample data
 * @returns Array of normalized Items
 */
export function transformRecords(records: SampleRecord[]): Item[] {
  return records.map(transformRecord)
}

/**
 * Enriches items with related object titles
 * Looks up each related object ID and adds its title
 *
 * @param items - Array of transformed items
 * @returns New array with related titles populated (does not mutate input)
 */
export function enrichRelatedItems(items: Item[]): Item[] {
  // Create a lookup map of ID -> title
  const titleMap = new Map<string, string>()
  items.forEach(item => {
    titleMap.set(item.id, item.title)
  })

  // Return new items with enriched related arrays
  return items.map(item => ({
    ...item,
    related: item.related.map(rel => ({
      ...rel,
      title: titleMap.get(rel.objectId) || rel.objectId
    }))
  }))
}

/* ============================================================================
 * NORMALIZATION FUNCTIONS - Handle messy field formats
 * ========================================================================= */

/**
 * Normalizes the creator field into a consistent string format
 *
 * Strategy:
 * 1. If array: join with " and " (e.g., ["Charles Eames", "Ray Eames"] → "Charles Eames and Ray Eames")
 * 2. If string: use as-is
 * 3. If empty array or null: return null
 *
 * @param creator - Can be string, array of strings, empty array, or null
 * @returns Normalized creator string or null
 */
function normalizeCreator(creator: SampleCreator): Item['creator'] {
  // Handle null or undefined
  if (creator == null) {
    return null
  }

  // Handle array
  if (Array.isArray(creator)) {
    // Empty array? No creator
    if (creator.length === 0) {
      return null
    }
    // Filter out "Unknown" from arrays
    const filtered = creator.filter(c => c.toLowerCase() !== 'unknown')
    if (filtered.length === 0) {
      return null
    }
    // Join multiple creators with "and"
    return filtered.join(' and ')
  }

  // Handle string - use as-is (unless empty or "Unknown")
  if (typeof creator === 'string' && creator.trim()) {
    const normalized = creator.trim()
    if (normalized.toLowerCase() === 'unknown' || normalized === '') {
      return null
    }
    return normalized
  }

  // Fallback for any unexpected format
  return null
}

/**
 * Normalizes the date field into a consistent string format
 *
 * Strategy:
 * 1. If object with "display": use display value
 * 2. If number: convert to string
 * 3. If string: use as-is
 * 4. If null: return null
 *
 * @param date - Can be object, string, number, or null
 * @returns Normalized date string or null
 */
function normalizeDate(date: SampleDate): Item['date'] {
  if (date == null) {
    return null
  }

  // Object with display field? Use that (unless it's "unknown")
  if (typeof date === 'object' && 'display' in date && date.display) {
    const display = String(date.display).trim().toLowerCase()
    if (display === 'unknown') {
      return null
    }
    return String(date.display).trim()
  }

  // Number? Convert to string
  if (typeof date === 'number') {
    return date.toString()
  }

  // String? Use as-is (unless it's "unknown")
  if (typeof date === 'string' && date.trim()) {
    const normalized = date.trim().toLowerCase()
    // Treat "unknown" as no data
    if (normalized === 'unknown') {
      return null
    }
    return date.trim()
  }

  return null
}

/**
 * Normalizes the materials field into a consistent string format
 *
 * Strategy:
 * 1. If array: join with ", "
 * 2. If string: use as-is
 * 3. If empty array or null: return null
 *
 * @param materials - Can be string, array of strings, empty array, or null
 * @returns Normalized materials string or null
 */
function normalizeMaterials(materials: SampleMaterials): Item['materials'] {
  if (materials == null) {
    return null
  }

  // Handle array
  if (Array.isArray(materials)) {
    if (materials.length === 0) {
      return null
    }
    return materials.join(', ')
  }

  // Handle string
  if (typeof materials === 'string' && materials.trim()) {
    return materials.trim()
  }

  return null
}

/**
 * Normalizes the dimensions field into a consistent string format
 *
 * Strategy:
 * 1. If has "display" field: use that
 * 2. Otherwise: build from h/w/d/l/diameter values
 * 3. If no useful data: return null
 *
 * @param dimensions - Object with various dimension fields, or null
 * @returns Normalized dimensions string or null
 */
function normalizeDimensions(dimensions: SampleDimensions): Item['dimensions'] {
  if (!dimensions || typeof dimensions !== 'object' || Object.keys(dimensions).length === 0) {
    return null
  }

  // Check display field first (skip if it's a placeholder)
  if (dimensions.display && typeof dimensions.display === 'string') {
    const display = dimensions.display.trim().toLowerCase()
    if (display && display !== '?' && display !== 'unknown') {
      return dimensions.display.trim()
    }
  }

  // Build from individual dimension fields
  const defaultUnit = dimensions.unit || ''

  // Two formatting styles:
  // - Standard (h/w/d/l): "H 32 in" (label before value)
  // - Special (diameter/wingspan): "12 in diameter" (dimensionType after value)
  const dimensionMap = [
    { key: 'h' as const, label: 'H' },
    { key: 'w' as const, label: 'W' },
    { key: 'd' as const, label: 'D' },
    { key: 'l' as const, label: 'L' },
    { key: 'diameter' as const, dimensionType: 'diameter' },
    { key: 'wingspan' as const, dimensionType: 'wingspan' }
  ]

  const parts = dimensionMap
    .filter(({ key }) => dimensions[key] != null)
    .map(({ key, label, dimensionType }) => {
      const value = extractValue(dimensions[key], defaultUnit)
      return dimensionType ? `${value} ${dimensionType}` : `${label} ${value}`
    })
    .filter(part => part && !part.includes('?')) // Filter out "?" placeholders

  return parts.length > 0 ? parts.join(' × ') : null
}

/**
 * Normalizes the flags field into a consistent format
 * Converts snake_case to camelCase and filters out any non-boolean flags
 */
function normalizeFlags(flags: SampleFlags): Item['flags'] {
  if (!flags || typeof flags !== 'object') {
    return null
  }

  const normalized: ItemFlags = {}

  // Map snake_case to camelCase
  if (flags.possible_duplicate === true) normalized.possibleDuplicate = true
  if (flags.prototype === true) normalized.prototype = true
  if (flags.needs_research === true) normalized.needsResearch = true
  if (flags.needs_review === true) normalized.needsReview = true
  if (flags.attribution_uncertain === true) normalized.attributionUncertain = true
  if (flags.materials_incomplete === true) normalized.materialsIncomplete = true
  if (flags.missing_dimensions === true) normalized.missingDimensions = true

  // Return null if no flags were set
  return Object.keys(normalized).length > 0 ? normalized : null
}

/**
 * Normalizes the related field into a consistent array format
 */
function normalizeRelated(related: SampleRelated): Item['related'] {
  if (!Array.isArray(related) || related.length === 0) {
    return []
  }

  return related
    .filter(item => item && item.type && item.object_id)
    .map(item => ({
      type: item.type,
      objectId: item.object_id as string // Safe: filtered for truthiness above
    }))
}

/**
 * Normalizes external IDs object (filters out all-null objects)
 */
function normalizeExternalIds(value: SampleExternalIds): Item['externalIds'] {
  if (!value || typeof value !== 'object') {
    return null
  }

  const filtered: Record<string, string> = {}
  Object.keys(value).forEach(key => {
    const typedKey = key as keyof SampleExternalIds
    if (value[typedKey] != null && value[typedKey] !== '') {
      filtered[key] = String(value[typedKey])
    }
  })

  return Object.keys(filtered).length > 0 ? filtered : null
}

/**
 * Normalizes rights field (can be string or object)
 */
function normalizeRights(value: SampleRights): Item['rights'] {
  if (!value) return null

  if (typeof value === 'string') {
    return value.trim() || null
  }

  if (typeof value === 'object' && value.status) {
    return value.status
  }

  return null
}

/**
 * Normalizes geo field
 */
function normalizeGeo(value: SampleGeo): Item['geo'] {
  if (!value || typeof value !== 'object') {
    return null
  }

  const geo: { country?: string; region?: string } = {}
  if (value.country) geo.country = value.country
  if (value.region) geo.region = value.region

  return Object.keys(geo).length > 0 ? geo : null
}

/**
 * Normalizes series field
 */
function normalizeSeries(value: SampleSeries): Item['series'] {
  if (!value || typeof value !== 'object') {
    return null
  }

  const series: { title?: string; type?: string } = {}
  if (value.title) series.title = value.title
  if (value.type) series.type = value.type

  return Object.keys(series).length > 0 ? series : null
}

/**
 * Normalizes location field
 */
function normalizeLocation(value: SampleLocation): Item['location'] {
  if (!value || typeof value !== 'object') {
    return null
  }

  const location: { site?: string; shelf?: string } = {}
  if (value.site) location.site = value.site
  if (value.shelf) location.shelf = value.shelf

  return Object.keys(location).length > 0 ? location : null
}

/**
 * Normalizes edition field
 */
function normalizeEdition(value: SampleEdition): Item['edition'] {
  if (!value || typeof value !== 'object') {
    return null
  }

  const edition: { number?: unknown; notes?: string } = {}
  if (value.number != null) edition.number = value.number
  if (value.notes) edition.notes = value.notes

  return Object.keys(edition).length > 0 ? edition : null
}


/* ============================================================================
 * HELPER FUNCTIONS - Generic utilities used by normalizers
 * ========================================================================= */

/**
 * Helper to extract a dimension value (handles both objects and primitives)
 * Examples:
 * - { value: 26, unit: "in" } → "26 in"
 * - "24 in" → "24 in"
 * - 26 → "26"
 * - 26 with defaultUnit "in" → "26 in"
 */
function extractValue(val: DimensionValue | number | string | null | undefined, defaultUnit: string = ''): string {
  // Handle null/undefined early (shouldn't occur due to upstream filter, but guard for safety)
  if (val == null) {
    return ''
  }

  // Handle object with value/unit properties
  if (typeof val === 'object' && val.value != null) {
    const unit = val.unit || defaultUnit
    return `${val.value} ${unit}`.trim()
  }

  // Handle primitive with default unit
  if (typeof val === 'number') {
    return defaultUnit ? `${val} ${defaultUnit}`.trim() : String(val)
  }

  // Handle string (includes units already or is a placeholder)
  return String(val)
}

/**
 * Helper to normalize a string value to null if empty or undefined
 * Accepts undefined from TypeScript optional properties, returns null for consistency
 */
function normalizeString(value: string | null | undefined): string | null {
  if (value == null || value.trim() === '') {
    return null
  }
  return value.trim()
}

/**
 * Normalizes an array field (filters out empty arrays and undefined)
 * Accepts undefined from TypeScript optional properties, returns null for consistency
 *
 * Generic function preserves array element types from input to output.
 * For example: string[] stays string[], Variant[] stays Variant[]
 */
function normalizeArray<T>(value: T[] | null | undefined): T[] | null {
  if (!Array.isArray(value) || value.length === 0) {
    return null
  }
  return value
}
