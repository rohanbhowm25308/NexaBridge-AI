let csrf='',role=null;const $=id=>document.getElementById(id);const icons={email:'✉',drive:'▣',ticketing:'◫',crm:'♙',chat:'◉'};const titles={email:'Email',drive:'Cloud Drive',ticketing:'Ticketing',crm:'CRM',chat:'Team Chat'};const subtitles={overview:'Secure orchestration across your enterprise ecosystem.',connectors:'Explore role-scoped simulated enterprise tools.',assistant:'Ask questions without exposing restricted data.',security:'Defense-in-depth access and data policies.',audits:'Trace decisions and investigate denied access.',guardian:'Review privacy risks in your uploaded documents.',workflow:'Simulate safe enterprise automations.',insights:'Explore deeper intelligence from uploaded CSV files.'};async function api(path,options={}){const res=await fetch(path,{...options,headers:{'Content-Type':'application/json',...(csrf?{'X-CSRF-Token':csrf}:{}),...(options.headers||{})}});const data=await res.json();if(!res.ok)throw Error(data.error||'Request failed');return data}function show(page){document.querySelectorAll('.page').forEach(x=>{x.hidden=x.id!==page;if(x.id===page){x.classList.remove('page-enter');void x.offsetWidth;x.classList.add('page-enter');}});document.querySelectorAll('.nav').forEach(x=>x.classList.toggle('active',x.dataset.page===page));$('heading').textContent={overview:'Enterprise Overview',connectors:'Integration Connectors',assistant:'AI Assistant',security:'Security Center',audits:'Audit Logs',guardian:'AI Data Guardian',workflow:'AI Workflow Studio',insights:'AI Insight Forge'}[page];$('subheading').textContent=subtitles[page];if(page==='audits')loadAudits();if(page==='connectors'||page==='assistant')loadUploads();if(page==='overview')loadDatasets();if(page==='overview'||page==='connectors')loadUploadSummary();if(['guardian','workflow','insights'].includes(page))loadFeaturePage(page)}function node(tag,txt,cls){const e=document.createElement(tag);if(cls)e.className=cls;e.textContent=txt;return e}function setMessage(el,message){el.replaceChildren(node('p',message))}function renderCards(connectors){for(const target of ['overviewCards','connectorCards']){$(target).replaceChildren();for(const c of connectors){const card=node('div','', 'tool');card.append(node('div',icons[c.name],'symbol'),node('h3',titles[c.name]),node('p',c.mode==='demo'?'Local synthetic connector':'Unavailable'),node('span',c.access?'● ACCESS GRANTED':'● ACCESS DENIED','pill'));if(target==='connectorCards'){const b=node('button','View records','outline');b.disabled=!c.access;b.onclick=()=>loadRecords(c.name);card.append(b)}$(target).append(card)}}}async function refresh(){try{const d=await api('/api/overview');$('auditCount').textContent=Object.values(d.counts).reduce((a,b)=>a+b,0);renderCards(d.connectors);$('datasetFiles').textContent=d.datasets.length;populateDatasets(d.datasets);loadUploadSummary()}catch(e){console.error(e)}}async function loadRecords(tool){const out=$('records');try{const d=await api('/api/records/'+tool);out.replaceChildren();for(const r of d.records){const div=node('div','', 'record');div.append(node('small',r.id+' · '+r.classification.toUpperCase()),node('h4',r.title),node('p',r.detail));out.append(div)}if(!d.records.length)setMessage(out,'No records visible for this role.')}catch(e){setMessage(out,e.message)}refresh()}async function loadAudits(){const out=$('auditResults');try{const d=await api('/api/audits');out.replaceChildren();for(const r of d.events){const div=node('div','', 'record');div.append(node('small',r.timestamp+' · '+r.actor.toUpperCase()),node('p',r.decision.toUpperCase()+' · '+r.tool+' / '+r.action+' · '+r.reason));out.append(div)}if(!d.events.length)setMessage(out,'No events yet.')}catch(e){setMessage(out,e.message)}}let myUploads=[];let selectedUploadId=null;
async function loadUploads(){
 try{const d=await api('/api/uploads');myUploads=d.files;
 const list=$('uploadedFiles'),choices=$('fileCheckboxes');list.replaceChildren();choices.replaceChildren();
 for(const f of myUploads){
  const item=node('div','', 'record');item.append(node('span',f.filename+' · '+f.kind+' · '+f.created_at.slice(0,10)));const view=node('button','Preview','outline');view.onclick=()=>previewUpload(f.id);item.append(view);
  const del=node('button','Delete','outline');del.onclick=async()=>{if(!confirm('Delete '+f.filename+'?'))return;try{await api('/api/uploads/'+f.id,{method:'DELETE'});await loadUploads();await refresh();await loadDatasets();await loadUploadSummary()}catch(e){alert(e.message)}};item.append(del);list.append(item);
  const label=document.createElement('label'),check=document.createElement('input');check.type='checkbox';check.value=f.id;check.className='upload-check';label.append(check,document.createTextNode(' '+f.filename));choices.append(label);
 }
 if(!myUploads.length){setMessage(list,'No uploaded files yet.');setMessage(choices,'Upload a file from Integrations first.')}
 }catch(e){$('uploadStatus').textContent=e.message}
}
$('uploadBtn').onclick=async()=>{const file=$('uploadInput').files[0];if(!file){$('uploadStatus').textContent='Choose a file first.';return}
 const data=new FormData();data.append('file',file);$('uploadStatus').textContent='Uploading and extracting text…';
 try{const res=await fetch('/api/uploads',{method:'POST',headers:{'X-CSRF-Token':csrf},body:data});const d=await res.json();if(!res.ok)throw Error(d.error||'Upload failed');$('uploadStatus').textContent='✓ Uploaded: '+d.filename+' ('+d.characters+' extracted characters). Preview is ready below.';$('uploadInput').value='';$('chosenFileName').textContent='No file selected';await loadUploads();await previewUpload(d.id);await refresh();await loadUploadSummary();if(d.kind==='.csv'){show('overview');await loadDatasets(d.id)}}catch(e){$('uploadStatus').textContent=e.message}};
