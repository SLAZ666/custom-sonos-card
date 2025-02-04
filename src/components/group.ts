import { css, html, LitElement } from 'lit';
import { property } from 'lit/decorators.js';
import { getEntityName } from '../utils';
import { HomeAssistant } from 'custom-card-helpers';
import { CardConfig } from '../types';

class Group extends LitElement {
  @property({ attribute: false }) public hass!: HomeAssistant;
  @property() config!: CardConfig;
  @property() activePlayer!: string;
  @property() group!: string;

  render() {
    const stateObj = this.hass.states[this.group];
    const currentTrack = `${stateObj.attributes.media_artist || ''} - ${
      stateObj.attributes.media_title || ''
    }`.replace(/^ - /g, '');
    return html`
      <div class="group">
        <div class="wrap ${this.activePlayer ? 'active' : ''}">
          <ul class="speakers">
            ${stateObj.attributes.sonos_group.map(
              (speaker: string) => html` <li>${getEntityName(this.hass, this.config, speaker)}</li>`,
            )}
          </ul>
          <div class="play">
            ${currentTrack
              ? html` <div class="content">
                    <span class="currentTrack">${currentTrack}</span>
                  </div>
                  ${stateObj.state === 'playing'
                    ? html`
                        <div class="player active">
                          <div class="bar"></div>
                          <div class="bar"></div>
                          <div class="bar"></div>
                        </div>
                      `
                    : ''}`
              : ''}
          </div>
        </div>
      </div>
    `;
  }

  static get styles() {
    return css`
      .group {
        padding: 0;
        margin: 0;
      }
      .group .wrap {
        border-radius: var(--sonos-int-border-radius);
        margin: 0.5rem 0;
        padding: 0.8rem;
        border: var(--sonos-int-border-width) solid var(--sonos-int-background-color);
        background-color: var(--sonos-int-background-color);
        box-shadow: var(--sonos-int-box-shadow);
      }
      .group .wrap.active {
        border: var(--sonos-int-border-width) solid var(--sonos-int-accent-color);
      }
      .group .wrap.active .speakers {
        font-weight: bold;
      }
      .group:first-child .wrap {
        margin-top: 0;
      }
      .speakers {
        margin: 0;
        padding: 0;
      }
      .speakers li:first-child::before {
        content: '';
        margin-right: 0;
      }
      .speakers li::before {
        content: '+';
        margin-right: 0.3em;
      }
      .speakers li {
        display: block;
        margin-right: 0.3rem;
        float: left;
        font-size: 1rem;
        color: var(--sonos-int-color);
        max-width: 100%;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      .group .play {
        display: flex;
        flex-direction: row;
        clear: both;
      }
      .group .play .content {
        flex: 1;
      }
      .group .play .content .currentTrack {
        display: block;
        font-size: 0.8rem;
      }
      .group .play .player {
        width: 0.55rem;
        position: relative;
      }
      .group .play .player .bar {
        background: var(--sonos-int-color);
        bottom: 0.05rem;
        height: 0.15rem;
        position: absolute;
        width: 0.15rem;
        animation: sound 0ms -800ms linear infinite alternate;
        display: none;
      }
      .group .play .player.active .bar {
        display: block;
      }
      .group .play .player .bar:nth-child(1) {
        left: 0.05rem;
        animation-duration: 474ms;
      }
      .group .play .player .bar:nth-child(2) {
        left: 0.25rem;
        animation-duration: 433ms;
      }
      .group .play .player .bar:nth-child(3) {
        left: 0.45rem;
        animation-duration: 407ms;
      }
      @keyframes sound {
        0% {
          opacity: 0.35;
          height: 0.15rem;
        }
        100% {
          opacity: 1;
          height: 1rem;
        }
      }
    `;
  }
}

customElements.define('sonos-group', Group);
