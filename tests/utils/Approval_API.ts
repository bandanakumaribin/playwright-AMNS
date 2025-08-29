import{BACKEND_INSTANCE,USERS}from '../setupBlocks/constant'
import{login} from "./login";

const BASE_URL=`https://${BACKEND_INSTANCE}.ag-ri.in/api/`;

export async function fetch_approvers(request_number) {
  var headers = await login(USERS.intake_member,USERS.OTP);
  const fetch = (await import('node-fetch')).default;
  try {
    var UUID ='';
    var approvers=[];
    if(request_number.includes('PO'))
    {
    const response = await fetch(BASE_URL+`fx_views/records` +
    `?datasource_uuid=cGNnRA%3D%3D` +
    `&filters%5B0%5D%5Bfield_uuid%5D=Y2RkYw%3D%3D` +
    `&filters%5B0%5D%5Bvalue%5D=1` +
    `&filters%5B0%5D%5Bdata_type%5D=dropdown_select` +
    `&filters%5B1%5D%5Bfield_uuid%5D=ZGRYZw%3D%3D` +
    `&filters%5B1%5D%5Boperator%5D=contains` +
    `&filters%5B1%5D%5Bvalue%5D=${request_number}`, {method: 'GET', headers });
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    const data = await response.json();
     UUID = data?.records[0][0];
     if (!response.ok) throw new Error(`Request search fail: ${response.status}`);
     console.log('Searching With PO number :'+request_number)
     const response2 = await fetch(BASE_URL+'/fx_responses/'+UUID+'/get_approvals', { method: 'GET', headers });
     const resp = await response2.json();
     approvers = resp[0].approval_steps
     console.log('Total Approver found '+approvers.length)
    }
    if(request_number.includes('INV')){
      console.log('Searching With Invoice number :'+request_number)
      const response = await fetch(BASE_URL+'fx_views/records?datasource_uuid=WmNnZA%3D%3D&filters%5B0%5D%5Bfield_uuid%5D=TlFnZA%3D%3D&filters%5B0%5D%5Boperator%5D=contains&filters%5B0%5D%5Bvalue%5D='+request_number, { method: 'GET', headers });
      const data = await response.json();
      UUID = data?.records[0][0];
      if (!response.ok) throw new Error(`Request search fail: ${response.status}`);
      const response2 = await fetch(BASE_URL+'/fx_responses/'+UUID+'/get_approvals', { method: 'GET', headers });
      const resp = await response2.json();
      approvers = resp[0].approval_steps
      console.log('Total Approver found :'+approvers.length)
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

    }
    if(request_number.includes('Auto')){
      console.log('Searching With Intake number :'+request_number)
      const response = await fetch(BASE_URL+'views?item=IntakeRequest&group_key=default&page=1&filters=%7B%7D&search=%7B%22title%22%3A%22'+request_number+'%22%7D'
        , { method: 'GET', headers });
        const data = await response.json();
        UUID =data.groups[0].data.responses[0].identifier
        const response2 = await fetch(BASE_URL+'intake_requests/'+UUID+'/approvals', { method: 'GET', headers });
        const resp = await response2.json();
        approvers = resp[0].approval_steps
        console.log('Total Approver found :'+approvers.length)
        
      if (!response.ok) throw new Error(`Request search fail: ${response.status}`);
      
    }
    var numbers = [];
    headers = await login(USERS.super_admin,USERS.OTP);
    for (let i = 0; i < approvers.length; i++) {
      const Approver_name =  approvers[i].approvers[0].requested_from[0].trim();
      const url = BASE_URL+`/get_all_users?search=%7B%22category%22%3A%22name%22%2C%22value%22%3A${encodeURIComponent(JSON.stringify(Approver_name))}%7D`;
      const response = await fetch(url, {method:'GET',headers});
      const resp = await response.json();
      console.log('✅ Approver No'+(i+1)+' :'+resp?.users[0].first_name+': '+resp?.users[0].phone)
      numbers.push(resp?.users[0].phone);
    }
    return numbers;
  } catch (error) {
    console.error('❌ Approver Fetch failed:', error.message);
  }
}

export async function clearfilter() {
  const fetch = (await import('node-fetch')).default;
  const headers = await login(USERS.intake_member, USERS.OTP);// Add necessary content type
  let data;
  for (let i = 1; i <= 4; i++) {
    switch (i) {
      case 1:
        data = {
          applied_filters: {},
          item_type: "IntakeRequest",
          index: 0
        };
        break;

      case 2:
        data = {
          applied_order_by: [],
          item_type: "IntakeRequest",
          index: 0
        };
        break;

      case 3:
        data = {
          applied_group: ['default'],
          item_type: "IntakeRequest",
          index: 0
        };
        break;

      case 4:
        data = {
          columns: {
            identifier: { order: 0, hidden: false },
            ref_id: { order: 1, hidden: false },
            title: { order: 2, hidden: false },
            user_identifier: { order: 3, hidden: false },
            requester_name: { order: 4, hidden: false },
            status: { order: 8, hidden: false },
            intake_request_conditions: { order: 9, hidden: false },
            created_at: { order: 10002, hidden: false },
            updated_at: { order: 10003, hidden: false }
          },
          item_type: "IntakeRequest",
          index: 0
        };
        break;
    }

    const response = await fetch(`${BASE_URL}/user_preferences`, {
      method: 'POST',
      headers,
      body: JSON.stringify(data)
    });

    if (!response.ok) {
      const body = await response.text();
      throw new Error(`❌ API RESET FAILED at step ${i} — Status: ${response.status}, Body: ${body}`);
    }
  }
}

// PR search
export async function fetch_prs() {
  var headers = await login(USERS.intake_member,USERS.OTP);
  const url =
    `${BASE_URL}/fx_views/records?datasource_uuid=UWNnaw%3D%3D`;
  const fetch = (await import('node-fetch')).default;
   try {
    const res = await fetch(url, { method: 'GET', headers });
    if (res.status !== 200) {
      throw new Error(`HTTP ${res.status} – ${res.statusText}`);
    }
    const data = await res.json();
    var pr_no = data.records[19][2];
    console.log('Success:', pr_no);
    return pr_no;
  } catch (err) {
    console.error('Fetch failed:', err);
  }
  }

// Invoice search
export async function fetch_invoices() {
  var headers = await login(USERS.intake_member,USERS.OTP);
  const url =
    `${BASE_URL}/fx_views/records?datasource_uuid=WmNnZA%3D%3D` ;
  const fetch = (await import('node-fetch')).default;
   try {
    const res = await fetch(url, { method: 'GET', headers });
    if (res.status !== 200) {
      throw new Error(`HTTP ${res.status} – ${res.statusText}`);
    }
    const data = await res.json();
    var invoice_no = data.records[19][2];
    console.log('Success:', invoice_no);
    return invoice_no;
  } catch (err) {
    console.error('Fetch failed:', err);
  }
  }