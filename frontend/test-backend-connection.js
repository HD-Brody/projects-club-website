// Quick test to verify backend connection
// Run this in the browser console on http://localhost:5173

async function testBackendConnection() {
  console.log('Testing backend connection...');
  
  try {
    // Test 1: Health check
    const healthResponse = await fetch('http://localhost:5000/health');
    const healthData = await healthResponse.json();
    console.log('✅ Health check:', healthData);
    
    // Test 2: Try signup
    const signupResponse = await fetch('http://localhost:5000/api/auth/signup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'test@example.com',
        password: 'testpassword123'
      })
    });
    
    const signupData = await signupResponse.json();
    if (signupResponse.ok) {
      console.log('✅ Signup successful:', signupData);
    } else {
      console.log('⚠️ Signup response:', signupData);
    }
    
  } catch (error) {
    console.error('❌ Connection failed:', error);
    console.log('Make sure:');
    console.log('1. Backend is running on http://localhost:5000');
    console.log('2. Backend has been restarted after CORS changes');
    console.log('3. No firewall blocking the connection');
  }
}

// Run the test
testBackendConnection();
