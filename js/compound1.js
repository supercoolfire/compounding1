    const COMPOUNDS_PER_DAY = 3;
    const INCREASE_RATE = 0.01;

    function calculateInvestment() {
      let amount = parseFloat(document.getElementById('startAmount').value);
      let days = parseInt(document.getElementById('days').value);

      for (let i = 0; i < days; i++) {
        for (let j = 0; j < COMPOUNDS_PER_DAY; j++) {
          let increase = amount * INCREASE_RATE;
          let roundedIncrease = Math.round(increase * 10) / 10; // round to nearest tenth
          amount += roundedIncrease;
        }
      }
      const result = document.getElementById('finalResult');
      result.textContent = `Final amount after ${days} days: $${amount.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}`;
      result.classList.remove('d-none');
    }

    function calculateDaysToTarget() {
      let amount = parseFloat(document.getElementById('startAmount').value);
      const target = parseFloat(document.getElementById('targetAmount').value);
      let days = 0;

      while (amount < target) {
        days++;
        for (let j = 0; j < COMPOUNDS_PER_DAY; j++) {
          let increase = amount * INCREASE_RATE;
          let roundedIncrease = Math.round(increase * 10) / 10;
          amount += roundedIncrease;
        }
      }

      const startDate = new Date(document.getElementById('startDate').value);
      const endDate = new Date(startDate);
      endDate.setDate(startDate.getDate() + days);

      document.getElementById('endDate').value = endDate.toISOString().slice(0, 10);
      document.getElementById('days').value = days;


      const result = document.getElementById('targetResult');
      result.textContent = `It will take about ${days} days to reach $${target.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})} (until ${endDate.toDateString()}).`;
      result.classList.remove('d-none');
    }
    function updateEndDateFromDays() {
      const startDate = new Date(document.getElementById('startDate').value);
      const days = parseInt(document.getElementById('days').value || 0);
      if (!isNaN(days)) {
        const newEndDate = new Date(startDate);
        newEndDate.setDate(startDate.getDate() + days);
        document.getElementById('endDate').value = newEndDate.toISOString().slice(0, 10);
      }
    }

    function updateDaysFromEndDate() {
      const startDate = new Date(document.getElementById('startDate').value);
      const endDate = new Date(document.getElementById('endDate').value);
      if (!isNaN(endDate.getTime())) {
        const diffTime = endDate - startDate;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        document.getElementById('days').value = diffDays;
      }
    }

    // Initialize start date to today
    window.onload = function() {
      const today = new Date();
      const todayStr = today.toISOString().slice(0, 10);
      document.getElementById('startDate').value = todayStr;

      const days = parseInt(document.getElementById('days').value);
      const end = new Date(today);
      end.setDate(today.getDate() + days);
      document.getElementById('endDate').value = end.toISOString().slice(0, 10);
    }
