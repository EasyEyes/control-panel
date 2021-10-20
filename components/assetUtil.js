const pathList = [
  "/threshold/threshold/.gitignore",
  "/threshold/threshold/.gitmodules",
  "/threshold/threshold/.prettierignore",
  "/threshold/threshold/index.html",
  "/threshold/threshold/LICENSE",
  "/threshold/threshold/netlify.toml",
  "/threshold/threshold/package-lock.json",
  "/threshold/threshold/package.json",
  "/threshold/threshold/README.md",
  "/threshold/threshold/threshold.js",
  "/threshold/threshold/.github/ISSUE_TEMPLATE/bug_report.md",
  "/threshold/threshold/.github/ISSUE_TEMPLATE/feature_request.md",
  "/threshold/threshold/.husky/.gitignore",
  "/threshold/threshold/.husky/pre-commit",
  "/threshold/threshold/addons/jsQUEST.module.js",
  "/threshold/threshold/addons/jsQUEST.module.js.map",
  "/threshold/threshold/addons/legacy/preprocessor.py",
  "/threshold/threshold/addons/legacy/requirements.txt",
  "/threshold/threshold/addons/legacy/threshold.psyexp",
  "/threshold/threshold/components/bounding.js",
  "/threshold/threshold/components/consent.js",
  "/threshold/threshold/components/i18n.js",
  "/threshold/threshold/components/instructions.js",
  "/threshold/threshold/components/showAlphabet.js",
  "/threshold/threshold/components/sound.js",
  "/threshold/threshold/components/trialCounter.js",
  "/threshold/threshold/components/utils.js",
  "/threshold/threshold/css/consent.css",
  "/threshold/threshold/css/custom.css",
  "/threshold/threshold/css/instructions.css",
  "/threshold/threshold/css/showAlphabet.css",
  "/threshold/threshold/css/utils.css",
  "/threshold/threshold/psychojs/.dprint.json",
  "/threshold/threshold/psychojs/.editorconfig",
  "/threshold/threshold/psychojs/.eslintrc.cjs",
  "/threshold/threshold/psychojs/.gitignore",
  "/threshold/threshold/psychojs/CHANGELOG.md",
  "/threshold/threshold/psychojs/code-of-conduct.md",
  "/threshold/threshold/psychojs/CONTRIBUTING.md",
  "/threshold/threshold/psychojs/LICENSE.md",
  "/threshold/threshold/psychojs/package-lock.json",
  "/threshold/threshold/psychojs/package.json",
  "/threshold/threshold/psychojs/README.md",
  "/threshold/threshold/psychojs/.github/workflows/Automated Test (full).yml",
  "/threshold/threshold/psychojs/.github/workflows/Automated Test (short).yml",
  "/threshold/threshold/psychojs/docs/core_EventManager.js.html",
  "/threshold/threshold/psychojs/docs/core_GUI.js.html",
  "/threshold/threshold/psychojs/docs/core_Keyboard.js.html",
  "/threshold/threshold/psychojs/docs/core_Logger.js.html",
  "/threshold/threshold/psychojs/docs/core_MinimalStim.js.html",
  "/threshold/threshold/psychojs/docs/core_Mouse.js.html",
  "/threshold/threshold/psychojs/docs/core_PsychoJS.js.html",
  "/threshold/threshold/psychojs/docs/core_ServerManager.js.html",
  "/threshold/threshold/psychojs/docs/core_Window.js.html",
  "/threshold/threshold/psychojs/docs/core_WindowMixin.js.html",
  "/threshold/threshold/psychojs/docs/data_ExperimentHandler.js.html",
  "/threshold/threshold/psychojs/docs/data_TrialHandler.js.html",
  "/threshold/threshold/psychojs/docs/index.html",
  "/threshold/threshold/psychojs/docs/module-core.BuilderKeyResponse.html",
  "/threshold/threshold/psychojs/docs/module-core.EventManager.html",
  "/threshold/threshold/psychojs/docs/module-core.GUI.html",
  "/threshold/threshold/psychojs/docs/module-core.html",
  "/threshold/threshold/psychojs/docs/module-core.Keyboard.html",
  "/threshold/threshold/psychojs/docs/module-core.KeyPress.html",
  "/threshold/threshold/psychojs/docs/module-core.Logger.html",
  "/threshold/threshold/psychojs/docs/module-core.MinimalStim.html",
  "/threshold/threshold/psychojs/docs/module-core.Mouse.html",
  "/threshold/threshold/psychojs/docs/module-core.PsychoJS.html",
  "/threshold/threshold/psychojs/docs/module-core.ServerManager.html",
  "/threshold/threshold/psychojs/docs/module-core.Window.html",
  "/threshold/threshold/psychojs/docs/module-core.WindowMixin.html",
  "/threshold/threshold/psychojs/docs/module-data.ExperimentHandler.html",
  "/threshold/threshold/psychojs/docs/module-data.html",
  "/threshold/threshold/psychojs/docs/module-data.TrialHandler.html",
  "/threshold/threshold/psychojs/docs/module-sound.AudioClip.html",
  "/threshold/threshold/psychojs/docs/module-sound.html",
  "/threshold/threshold/psychojs/docs/module-sound.Microphone.html",
  "/threshold/threshold/psychojs/docs/module-sound.Sound.html",
  "/threshold/threshold/psychojs/docs/module-sound.SoundPlayer.html",
  "/threshold/threshold/psychojs/docs/module-sound.TonePlayer.html",
  "/threshold/threshold/psychojs/docs/module-sound.TrackPlayer.html",
  "/threshold/threshold/psychojs/docs/module-util.Clock.html",
  "/threshold/threshold/psychojs/docs/module-util.Color.html",
  "/threshold/threshold/psychojs/docs/module-util.ColorMixin.html",
  "/threshold/threshold/psychojs/docs/module-util.CountdownTimer.html",
  "/threshold/threshold/psychojs/docs/module-util.EventEmitter.html",
  "/threshold/threshold/psychojs/docs/module-util.html",
  "/threshold/threshold/psychojs/docs/module-util.MixinBuilder.html",
  "/threshold/threshold/psychojs/docs/module-util.MonotonicClock.html",
  "/threshold/threshold/psychojs/docs/module-util.PsychObject.html",
  "/threshold/threshold/psychojs/docs/module-util.Scheduler.html",
  "/threshold/threshold/psychojs/docs/module-visual.ButtonStim.html",
  "/threshold/threshold/psychojs/docs/module-visual.Form.html",
  "/threshold/threshold/psychojs/docs/module-visual.html",
  "/threshold/threshold/psychojs/docs/module-visual.ImageStim.html",
  "/threshold/threshold/psychojs/docs/module-visual.MovieStim.html",
  "/threshold/threshold/psychojs/docs/module-visual.Polygon.html",
  "/threshold/threshold/psychojs/docs/module-visual.Rect.html",
  "/threshold/threshold/psychojs/docs/module-visual.ShapeStim.html",
  "/threshold/threshold/psychojs/docs/module-visual.Slider.html",
  "/threshold/threshold/psychojs/docs/module-visual.TextBox.html",
  "/threshold/threshold/psychojs/docs/module-visual.TextStim.html",
  "/threshold/threshold/psychojs/docs/module-visual.VisualStim.html",
  "/threshold/threshold/psychojs/docs/sound_AudioClip.js.html",
  "/threshold/threshold/psychojs/docs/sound_Microphone.js.html",
  "/threshold/threshold/psychojs/docs/sound_Sound.js.html",
  "/threshold/threshold/psychojs/docs/sound_SoundPlayer.js.html",
  "/threshold/threshold/psychojs/docs/sound_TonePlayer.js.html",
  "/threshold/threshold/psychojs/docs/sound_TrackPlayer.js.html",
  "/threshold/threshold/psychojs/docs/util_Clock.js.html",
  "/threshold/threshold/psychojs/docs/util_Color.js.html",
  "/threshold/threshold/psychojs/docs/util_ColorMixin.js.html",
  "/threshold/threshold/psychojs/docs/util_EventEmitter.js.html",
  "/threshold/threshold/psychojs/docs/util_PsychObject.js.html",
  "/threshold/threshold/psychojs/docs/util_Scheduler.js.html",
  "/threshold/threshold/psychojs/docs/util_Util.js.html",
  "/threshold/threshold/psychojs/docs/visual_ButtonStim.js.html",
  "/threshold/threshold/psychojs/docs/visual_Form.js.html",
  "/threshold/threshold/psychojs/docs/visual_ImageStim.js.html",
  "/threshold/threshold/psychojs/docs/visual_MovieStim.js.html",
  "/threshold/threshold/psychojs/docs/visual_Polygon.js.html",
  "/threshold/threshold/psychojs/docs/visual_Rect.js.html",
  "/threshold/threshold/psychojs/docs/visual_ShapeStim.js.html",
  "/threshold/threshold/psychojs/docs/visual_Slider.js.html",
  "/threshold/threshold/psychojs/docs/visual_TextBox.js.html",
  "/threshold/threshold/psychojs/docs/visual_TextStim.js.html",
  "/threshold/threshold/psychojs/docs/visual_VisualStim.js.html",
  "/threshold/threshold/psychojs/docs/fonts/OpenSans-Bold-webfont.eot",
  "/threshold/threshold/psychojs/docs/fonts/OpenSans-Bold-webfont.svg",
  "/threshold/threshold/psychojs/docs/fonts/OpenSans-Bold-webfont.woff",
  "/threshold/threshold/psychojs/docs/fonts/OpenSans-BoldItalic-webfont.eot",
  "/threshold/threshold/psychojs/docs/fonts/OpenSans-BoldItalic-webfont.svg",
  "/threshold/threshold/psychojs/docs/fonts/OpenSans-BoldItalic-webfont.woff",
  "/threshold/threshold/psychojs/docs/fonts/OpenSans-Italic-webfont.eot",
  "/threshold/threshold/psychojs/docs/fonts/OpenSans-Italic-webfont.svg",
  "/threshold/threshold/psychojs/docs/fonts/OpenSans-Italic-webfont.woff",
  "/threshold/threshold/psychojs/docs/fonts/OpenSans-Light-webfont.eot",
  "/threshold/threshold/psychojs/docs/fonts/OpenSans-Light-webfont.svg",
  "/threshold/threshold/psychojs/docs/fonts/OpenSans-Light-webfont.woff",
  "/threshold/threshold/psychojs/docs/fonts/OpenSans-LightItalic-webfont.eot",
  "/threshold/threshold/psychojs/docs/fonts/OpenSans-LightItalic-webfont.svg",
  "/threshold/threshold/psychojs/docs/fonts/OpenSans-LightItalic-webfont.woff",
  "/threshold/threshold/psychojs/docs/fonts/OpenSans-Regular-webfont.eot",
  "/threshold/threshold/psychojs/docs/fonts/OpenSans-Regular-webfont.svg",
  "/threshold/threshold/psychojs/docs/fonts/OpenSans-Regular-webfont.woff",
  "/threshold/threshold/psychojs/docs/scripts/linenumber.js",
  "/threshold/threshold/psychojs/docs/scripts/prettify/Apache-License-2.0.txt",
  "/threshold/threshold/psychojs/docs/scripts/prettify/lang-css.js",
  "/threshold/threshold/psychojs/docs/scripts/prettify/prettify.js",
  "/threshold/threshold/psychojs/docs/styles/jsdoc-default.css",
  "/threshold/threshold/psychojs/docs/styles/prettify-jsdoc.css",
  "/threshold/threshold/psychojs/docs/styles/prettify-tomorrow.css",
  "/threshold/threshold/psychojs/out/psychojs-2021.3.0.css",
  "/threshold/threshold/psychojs/out/psychojs-2021.3.0.iife.js",
  "/threshold/threshold/psychojs/out/psychojs-2021.3.0.iife.js.map",
  "/threshold/threshold/psychojs/out/psychojs-2021.3.0.js",
  "/threshold/threshold/psychojs/out/psychojs-2021.3.0.js.LEGAL.txt",
  "/threshold/threshold/psychojs/out/psychojs-2021.3.0.js.map",
  "/threshold/threshold/psychojs/scripts/build.css.cjs",
  "/threshold/threshold/psychojs/scripts/build.js.cjs",
  "/threshold/threshold/psychojs/src/index.css",
  "/threshold/threshold/psychojs/src/index.js",
  "/threshold/threshold/psychojs/src/core/EventManager.js",
  "/threshold/threshold/psychojs/src/core/GUI.js",
  "/threshold/threshold/psychojs/src/core/index.js",
  "/threshold/threshold/psychojs/src/core/Keyboard.js",
  "/threshold/threshold/psychojs/src/core/Logger.js",
  "/threshold/threshold/psychojs/src/core/MinimalStim.js",
  "/threshold/threshold/psychojs/src/core/Mouse.js",
  "/threshold/threshold/psychojs/src/core/PsychoJS.js",
  "/threshold/threshold/psychojs/src/core/ServerManager.js",
  "/threshold/threshold/psychojs/src/core/Window.js",
  "/threshold/threshold/psychojs/src/core/WindowMixin.js",
  "/threshold/threshold/psychojs/src/data/ExperimentHandler.js",
  "/threshold/threshold/psychojs/src/data/index.js",
  "/threshold/threshold/psychojs/src/data/MultiStairHandler.js",
  "/threshold/threshold/psychojs/src/data/QuestHandler.js",
  "/threshold/threshold/psychojs/src/data/TrialHandler.js",
  "/threshold/threshold/psychojs/src/sound/AudioClip.js",
  "/threshold/threshold/psychojs/src/sound/AudioClipPlayer.js",
  "/threshold/threshold/psychojs/src/sound/index.js",
  "/threshold/threshold/psychojs/src/sound/Microphone.js",
  "/threshold/threshold/psychojs/src/sound/Sound.js",
  "/threshold/threshold/psychojs/src/sound/SoundPlayer.js",
  "/threshold/threshold/psychojs/src/sound/TonePlayer.js",
  "/threshold/threshold/psychojs/src/sound/TrackPlayer.js",
  "/threshold/threshold/psychojs/src/util/Clock.js",
  "/threshold/threshold/psychojs/src/util/Color.js",
  "/threshold/threshold/psychojs/src/util/ColorMixin.js",
  "/threshold/threshold/psychojs/src/util/EventEmitter.js",
  "/threshold/threshold/psychojs/src/util/index.js",
  "/threshold/threshold/psychojs/src/util/Pixi.js",
  "/threshold/threshold/psychojs/src/util/PsychObject.js",
  "/threshold/threshold/psychojs/src/util/Scheduler.js",
  "/threshold/threshold/psychojs/src/util/Util.js",
  "/threshold/threshold/psychojs/src/util/Util.test.js",
  "/threshold/threshold/psychojs/src/visual/ButtonStim.js",
  "/threshold/threshold/psychojs/src/visual/Camera.js",
  "/threshold/threshold/psychojs/src/visual/FaceDetector.js",
  "/threshold/threshold/psychojs/src/visual/Form.js",
  "/threshold/threshold/psychojs/src/visual/ImageStim.js",
  "/threshold/threshold/psychojs/src/visual/index.js",
  "/threshold/threshold/psychojs/src/visual/MovieStim.js",
  "/threshold/threshold/psychojs/src/visual/Polygon.js",
  "/threshold/threshold/psychojs/src/visual/Rect.js",
  "/threshold/threshold/psychojs/src/visual/ShapeStim.js",
  "/threshold/threshold/psychojs/src/visual/Slider.js",
  "/threshold/threshold/psychojs/src/visual/TextBox.js",
  "/threshold/threshold/psychojs/src/visual/TextInput.js",
  "/threshold/threshold/psychojs/src/visual/TextStim.js",
  "/threshold/threshold/psychojs/src/visual/VisualStim.js",
];

const getEnvironment = async () => {
  let response = await getAssetFileContent("/threshold/environment.json");
  response = JSON.parse(response);
  return response;
};

const getGitlabBodyForThreshold = async (startIndex, endIndex) => {
  const res = [];

  for (let i = startIndex; i <= endIndex; i++) {
    const path = pathList[i];
    const content = await getAssetFileContent(path);
    res.push({
      action: "create",
      file_path: path.substring(20),
      content,
    });
  }
  return res;
};

const getAssetFileContent = async (filePath) => {
  return await fetch(filePath)
    .then((response) => {
      return response.text();
    })
    .then((result) => {
      return result;
    })
    .catch((error) => {
      return error;
    });
};
