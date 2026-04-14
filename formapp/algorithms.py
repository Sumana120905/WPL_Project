
def calculate_metrics(processes, gantt):

    completion_time = {}
    response_time = {}

    for block in gantt:
        pid = block["process"]
        start = block["start"]
        end = block["end"]

        completion_time[pid] = end

        if pid not in response_time:
            response_time[pid] = start

    results = []
    total_tat = total_wt = 0

    for p in processes:
        pid = p["pid"]
        at = p["arrival"]
        bt = p["burst"]

        ct = completion_time[pid]
        tat = ct - at
        wt = tat - bt
        rt = response_time[pid] - at

        total_tat += tat
        total_wt += wt

        results.append({
            "pid": pid,
            "arrival": at,
            "burst": bt,
            "completion": ct,
            "tat": tat,
            "wt": wt,
            "rt": rt,
        })

    n = len(processes)
    total_time = gantt[-1]["end"]
    total_burst = sum(p["burst"] for p in processes)

    cpu_util = (total_burst / total_time) * 100 if total_time > 0 else 0
    throughput = n / total_time if total_time > 0 else 0

    return {
        "processes": results,
        "avg_tat": round(total_tat / n, 2),
        "avg_wt": round(total_wt / n, 2),
        "cpu_util": round(cpu_util, 2),
        "throughput": round(throughput, 2),
    }


# =======================
# FCFS
# =======================

def fcfs(processes):

    processes = sorted(processes, key=lambda x: x["arrival"])

    time = 0
    gantt = []

    for p in processes:

        if time < p["arrival"]:
            time = p["arrival"]

        start = time
        end = time + p["burst"]

        gantt.append({"process": p["pid"], "start": start, "end": end})

        time = end

    metrics = calculate_metrics(processes, gantt)
    return {"gantt": gantt, **metrics}


# =======================
# SJF Non-Preemptive
# =======================

def sjf_non_preemptive(processes):

    processes = processes[:]
    completed = []
    gantt = []
    time = 0

    while processes:
        available = [p for p in processes if p["arrival"] <= time]

        if not available:
            time += 1
            continue

        p = min(available, key=lambda x: x["burst"])
        processes.remove(p)

        start = time
        end = time + p["burst"]

        gantt.append({"process": p["pid"], "start": start, "end": end})

        time = end
        completed.append(p)

    metrics = calculate_metrics(completed, gantt)
    return {"gantt": gantt, **metrics}


# =======================
# SJF Preemptive (SRTF)
# =======================

def sjf_preemptive(processes):

    time = 0
    gantt = []
    remaining = [{"pid": p["pid"], "arrival": p["arrival"], "burst": p["burst"], "remaining": p["burst"]} for p in processes]
    completed = []

    while True:

        available = [p for p in remaining if p["arrival"] <= time and p["remaining"] > 0]

        if not available:
            if all(p["remaining"] == 0 for p in remaining):
                break
            time += 1
            continue

        p = min(available, key=lambda x: x["remaining"])

        last = gantt[-1] if gantt else None

        if last and last["process"] == p["pid"]:
            last["end"] += 1
        else:
            gantt.append({"process": p["pid"], "start": time, "end": time + 1})

        p["remaining"] -= 1
        time += 1

        if p["remaining"] == 0:
            original = next(op for op in processes if op["pid"] == p["pid"])
            completed.append(original)

    metrics = calculate_metrics(completed, gantt)
    return {"gantt": gantt, **metrics}


# =======================
# Priority Non-Preemptive
# =======================

def priority_non_preemptive(processes):

    processes = processes[:]
    completed = []
    gantt = []
    time = 0

    while processes:
        available = [p for p in processes if p["arrival"] <= time]

        if not available:
            time += 1
            continue

        p = min(available, key=lambda x: x["priority"])
        processes.remove(p)

        start = time
        end = time + p["burst"]

        gantt.append({"process": p["pid"], "start": start, "end": end})

        time = end
        completed.append(p)

    metrics = calculate_metrics(completed, gantt)
    return {"gantt": gantt, **metrics}


# =======================
# Priority Preemptive
# =======================

def priority_preemptive(processes):

    time = 0
    gantt = []
    remaining = [{"pid": p["pid"], "arrival": p["arrival"], "burst": p["burst"], "priority": p["priority"], "remaining": p["burst"]} for p in processes]
    completed = []

    while True:

        available = [p for p in remaining if p["arrival"] <= time and p["remaining"] > 0]

        if not available:
            if all(p["remaining"] == 0 for p in remaining):
                break
            time += 1
            continue

        p = min(available, key=lambda x: x["priority"])

        last = gantt[-1] if gantt else None

        if last and last["process"] == p["pid"]:
            last["end"] += 1
        else:
            gantt.append({"process": p["pid"], "start": time, "end": time + 1})

        p["remaining"] -= 1
        time += 1

        if p["remaining"] == 0:
            original = next(op for op in processes if op["pid"] == p["pid"])
            completed.append(original)

    metrics = calculate_metrics(completed, gantt)
    return {"gantt": gantt, **metrics}


# =======================
# Round Robin
# =======================

def round_robin(processes, quantum):

    processes = sorted(processes, key=lambda x: x["arrival"])

    time = 0
    queue = []
    gantt = []
    completed = []
    remaining = [{"pid": p["pid"], "arrival": p["arrival"], "burst": p["burst"], "remaining": p["burst"]} for p in processes]
    visited = set()

    while True:

        for p in remaining:
            if p["arrival"] <= time and p["pid"] not in visited and p["remaining"] > 0:
                queue.append(p)
                visited.add(p["pid"])

        if not queue:
            if all(p["remaining"] == 0 for p in remaining):
                break
            time += 1
            continue

        p = queue.pop(0)

        exec_time = min(quantum, p["remaining"])
        start = time
        end = time + exec_time

        gantt.append({"process": p["pid"], "start": start, "end": end})

        time = end
        p["remaining"] -= exec_time

        for r in remaining:
            if r["arrival"] > start and r["arrival"] <= end and r["pid"] not in visited and r["remaining"] > 0:
                queue.append(r)
                visited.add(r["pid"])

        if p["remaining"] > 0:
            queue.append(p)
        else:
            original = next(op for op in processes if op["pid"] == p["pid"])
            completed.append(original)

    metrics = calculate_metrics(completed, gantt)
    return {"gantt": gantt, **metrics}