const U='https://cpgajlsyuieeengdnamy.supabase.co',K='sb_publishable_fbcJT-QGKyZg0tDkpbDkOQ_CcQf2ugW',S=window.supabase.createClient(U,K),$=id=>document.getElementById(id);
async function boot(){
  const{data:{session}}=await S.auth.getSession();
  if(!session){location.href='login.html';return}
  const{data,error}=await S.functions.invoke('dbh-admin-staff',{body:{action:'access'}});
  if(error||!data?.ok){await S.auth.signOut();location.href='login.html?error=unauthorized';return}
  window.DBHAdmin={session,user:session.user,profile:data.profile,staff:data.staff||null};
  const[a,p,pay,pend,staff]=await Promise.all([
    S.from('agent_applications').select('*',{count:'exact',head:true}),
    S.from('properties').select('*',{count:'exact',head:true}),
    S.from('agent_payment_records').select('*',{count:'exact',head:true}),
    S.from('properties').select('*',{count:'exact',head:true}).or('verification_status.eq.pending,payment_status.eq.pending'),
    S.from('admin_staff').select('*',{count:'exact',head:true})
  ]);
  $('agents').textContent=a.error?'—':(a.count??'0');
  $('properties').textContent=p.error?'—':(p.count??'0');
  $('payments').textContent=pay.error?'—':(pay.count??'0');
  $('pending').textContent=pend.error?'—':(pend.count??'0');
  if($('staff'))$('staff').textContent=staff.error?'—':(staff.count??'0');
  await S.functions.invoke('dbh-admin-staff',{body:{action:'touch'}});
  const name=document.querySelector('[data-admin-name]');
  if(name)name.textContent=data.staff?.full_name||data.profile?.full_name||'DBH Admin';
}
boot();
document.getElementById('menu')?.addEventListener('click',()=>document.querySelector('.side')?.classList.toggle('open'));