async function previewUpload(id){
 const panel=$('uploadPreview');panel.hidden=false;$('previewTitle').textContent='Loading preview…';
 try{const d=await api('/api/uploads/'+id+'/preview');selectedUploadId=id;$('previewTitle').textContent=d.filename;$('previewMeta').textContent=d.kind.toUpperCase()+' · '+d.characters+' characters extracted'+(d.truncated?' · showing first 10,000':'');$('previewContent').textContent=d.preview;}
 catch(e){selectedUploadId=null;$('previewTitle').textContent='Preview unavailable';$('previewMeta').textContent=e.message;$('previewContent').textContent='';}
}
$('analyzeUploaded').onclick=async()=>{if(selectedUploadId===null)return;show('assistant');$('aiTool').value='uploads';$('fileChoices').hidden=false;await loadUploads();document.querySelectorAll('.upload-check').forEach(c=>{c.checked=Number(c.value)===selectedUploadId});$('question').value='Summarize this document and explain its key findings.';$('question').focus();};
$('aiTool').onchange=()=>{$('fileChoices').hidden=$('aiTool').value!=='uploads';if($('aiTool').value==='uploads')loadUploads()};
function signedIn(r){role=r;$('login').hidden=true;$('workspace').hidden=false;$('logout').hidden=false;$('roleBadge').textContent=r.toUpperCase();show('overview');refresh()}let authMode='login';function setAuthMode(mode){authMode=mode;$('loginBtn').textContent=mode==='register'?'Create account →':'Sign in →';$('signInTab').className=mode==='login'?'primary':'outline';$('signUpTab').className=mode==='register'?'primary':'outline';$('loginError').textContent='';} $('signInTab').onclick=()=>setAuthMode('login');$('signUpTab').onclick=()=>setAuthMode('register');$('loginBtn').onclick=async()=>{try{const payload={email:$('email').value,password:$('password').value};if(authMode==='register'){const d=await api('/api/register',{method:'POST',body:JSON.stringify(payload)});$('password').value='';setAuthMode('login');$('loginError').style.color='#65e6ad';$('loginError').textContent=d.message;return;}const d=await api('/api/login',{method:'POST',body:JSON.stringify(payload)});csrf=d.csrf;$('password').value='';$('loginError').textContent='';signedIn(d.role)}catch(e){$('loginError').style.color='#ff829d';$('loginError').textContent=e.message}};$('logout').onclick=async()=>{try{await api('/api/logout',{method:'POST'})}catch(e){}location.reload()};document.querySelectorAll('.nav').forEach(b=>b.onclick=()=>show(b.dataset.page));document.querySelectorAll('.jump').forEach(b=>b.onclick=()=>show(b.dataset.target));$('ask').onclick=async()=>{const out=$('answer');out.textContent='Checking permissions and retrieving approved data…';try{const d=await api('/api/assistant',{method:'POST',body:JSON.stringify({tool:$('aiTool').value,question:$('question').value,file_ids:[...document.querySelectorAll('.upload-check:checked')].map(x=>Number(x.value))})});out.textContent=d.answer+'\n\nSources: '+(d.sources.join(', ')||'none')+' · Mode: '+d.mode}catch(e){out.textContent=e.message}refresh()};$('showPatterns').onclick=()=>{$('scanResult').textContent='SUPPORTED DEMO PATTERNS\n• API key assignments: api_key=demo123\n• Password assignments: password=example123\n• Token assignments: token=demo123\n• Secret assignments: secret=demo123\n• OpenAI-style keys: sk- followed by 12+ characters\n• US SSN format: 123-45-6789\n\nUse synthetic values only. This is not a comprehensive DLP scanner.'};$('scan').onclick=async()=>{try{const d=await api('/api/check',{method:'POST',body:JSON.stringify({text:$('scanText').value})});$('scanResult').textContent=(d.blocked?'⚠ SENSITIVE PATTERN DETECTED':'✓ NO SUPPORTED SENSITIVE PATTERN FOUND')+'\n\n'+d.preview+'\n\n'+d.note}catch(e){$('scanResult').textContent=e.message}refresh()};$('refreshAudits').onclick=loadAudits;api('/api/session').then(d=>{if(d.role && d.csrf){csrf=d.csrf;signedIn(d.role)}}).catch(()=>{});

