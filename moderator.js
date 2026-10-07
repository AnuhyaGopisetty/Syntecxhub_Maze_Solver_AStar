/**
 * Custom Text Classifier and Safety Validation Pipeline.
 * Combines exact blocklist matching with a Naive Bayes probabilistic model.
 */
class ContentModerator {
    constructor() {
        this.labels = { TOXIC: 0, SAFE: 1 };
        this.flaggedKeywords = ['fool', 'scam', 'idiot'];
        
        // Model metrics state matrix
        this.vocabulary = new Set();
        this.classDocumentCounts = { 0: 0, 1: 0 };
        this.wordFrequencies = { 0: {}, 1: {} };
        this.totalClassTokens = { 0: 0, 1: 0 };
        this.logPriors = { safe: 0, toxic: 0 };
        
        // Interactive audit history tracking
        this.sessionHistory = [];
    }

    // Standard cleaner and token extractor
    tokenize(rawText) {
        return rawText
            .toLowerCase()
            .replace(/[^\w\s]/g, '') // strip special characters
            .split(/\s+/)            // break into isolated string arrays
            .filter(token => token.length > 0);
    }

    // Calibrate model probabilities on startup
    train(dataset) {
        dataset.forEach(item => {
            const words = this.tokenize(item.text);
            const targetLabel = item.label;
            
            this.classDocumentCounts[targetLabel]++;

            words.forEach(word => {
                this.vocabulary.add(word);
                this.wordFrequencies[targetLabel][word] = (this.wordFrequencies[targetLabel][word] || 0) + 1;
                this.totalClassTokens[targetLabel]++;
            });
        });

        const grandTotalDocs = (this.classDocumentCounts[0] + this.classDocumentCounts[1]) || 1;
        this.logPriors.safe = Math.log((this.classDocumentCounts[1] || 1) / grandTotalDocs);
        this.logPriors.toxic = Math.log((this.classDocumentCounts[0] || 1) / grandTotalDocs);
    }

    // Probability analyzer core
    classifyText(textInput) {
        const words = this.tokenize(textInput);
        const knownWords = words.filter(word => this.vocabulary.has(word));

        // Fallback catch for completely unrecognizable strings
        if (knownWords.length === 0) {
            return this.labels.SAFE;
        }

        let safeScore = this.logPriors.safe;
        let toxicScore = this.logPriors.toxic;
        const vocabSize = this.vocabulary.size || 1;

        knownWords.forEach(word => {
            // Apply standard Laplace smoothing adjustments
            const safeCount = this.wordFrequencies[1][word] || 0;
            const safeProbability = (safeCount + 1) / (this.totalClassTokens[1] + vocabSize);
            safeScore += Math.log(safeProbability);

            const toxicCount = this.wordFrequencies[0][word] || 0;
            const toxicProbability = (toxicCount + 1) / (this.totalClassTokens[0] + vocabSize);
            toxicScore += Math.log(toxicProbability);
        });

        return safeScore > toxicScore ? this.labels.SAFE : this.labels.TOXIC;
    }
}

// Injected reference calibration dataset
const trainingCorpus = [
    { text: "I love this product, it works amazingly well!", label: 1 },
    { text: "Great customer support and fast shipping.", label: 1 },
    { text: "This is the best app ever, highly recommend.", label: 1 },
    { text: "Absolutely wonderful experience, thank you!", label: 1 },
    { text: "I am incredibly happy with this purchase.", label: 1 },
    { text: "Hello there, hope you are having a wonderful day.", label: 1 },
    { text: "Highly professional service and very friendly staff.", label: 1 },
    
    { text: "Shut up, you are completely stupid and wrong.", label: 0 },
    { text: "This service is horrible, I hate it so much.", label: 0 },
    { text: "Go away, nobody wants you here you idiot.", label: 0 },
    { text: "Worst experience ever, complete garbage product.", label: 0 },
    { text: "This is a scam and the staff are terrible people.", label: 0 },
    { text: "You are acting like a total fool and making things up.", label: 0 },
    { text: "Stop posting this garbage, you absolute troll.", label: 0 }
];

// Initialize active instance
const EngineInstance = new ContentModerator();
EngineInstance.train(trainingCorpus);

