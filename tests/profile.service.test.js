const assert = require("node:assert/strict");
const { __private } = require("../src/services/profile.service");

const user = {
  login: "octocat",
  id: 583231,
  name: "The Octocat",
  avatar_url: "https://github.com/images/error/octocat_happy.gif",
  html_url: "https://github.com/octocat",
  bio: "GitHub mascot",
  company: "@github",
  location: "San Francisco",
  blog: "https://github.blog",
  twitter_username: "github",
  public_repos: 3,
  public_gists: 8,
  followers: 100,
  following: 9,
  created_at: "2011-01-25T18:44:36Z",
  updated_at: "2026-01-01T10:20:30Z"
};

const repos = [
  {
    name: "alpha",
    full_name: "octocat/alpha",
    html_url: "https://github.com/octocat/alpha",
    description: "Alpha repo",
    language: "JavaScript",
    stargazers_count: 10,
    forks_count: 3,
    open_issues_count: 1
  },
  {
    name: "beta",
    full_name: "octocat/beta",
    html_url: "https://github.com/octocat/beta",
    description: "Beta repo",
    language: "Node",
    stargazers_count: 25,
    forks_count: 5,
    open_issues_count: 2
  },
  {
    name: "gamma",
    full_name: "octocat/gamma",
    html_url: "https://github.com/octocat/gamma",
    description: null,
    language: "JavaScript",
    stargazers_count: 1,
    forks_count: 0,
    open_issues_count: 0
  }
];

const insights = __private.buildProfileInsights(user, repos);

assert.equal(insights.username, "octocat");
assert.equal(insights.total_stars, 36);
assert.equal(insights.total_forks, 8);
assert.equal(insights.total_open_issues, 3);
assert.equal(insights.top_language, "JavaScript");
assert.deepEqual(insights.languages, {
  JavaScript: 2,
  Node: 1
});
assert.equal(insights.most_starred_repo.name, "beta");
assert.equal(insights.account_created_at, "2011-01-25 18:44:36");

console.log("profile.service tests passed");
