/**
 * Data Transformation Logic
 * 
 * Transforms messy Eames Institute sample data into clean, normalized format.
 * This is the core of the exercise - demonstrating how to handle inconsistent
 * real-world data and produce a predictable structure.
 */

import type { SampleRecord, SampleCreator, SampleDate, SampleMaterials } from '../types/sample'
import type { Item } from '../types/item'

/**
 * Transforms a single raw sample record into a normalized Item
 * 
 * @param record - Raw data from the sample export
 * @returns Clean, normalized Item with consistent types
 */
export function transformRecord(record: SampleRecord): Item {
  return {
    id: record.object_id,
    accessionNumber: normalizeString(record.accession_number),
    title: record.title || 'Untitled',  // Provide fallback for missing titles
    creator: normalizeCreator(record.creator),
    date: normalizeDate(record.date),
    objectType: record.object_type,
    department: record.department,
    materials: normalizeMaterials(record.materials),
    dimensions: normalizeDimensions(record.dimensions),
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
    // Join multiple creators with "and"
    return creator.join(' and ')
  }

  // Handle string - use as-is
  if (typeof creator === 'string' && creator.trim()) {
    return creator.trim()
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

  // Object with display field? Use that
  if (typeof date === 'object' && 'display' in date && date.display) {
    return date.display
  }

  // Number? Convert to string
  if (typeof date === 'number') {
    return date.toString()
  }

  // String? Use as-is
  if (typeof date === 'string' && date.trim()) {
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
  if (!dimensions || typeof dimensions !== 'object') {
    return null
  }

  // Prefer the display field if it exists and isn't a placeholder
  if (dimensions.display && 
      typeof dimensions.display === 'string' && 
      dimensions.display.trim() &&
      dimensions.display !== '?' &&
      dimensions.display !== 'unknown') {
    return dimensions.display
  }

  // Try to build from individual dimensions
  const parts: string[] = []
  
  if (dimensions.h) parts.push(`H ${extractValue(dimensions.h)}`)
  if (dimensions.w) parts.push(`W ${extractValue(dimensions.w)}`)
  if (dimensions.d) parts.push(`D ${extractValue(dimensions.d)}`)
  if (dimensions.l) parts.push(`L ${extractValue(dimensions.l)}`)
  if (dimensions.diameter) parts.push(`${extractValue(dimensions.diameter)} diameter`)

  return parts.length > 0 ? parts.join(' × ') : null
}

/**
 * Helper to extract a dimension value (handles both objects and primitives)
 * Examples: 
 * - { value: 26, unit: "in" } → "26 in"
 * - "24 in" → "24 in"
 * - 26 → "26"
 */
function extractValue(val: any): string {
  if (typeof val === 'object' && val.value != null) {
    const unit = val.unit || ''
    return `${val.value} ${unit}`.trim()
  }
  return String(val)
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
