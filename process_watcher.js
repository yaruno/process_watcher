const shell = require('shelljs');
const processBName = 'ProcessB'; // Replace with your actual Process B name
const processAName = 'ProcessA'; // Replace with your actual Process A name
let lastKnownPid = null;

function getProcessInfo(processName) {
    const result = shell.exec(`pm2 jlist`, { silent: true });
    const processes = JSON.parse(result);
    return processes.find(p => p.name === processName);
}

function monitorProcessB() {
    const processBInfo = getProcessInfo(processBName);
    
    if (processBInfo && processBInfo.pid !== lastKnownPid) {
        // Process B has restarted
        console.log(`Detected restart of ${processBName}. Restarting ${processAName}.`);
        shell.exec(`pm2 restart ${processAName}`);
        lastKnownPid = processBInfo.pid;
    } else {
        console.log(`No restart detected for ${processBName}.`);
    }
}

// Initial check to set the last known PID
const initialProcessBInfo = getProcessInfo(processBName);
if (initialProcessBInfo) {
    lastKnownPid = initialProcessBInfo.pid;
}

// Monitor Process B every 1 seconds
setInterval(monitorProcessB, 1000);
