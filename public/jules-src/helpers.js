/**
 * helpers.js — Yardımcı widget metodları
 * _getFavCount · _getAllFavCards · _scrollToBottom
 * _startEmojiCycle · _updateEmoji · _fetchWeather
 */
import { ICO }                              from './icons.js';
import { weatherIconHtml, getSunLabel }     from './utils.js';
import { EMOJIS }                           from './constants.js';

export function _getFavCount() {
  let count = 0;
  this._st.panelSessions.forEach(s => {
    s.cards.forEach(c => {
      if (this._st.likedCards.has(s.id + '-' + c.id)) count++;
    });
  });
  return count;
}

export function _getAllFavCards() {
  const all = [];
  this._st.panelSessions.forEach(s => {
    s.cards.forEach(c => {
      if (this._st.likedCards.has(s.id + '-' + c.id)) all.push({ card: c, sessionId: s.id });
    });
  });
  return all;
}

export function _scrollToBottom() {
  clearTimeout(this._timers.scroll);
  this._timers.scroll = setTimeout(() => {
    const bottom = this._shadow.getElementById('jw-bottom');
    if (bottom) bottom.scrollIntoView({ behavior: 'smooth' });
  }, 60);
}

// ── Emoji Cycling ──────────────────────────────────────────────────────────────
export function _startEmojiCycle() {
  const self = this;
  const step = () => {
    self._timers.emoji1 = setTimeout(() => {
      self._st.emojiPhase = 'out';
      self._updateEmoji();
      self._timers.emoji2 = setTimeout(() => {
        self._st.emojiIndex = (self._st.emojiIndex + 1) % EMOJIS.length;
        self._st.emojiPhase = 'in';
        self._updateEmoji();
        self._timers.emoji3 = setTimeout(() => {
          self._st.emojiPhase = 'visible';
          self._updateEmoji();
          step();
        }, 180);
      }, 180);
    }, 1088);
  };
  step();
}

export function _updateEmoji() {
  const inner = this._shadow.getElementById('jw-emoji-inner');
  if (!inner) return;
  const cur = EMOJIS[this._st.emojiIndex];
  const ps  = this._getEmojiStyle(this._st.emojiPhase);
  if (cur === 'BOT_ICON') {
    inner.innerHTML = '<div style="' + ps + 'will-change:transform;"><div style="width:36px;height:36px;border-radius:12px;display:flex;align-items:center;justify-content:center;background:var(--jules-secondary);"><span style="color:white;">' + ICO.Bot(18) + '</span></div></div>';
  } else {
    inner.innerHTML = '<span style="font-size:28px;line-height:1;display:block;user-select:none;will-change:transform;' + ps + '">' + cur + '</span>';
  }
}

// ── Weather ────────────────────────────────────────────────────────────────────
export function _fetchWeather() {
  const self = this;

  const applyWeather = () => {
    const wi      = self._st.weatherInfo;
    const dateRow = self._shadow.getElementById('jw-date-row');
    if (!dateRow) { self._build(); return; }

    const oldW = self._shadow.getElementById('jw-weather-row');
    const oldS = self._shadow.getElementById('jw-sun-row');
    if (oldW) oldW.remove();
    if (oldS) oldS.remove();

    const wRow = document.createElement('div');
    wRow.id = 'jw-weather-row';
    wRow.style.cssText = 'display:flex;align-items:center;gap:4px;flex-shrink:0;';
    wRow.innerHTML = weatherIconHtml(wi.code, 'var(--jw-accent-color)', 14) +
      '<span style="font-size:10px;color:var(--jw-text-secondary);white-space:nowrap;">' + wi.temp + '°C</span>';
    dateRow.appendChild(wRow);

    const sunLabel = getSunLabel(wi);
    if (sunLabel && !self._st.isMobile) {
      const sunRow = document.createElement('div');
      sunRow.id = 'jw-sun-row';
      sunRow.style.cssText = 'display:flex;align-items:center;gap:4px;flex-shrink:0;';
      sunRow.innerHTML = '<span style="color:var(--jw-accent-color);display:inline-flex;">' + ICO.SunHorizon(12) + '</span>' +
        '<span style="font-size:10px;color:var(--jw-text-secondary);white-space:nowrap;">' + sunLabel.label + '</span>';
      dateRow.appendChild(sunRow);
    }
  };

  const fallback = () => {
    self._st.weatherInfo = { temp: 13, code: 2, sunrise: '06:48', sunset: '18:23' };
    applyWeather();
  };

  if (!navigator.geolocation) { fallback(); return; }
  navigator.geolocation.getCurrentPosition(
    pos => {
      const lat = pos.coords.latitude, lon = pos.coords.longitude;
      const url = 'https://api.open-meteo.com/v1/forecast?latitude=' + lat + '&longitude=' + lon +
        '&current=temperature_2m,weather_code&daily=sunrise,sunset&timezone=auto&forecast_days=1';
      fetch(url).then(r => r.json()).then(data => {
        self._st.weatherInfo = {
          temp:    Math.round(data.current.temperature_2m),
          code:    data.current.weather_code,
          sunrise: data.daily.sunrise[0].split('T')[1].slice(0, 5),
          sunset:  data.daily.sunset[0].split('T')[1].slice(0, 5),
        };
        applyWeather();
      }).catch(fallback);
    },
    fallback
  );
}
