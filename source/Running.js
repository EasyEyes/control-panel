import React, { Component } from "react";
import { get, ref } from "firebase/database";
import Swal from "sweetalert2";

import { Question } from "./components";
import { db } from "./components/firebase";
import { prolificCreateDraft } from "./components/prolificIntegration";
import {
  downloadDataFolder,
  generateAndUploadCompletionURL,
  getDataFolderCsvLength,
  getExperimentStatus,
  runExperiment,
  getPastProlificIdFromExperimentTables,
  getExperimentDataFrames,
} from "../threshold/preprocess/gitlabUtils";
import { displayExperimentNeedsPopup } from "./components/ErrorReport";
import { ordinalSuffixOf } from "./components/utils";

import "./css/Running.scss";

export default class Running extends Component {
  constructor(props) {
    super(props);

    this.state = {
      pavloviaIsReady:
        props.previousExperiment || props.experimentStatus === "RUNNING",
      completionCode: undefined,
      totalCompileCounts: 0,
      dataFolderLength: 0,
    };

    this.setModeToRun = this.setModeToRun.bind(this);
  }

  async componentDidMount() {
    this.props.scrollToCurrentStep();

    const dataFolderLength = await getDataFolderCsvLength(
      this.props.user,
      this.props.newRepo
    );
    this.setState({ dataFolderLength });

    // get total compile counts
    get(ref(db, "compileCounts/")).then((snapshot) => {
      const compileCounts = snapshot.val();
      // sum all values
      const totalCompileCounts =
        Object.values(compileCounts).reduce((a, b) => a + b, 0) + 1;
      this.setState({ totalCompileCounts });
    });

    if (
      !this.props.previousExperiment &&
      this.props.user.currentExperiment.pavloviaPreferRunningModeBool
    )
      this.setModeToRun();
  }

  async componentDidUpdate(prevProps) {
    if (this.props.newRepo !== prevProps.newRepo) {
      const dataFolderLength = await getDataFolderCsvLength(
        this.props.user,
        this.props.newRepo
      );
      this.setState({ dataFolderLength });
    }
  }

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
            title: `Experiment unavailable`,
            text: `Pavlovia makes each experiment unavailable unless you either have an institutional license or you have assigned tokens to that experiment, and the experiment is in the RUNNING state. If this is due to temporary internet outage, you might succeed if you try again.`,
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

  getProlificStudyStatus = async (prolificProjectId, projectName) => {
    const { prolificToken, user } = this.props;
    await this.props.functions.getProlificStudySubmissionDetails(
      user,
      prolificToken,
      projectName,
      prolificProjectId
    );
  };

