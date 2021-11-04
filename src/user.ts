import { EasyEyesResources, env, user } from "./CONSTANTS";
import { hideDialogBox, showDialogBox } from "./dropzoneHandler";
import { createRepo, getResourcesListFromRepository } from "./gitlabUtility";
import { setTab } from "./tab";

if (window.location.hash != "") {
  const gitlabConnBtn = document.getElementById("gitlab-connect-btn");
  const gitlabFileBtn = document.getElementById("gitlab-file-submit");
  if (gitlabConnBtn) {
    gitlabConnBtn.className = "btn btn-success disabled";
    gitlabConnBtn.style.color = "white";
    gitlabConnBtn.innerText = "Connected to Pavlovia. Ready to upload.";
  }

  if (gitlabFileBtn)
    gitlabFileBtn.className = gitlabFileBtn.className.replace("disabled", "");
}

export const populateUserInfo = async () => {
  user.accessToken = window.location.hash.split("&")[0].split("=")[1];
  var userData = await fetch(
    "https://gitlab.pavlovia.org/api/v4/user?access_token=" +
      window.location.hash.split("&")[0].split("=")[1]
  );
  if (user.accessToken) {
    // after dropzone conversion
    showDialogBox(
      "Initializing",
      "Please while we fetch your existing resources.",
      false
    );
    user.userData = await userData.json();
  } else {
    return;
  }
  console.log("userData", userData);

  var projectData: any = await fetch(
    "https://gitlab.pavlovia.org/api/v4/users/" +
      user.userData.id +
      "/projects?access_token=" +
      user.accessToken +
      "&per_page=100"
  );
  projectData = await projectData.json();
  user.userData.projects = projectData;
  console.log("projectDataFiltered", projectData);
  // if user doesn't have a repo named EasyEyesResources, create one and add folders fonts and consent-forms
  if (
    !user.userData.projects
      .map((i: any) => {
        return i ? i.name : "null";
      })
      .includes("EasyEyesResources")
  ) {
    let easyEyesResourcesRepo = await createRepo("EasyEyesResources");
    user.userData.projects.push(easyEyesResourcesRepo);
  }
  const gitlabUserInfoEl = document.getElementById("gitlab-user-info");
  if (gitlabUserInfoEl)
    gitlabUserInfoEl.innerHTML = `Pavlovia account : ${user.userData.name} (${user.userData.username})`;

  // get initial resources info
  let easyEyesResourcesRepo = user.userData.projects.find(
    (i: any) => i.name == "EasyEyesResources"
  );
  const resourcesList: any = await getResourcesListFromRepository(
    easyEyesResourcesRepo.id,
    user.accessToken
  );
  hideDialogBox();
  EasyEyesResources.forms = resourcesList.forms;
  EasyEyesResources.fonts = resourcesList.fonts;
  console.log("EasyEyesResources", EasyEyesResources);

  // display inital resources info
  setTab("font-tab", EasyEyesResources.fonts.length, "Fonts");
  setTab(
    "form-tab",
    EasyEyesResources.forms.length,
    "Consent and debrief forms"
  );
};

export const redirectToOauth2 = () => {
  // TODO switch this for production
  location.href = env.PRODUCTION.GITLAB_REDIRECT_URL;
  //location.href = env.DEVELOPMENT.GITLAB_REDIRECT_URL;
};

export const redirectToPalvoliaActivation = async () => {
  window.open(
    "https://pavlovia.org/" +
      user.userData.username +
      "/" +
      user.newRepo.name.toLowerCase(),
    "_blank"
  );
};
