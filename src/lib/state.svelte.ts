export const appState = $state({
  scene: "welcome" as "welcome" | "editor",
  projectName: "",
  projectPath: null as string | null,
  files: [] as string[],
  currentFile: null as string | null,
  content: "",
  lastActiveProject: null as {
    projectName: string;
    projectPath: string | null;
    files: string[];
    currentFile: string | null;
    content: string;
  } | null,
  isDirty: false,
  sidebarWidth: 256,
  triggerSave: () => {},
});

export function resetToWelcome() {
  if (appState.scene === "editor") {
    appState.lastActiveProject = {
      projectName: appState.projectName,
      projectPath: appState.projectPath,
      files: [...appState.files],
      currentFile: appState.currentFile,
      content: appState.content,
    };
  }
  appState.scene = "welcome";
}
