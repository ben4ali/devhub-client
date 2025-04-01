import React from "react";

export const VideoLinks = () => {
  const lienGithub = "https://github.com/ben4ali"
  const lienGitlab = "https://gitlab.com/ben4ali";
  return (
    <div className="link-holder">

      {lienGithub && (
        <div className="git-link">
          <div className="link-header">
        <h3>Lien GitHub</h3>
        <p>Consulter le code source du projet</p>
          </div>
          <a href={lienGithub} className="github-button">
        <i className="bi bi-github"></i>
        <p>Voir sur GitHub</p>
          </a>
        </div>
      )}

      {lienGitlab && (
        <div className="git-link">
          <div className="link-header">
        <h3>Lien GitLab</h3>
        <p>Consulter le code source du projet</p>
          </div>
          <a href={lienGitlab} className="gitlab-button">
        <i className="bi bi-gitlab"></i>
        <p>Voir sur GitLab</p>
          </a>
        </div>
      )}

    </div>
  );
};
