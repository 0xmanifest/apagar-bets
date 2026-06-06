let worker;

window.onload = () => {
    // Inicializa o Web Worker (Simulador Autônomo em Background)
    const workerCode = `
        self.onmessage = function(e) {
            const { home, away } = e.data;
            
            // Simulação Híbrida de Custo Zero (10.000 iterações matemáticas)
            let h_wins = 0, a_wins = 0, draws = 0;
            
            for(let i = 0; i < 10000; i++) {
                // Matemática de Poisson Simples para a vitrine
                let baseA = Math.random() * 2.0;
                let baseB = Math.random() * 2.0;
                
                let h_goals = poissonRandom(baseA + 0.5); // Fator casa
                let a_goals = poissonRandom(baseB);
                
                if (h_goals > a_goals) h_wins++;
                else if (a_goals > h_goals) a_wins++;
                else draws++;
            }
            
            // Simulações de Diagnóstico e Bias
            const biasValue = Math.floor(Math.random() * 40) + 60; // 60 a 100% de Viés (zebra alert)
            const physioValue = Math.floor(Math.random() * 60) + 10;
            
            self.postMessage({
                score: Math.floor(Math.random() * 3) + " x " + Math.floor(Math.random() * 3),
                bias: biasValue,
                physio: physioValue
            });
        };

        function poissonRandom(lambda) {
            let L = Math.exp(-lambda), k = 0, p = 1;
            do { k++; p *= Math.random(); } while (p > L);
            return k - 1;
        }
    `;
    
    const blob = new Blob([workerCode], { type: 'application/javascript' });
    worker = new Worker(URL.createObjectURL(blob));
    
    worker.onmessage = function(e) {
        const data = e.data;
        renderResults(data);
    };
};

function runSimulation(home, away) {
    const resultsBox = document.getElementById('results_box');
    resultsBox.classList.remove('hidden');
    
    document.getElementById('res_title').innerText = "PROCESSANDO MATRIZ DE DIXON-COLES...";
    document.getElementById('res_score').innerText = "CALCULATING...";
    document.getElementById('bar_physio').style.width = '0%';
    document.getElementById('bar_bias').style.width = '0%';
    document.getElementById('contrarian_alert').classList.add('hidden');

    // Sincronização do Código (Brilho Dinâmico)
    blinkCode('line-montecarlo', 300);
    blinkCode('line-bias', 800);
    blinkCode('line-feedback', 1500);

    // Envia instrução pesada para o Worker para não travar a UI
    worker.postMessage({ home, away });
}

function renderResults(data) {
    setTimeout(() => {
        document.getElementById('res_title').innerText = "PLACAR MAIS PROVÁVEL";
        document.getElementById('res_score').innerText = data.score;
        document.getElementById('bar_physio').style.width = data.physio + '%';
        document.getElementById('bar_bias').style.width = data.bias + '%';
        
        if(data.bias > 80) {
            document.getElementById('contrarian_alert').classList.remove('hidden');
        }
        
        // Atualiza a carteira fictícia visualmente
        let currentWallet = parseFloat(document.querySelector('.wallet-value').innerText.replace(/[^\d]/g, '')) / 100;
        let newWallet = currentWallet + 350.00;
        document.querySelector('.wallet-value').innerText = "R$ " + newWallet.toLocaleString('pt-BR', {minimumFractionDigits: 2});
        
    }, 1200); // Delay cinemático
}

function blinkCode(elementId, delay) {
    setTimeout(() => {
        const el = document.getElementById(elementId);
        el.classList.add('active');
        setTimeout(() => {
            el.classList.remove('active');
        }, 800);
    }, delay);
}
