// compound1.js — withdrawal-aware

const COMPOUNDS_PER_DAY = 3;
const INCREASE_RATE = 0.01;
const msPerDay = 1000 * 60 * 60 * 24;
let withdrawals = []; // {id, date:'YYYY-MM-DD', amount:number}

function formatDateISO(d) {
  return new Date(d).toISOString().slice(0, 10);
}
function fmtMoney(n) {
  return n.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}
function compoundOnePeriod(a) {
  const inc = a * INCREASE_RATE;
  return a + Math.round(inc * 10) / 10; // same rounding
}
function compoundOneDay(a) {
  for (let i = 0; i < COMPOUNDS_PER_DAY; i++) a = compoundOnePeriod(a);
  return a;
}

// ---- Withdrawal UI helpers ----
function addWithdrawal() {
  const d = document.getElementById("withdrawDate").value;
  const a = parseFloat(document.getElementById("withdrawAmount").value);
  if (!d || isNaN(a) || a <= 0) { alert("Enter valid date & amount"); return; }
  withdrawals.push({ id: Date.now(), date: formatDateISO(d), amount: parseFloat(a.toFixed(2)) });
  withdrawals.sort((x, y) => new Date(x.date) - new Date(y.date));
  renderWithdrawals();
}
function renderWithdrawals() {
  const list = document.getElementById("withdrawalsList");
  if (!list) return;
  if (withdrawals.length === 0) { list.innerHTML = '<li class="list-group-item text-muted">No withdrawals</li>'; return; }
  list.innerHTML = withdrawals.map(w=>`
    <li class="list-group-item d-flex justify-content-between align-items-center">
      <div><strong>$${fmtMoney(w.amount)}</strong> <small class="text-muted">${w.date}</small></div>
      <div>
        <button class="btn btn-sm btn-warning me-2" onclick="editWithdrawal(${w.id})">Edit</button>
        <button class="btn btn-sm btn-danger" onclick="deleteWithdrawal(${w.id})">Delete</button>
      </div>
    </li>`).join('');
}
function editWithdrawal(id){
  const i=withdrawals.findIndex(w=>w.id===id);
  if(i<0)return;
  const a=prompt("Edit amount",withdrawals[i].amount); if(a===null)return;
  const n=parseFloat(a); if(isNaN(n)||n<=0){alert("Invalid");return;}
  const d=prompt("Edit date YYYY-MM-DD",withdrawals[i].date); if(d===null)return;
  if(isNaN(new Date(d))) {alert("Invalid date");return;}
  withdrawals[i].amount=parseFloat(n.toFixed(2)); withdrawals[i].date=formatDateISO(d);
  withdrawals.sort((x, y) => new Date(x.date) - new Date(y.date));
  renderWithdrawals();
}
function deleteWithdrawal(id){withdrawals=withdrawals.filter(w=>w.id!==id);renderWithdrawals();}

// ---- Core calc helpers ----
function applyWithdrawalsForDays(amount,startDate,days){
  const end=new Date(startDate); end.setDate(end.getDate()+days);
  const relevant = withdrawals.filter(w=> new Date(w.date)>=startDate && new Date(w.date)<end)
                              .sort((a,b)=>new Date(a.date)-new Date(b.date));
  let usedDays=0; let a=amount; let cur=new Date(startDate);
  for(const wd of relevant){
    const diff = Math.max(0, Math.ceil((new Date(wd.date)-cur)/msPerDay));
    for(let d=0; d<diff; d++){a=compoundOneDay(a);usedDays++;}
    a = Math.max(0,a - wd.amount);
    cur = new Date(wd.date); cur.setDate(cur.getDate()+1);
  }
  const remain=days-usedDays;
  for(let d=0; d<remain; d++){a=compoundOneDay(a);}
  return a;
}

function growToTarget(amount,startDate,target){
  let a=amount,days=0,cur=new Date(startDate);
  const sorted=[...withdrawals].sort((x,y)=>new Date(x.date)-new Date(y.date));
  let idx=0;
  while(a<target){
    // check next withdrawal date
    const next=sorted[idx]?new Date(sorted[idx].date):null;
    if(next && next<=cur){ // apply immediate withdraw if same day
      a=Math.max(0,a-sorted[idx].amount); idx++; continue;
    }
    a=compoundOneDay(a); days++;
    cur.setDate(cur.getDate()+1);
    if(next && cur>next){ a=Math.max(0,a-sorted[idx].amount); idx++; }
    if(days>1000000)break;
  }
  return {amount:a,days,end:cur};
}

// ---- User actions ----
function calculateInvestment(){
  const amount=parseFloat(document.getElementById('startAmount').value);
  const days=parseInt(document.getElementById('days').value);
  const start=new Date(document.getElementById('startDate').value);
  if(isNaN(amount)||isNaN(days)||isNaN(start))return alert('Enter valid inputs');
  const final=applyWithdrawalsForDays(amount,start,days);
  const end=new Date(start); end.setDate(start.getDate()+days);
  document.getElementById('finalResult').textContent=`Final amount after ${days} days: $${fmtMoney(final)}`;
  document.getElementById('finalResult').classList.remove('d-none');
  document.getElementById('endDate').value=formatDateISO(end);
}

function calculateDaysToTarget(){
  const amount=parseFloat(document.getElementById('startAmount').value);
  const target=parseFloat(document.getElementById('targetAmount').value);
  const start=new Date(document.getElementById('startDate').value);
  if(isNaN(amount)||isNaN(target)||isNaN(start))return alert('Enter valid inputs');
  const r=growToTarget(amount,start,target);
  document.getElementById('days').value=r.days;
  document.getElementById('endDate').value=formatDateISO(r.end);
  document.getElementById('targetResult').textContent=`It will take about ${r.days} days to reach $${fmtMoney(target)} (until ${r.end.toDateString()}).`;
  document.getElementById('targetResult').classList.remove('d-none');
}

// date link helpers stay same
function updateEndDateFromDays(){
  const s=new Date(document.getElementById('startDate').value);
  const d=parseInt(document.getElementById('days').value||0);
  if(!isNaN(d)){s.setDate(s.getDate()+d);document.getElementById('endDate').value=formatDateISO(s);}
}
function updateDaysFromEndDate(){
  const s=new Date(document.getElementById('startDate').value);
  const e=new Date(document.getElementById('endDate').value);
  if(!isNaN(e))document.getElementById('days').value=Math.ceil((e-s)/msPerDay);
}

// init start date today
window.onload=()=>{
  const t=new Date(), ts=formatDateISO(t);
  document.getElementById('startDate').value=ts;
  renderWithdrawals();
};
