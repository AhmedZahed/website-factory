import { randomUUID } from "node:crypto";
import { spawnSync } from "node:child_process";
import { createInterface } from "node:readline";
import { mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { hashPassword } from "../src/lib/auth/password.ts";

const projectRoot = fileURLToPath(new URL("../", import.meta.url));
const roleArgument = process.argv.find((argument) =>
  argument.startsWith("--role="),
);
const role = roleArgument?.slice("--role=".length) ?? "admin";
const remote = process.argv.includes("--remote");
const acceptedArguments = new Set(["--remote", roleArgument]);
const unknownArguments = process.argv
  .slice(2)
  .filter((argument) => !acceptedArguments.has(argument));

function quoteSql(value) {
  return `'${String(value).replaceAll("'", "''")}'`;
}

function promptVisible(question) {
  const readline = createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  return new Promise((resolve) => {
    readline.question(question, (answer) => {
      readline.close();
      resolve(answer.trim());
    });
  });
}

function promptHidden(question) {
  if (!process.stdin.isTTY || typeof process.stdin.setRawMode !== "function") {
    throw new Error("Run this command from an interactive terminal");
  }

  return new Promise((resolve, reject) => {
    let answer = "";
    const stdin = process.stdin;
    process.stdout.write(question);
    stdin.setRawMode(true);
    stdin.resume();

    const finish = (error) => {
      stdin.removeListener("data", onData);
      stdin.setRawMode(false);
      stdin.pause();
      process.stdout.write("\n");
      if (error) reject(error);
      else resolve(answer);
    };

    const onData = (chunk) => {
      const input = chunk.toString("utf8");
      for (const character of input) {
        if (character === "\u0003") {
          finish(new Error("Account creation cancelled"));
          return;
        }
        if (character === "\r" || character === "\n") {
          finish();
          return;
        }
        if (character === "\u007f" || character === "\b") {
          answer = Array.from(answer).slice(0, -1).join("");
          continue;
        }
        if (character >= " ") answer += character;
      }
    };

    stdin.on("data", onData);
  });
}

async function main() {
  if (unknownArguments.length > 0 || !["admin", "staff"].includes(role)) {
    throw new Error(
      "Usage: pnpm auth:create-account [--role=admin|staff] [--remote]",
    );
  }

  if (remote) {
    const confirmation = await promptVisible(
      "This will write to the configured REMOTE D1 database. Type REMOTE to continue: ",
    );
    if (confirmation !== "REMOTE") {
      throw new Error("Remote account creation was not confirmed");
    }
  }

  const name = await promptVisible("Account name: ");
  const email = (await promptVisible("Email address: ")).toLowerCase();
  if (name.length < 1 || name.length > 120) {
    throw new Error("Name must contain 1 to 120 characters");
  }
  if (
    email.length > 254 ||
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  ) {
    throw new Error("Enter a valid email address");
  }

  let password = await promptHidden("Password (14–128 characters): ");
  let confirmation = await promptHidden("Confirm password: ");
  let passwordHash;
  try {
    if (password !== confirmation) throw new Error("Passwords did not match");
    passwordHash = await hashPassword(password);
  } finally {
    password = "";
    confirmation = "";
  }
  const accountId = randomUUID();
  const sql = `INSERT INTO admin_accounts (id, name, email, password_hash, role)
VALUES (${quoteSql(accountId)}, ${quoteSql(name)}, ${quoteSql(email)}, ${quoteSql(passwordHash)}, ${quoteSql(role)});`;

  let temporaryDirectory;
  try {
    temporaryDirectory = await mkdtemp(
      join(tmpdir(), "website-factory-account-"),
    );
    const sqlPath = join(temporaryDirectory, "create-account.sql");
    await writeFile(sqlPath, sql, { encoding: "utf8", mode: 0o600, flag: "wx" });

    const command = spawnSync(
      "pnpm",
      [
        "exec",
        "wrangler",
        "d1",
        "execute",
        "website-factory",
        remote ? "--remote" : "--local",
        "--file",
        sqlPath,
      ],
      { cwd: projectRoot, stdio: "inherit" },
    );
    if (command.error) throw command.error;
    if (command.status !== 0) {
      throw new Error("D1 account creation failed");
    }
  } finally {
    if (temporaryDirectory) {
      await rm(temporaryDirectory, { recursive: true, force: true });
    }
  }

  process.stdout.write(
    `Created ${role} account in ${remote ? "remote" : "local"} D1.\n`,
  );
}

main().catch((error) => {
  process.stderr.write(`${error.message}\n`);
  process.exitCode = 1;
});
