const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

window.onload = function(){

const expenseCtx = document.getElementById("expenseChart").getContext("2d");

new Chart(expenseCtx, {
    type: "bar",
    data: {
        labels: months,
        datasets: [{
            label: "Test Data",
            data: [10,20,30,40,50,60,70,80,90,100,110,120]
        }]
    },
    options: {
        responsive: true,
        maintainAspectRatio: false
    }
});

};
