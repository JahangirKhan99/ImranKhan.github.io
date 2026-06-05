// ─── Amount to Words ───
function convertAmount() {
    let num = document.getElementById("amount").value;
    document.getElementById("amountWords").innerText = num ? numberToWords(num) + " Rupees Only" : "";
}

function numberToWords(num) {
    const a = ["","One","Two","Three","Four","Five","Six","Seven","Eight","Nine","Ten",
        "Eleven","Twelve","Thirteen","Fourteen","Fifteen","Sixteen","Seventeen","Eighteen","Nineteen"];
    const b = ["","","Twenty","Thirty","Forty","Fifty","Sixty","Seventy","Eighty","Ninety"];
    num = parseInt(num);
    if (num < 20) return a[num];
    if (num < 100) return b[Math.floor(num/10)] + (num%10 ? " " + a[num%10] : "");
    if (num < 1000) return a[Math.floor(num/100)] + " Hundred" + (num%100 ? " " + numberToWords(num%100) : "");
    if (num < 1000000) return numberToWords(Math.floor(num/1000)) + " Thousand" + (num%1000 ? " " + numberToWords(num%1000) : "");
    return num;
}

function getDateStr() {
    const date = new Date();
    let day = String(date.getDate()).padStart(2,'0');
    let month = String(date.getMonth()+1).padStart(2,'0');
    let year = date.getFullYear();
    return `${day}/${month}/${year}`;
}

function validateForm() {
    const name = document.getElementById("name").value.trim();
    const address = document.getElementById("address").value.trim();
    const amount = document.getElementById("amount").value.trim();
    if (!name) { alert("Naam darj karein!"); document.getElementById("name").focus(); return false; }
    if (!address) { alert("Tehsil darj karein!"); document.getElementById("address").focus(); return false; }
    if (!amount || parseInt(amount) <= 0) { alert("Sahi raqam darj karein!"); document.getElementById("amount").focus(); return false; }
    return true;
}

async function buildPDF() {
    const pdfUrl = "PassportChallanForm.pdf";
    const existingPdfBytes = await fetch(pdfUrl).then(res => res.arrayBuffer());
    const { PDFDocument, rgb } = PDFLib;
    const pdfDoc = await PDFDocument.load(existingPdfBytes);
    const pages = pdfDoc.getPages();
    const firstPage = pages[0];
    const tareh = getDateStr();
    const name = document.getElementById("name").value.trim();
    const address = document.getElementById("address").value.trim();
    const amount = document.getElementById("amount").value.trim();
    const amountWords = numberToWords(amount);
    firstPage.drawText(` ${tareh}`,      { x: 100, y: 490, size: 14, color: rgb(0,0,0) });
    firstPage.drawText(`${name}`,        { x: 100, y: 464, size: 14, color: rgb(0,0,0) });
    firstPage.drawText(` ${address}`,    { x: 330, y: 440, size: 14, color: rgb(0,0,0) });
    firstPage.drawText(`${amount}/-`,    { x: 290, y: 250, size: 14, color: rgb(0,0,0) });
    firstPage.drawText(`${amount}/-`,    { x: 290, y: 105, size: 14, color: rgb(0,0,0) });
    firstPage.drawText(`${amountWords}`, { x: 110, y: 88,  size: 11, color: rgb(0,0,0) });
    firstPage.drawText(` ${tareh}`,      { x: 470, y: 490, size: 14, color: rgb(0,0,0) });
    firstPage.drawText(`${name}`,        { x: 490, y: 464, size: 14, color: rgb(0,0,0) });
    firstPage.drawText(` ${address}`,    { x: 720, y: 440, size: 14, color: rgb(0,0,0) });
    firstPage.drawText(`${amount}/-`,    { x: 680, y: 250, size: 14, color: rgb(0,0,0) });
    firstPage.drawText(`${amount}/-`,    { x: 680, y: 105, size: 14, color: rgb(0,0,0) });
    firstPage.drawText(`${amountWords}`, { x: 500, y: 88,  size: 11, color: rgb(0,0,0) });
    return await pdfDoc.save();
}

