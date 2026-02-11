/**
 * Type definitions for NORMALIZED data (after transformation)
 * 
 * This is the clean, consistent data structure we want to work with.
 * All fields have predictable types - no more checking multiple formats!
 */

/**
 * Related item reference
 */
export interface RelatedItem {
  type: string       // e.g., "set-member", "derived-from", "paired-with"
  objectId: string   // ID of related object
  title?: string     // Title of related object (resolved after transform)
}

/**
 * Item flags for special conditions
 */
export interface ItemFlags {
  possibleDuplicate?: boolean
  prototype?: boolean
  needsResearch?: boolean
  attributionUncertain?: boolean
  materialsIncomplete?: boolean
  missingDimensions?: boolean
}

/**
 * A single collection item after normalization
 *
 * All messy fields have been cleaned up:
 * - creator: always string | null
 * - date: always string | null
 * - materials: always string | null
 * - dimensions: always string | null
 */
export interface Item {
  // Main fields (displayed prominently)
  id: string                    // from object_id
  accessionNumber: string | null // from accession_number
  title: string                  // from title (with fallback for null)
  creator: string | null         // normalized from messy creator field
  date: string | null            // normalized from messy date field
  objectType: string             // from object_type
  department: string             // from department
  materials: string | null       // normalized from materials field
  dimensions: string | null      // normalized from dimensions field
  flags: ItemFlags | null        // special conditions/warnings
  related: RelatedItem[]         // linked objects

  // Additional fields (shown in dropdown, ≤10% presence)
  notes: string[] | null         // curator notes
  externalIds: Record<string, string> | null // external system IDs
  keywords: string[] | null      // searchable keywords
  description: string | null     // detailed description
  rights: string | null          // rights/copyright info
  variants: any[] | null         // object variants
  tags: string[] | null          // categorical tags
  creditLine: string | null      // donor/acquisition credit
  condition: string | null       // condition report
  geo: { country?: string; region?: string } | null // geographic origin
  inventoryLocation: number | string | null // physical location ID
  transcription: string | null   // text transcription
  series: { title?: string; type?: string } | null // series info
  location: { site?: string; shelf?: string } | null // storage location
  edition: { number?: any; notes?: string } | null // edition info
  status: string | null          // record status
  provenance: any[] | null       // ownership history
}
