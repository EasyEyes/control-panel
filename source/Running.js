import React, { Component } from "react";
import Swal from "sweetalert2";
import axios from "axios";

import { Question } from "./components";
import {
  downloadDataFolder,
  generateAndUploadCompletionURL,
  getExperimentStatus,
  runExperiment,
} from "./components/gitlabUtils";
import {
  DEVICE_COMPATIBILITY,
  LANGUAGE_INDEX_PROLIFIC_MAPPING,
} from "./Constants";
import "./css/Running.scss";
export default class Running extends Component {
  constructor(props) {
    super(props);

    this.state = {
      pavloviaIsReady: false,
      completionCode: undefined,
    };

    this.setModeToRun = this.setModeToRun.bind(this);
  }

  componentDidMount() {
    this.props.scrollToCurrentStep();

    if (this.props.user.currentExperiment.pavloviaPreferRunningModeBool)
      this.setModeToRun();
  }

  // componentDidUpdate() {
  //   new Promise((resolve) => setTimeout(resolve, 100)).then(() => {
  //     if (!this.state.pavloviaIsReady) this.checkPavloviaReady();
  //   });
  // }

  async setModeToRun(e = null) {
    const { user, newRepo, functions } = this.props;

    const result = await runExperiment(
      user,
      newRepo,
      user.currentExperiment.experimentUrl
    );

    if (result && result.newStatus === "RUNNING") {
      if (e !== null) e.target.removeAttribute("disabled");
      functions.handleSetExperimentStatus("RUNNING");

      let tries = 10; // try 10 times
      const checkPavloviaReadyInterval = setInterval(() => {
        this.checkPavloviaReady(() => {
          clearInterval(checkPavloviaReadyInterval);
        });
        tries--;
        if (tries === 0) {
          clearInterval(checkPavloviaReadyInterval);
        }
      }, 2000);
    }
  }

  _getPavloviaExperimentUrl() {
    return `https://run.pavlovia.org/${
      this.props.user.username
    }/${this.props.projectName.toLocaleLowerCase()}`;
  }

  checkPavloviaReady(successfulCallback = null) {
    fetch(this._getPavloviaExperimentUrl())
      .then((response) => response.text())
      .then((data) => {
        if (data.includes("403")) {
          if (this.state.pavloviaIsReady)
            this.setState({
              pavloviaIsReady: false,
            });
        } else if (data.includes("404")) {
          if (this.state.pavloviaIsReady)
            this.setState({
              pavloviaIsReady: false,
            });
          Swal.fire({
            icon: "error",
            title: `Failed to check availability.`,
            text: `We can't find the experiment on Pavlovia server. There might be a problem when uploading it, or the Pavlovia server is down. Please try to refresh the status in a while, or refresh the page to start again.`,
            confirmButtonColor: "#666",
          });
        } else {
          if (successfulCallback) successfulCallback();
          if (!this.state.pavloviaIsReady)
            this.setState({
              pavloviaIsReady: true,
            });
        }
      })
      .catch(() => {
        if (this.state.pavloviaIsReady)
          this.setState({ pavloviaIsReady: false });
      });
  }

