import assert from "node:assert/strict";
import { createInterface } from "node:readline";

const configuredUrl =
  process.env.WEBSITE_FACTORY_AUTH_TEST_URL ?? "http://localhost:80";
const baseUrl = new URL(configuredUrl);
const loopbackHosts = new Set(["localhost", "127.0.0.1", "::1", "[::1]"]);

if (!loopbackHosts.has(baseUrl.hostname)) {
  throw new Error(
    "Live authentication checks are restricted to localhost; no remote login was attempted.",
  );
}

if (baseUrl.pathname !== "/" || baseUrl.search || baseUrl.hash) {
  throw new Error("Set the test URL to a local origin without a path.");
}

const origin = baseUrl.origin;

function requestUrl(path) {
  return new URL(path, baseUrl).toString();
}

function promptLine(question) {
  const prompt = createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  return prompt.question(question).finally(() => prompt.close());
}

function promptHidden(question) {
  const input = process.stdin;
  const output = process.stdout;
  if (!input.isTTY || typeof input.setRawMode !== "function") {
    return Promise.reject(
      new Error("Run this command in an interactive terminal to enter credentials safely."),
    );
  }

  return new Promise((resolve, reject) => {
    let value = "";
    let finished = false;
    const finish = (error) => {
      if (finished) return;
      finished = true;
      input.off("data", onData);
      input.setRawMode(false);
      input.pause();
      output.write("\n");
      if (error) reject(error);
      else resolve(value);
    };
    const onData = (chunk) => {
      for (const character of chunk.toString("utf8")) {
        if (character === "\u0003" || character === "\u0004") {
          finish(new Error("Authentication test cancelled."));
          return;
        }
        if (character === "\r" || character === "\n") {
          finish();
          return;
        }
        if (character === "\u007f" || character === "\b") {
          value = Array.from(value).slice(0, -1).join("");
        } else {
          value += character;
        }
      }
    };

    output.write(question);
    input.setRawMode(true);
    input.resume();
    input.on("data", onData);
  });
}

async function login(email, password) {
  return fetch(requestUrl("/api/auth/login"), {
    method: "POST",
    headers: {
      origin,
      "content-type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });
}

function sessionCookie(response) {
  const header = response.headers.get("set-cookie");
  assert.ok(header, "successful login should set a session cookie");
  const cookie = header.split(";")[0];
  assert.match(cookie, /^__Host-wf_session=/);
  assert.match(header.toLowerCase(), /secure/);
  assert.match(header.toLowerCase(), /httponly/);
  assert.match(header.toLowerCase(), /samesite=strict/);
  assert.match(header.toLowerCase(), /path=\//);
  return cookie;
}

function report(label, passed) {
  process.stdout.write(`${passed ? "PASS" : "FAIL"} ${label}\n`);
}

async function run() {
  if (!process.stdin.isTTY || typeof process.stdin.setRawMode !== "function") {
    throw new Error("Run this command in an interactive terminal.");
  }

  process.stdout.write(
    "This local test updates last_login_at on success and may clear the temporary limiter counter for this client address. It does not create accounts or alter customer records. Six wrong-password attempts leave a limiter entry and can block this address for the remainder of its 15-minute window.\n",
  );
  const confirmation = (await promptLine("Type RUN to continue: ")).trim();
  if (confirmation !== "RUN") {
    process.stdout.write("Cancelled; no request was sent.\n");
    return;
  }

  const email = (await promptLine("Existing local admin email: ")).trim();
  let password = await promptHidden("Admin password (hidden): ");
  if (!email || password.length < 1 || password.length > 128) {
    throw new Error("The supplied login input is empty or outside the supported length.");
  }

  const successfulLogin = await login(email, password);
  assert.equal(successfulLogin.status, 200, "admin login should succeed");
  const loginBody = await successfulLogin.json();
  assert.equal(loginBody.user?.role, "admin");
  const cookie = sessionCookie(successfulLogin);
  report("POST /api/auth/login with existing admin", true);

  const adminPage = await fetch(requestUrl("/admin"), {
    headers: { cookie },
    redirect: "manual",
  });
  assert.equal(adminPage.status, 200);
  report("GET /admin with admin session", true);

  const customers = await fetch(requestUrl("/api/customers"), {
    headers: { cookie },
  });
  assert.equal(customers.status, 200);
  report("GET /api/customers with admin session", true);

  const logout = await fetch(requestUrl("/api/auth/logout"), {
    method: "POST",
    headers: { cookie, origin },
  });
  assert.equal(logout.status, 204);
  report("POST /api/auth/logout with admin session", true);

  const oldSession = await fetch(requestUrl("/api/auth/me"), {
    headers: { cookie },
  });
  assert.equal(oldSession.status, 401);
  report("GET /api/auth/me reusing logged-out session", true);

  const passwordCharacters = Array.from(password);
  const lastCharacter = passwordCharacters.pop();
  passwordCharacters.push(lastCharacter === "x" ? "y" : "x");
  let wrongPassword = passwordCharacters.join("");
  password = "";

  for (let attempt = 1; attempt <= 5; attempt += 1) {
    const response = await login(email, wrongPassword);
    assert.equal(response.status, 401, `failed attempt ${attempt} should be generic 401`);
    assert.deepEqual(await response.json(), {
      error: "Invalid email or password",
    });
    report(`POST /api/auth/login wrong password ${attempt}/5`, true);
  }

  const sixthAttempt = await login(email, wrongPassword);
  assert.equal(sixthAttempt.status, 429, "sixth failed attempt should be rate-limited");
  assert.ok(Number(sixthAttempt.headers.get("retry-after")) > 0);
  report("POST /api/auth/login sixth wrong-password attempt", true);
  wrongPassword = "";
}

run().catch((error) => {
  process.stderr.write(`Live authentication test failed: ${error.message}\n`);
  process.exitCode = 1;
});
