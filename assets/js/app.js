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
      ['add-property.html','Add Property','circle-plus'],
      ['pending-review.html','Pending Review','clipboard-list','property-pending'],
      ['property-approvals.html','Approve & Publish','clipboard-check'],
      ['documents.html','Property Documents','file-shield']
    ]},
    {title:'PLATFORM',items:[
      ['payments.html','Payments & Receipts','credit-card'],
      ['withdrawals.html','Withdrawals','money-bill-transfer'],
      ['wallet.html','Wallet Management','wallet'],
      ['notifications.html','Notifications','bell'],
      ['email-templates.html','Email Templates','envelope-open-text'],
      ['messages.html','Customer Care & Messages','message'],
      ['reports.html','Reports & Analytics','chart-pie'],
      ['admin-staff.html','Admin Staff','user-shield'],
      ['tools.html','Admin Tools','screwdriver-wrench'],
      ['settings.html','Settings','gear']
    ]}
  ];
  const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  function getNavGroups(){
    const base=groups.map(g=>({title:g.title,items:g.items.map(a=>({href:a[0],label:a[1],icon:a[2],badge:a[3]||''}))}));
    base.push({title:'ACCESS CONTROL',items:[{href:'staff-permissions.html',label:'Staff Page Permissions',icon:'user-shield',badge:''}]});
    let cfg={};try{cfg=JSON.parse(localStorage.getItem('dbhSidebarCustomizations')||'{}')||{}}catch(e){}
    const labels=cfg.labels||{},hidden=cfg.hidden||{},orders=cfg.orders||{},groupTitles=cfg.groupTitles||{},icons=cfg.icons||{};
    base.forEach(g=>{g.title=groupTitles[g.title]||g.title;g.items=g.items.filter(a=>!hidden[a.href]).map(a=>({...a,label:labels[a.href]||a.label,icon:icons[a.href]||a.icon})).sort((a,b)=>(orders[a.href]??9999)-(orders[b.href]??9999));});
    const custom=(Array.isArray(cfg.custom)?cfg.custom:[]).filter(a=>a&&typeof a.href==='string'&&typeof a.label==='string'&&(a.href.startsWith('https://')||/^[a-zA-Z0-9_-]+\.html(?:[?#].*)?$/.test(a.href))).map(a=>({href:a.href,label:a.label,icon:a.icon||'link',badge:'',category:a.category||'CUSTOM LINKS'}));
    custom.forEach(a=>{let group=base.find(g=>g.title.toLowerCase()===String(a.category).toLowerCase());if(!group){group={title:a.category,items:[]};base.push(group)}if(!group.items.some(x=>x.href===a.href))group.items.push(a)});
    const staff=window.DBHAdminApp?.staff||null;
    const role=String(staff?.role||'').toLowerCase();
    const pageRules=staff?.permissions?.pages;
    const isFullAccess=role==='super_admin'||(!staff&&String(window.DBHAdminApp?.profile?.role||'').toLowerCase()==='admin');
    const pageKey=(href)=>{
      const key=String(href||'').replace(/\.html(?:[?#].*)?$/i,'').replace(/^.*\//,'')||'index';
      const aliases={
        'index':'index','dashboard':'index',
        'users':'customers','customer-activity':'customers','saved-properties':'customers',
        'customer-messages':'customer-care','messages':'messages',
        'agents':'agents','agent-applications':'agents','agent-documents':'documents',
        'agent-payments':'payments','agent-listings':'properties',
        'property-approvals':'properties','pending-review':'properties','email-templates':'settings','tools':'settings'
      };
      return aliases[key]||key;
    };
    const canView=(href)=>{
      if(isFullAccess)return true;
      if(!pageRules||typeof pageRules!=='object'||Object.keys(pageRules).length===0)return pageKey(href)==='index';
      return pageRules[pageKey(href)]?.view===true;
    };
    return base.map(g=>({...g,items:g.items.filter(a=>canView(a.href))})).filter(g=>g.items.length);
  }
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
      <div class="admin-side-identity" id="adminSideIdentity">
        <span class="admin-avatar"><i class="fa-solid fa-user-shield"></i></span>
        <span class="admin-identity-copy"><b>${esc(window.DBHAdminApp?.staff?.full_name||window.DBHAdminApp?.profile?.full_name||window.DBHAdminApp?.staff?.email||window.DBHAdminApp?.profile?.email||'Signed-in staff')}</b><small>${esc(String(window.DBHAdminApp?.staff?.role||window.DBHAdminApp?.profile?.role||'staff').replace(/_/g,' ').toUpperCase())} · SIGNED IN</small></span>
      </div>
      <div class="admin-side-scroll">
        <nav aria-label="Admin navigation">${getNavGroups().map((g,gi)=>`
          <section class="admin-nav-group">
            <div class="admin-nav-heading">${g.title}</div>
            ${g.items.map(a=>`<a href="${esc(a.href)}" class="admin-nav-link ${current===a.href.toLowerCase()?'active':''}" ${current===a.href.toLowerCase()?'aria-current="page"':''}><i class="fa-solid fa-${esc(a.icon)}"></i><span>${esc(a.label)}</span>${a.badge?`<span class="admin-nav-badge" id="propertyPendingBadge" aria-label="New property submissions" hidden>0</span>`:""}</a>`).join('')}
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
  let pendingPoll=null,pendingChannel=null,lastPendingCount=null;
  async function refreshPendingBadge(){
    const badge=document.getElementById('propertyPendingBadge');
    if(!badge||!S)return;
    try{
      const r=await S.from('properties').select('id,verification_status,is_verified,is_published').eq('is_published',false).limit(1000);
      if(r.error)throw r.error;
      const count=(r.data||[]).filter(p=>p.is_verified!==true&&!['verified','approved','rejected'].includes(String(p.verification_status||'').toLowerCase())).length;
      badge.textContent=count>99?'99+':String(count);badge.hidden=count===0;
      badge.setAttribute('aria-label',count+' properties awaiting review');badge.title=count+' property submission'+(count===1?'':'s')+' awaiting review';
      if(lastPendingCount!==null&&count>lastPendingCount){badge.classList.remove('badge-new');void badge.offsetWidth;badge.classList.add('badge-new');}
      lastPendingCount=count;
    }catch(e){/* Keep navigation usable if row-level security blocks the count. */}
  }
  function startPendingBadge(){
    refreshPendingBadge();if(pendingPoll)clearInterval(pendingPoll);
    pendingPoll=setInterval(()=>{if(document.visibilityState!=='hidden')refreshPendingBadge()},20000);
    document.addEventListener('visibilitychange',()=>{if(document.visibilityState!=='hidden')refreshPendingBadge()});
    try{if(S&&S.channel)pendingChannel=S.channel('dbh-admin-property-submissions').on('postgres_changes',{event:'*',schema:'public',table:'properties'},()=>refreshPendingBadge()).subscribe()}catch(e){}
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
    if(!document.getElementById('dbh-font-awesome')){const fa=document.createElement('link');fa.id='dbh-font-awesome';fa.rel='stylesheet';fa.href='https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css';fa.referrerPolicy='no-referrer';document.head.appendChild(fa)}
    if(document.getElementById('dbh-admin-shell-styles'))return;
    const style=document.createElement('style');style.id='dbh-admin-shell-styles';style.textContent=`
      .admin-side{position:fixed!important;inset:0 auto 0 0!important;width:265px!important;display:flex!important;flex-direction:column!important;z-index:1000!important;background:rgba(255,255,255,.97)!important;border-right:1px solid #dce8f4!important;padding:17px 13px 12px!important;box-shadow:14px 0 42px #052b5512!important;backdrop-filter:blur(18px)!important;transform:translateX(0);transition:transform .28s ease!important;font-family:Inter,system-ui,sans-serif}
      .admin-brand{display:flex;align-items:center;gap:10px;padding:4px 7px 17px!important;margin:0 0 8px!important;border-bottom:1px solid #e8eff7}
      .admin-brand img{width:43px!important;height:43px!important;object-fit:contain;border-radius:13px!important;background:#fff}
      .admin-brand strong{display:block;color:#062b52;font-size:13px;letter-spacing:.04em}
      .admin-brand small{display:block;color:#7890a9;font-size:8px;letter-spacing:.1em;margin-top:4px}
      .admin-side-close{display:none;margin-left:auto;border:0;background:#eef5ff;color:#1d5fb8;border-radius:10px;padding:8px}
      .admin-side-identity{display:flex;align-items:center;gap:10px;padding:11px 9px;margin:0 2px 8px;border:1px solid #e3edf8;border-radius:13px;background:linear-gradient(145deg,#f8fbff,#edf5ff);min-width:0}\n      .admin-avatar{width:34px;height:34px;display:grid;place-items:center;flex:0 0 34px;border-radius:11px;background:#dcecff;color:#176bc2;font-size:15px}\n      .admin-identity-copy{display:block;min-width:0}.admin-identity-copy b{display:block;color:#163a60;font-size:11px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.admin-identity-copy small{display:block;color:#7188a1;font-size:8px;font-weight:900;letter-spacing:.07em;margin-top:4px}
      .admin-quick-action{position:relative;min-width:0;display:flex;align-items:center;gap:7px;padding:10px 9px;border:1px solid #e3edf8;border-radius:12px;background:linear-gradient(145deg,#f8fbff,#edf5ff);color:#315f98!important;text-decoration:none!important;font-size:10px;font-weight:850;overflow:hidden;transition:transform .22s ease,box-shadow .22s ease,border-color .22s ease,background .22s ease}
      .admin-quick-action>i:first-child{display:inline-flex;align-items:center;justify-content:center;flex:0 0 25px;width:25px;height:25px;border-radius:9px;background:#dcecff;color:#2476d2;font-size:13px;transition:transform .3s cubic-bezier(.2,.8,.2,1),background .2s,color .2s}
      .admin-quick-action:first-child>i:first-child{color:#d94675;background:#ffe4ed}
      .admin-quick-action span:nth-child(2){white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
      .admin-quick-action:hover{transform:translateY(-2px);border-color:#a8cef8;box-shadow:0 8px 18px #2468a51c;background:#fff}
      .admin-quick-action:hover>i:first-child{transform:rotate(-10deg) scale(1.12);background:#cbe3ff;color:#075fc0}
      .admin-quick-action:first-child:hover>i:first-child{background:#ffd2e1;color:#be185d;animation:dbhBellWiggle .55s ease}
      .admin-quick-action:active{transform:scale(.97)}
      .admin-quick-action:focus-visible,.admin-nav-link:focus-visible{outline:3px solid #82baff;outline-offset:2px}
      .admin-quick-dot{position:absolute;top:8px;left:27px;width:7px;height:7px;border-radius:50%;background:#ef4444;border:2px solid #fff;animation:dbhDotPulse 1.7s infinite}
      .admin-shortcut-arrow{margin-left:auto;color:#8aa3bf;font-size:9px;transition:transform .2s}
      .admin-quick-action:hover .admin-shortcut-arrow{transform:translate(2px,-2px)}
      @keyframes dbhBellWiggle{0%,100%{transform:rotate(0) scale(1.12)}25%{transform:rotate(14deg) scale(1.12)}60%{transform:rotate(-12deg) scale(1.12)}}
      @keyframes dbhDotPulse{0%,100%{box-shadow:0 0 0 0 #ef444455}50%{box-shadow:0 0 0 5px #ef444400}}
      .admin-side-scroll{overflow-y:auto;overflow-x:hidden;flex:1;padding:2px 1px 10px;scrollbar-width:thin}
      .admin-nav-group{margin:11px 0 15px}
      .admin-nav-heading{padding:0 11px 7px;font-size:9px;font-weight:950;letter-spacing:.15em;color:#91a1b5}
      .admin-side nav{display:grid;gap:4px}
      .admin-nav-link{position:relative;display:flex;align-items:center;gap:11px;padding:10px 11px;border-radius:11px;text-decoration:none!important;color:#52657b!important;font-size:11px;font-weight:800;line-height:1.25;transition:background .2s,color .2s,transform .2s}
      .admin-nav-link i{width:18px;text-align:center;font-size:14px;color:#7b91aa;transition:color .2s,transform .25s cubic-bezier(.2,.8,.2,1),filter .25s}.admin-nav-link:hover i{transform:translateY(-2px) scale(1.2) rotate(-5deg);filter:drop-shadow(0 3px 3px #2367a833)}.admin-nav-link.active i{animation:dbhIconArrive .35s ease-out}@keyframes dbhIconArrive{0%{transform:scale(.72) rotate(-12deg)}70%{transform:scale(1.18) rotate(4deg)}100%{transform:scale(1) rotate(0)}}.admin-nav-link:hover{box-shadow:0 5px 13px #1c5c9510}.admin-nav-link:nth-of-type(1) i{color:#4f7ee8}.admin-nav-link:nth-of-type(2) i{color:#0e9f9a}.admin-nav-link:nth-of-type(3) i{color:#9b62d9}.admin-nav-link:nth-of-type(4) i{color:#d97706}.admin-nav-link:nth-of-type(5) i{color:#e05d78}.admin-nav-link:nth-of-type(6) i{color:#14a06f}.admin-nav-link:nth-of-type(7) i{color:#7c6ee6}.admin-nav-link:nth-of-type(8) i{color:#0e9db8}.admin-nav-link:nth-of-type(9) i{color:#c07836}.admin-nav-link:nth-of-type(10) i{color:#0d9488}.admin-nav-link:nth-of-type(11) i{color:#d97706}.admin-nav-link:nth-of-type(12) i{color:#22a06b}.admin-nav-link:nth-of-type(13) i{color:#5b76d6}.admin-nav-link:nth-of-type(14) i{color:#e05d78}.admin-nav-link:nth-of-type(15) i{color:#0d9488}.admin-nav-link:nth-of-type(16) i{color:#7c6ee6}.admin-nav-link:nth-of-type(17) i{color:#d97706}.admin-nav-link:nth-of-type(18) i{color:#0e9db8}.admin-nav-badge{margin-left:auto;min-width:21px;height:21px;padding:0 6px;border-radius:999px;background:#e11d48;color:#fff;display:inline-flex;align-items:center;justify-content:center;font-size:10px;font-weight:950;box-shadow:0 0 0 3px #ffe4eb;animation:dbhBadgePulse 1.8s infinite}.admin-nav-badge[hidden]{display:none}@keyframes dbhBadgePulse{0%,100%{box-shadow:0 0 0 3px #ffe4eb}50%{box-shadow:0 0 0 6px #ffe4ebaa}}
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
      /* Consistent semantic icon colours across the admin portal */
      .admin-main .fa-circle-check,.admin-main .fa-check-circle,.admin-main .fa-shield-check,.admin-main .fa-badge-check,.admin-main .fa-circle-check{color:#15945b}
      .admin-main .fa-triangle-exclamation,.admin-main .fa-circle-exclamation,.admin-main .fa-circle-info,.admin-main .fa-shield-halved{color:#15945b}
      .admin-main .fa-xmark,.admin-main .fa-circle-xmark,.admin-main .fa-ban,.admin-main .fa-trash,.admin-main .fa-circle-minus{color:#dc3545}
      .admin-main .fa-hourglass-half,.admin-main .fa-clock,.admin-main .fa-file-circle-question{color:#d97706}
      .admin-main .fa-house,.admin-main .fa-house-chimney,.admin-main .fa-building,.admin-main .fa-image,.admin-main .fa-images{color:#2778d4}
      .admin-main .fa-user,.admin-main .fa-users,.admin-main .fa-user-tie,.admin-main .fa-user-shield{color:#8b5bd6}
      .admin-main .fa-wallet,.admin-main .fa-credit-card,.admin-main .fa-money-bill-wave,.admin-main .fa-receipt{color:#0d9488}
      .admin-main .fa-bell,.admin-main .fa-message,.admin-main .fa-comments,.admin-main .fa-envelope{color:#db5b7a}
      .admin-main .fa-file,.admin-main .fa-file-lines,.admin-main .fa-file-shield,.admin-main .fa-folder-open{color:#7c6ee6}
      .admin-main .fa-filter,.admin-main .fa-magnifying-glass,.admin-main .fa-rotate-right,.admin-main .fa-gear,.admin-main .fa-sliders{color:#3279ca}
      .admin-main .note,.admin-main .warning,.admin-main .alert-warning{background:#eaf9f0!important;border-color:#b9e8cb!important;color:#176b42!important}
      .admin-main .note i,.admin-main .warning i,.admin-main .alert-warning i{color:#15945b!important}
      .admin-main .admin-security-note{background:#eaf9f0!important;color:#176b42!important}
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
      if(r.data?.ok){
        window.DBHAdminApp.profile=r.data.profile;window.DBHAdminApp.staff=r.data.staff;
        renderSidebar();
        const staff=window.DBHAdminApp.staff,role=String(staff?.role||'').toLowerCase(),rules=staff?.permissions?.pages;
        const rawKey=(location.pathname.split('/').pop()||'index.html').replace(/\.html(?:[?#].*)?$/i,'');
        const aliases={'dashboard':'index','users':'customers','customer-activity':'customers','saved-properties':'customers','customer-messages':'customer-care','agents':'agents','agent-applications':'agents','agent-documents':'documents','agent-payments':'payments','agent-listings':'properties','property-approvals':'properties','email-templates':'settings','tools':'settings','add-property':'properties'};
        const key=aliases[rawKey]||rawKey;
        const hasRules=rules&&typeof rules==='object'&&Object.keys(rules).length>0;
        const fullAccess=role==='super_admin'||(!staff&&String(window.DBHAdminApp.profile?.role||'').toLowerCase()==='admin');
        if(!fullAccess&&((!hasRules&&rawKey!=='index')||(hasRules&&rules?.[key]?.view!==true))&&rawKey!=='login'){
          document.body.innerHTML='<main style="font:16px system-ui;max-width:620px;margin:12vh auto;padding:28px;background:#fff;border:1px solid #dce8f4;border-radius:18px;color:#18334e"><h1 style="color:#052b55">Page access not granted</h1><p>Your DBH administrator has not enabled this page for your account. Contact your supervisor if you need it.</p><a href="index.html">Return to dashboard</a></main>';return session;
        }
        try{await S.functions.invoke('dbh-admin-staff',{body:{action:'touch'}})}catch(e){}
      } else document.body.classList.add('admin-auth-check-failed');
    }catch(e){document.body.classList.add('admin-auth-check-failed')}
    return session;
  }
  window.addEventListener('dbh-sidebar-settings-changed',()=>{renderSidebar();refreshPendingBadge()});
  let shellStarted=false;
  async function startAdminShell(){
    if(shellStarted)return;shellStarted=true;
    ensureStyles();renderSidebar();startPendingBadge();
    document.getElementById('adminMenu')?.addEventListener('click',openSidebar);
    window.addEventListener('resize',()=>{if(window.innerWidth>800)closeSidebar()});
    await auth();
    window.dispatchEvent(new CustomEvent('dbh-admin-ready',{detail:window.DBHAdminApp}));
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',startAdminShell,{once:true});
  else startAdminShell();
})();