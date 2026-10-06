const U='https://cpgajlsyuieeengdnamy.supabase.co';
const K='sb_publishable_fbcJT-QGKyZg0tDkpbDkOQ_CcQf2ugW';
const S=window.supabase.createClient(U,K);
const $=id=>document.getElementById(id);

async function boot(){
  const {data:{session}}=await S.auth.getSession();
  if(!session){location.href='login.html';return}

  const {data:staff,error:staffError}=await S.from('admin_staff')
    .select('id,staff_code,full_name,email,role,status,permissions')
    .eq('user_id',session.user.id)
    .eq('status','active')
    .maybeSingle();

  if(staffError||!staff){
    await S.auth.signOut();
    location.href='login.html?error=unauthorized';
    return;
  }

  window.DBHAdmin={session,user:session.user,staff};
  await S.rpc('record_admin_login');

  const [a,p,pay,pend]=await Promise.all([
    S.from('agent_applications').select('*',{count:'exact',head:true}),
    S.from('properties').select('*',{count:'exact',head:true}),
    S.from('agent_payment_records').select('*',{count:'exact',head:true}),
    S.from('properties').select('*',{count:'exact',head:true}).or('verification_status.eq.pending,payment_status.eq.pending')
  ]);

  $('agents').textContent=a.error?'—':(a.count??'0');
  $('properties').textContent=p.error?'—':(p.count??'0');
  $('payments').textContent=pay.error?'—':(pay.count??'0');
  $('pending').textContent=pend.error?'—':(pend.count??'0');

  const name=document.querySelector('[data-admin-name]');
  if(name)name.textContent=staff.full_name||'DBH Admin';
}
boot();

document.getElementById('menu')?.addEventListener('click',()=>{
  document.querySelector('.side')?.classList.toggle('open');
});