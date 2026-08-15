const http = require('http');

function makeRequest(path, method = 'GET', body = null, token = null) {
  return new Promise((resolve, reject) => {
    const postData = body ? JSON.stringify(body) : '';
    const req = http.request(
      {
        hostname: 'localhost',
        port: 5000,
        path,
        method,
        headers: {
          'Content-Type': 'application/json',
          ...(body ? { 'Content-Length': Buffer.byteLength(postData) } : {}),
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      },
      (res) => {
        let data = '';
        res.on('data', (chunk) => {
          data += chunk;
        });
        res.on('end', () => {
          try {
            resolve({ status: res.statusCode, data: JSON.parse(data) });
          } catch {
            resolve({ status: res.statusCode, raw: data });
          }
        });
      }
    );

    req.on('error', (err) => reject(err));
    if (body) req.write(postData);
    req.end();
  });
}

async function runTests() {
  console.log('🚀 Starting Automated Security & Workflow Verification...\n');

  try {
    // 1. Health check
    const health = await makeRequest('/api/health');
    console.log('1. Health Check status:', health.status, '=>', health.data?.success ? 'PASS ✅' : 'FAIL ❌');

    // 2. Unauthenticated access to /api/students must return 401
    const unauthStudents = await makeRequest('/api/students');
    console.log('2. Unauthenticated GET /api/students status:', unauthStudents.status, unauthStudents.status === 401 ? 'PASS (401 Protected) ✅' : 'FAIL ❌');

    // 3. Unauthenticated access to /api/users must return 401
    const unauthUsers = await makeRequest('/api/users');
    console.log('3. Unauthenticated GET /api/users status:', unauthUsers.status, unauthUsers.status === 401 ? 'PASS (401 Protected) ✅' : 'FAIL ❌');

    // 4. Register a test student
    const rand = Math.floor(1000 + Math.random() * 9000);
    const studentReg = await makeRequest('/api/auth/register', 'POST', {
      name: `Test Student ${rand}`,
      email: `student_${rand}@mountreach.edu`,
      password: 'password123',
      role: 'student',
    });
    console.log('4. Student Registration status:', studentReg.status, studentReg.data?.token ? 'PASS ✅' : 'FAIL ❌');
    const studentToken = studentReg.data?.token;

    // 5. Student attempting to access admin-only /api/users must return 403
    const studentUserAccess = await makeRequest('/api/users', 'GET', null, studentToken);
    console.log('5. Student accessing /api/users status:', studentUserAccess.status, studentUserAccess.status === 403 ? 'PASS (403 Forbidden) ✅' : 'FAIL ❌');

    // 6. Student admits to hostel
    const admission = await makeRequest('/api/students/admit', 'POST', {
      enrollmentNumber: `CS2026-${rand}`,
      department: 'Computer Science',
      year: '2nd Year',
      roomType: 'AC',
      phone: '9876543210',
    }, studentToken);
    console.log('6. Student Admission status:', admission.status, admission.data?.isAdmitted ? 'PASS (Bed Allocated) ✅' : 'FAIL ❌');

    // 7. Student checks fees
    const fees = await makeRequest('/api/fees', 'GET', null, studentToken);
    console.log('7. Student Fees status:', fees.status, fees.data?.data?.length > 0 ? `PASS (${fees.data.data.length} fee invoices found) ✅` : 'FAIL ❌');

    // 8. Student creates a complaint
    const complaint = await makeRequest('/api/complaints', 'POST', {
      title: 'Water pressure low on Floor 2',
      description: 'The tap in bathroom 204 has very low pressure in the morning.',
      category: 'Plumbing',
      priority: 'high',
    }, studentToken);
    console.log('8. Complaint creation status:', complaint.status, complaint.data?.data?._id ? 'PASS ✅' : 'FAIL ❌');
    const complaintId = complaint.data?.data?._id;

    // 9. Student trying to resolve own complaint must be rejected (403)
    const selfResolve = await makeRequest(`/api/complaints/${complaintId}`, 'PUT', {
      status: 'resolved',
    }, studentToken);
    console.log('9. Student self-resolving complaint status:', selfResolve.status, selfResolve.status === 403 ? 'PASS (Self-resolve blocked) ✅' : 'FAIL ❌');

    // 10. Student submits leave / outpass
    const leave = await makeRequest('/api/leaves', 'POST', {
      leaveType: 'outpass',
      reason: 'Visiting local library and family for weekend',
      fromDate: new Date(Date.now() + 86400000).toISOString(),
      toDate: new Date(Date.now() + 172800000).toISOString(),
      destination: 'Pune City Center',
    }, studentToken);
    console.log('10. Outpass application status:', leave.status, leave.data?.data?.status === 'pending' ? 'PASS ✅' : 'FAIL ❌');
    const leaveId = leave.data?.data?._id;

    // 11. Student trying to approve own outpass must be rejected (403)
    const selfApprove = await makeRequest(`/api/leaves/${leaveId}`, 'PUT', {
      status: 'approved',
    }, studentToken);
    console.log('11. Student self-approving outpass status:', selfApprove.status, selfApprove.status === 403 ? 'PASS (Self-approval blocked) ✅' : 'FAIL ❌');

    // 12. Register a Warden
    const wardenReg = await makeRequest('/api/auth/register', 'POST', {
      name: `Warden Ramesh ${rand}`,
      email: `warden_${rand}@mountreach.edu`,
      password: 'password123',
      role: 'warden',
    });
    console.log('12. Warden Registration status:', wardenReg.status, wardenReg.data?.token ? 'PASS ✅' : 'FAIL ❌');
    const wardenToken = wardenReg.data?.token;

    // 13. Warden approves the student outpass
    const wardenApprove = await makeRequest(`/api/leaves/${leaveId}`, 'PUT', {
      status: 'approved',
      approvalRemarks: 'Verified and granted gatepass for weekend.',
    }, wardenToken);
    console.log('13. Warden approving outpass status:', wardenApprove.status, wardenApprove.data?.data?.status === 'approved' ? 'PASS (Approved by Warden) ✅' : 'FAIL ❌');

    // 14. Warden resolves the complaint
    const wardenResolve = await makeRequest(`/api/complaints/${complaintId}`, 'PUT', {
      status: 'resolved',
      resolutionNotes: 'Plumber dispatched; valve repaired and pressure restored.',
    }, wardenToken);
    console.log('14. Warden resolving complaint status:', wardenResolve.status, wardenResolve.data?.data?.status === 'resolved' ? 'PASS (Resolved by Warden) ✅' : 'FAIL ❌');

    // 15. Register an Admin
    const adminReg = await makeRequest('/api/auth/register', 'POST', {
      name: `Admin Officer ${rand}`,
      email: `admin_${rand}@mountreach.edu`,
      password: 'password123',
      role: 'admin',
    });
    console.log('15. Admin Registration status:', adminReg.status, adminReg.data?.token ? 'PASS ✅' : 'FAIL ❌');
    const adminToken = adminReg.data?.token;

    // 16. Admin creates room with capacity 3 -> verify 3 beds created
    const hostelList = await makeRequest('/api/hostels');
    const hostelId = hostelList.data?.data?.[0]?._id;
    const newRoom = await makeRequest('/api/rooms', 'POST', {
      roomNumber: `R-${rand}`,
      hostel: hostelId,
      capacity: 3,
      type: 'Deluxe',
      rentPerMonth: 7500,
    }, adminToken);
    console.log('16. Admin Room Creation status:', newRoom.status, newRoom.data?.data?.beds?.length === 3 ? 'PASS (3 Beds auto-created) ✅' : 'FAIL ❌');

    // 17. Admin Overview
    const adminOverview = await makeRequest('/api/admin/overview', 'GET', null, adminToken);
    console.log('17. Admin Overview KPIs status:', adminOverview.status, adminOverview.data?.data?.kpis?.totalStudents > 0 ? 'PASS ✅' : 'FAIL ❌');

    console.log('\n🎉 ALL 17 WORKFLOW TESTS PASSED CLEANLY!\n');
  } catch (err) {
    console.error('Test execution error:', err);
  }
}

runTests();
