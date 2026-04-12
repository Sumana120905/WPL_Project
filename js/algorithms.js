function fcfs(processes) {

    processes.sort((a, b) => a.arrivalTime - b.arrivalTime);

    let time = 0;
    let gantt = [];

    processes.forEach(p => {

        if (time < p.arrivalTime) {
            time = p.arrivalTime;
        }

        let start = time;
        let end = start + p.burstTime;

        gantt.push({ process: p.pid, start, end });

        time = end;
    });

    return gantt;
}

function sjfNonPreemptive(processes) {

    let time = 0;
    let completed = [];
    let remaining = [...processes];
    let gantt = [];

    while (remaining.length > 0) {

        let available = remaining.filter(p => p.arrivalTime <= time);

        if (available.length === 0) {
            time++;
            continue;
        }

        available.sort((a, b) => a.burstTime - b.burstTime);

        let p = available[0];

        let start = time;
        let end = start + p.burstTime;

        gantt.push({ process: p.pid, start, end });

        time = end;

        remaining = remaining.filter(x => x.pid !== p.pid);
    }

    return gantt;
}

function sjfPreemptive(processes) {

    let time = 0;
    let gantt = [];
    let remaining = processes.map(p => ({ ...p, remainingTime: p.burstTime }));

    while (true) {

        let available = remaining.filter(p => p.arrivalTime <= time && p.remainingTime > 0);

        if (available.length === 0) {
            if (remaining.every(p => p.remainingTime === 0)) break;
            time++;
            continue;
        }

        available.sort((a, b) => a.remainingTime - b.remainingTime);

        let p = available[0];

        let last = gantt[gantt.length - 1];

        if (last && last.process === p.pid) {
            last.end++;
        } else {
            gantt.push({ process: p.pid, start: time, end: time + 1 });
        }

        p.remainingTime--;
        time++;
    }

    return gantt;
}

function priorityNonPreemptive(processes) {

    let time = 0;
    let remaining = [...processes];
    let gantt = [];

    while (remaining.length > 0) {

        let available = remaining.filter(p => p.arrivalTime <= time);

        if (available.length === 0) {
            time++;
            continue;
        }

        available.sort((a, b) => a.priority - b.priority);

        let p = available[0];

        let start = time;
        let end = start + p.burstTime;

        gantt.push({ process: p.pid, start, end });

        time = end;

        remaining = remaining.filter(x => x.pid !== p.pid);
    }

    return gantt;
}

function priorityPreemptive(processes) {

    let time = 0;
    let gantt = [];
    let remaining = processes.map(p => ({ ...p, remainingTime: p.burstTime }));

    while (true) {

        let available = remaining.filter(p => p.arrivalTime <= time && p.remainingTime > 0);

        if (available.length === 0) {
            if (remaining.every(p => p.remainingTime === 0)) break;
            time++;
            continue;
        }

        available.sort((a, b) => a.priority - b.priority);

        let p = available[0];

        let last = gantt[gantt.length - 1];

        if (last && last.process === p.pid) {
            last.end++;
        } else {
            gantt.push({ process: p.pid, start: time, end: time + 1 });
        }

        p.remainingTime--;
        time++;
    }

    return gantt;
}

function roundRobin(processes, quantum) {

    let time = 0;
    let queue = [];
    let gantt = [];

    let remaining = processes.map(p => ({ ...p, remainingTime: p.burstTime }));

    while (true) {

        remaining.forEach(p => {
            if (p.arrivalTime === time) {
                queue.push(p);
            }
        });

        if (queue.length === 0) {
            if (remaining.every(p => p.remainingTime === 0)) break;
            time++;
            continue;
        }

        let p = queue.shift();

        let execTime = Math.min(quantum, p.remainingTime);

        let start = time;
        let end = time + execTime;

        gantt.push({ process: p.pid, start, end });

        time = end;
        p.remainingTime -= execTime;

        remaining.forEach(x => {
            if (x.arrivalTime > start && x.arrivalTime <= end) {
                queue.push(x);
            }
        });

        if (p.remainingTime > 0) {
            queue.push(p);
        }
    }

    return gantt;
}