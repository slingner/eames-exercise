/**
 * Data Analysis Script
 *
 * Analyzes the sample JSON to identify inconsistencies and data quality issues
 * that need to be handled by the transformation logic.
 *
 * Run with: npm run analyze
 */

import collectionData from '../data/collection.json'
import type { SampleData } from '../types/sample'

const data = collectionData as SampleData

console.log('📊 EAMES INSTITUTE DATA ANALYSIS')
console.log('='.repeat(60))
console.log(`\nTotal records: ${data.records.length}`)
console.log(`Source: ${data.meta.source}`)
console.log(`Exported: ${data.meta.exportedAt}\n`)

// Helper to analyze any field
function analyzeField(fieldName: string, getValue: (record: any) => any) {
  console.log(`\n📋 ${fieldName.toUpperCase()} FIELD ANALYSIS`)
  console.log('-'.repeat(60))

  const types = new Map<string, number>()
  const examples = new Map<string, any[]>()

  data.records.forEach(record => {
    const value = getValue(record)
    let type: string

    if (value === null || value === undefined) {
      type = 'null'
    } else if (Array.isArray(value)) {
      type = value.length === 0 ? 'empty-array' : 'array'
    } else if (typeof value === 'object') {
      type = 'object'
    } else {
      type = typeof value
    }

    types.set(type, (types.get(type) || 0) + 1)

    if (!examples.has(type)) {
      examples.set(type, [])
    }
    if (examples.get(type)!.length < 3) {
      examples.get(type)!.push({
        id: record.object_id,
        value: value
      })
    }
  })

  console.log('\nTypes found:')
  types.forEach((count, type) => {
    console.log(`  ${type}: ${count} records`)
  })

  console.log('\nExamples:')
  examples.forEach((exs, type) => {
    console.log(`  ${type}:`)
    exs.forEach(ex => {
      const display = JSON.stringify(ex.value)
      const truncated = display.length > 80 ? display.substring(0, 77) + '...' : display
      console.log(`    ${ex.id}: ${truncated}`)
    })
  })
}

// Core fields
analyzeField('creator', r => r.creator)
analyzeField('date', r => r.date)
analyzeField('materials', r => r.materials)
analyzeField('title', r => r.title)

// Dimensions (special analysis)
console.log('\n\n📐 DIMENSIONS FIELD ANALYSIS')
console.log('-'.repeat(60))

const dimensionStructures = new Map<string, number>()
const dimensionExamples = new Map<string, any>()

data.records.forEach(record => {
  if (!record.dimensions || typeof record.dimensions !== 'object') {
    dimensionStructures.set('null/invalid', (dimensionStructures.get('null/invalid') || 0) + 1)
    return
  }

  const keys = Object.keys(record.dimensions).sort().join(',')
  dimensionStructures.set(keys, (dimensionStructures.get(keys) || 0) + 1)

  if (!dimensionExamples.has(keys)) {
    dimensionExamples.set(keys, {
      id: record.object_id,
      value: record.dimensions
    })
  }
})

console.log(`\nUnique dimension structures: ${dimensionStructures.size}`)
console.log('\nAll structures found:')
Array.from(dimensionStructures.entries())
  .sort((a, b) => b[1] - a[1])
  .forEach(([keys, count]) => {
    console.log(`  ${count}x: ${keys || '(empty)'}`)
    const example = dimensionExamples.get(keys)
    if (example) {
      console.log(`      Example (${example.id}): ${JSON.stringify(example.value)}`)
    }
  })

// FLAGS - CRITICAL!
console.log('\n\n🚩 FLAGS FIELD ANALYSIS ***CRITICAL***')
console.log('-'.repeat(60))

const allFlagTypes = new Set<string>()
const flagCounts = new Map<string, number>()
const flagExamples = new Map<string, any>()

data.records.forEach(record => {
  if (record.flags && typeof record.flags === 'object') {
    Object.keys(record.flags).forEach(flagName => {
      if (record.flags[flagName] === true) {
        allFlagTypes.add(flagName)
        flagCounts.set(flagName, (flagCounts.get(flagName) || 0) + 1)

        if (!flagExamples.has(flagName)) {
          flagExamples.set(flagName, {
            id: record.object_id,
            title: record.title || 'Untitled'
          })
        }
      }
    })
  }
})

console.log(`\n⚠️  TOTAL UNIQUE FLAG TYPES: ${allFlagTypes.size}`)
console.log('\n*** ALL FLAG TYPES IN DATA (must handle all): ***')
Array.from(allFlagTypes).sort().forEach(flagName => {
  const count = flagCounts.get(flagName) || 0
  const example = flagExamples.get(flagName)
  console.log(`  ✓ ${flagName} (${count} occurrence${count !== 1 ? 's' : ''})`)
  console.log(`    Example: ${example.id} - "${example.title}"`)
})

if (allFlagTypes.size === 0) {
  console.log('  (No flags found in data)')
}

// RELATED field
console.log('\n\n🔗 RELATED FIELD ANALYSIS')
console.log('-'.repeat(60))

const relatedTypes = new Set<string>()
const recordsWithRelated = data.records.filter(r => r.related && r.related.length > 0)

recordsWithRelated.forEach(record => {
  record.related.forEach(rel => {
    if (rel.type) relatedTypes.add(rel.type)
  })
})

console.log(`\nRecords with related items: ${recordsWithRelated.length}`)
if (relatedTypes.size > 0) {
  console.log('\nRelation types found:')
  Array.from(relatedTypes).sort().forEach(type => {
    console.log(`  ✓ ${type}`)
  })
}

// Check ALL fields present in data
console.log('\n\n🔍 ALL FIELDS IN DATA')
console.log('-'.repeat(60))

const allFields = new Set<string>()
data.records.forEach(record => {
  Object.keys(record).forEach(key => allFields.add(key))
})

console.log(`\nTotal unique fields: ${allFields.size}`)
console.log('\nAll fields:')
Array.from(allFields).sort().forEach(field => {
  const recordsWithField = data.records.filter(r => r[field as keyof typeof r] != null).length
  const percentage = ((recordsWithField / data.records.length) * 100).toFixed(1)
  console.log(`  ${field}: ${recordsWithField}/${data.records.length} (${percentage}%)`)
})

// Summary
console.log('\n\n✅ NORMALIZATION REQUIREMENTS SUMMARY')
console.log('='.repeat(60))
console.log('\n*** MUST HANDLE ALL OF THESE: ***')
console.log('\n1. CREATOR: Handle string, array, empty array, null')
console.log('2. DATE: Handle object, string, number, null')
console.log('3. MATERIALS: Handle string, array, null')
console.log('4. DIMENSIONS: Extract display string from complex object')
console.log('5. TITLE: Provide fallback for null values')
console.log(`\n6. FLAGS (${allFlagTypes.size} TYPES - ALL MUST BE HANDLED):`)
if (allFlagTypes.size > 0) {
  Array.from(allFlagTypes).sort().forEach(flag => {
    console.log(`   ✓ ${flag}`)
  })
} else {
  console.log('   (none found)')
}
console.log('\n7. RELATED: Array of relationship objects')
console.log(`\n8. ADDITIONAL FIELDS (${allFields.size} total fields in data)`)
console.log('   Check if all are being used or if any are being ignored')
console.log('\n' + '='.repeat(60))
console.log('\n⚠️  Run this script after ANY data changes to catch new edge cases!')
console.log('='.repeat(60))
