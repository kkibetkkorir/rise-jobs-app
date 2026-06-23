// test.js - Test the automation system
const axios = require('axios');

async function testAutomation() {
  console.log('🧪 Testing Job Automation System...\n');

  // Test manual trigger
  try {
    console.log('📤 Triggering manual post...');
    const response = await axios.post(
      'https://us-central1-your-project.cloudfunctions.net/manualPost',
      {},
      {
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );
    console.log('✅ Manual post triggered:', response.data);
  } catch (error) {
    console.error('❌ Error:', error.response?.data || error.message);
  }

  // Test status check
  try {
    console.log('\n📊 Checking posting status...');
    const statusResponse = await axios.post(
      'https://us-central1-your-project.cloudfunctions.net/getPostingStatus',
      {},
      {
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );
    console.log('✅ Status:', statusResponse.data);
  } catch (error) {
    console.error('❌ Error:', error.response?.data || error.message);
  }
}

testAutomation();