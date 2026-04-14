// =======================
// ANIMATED GANTT CHART (FIXED)
// =======================

let animationTimeouts = [];

// Same process = same color
const processColors = {};

function getColor(pid) {
    if (!processColors[pid]) {
        const palette = ["#8ecae6", "#90be6d", "#f9c74f", "#f9844a", "#cdb4db"];
        const index = Object.keys(processColors).length;
        processColors[pid] = palette[index % palette.length];
    }
    return processColors[pid];
}

function renderGantt(ganttData) {

    const container = document.getElementById("gantt-container");
    const timeline = document.getElementById("timeline-container");

    // Clear previous
    container.innerHTML = "";
    timeline.innerHTML = "";

    container.style.width = "fit-content";

    animationTimeouts.forEach(t => clearTimeout(t));
    animationTimeouts = [];

    const scale = 40;
    let delay = 0;

    // =======================
    // CREATE BLOCKS
    // =======================
    ganttData.forEach((block) => {

        const duration = block.end - block.start;
        const width = duration * scale;

        const div = document.createElement("div");
        div.className = "gantt-block";
        div.innerText = block.process;

        // Initial hidden width
        div.style.width = "0px";
        div.style.backgroundColor = getColor(block.process);

        container.appendChild(div);

        // Animate width
        const timeout = setTimeout(() => {
            div.style.width = width + "px";
        }, delay);

        animationTimeouts.push(timeout);

        delay += duration * 500;
    });

    // =======================
    // TIMELINE (FIXED ALIGNMENT)
    // =======================
    ganttData.forEach(block => {

        const mark = document.createElement("div");
        mark.className = "timeline-mark";
        mark.innerText = block.start;

        mark.style.left = (block.start * scale) + "px";

        timeline.appendChild(mark);
    });

    // Final time
    const last = ganttData[ganttData.length - 1];

    const endMark = document.createElement("div");
    endMark.className = "timeline-mark";
    endMark.innerText = last.end;
    endMark.style.left = (last.end * scale) + "px";

    timeline.appendChild(endMark);

    setTimeout(() => {
    timeline.style.width = container.scrollWidth + "px";
}, delay);
}