// Run local model matrix diagnostic evaluation
function runSelfTest() {
    let tp = 0, fp = 0, tn = 0, fn = 0;

    trainingCorpus.forEach(data => {
        const output = EngineInstance.classifyText(data.text);
        if (output === 1 && data.label === 1) tp++;
        if (output === 1 && data.label === 0) fp++;
        if (output === 0 && data.label === 0) tn++;
        if (output === 0 && data.label === 1) fn++;
    });

    const accuracyRate = (tp + tn) / trainingCorpus.length;
    const precisionRate = tp / (tp + fp) || 0;
    const recallRate = tp / (tp + fn) || 0;
    const f1Index = (2 * precisionRate * recallRate) / (precisionRate + recallRate) || 0;

    const statsContainer = document.getElementById('metrics-output');
    if (statsContainer) {
        statsContainer.innerHTML = `
            <div class="metric-item"><span class="metric-label">Accuracy Score</span><span class="metric-value">${(accuracyRate * 100).toFixed(2)}%</span></div>
            <div class="metric-item"><span class="metric-label">Precision Rate</span><span class="metric-value">${precisionRate.toFixed(2)}</span></div>
            <div class="metric-item"><span class="metric-label">Recall Sensitivity</span><span class="metric-value">${recallRate.toFixed(2)}</span></div>
            <div class="metric-item"><span class="metric-label">F1 Performance Index</span><span class="metric-value">${f1Index.toFixed(2)}</span></div>
        `;
    }
}

// Bind DOM control interactions safely inside event handlers
document.addEventListener("DOMContentLoaded", () => {
    const userInputBox = document.getElementById('text-input');
    const panelFeedback = document.getElementById('result-box');

    // Instantly generate diagnostic baseline stats
    runSelfTest();
    console.log("🚀 System Console: Safety engine model successfully loaded and active.");

    document.getElementById('moderate-btn').addEventListener('click', () => {
        const inputData = userInputBox.value;

        if (!inputData.trim()) {
            panelFeedback.style.display = "block";
            panelFeedback.className = "flagged";
            panelFeedback.innerText = "⚠️ Input payload stream is empty. Please enter text to moderate.";
            console.warn("⚠️ System Console: Moderate click intercepted due to blank text field.");
            return;
        }

        const rawTokens = EngineInstance.tokenize(inputData);
        const blocklistViolation = rawTokens.some(token => EngineInstance.flaggedKeywords.includes(token));

        // Level 1: Deterministic Match
        if (blocklistViolation) {
            userInputBox.value = "[WIPED FOR WORKPLACE PRIVACY]";
            panelFeedback.style.display = "block";
            panelFeedback.className = "flagged";
            panelFeedback.innerText = "❌ FLAGGED FOR REVIEW (Sensitive Keyword Policy)";
            
            EngineInstance.sessionHistory.push({ time: new Date(), input: "[HIDDEN]", flag: "BLOCKLIST" });
            console.log("❌ System Console Log: CRITICAL MATCH. String rejected by explicit word filter pipeline.");
            return;
        }

        // Level 2: Probabilistic Prediction
        const classification = EngineInstance.classifyText(inputData);
        panelFeedback.style.display = "block";

        if (classification === EngineInstance.labels.SAFE) {
            panelFeedback.className = "approved";
            panelFeedback.innerText = "✅ APPROVED (Safe / Positive Content)";
            
            EngineInstance.sessionHistory.push({ time: new Date(), input: inputData, flag: "APPROVED" });
            console.log(`✅ System Console Log: PASSED. Sentiment evaluation marked payload safe. Content: "${inputData}"`);
        } else {
            panelFeedback.className = "flagged";
            panelFeedback.innerText = "❌ FLAGGED FOR REVIEW (Toxic / Negative Content)";
            
            EngineInstance.sessionHistory.push({ time: new Date(), input: inputData, flag: "REJECTED" });
            console.log(`❌ System Console Log: FLAGGED. Sentiment evaluation identified negative markers. Content: "${inputData}"`);
        }
    });

    document.getElementById('reset-btn').addEventListener('click', () => {
        userInputBox.value = "";
        panelFeedback.style.display = "none";
        panelFeedback.className = "";
        panelFeedback.innerText = "";
        userInputBox.focus();
        console.log("🧹 System Console: Cleared interaction logs and input field structures.");
    });
});
