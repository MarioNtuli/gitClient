import axios from "axios";

export const getCommitsFromGitHub = (token: string, email: string) => {
  return axios.get(
    `https://api.github.com/search/commits?q=author-email:${email}&page=1&order=desc&sort=committer-date`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};
