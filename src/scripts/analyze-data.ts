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

// Analyze creator field
console.log('🎨 CREATOR FIELD ANALYSIS')
console.log('-'.repeat(60))

const creatorTypes = new Map<string, number>()
const creatorExamples = new Map<string, any[]>()

data.records.forEach(record => {
  let type: string
  
  if (record.creator === null) {
    type = 'null'
  } else if (Array.isArray(record.creator)) {
    type = record.creator.length === 0 ? 'empty-array' : 'array'
  } else if (typeof record.creator === 'string') {
    type = 'string'
  } else {
    type = 'unknown'
  }
  
  creatorTypes.set(type, (creatorTypes.get(type) || 0) + 1)
  
  if (!creatorExamples.has(type)) {
    creatorExamples.set(type, [])
  }
  if (creatorExamples.get(type)!.length < 2) {
    creatorExamples.get(type)!.push({
      id: record.object_id,
      value: record.creator
    })
  }
})

console.log('\nTypes found:')
creatorTypes.forEach((count, type) => {
  console.log(`  ${type}: ${count} records`)
})

console.log('\nExamples:')
creatorExamples.forEach((examples, type) => {
  console.log(`  ${type}:`)
  examples.forEach(ex => {
    console.log(`    ${ex.id}: ${JSON.stringify(ex.value)}`)
  })
})

// Analyze date field
console.log('\n\n📅 DATE FIELD ANALYSIS')
console.log('-'.repeat(60))

const dateTypes = new Map<string, number>()
const dateExamples = new Map<string, any[]>()

data.records.forEach(record => {
  let type: string
  
  if (record.date === null) {
    type = 'null'
  } else if (typeof record.date === 'object') {
    type = 'object'
  } else if (typeof record.date === 'string') {
    type = 'string'
  } else if (typeof record.date === 'number') {
    type = 'number'
  } else {
    type = 'unknown'
  }
  
  dateTypes.set(type, (dateTypes.get(type) || 0) + 1)
  
  if (!dateExamples.has(type)) {
    dateExamples.set(type, [])
  }
  if (dateExamples.get(type)!.length < 2) {
    dateExamples.get(type)!.push({
      id: record.object_id,
      value: record.date
    })
  }
})

console.log('\nTypes found:')
dateTypes.forEach((count, type) => {
  console.log(`  ${type}: ${count} records`)
})

console.log('\nExamples:')
dateExamples.forEach((examples, type) => {
  console.log(`  ${type}:`)
  examples.forEach(ex => {
    console.log(`    ${ex.id}: ${JSON.stringify(ex.value)}`)
  })
})

// Analyze materials field
console.log('\n\n🔨 MATERIALS FIELD ANALYSIS')
console.log('-'.repeat(60))

const materialsTypes = new Map<string, number>()
const materialsExamples = new Map<string, any[]>()

data.records.forEach(record => {
  let type: string
  
  if (record.materials === null || record.materials === undefined) {
    type = 'null'
  } else if (Array.isArray(record.materials)) {
    type = record.materials.length === 0 ? 'empty-array' : 'array'
  } else if (typeof record.materials === 'string') {
    type = 'string'
  } else {
    type = 'unknown'
  }
  
  materialsTypes.set(type, (materialsTypes.get(type) || 0) + 1)
  
  if (!materialsExamples.has(type)) {
    materialsExamples.set(type, [])
  }
  if (materialsExamples.get(type)!.length < 2) {
    materialsExamples.get(type)!.push({
      id: record.object_id,
      value: record.materials
    })
  }
})

console.log('\nTypes found:')
materialsTypes.forEach((count, type) => {
  console.log(`  ${type}: ${count} records`)
})

console.log('\nExamples:')
materialsExamples.forEach((examples, type) => {
  console.log(`  ${type}:`)
  examples.forEach(ex => {
    console.log(`    ${ex.id}: ${JSON.stringify(ex.value)}`)
  })
})

// Analyze title field
console.log('\n\n📝 TITLE FIELD ANALYSIS')
console.log('-'.repeat(60))

const missingTitles = data.records.filter(r => !r.title)
console.log(`\nRecords with missing titles: ${missingTitles.length}`)
if (missingTitles.length > 0) {
  console.log('Examples:')
  missingTitles.slice(0, 3).forEach(r => {
    console.log(`  ${r.object_id}: null → needs "Untitled" fallback`)
  })
}

// Analyze dimensions field
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
console.log('\nMost common structures:')
Array.from(dimensionStructures.entries())
  .sort((a, b) => b[1] - a[1])
  .slice(0, 5)
  .forEach(([keys, count]) => {
    console.log(`  ${count} records with keys: ${keys}`)
    const example = dimensionExamples.get(keys)
    if (example) {
      console.log(`    Example (${example.id}): ${JSON.stringify(example.value)}`)
    }
  })

// Summary
console.log('\n\n✅ NORMALIZATION REQUIREMENTS SUMMARY')
console.log('='.repeat(60))
console.log('\n1. CREATOR: Handle string, array, empty array, null')
console.log('2. DATE: Handle object, string, number, null')
console.log('3. MATERIALS: Handle string, array, null')
console.log('4. DIMENSIONS: Extract display string from complex object')
console.log('5. TITLE: Provide "Untitled" fallback for null values')
console.log('\nAll these variations must normalize to consistent types!')
console.log('\n' + '='.repeat(60))
