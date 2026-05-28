const { pool } = require("../config/db");

const selectColumns = `
  id,
  username,
  github_id,
  name,
  avatar_url,
  html_url,
  bio,
  company,
  location,
  blog,
  twitter_username,
  public_repos,
  public_gists,
  followers,
  following,
  total_stars,
  total_forks,
  total_open_issues,
  top_language,
  languages,
  most_starred_repo,
  account_created_at,
  account_updated_at,
  last_analyzed_at,
  created_at,
  updated_at
`;

function parseProfile(row) {
  if (!row) {
    return null;
  }

  return {
    ...row,
    languages: typeof row.languages === "string" ? JSON.parse(row.languages) : row.languages,
    most_starred_repo:
      typeof row.most_starred_repo === "string"
        ? JSON.parse(row.most_starred_repo)
        : row.most_starred_repo
  };
}

async function upsert(profile) {
  const sql = `
    INSERT INTO github_profiles (
      username,
      github_id,
      name,
      avatar_url,
      html_url,
      bio,
      company,
      location,
      blog,
      twitter_username,
      public_repos,
      public_gists,
      followers,
      following,
      total_stars,
      total_forks,
      total_open_issues,
      top_language,
      languages,
      most_starred_repo,
      account_created_at,
      account_updated_at,
      last_analyzed_at
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())
    ON DUPLICATE KEY UPDATE
      username = VALUES(username),
      github_id = VALUES(github_id),
      name = VALUES(name),
      avatar_url = VALUES(avatar_url),
      html_url = VALUES(html_url),
      bio = VALUES(bio),
      company = VALUES(company),
      location = VALUES(location),
      blog = VALUES(blog),
      twitter_username = VALUES(twitter_username),
      public_repos = VALUES(public_repos),
      public_gists = VALUES(public_gists),
      followers = VALUES(followers),
      following = VALUES(following),
      total_stars = VALUES(total_stars),
      total_forks = VALUES(total_forks),
      total_open_issues = VALUES(total_open_issues),
      top_language = VALUES(top_language),
      languages = VALUES(languages),
      most_starred_repo = VALUES(most_starred_repo),
      account_created_at = VALUES(account_created_at),
      account_updated_at = VALUES(account_updated_at),
      last_analyzed_at = NOW()
  `;

  await pool.execute(sql, [
    profile.username,
    profile.github_id,
    profile.name,
    profile.avatar_url,
    profile.html_url,
    profile.bio,
    profile.company,
    profile.location,
    profile.blog,
    profile.twitter_username,
    profile.public_repos,
    profile.public_gists,
    profile.followers,
    profile.following,
    profile.total_stars,
    profile.total_forks,
    profile.total_open_issues,
    profile.top_language,
    JSON.stringify(profile.languages),
    JSON.stringify(profile.most_starred_repo),
    profile.account_created_at,
    profile.account_updated_at
  ]);

  return findByUsername(profile.username);
}

async function findAll() {
  const [rows] = await pool.query(`
    SELECT ${selectColumns}
    FROM github_profiles
    ORDER BY last_analyzed_at DESC
  `);

  return rows.map(parseProfile);
}

async function findByUsername(username) {
  const [rows] = await pool.execute(
    `
      SELECT ${selectColumns}
      FROM github_profiles
      WHERE username = ?
      LIMIT 1
    `,
    [username]
  );

  return parseProfile(rows[0]);
}

module.exports = {
  upsert,
  findAll,
  findByUsername
};
