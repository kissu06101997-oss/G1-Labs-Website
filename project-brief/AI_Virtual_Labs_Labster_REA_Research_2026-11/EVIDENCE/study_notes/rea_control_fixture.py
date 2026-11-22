"""Reproduce a REA browser tool check on a temporary loopback-only research control."""
import argparse
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
import json
from pathlib import Path
import subprocess
from tempfile import TemporaryDirectory
from threading import Thread

class Control(BaseHTTPRequestHandler):
    def do_GET(self):
        content = b"<title>Research control</title><h1>Research control</h1><details><summary>Reveal control</summary><p>Checkpoint visible</p></details>"
        self.send_response(200)
        self.send_header("Content-Type", "text/html; charset=UTF-8")
        self.send_header("Content-Length", str(len(content)))
        self.end_headers()
        self.wfile.write(content)

parser = argparse.ArgumentParser()
for name in ("node", "rea", "chrome", "output"):
    parser.add_argument(name, type=Path)
args = parser.parse_args()

with ThreadingHTTPServer(("127.0.0.1", 0), Control) as server, TemporaryDirectory() as temp:
    thread = Thread(target=server.serve_forever, daemon=True)
    thread.start()
    try:
        url = f"http://127.0.0.1:{server.server_port}/"
        scenario = {
            "browser": {"mode": "launch", "executable_path": str(args.chrome), "headless": True},
            "start_url": {"url": url},
            "actions": [
                {"step_id": "reveal", "action": "click", "locator": {"kind": "css", "selector": "summary"}, "timeout_ms": 7000}
            ],
            "capture": {"at_end": ["url", "accessibility"], "events": ["network"]}
        }
        path = Path(temp) / "scenario.json"
        path.write_text(json.dumps(scenario), encoding="utf-8")
        result = subprocess.run([args.node, args.rea, "capture-browser-scenario", path, "--json"], capture_output=True, text=True, encoding="utf-8", timeout=70)
        args.output.write_text(result.stdout or json.dumps({"exit_code": result.returncode, "stderr": result.stderr}), encoding="utf-8")
        print(f"REA returncode={result.returncode} output_bytes={args.output.stat().st_size}")
    finally:
        server.shutdown()
