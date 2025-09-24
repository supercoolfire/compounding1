function drawChart(balanceTimeline) {
    const ctx = document.getElementById("balanceChart").getContext("2d");
    
    // Destroy old chart if exists
    if (balanceChart) balanceChart.destroy();
  
    balanceChart = new Chart(ctx, {
      type: "bar",
      data: {
        labels: balanceTimeline.map(item => item.date),
        datasets: [
          {
            label: "Balance",
            data: balanceTimeline.map(item => item.amount),
            backgroundColor: balanceTimeline.map(item => item.withdrawal ? "#dc3545" : "#0d6efd") // red if withdrawal day
          }
        ]
      },
      options: {
        scales: {
          x: { title: { display: true, text: "Date" } },
          y: { title: { display: true, text: "Balance ($)" }, beginAtZero: true }
        }
      }
    });
  }
  