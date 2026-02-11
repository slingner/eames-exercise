/**
 * Type definitions for NORMALIZED data (after transformation)
 * 
 * This is the clean, consistent data structure we want to work with.
 * All fields have predictable types - no more checking multiple formats!
 */

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
  id: string                    // from object_id
  accessionNumber: string | null // from accession_number
  title: string                  // from title (with fallback for null)
  creator: string | null         // normalized from messy creator field
  date: string | null            // normalized from messy date field
  objectType: string             // from object_type
  department: string             // from department
  materials: string | null       // normalized from materials field
  dimensions: string | null      // normalized from dimensions field
}