async function handleDownload() {
    if (!validateForm()) return;
    const name = document.getElementById("name").value.trim();
    const address = document.getElementById("address").value.trim();
    const amount = document.getElementById("amount").value.trim();
    try {
        const pdfBytes = await buildPDF();
        const blob = new Blob([pdfBytes], { type: "application/pdf" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `Challan_${name}.pdf`;
        link.click();
        saveToHistory(name, address, amount);
    } catch(e) {
        alert("PDF load nahi hui. PassportChallanForm.pdf folder mein rakhein.");
    }
}

async function handlePrint() {
    if (!validateForm()) return;
    const name = document.getElementById("name").value.trim();
    const address = document.getElementById("address").value.trim();
    const amount = document.getElementById("amount").value.trim();
    try {
        const pdfBytes = await buildPDF();
        const blob = new Blob([pdfBytes], { type: "application/pdf" });
        const url = URL.createObjectURL(blob);

        // New tab mein kholo — PDF viewer bypass hoga, seedha print dialog
        const printWindow = window.open(url, '_blank');
        if (printWindow) {
            printWindow.addEventListener('load', function() {
                printWindow.focus();
                printWindow.print();
                // Print hone ke baad tab band
                printWindow.addEventListener('afterprint', function() {
                    printWindow.close();
                    URL.revokeObjectURL(url);
                });
            });
        } else {
            // Popup block ho to iframe fallback
            const iframe = document.createElement("iframe");
            iframe.style.cssText = "position:fixed;left:-9999px;top:-9999px;width:0;height:0;border:none;";
            iframe.src = url;
            document.body.appendChild(iframe);
            iframe.onload = function() {
                iframe.contentWindow.focus();
                iframe.contentWindow.print();
                setTimeout(() => { document.body.removeChild(iframe); URL.revokeObjectURL(url); }, 20000);
            };
        }
        saveToHistory(name, address, amount);
    } catch(e) {
        alert("PDF load nahi hui. PassportChallanForm.pdf folder mein rakhein.");
    }
}

async function fillPDF() {
    if (!validateForm()) return;
    const name = document.getElementById("name").value.trim();
    const address = document.getElementById("address").value.trim();
    const amount = document.getElementById("amount").value.trim();
    try {
        const pdfBytes = await buildPDF();
        const blob = new Blob([pdfBytes], { type: "application/pdf" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `Challan_${name}.pdf`;
        link.click();
        const printWindow = window.open(url, '_blank');
        if (printWindow) {
            printWindow.addEventListener('load', function() {
                printWindow.focus();
                printWindow.print();
                printWindow.addEventListener('afterprint', function() {
                    printWindow.close();
                    URL.revokeObjectURL(url);
                });
            });
        } else {
            const iframe = document.createElement("iframe");
            iframe.style.cssText = "position:fixed;left:-9999px;top:-9999px;width:0;height:0;border:none;";
            iframe.src = url;
            document.body.appendChild(iframe);
            iframe.onload = function() {
                iframe.contentWindow.focus();
                iframe.contentWindow.print();
                setTimeout(() => { document.body.removeChild(iframe); URL.revokeObjectURL(url); }, 20000);
            };
        }
        saveToHistory(name, address, amount);
    } catch(e) {
        alert("PDF load nahi hui. PassportChallanForm.pdf folder mein rakhein.");
    }
}

function saveToHistory(name, address, amount) {
    const history = getHistory();
    const entry = {
        id: Date.now(),
        name, address, amount,
        date: getDateStr(),
        time: new Date().toLocaleTimeString('en-PK', { hour: '2-digit', minute: '2-digit' })
    };
    history.unshift(entry);
    if (history.length > 50) history.pop();
    localStorage.setItem("challanHistory", JSON.stringify(history));
    renderHistory();
}

function getHistory() {
    try { return JSON.parse(localStorage.getItem("challanHistory")) || []; }
    catch { return []; }
}

function renderHistory() {
    const list = document.getElementById("historyList");
    const history = getHistory();
    if (history.length === 0) {
        list.innerHTML = `<div class="empty-state"><i class="fa-solid fa-inbox"></i><p>Abhi koi record nahi hai</p></div>`;
        return;
    }
    list.innerHTML = history.map((item, idx) => `
        <div class="history-item">
            <div class="history-num">${idx + 1}</div>
            <div class="history-details">
                <div class="history-name">${item.name}</div>
                <div class="history-meta">
                    <i class="fa-solid fa-location-dot" style="font-size:10px"></i> ${item.address}
                    &nbsp;&bull;&nbsp;
                    <i class="fa-solid fa-clock" style="font-size:10px"></i> ${item.date} ${item.time}
                </div>
            </div>
            <div class="history-amount">Rs. ${parseInt(item.amount).toLocaleString()}</div>
            <button class="history-reprint" onclick="reprintRecord(${item.id})" title="Reprint">
                <i class="fa-solid fa-print"></i>
            </button>
        </div>
    `).join('');
}

function reprintRecord(id) {
    const history = getHistory();
    const item = history.find(h => h.id === id);
    if (!item) return;
    document.getElementById("name").value = item.name;
    document.getElementById("address").value = item.address;
    document.getElementById("amount").value = item.amount;
    convertAmount();
    handlePrint();
}

function clearHistory() {
    if (confirm("Kya aap sari history delete karna chahte hain?")) {
        localStorage.removeItem("challanHistory");
        renderHistory();
    }
}

// Image slider
let images = document.querySelectorAll('.image-container img');
let imgIndex = 0;
if (images.length > 1) {
    setInterval(() => {
        images[imgIndex].classList.remove('active');
        imgIndex = (imgIndex + 1) % images.length;
        images[imgIndex].classList.add('active');
    }, 5000);
}

// Enter key
document.addEventListener("keydown", function(event) {
    if (event.key === "Enter") {
        event.preventDefault();
        handlePrint();
    }
});

window.addEventListener("load", renderHistory);