// Uploaded CSV analytics: all metrics are computed from the authenticated user's file.
let activeDataset=null,activeProfile=null,profileRows=[];
function populateDatasets(files){
 const sel=$('datasetSelect');if(!sel)return;
 const previous=sel.value;sel.replaceChildren();
 if(!files.length){sel.append(new Option('No CSV uploaded yet',''));activeDataset=null;activeProfile=null;$('datasetContent').hidden=true;$('datasetEmpty').hidden=false;return;}
 for(const f of files)sel.append(new Option(f.filename+' · '+f.created_at.slice(0,10),String(f.id)));
 sel.value=files.some(f=>String(f.id)===previous)?previous:String(files[0].id);
}
async function loadDatasets(preferred){
 try{
  const d=await api('/api/overview');populateDatasets(d.datasets);
  if(preferred && d.datasets.some(x=>x.id===Number(preferred)))$('datasetSelect').value=String(preferred);
  const id=Number($('datasetSelect').value);if(id)await selectDataset(id);
 }catch(e){$('datasetEmpty').textContent='Could not load datasets: '+e.message}
}
async function selectDataset(id){
 try{
  const d=await api('/api/datasets/'+id+'/analysis');activeDataset=id;activeProfile=d;profileRows=d.preview;
  $('datasetContent').hidden=false;$('datasetEmpty').hidden=true;
  $('datasetRows').textContent=d.rows.toLocaleString();$('datasetCols').textContent=d.columns;
  $('datasetMissing').textContent=d.missing.toLocaleString();
  $('datasetColumns').replaceChildren();for(const c of d.column_stats){
   const div=node('div','', 'column-item');div.append(node('strong',c.name),node('small',c.type+' · '+c.missing+' missing · '+c.unique+' distinct'+(c.mean!==null?' · mean '+c.mean:'')));$('datasetColumns').append(div);
  }
  $('datasetCharts').replaceChildren();
  for(const chart of d.charts){const box=node('div','', 'chart-card');box.append(node('h4',chart.column));const max=Math.max(1,...chart.values.map(x=>x.count));
   for(const item of chart.values){const line=node('div','', 'bar-row'),label=node('span',item.label),track=node('div','', 'bar-track'),bar=node('div','', 'bar-fill');bar.style.width=(100*item.count/max)+'%';track.append(bar);line.append(label,track,node('small',String(item.count)));box.append(line)}$('datasetCharts').append(box)}
  if(!d.charts.length)$('datasetCharts').append(node('p','No suitable categorical columns for a frequency chart. Numeric column insights are shown above.'));
  $('datasetSearch').value='';renderDatasetTable();
  $('datasetPreviewNote').textContent='Showing up to '+d.preview_count+' rows of '+d.rows+'. Search filters this preview only.';
 }catch(e){$('datasetContent').hidden=true;$('datasetEmpty').hidden=false;$('datasetEmpty').textContent=e.message}
}
function renderDatasetTable(){
 const target=$('datasetTable');target.replaceChildren();if(!activeProfile)return;
 const filter=$('datasetSearch').value.trim().toLowerCase();const table=document.createElement('table'),thead=document.createElement('thead'),head=document.createElement('tr');
 for(const name of activeProfile.headers)head.append(node('th',name));thead.append(head);table.append(thead);
 const body=document.createElement('tbody');for(const row of profileRows.filter(r=>r.some(v=>v.toLowerCase().includes(filter)))){const tr=document.createElement('tr');for(const cell of row)tr.append(node('td',cell));body.append(tr)}table.append(body);target.append(table);
}
$('datasetSelect').onchange=()=>{if($('datasetSelect').value)selectDataset(Number($('datasetSelect').value))};
$('datasetSearch').oninput=renderDatasetTable;
$('datasetAsk').onclick=async()=>{
 if(!activeDataset)return;show('assistant');$('aiTool').value='uploads';$('fileChoices').hidden=false;
 await loadUploads();document.querySelectorAll('.upload-check').forEach(c=>{c.checked=Number(c.value)===activeDataset});
 $('question').value='Analyze this CSV dataset: summarize its columns, trends, missing values, and useful insights.';$('question').focus();
};

