/**
 * Data Transformation Logic
 * 
 * Transforms messy Eames Institute sample data into clean, normalized format.
 */

import type { Record as SampleRecord, DateClass } from '../scripts/quicktype-generated'
import type { Item, ItemFlags, RelatedItem } from '../types/item'

// Type aliases for the messy union types in the raw data
type SampleCreator = string[] | null | string
type SampleDate = DateClass | number | null | string
type SampleMaterials = string[] | null | string

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
    notes: normalizeArray((record as any).notes),
    externalIds: normalizeExternalIds((record as any).external_ids),
    keywords: normalizeArray((record as any).keywords),
    description: normalizeString((record as any).description),
    rights: normalizeRights((record as any).rights),
    variants: normalizeArray((record as any).variants),
    tags: normalizeArray((record as any).tags),
    creditLine: normalizeString((record as any).credit_line),
    condition: normalizeString((record as any).condition),
    geo: normalizeGeo((record as any).geo),
    inventoryLocation: (record as any).inventory_location ?? null,
    transcription: normalizeString((record as any).transcription),
    series: normalizeSeries((record as any).series),
    location: normalizeLocation((record as any).location),
    edition: normalizeEdition((record as any).edition),
    status: normalizeString((record as any).status),
    provenance: normalizeArray((record as any).provenance),
  }
}

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
function normalizeCreator(creator: SampleCreator): string | null {
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
function normalizeDate(date: SampleDate): string | null {
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
function normalizeMaterials(materials: SampleMaterials): string | null {
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
function normalizeDimensions(dimensions: any): string | null {
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
  const dimensionMap = [
    { key: 'h', label: 'H' },
    { key: 'w', label: 'W' },
    { key: 'd', label: 'D' },
    { key: 'l', label: 'L' },
    { key: 'diameter', prefix: '', suffix: 'diameter' },
    { key: 'wingspan', prefix: '', suffix: 'wingspan' }
  ]

  const parts = dimensionMap
    .filter(({ key }) => dimensions[key] != null)
    .map(({ key, label, suffix }) => {
      const value = extractValue(dimensions[key], defaultUnit)
      return suffix ? `${value} ${suffix}` : `${label} ${value}`
    })
    .filter(part => part && !part.includes('?')) // Filter out "?" placeholders

  return parts.length > 0 ? parts.join(' × ') : null
}

/**
 * Helper to extract a dimension value (handles both objects and primitives)
 * Examples:
 * - { value: 26, unit: "in" } → "26 in"
 * - "24 in" → "24 in"
 * - 26 → "26"
 * - 26 with defaultUnit "in" → "26 in"
 */
function extractValue(val: any, defaultUnit: string = ''): string {
  // Handle object with value/unit properties
  if (typeof val === 'object' && val != null && val.value != null) {
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
 * Normalizes the flags field into a consistent format
 * Converts snake_case to camelCase and filters out any non-boolean flags
 */
function normalizeFlags(flags: any): ItemFlags | null {
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
function normalizeRelated(related: any): RelatedItem[] {
  if (!Array.isArray(related) || related.length === 0) {
    return []
  }

  return related
    .filter(item => item && item.type && item.object_id)
    .map(item => ({
      type: item.type,
      objectId: item.object_id
    }))
}

/**
 * Helper to normalize a string value to null if empty
 */
function normalizeString(value: string | null): string | null {
  if (value == null || value.trim() === '') {
    return null
  }
  return value.trim()
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
 * Normalizes an array field (filters out empty arrays)
 */
function normalizeArray(value: any): any[] | null {
  if (!Array.isArray(value) || value.length === 0) {
    return null
  }
  return value
}

/**
 * Normalizes external IDs object (filters out all-null objects)
 */
function normalizeExternalIds(value: any): Record<string, string> | null {
  if (!value || typeof value !== 'object') {
    return null
  }

  const filtered: Record<string, string> = {}
  Object.keys(value).forEach(key => {
    if (value[key] != null && value[key] !== '') {
      filtered[key] = String(value[key])
    }
  })

  return Object.keys(filtered).length > 0 ? filtered : null
}

/**
 * Normalizes rights field (can be string or object)
 */
function normalizeRights(value: any): string | null {
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
function normalizeGeo(value: any): { country?: string; region?: string } | null {
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
function normalizeSeries(value: any): { title?: string; type?: string } | null {
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
function normalizeLocation(value: any): { site?: string; shelf?: string } | null {
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
function normalizeEdition(value: any): { number?: any; notes?: string } | null {
  if (!value || typeof value !== 'object') {
    return null
  }

  const edition: { number?: any; notes?: string } = {}
  if (value.number != null) edition.number = value.number
  if (value.notes) edition.notes = value.notes

  return Object.keys(edition).length > 0 ? edition : null
}

/**
 * Enriches items with related object titles
 * Looks up each related object ID and adds its title
 *
 * @param items - Array of transformed items
 * @returns Same array with related titles populated
 */
export function enrichRelatedItems(items: Item[]): Item[] {
  // Create a lookup map of ID -> title
  const titleMap = new Map<string, string>()
  items.forEach(item => {
    titleMap.set(item.id, item.title)
  })

  // Enrich each item's related array with titles
  items.forEach(item => {
    item.related.forEach(rel => {
      rel.title = titleMap.get(rel.objectId) || rel.objectId
    })
  })

  return items
}
