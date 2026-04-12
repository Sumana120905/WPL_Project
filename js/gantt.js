// =======================
// ANIMATED GANTT CHART
// =======================

let animationTimeouts = [];

function renderGantt(ganttData) {

    const container = document.getElementById("gantt-container");
    const timeline = document.getElementById("timeline-container");

    // Clear previous
    container.innerHTML = "";
    timeline.innerHTML = "";

    animationTimeouts.forEach(t => clearTimeout(t));
    animationTimeouts = [];

    const scale = 40;
    let delay = 0;

    ganttData.forEach((block, index) => {

        const duration = block.end - block.start;
        const width = duration * scale;

        const div = document.createElement("div");
        div.className = "gantt-block";
        div.innerText = block.process;

        // START with 0 width (hidden)
        div.style.width = "0px";
        div.style.border = "1px solid black";
        div.style.textAlign = "center";
        div.style.padding = "10px";
        div.style.overflow = "hidden";

        // Smooth animation
        div.style.transition = "width 0.8s linear";

        // Optional: color
        const colors = ["#8ecae6", "#90be6d", "#f9c74f", "#f9844a", "#cdb4db"];
        div.style.backgroundColor = colors[index % colors.length];

        container.appendChild(div);

        // Animate after delay
        const timeout = setTimeout(() => {
            div.style.width = width + "px";
        }, delay);

        animationTimeouts.push(timeout);

        // Timeline marker
        const timeMark = document.createElement("span");
        timeMark.innerText = block.start + " ";
        timeline.appendChild(timeMark);

        // Increase delay based on duration
        delay += duration * 500;
    });

    // Final end time
    const lastTime = ganttData[ganttData.length - 1].end;
    const endMark = document.createElement("span");
    endMark.innerText = lastTime;
    timeline.appendChild(endMark);
}