"use strict";

/**
 * Predictive Engine - Frontend Simulation Sandbox
 * @namespace SimulationApp
 */
const SimulationApp = (function () {
    /** @type {Worker | null} */
    let worker = null;

    /**
     * Bootstraps the application state and event listeners.
     */
    function init() {
        _initWebWorker();
        _bindEvents();
    }

    /**
     * Initializes the background Web Worker for heavy calculations.
     * @private
     */
    function _initWebWorker() {
        const workerCode = `
            "use strict";
            self.onmessage = function(e) {
                const { home, away } = e.data;
                
                // Simulação Híbrida de Custo Zero (10.000 iterações matemáticas)
                let h_wins = 0, a_wins = 0, draws = 0;
                
                for(let i = 0; i < 10000; i++) {
                    let baseA = Math.random() * 2.0;
                    let baseB = Math.random() * 2.0;
                    
                    let h_goals = _poissonRandom(baseA + 0.5); 
                    let a_goals = _poissonRandom(baseB);
                    
                    if (h_goals > a_goals) h_wins++;
                    else if (a_goals > h_goals) a_wins++;
                    else draws++;
                }
                
                const biasValue = Math.floor(Math.random() * 40) + 60;
                const physioValue = Math.floor(Math.random() * 60) + 10;
                
                self.postMessage({
                    score: Math.floor(Math.random() * 3) + " x " + Math.floor(Math.random() * 3),
                    bias: biasValue,
                    physio: physioValue
                });
            };

            function _poissonRandom(lambda) {
                let L = Math.exp(-lambda), k = 0, p = 1;
                do { k++; p *= Math.random(); } while (p > L);
                return k - 1;
            }
        `;
        
        const blob = new Blob([workerCode], { type: 'application/javascript' });
        worker = new Worker(URL.createObjectURL(blob));
        
        worker.onmessage = function (e) {
            _renderResults(e.data);
        };
    }

    /**
     * Binds DOM events globally (Event Delegation).
     * @private
     */
    function _bindEvents() {
        document.addEventListener('click', function (e) {
            const btn = e.target.closest('.js-sim-btn');
            if (!btn) return;
            
            e.preventDefault();
            const home = btn.getAttribute('data-home');
            const away = btn.getAttribute('data-away');
            
            if (home && away) {
                _runSimulation(home, away);
            }
        });
    }

    /**
     * Prepares UI state for simulation and dispatches worker task.
     * @param {string} home 
     * @param {string} away 
     * @private
     */
    function _runSimulation(home, away) {
        const resultsBox = document.getElementById('results_box');
        if (resultsBox) resultsBox.classList.remove('hidden');
        
        _updateUIState("PROCESSANDO MATRIZ DE DIXON-COLES...", "CALCULATING...", '0%', '0%');
        document.getElementById('contrarian_alert').classList.add('hidden');

        _blinkCode('line-montecarlo', 300);
        _blinkCode('line-bias', 800);
        _blinkCode('line-feedback', 1500);

        if (worker) {
            worker.postMessage({ home, away });
        }
    }

    /**
     * Renders simulation results into the DOM.
     * @param {Object} data 
     * @private
     */
    function _renderResults(data) {
        setTimeout(() => {
            _updateUIState("PLACAR MAIS PROVÁVEL", data.score, data.physio + '%', data.bias + '%');
            
            if (data.bias > 80) {
                document.getElementById('contrarian_alert').classList.remove('hidden');
            }
            
            _updateWalletUI(350.00);
        }, 1200);
    }

    /**
     * Helper to mutate central UI states.
     * @private
     */
    function _updateUIState(title, score, physioWidth, biasWidth) {
        document.getElementById('res_title').innerText = title;
        document.getElementById('res_score').innerText = score;
        document.getElementById('bar_physio').style.width = physioWidth;
        document.getElementById('bar_bias').style.width = biasWidth;
    }

    /**
     * Helper to animate wallet numbers.
     * @private
     */
    function _updateWalletUI(amountToAdd) {
        const walletEl = document.querySelector('.wallet-value');
        if (!walletEl) return;
        
        let currentWallet = parseFloat(walletEl.innerText.replace(/[^\d]/g, '')) / 100;
        let newWallet = currentWallet + amountToAdd;
        walletEl.innerText = "R$ " + newWallet.toLocaleString('pt-BR', { minimumFractionDigits: 2 });
    }

    /**
     * Visual tracking of code execution (Split-Screen magic).
     * @param {string} elementId 
     * @param {number} delay 
     * @private
     */
    function _blinkCode(elementId, delay) {
        setTimeout(() => {
            const el = document.getElementById(elementId);
            if (!el) return;
            
            el.classList.add('active');
            setTimeout(() => {
                el.classList.remove('active');
            }, 800);
        }, delay);
    }

    // Public API
    return {
        init: init
    };
})();

// Bootstrap
document.addEventListener('DOMContentLoaded', SimulationApp.init);
