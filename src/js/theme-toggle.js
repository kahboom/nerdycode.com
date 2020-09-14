// For syntax highlighting only
const html = String.raw;

class ThemeToggle extends HTMLElement {
  constructor() {
    super();

    this.STORAGE_KEY = 'user-color-scheme';
    this.COLOR_MODE_KEY = '--color-mode';
  }

  connectedCallback() {
    this.render();
  }

  getCSSCustomProp(propKey) {
    let response = getComputedStyle(document.documentElement).getPropertyValue(propKey);

    // Tidy up the string if there’s something to work with
    if (response.length) {
      response = response.replace(/\'|"/g, '').trim();
    }

    // Return the string response by default
    return response;
  }

  applySetting(passedSetting) {
    let currentSetting = passedSetting || localStorage.getItem(this.STORAGE_KEY);

    if (currentSetting) {
      document.documentElement.setAttribute('data-user-color-scheme', currentSetting);
      this.setButtonLabelAndStatus(currentSetting);
    } else {
      this.setButtonLabelAndStatus(this.getCSSCustomProp(this.COLOR_MODE_KEY));
    }
  }

  // Setting is invisible to the user
  toggleSetting() {
    let currentSetting = localStorage.getItem(this.STORAGE_KEY);

    switch (currentSetting) {
      case null:
        currentSetting =
          this.getCSSCustomProp(this.COLOR_MODE_KEY) === 'dark' ? 'light' : 'dark';
        break;
      case 'light':
        currentSetting = 'dark';
        break;
      case 'dark':
        currentSetting = 'light';
        break;
    }

    localStorage.setItem(this.STORAGE_KEY, currentSetting);

    return currentSetting;
  }

  setButtonLabelAndStatus(currentSetting) {
    // Visible to the user
    /*
    this.modeToggleButton.innerText = `${
      currentSetting === 'dark' ? 'Light' : 'Dark'
    } theme`;
     */
    this.modeToggleText.innerText = `${
      currentSetting === 'dark' ? 'Light' : 'Dark'
    } theme`;

    // Not visible to the user
    this.modeStatusElement.innerText = `Color mode is now "${currentSetting}"`;
  }

  render() {
    this.innerHTML = html`
      <div class="[ theme-toggle ] [ md:ta-right gap-top-500 ]">
        <div role="status" class="[ visually-hidden ][ js-mode-status ]"></div>
        <button class="[ button ] [ font-base text-base weight-bold ] [ js-mode-toggle ]">
          <span class="[ toggle-button__text ] [ js-mode-toggle-text ]">Enable dark mode</span>
          <span class="toggle-button__icon" aria-hidden="true"></span>
        </button>
      </div>
    `;

    this.afterRender();
  }

  afterRender() {
    this.modeToggleButton = document.querySelector('.js-mode-toggle');
    this.modeToggleText = document.querySelector('.js-mode-toggle-text');
    this.modeStatusElement = document.querySelector('.js-mode-status');

    this.modeToggleButton.addEventListener('click', evt => {
      evt.preventDefault();

      this.applySetting(this.toggleSetting());
    });

    this.applySetting();
  }
}

if ('customElements' in window) {
  customElements.define('theme-toggle', ThemeToggle);
}

export default ThemeToggle;