  render() {
    const { user, projectName, newRepo, functions, experimentStatus } =
      this.props;
    const { completionCode } = this.state;

    const isRunning = experimentStatus === "RUNNING";
    const pavloviaIsReady = this.state.pavloviaIsReady;

    const hasRecruitmentService =
      !!user.currentExperiment.participantRecruitmentServiceName;
    const recruitName =
      user.currentExperiment.participantRecruitmentServiceName;

    // const offerPilotingOption =
    //   this.props.user.currentExperiment.pavloviaOfferPilotingOptionBool;
    const offerPilotingOption =
      !this.props.user.currentExperiment.pavloviaPreferRunningModeBool;

    // console.log("hasRecruitmentService", hasRecruitmentService);
    // console.log("isRunning", isRunning);
    // console.log(user);

    const smallButtonExtraStyle = {
      whiteSpace: "nowrap",
      fontSize: "0.7rem",
      padding: "0.6rem",
      borderRadius: "0.3rem",
    };

    const prolificLangType = {
      NATIVE: "NATIVE",
      FLUENT: "FLUENT",
    };

    const findProlificLanguageAttributes = (
      field,
      type = prolificLangType.NATIVE
    ) => {
      const result = [];
      const languages = field?.split(",") ?? [];
      languages.forEach((element) => {
        element = element?.trim();
        const v = { ...LANGUAGE_INDEX_PROLIFIC_MAPPING[element] };
        v["index"] =
          type === prolificLangType.FLUENT ? v["index"] + 1 : v["index"];
        v["value"] = true;
        result.push(v);
      });
      return result;
    };

    const prolificCreateFraftOnClick = async () => {
      const prolificStudyDraftApiUrl =
        "https://api.prolific.co/api/v1/studies/";
      const payload = {
        name: user.currentExperiment.titleOfStudy ?? "",
        internal_name: this._getPavloviaExperimentUrl(),
        description: user.currentExperiment.descriptionOfStudy ?? "",
        external_study_url: user.currentExperiment.experimentUrl,
        prolific_id_option: "url_parameters",
        completion_code: completionCode,
        completion_option: "url",
        total_available_places:
          user.currentExperiment._participantsHowMany ?? 10,
        estimated_completion_time:
          user.currentExperiment._participantDurationMinutes ?? 1,
        reward: 1,
        device_compatibility: [],
        peripheral_requirements: [],
        eligibility_requirements: [
          {
            id: null,
            type: "SelectAnswer",
            attributes: findProlificLanguageAttributes(
              user.currentExperiment._participantLanguageNative
            ),
            query: {
              id: "54ac6ea9fdf99b2204feb899",
              question: "What is your first language?",
              description: "",
              title: "First Language",
              help_text: "",
              participant_help_text: "",
              researcher_help_text: "",
              is_new: false,
              tags: ["onboarding-2", "core-5", "default_export_language"],
            },
          },
          {
            id: null,
            type: "MultiSelectAnswer",
            attributes: findProlificLanguageAttributes(
              user.currentExperiment._participantLanguageFluent,
              prolificLangType.FLUENT
            ),
            query: {
              id: "58c6b44ea4dd0a4799361afc",
              question: "Which of the following languages are you fluent in?",
              description: "Select the languages that you are fluent in.",
              title: "Fluent languages",
              help_text:
                "<b>Please note</b>: when selecting multiple languages, participants who are fluent in any one of those languages will be eligible for your study. e.g. the study will recruit participants who are fluent in English <b>OR</b> German, not both.",
              participant_help_text: "",
              researcher_help_text: "",
              is_new: false,
              tags: ["rep_sample_language", "core-13"],
            },
          },
        ],
      };

      const response = await axios.post(
        prolificStudyDraftApiUrl,
        JSON.stringify(payload),
        {
          withCredentials: false,
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
            Authorization:
              "Token XlJQZJfE1vbw3nDXvrL64p1cFuvEgnDTr1eo1WzhiZ-XCNCt9wsqXomi7nhUba6UVsvRXedtvUcTzFTAyaScwQvY5e_nvgxfX_6QnXHeECchPcWOULjg9rGJ",
          },
        }
      );
      if (response.status !== 201) {
        console.log("error:" + response);
      } else {
        window
          .open(
            "https://app.prolific.co/researcher/workspaces/studies/" +
              response.data.id,
            "_blank"
          )
          .focus();
      }
    };

    const buttonGoToPavlovia = (
      displayText = "Go to Pavlovia",
      extraStyle = {}
    ) => (
      <button
        className={`button-grey button-small`}
        onClick={() => {
          window.open(
            `https://pavlovia.org/${
              user.username
            }/${projectName.toLocaleLowerCase()}`,
            "_blank"
          );
        }}
        style={extraStyle}
      >
        {displayText}
      </button>
    );

    const buttonSetToRunning = (extraStyle = {}) => (
      <button
        // className={`button-small${
        //   isRunning || !offerPilotingOption
        //     ? " button-disabled"
        //     : " button-green"
        // }`}
        className={`button-grey button-small`}
        onClick={
          isRunning
            ? null
            : async (e) => {
                e.target.setAttribute("disabled", true);
                await this.setModeToRun(e);
              }
        }
        style={extraStyle}
      >
        Set to RUNNING mode
      </button>
    );

