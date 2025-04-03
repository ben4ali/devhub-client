import React, { useState, useEffect } from "react";
import "../styles/style-publish.css";
import { useApi } from "../hooks/useApi";
import { User } from "../types/User";
import default_profil from "../assets/images/default_profil.png";

export const Publish = () => {
  const [video, setVideo] = useState<File | null>(null);
  const [videoPreview, setVideoPreview] = useState<string | null>(null);
  const [titre, setTitre] = useState("");
  const [description, setDescription] = useState("");
  const [lienGitHub, setLienGitHub] = useState("");
  const [lienGitlab, setLienGitlab] = useState("");
  const [categories, setCategories] = useState<string[]>([]);
  const [collaborators, setCollaborators] = useState<string[]>([]);
  const [course, setCourse] = useState("");
  const [session, setSession] = useState("");
  const [teacher, setTeacher] = useState("");
  const [searchResults, setSearchResults] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [availableTags, setAvailableTags] = useState([]);
  const [availableCourses, setAvailableCourses] = useState([]);
  const { request } = useApi();

  // Fetch tags
  const fetchTags = async () => {
    try {
      const response = await request("get", "http://localhost:5000/api/v1/tags");
      setAvailableTags(response);
    } catch (error) {
      console.error("Error fetching tags:", error);
    }
  };

  // Fetch courses
  const fetchCourses = async () => {
    try {
      const response = await request("get", "http://localhost:5000/api/v1/courses");
      setAvailableCourses(response);
    } catch (error) {
      console.error("Error fetching courses:", error);
    }
  };

  // Fetch contributors
  const fetchContributors = async () => {
    if (searchTerm.length < 3) return;
    try {
      const response = await request(
        "get",
        `http://localhost:5000/api/v1/users/name/${searchTerm}`
      );
      setSearchResults(response);
    } catch (error) {
      console.error("Error fetching contributors:", error);
    }
  };

  // video upload
  const handleVideoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      setVideo(file);

      if (videoPreview) {
        URL.revokeObjectURL(videoPreview);
      }

      setVideoPreview(URL.createObjectURL(file));
    }
  };

  // add tag
  const handleCategoryAdd = (category: string) => {
    if (category.trim() !== "" && !categories.includes(category)) {
      setCategories([...categories, category]);
    }
  };

  // add collaborator
  const handleCollaboratorSelect = (user: User) => {
    const userName = `${user.firstName} ${user.lastName}`;
    if (!collaborators.includes(userName)) {
      setCollaborators([...collaborators, userName]);
    }
    setSearchResults([]);
    setSearchTerm("");
  };

  // add unknown collaborator
  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === "Enter" && searchTerm.trim() !== "") {
      event.preventDefault();
      const userName = searchTerm.trim();
      if (!collaborators.includes(userName)) {
        setCollaborators([...collaborators, userName]);
      }
      setSearchResults([]);
      setSearchTerm("");
    }
  };

  const handleDefaultBehavior = (event: React.KeyboardEvent) => {
    if (event.key === "Enter") {
      event.preventDefault();
    }
  };

  // form submit
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const projectData = {
      title: titre,
      description,
      githubUrl: lienGitHub,
      gitLabUrl: lienGitlab,
      tags: categories,
      collaborators,
      course,
      teacher,
      session,
    };

    const formData = new FormData();
    if (video) {
      formData.append("video", video);
    }
    formData.append("projet", JSON.stringify(projectData));

    try {
      const response = await request("post", "http://localhost:5000/api/v1/projects", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      console.log("Project published successfully:", response);
      window.location.href = `/watch/${response.id}`;
    } catch (error) {
      console.error("Error publishing project:", error);
    } finally {
      resetForm();
    }
  };

  // reset fields
  const resetForm = () => {
    setVideo(null);
    setTitre("");
    setDescription("");
    setLienGitHub("");
    setLienGitlab("");
    setCategories([]);
    setCollaborators([]);
    setCourse("");
    setSession("");
    setTeacher("");
  };

  // form validation
  const isFormValid = () => video && titre.trim() !== "" && description.trim() !== "";

  // validation message
  const getValidationMessage = () => {
    const missingFields = [];
    if (!video) missingFields.push("Vidéo");
    if (titre.trim() === "") missingFields.push("Titre");
    if (description.trim() === "") missingFields.push("Description");
    return missingFields.length > 0
      ? `Veuillez remplir les champs suivants : ${missingFields.join(", ")}`
      : "";
  };

  // useffects
  useEffect(() => {
    fetchTags();
    fetchCourses();
  }, []);

  useEffect(() => {
    fetchContributors();
  }, [searchTerm]);

  return (
    <div className="publish-project-container">
      <h1>Publier un projet</h1>
      <form onSubmit={handleSubmit} className="publish-project-form">
        <div className="form-info">
          {/* Video Upload */}
          <div className="label-group">
            <label id="uploadlabel">Fichier vidéo</label>
            <i
              className="bi bi-info-circle"
              title="Vidéos au format MP4, MOV ou AVI, d'une taille maximale de 500 Mo."
            ></i>
          </div>
          <div className="videoUpload">
            <div className="holder-upload">
              <div className="upload-box">
                <p>Cliquez pour sélectionner un fichier</p>
              </div>
              <input type="file" accept="video/*" onChange={handleVideoUpload} onKeyDown={handleDefaultBehavior}/>
            </div>
          </div>

          {/* Title */}
          <div className="form-group">
            <label>
              Titre du projet <span>*</span>
            </label>
            <input
              type="text"
              placeholder="Titre du projet"
              value={titre}
              onChange={(e) => setTitre(e.target.value)}
              onKeyDown={handleDefaultBehavior}
            />
          </div>

          {/* Description */}
          <div className="form-group">
            <label>
              Description <span>*</span>
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Décrivez votre projet..."
              onKeyDown={handleDefaultBehavior}
            />
          </div>

          {/* Categories */}
          <div className="form-group">
            <div className="label-group">
              <label>Catégories (Tags)</label>
              <i
                className="bi bi-info-circle"
                title="Ajouter des tags améliore la visibilité de ton projet."
              ></i>
            </div>
            <div className="select-group">
              <select onChange={(e) => handleCategoryAdd(e.target.value)} defaultValue="">
                <option value="" disabled>
                  Sélectionner une catégorie
                </option>
                {availableTags.map((tag: { id: string; name: string }) => (
                  <option key={tag.id} value={tag.name}>
                    {tag.name}
                  </option>
                ))}
              </select>
              <i className="bi bi-chevron-down"></i>
            </div>
            <div className="tags-publish">
              {categories.map((category, index) => (
                <span
                  key={index}
                  className="tag-publish"
                  onClick={() =>
                    setCategories(categories.filter((cat) => cat !== category))
                  }
                >
                  <p>{category}</p>
                  <i className="bi bi-x-lg"></i>
                </span>
              ))}
            </div>
          </div>

          {/* Collaborators */}
          <div className="form-group">
            <div className="label-group">
              <label>Collaborateurs</label>
              <i
                className="bi bi-info-circle"
                title="Si tu ne trouve pas ton collaborateur, tu peux écrire son nom et appuyer la touche entrer."
              ></i>
            </div>
            <div className="search-input-group-publish">
              <input
                className="searchInput-publish"
                type="text"
                placeholder="Rechercher un collaborateur"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyPress={handleKeyPress}
              />
                <div
                className="search-results-publish"
                style={{
                  display: searchResults.length > 0 && searchTerm.length >= 2 ? "flex" : "none",
                }}
                >
                {searchResults.map((user, index) => (
                  <div
                  key={index}
                  className="search-result-item-publish"
                  onClick={() => handleCollaboratorSelect(user)}
                  >
                  <img
                  src={user.avatar || default_profil}
                  alt="User Avatar"
                  crossOrigin="anonymous"
                  />
                  {user.firstName} {user.lastName}
                  </div>
                ))}
                </div>
            </div>
            <div className="collaborators">
              {collaborators.map((collaborator, index) => (
                <span
                  key={index}
                  className="collaborator-publish"
                  onClick={() =>
                    setCollaborators(
                      collaborators.filter((col) => col !== collaborator)
                    )
                  }
                >
                  <p>{collaborator}</p> <i className="bi bi-x-lg"></i>
                </span>
              ))}
            </div>
          </div>

          {/* Teacher */}
          <div className="form-group">
            <div className="label-group">
              <label>Enseignant</label>
              <i
                className="bi bi-info-circle"
                title="Nom de l'enseignant qui a supervisé le projet."
              ></i>
            </div>
            <input
              type="text"
              value={teacher}
              onChange={(e) => setTeacher(e.target.value)}
              placeholder="Nom de l'enseignant"
              onKeyDown={handleDefaultBehavior}
            />
          </div>

          {/* Course and Session */}
          <div className="shared-form-group">
            <div className="form-group">
              <label>Cours</label>
              <div className="select-group">
                <select
                  value={course}
                  onChange={(e) => setCourse(e.target.value)}
                >
                  <option value="" disabled>
                    Sélectionner un cours
                  </option>
                  {availableCourses.map((course: { id: string; name: string }) => (
                    <option key={course.id} value={course.name}>
                      {course.title}
                    </option>
                  ))}
                  <option value="Aucun">Aucun</option>
                </select>
                <i className="bi bi-chevron-down"></i>
              </div>
            </div>
            <div className="form-group">
              <label>Session</label>
              <div className="select-group">
                <select
                  value={session}
                  onChange={(e) => setSession(e.target.value)}
                >
                  <option value="" disabled>
                    Sélectionner une session
                  </option>
                  {(() => {
                    const currentYear = new Date().getFullYear();
                    const currentMonth = new Date().getMonth();
                    const sessions = [];

                    const currentSemester =
                      currentMonth >= 6 ? "Automne" : "Hiver";

                    for (let i = 0; i < 6; i++) {
                      const year = currentYear - Math.floor(i / 2);
                      const semester = i % 2 === 0 ? "Hiver" : "Automne";

                      if (i === 0 && semester === currentSemester) {
                        sessions.push(
                          <option
                            key={`${semester} ${year}`}
                            value={`${semester} ${year}`}
                          >
                            {semester} {year}
                          </option>
                        );
                      } else {
                        sessions.push(
                          <option
                            key={`${semester} ${year}`}
                            value={`${semester} ${year}`}
                          >
                            {semester} {year}
                          </option>
                        );
                      }
                    }

                    return sessions;
                  })()}
                  <option value="Aucune">Aucune</option>
                </select>
                <i className="bi bi-chevron-down"></i>
              </div>
            </div>
          </div>
        </div>

        {/* Video Preview */}
        <div className="form-video">
          <div className="video-container-publish">
            <video key={videoPreview} className="video-preview" controls>
              <source src={videoPreview || ""} type="video/mp4" />
            </video>
            <div className="video-information">
              <p>
                https://rosemont-devhub/watch/{video ? video.name : "no-video"}
              </p>
              <p>
                {titre.trim() !== ""
                  ? `Titre de la vidéo : ${titre}`
                  : "Aucune vidéo sélectionnée"}
              </p>
            </div>
          </div>
          <p className="validation-message">{getValidationMessage()}</p>
          <button
            type="submit"
            className={`submit-button ${!isFormValid() ? "disabled" : ""}`}
            disabled={!isFormValid()}
          >
            Publier
          </button>
        </div>
      </form>
    </div>
  );
};