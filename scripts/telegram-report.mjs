import { readFile } from "node:fs/promises";

const reportPath = "playwright-report/results.json";
const report = JSON.parse(await readFile(reportPath, "utf8"));

const stats = {
  total: 0,
  passed: 0,
  failed: 0,
  failedTests: [],
};

function getTestStatus(test) {
  const results = test.results ?? [];

  if (results.some((result) => result.status === "failed")) {
    return "failed";
  }

  if (results.some((result) => result.status === "timedOut")) {
    return "failed";
  }

  if (results.some((result) => result.status === "interrupted")) {
    return "failed";
  }

  if (
    results.length > 0 &&
    results.every((result) => result.status === "passed")
  ) {
    return "passed";
  }

  return "failed";
}

function collectTests(suites = []) {
    for (const suite of suites) {
      for (const spec of suite.specs ?? []) {
        for (const test of spec.tests ?? []) {
          stats.total += 1;
          const status = getTestStatus(test);
  
          if (status === "passed") {
            stats.passed += 1;
          } else {
            stats.failed += 1;
            stats.failedTests.push({
              file: spec.file ?? "Неизвестный файл",
              title: spec.title ?? "Неизвестный тест",
            });
          }
        }
      }
  
      collectTests(suite.suites ?? []);
    }
  }

collectTests(report.suites ?? []);

const status = stats.failed > 0 ? "❌ FAILED" : "✅ PASSED";

const failedTestsText = stats.failedTests.length
  ? stats.failedTests
      .map((test) => `• ${test.file}\n  ${test.title}`)
      .join("\n\n")
  : "нет";

const branch =
  process.env.GITHUB_HEAD_REF ||
  process.env.GITHUB_REF_NAME ||
  "unknown";

const commit = (process.env.GITHUB_SHA || "unknown").slice(0, 7);

const message = [
  "🧪 PomidorQA CI",
  "",
  `Статус: ${status}`,
  "",
  `Всего: ${stats.total}`,
  `✅ Passed: ${stats.passed}`,
  `❌ Failed: ${stats.failed}`,
  "",
  "Упавшие тесты:",
  failedTestsText,
  "",
  `Branch: ${branch}`,
  `Commit: ${commit}`,
].join("\n");

console.log(message);

const token = process.env.TELEGRAM_BOT_TOKEN;
const chatId = process.env.TELEGRAM_CHAT_ID;

if (!token || !chatId) {
  throw new Error("Не заданы TELEGRAM_BOT_TOKEN или TELEGRAM_CHAT_ID");
}

const response = await fetch(
  `https://api.telegram.org/bot${token}/sendMessage`,
  {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      chat_id: chatId,
      text: message,
    }),
  },
);

if (!response.ok) {
  const errorText = await response.text();
  throw new Error(
    `Telegram API вернул ошибку ${response.status}: ${errorText}`,
  );
}

console.log("Telegram report sent successfully");