    return (
      <>
        <p className="emphasize">
          {isRunning
            ? pavloviaIsReady
              ? "Experiment compiled, uploaded, and in RUNNING mode, ready to run."
              : "Experiment compiled and uploaded. Waiting for Pavlovia's approval to run ... Unless your university has a Pavlovia license, to run your new experiment, you need to assign tokens to it in Pavlovia."
            : `Upload successful! ${
                offerPilotingOption
                  ? "You can go to Pavlovia and set it to PILOTING or RUNNING mode."
                  : "Setting mode to RUNNING ..."
              }`}
        </p>
        <div className="link-set">
          <div className="link-set-buttons">
            {isRunning && pavloviaIsReady && (
              <>
                <button
                  className="button-grey button-small"
                  onClick={() => {
                    window.open(this._getPavloviaExperimentUrl(), "_blank");
                  }}
                >
                  Try the experiment in RUNNING mode
                </button>
              </>
            )}

            {isRunning && !pavloviaIsReady && (
              <button
                className="button-grey button-small"
                onClick={async (e) => {
                  e.target.classList.add("button-disabled");
                  e.target.classList.add("button-wait");
                  this.checkPavloviaReady();
                  e.target.classList.remove("button-disabled");
                  e.target.classList.remove("button-wait");
                }}
              >
                Refresh experiment status
              </button>
            )}

            {!isRunning && (
              <>
                {buttonGoToPavlovia(
                  "Go to Pavlovia to run in PILOTING mode",
                  {}
                )}
                <button
                  className="button-grey button-small"
                  onClick={async (e) => {
                    e.target.classList.add("button-disabled");
                    e.target.classList.add("button-wait");
                    const result = await getExperimentStatus(user, newRepo);

                    if (result === "RUNNING")
                      functions.handleSetExperimentStatus("RUNNING");
                    else {
                      await this.setModeToRun();
                    }

                    e.target.classList.remove("button-disabled");
                    e.target.classList.remove("button-wait");
                  }}
                >
                  Refresh experiment status
                </button>
              </>
            )}
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.3rem",
            }}
          >
            {isRunning
              ? buttonGoToPavlovia("Go to Pavlovia", smallButtonExtraStyle)
              : buttonSetToRunning(smallButtonExtraStyle)}

            <Question
              title={"Why go to Pavlovia?"}
              text={`Scientists in a university with a Pavlovia site license won't need the "Go to Pavlovia" button. Without that license, you have two ways to run your experiment. For free, you can go to Pavlovia and run your experiment in PILOTING mode. Or you can buy tokens from Pavlovia, assign some to this experiment, and run it in RUNNING mode. (Every time you compile, it's a new experiment. Tokens don't transfer automatically.) Pavlovia currently charges 20 pence per participant. PILOTING mode is strictly local. For online testing, you need RUNNING mode.`}
            />
          </div>
        </div>

        {/* {isRunning && (
          <p
            style={{
              fontSize: "1rem",
            }}
          >
            Your experiment URL:{" "}
            <a
              href={this._getPavloviaExperimentUrl()}
              target="_blank"
              rel="noopenner noreferrer"
              style={{
                color: "#666",
              }}
            >{`https://run.pavlovia.org/${
              user.username
            }/${projectName.toLocaleLowerCase()}`}</a>
          </p>
        )} */}

        {hasRecruitmentService && isRunning && (
          <>
            <hr />
            <div
              className="recruit-service"
              // style={{
              //   marginTop: "1.6rem",
              // }}
            >
              <p>
                Use {recruitName} to recruit participants.
                {user.currentExperiment.prolificWorkspaceModeBool ? (
                  <>
                    {`(You are using `}
                    <a
                      style={{
                        color: "#666",
                      }}
                      href="https://researcher-help.prolific.co/hc/en-gb/sections/4500136384412-Workspaces"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Prolific Workspace
                    </a>
                    {`.)`}
                  </>
                ) : (
                  ""
                )}
              </p>
              <div className="link-set">
                <div
                  className="link-set-buttons"
                  style={{
                    flexDirection: "row",
                  }}
                >
                  <>
                    {completionCode ? (
                      <button
                        className="button-grey button-small"
                        onClick={async () => await prolificCreateFraftOnClick()}
                      >
                        Go to {recruitName} to finalize and run your study
                      </button>
                    ) : (
                      <button
                        className="button-grey button-small"
                        onClick={async () => {
                          const code = await generateAndUploadCompletionURL(
                            user,
                            newRepo,
                            functions.handleUpdateUser
                          );
                          this.setState({
                            completionCode: code,
                          });
                        }}
                      >
                        Generate completion code
                      </button>
                    )}
                  </>

                  <button
                    className="button-grey button-small"
                    onClick={() => {
                      window.open(
                        user.currentExperiment.prolificWorkspaceModeBool
                          ? `https://app.prolific.co/researcher/workspaces/projects/${user.currentExperiment.prolificWorkspaceProjectId}/active`
                          : "https://app.prolific.co/researcher/studies/active",
                        "_blank"
                      );
                    }}
                  >
                    Go to {recruitName} to view active studies
                  </button>
                </div>
              </div>
              {completionCode ? (
                <>
                  <p className="smaller-text">
                    Click to copy the Prolific study URL{" "}
                    <span
                      className="text-copy"
                      onClick={
                        // copy to clipboard
                        () => {
                          navigator.clipboard.writeText(
                            user.currentExperiment.experimentUrl
                          );
                        }
                      }
                    >
                      {user.currentExperiment.experimentUrl}
                    </span>
                    .
                  </p>
                  <p className="smaller-text">
                    The completion code is{" "}
                    <span
                      className="text-copy"
                      onClick={
                        // copy to clipboard
                        () => {
                          navigator.clipboard.writeText(completionCode);
                        }
                      }
                    >
                      {completionCode}
                    </span>
                    .
                  </p>
                </>
              ) : (
                <p
                  style={{
                    fontSize: "1rem",
                  }}
                >
                  Please generate the completion code to view the Prolific study
                  URL.
                </p>
              )}
            </div>
          </>
        )}

        {isRunning && pavloviaIsReady && (
          <>
            <hr />
            <div className="link-set-buttons">
              <button
                className="button-grey button-small"
                onClick={async () => {
                  await downloadDataFolder(user, newRepo);
                }}
              >
                Download results
              </button>
            </div>
          </>
        )}
      </>
    );
  }
}
