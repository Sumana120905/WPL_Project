// Get elements
const processCountInput = document.getElementById("process-count");
const tableBody = document.querySelector("#process-table tbody");
const algorithmSelect = document.getElementById("algorithm-select");

const priorityHeader = document.getElementById("priority-header");
const timeQuantumContainer = document.getElementById("time-quantum-container");
const preemptiveContainer = document.getElementById("preemptive-container");


// =======================
// HANDLE ALGORITHM CHANGE
// =======================
algorithmSelect.addEventListener("change", () => {
    const algo = algorithmSelect.value;

    // Show preemptive toggle only for SJF & Priority
    if (algo === "sjf" || algo === "priority") {
        preemptiveContainer.style.display = "block";
    } else {
        preemptiveContainer.style.display = "none";
    }

    // Show priority column only for Priority algorithm
    if (algo === "priority") {
        priorityHeader.style.display = "table-cell";
    } else {
        priorityHeader.style.display = "none";
    }

    // Show time quantum only for Round Robin
    if (algo === "rr") {
        timeQuantumContainer.style.display = "block";
    } else {
        timeQuantumContainer.style.display = "none";
    }

    // Regenerate table if already filled
    generateTable(processCountInput.value);
});


// =======================
// HANDLE PROCESS COUNT INPUT
// =======================
processCountInput.addEventListener("input", () => {
    const count = processCountInput.value;
    generateTable(count);
});


// =======================
// GENERATE TABLE FUNCTION
// =======================
function generateTable(count) {

    // Clear previous rows
    tableBody.innerHTML = "";

    const algo = algorithmSelect.value;

    // Loop to create rows
    for (let i = 1; i <= count; i++) {

        const row = document.createElement("tr");

        // Process ID column
        const processCell = document.createElement("td");
        processCell.innerText = "P" + i;
        row.appendChild(processCell);

        // Arrival Time input
        const atCell = document.createElement("td");
        const atInput = document.createElement("input");
        atInput.type = "number";
        atInput.min = "0";
        atCell.appendChild(atInput);
        row.appendChild(atCell);

        // Burst Time input
        const btCell = document.createElement("td");
        const btInput = document.createElement("input");
        btInput.type = "number";
        btInput.min = "1";
        btCell.appendChild(btInput);
        row.appendChild(btCell);

        // Priority column (only if needed)
        if (algo === "priority") {
            const prCell = document.createElement("td");
            const prInput = document.createElement("input");
            prInput.type = "number";
            prInput.min = "1";
            prCell.appendChild(prInput);
            row.appendChild(prCell);
        }

        tableBody.appendChild(row);
    }
}

function runSimulation(data) {

    let ganttData = [];

    if (data.algorithm === "fcfs") {
        ganttData = fcfs(data.processes);
    }
    else if (data.algorithm === "sjf") {
        if (data.type === "non") {
            ganttData = sjfNonPreemptive(data.processes);
        } else {
            ganttData = sjfPreemptive(data.processes);
        }
    }
    else if (data.algorithm === "priority") {
        if (data.type === "non") {
            ganttData = priorityNonPreemptive(data.processes);
        } else {
            ganttData = priorityPreemptive(data.processes);
        }
    }
    else if (data.algorithm === "rr") {
        ganttData = roundRobin(data.processes, Number(data.timeQuantum));
    }

    renderGantt(ganttData);

    const result = calculateMetrics(data.processes, ganttData);
    displayResults(result);

    document.getElementById("gantt-section").style.display = "block";
    document.getElementById("control-section").style.display = "block";
}

// =======================
// COLLECT INPUT DATA
// =======================

const simulateBtn = document.getElementById("simulate-btn");

simulateBtn.addEventListener("click", () => {

    const algorithm = document.getElementById("algorithm-select").value;
    const type = document.getElementById("preemptive-select")?.value || "non";
    const timeQuantum = document.getElementById("time-quantum")?.value;

    const rows = document.querySelectorAll("#process-table tbody tr");

    let processes = [];

    rows.forEach((row, index) => {
        const inputs = row.querySelectorAll("input");

        const process = {
            pid: "P" + (index + 1),
            arrivalTime: Number(inputs[0].value),
            burstTime: Number(inputs[1].value)
        };

        // If priority exists
        if (algorithm === "priority") {
            process.priority = Number(inputs[2].value);
        }

        processes.push(process);
    });

    const data = {
        algorithm: algorithm,
        type: type,
        timeQuantum: timeQuantum,
        processes: processes
    };

    console.log("INPUT DATA:", data);

    // TEMP → call dummy gantt renderer
    runSimulation(data);
});