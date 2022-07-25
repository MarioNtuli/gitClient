import { Octokit } from "@octokit/core";
import axios from "axios";
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

export const addFavorite = async (token: string, commit: ICommit[],firstCommit: ICommit,globalSha : string) => {
  const headers = {
    'Content-Type': 'application/json',
    'Authorization': token,
  }
  console.log(commit)
   const contents = await axios.post("http://localhost:5000/api/addFavorite",JSON.stringify(commit),{
    headers: headers
  })
  const octokit = new Octokit({
    auth: token,
  });
  return await octokit.request('PUT /repos/{owner}/{repo}/contents/{path}', {
    owner: firstCommit.UserName || "",
    repo: firstCommit.Repo || "",
    path: 'favorite.txt',
    sha: globalSha,
    message: 'Added favorite commits',
    //sha: firstCommit.Sha || "",
    committer: {
      name: firstCommit.UserName||"",
      email: firstCommit.Email || ""
    },
    content: contents.data.content
  })
};
export const getFavorites = async (token: string, commit: ICommit) =>{
  const octokit = new Octokit({
    auth: token
  })
  
  var response = await octokit.request('GET /repos/{owner}/{repo}/contents/{path}', {
    owner: commit.UserName || "",
    repo: commit.Repo || "",
    path: '/favorite.txt'
  })
  return await axios.post("http://localhost:5000/api/decodeFavorite",response.data);
}
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
