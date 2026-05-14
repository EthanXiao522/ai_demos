(function () {
    'use strict';

    const KEY = 'web_counter';
    const valueEl = document.getElementById('counter-value');
    const incBtn = document.getElementById('counter-inc');
    const resetBtn = document.getElementById('counter-reset');
    const toast = document.getElementById('toast');

    let toastTimer = null;
    function showToast(msg, type) {
        if (!toast) return;
        if (toastTimer) clearTimeout(toastTimer);
        toast.textContent = msg;
        toast.className = 'toast show ' + (type || '');
        toastTimer = setTimeout(function () {
            toast.classList.remove('show');
            toastTimer = null;
        }, 2000);
    }

    function getCounter() {
        return parseInt(localStorage.getItem(KEY) || '0', 10);
    }

    function setCounter(v) {
        localStorage.setItem(KEY, String(v));
        render();
    }

    function render() {
        if (valueEl) valueEl.textContent = getCounter();
    }

    function increment() { setCounter(getCounter() + 1); }
    function reset() { setCounter(0); }

    if (incBtn) incBtn.addEventListener('click', function () {
        increment();
        showToast('+1', 'success');
    });

    if (resetBtn) resetBtn.addEventListener('click', function () {
        reset();
        showToast('已重置', 'success');
    });

    render();
})();
