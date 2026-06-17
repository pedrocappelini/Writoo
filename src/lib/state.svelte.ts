export const appState = $state({
  scene: 'welcome' as 'welcome' | 'editor',
  projectName: '',
  content: ''
});

export function resetToWelcome() {
  appState.scene = 'welcome';
  appState.projectName = '';
  appState.content = '';
}
