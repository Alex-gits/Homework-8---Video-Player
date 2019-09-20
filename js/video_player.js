// Домашнее задание:

// 1. реализовать изменение громкости

// 2. реализовать изменение скорости проигрывания видео

// 3. реализовать функционал скип вперед назад при клике на кнопки <<1s 1s>>

// 4. реализовать функционал по скипанью видео при двойном клике на правю или левую часть видео, как на ютубе

// 5. реализовать функионал перемотки видео при перетягивании полосы прокрутки вперед назад.


const VideoPlayer = (function () {

    let video = null;
    let toggleBtn = null;
    let progress = null;
    let progressWrapper = null;
    let rewindButtons = null;
    let allInputs = null;

    let clicks = 0;
    let mouseStatus = false;

    /**
     * @desc Function init
     * @param {HTMLVideoElement} videoEl video tag
     * @returns {Object}
     */

    function init(videoEl) {
        video = videoEl;

        _initTemplate();
        _setElements()
        _initEvents();

        return {
            play,
            stop
        }
    }

    function toggle() {
        const method = video.paused ? 'play' : 'pause';
        toggleBtn.textContent = video.paused ? '❚ ❚' : '►'
        video[method]();
    }


    function play() {
        video.play();
    }

    function stop() {
        video.currentTime = 0;
        video.pause();
    }

    function _initTemplate() {
        const parent = video.parentElement;

        const playerWrapper = _playerWrapperTemplate();
        const controlsTemplate = _controlsTemplate();

        playerWrapper.appendChild(video);
        playerWrapper.insertAdjacentHTML('beforeend', controlsTemplate);
        parent.insertAdjacentElement('afterbegin', playerWrapper);
    }

    function _playerWrapperTemplate() {
        const playerWrapper = document.createElement('div');
        playerWrapper.classList.add('player');
        return playerWrapper;
    }

    function _controlsTemplate() {
        return `
        <div class="player__controls">
        <div class="progress" value="1">
          <div class="progress__filled"></div>
        </div>
        <button class="player__button toggle" title="Toggle Play">►</button>
        <input type="range" name="volume" class="player__slider" min=0 max="1" step="0.05" value="1">
        <input type="range" name="playbackRate" class="player__slider" min="0.5" max="2" step="0.1" value="1">
        <button data-skip="-1" class="player__button">« 1s</button>
        <button data-skip="1" class="player__button">1s »</button>
      </div>
      `;
    }

    function _setElements() {
        toggleBtn = document.querySelector('.toggle');
        progress = document.querySelector('.progress__filled');
        progressWrapper = document.querySelector('.progress');
        rewindButtons = document.querySelectorAll('button[data-skip]');
        allInputs = document.querySelectorAll('input[type=range]');
    }

    function handleProgress() {
        const percent = (video.currentTime / video.duration) * 100;
        progress.style.flexBasis = `${percent}%`
    }

    function _scrub(e) {
        video.currentTime = (e.offsetX / progressWrapper.offsetWidth) * video.duration;
    }


    // ---------------------------------------------------------------------------------------------------
    // 1, 2 Функция для изменения громкости и скорости воспроизведения.

    function setVolumeAndPlaybackRate() {
        if (this.name === "volume") {
            video.volume = this.value;
        } else {
            video.playbackRate = this.value;
        }
    }

    // 3. Функция для скипа вперед и назад по клику по соответствующим кнопкам

    function rewind() {
        video.currentTime += parseInt(this.dataset.skip);
    }

    // 4. Функция для перемотки вперед/назад по дабл клику по правой/левой стороне плеера

    function doubleClickRewind(event) {

        if (event.offsetX > video.videoWidth / 2) {
            video.currentTime += 1;
        } else {
            video.currentTime -= 1.3; // Сделал 1.3, ибо при дабл клике по ощущениям как-то медленее перемотка назад срабатывает при включенном видео. Возможно, из-за таймаута, не знаю
        }
    }

    // Функция для отслеживания количества кликов

    function trackClicks(event) {
        clicks++;

        if (clicks === 1) {
            setTimeout(function () {
                if (clicks === 1) {
                    toggle();
                } else {
                    doubleClickRewind(event);
                }
                clicks = 0;
            }, 350);
        }
    }

    function _initEvents() {
        toggleBtn.addEventListener('click', toggle);
        video.addEventListener('click', trackClicks);
        video.addEventListener('timeupdate', handleProgress);
        progressWrapper.addEventListener('click', _scrub);
        allInputs.forEach((el) => el.addEventListener('input', setVolumeAndPlaybackRate));
        rewindButtons.forEach((el) => el.addEventListener('click', rewind));

        // 5. Ивенты для перемотки с зажатой кнопкой мыши:

        progressWrapper.addEventListener('mousemove', (e) => mouseStatus && _scrub(e));
        progressWrapper.addEventListener('mousedown', () => mouseStatus = true);
        progressWrapper.addEventListener('mouseup', () => mouseStatus = false);
    }

    return {
        init
    }
}());

const video = document.querySelector('.player__video');
const player1 = VideoPlayer.init(video);