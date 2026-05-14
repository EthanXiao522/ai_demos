(function () {
    'use strict';

    // ========== DOM Elements ==========
    const phoneInput = document.getElementById('phone');
    const phoneError = document.getElementById('phone-error');
    const passwordInput = document.getElementById('password');
    const passwordError = document.getElementById('password-error');
    const togglePasswordBtn = document.getElementById('toggle-password');
    const loginBtn = document.getElementById('login-btn');
    const toast = document.getElementById('toast');

    // Slider captcha
    const sliderCaptcha = document.getElementById('slider-captcha');
    const sliderThumbWrapper = document.getElementById('slider-thumb-wrapper');
    const sliderThumb = document.getElementById('slider-thumb');
    const sliderProgress = document.getElementById('slider-progress');
    const sliderHint = document.getElementById('slider-hint');
    const sliderSuccessIcon = document.getElementById('slider-success-icon');
    const captchaStatus = document.getElementById('captcha-status');

    // ========== State ==========
    let captchaVerified = false;
    let isDragging = false;
    let startX = 0;
    let currentTranslateX = 0;
    let maxTranslateX = 0;

    // ========== Toast ==========
    let toastTimer = null;

    function showToast(message, type) {
        if (toastTimer) {
            clearTimeout(toastTimer);
        }
        toast.textContent = message;
        toast.className = 'toast ' + type + ' show';
        toastTimer = setTimeout(function () {
            toast.classList.remove('show');
            toastTimer = null;
        }, 2500);
    }

    // ========== Validation ==========
    function validatePhone() {
        const value = phoneInput.value.replace(/\s/g, '');
        if (!value) {
            phoneError.textContent = '请输入手机号';
            return false;
        }
        if (!/^1[3-9]\d{9}$/.test(value)) {
            phoneError.textContent = '手机号格式不正确';
            return false;
        }
        phoneError.textContent = '';
        return true;
    }

    function validatePassword() {
        const value = passwordInput.value;
        if (!value) {
            passwordError.textContent = '请输入密码';
            return false;
        }
        if (value.length < 6) {
            passwordError.textContent = '密码长度不能少于6位';
            return false;
        }
        passwordError.textContent = '';
        return true;
    }

    function canLogin() {
        return validatePhone() && validatePassword() && captchaVerified;
    }

    function updateLoginButton() {
        if (canLogin()) {
            loginBtn.disabled = false;
        } else {
            loginBtn.disabled = true;
        }
    }

    // ========== Phone Input ==========
    phoneInput.addEventListener('input', function (e) {
        let value = this.value.replace(/\D/g, '');
        if (value.length > 11) {
            value = value.slice(0, 11);
        }
        this.value = value;
        if (phoneError.textContent) {
            validatePhone();
        }
        updateLoginButton();
    });

    phoneInput.addEventListener('blur', function () {
        if (this.value) {
            validatePhone();
        }
        updateLoginButton();
    });

    // ========== Password Toggle ==========
    togglePasswordBtn.addEventListener('click', function () {
        const isVisible = passwordInput.type === 'text';
        if (isVisible) {
            passwordInput.type = 'password';
            this.classList.remove('visible');
        } else {
            passwordInput.type = 'text';
            this.classList.add('visible');
        }
    });

    passwordInput.addEventListener('input', function () {
        if (passwordError.textContent) {
            validatePassword();
        }
        updateLoginButton();
    });

    passwordInput.addEventListener('blur', function () {
        if (this.value) {
            validatePassword();
        }
        updateLoginButton();
    });

    // ========== Slider Captcha ==========
    function getMaxTranslateX() {
        var trackWidth = sliderCaptcha.clientWidth;
        var thumbWidth = sliderThumbWrapper.clientWidth;
        return trackWidth - thumbWidth;
    }

    function setSliderPosition(translateX) {
        currentTranslateX = Math.max(0, Math.min(translateX, maxTranslateX));
        sliderThumbWrapper.style.transform = 'translateX(' + currentTranslateX + 'px)';
        sliderThumbWrapper.style.left = '0';

        var progressWidth = currentTranslateX + sliderThumbWrapper.clientWidth / 2;
        sliderProgress.style.width = progressWidth + 'px';
    }

    function resetSlider() {
        setSliderPosition(0);
        captchaVerified = false;
        sliderCaptcha.classList.remove('verified');
        captchaStatus.textContent = '';
        updateLoginButton();
    }

    function completeVerification() {
        setSliderPosition(maxTranslateX);
        captchaVerified = true;
        sliderCaptcha.classList.add('verified');
        captchaStatus.textContent = '✓ 验证通过';
        updateLoginButton();
    }

    // Mouse Events
    sliderThumb.addEventListener('mousedown', function (e) {
        if (captchaVerified) return;
        e.preventDefault();
        isDragging = true;
        maxTranslateX = getMaxTranslateX();
        startX = e.clientX - currentTranslateX;
        sliderThumbWrapper.style.transition = 'none';
        sliderProgress.style.transition = 'none';
    });

    document.addEventListener('mousemove', function (e) {
        if (!isDragging) return;
        e.preventDefault();
        var translateX = e.clientX - startX;
        setSliderPosition(translateX);
    });

    document.addEventListener('mouseup', function () {
        if (!isDragging) return;
        isDragging = false;
        sliderThumbWrapper.style.transition = 'transform 0.3s cubic-bezier(0.25, 0.8, 0.25, 1.2)';
        sliderProgress.style.transition = 'width 0.3s cubic-bezier(0.25, 0.8, 0.25, 1.2)';

        if (currentTranslateX >= maxTranslateX - 3) {
            completeVerification();
        } else {
            resetSlider();
        }
    });

    // Touch Events
    sliderThumb.addEventListener('touchstart', function (e) {
        if (captchaVerified) return;
        e.preventDefault();
        isDragging = true;
        maxTranslateX = getMaxTranslateX();
        startX = e.touches[0].clientX - currentTranslateX;
        sliderThumbWrapper.style.transition = 'none';
        sliderProgress.style.transition = 'none';
    }, { passive: false });

    document.addEventListener('touchmove', function (e) {
        if (!isDragging) return;
        e.preventDefault();
        var translateX = e.touches[0].clientX - startX;
        setSliderPosition(translateX);
    }, { passive: false });

    document.addEventListener('touchend', function () {
        if (!isDragging) return;
        isDragging = false;
        sliderThumbWrapper.style.transition = 'transform 0.3s cubic-bezier(0.25, 0.8, 0.25, 1.2)';
        sliderProgress.style.transition = 'width 0.3s cubic-bezier(0.25, 0.8, 0.25, 1.2)';

        if (currentTranslateX >= maxTranslateX - 3) {
            completeVerification();
        } else {
            resetSlider();
        }
    });

    function initMaxTranslateX() {
        maxTranslateX = getMaxTranslateX();
    }

    window.addEventListener('load', initMaxTranslateX);
    window.addEventListener('resize', function () {
        initMaxTranslateX();
        if (captchaVerified) {
            setSliderPosition(maxTranslateX);
        } else {
            setSliderPosition(0);
        }
    });

    // ========== Login Submit ==========
    loginBtn.addEventListener('click', function () {
        if (!canLogin()) {
            validatePhone();
            validatePassword();
            if (!captchaVerified) {
                showToast('请先完成滑动验证', 'error');
            } else {
                showToast('请完善登录信息', 'error');
            }
            return;
        }

        // Simulate login
        loginBtn.disabled = true;
        loginBtn.textContent = '登录中...';

        setTimeout(function () {
            showToast('登录成功，欢迎回来！', 'success');
            loginBtn.textContent = '登 录';

            // Reset form after successful login (demo)
            setTimeout(function () {
                phoneInput.value = '';
                passwordInput.value = '';
                passwordInput.type = 'password';
                togglePasswordBtn.classList.remove('visible');
                resetSlider();
                loginBtn.disabled = true;
            }, 1500);
        }, 1200);
    });

    // ========== Init ==========
    initMaxTranslateX();
})();
