#!/usr/bin/env node

/**
 * Script to clear all feedback data from the database
 * Usage: node scripts/clear-feedback-data.js
 */

const https = require('https');
const http = require('http');

// Configuration
const BASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'http://localhost:3000';
const isLocalhost = BASE_URL.includes('localhost') || BASE_URL.includes('127.0.0.1');

function makeRequest(url, method = 'GET') {
  return new Promise((resolve, reject) => {
    const client = isLocalhost ? http : https;
    
    const options = {
      method: method,
      headers: {
        'Content-Type': 'application/json',
      },
    };

    const req = client.request(url, options, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        try {
          const jsonData = JSON.parse(data);
          resolve({ status: res.statusCode, data: jsonData });
        } catch (error) {
          resolve({ status: res.statusCode, data: data });
        }
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    req.end();
  });
}

async function clearFeedbackData() {
  try {
    console.log('🗑️  Starting feedback data cleanup...\n');

    // First, check current record count
    console.log('📊 Checking current data count...');
    const checkUrl = `${BASE_URL}/api/clear-feedback-data`;
    const checkResponse = await makeRequest(checkUrl, 'GET');
    
    if (checkResponse.status === 200) {
      const currentCount = checkResponse.data.data.totalRecords;
      console.log(`✅ Current records in database: ${currentCount}`);
      
      if (currentCount === 0) {
        console.log('✅ Database is already empty!');
        return;
      }
    } else {
      console.log('⚠️  Could not check current count, proceeding anyway...');
    }

    // Confirm deletion
    console.log('\n⚠️  WARNING: This will delete ALL feedback data!');
    console.log('   This action cannot be undone.');
    
    // For safety, we'll require manual confirmation
    const readline = require('readline');
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });

    const answer = await new Promise((resolve) => {
      rl.question('\nType "DELETE" to confirm: ', (input) => {
        rl.close();
        resolve(input.trim());
      });
    });

    if (answer !== 'DELETE') {
      console.log('❌ Operation cancelled.');
      return;
    }

    // Proceed with deletion
    console.log('\n🗑️  Deleting all feedback data...');
    const deleteResponse = await makeRequest(checkUrl, 'DELETE');
    
    if (deleteResponse.status === 200) {
      const result = deleteResponse.data;
      console.log('✅ Success!');
      console.log(`📊 Records deleted: ${result.data.recordsDeleted}`);
      console.log(`📊 Remaining records: ${result.data.remainingRecords}`);
      console.log(`⏰ Timestamp: ${result.data.timestamp}`);
    } else {
      console.log('❌ Error:', deleteResponse.data.error || 'Unknown error');
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
    console.log('\n💡 Make sure your development server is running: npm run dev');
  }
}

// Run the script
if (require.main === module) {
  clearFeedbackData();
}

module.exports = { clearFeedbackData }; 