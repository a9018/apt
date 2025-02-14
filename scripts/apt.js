/* globals***********************************************************************/
var msPerDay = 24 * 60 * 60 * 1000; // Number of milliseconds per day
var solar_year = 0
var solar_month = 0
var solar_day = 0
var solar_days_of_month = new initArray(0, 31, 31, 31, 31, 31, 31, 30, 30, 30, 30, 30);
var bedClass;
var applaiedShr = false;

function initArray() {
    this.length = initArray.arguments.length
    for (var i = 0; i < this.length; i++)
        this[i + 1] = initArray.arguments[i]
}

var Titles = new initArray("شـارژ", "آسانسور", "پمپ آب", "4", "5", "6", "7", "8", "---", "آب", "برق", "آسانسور", "نظافت", "پمپ آب", "متفرقه","درب پارکینگ","روشنایی","اتصالات آب","آنتن مرکزی","کودوخاک");
var solarMounth = new initArray("فروردین", "اردیبهشت", "خرداد", "تیر", "مرداد", "شهریور", "مهر", "آبان", "آذر", "دی", "بهمن", "اسفند");
var vahedBes = new initArray(0, 0, 0, 200000, 0, 0, 0, 0, 0, 0);
var num = 0;


/* Read xml***********************************************************************/

var apt = [];
var xmlDoc;
var xmlFile = "xml/apt.xml";

if (typeof window.DOMParser != "undefined") {
    xmlhttp = new XMLHttpRequest();
    xmlhttp.open("GET", xmlFile, false);
    if (xmlhttp.overrideMimeType) {
        xmlhttp.overrideMimeType('text/xml');
    }
    xmlhttp.send();
    xmlDoc = xmlhttp.responseXML;
}
else {
    xmlDoc = new ActiveXObject("Microsoft.XMLDOM");
    xmlDoc.async = "false";
    xmlDoc.load(xmlFile);
}
var x = xmlDoc.getElementsByTagName("date");
//var salePerMesghal = tagObj[0].getElementsByTagName("salePerMesghal")[0].childNodes[0].nodeValue;
//var marketCoefficient = tagObj[0].getElementsByTagName("marketCoefficient")[0].childNodes[0].nodeValue;

//var parent_list = rsp.response.getElementsByTagName("parent");

for (i = 0; i < x.length; i++) {

    apt.push(x[i].getAttribute('id'));

    var hlpNumber = x[i].getElementsByTagName("s_cod").length;
    apt.push(hlpNumber);
    for (j = 0; j < hlpNumber; j++) {
        apt.push(x[i].getElementsByTagName("s_cod")[j].childNodes[0].nodeValue);
    }

    hlpNumber = x[i].getElementsByTagName("shr").length;
    apt.push(hlpNumber);
    for (j = 0; j < x[i].getElementsByTagName("shr").length; j++) {
        apt.push(x[i].getElementsByTagName("shr")[j].childNodes[0].nodeValue);
    }

    hlpNumber = x[i].getElementsByTagName("c_cod").length;
    apt.push(hlpNumber);
    for (j = 0; j < hlpNumber; j++) {
        apt.push(x[i].getElementsByTagName("c_cod")[j].childNodes[0].nodeValue);
    }

    for (j = 0; j < x[i].getElementsByTagName("cst").length; j++) {
        apt.push(x[i].getElementsByTagName("cst")[j].childNodes[0].nodeValue);
    }
    apt.push(-1);
}
//console.log(apt);
//alert(apt);

/* End Read xml***********************************************************************/
/* Apllay shr***********************************************************************/

