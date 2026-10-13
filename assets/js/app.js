(()=> {
  const U='https://cpgajlsyuieeengdnamy.supabase.co';
  const K='sb_publishable_fbcJT-QGKyZg0tDkpbDkOQ_CcQf2ugW';
  const S=window.supabase?.createClient(U,K);
  window.DBHAdminApp=window.DBHAdminApp||{};
  window.DBHAdminApp.supabase=S;
  const groups=[
    {title:'OVERVIEW',items:[['index.html','Dashboard','gauge-high']]},
    {title:'CUSTOMER SECTION',items:[
      ['users.html','All Customers','users'],
      ['customer-activity.html','Customer Activity','chart-line'],
      ['saved-properties.html','Saved Properties','bookmark'],
      ['customer-messages.html','Customer Messages','comments']
    ]},
    {title:'AGENT SECTION',items:[
      ['agents.html','All Agents','user-tie'],
      ['agent-applications.html','Applications','file-circle-check'],
      ['agent-documents.html','Agent Documents','folder-open'],
      ['agent-payments.html','Registration Payments','wallet'],
      ['agent-listings.html','Agent Listings','house']
    ]},
    {title:'PROPERTY MANAGEMENT',items:[
      ['properties.html','All Properties','house-chimney'],
      ['property-approvals.html','Pending Approvals','clipboard-check'],
      ['documents.html','Property Documents','file-shield']
    ]},
    {title:'PLATFORM',items:[
      ['payments.html','Payments & Receipts','credit-card'],
      ['notifications.html','Notifications','bell'],
      ['messages.html','Customer Care & Messages','message'],
      ['reports.html','Reports & Analytics','chart-pie'],
      ['admin-staff.html','Admin Staff','user-shield'],
      ['tools.html','Admin Tools','screwdriver-wrench'],
      ['settings.html','Settings','gear']
    ]}
  ];
  const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  function renderSidebar(){
    const mount=document.getElementById('dbhAdminSidebar');
    if(!mount)return;
    const current=(location.pathname.split('/').pop()||'index.html').toLowerCase();
    mount.className='admin-side';
    mount.innerHTML=`
      <div class="admin-brand">
        <img src="https://dbanjushomes-com.onrender.com/dbh-logo.jpg" alt="DBH logo">
        <div><strong>DBH ADMIN</strong><small>D BANJUS HOMES NIG LTD</small></div>
        <button type="button" class="admin-side-close" id="adminSideClose" aria-label="Close menu"><i class="fa-solid fa-xmark"></i></button>
      </div>
      <div class="admin-side-scroll">
        <nav aria-label="Admin navigation">${groups.map((g,gi)=>`
          <section class="admin-nav-group">
            <div class="admin-nav-heading">${g.title}</div>
            ${g.items.map(a=>`<a href="${esc(a[0])}" class="admin-nav-link ${current===a[0]?'active':''}" ${current===a[0]?'aria-current="page"':''}><i class="fa-solid fa-${esc(a[2])}"></i><span>${esc(a[1])}</span></a>`).join('')}
          </section>`).join('')}
        </nav>
      </div>
      <div class="admin-side-footer">
        <div class="admin-security-note"><i class="fa-solid fa-shield-halved"></i><span><b>Admin workspace</b><small>Access is controlled by DBH</small></span></div>
        <button class="admin-logout" id="adminLogout" type="button"><i class="fa-solid fa-right-from-bracket"></i><span>Sign out</span></button>
      </div>`;
    document.getElementById('adminLogout')?.addEventListener('click',async()=>{
      try{if(S)await S.auth.signOut()}finally{location.href='login.html'}
    });
    document.getElementById('adminSideClose')?.addEventListener('click',()=>closeSidebar());
  }
  function openSidebar(){
    document.getElementById('dbhAdminSidebar')?.classList.add('open');
    let overlay=document.getElementById('adminSidebarOverlay');
    if(!overlay){overlay=document.createElement('button');overlay.id='adminSidebarOverlay';overlay.className='admin-sidebar-overlay';overlay.type='button';overlay.setAttribute('aria-label','Close navigation');document.body.appendChild(overlay);overlay.addEventListener('click',closeSidebar)}
    overlay.classList.add('show');document.body.classList.add('admin-nav-open');
  }
  function closeSidebar(){
    document.getElementById('dbhAdminSidebar')?.classList.remove('open');
    document.getElementById('adminSidebarOverlay')?.classList.remove('show');
    document.body.classList.remove('admin-nav-open');
  }
  function ensureStyles(){
    if(document.getElementById('dbh-admin-shell-styles'))return;
    const style=document.createElement('style');style.id='dbh-admin-shell-styles';style.textContent=`
      .admin-side{position:fixed!important;inset:0 auto 0 0!important;width:265px!important;display:flex!important;flex-direction:column!important;z-index:1000!important;background:rgba(255,255,255,.97)!important;border-right:1px solid #dce8f4!important;padding:17px 13px 12px!important;box-shadow:14px 0 42px #052b5512!important;backdrop-filter:blur(18px)!important;transform:translateX(0);transition:transform .28s ease!important;font-family:Inter,system-ui,sans-serif}
      .admin-brand{display:flex;align-items:center;gap:10px;padding:4px 7px 17px!important;margin:0 0 8px!important;border-bottom:1px solid #e8eff7}
      .admin-brand img{width:43px!important;height:43px!important;object-fit:contain;border-radius:13px!important;background:#fff}
      .admin-brand strong{display:block;color:#062b52;font-size:13px;letter-spacing:.04em}
      .admin-brand small{display:block;color:#7890a9;font-size:8px;letter-spacing:.1em;margin-top:4px}
      .admin-side-close{display:none;margin-left:auto;border:0;background:#eef5ff;color:#1d5fb8;border-radius:10px;padding:8px}
      .admin-side-scroll{overflow-y:auto;overflow-x:hidden;flex:1;padding:2px 1px 10px;scrollbar-width:thin}
      .admin-nav-group{margin:11px 0 15px}
      .admin-nav-heading{padding:0 11px 7px;font-size:9px;font-weight:950;letter-spacing:.15em;color:#91a1b5}
      .admin-side nav{display:grid;gap:4px}
      .admin-nav-link{position:relative;display:flex;align-items:center;gap:11px;padding:10px 11px;border-radius:11px;text-decoration:none!important;color:#52657b!important;font-size:11px;font-weight:800;line-height:1.25;transition:background .2s,color .2s,transform .2s}
      .admin-nav-link i{width:18px;text-align:center;font-size:14px;color:#7b91aa}
      .admin-nav-link:hover{background:#f0f7ff;color:#0868cb!important;transform:translateX(2px)}
      .admin-nav-link.active{background:linear-gradient(115deg,#e8f3ff,#f1f8ff);color:#076bd1!important;box-shadow:inset 3px 0 #0876df}
      .admin-nav-link.active i{color:#0876df}
      .admin-side-footer{padding-top:10px;border-top:1px solid #e8eff7}
      .admin-security-note{display:flex;align-items:center;gap:10px;padding:10px;margin-bottom:5px;border-radius:12px;background:#f1f7ff;color:#1762b2}
      .admin-security-note>i{font-size:17px}
      .admin-security-note b,.admin-security-note small{display:block}.admin-security-note b{font-size:10px}.admin-security-note small{font-size:9px;color:#7188a1;margin-top:3px}
      .admin-logout{width:100%;border:0;background:transparent;text-decoration:none;color:#c73545;display:flex;align-items:center;gap:11px;padding:11px;border-radius:11px;font-weight:850;font-size:11px;text-align:left;cursor:pointer}
      .admin-logout i{width:18px;text-align:center}.admin-logout:hover{background:#fff1f2}
      .admin-sidebar-overlay{display:none}
      .admin-main{margin-left:265px!important}
      body:has(.admin-side) .admin-main{min-width:0}
      @media(max-width:800px){
        .admin-side{transform:translateX(-105%)!important;width:min(290px,86vw)!important}
        .admin-side.open{transform:translateX(0)!important}
        .admin-side-close{display:inline-flex}
        .admin-main{margin-left:0!important}
        .admin-sidebar-overlay{display:block;position:fixed;inset:0;z-index:999;border:0;background:#061a30a8;opacity:0;pointer-events:none;transition:opacity .25s}
        .admin-sidebar-overlay.show{opacity:1;pointer-events:auto}
        body.admin-nav-open{overflow:hidden}
      }
      @media(prefers-reduced-motion:reduce){.admin-side,.admin-nav-link,.admin-sidebar-overlay{transition:none!important}}
    `;document.head.appendChild(style)
  }
  async function auth(){
    if(!S)return null;
    const {data:{session}}=await S.auth.getSession();
    if(!session){location.href='login.html';return null}
    window.DBHAdminApp.session=session;
    try{
      const r=await S.functions.invoke('dbh-admin-staff',{body:{action:'access'}});
      if(r.data?.ok){window.DBHAdminApp.profile=r.data.profile;window.DBHAdminApp.staff=r.data.staff}
      else document.body.classList.add('admin-auth-check-failed');
    }catch(e){document.body.classList.add('admin-auth-check-failed')}
    return session;
  }
  document.addEventListener('DOMContentLoaded',async()=>{
    ensureStyles();renderSidebar();
    document.getElementById('adminMenu')?.addEventListener('click',openSidebar);
    window.addEventListener('resize',()=>{if(window.innerWidth>800)closeSidebar()});
    await auth();
    window.dispatchEvent(new CustomEvent('dbh-admin-ready',{detail:window.DBHAdminApp}));
  });
})();