/**
 * Field Analysis Script
 *
 * Analyzes all fields in the collection data to see which ones
 * have the most information and should potentially be displayed.
 * Checks nested objects to see if they contain actual useful data.
 */

import collectionData from '../data/collection.json'

// Fields we're currently displaying
const displayedFields = [
  'object_id',
  'title',
  'creator',
  'date',
  'object_type',
  'department',
  'materials',
  'dimensions',
  'accession_number',
  'flags',
  'related'
]

interface FieldStats {
  fieldName: string
  presentCount: number
  totalRecords: number
  percentage: number
  displayed: boolean
  sampleValues: any[]
}

/**
 * Recursively check if a value contains any useful data
 * Returns false for: null, undefined, empty string, empty array, empty object, objects with all null values
 */
function hasUsefulData(value: any): boolean {
  // Null, undefined, empty string
  if (value == null || value === '') {
    return false
  }

  // Empty array
  if (Array.isArray(value)) {
    return value.length > 0 && value.some(item => hasUsefulData(item))
  }

  // Object - recursively check if any nested value has useful data
  if (typeof value === 'object') {
    const keys = Object.keys(value)
    if (keys.length === 0) {
      return false
    }
    return keys.some(key => hasUsefulData(value[key]))
  }

  // Primitive value (string, number, boolean) - has data
  return true
}

function analyzeFields() {
  const records = collectionData.records
  const totalRecords = records.length

  // Collect all unique field names across all records
  const allFields = new Set<string>()
  records.forEach(record => {
    Object.keys(record).forEach(key => allFields.add(key))
  })

  // Analyze each field
  const fieldStats: FieldStats[] = []

  allFields.forEach(fieldName => {
    let presentCount = 0
    const sampleValues: any[] = []

    records.forEach(record => {
      const value = (record as any)[fieldName]

      // Check if this field has actual useful data (recursively checks nested objects)
      if (hasUsefulData(value)) {
        presentCount++
        // Collect first 3 sample values
        if (sampleValues.length < 3) {
          sampleValues.push(value)
        }
      }
    })

    fieldStats.push({
      fieldName,
      presentCount,
      totalRecords,
      percentage: Math.round((presentCount / totalRecords) * 100),
      displayed: displayedFields.includes(fieldName),
      sampleValues
    })
  })

  // Sort by presence (most to least)
  fieldStats.sort((a, b) => b.presentCount - a.presentCount)

  return fieldStats
}

function printReport() {
  const stats = analyzeFields()
  const displayed = stats.filter(s => s.displayed)
  const notDisplayed = stats.filter(s => !s.displayed)

  console.log('='.repeat(80))
  console.log('FIELD ANALYSIS REPORT')
  console.log('='.repeat(80))
  console.log()

  console.log('CURRENTLY DISPLAYED FIELDS:')
  console.log('-'.repeat(80))
  displayed.forEach(({ fieldName, presentCount, totalRecords, percentage, sampleValues }) => {
    console.log(`${fieldName}:`)
    console.log(`  Present: ${presentCount}/${totalRecords} (${percentage}%)`)
    console.log(`  Samples: ${JSON.stringify(sampleValues.slice(0, 2))}`)
    console.log()
  })

  console.log()
  console.log('NOT CURRENTLY DISPLAYED (sorted by presence):')
  console.log('-'.repeat(80))
  notDisplayed.forEach(({ fieldName, presentCount, totalRecords, percentage, sampleValues }) => {
    console.log(`${fieldName}:`)
    console.log(`  Present: ${presentCount}/${totalRecords} (${percentage}%)`)
    console.log(`  Samples: ${JSON.stringify(sampleValues.slice(0, 2))}`)
    console.log()
  })

  console.log()
  console.log('='.repeat(80))
  console.log('SUMMARY:')
  console.log(`Total unique fields: ${stats.length}`)
  console.log(`Currently displayed: ${displayed.length}`)
  console.log(`Not displayed: ${notDisplayed.length}`)
  console.log('='.repeat(80))
}

printReport()