function applayShr() {
    var i, j, k, nShr;
    var table, tableCst, tableSan, tableVah;
    var tableTh1 = "<tr><th>تاریخ ها</th>";
    var tableTh2 = "<tr><th>عنوان ها</th><th>بدهـکار(تومان)</th>";
    var tableTd = new initArray("<tr><td>واحد 1</td>", "<tr><td>واحد 2</td>", "<tr><td>واحد 3</td>",
        "<tr><td>واحد 4</td>", "<tr><td>واحد 5</td>", "<tr><td>واحد 6</td>", "<tr><td>واحد 7</td>",
        "<tr><td>واحد 8</td>", "<tr><td>واحد 9</td>", "<tr><td>واحد 10</td>");
    var tableTdShr = new initArray("", "", "", "", "", "", "", "", "", "");
    var vahedBed = new initArray(0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
    var sumBeds = 0;
    var today = new Date();
    var thCst = "<tr><th>تاریخ</th><th>عنوان</th><th>مبلغ</th></tr>";
    var tdCst = "";
    var currentShr = new initArray(0, 0, 0, 0, 0);
    var helpDate;
    var sumCst = 0;
    var sumShr = 0;
    var sumShrAct = 0;
    var remain1401 = 3295994.7;
    var todayDate;


    if (applaiedShr) { return (applaiedShr); }

    tableVah = "<tr><th>واحد</th><th>مشخصات</th><th>شماره تماس</th><th>شماره کارت-سایر</th></tr>";
    tableVah += "<tr><th>واحد1</td><td>آقای نیکفر</td><td>0935-3295052</td><td>6037-9973-6635-1451</td></tr>";
    tableVah += "<tr><th>واحد2</td><td>خانم زهدی</td><td>0912-4776088</td><td>5892-1014-0608-9595</br>6063-7311-2460-7749</td></tr>";

    tableVah += "<tr><th rowspan='2'>واحد3</th>";
    tableVah += "<td>آقای بصیری(مالک)</td><td>0912-5190161</td><td>---</td></tr>";
    tableVah += "<td>آقای انتصاری(مستاجر)</td><td>0912-3279750</td><td>6037-6915-4530-5385</br>6063-7310-4275-6222</td></tr>";

    tableVah += "<tr><th>واحد4</td><td>آقای شیرمحمدی</td><td>0912-1398614</td><td>6037-6915-4500-7494</br>6104-3379-8535-0972</td></tr>";
    tableVah += "<tr><th>واحد5</td><td>آقای ضابط</td><td>0912-7210512</td><td>5859-8311-2672-9861</td></tr>";
    tableVah += "<tr><th>واحد6</td><td>آقای الهیاری</td><td>0912-3585653</td><td>---</td></tr>";

    tableVah += "<tr><th rowspan='2'>واحد7</th>";
    tableVah += "<td>آقای دهاقین(مالک)</td><td>0912-6274815</td><td>---</td></tr>";
    tableVah += "<td>آقای محمدی(مستاجر)</td><td>0919-1250581-0912-6231794</td><td>5047-0610-4658-3189</td></tr>";

    tableVah += "<tr><th>واحد8</td><td>آقای نظام آبادی</td><td>0912-8044606</td><td>6037-9972-8331-4780</td></tr>";
    tableVah += "<tr><th>واحد9</td><td>آقای کاظمی</td><td>0930-2022452</td><td>6395-9911-9372-2568</br>5892-1014-8000-4122</td></tr>";
    tableVah += "<tr><th>واحد10</td><td>خانم کاظمی</td><td>099-12108643</td><td>6037-9973-5671-5442</td></tr>";
    tableVah += "<tr><th>درب برقی</td><td>آقای مهربانی</td><td>0912-7926168</td><td>---</td></tr>";
    tableVah += "<tr><th>پمپ آب</td><td>آقای گنجعلی</td><td>0912-1002328</td><td>---</td></tr>";

    tableVah += "<tr><th  rowspan='2'>آسانسور</th>";
    tableVah += "<td>آقای خداپرست</td><td>0919-8120764</td><td>---</td></tr>";
    tableVah += "<td>شرکت ایمن آسانبر</td><td>0919-3166752/77274428</td><td>6063-7311-2412-3135</br>لیلاابراهیمی</td></tr>";

    tableVah += "<tr><th>نظافت ساختمان</th><td>آقای دوستی</td><td>0919-6384954</td><td>6274-1211-9193-8711</td></tr>";
    tableVah += "<tr><th>آنتن مرکزی</th><td>آقای بیاتانی</td><td>0912-2939531</td><td>---</td></tr>";

    document.getElementById("tvah").innerHTML = tableVah;




    calcul_solar_date(today);
    if (solar_year > 99) {
        solar_year = 1400 + solar_year % 100;
    }
    else {
        solar_year += 1300;
    }
    todayDate = solar_year + "/" + solar_month + "/" + solar_day;
    tableTh1 += "<th>" + todayDate + "</th>";


    for (i = 0; i < apt.length; i++) {
        if (apt[i] != -1) {


            helpDate = solarMounth[apt[i] % 100] + "-" + (apt[i] / 100 >> 0);
            if (solar_year * 100 + solar_month >= apt[i]) {
                sumShrAct = 1;
            }
            else {
                sumShrAct = 0;
            }

            for (j = 0; j < apt[i + 1]; j++) {
                tableTh1 += "<th>" + helpDate + "</th>";
                tableTh2 += "<th>" + Titles[apt[i + j + 2]] + "</th>";
                currentShr[j] = shrMoney(apt[i] * apt[i + j + 2]);
            }
            i = i + j + 2;
            nShr = apt[i] / 10;
            for (j = 1; j < 11; j++) {
                for (k = 0; k < nShr; k++) {
                    ++i;
                    if (apt[i] > 0 && apt[i] < 10) {
                        tableTdShr[j] += "<td>" + Titles[apt[i]] + "</td>";
                    }
                    else {
                        tableTdShr[j] += "<td>" + apt[i] + "</td>";
                        if (sumShrAct == 1) {
                            vahedBed[j] += Number(currentShr[k] - apt[i]);
                            sumShr += Number(apt[i]);
                        }
                    }
                }
            }

            i++;

            for (j = 0; j < apt[i]; j++) {
                if (apt[i + j + 1] > 0) {
                    usFormat = new Intl.NumberFormat().format(apt[i + j + 1 + apt[i]]);
                    tdCst += "<tr><td>" + helpDate + "</td><td>" + Titles[apt[i + j + 1]] + "</td><td>" + usFormat + "</td></tr>";
                    sumCst += Number(apt[i + j + 1 + apt[i]]);
                }
            }
            i += apt[i] * 2 + 1;

        }
    }

    table = tableTh1 + "</tr>" + tableTh2 + "</tr>";
    for (i = 1; i < 11; i++) {
        vahedBed[i] -= vahedBes[i];
        usFormat = new Intl.NumberFormat().format(vahedBed[i]);
        if (vahedBed[i] == 0) {
            bedClass = "<td>";
        }
        else {
            bedClass = "<td class=\"bed\">";
        }
        table += tableTd[i] + bedClass + usFormat + "</td>" + tableTdShr[i] + "</tr>";
    }

    document.getElementById("tshr").innerHTML = table;

    usFormat = new Intl.NumberFormat().format(sumCst);
    tdCst += "<tr><th>جـمع کل</th><td>" + usFormat + "</td ><th>(تومان)</th></tr >";
    tableCst = thCst + tdCst;
    document.getElementById("tcst").innerHTML = tableCst;

    usFormat = new Intl.NumberFormat().format(remain1401);
    tableSan = "<tr><th>مانده صندوق 1401</th><td>" + usFormat + "</td></tr>";
    usFormat = new Intl.NumberFormat().format(sumShr);
    tableSan += "<tr><th>پرداخت واحدها</th><td>" + usFormat + "</td></tr>";

    for (i = 1; i < 11; i++) {
        sumBeds += vahedBed[i];
    }
    usFormat = new Intl.NumberFormat().format(sumBeds);
    tableSan += "<tr><th>بدهکاری واحدها</th><td>" + usFormat + "</td></tr>";

    usFormat = new Intl.NumberFormat().format(sumCst);
    tableSan += "<tr><th>جمع هزینه ها</th><td>" + usFormat + "</td></tr>";
    usFormat = new Intl.NumberFormat().format(remain1401 + sumShr - sumCst);
    tableSan += "<tr><th>موجودی " + todayDate + "</th><td>" + usFormat + "</td><th>(تومان)</th></tr>";

    document.getElementById("tsan").innerHTML = tableSan;

    applaiedShr = true;
    return (applaiedShr);
}
/* End Apllay shr***********************************************************************/
/* shrMoney***********************************************************************/

function shrMoney(shrDate) {
    var result = 0;
 //   alert(shrDate);
    switch (true) {
        case shrDate < 140210:
            result = 150000;
            break;
        case shrDate == 280424: // آسانسور140212
            result = 200000;
            break;
        case shrDate < 140307:
            result = 200000;
            break;
        case shrDate == 420933: // پمپ آب 140311  
            result = 1150000;
            break;
        case shrDate < 999999:
            result = 250000;
//            alert(shrDate);
            break;
        default:
            result = 0;
    }

    return (result)
}
/* End shrMoney***********************************************************************/


/* Solar Date***********************************************************************/
function calcul_solar_date(today_date) {
    var days = 0
    var kabiseh = 0
    var i = 0

    days = Math.ceil((today_date.getTime() / msPerDay)) + 286
    solar_year = 48
    for (i = 1; i < 1000; i++) {
        if (i % 4 == 0)
            kabiseh = 1
        else
            kabiseh = 0

        if (days > 365 + kabiseh) {
            solar_year += 1
            days -= 365 + kabiseh
        }
        else
            break
    }

    solar_month = 0
    for (i = 1; i <= 12; i++) {
        if (solar_days_of_month[i] < days) {
            solar_month += 1
            days -= solar_days_of_month[i]
        }
    }
    solar_day = days

}
/* End Solar Date***********************************************************************/


/* Simple Javascript Password***********************************************************************/
var cipher = "U2FsdGVkX19Lw1A6D2a/0hwLO4RnQyl1gYsA3Meuu9E=";

//<!--(A) LOAD CRYPTO JS LIBRARY-- >
//< !--https://cryptojs.gitbook.io/docs/ -->
//< !--https://cdnjs.com/libraries/crypto-js -->
// (B) ENCRYPT & DECRYPT FUNCTIONS
var crypt = {
    // (B1) THE SECRET KEY
    secret: "CIPHERKEY",

    // (B2) ENCRYPT
    encrypt: clear => {
        var cipher = CryptoJS.AES.encrypt(clear, crypt.secret);
        return cipher.toString();
    },

    // (B3) DECRYPT
    decrypt: cipher => {
        var decipher = CryptoJS.AES.decrypt(cipher, crypt.secret);
        return decipher.toString(CryptoJS.enc.Utf8);
    }
};

// (C) TEST
// (C1) ENCRYPT CLEAR TEXT
//    var cipher = crypt.encrypt("4321");
//      console.log(cipher);
//    alert(cipher);

// (C2) DECRYPT CIPHER TEXT
var decipher = crypt.decrypt(cipher);
//        console.log(decipher);
   //     alert(decipher);

/* End Simple Javascript Password***********************************************************************/
