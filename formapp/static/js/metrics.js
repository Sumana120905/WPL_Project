function displayResultsFromBackend(result) {

    const tbody = document.querySelector("#result-table tbody");
    tbody.innerHTML = "";

    result.processes.forEach(p => {

        const row = document.createElement("tr");

        row.innerHTML = `
            <td>${p.pid}</td>
            <td>${p.arrival}</td>
            <td>${p.burst}</td>
            <td>${p.completion}</td>
            <td>${p.tat}</td>
            <td>${p.wt}</td>
            <td>${p.rt}</td>
        `;

        tbody.appendChild(row);
    });

    document.getElementById("avg-wt").innerText = result.avg_wt;
    document.getElementById("avg-tat").innerText = result.avg_tat;
    document.getElementById("cpu-util").innerText = result.cpu_util + "%";
    document.getElementById("throughput").innerText = result.throughput;

    document.getElementById("result-table-section").style.display = "block";
    document.getElementById("metrics-section").style.display = "block";
}

