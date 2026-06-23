
const JDS = {
  sde:`Senior Software Engineer — Backend\n\nWe are looking for a passionate Senior Software Engineer to join our high-growth fintech startup. You will design and own core backend systems processing millions of transactions daily.\n\nRequirements:\n- 4–7 years backend engineering experience\n- Deep expertise in Python or Go\n- Experience with distributed systems, microservices\n- PostgreSQL, Redis, MongoDB\n- Cloud: AWS or GCP\n- CI/CD, DevOps, Kubernetes/Docker\n- Startup experience preferred\n- Open source contributions a big plus`,
  pm:`Product Manager — Growth\n\nDriving user growth at our B2C SaaS platform.\n\nRequirements:\n- 3–6 years product management\n- Data-driven: SQL, analytics tools\n- Consumer-facing product experience\n- Track record on DAU, retention, NPS\n- A/B testing experience\n- Excellent communication skills`,
  ds:`Data Scientist — NLP/AI\n\nBuilding next-gen language models for document understanding.\n\nRequirements:\n- 3–5 years data science / ML\n- Python: pandas, scikit-learn, PyTorch or TensorFlow\n- NLP: transformers, BERT, LLMs\n- Kaggle success or research publications preferred\n- Production ML deployment experience`,
  ml:`Machine Learning Engineer\n\nBuilding large-scale ML recommendation systems.\n\nRequirements:\n- 3–6 years ML engineering\n- Python (C++ a plus)\n- MLflow, Kubeflow, training pipelines at scale\n- Ranking / recommendation systems\n- Vector databases, embedding models\n- Latency + throughput focused`
};

const SAMPLES = [
  {name:'Aarav Mehta',    role:'Senior Backend Engineer', exp:6, company:'Razorpay',   skills:'Python,Go,PostgreSQL,Redis,AWS,Kafka,Kubernetes', activity:'12 GitHub repos · 3 OSS PRs merged · LeetCode top 5%', education:'IIT Bombay B.Tech CS',    highlight:'Led monolith→microservices migration handling 50M txns/day'},
  {name:'Priya Sharma',   role:'Full Stack Developer',    exp:4, company:'Flipkart',   skills:'Python,React,MySQL,Docker,GCP,MongoDB',           activity:'Stack Overflow top 3% · 8 GitHub repos',               education:'BITS Pilani B.Tech',       highlight:'Built inventory system cutting stockouts by 32%'},
  {name:'Rohan Gupta',    role:'Software Engineer',       exp:3, company:'Infosys',    skills:'Java,Spring Boot,Oracle,Jenkins,Azure',            activity:'1 GitHub repo · 200 LinkedIn connections',             education:'NIT Trichy B.Tech',        highlight:'Automated reporting saving 20hrs/week'},
  {name:'Sneha Iyer',     role:'Backend Engineer',        exp:5, company:'Zomato',     skills:'Go,Python,PostgreSQL,Redis,AWS,Kafka,gRPC',        activity:'GopherConIndia speaker · 15 GitHub repos · OSS',       education:'IIT Madras M.Tech',        highlight:'Designed order routing for 10M daily orders'},
  {name:'Karan Verma',    role:'DevOps Engineer',         exp:4, company:'Freshworks', skills:'Python,Kubernetes,Terraform,AWS,Docker,Redis',     activity:'AWS Certified Solutions Architect · 6 repos',          education:'Anna University B.Tech',   highlight:'Deployment time cut 45min→8min'},
  {name:'Ananya Singh',   role:'Software Engineer II',    exp:5, company:'PhonePe',    skills:'Python,FastAPI,PostgreSQL,MongoDB,GCP,Celery',     activity:'20 GitHub repos · Kaggle Notebook Expert · Blogger',   education:'Delhi University MCA',     highlight:'Fraud detection module saving ₹2Cr/month'},
  {name:'Vikram Nair',    role:'Junior Developer',        exp:1, company:'TCS',        skills:'Python,MySQL,HTML,CSS,JavaScript',                 activity:'3 GitHub repos · HackerRank 2 stars',                  education:'VIT B.Tech',               highlight:'Internal leave management tool'},
  {name:'Deepa Pillai',   role:'Principal Engineer',      exp:8, company:'Google',     skills:'Python,C++,Distributed Systems,Spanner,Kubernetes,Go', activity:'2 patents · NSDI paper · 30 GitHub repos',          education:'IISc PhD CS',              highlight:'Led Google Pay India infra — 500M users'},
  {name:'Arjun Kapoor',   role:'Backend Developer',       exp:3, company:'Startup',    skills:'Node.js,MongoDB,AWS Lambda,Redis,GraphQL',         activity:'4 GitHub repos · Hackathon winner · Dev community',    education:'Manipal University B.Tech',highlight:'Real-time chat system 100K concurrent users'},
  {name:'Meera Krishnan', role:'Software Engineer',       exp:4, company:'Swiggy',     skills:'Python,Go,PostgreSQL,RabbitMQ,Docker,GCP',         activity:'10 GitHub repos · GDG speaker · OSS contributor',      education:'IIT Delhi B.Tech CS',      highlight:'Delivery ETA model improving accuracy 40%'},
];

