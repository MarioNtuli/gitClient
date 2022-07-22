import { Octokit } from "@octokit/core";
import { ICommit } from "../components/pages/home";

export const getGitUser = async (token: string) => {
  const octokit = new Octokit({
    auth: token,
  });

  return await octokit.request("https://api.github.com/user");
};

export const getCommitsFromGitHub = async (token: string, name: string) => {
  const octokit = new Octokit({
    auth: token,
  });
  const queryString = encodeURI(`author:${name}`);
  return await octokit.request("GET /search/commits", {
    q: queryString,
    sort: "author-date",
    order: "desc",
  });
};

export const addFavorite = async (token: string, commit: ICommit) => {
  const octokit = new Octokit({
    auth: token,
  });
  return await octokit.request(
    "POST /repos/{owner}/{repo}/commits/{commit_sha}/comments",
    {
      owner: commit.UserName || "",
      repo: commit.Repo || "",
      commit_sha: commit.Sha || "",
      body: "Client favorite",
    }
  );
};
export const getComments = async (token: string, commit: ICommit) => {
  const octokit = new Octokit({
    auth: token,
  });
  return await octokit.request(
    "GET /repos/{owner}/{repo}/commits/{commit_sha}/comments",
    {
      owner: commit.UserName || "",
      repo: commit.Repo || "",
      commit_sha: commit.Sha || "",
    }
  );
};