  render() {
    const {
      user,
      prolificToken,
      projectName,
      newRepo,
      functions,
      experimentStatus,
      previousExperimentViewed: { previousRecruitmentInformation },
      viewingPreviousExperiment,
    } = this.props;
    const {
      pavloviaIsReady,
      completionCode,
      totalCompileCounts,
      dataFolderLength,
    } = this.state;

    const isRunning = experimentStatus === "RUNNING";

    const hasRecruitmentService = viewingPreviousExperiment
      ? previousRecruitmentInformation.recruitmentServiceName !== null
      : !!user.currentExperiment.participantRecruitmentServiceName;
    const recruitName = viewingPreviousExperiment
      ? previousRecruitmentInformation.recruitmentServiceName
      : user.currentExperiment.participantRecruitmentServiceName;

    // const offerPilotingOption =
    //   this.props.user.currentExperiment.pavloviaOfferPilotingOptionBool;
    const offerPilotingOption = viewingPreviousExperiment
      ? false
      : !this.props.user.currentExperiment.pavloviaPreferRunningModeBool;

    const effectiveUsingProlificWorkspace =
      viewingPreviousExperiment && hasRecruitmentService
        ? previousRecruitmentInformation.recruitmentProlificWorkspace
        : user.currentExperiment.prolificWorkspaceModeBool;

    const smallButtonExtraStyle = {
      whiteSpace: "nowrap",
      fontSize: "0.7rem",
      padding: "0.6rem",
      borderRadius: "0.3rem",
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
              ? "Experiment ready to run."
              : "Local. Experiment compiled and uploaded. Waiting for Pavlovia's approval to run ... Unless your university has a Pavlovia license, to run your new experiment, you need to assign tokens to it in Pavlovia."
            : `Local. Upload successful! ${
                offerPilotingOption
                  ? "You can go to Pavlovia and set it to PILOTING or RUNNING mode."
                  : "Setting mode to RUNNING ..."
              }`}
        </p>
        <p className="compile-count">
          <i className="bi bi-stars"></i>
          <span>{ordinalSuffixOf(totalCompileCounts)} experiment compiled</span>
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
                  Run here
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

        {hasRecruitmentService && isRunning && (
          <>
            <div className="recruit-service">
              <p className="emphasize">
                Run online, using {recruitName} to recruit participants.
                {effectiveUsingProlificWorkspace ? (
                  <span style={{ fontSize: "0.9rem" }}>
                    {` (You are using `}
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
                  </span>
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
                    <button
                      className="button-grey button-small"
                      onClick={async (e) => {
                        e.target.classList.add("button-disabled");
                        e.target.classList.add("button-wait");

                        // ! generate completion code
                        const hasCompletionCode = !!completionCode;
                        const code =
                          completionCode ??
                          (await generateAndUploadCompletionURL(
                            user,
                            newRepo,
                            functions.handleUpdateUser
                          ));

                        if (!hasCompletionCode)
                          this.setState({
                            completionCode: code,
                          });

                        // ! create draft study on prolific
                        const result = await prolificCreateDraft(
                          user,
                          `${this.props.user.username}/${this.props.projectName}`,
                          code,
                          prolificToken
                        );

                        if (result.status === "UNPUBLISHED") {
                          window
                            .open(
                              "https://app.prolific.co/researcher/workspaces/studies/" +
                                result.id,
                              "_blank"
                            )
                            ?.focus();
                        }

                        e.target.classList.remove("button-disabled");
                        e.target.classList.remove("button-wait");
                      }}
                    >
                      Create {recruitName} study
                    </button>
                  </>
                </div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.3rem",
                  }}
                >
                  <button
                    className="button-grey button-small"
                    style={smallButtonExtraStyle}
                    onClick={() => {
                      window.open(
                        user.currentExperiment.prolificWorkspaceModeBool
                          ? `https://app.prolific.co/researcher/workspaces/projects/${user.currentExperiment.prolificWorkspaceProjectId}/active`
                          : "https://app.prolific.co/researcher/studies/active",
                        "_blank"
                      );
                    }}
                  >
                    Go to {recruitName}
                  </button>
                  <Question
                    title={"Why go to Prolific?"}
                    text={`Prolific can recruit participants to take your study. 
              The EasyEyes "Create Prolific study" button creates a new study in Prolific and fills in as many fields as possible for your experiment, 
              using your experiment URL and values for _onlineXXX parameters specified in your experiment. 
              It also takes you to Prolific, allowing you to publish the study to recruit participants, 
              who Prolific will pay and charge you for. Once the study has begun, 
              you might want to use the "Go to Prolific" button to check your study's progress. 
              You'll soon be able to monitor progress here (with less detail) through a file counter next to the "Download results" button at the bottom of the page.`}
                  />
                </div>
              </div>
            </div>
          </>
        )}

        {isRunning && pavloviaIsReady && (
          <>
            <div className="link-set">
              <div
                className="link-set-buttons"
                style={{ display: "inline-block" }}
              >
                <button
                  className="button-grey button-small"
                  onClick={async () => {
                    await downloadDataFolder(user, newRepo);
                  }}
                >
                  Download results
                </button>

                <button
                  style={{ marginLeft: "10px" }}
                  className="button-grey button-small"
                  onClick={async () => {
                    if (dataFolderLength == 0) {
                      Swal.fire({
                        icon: "error",
                        title: `No data found for ${newRepo.name}.`,
                        text: `We can't find any data for the experiment. This might due to an error, or the Pavlovia server is down. Please refresh the page or try again later.`,
                        confirmButtonColor: "#666",
                      });
                    } else {
                      Swal.fire({
                        title: `Reading data ...`,
                        allowOutsideClick: false,
                        allowEscapeKey: false,
                        didOpen: async () => {
                          Swal.showLoading(null);
                          const dataframes = await getExperimentDataFrames(
                            this.props.user,
                            this.props.newRepo
                          );
                          displayExperimentNeedsPopup(
                            dataframes,
                            this.props.newRepo
                          );
                          Swal.close();
                        },
                      });
                    }
                  }}
                >
                  Show error report
                </button>

                <span style={{ marginLeft: "10px" }}>
                  {`${dataFolderLength}`} CSV file(s) ready
                </span>
              </div>

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.3rem",
                }}
              >
                <button
                  className="button-grey button-small"
                  style={smallButtonExtraStyle}
                  onClick={async () => {
                    const {
                      user,
                      activeExperiment,
                      previousExperimentViewed,
                      projectName,
                    } = this.props;
                    const dataFolderLength = await getDataFolderCsvLength(
                      this.props.user,
                      this.props.newRepo
                    );
                    this.setState({ dataFolderLength });

                    const prolificProjectId =
                      activeExperiment !== "new"
                        ? await getPastProlificIdFromExperimentTables(
                            user,
                            activeExperiment?.name,
                            previousExperimentViewed.originalFileName
                          )
                        : user.currentExperiment.prolificWorkspaceProjectId;
                    activeExperiment !== "new"
                      ? await this.getProlificStudyStatus(
                          prolificProjectId,
                          activeExperiment.name
                        )
                      : await this.getProlificStudyStatus(
                          prolificProjectId,
                          projectName
                        );
                  }}
                >
                  Refresh
                </button>

                <Question
                  title={"Refresh Button"}
                  text={`Every 10 sec, EasyEyes counts the number of result files ready for download from Pavlovia and checks the status of the Prolific study, if any. Press Refresh to count and check now. Note that the file count can exceed the request because the (Pavlovia) file count includes local runs and the (Prolific) request does not.`}
                />
              </div>
            </div>
          </>
        )}
      </>
    );
  }
}
