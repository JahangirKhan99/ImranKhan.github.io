document.getElementById("nic").addEventListener("input", function() {

    let value = this.value.replace(/\D/g, "");
    if (value.length > 13) value = value.slice(0, 13);
    if (value.length > 5) value = value.replace(/(\d{5})(\d{0,7})/, "$1-$2");
    if (value.length > 12) value = value.replace(/(\d{5})-(\d{7})(\d{0,1})/, "$1-$2-$3");
    this.value = value;
});

// 🔹 رقم کو الفاظ میں تبدیل کریں
function convertAmount() {
    let num = document.getElementById("amount").value;
    document.getElementById("amountWords").innerText = num ? (`${numberToWords(num)}`) : "";
}

// 🔹 رقم کو انگلش میں تبدیل کریں
function numberToWords(num) {
    const a = ["", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine", "Ten",
        "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen", "Seventeen",
        "Eighteen", "Nineteen"
    ];
    const b = ["", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"];

    if (num < 20) return a[num];
    if (num < 100) return b[Math.floor(num / 10)] + (num % 10 ? " " + a[num % 10] : "");
    if (num < 1000) return a[Math.floor(num / 100)] + " Hundred" + (num % 100 ? " " + numberToWords(num % 100) : "");
    if (num < 1000000) return numberToWords(Math.floor(num / 1000)) + " Thousand" + (num % 1000 ? " " + numberToWords(num % 1000) : "");
    return num;
}


// async function fillPDF() {
//     console.log(alert("ایک بار درود پڑھنا"));

//     const pdfUrl = "PassportChallanForm.pdf";
//     const existingPdfBytes = await fetch(pdfUrl).then(res => res.arrayBuffer());

//     const { PDFDocument, rgb } = PDFLib;
//     const pdfDoc = await PDFDocument.load(existingPdfBytes);
//     const pages = pdfDoc.getPages();
//     const firstPage = pages[0];

//     const date = new Date().toLocaleDateString();
//     const name = document.getElementById("name").value;
//     const nic = document.getElementById("nic").value;
//     const address = document.getElementById("address").value;
//     const amount = document.getElementById("amount").value;
//     const amountWords = numberToWords(amount);


//     firstPage.drawText(`Date: ${date}`, { x: 100, y: 600, size: 12, color: rgb(0, 0, 0) });
//     firstPage.drawText(`Name: ${name}`, { x: 100, y: 570, size: 12, color: rgb(0, 0, 0) });
//     firstPage.drawText(`CNIC: ${nic}`, { x: 100, y: 540, size: 12, color: rgb(0, 0, 0) });
//     firstPage.drawText(`Address: ${address}`, { x: 100, y: 510, size: 12, color: rgb(0, 0, 0) });
//     firstPage.drawText(`Amount: Rs. ${amount}`, { x: 100, y: 480, size: 12, color: rgb(0, 0, 0) });
//     firstPage.drawText(`Amount in Words: ${amountWords}`, { x: 100, y: 450, size: 12, color: rgb(0, 0, 0) });

//     const pdfBytes = await pdfDoc.save();
//     const blob = new Blob([pdfBytes], { type: "application/pdf" });
//     const link = document.createElement("a");
//     link.href = URL.createObjectURL(blob);

//     link.click();


// }

// // 🔹 جب پیج لوڈ ہو، تو نیٹ ورک سے تاریخ حاصل کریں
// document.addEventListener("DOMContentLoaded", fetchNetworkDate);

async function fillPDF() {
    // console.log(alert("ایک بار درود پڑھنا"));

    const pdfUrl = "PassportChallanForm.pdf";
    const existingPdfBytes = await fetch(pdfUrl).then(res => res.arrayBuffer());

    const { PDFDocument, rgb } = PDFLib;
    const pdfDoc = await PDFDocument.load(existingPdfBytes);
    const pages = pdfDoc.getPages();
    const firstPage = pages[0];

    const date = new Date();
    let day = String(date.getDate()).padStart(2, '0');
    let month = String(date.getMonth() + 1).padStart(2, '0');
    let year = date.getFullYear();
    let tareh = `${day}/${month}/${year} `;
    const name = document.getElementById("name").value;
    const nic = document.getElementById("nic").value;
    const address = document.getElementById("address").value;
    const amount = document.getElementById("amount").value;
    const amountWords = numberToWords(amount);

    // 1st page

    firstPage.drawText(` ${tareh}`, {
        x: 220,
        y: 513,
        size: 12,
        color: rgb(0, 0, 0)
    });

    firstPage.drawText(`${name}`, {
        x: 100,
        y: 479,
        size: 12,
        color: rgb(0, 0, 0)
    });
    firstPage.drawText(` ${nic}`, {
        x: 100,
        y: 460,
        size: 12,
        color: rgb(0, 0, 0)
    });
    firstPage.drawText(` ${address}`, {
        x: 100,
        y: 444,
        size: 12,
        color: rgb(0, 0, 0)
    });
    firstPage.drawText(`${amount}`, {
        x: 220,
        y: 165,
        size: 12,
        color: rgb(0, 0, 0)
    });
    firstPage.drawText(`${amount}`, {
        x: 220,
        y: 300,
        size: 12,
        color: rgb(0, 0, 0)
    });

    firstPage.drawText(`${amountWords}`, {
        x: 80,
        y: 140,
        size: 10,
        color: rgb(0, 0, 0)
    });
    // 2nd page

    firstPage.drawText(` ${tareh}`, {
        x: 220 + 320,
        y: 513,
        size: 12,
        color: rgb(0, 0, 0)
    });

    firstPage.drawText(`${name}`, {
        x: 100 + 310,
        y: 479,
        size: 12,
        color: rgb(0, 0, 0)
    });
    firstPage.drawText(` ${nic}`, {
        x: 100 + 310,
        y: 460,
        size: 12,
        color: rgb(0, 0, 0)
    });
    firstPage.drawText(` ${address}`, {
        x: 100 + 310,
        y: 444,
        size: 12,
        color: rgb(0, 0, 0)
    });
    firstPage.drawText(`${amount}`, {
        x: 220 + 320,
        y: 165,
        size: 12,
        color: rgb(0, 0, 0)
    });
    firstPage.drawText(`${amount}`, {
        x: 220 + 320,
        y: 300,
        size: 12,
        color: rgb(0, 0, 0)
    });

    firstPage.drawText(`${amountWords}`, {
        x: 90 + 310,
        y: 140,
        size: 10,
        color: rgb(0, 0, 0)
    });

    // 3rd page

    firstPage.drawText(` ${tareh}`, {
        x: 220 + 650,
        y: 513,
        size: 12,
        color: rgb(0, 0, 0)
    });

    firstPage.drawText(`${name}`, {
        x: 100 + 650,
        y: 479,
        size: 12,
        color: rgb(0, 0, 0)
    });
    firstPage.drawText(` ${nic}`, {
        x: 100 + 650,
        y: 460,
        size: 12,
        color: rgb(0, 0, 0)
    });
    firstPage.drawText(` ${address}`, {
        x: 100 + 650,
        y: 444,
        size: 12,
        color: rgb(0, 0, 0)
    });
    firstPage.drawText(`${amount}`, {
        x: 220 + 650,
        y: 165,
        size: 12,
        color: rgb(0, 0, 0)
    });
    firstPage.drawText(`${amount}`, {
        x: 220 + 650,
        y: 300,
        size: 12,
        color: rgb(0, 0, 0)
    });

    firstPage.drawText(`${amountWords}`, {
        x: 90 + 640,
        y: 140,
        size: 10,
        color: rgb(0, 0, 0)
    });

    const pdfBytes = await pdfDoc.save();
    const blob = new Blob([pdfBytes], { type: "application/pdf" });
    const pdfUrlBlob = URL.createObjectURL(blob);

    // 🔹 PDF ڈاؤن لوڈ کریں
    const link = document.createElement("a");
    link.href = pdfUrlBlob;
    link.download = `PassportChallan_${name}.pdf`;
    link.click();

    // 🔹 خودکار پرنٹ کریں (اگر پرنٹر موجود ہو)
    autoPrintPDF(pdfUrlBlob);
}

// 🔹 خودکار پرنٹ فنکشن
function autoPrintPDF(pdfUrl) {
    const iframe = document.createElement("iframe");
    iframe.style.visibility = "hidden";
    iframe.src = pdfUrl;
    document.body.appendChild(iframe);

    iframe.onload = function() {
        iframe.contentWindow.print();
        // setTimeout(() => 
            document.body.removeChild(iframe); // 5 سیکنڈ بعد iframe ہٹا دیں
    };
}

let images = document.querySelectorAll('.image-container img');
let index = 0;

setInterval(() => {
    images[index].classList.remove('active');
    index = (index + 1) % images.length;
    images[index].classList.add('active');
}, 5000);