// Feature pages share the existing authenticated, CSRF-protected API helper.
async function loadFeaturePage(page){
 if(page==='workflow'){loadWorkflowHistory();return;}
 try{const d=await api('/api/uploads');const select=$(page==='guardian'?'guardianFile':'insightFile');const prior=select.value;select.replaceChildren();
 const files=d.files.filter(f=>page==='guardian'||f.kind==='.csv');if(!files.length){select.append(new Option('Upload a '+(page==='guardian'?'file':'CSV')+' in Integrations first',''));return;}
 files.forEach(f=>select.append(new Option(f.filename,String(f.id))));if(files.some(f=>String(f.id)===prior))select.value=prior;
 }catch(e){$(page==='guardian'?'guardianStatus':'insightOutput').textContent=e.message}
}
$('guardianScan').onclick=async()=>{const id=$('guardianFile').value;if(!id)return;$('guardianStatus').textContent='Scanning locally…';try{const d=await api('/api/guardian/'+id);$('guardianStatus').textContent=d.filename+' · Risk: '+d.risk.toUpperCase()+' · '+(d.findings.length?d.findings.map(x=>x.type+': '+x.count).join(' | '):'No supported patterns detected')+' · '+d.note;$('guardianOriginal').textContent=d.original;$('guardianRedacted').textContent=d.redacted;}catch(e){$('guardianStatus').textContent=e.message}};
async function loadWorkflowHistory(){try{const d=await api('/api/workflows/history');const out=$('workflowHistory');out.replaceChildren();if(!d.runs.length)out.textContent='No workflow runs yet.';d.runs.forEach(r=>out.append(node('div',r.created_at.slice(0,19)+' · '+r.template,'record')))}catch(e){$('workflowHistory').textContent=e.message}}
$('workflowRun').onclick=async()=>{const out=$('workflowOutput');out.textContent='Simulating workflow…';try{const d=await api('/api/workflows/run',{method:'POST',body:JSON.stringify({template:$('workflowTemplate').value})});out.replaceChildren(node('h3',d.title+' ('+d.source+')'),node('p','Mode: '+d.mode+' · '+d.approval));d.steps.forEach((s,i)=>out.append(node('div',(i+1)+'. '+s.name+' — '+s.status+' · '+s.detail,'record')));loadWorkflowHistory()}catch(e){out.textContent=e.message}};
$('insightAnalyze').onclick=async()=>{const id=$('insightFile').value;if(!id)return;const out=$('insightOutput');out.textContent='Analyzing locally…';try{const d=await api('/api/insights/'+id);out.replaceChildren(node('h3',d.filename+' · '+d.quality+'% complete'));d.insights.forEach(t=>out.append(node('div',t,'record')));const charts=$('insightCharts');charts.replaceChildren();d.charts.forEach(c=>{const panel=node('div','','chart-card');panel.append(node('h4',c.column));const max=Math.max(1,...c.values.map(x=>x.count));c.values.forEach(v=>{const line=node('div','','bar-row'),track=node('div','','bar-track'),bar=node('div','','bar-fill');bar.style.width=100*v.count/max+'%';track.append(bar);line.append(node('span',v.label),track,node('small',String(v.count)));panel.append(line)});charts.append(panel)})}catch(e){out.textContent=e.message}};
$('insightGroq').onclick=async()=>{const id=Number($('insightFile').value);if(!id)return;show('assistant');$('aiTool').value='uploads';$('fileChoices').hidden=false;await loadUploads();document.querySelectorAll('.upload-check').forEach(c=>c.checked=Number(c.value)===id);$('question').value='Create an insight story for this dataset: key findings, data quality, limitations, and three practical recommendations. Do not invent statistics.';$('question').focus()};


