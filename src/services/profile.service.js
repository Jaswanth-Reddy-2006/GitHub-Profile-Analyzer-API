const githubService = require("./github.service");
const profileRepository = require("../repositories/profile.repository");

function buildLanguageSummary(repos) {
  return repos.reduce((summary, repo) => {
    if (!repo.language) {
      return summary;
    }

    summary[repo.language] = (summary[repo.language] || 0) + 1;
    return summary;
  }, {});
}

function getTopLanguage(languages) {
  const [topLanguage] = Object.entries(languages).sort((a, b) => b[1] - a[1]);
  return topLanguage ? topLanguage[0] : null;
}

function getMostStarredRepo(repos) {
  if (repos.length === 0) {
    return null;
  }

  const repo = repos.reduce((currentBest, candidate) => {
    return candidate.stargazers_count > currentBest.stargazers_count ? candidate : currentBest;
  }, repos[0]);

  return {
    name: repo.name,
    full_name: repo.full_name,
    html_url: repo.html_url,
    description: repo.description,
    language: repo.language,
    stars: repo.stargazers_count,
    forks: repo.forks_count,
    open_issues: repo.open_issues_count
  };
}

function toMysqlDate(isoDate) {
  if (!isoDate) {
    return null;
  }

  return new Date(isoDate).toISOString().slice(0, 19).replace("T", " ");
}

function buildProfileInsights(user, repos) {
  const languages = buildLanguageSummary(repos);

  return {
    username: user.login,
    github_id: user.id,
    name: user.name,
    avatar_url: user.avatar_url,
    html_url: user.html_url,
    bio: user.bio,
    company: user.company,
    location: user.location,
    blog: user.blog,
    twitter_username: user.twitter_username,
    public_repos: user.public_repos,
    public_gists: user.public_gists,
    followers: user.followers,
    following: user.following,
    total_stars: repos.reduce((total, repo) => total + repo.stargazers_count, 0),
    total_forks: repos.reduce((total, repo) => total + repo.forks_count, 0),
    total_open_issues: repos.reduce((total, repo) => total + repo.open_issues_count, 0),
    top_language: getTopLanguage(languages),
    languages,
    most_starred_repo: getMostStarredRepo(repos),
    account_created_at: toMysqlDate(user.created_at),
    account_updated_at: toMysqlDate(user.updated_at)
  };
}

async function analyzeAndStoreProfile(username) {
  const [user, repos] = await Promise.all([
    githubService.fetchUser(username),
    githubService.fetchPublicRepos(username)
  ]);
  const insights = buildProfileInsights(user, repos);

  return profileRepository.upsert(insights);
}

async function getAllProfiles() {
  return profileRepository.findAll();
}

async function getProfileByUsername(username) {
  const profile = await profileRepository.findByUsername(username);

  if (!profile) {
    const error = new Error("Analyzed profile not found");
    error.statusCode = 404;
    throw error;
  }

  return profile;
}

module.exports = {
  analyzeAndStoreProfile,
  getAllProfiles,
  getProfileByUsername,
  __private: {
    buildProfileInsights,
    buildLanguageSummary,
    getTopLanguage,
    getMostStarredRepo
  }
};