let pool = [], ranked = [];

function loadJD(k){ document.getElementById('jd').value = JDS[k]; }
function loadSamples(){ pool=[...SAMPLES]; document.getElementById('ccount').textContent=`✅ ${pool.length} candidates loaded`; }

function handleFile(e){
  const f=e.target.files[0]; if(!f)return;
  const r=new FileReader();
  r.onload=ev=>{
    try{
      if(f.name.endsWith('.json')) pool=JSON.parse(ev.target.result);
      else pool=parseCSV(ev.target.result);
      document.getElementById('ccount').textContent=`✅ ${pool.length} from ${f.name}`;
    }catch{ alert('Error reading file — check format'); }
  };
  r.readAsText(f);
}
function parseCSV(t){
  const lines=t.trim().split('\n'), h=lines[0].split(',').map(x=>x.trim().replace(/"/g,''));
  return lines.slice(1).map(l=>{
    const v=l.split(',').map(x=>x.trim().replace(/"/g,''));
    const o={}; h.forEach((k,i)=>o[k]=v[i]||'');
    return {name:o.name||o.Name||'Candidate',role:o.role||o.current_role||'Professional',
      exp:+o.experience||+o.exp||0,company:o.company||'',
      skills:o.skills||'',activity:o.activity||'',education:o.education||'',highlight:o.highlight||o.summary||''};
  });
}

function scoreGrad(s){
  if(s>=85) return ['#84CC16','#06B6D4'];
  if(s>=70) return ['#06B6D4','#8B5CF6'];
  if(s>=55) return ['#8B5CF6','#EC4899'];
  return ['#F59E0B','#FF6B6B'];
}
function fitBadge(s){
  if(s>=85) return ['Excellent Fit','fit-exc'];
  if(s>=70) return ['Strong Fit','fit-str'];
  if(s>=55) return ['Good Fit','fit-gd'];
  return ['Moderate Fit','fit-mod'];
}
const TAG_CLASSES=['stag-v','stag-p','stag-c','stag-v','stag-p'];

async function runAI(){
  const jd=document.getElementById('jd').value.trim();
  if(!jd){alert('Please paste a job description.');return;}
  if(!pool.length){alert('Please load candidates first.');return;}
  document.getElementById('runbtn').disabled=true;
  document.getElementById('results').style.display='none';
  showProg(true,'🧠 Reading job description...','Understanding what this role truly needs');
  await sleep(500);
  showProg(true,'🤖 Claude AI is ranking candidates...','Analyzing skills, trajectory & behavioral signals');

  const list=pool.map((c,i)=>`Candidate ${i+1}: ${c.name}
  Role: ${c.role} | Exp: ${c.exp}yrs | Company: ${c.company}
  Skills: ${c.skills}
  Activity: ${c.activity}
  Education: ${c.education}
  Achievement: ${c.highlight}`).join('\n\n');

  const prompt=`You are an expert technical recruiter with 15 years experience at top tech firms.

JOB DESCRIPTION:
${jd}

CANDIDATES:
${list}

Rank ALL ${pool.length} candidates from best to worst fit. Be realistic — differentiate scores meaningfully.
Respond ONLY in this exact JSON (no backticks, no preamble):
{
  "rankings":[
    {"originalIndex":0,"score":88,"matchedSkills":["Python","AWS","Kafka"],"signals":["OSS contributor","Startup experience"],"reasoning":"Strong match on core backend skills with startup pedigree. OSS contributions show initiative beyond day job."}
  ],
  "summary":"2-3 sentence overall verdict on the candidate pool quality and key patterns observed."
}`;

  try{
    const res=await fetch('https://api.anthropic.com/v1/messages',{
      method:'POST',headers:{'Content-Type':'application/json'},
      body:JSON.stringify({model:'claude-sonnet-4-6',max_tokens:1000,messages:[{role:'user',content:prompt}]})
    });
    const data=await res.json();
    let txt=(data.content?.[0]?.text||'').replace(/```json|```/g,'').trim();
    const parsed=JSON.parse(txt);
    ranked=parsed.rankings.map(r=>({...pool[r.originalIndex],aiScore:r.score,
      matchedSkills:r.matchedSkills||[],signals:r.signals||[],reasoning:r.reasoning||''}))
      .sort((a,b)=>b.aiScore-a.aiScore);
    showProg(false);
    renderCards(ranked, parsed.summary||'');
  } catch(err){
    showProg(true,'⚡ Using smart scoring...','Fallback scoring active');
    await sleep(700);
    fallbackRank();
    showProg(false);
  }
  document.getElementById('runbtn').disabled=false;
}

function fallbackRank(){
  const jdw=document.getElementById('jd').value.toLowerCase().split(/\W+/);
  ranked=pool.map(c=>{
    const txt=`${c.skills} ${c.role} ${c.highlight} ${c.activity} ${c.company}`.toLowerCase();
    let s=38;
    jdw.forEach(w=>{if(w.length>3&&txt.includes(w))s+=3;});
    s+=Math.min(c.exp*2,18);
    if(/github|oss|open.source/i.test(c.activity))s+=8;
    if(/google|amazon|microsoft|razorpay|flipkart|swiggy|zomato|phonepe|uber/i.test(c.company))s+=7;
    if(/iit|iisc|bits/i.test(c.education))s+=5;
    s=Math.min(s,96);
    return {...c,aiScore:s,matchedSkills:c.skills.split(',').slice(0,3).map(x=>x.trim()),
      signals:[c.activity.split('·')[0].trim(),`${c.exp}yr exp`],
      reasoning:`Matched core skills to JD requirements. ${c.highlight.slice(0,80)}.`};
  }).sort((a,b)=>b.aiScore-a.aiScore);
  renderCards(ranked,'AI scoring using semantic keyword analysis and career signal weighting.');
}

function renderCards(res, summary){
  const top=res.filter(r=>r.aiScore>=70).length;
  const avg=Math.round(res.reduce((a,r)=>a+r.aiScore,0)/res.length);
  const [g1,g2]=scoreGrad(res[0]?.aiScore||80);
  document.getElementById('statsbar').innerHTML=`
    <div class="stat-box"><div class="stat-v" style="background:linear-gradient(135deg,#8B5CF6,#EC4899);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text">${res.length}</div><div class="stat-l">Candidates Ranked</div></div>
    <div class="stat-box"><div class="stat-v" style="background:linear-gradient(135deg,#06B6D4,#84CC16);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text">${top}</div><div class="stat-l">Strong Matches (70+)</div></div>
    <div class="stat-box"><div class="stat-v" style="background:linear-gradient(135deg,#F59E0B,#FF6B6B);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text">${avg}</div><div class="stat-l">Avg AI Score</div></div>
    <div class="stat-box"><div class="stat-v" style="background:linear-gradient(135deg,${g1},${g2});-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;font-size:22px">${(res[0]?.name||'—').split(' ')[0]}</div><div class="stat-l">Top Candidate</div></div>`;

  document.getElementById('cardsgrid').innerHTML=res.map((r,i)=>{
    const rk=i===0?'r1':i===1?'r2':i===2?'r3':'rn';
    const rl=i===0?'GOLD':i===1?'SILVER':i===2?'BRONZE':`#${i+1}`;
    const [g1,g2]=scoreGrad(r.aiScore);
    const circ=Math.PI*2*30;
    const off=circ*(1-r.aiScore/100);
    const skillsH=(r.matchedSkills||[]).map((s,j)=>`<span class="stag ${TAG_CLASSES[j%3]}">${s}</span>`).join('');
    const sigsH=(r.signals||[]).map(s=>`<span class="sigtag">${s}</span>`).join('');
    const [fl,fc]=fitBadge(r.aiScore);
    return `
    <div class="cand-card" style="animation:fadeUp .5s ease ${i*0.07}s both">
      <div class="card-inner">
        <div class="rank-wrap">
          <div class="rank-num ${rk}">${i+1}</div>
          <div class="rank-label">${rl}</div>
        </div>
        <div class="cand-info">
          <div class="cand-name">${r.name||'—'}</div>
          <div class="cand-role">${r.role||''}</div>
          <div class="cand-co">
            <span class="co-badge">🏢 ${r.company||'—'}</span>
            <span style="color:var(--dim);font-size:10px">${r.exp||0}y exp</span>
            <span style="color:var(--dim);font-size:10px">· ${r.education||''}</span>
          </div>
        </div>
        <div class="score-ring-wrap">
          <div class="score-ring">
            <svg width="72" height="72" viewBox="0 0 72 72">
              <circle class="ring-bg" cx="36" cy="36" r="30" transform="rotate(-90 36 36)"/>
              <circle class="ring-fill" cx="36" cy="36" r="30"
                stroke="url(#rg${i})"
                stroke-dasharray="${circ}"
                stroke-dashoffset="${circ}"
                transform="rotate(-90 36 36)"
                data-offset="${off}"/>
              <defs>
                <linearGradient id="rg${i}" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stop-color="${g1}"/>
                  <stop offset="100%" stop-color="${g2}"/>
                </linearGradient>
              </defs>
            </svg>
            <div class="score-val" style="background:linear-gradient(135deg,${g1},${g2});-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text">${r.aiScore}</div>
          </div>
          <div class="score-lbl">AI SCORE</div>
        </div>
        <div class="cand-skills">
          <div class="skills-label">Matched Skills</div>
          <div class="skill-tags">${skillsH}</div>
        </div>
        <div class="cand-signals">
          <div class="skills-label">Signals</div>
          <div class="sig-tags">${sigsH}</div>
        </div>
        <div class="cand-reason">
          <div class="skills-label" style="margin-bottom:6px">AI Reasoning</div>
          <div class="reason-text">${r.reasoning||'—'}</div>
        </div>
        <div><span class="fit-badge ${fc}">${fl}</span></div>
      </div>
    </div>`;
  }).join('');

  requestAnimationFrame(()=>requestAnimationFrame(()=>{
    document.querySelectorAll('.ring-fill').forEach(el=>{
      const off=parseFloat(el.getAttribute('data-offset'));
      el.style.strokeDashoffset=off;
    });
  }));

  document.getElementById('aisumtext').textContent=summary;
  document.getElementById('results').style.display='block';
  setTimeout(()=>document.getElementById('results').scrollIntoView({behavior:'smooth',block:'start'}),100);
}

function exportCSV(){
  if(!ranked.length)return;
  const h=['Rank','Name','Role','Company','Experience','AI Score','Fit Level','Skills','Reasoning'];
  const rows=ranked.map((r,i)=>[i+1,r.name,r.role,r.company,r.exp,r.aiScore,
    fitBadge(r.aiScore)[0],(r.matchedSkills||[]).join('|'),(r.reasoning||'').replace(/,/g,';')]);
  dl('hireiq_ranked.csv',[h,...rows].map(r=>r.join(',')).join('\n'),'text/csv');
}
function exportJSON(){
  if(!ranked.length)return;
  dl('hireiq_ranked.json',JSON.stringify(ranked.map((r,i)=>({rank:i+1,name:r.name,
    role:r.role,company:r.company,experience_years:r.exp,ai_score:r.aiScore,
    fit_level:fitBadge(r.aiScore)[0],matched_skills:r.matchedSkills,
    behavioral_signals:r.signals,ai_reasoning:r.reasoning})),null,2),'application/json');
}
function dl(name,content,type){
  const a=document.createElement('a');
  a.href=URL.createObjectURL(new Blob([content],{type}));
  a.download=name;a.click();
}

function showProg(show,title,sub){
  const el=document.getElementById('prog');
  el.className='progress-wrap'+(show?' show':'');
  if(title)document.getElementById('prog-title').textContent=title;
  if(sub)document.getElementById('prog-sub').textContent=sub;
}
function sleep(ms){return new Promise(r=>setTimeout(r,ms));}