// Dynamic user-upload panels: always use authenticated server results, never demo connector counts.
$('uploadInput').addEventListener('change',()=>{$('chosenFileName').textContent=$('uploadInput').files[0]?.name||'No file selected';});
async function loadUploadSummary(){
 try{
  const result=await api('/api/uploads');const files=result.files||[];
  const csvs=files.filter(f=>f.kind==='.csv');
  const docs=files.filter(f=>f.kind!=='.csv');
  for(const prefix of ['overview','connector']){
   const metrics=$(prefix+'UploadMetrics'),recent=$(prefix+'UploadRecent'),desc=$(prefix+'UploadDescription');
   if(!metrics||!recent)continue;
   metrics.replaceChildren();recent.replaceChildren();
   const values=[['Uploaded files',files.length],['CSV datasets',csvs.length],['Other documents',docs.length],['Most recent type',files[0]?files[0].kind.toUpperCase():'—']];
   for(const [label,value] of values){const card=node('div','', 'upload-metric');card.append(node('span',label),node('strong',String(value)));metrics.append(card)}
   desc.textContent=files.length?`${files.length} personal file${files.length===1?'':'s'} uploaded. ${csvs.length} CSV dataset${csvs.length===1?'':'s'} available for analytics.`:'No files uploaded yet. Choose a file in Integrations to get started.';
   for(const f of files.slice(0,4)){
    const item=node('div','', 'upload-recent-item');item.append(node('span',f.filename+' · '+f.kind.toUpperCase()));
    const button=node('button','View file','outline');button.type='button';button.onclick=async()=>{show('connectors');await previewUpload(f.id)};item.append(button);recent.append(item);
   }
  }
 }catch(err){console.warn('Could not refresh upload summary:',err.message)}
}

// Optional browser-based speech-to-text. No audio is sent to the Flask server.
(function setupVoiceInput(){
  const button=document.getElementById('voiceBtn');
  const field=document.getElementById('question');
  const status=document.getElementById('voiceStatus');
  if(!button || !field || !status)return;
  const SpeechRecognition=window.SpeechRecognition || window.webkitSpeechRecognition;
  if(!SpeechRecognition){
    button.disabled=true;button.title='Speech recognition is unavailable in this browser';
    status.textContent='Voice recognition is unavailable in this browser. Type your question instead.';
    return;
  }
  const recognition=new SpeechRecognition();
  recognition.lang=navigator.language || 'en-IN';
  recognition.continuous=false;
  recognition.interimResults=true;
  let listening=false;let prefix='';let finalTranscript='';
  function setListening(active){
    listening=active;button.classList.toggle('listening',active);
    button.setAttribute('aria-pressed',String(active));
    button.textContent=active?'■ Stop':'🎙 Voice';
  }
  button.addEventListener('click',()=>{
    if(listening){recognition.stop();return;}
    prefix=field.value.trim();finalTranscript='';
    try{recognition.start();}catch(e){status.textContent='Microphone could not start. Please try again.';}
  });
  recognition.onstart=()=>{setListening(true);status.textContent='Listening… speak your question.';};
  recognition.onresult=event=>{
    let interim='';
    for(let i=event.resultIndex;i<event.results.length;i++){
      const phrase=event.results[i][0].transcript;
      if(event.results[i].isFinal)finalTranscript+=phrase+' ';else interim+=phrase;
    }
    field.value=[prefix,finalTranscript.trim(),interim.trim()].filter(Boolean).join(' ');
    status.textContent=interim?'Transcribing your speech…':'Speech recognized. Review the question, then click Ask.';
  };
  recognition.onerror=event=>{
    const messages={'not-allowed':'Microphone permission denied. Allow microphone access in your browser.','no-speech':'No speech detected. Try again.','audio-capture':'No microphone detected. Check your microphone settings.','network':'Speech recognition network error. Try typing instead.'};
    status.textContent=messages[event.error] || ('Voice recognition error: '+event.error);
    setListening(false);
  };
  recognition.onend=()=>{setListening(false);if(status.textContent==='Listening… speak your question.')status.textContent='Voice input stopped. Review your question before clicking Ask.';};
})();
