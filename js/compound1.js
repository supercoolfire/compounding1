let balanceChart; // Chart.js instance

const COMPOUNDS_PER_DAY = 3;
const INCREASE_RATE = 0.01;
const msPerDay = 1000 * 60 * 60 * 24;
let withdrawals = []; // {id, date:'YYYY-MM-DD', amount:number}

let usdToPhp = 0;
const WITHDRAWAL_FEE_RATE = 0.20; // 20% fee on withdrawal amount

// ---- Core calc constants & helpers ----

function formatDateISO(d) {
  return new Date(d).toISOString().slice(0, 10);
}
function fmtMoney(n) {
  return n.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}
function compoundOnePeriod(a) {
  const inc = a * INCREASE_RATE;
  return a + Math.round(inc * 10) / 10; // rounding like before
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

async function renderWithdrawals() {
  const list = document.getElementById("withdrawalsList");
  if (!list) return;

  // If no withdrawals, render empty message and hide chart
  if (withdrawals.length === 0) {
    list.innerHTML = '<li class="list-group-item text-muted">No withdrawals</li>';
    updateBalanceChart(); // keep chart state consistent
    return;
  }

  // Ensure we have an exchange rate. Try to fetch if we don't.
  if (!usdToPhp) {
    try {
      const resp = await fetch("https://open.er-api.com/v6/latest/USD");
      const data = await resp.json();
      if (data && data.rates && data.rates.PHP) {
        usdToPhp = data.rates.PHP;
      } else {
        usdToPhp = null;
      }
    } catch (err) {
      // network or API error -> keep usdToPhp null and continue (we'll show '—' for PHP)
      console.warn("Failed to fetch USD→PHP rate:", err);
      usdToPhp = null;
    }
  }

  // Build the list HTML
  const html = withdrawals
    .sort((a, b) => new Date(a.date) - new Date(b.date))
    .map(w => {
      const grossUsd = Number(w.amount) || 0;
      const takeHomeUsd = parseFloat((grossUsd * (1 - WITHDRAWAL_FEE_RATE)).toFixed(2));

      const grossPhp = usdToPhp ? fmtMoney(grossUsd * usdToPhp) : "—";
      const takeHomePhp = usdToPhp ? fmtMoney(takeHomeUsd * usdToPhp) : "—";

      return `
        <li class="list-group-item d-flex justify-content-between align-items-center">
          <div>
            <strong>$${fmtMoney(grossUsd)}</strong>
            ${ usdToPhp ? `₱${grossPhp}` : "" }
            <span class="text-muted"> (-${Math.round(WITHDRAWAL_FEE_RATE*100)}% Take home: </span>
            <strong>$${fmtMoney(takeHomeUsd)}</strong>
            ${ usdToPhp ? `<span class="text-muted"> ₱${takeHomePhp}</span>` : "" }
            <span class="text-muted">)</span>
            <spa><small class="text-muted">${w.date}</small></spa>
          </div>
          <div>
            <button class="btn btn-sm btn-warning me-2" onclick="editWithdrawal(${w.id})">Edit</button>
            <button class="btn btn-sm btn-danger" onclick="deleteWithdrawal(${w.id})">Delete</button>
          </div>
        </li>
      `;
    })
    .join("");

  list.innerHTML = html;

  // Update chart as before
  updateBalanceChart();
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
function deleteWithdrawal(id){
  withdrawals=withdrawals.filter(w=>w.id!==id);
  renderWithdrawals();
}

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
    const next=sorted[idx]?new Date(sorted[idx].date):null;
    if(next && next<=cur){ a=Math.max(0,a-sorted[idx].amount); idx++; continue; }
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

  let peso = usdToPhp ? " ₱" + fmtMoney(final * usdToPhp) : "";
  document.getElementById('finalResult').textContent=
    `Final amount after ${days} days: $${fmtMoney(final)}${peso}`;

  document.getElementById('finalResult').classList.remove('d-none');
  document.getElementById('endDate').value=formatDateISO(end);
  updateBalanceChart();
}

function calculateDaysToTarget(){
  const amount=parseFloat(document.getElementById('startAmount').value);
  const target=parseFloat(document.getElementById('targetAmount').value);
  const start=new Date(document.getElementById('startDate').value);
  if(isNaN(amount)||isNaN(target)||isNaN(start))return alert('Enter valid inputs');

  const r=growToTarget(amount,start,target);

  let peso = usdToPhp ? " ₱" + fmtMoney(target * usdToPhp) : "";
  document.getElementById('days').value=r.days;
  document.getElementById('endDate').value=formatDateISO(r.end);
  document.getElementById('targetResult').textContent=
    `It will take about ${r.days} days to reach $${fmtMoney(target)}${peso} (until ${r.end.toDateString()}).`;

  document.getElementById('targetResult').classList.remove('d-none');
  updateBalanceChart();
}

// ---- Date link helpers ----
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

// ---- Chart for withdrawals ----
function updateBalanceChart() {
  const container = document.getElementById("balanceChartContainer");
  if (!container) return;

  container.classList.remove("d-none");

  let startAmount = parseFloat(document.getElementById("startAmount").value);
  if (isNaN(startAmount)) startAmount = 300;

  const startDate = new Date(document.getElementById("startDate").value);
  const endDateInput = document.getElementById("endDate").value;
  const finalDate = endDateInput ? new Date(endDateInput) : new Date(startDate.getTime() + 30 * 24 * 60 * 60 * 1000);

  const msPerDay = 1000 * 60 * 60 * 24;
  const normalize = d => new Date(d.getFullYear(), d.getMonth(), d.getDate());
  const lastDayOfMonth = d => new Date(d.getFullYear(), d.getMonth() + 1, 0);

  const sortedWDs = [...withdrawals].sort((a, b) => new Date(a.date) - new Date(b.date));
  let checkpoints = sortedWDs.map(w => normalize(new Date(w.date)));

  // --- Add month-end checkpoints only if no withdrawal in that month ---
  if (checkpoints.length > 0) {
    const first = checkpoints[0];
    const last = checkpoints[checkpoints.length - 1];
    let monthCursor = new Date(first.getFullYear(), first.getMonth(), 1);

    while (monthCursor <= last) {
      const monthEnd = normalize(lastDayOfMonth(monthCursor));
      const hasWDInMonth = sortedWDs.some(w => {
        const d = new Date(w.date);
        return d.getFullYear() === monthCursor.getFullYear() && d.getMonth() === monthCursor.getMonth();
      });

      if (!checkpoints.some(d => d.getTime() === monthEnd.getTime()) && !hasWDInMonth) {
        checkpoints.push(monthEnd);
      }

      monthCursor.setMonth(monthCursor.getMonth() + 1);
    }
  }

  // Add final date as checkpoint
  checkpoints.push(normalize(finalDate));
  checkpoints = checkpoints.sort((a, b) => a - b);

  // --- Calculate balances and withdrawn ---
  let curAmount = startAmount;
  let curDate = normalize(startDate);
  const labels = [], remainingData = [], withdrawnData = [], remainingColors = [];

  for (let chk of checkpoints) {
    const daysDiff = Math.ceil((chk - curDate) / msPerDay);
    for (let i = 0; i < daysDiff; i++) curAmount = compoundOneDay(curAmount);

    // Withdrawal if any
    const wd = sortedWDs.find(w => normalize(new Date(w.date)).getTime() === chk.getTime());
    let wdAmount = 0;
    if (wd) {
      wdAmount = wd.amount;
      curAmount = Math.max(0, curAmount - wdAmount);
    }

    // Skip month-end checkpoint if it’s zero and a withdrawal exists in same month
    const isMonthEnd = chk.getDate() === lastDayOfMonth(chk).getDate();
    const hasWDInMonth = sortedWDs.some(w => {
      const d = new Date(w.date);
      return d.getFullYear() === chk.getFullYear() && d.getMonth() === chk.getMonth();
    });
    if (isMonthEnd && wdAmount === 0 && hasWDInMonth) continue;

    labels.push(`${formatDateISO(chk)}${wdAmount > 0 ? ` (WD $${fmtMoney(wdAmount)})` : ""}`);
    withdrawnData.push(wdAmount);
    remainingData.push(curAmount.toFixed(2));
    remainingColors.push(!wd && chk.getTime() === normalize(finalDate).getTime() ? "#87CEFA" : "#0d6efd");

    curDate = new Date(chk.getTime() + msPerDay);
  }

  if (balanceChart) balanceChart.destroy();
  const ctx = document.getElementById("balanceChart").getContext("2d");
  balanceChart = new Chart(ctx, {
    type: "bar",
    data: {
      labels,
      datasets: [
        { label: "Remaining Balance", data: remainingData, backgroundColor: remainingColors, stack: 'stack1' },
        { label: "Withdrawn", data: withdrawnData, backgroundColor: "#dc3545", stack: 'stack1' }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        x: { stacked: true, ticks: { font: { size: 10 } }, barThickness: 16 },
        y: { stacked: true, beginAtZero: true, title: { display: true, text: "Amount ($)" } }
      },
      plugins: {
        legend: { position: 'bottom' },
        tooltip: {
          callbacks: {
            label: function(ctx) {
              return ctx.dataset.label + ': $' + fmtMoney(ctx.parsed.y);
            }
          }
        }
      }
    }
  });
}

// ---- Fetch USD to PHP rate ----
async function fetchUsdToPhp() {
  try {
    const res = await fetch("https://open.er-api.com/v6/latest/USD");
    const data = await res.json();
    usdToPhp = data.rates.PHP;
  } catch (e) {
    console.error("Failed to fetch exchange rate", e);
    usdToPhp = 0;
  }
}


// ---- init ----
window.onload= async () =>{
  const t=new Date(), ts=formatDateISO(t);
  document.getElementById('startDate').value=ts;
  await fetchUsdToPhp();
  renderWithdrawals();
};
