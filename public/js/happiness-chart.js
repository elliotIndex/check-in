const ctx = document.getElementById('myChart')
  .getContext('2d');

// Place request on event loop so we have access to jQuery
setTimeout(() => {
  $.get('http://localhost:3000/happinessData', (happinessData) => {
    const commentMap = {};
    const chartedHappinessData = happinessData
      .map((happinessDatum) => {
        commentMap[happinessDatum.timestamp] = happinessDatum.comment;
        return happinessDatum;
      })
      .filter(happinessDatum => happinessDatum.value >= 1 && happinessDatum.value <= 10)
      .map(happinessDatum => ({
        x: happinessDatum.timestamp,
        y: happinessDatum.value,
        tooltip: 'hi'
      }));

    new Chart(ctx, {
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
              beginAtZero: true,
              max: 10
            }
          }],
          xAxes: [{
            type: 'time'
          }]
        },
        tooltips: {
          callbacks: {
            title: tooltipItem => moment(tooltipItem.xLabel).format('MMMM D, h:mm a'),
            label: tooltipItem => commentMap[tooltipItem.xLabel],
          }
        }
      }
    });
  })
  .fail((error) => {
    console.error('Unable to get happiness data', error);
  });
}, 0);
