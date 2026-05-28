const { env } = require("../config/env");

const GITHUB_API_BASE_URL = "https://api.github.com";

function createHeaders() {
  const headers = {
    Accept: "application/vnd.github+json",
    "User-Agent": "github-profile-analyzer-api",
    "X-GitHub-Api-Version": "2022-11-28"
  };

  if (env.GITHUB_TOKEN) {
    headers.Authorization = `Bearer ${env.GITHUB_TOKEN}`;
  }

  return headers;
}

async function githubRequest(path) {
  const response = await fetch(`${GITHUB_API_BASE_URL}${path}`, {
    headers: createHeaders()
  });

  if (response.status === 404) {
    const error = new Error("GitHub user not found");
    error.statusCode = 404;
    throw error;
  }

  if (!response.ok) {
    const errorBody = await response.json().catch(() => ({}));
    const error = new Error(errorBody.message || "GitHub API request failed");
    error.statusCode = response.status === 403 ? 429 : response.status;
    error.details = errorBody.documentation_url;
    throw error;
  }

  return response.json();
}

async function fetchUser(username) {
  return githubRequest(`/users/${encodeURIComponent(username)}`);
}

async function fetchPublicRepos(username) {
  const repos = [];

  for (let page = 1; page <= env.GITHUB_REPO_PAGE_LIMIT; page += 1) {
    const pageRepos = await githubRequest(
      `/users/${encodeURIComponent(username)}/repos?per_page=100&page=${page}&sort=updated`
    );

    repos.push(...pageRepos);

    if (pageRepos.length < 100) {
      break;
    }
  }

  return repos;
}

module.exports = {
  fetchUser,
  fetchPublicRepos
};
