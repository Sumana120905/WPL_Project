
from django.shortcuts import render
from django.http import JsonResponse
import json

from .algorithms import (
    fcfs,
    sjf_non_preemptive,
    sjf_preemptive,
    priority_non_preemptive,
    priority_preemptive,
    round_robin
)


def index(request):
    return render(request, "index.html")


def simulate_api(request):

    if request.method == "POST":

        data = json.loads(request.body)

        algorithm = data.get("algorithm")
        scheduling_type = data.get("type", "non")       # "non" or "pre"
        time_quantum = int(data.get("timeQuantum") or 2)
        processes = data.get("processes")

        if algorithm == "fcfs":
            result = fcfs(processes)

        elif algorithm == "sjf":
            if scheduling_type == "pre":
                result = sjf_preemptive(processes)
            else:
                result = sjf_non_preemptive(processes)

        elif algorithm == "priority":
            if scheduling_type == "pre":
                result = priority_preemptive(processes)
            else:
                result = priority_non_preemptive(processes)

        elif algorithm == "rr":
            result = round_robin(processes, time_quantum)

        else:
            return JsonResponse({"error": "Invalid algorithm"}, status=400)

        return JsonResponse(result, safe=False)

    return JsonResponse({"error": "Invalid request"}, status=400)
