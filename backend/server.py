import os
import subprocess
import signal
import httpx
import asyncio
from fastapi import FastAPI, Request
from fastapi.responses import Response
from contextlib import asynccontextmanager

NODE_PROCESS = None
NODE_PORT = 5000
NODE_BASE = f"http://127.0.0.1:{NODE_PORT}"


def start_node_bot():
    global NODE_PROCESS
    env = {**os.environ}
    env["PORT"] = str(NODE_PORT)
    log_file = open("/var/log/supervisor/node-bot.log", "a")
    NODE_PROCESS = subprocess.Popen(
        ["node", "js/start-bot.js"],
        cwd="/app",
        env=env,
        stdout=log_file,
        stderr=log_file,
    )
    print(f"[proxy] Node.js bot started (pid={NODE_PROCESS.pid}) on port {NODE_PORT}")


async def wait_for_node():
    for _ in range(30):
        try:
            async with httpx.AsyncClient() as c:
                r = await c.get(f"{NODE_BASE}/", timeout=2)
                print(f"[proxy] Node.js server ready (status={r.status_code})")
                return True
        except Exception:
            await asyncio.sleep(1)
    print("[proxy] WARNING: Node.js server did not respond in 30s, continuing anyway")
    return False


@asynccontextmanager
async def lifespan(application: FastAPI):
    start_node_bot()
    await wait_for_node()
    yield
    if NODE_PROCESS:
        NODE_PROCESS.send_signal(signal.SIGTERM)
        NODE_PROCESS.wait(timeout=10)
        print("[proxy] Node.js bot stopped")


app = FastAPI(lifespan=lifespan)
client = httpx.AsyncClient(base_url=NODE_BASE, timeout=60.0)


@app.get("/api/health")
async def health():
    """Quick health check for the proxy + Node.js status."""
    node_ok = False
    try:
        r = await client.get("/", timeout=3)
        node_ok = r.status_code < 500
    except Exception:
        pass
    return {
        "status": "ok",
        "proxy": "running",
        "node": "running" if node_ok else "starting",
        "db": "connected" if node_ok else "unknown",
    }


@app.api_route("/{path:path}", methods=["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS", "HEAD"])
async def proxy(path: str, request: Request):
    body = await request.body()
    headers = dict(request.headers)
    headers.pop("host", None)

    url = f"/{path}"
    if request.url.query:
        url = f"{url}?{request.url.query}"

    try:
        resp = await client.request(
            method=request.method,
            url=url,
            content=body,
            headers=headers,
        )
        excluded = {"content-encoding", "content-length", "transfer-encoding"}
        resp_headers = {k: v for k, v in resp.headers.items() if k.lower() not in excluded}
        return Response(content=resp.content, status_code=resp.status_code, headers=resp_headers)
    except httpx.ConnectError:
        return Response(content='{"error":"Node.js server not reachable"}', status_code=502, media_type="application/json")
    except Exception as e:
        return Response(content=f'{{"error":"{str(e)}"}}', status_code=502, media_type="application/json")
