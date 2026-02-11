/**
 * Duplicate Detection Script
 *
 * Finds potential duplicates based on:
 * 1. Items with possible_duplicate flag
 * 2. Items with matching titles
 */

import collectionData from '../data/collection.json'

const records = collectionData.records

console.log('='.repeat(80))
console.log('DUPLICATE DETECTION REPORT')
console.log('='.repeat(80))
console.log()

// 1. Find items explicitly flagged as duplicates
console.log('FLAGGED AS POSSIBLE DUPLICATES:')
console.log('-'.repeat(80))
const flaggedDuplicates = records.filter(
  (r: any) => r.flags && r.flags.possible_duplicate === true
)
flaggedDuplicates.forEach((r: any) => {
  console.log(`${r.object_id}: "${r.title}"`)
  console.log(`  Accession: ${r.accession_number}`)
  console.log(`  Flags: ${JSON.stringify(r.flags)}`)
  console.log()
})

// 2. Find items with matching titles (potential duplicates)
console.log()
console.log('ITEMS WITH MATCHING TITLES:')
console.log('-'.repeat(80))

const titleGroups = new Map<string, any[]>()
records.forEach((r: any) => {
  if (r.title) {
    if (!titleGroups.has(r.title)) {
      titleGroups.set(r.title, [])
    }
    titleGroups.get(r.title)!.push(r)
  }
})

// Show groups with more than one item
titleGroups.forEach((items, title) => {
  if (items.length > 1) {
    console.log(`\n"${title}" (${items.length} records):`)
    items.forEach((item: any) => {
      console.log(`  - ${item.object_id} (${item.accession_number})`)
      if (item.flags) {
        console.log(`    Flags: ${JSON.stringify(item.flags)}`)
      }
    })
  }
})

console.log()
console.log('='.repeat(80))
console.log(`Total flagged duplicates: ${flaggedDuplicates.length}`)
console.log(`Total title groups with duplicates: ${Array.from(titleGroups.values()).filter(g => g.length > 1).length}`)
console.log('='.repeat(80))
