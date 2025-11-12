// Test script to verify PCM Class API
import axios from 'axios';

const BASE_URL = 'http://localhost:8000/api/pcm';

const testAPI = async () => {
  console.log('\n🧪 Testing PCM Class API...\n');
  
  const subjects = ['physics', 'chemistry', 'mathematics'];
  
  for (const subject of subjects) {
    try {
      console.log(`\n📚 Testing ${subject.toUpperCase()}:`);
      console.log('='.repeat(50));
      
      const response = await axios.post(`${BASE_URL}/classes-pcm`, {
        subject: subject
      });
      
      console.log('✅ Response Status:', response.status);
      console.log('✅ Success:', response.data.success);
      console.log('✅ Count:', response.data.count);
      
      if (response.data.data && response.data.data.length > 0) {
        response.data.data.forEach((cls, index) => {
          console.log(`\n   📖 Class ${index + 1}:`);
          console.log('   - Class Name:', cls.className);
          console.log('   - Batch:', cls.batch);
          console.log('   - Start Time:', new Date(cls.startTime).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }));
          console.log('   - End Time:', new Date(cls.endTime).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }));
          console.log('   - Status:', cls.status);
          console.log('   - Is Joinable:', cls.isJoinable);
          console.log('   - Meet Link:', cls.meetLink);
          console.log('   - Time Until Start:', Math.floor(cls.timeUntilStart / 1000 / 60), 'minutes');
        });
      } else {
        console.log('   ℹ️  No classes found for', subject);
      }
      
    } catch (error) {
      console.error(`❌ Error testing ${subject}:`, error.message);
      if (error.response) {
        console.error('   Response:', error.response.data);
      }
    }
  }
  
  console.log('\n' + '='.repeat(50));
  console.log('🏁 Test Complete!\n');
};

// Run the test
testAPI().catch(console.error);
