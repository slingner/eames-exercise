/**
 * Type definitions for RAW sample data (before normalization)
 * 
 * This data is intentionally messy and inconsistent 
 * The transform function will normalize this into clean Item types.
 */

/**
 * Raw creator field - can be many different types
 * Examples from the data:
 * - ["Charles Eames", "Ray Eames"] (array)
 * - "Charles and Ray Eames" (string)
 * - [] (empty array)
 * - null (missing)
 */
export type SampleCreator = string | string[] | null

/**
 * Raw date field - highly inconsistent format
 * Examples:
 * - { display: "1945–1946", earliest: 1945, latest: 1946 } (object)
 * - "1954" (string)
 * - 1900 (number)
 * - "c. 1938" (circa string)
 * - null (missing)
 */
export type SampleDate =
  | { display: string; earliest: number | null; latest: number | null }
  | string
  | number
  | null

/**
 * Raw materials field - string or array
 * Examples:
 * - ["molded plywood", "rubber shock mounts"] (array)
 * - "wire mesh, metal frame" (string)
 * - [] (empty array)
 * - null (missing)
 */
export type SampleMaterials = string | string[] | null

/**
 * Raw dimensions - very inconsistent structure
 * Can have display, h, w, d, l, diameter, unit, etc. in any combination
 */
export type SampleDimensions = Record<string, any> | null

/**
 * Individual record from the sample data
 */
export interface SampleRecord {
  object_id: string
  accession_number: string | null
  title: string | null
  creator: SampleCreator
  date: SampleDate
  object_type: string
  department: string
  materials: SampleMaterials
  dimensions: SampleDimensions
  // Many other optional fields that vary by record
  [key: string]: any
}

/**
 * Complete sample data export structure
 */
export interface SampleData {
  meta: {
    source: string
    exportedAt: string
  }
  records: SampleRecord[]
}
