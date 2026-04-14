async function sendToBackend(data) {

    const response = await fetch("/api/simulate/", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "X-CSRFToken": getCSRFToken()
        },
        body: JSON.stringify(data)
    });

    const result = await response.json();

    console.log("BACKEND RESULT:", result);

    renderGantt(result.gantt);
    displayResultsFromBackend(result);

    document.getElementById("gantt-section").style.display = "block";
    document.getElementById("control-section").style.display = "block";
}


// Get elements
const processCountInput = document.getElementById("process-count");
const tableBody = document.querySelector("#process-table tbody");
const algorithmSelect = document.getElementById("algorithm-select");

const priorityHeader = document.getElementById("priority-header");
const timeQuantumContainer = document.getElementById("time-quantum-container");
const preemptiveContainer = document.getElementById("preemptive-container");


algorithmSelect.addEventListener("change", () => {
    const algo = algorithmSelect.value;

    if (algo === "sjf" || algo === "priority") {
        preemptiveContainer.style.display = "block";
    } else {
        preemptiveContainer.style.display = "none";
    }

    if (algo === "priority") {
        priorityHeader.style.display = "table-cell";
    } else {
        priorityHeader.style.display = "none";
    }

    if (algo === "rr") {
        timeQuantumContainer.style.display = "block";
    } else {
        timeQuantumContainer.style.display = "none";
    }

    generateTable(processCountInput.value);
});


processCountInput.addEventListener("input", () => {
    const count = processCountInput.value;
    generateTable(count);
});


function generateTable(count) {

    tableBody.innerHTML = "";

    const algo = algorithmSelect.value;

    for (let i = 1; i <= count; i++) {

        const row = document.createElement("tr");

        const processCell = document.createElement("td");
        processCell.innerText = "P" + i;
        row.appendChild(processCell);

        const atCell = document.createElement("td");
        const atInput = document.createElement("input");
        atInput.type = "number";
        atInput.min = "0";
        atCell.appendChild(atInput);
        row.appendChild(atCell);

        const btCell = document.createElement("td");
        const btInput = document.createElement("input");
        btInput.type = "number";
        btInput.min = "1";
        btCell.appendChild(btInput);
        row.appendChild(btCell);

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
            arrival: Number(inputs[0].value),   // "arrival" not "arrivalTime"
            burst: Number(inputs[1].value)       // "burst" not "burstTime"
        };

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
    sendToBackend(data);
});

function getCSRFToken() {
    return document.cookie
        .split("; ")
        .find(row => row.startsWith("csrftoken"))
        ?.split("=")[1];
}