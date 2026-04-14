function calculateMetrics(processes, ganttData) {

    let result = {};

    // Initialize
    processes.forEach(p => {
        result[p.pid] = {
            AT: p.arrivalTime,
            BT: p.burstTime,
            CT: 0,
            TAT: 0,
            WT: 0,
            RT: -1
        };
    });

    // Traverse Gantt chart
    ganttData.forEach(block => {

        const pid = block.process;

        // Set Completion Time (latest occurrence wins)
        result[pid].CT = block.end;

        // Set Response Time (first occurrence only)
        if (result[pid].RT === -1) {
            result[pid].RT = block.start - result[pid].AT;
        }
    });

    // Calculate TAT & WT
    for (let pid in result) {
        result[pid].TAT = result[pid].CT - result[pid].AT;
        result[pid].WT = result[pid].TAT - result[pid].BT;
    }

    return result;
}

function displayResults(result) {

    const tbody = document.querySelector("#result-table tbody");
    tbody.innerHTML = "";

    let totalWT = 0;
    let totalTAT = 0;
    let count = 0;

    for (let pid in result) {

        const p = result[pid];

        const row = document.createElement("tr");

        row.innerHTML = `
            <td>${pid}</td>
            <td>${p.AT}</td>
            <td>${p.BT}</td>
            <td>${p.CT}</td>
            <td>${p.TAT}</td>
            <td>${p.WT}</td>
            <td>${p.RT}</td>
        `;

        tbody.appendChild(row);

        totalWT += p.WT;
        totalTAT += p.TAT;
        count++;
    }

    // Show averages
    document.getElementById("avg-wt").innerText = (totalWT / count).toFixed(2);
    document.getElementById("avg-tat").innerText = (totalTAT / count).toFixed(2);

    // Show table section
    document.getElementById("result-table-section").style.display = "block";
    document.getElementById("metrics-section").style.display = "block";
}

