const ctx = document.getElementById('myChart')
  .getContext('2d');

setTimeout(() => {
  $.get('http://localhost:3000/happinessData', (happinessData) => {
    const chartedHappinessData = happinessData
    .filter(happinessDatum => happinessDatum.value >= 1 && happinessDatum.value <= 10)
    .map(happinessDatum => ({
      x: happinessDatum.timestamp,
      y: happinessDatum.value,
    }));

    console.log('chartedHappinessData', chartedHappinessData);

    const myChart = new Chart(ctx, {
      type: 'line',
      data: {
        datasets: [{
          data: chartedHappinessData,
          backgroundColor: 'rgba(75, 192, 192, 0.2)',
          borderColor: 'rgba(75, 192, 192, 1)',
          borderWidth: 1
        }]
      },
      options: {
        legend: {
          display: false
        },
        scales: {
          yAxes: [{
            ticks: {
              beginAtZero: true
            }
          }],
          xAxes: [{
            type: 'time'
          }]
        }
      }
    });

    console.log('Chart created:', myChart);
  })
  .fail((error) => {
    console.error('Unable to get happiness data', error);
  });
}, 0);
