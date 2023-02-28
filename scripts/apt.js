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

var Titles = new initArray("شـارژ", "---", "3", "4", "5", "6", "7", "8", "9","آب", "برق", "آسانسور", "نظافت", "پمپ آب");
var solarMounth = new initArray("فروردین", "اردیبهشت", "خرداد", "تیر", "مرداد", "شهریور", "مهر", "آبان", "آذر", "دی", "بهمن", "اسفند");
var vahedBes = new initArray("0", "0", "0", "0", "0", "0", "0", "0", "0", "0",);
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
    for (j = 0; j < x[i].getElementsByTagName("shr").length ; j++) {
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
    var table,tableCst,tableSan;
    var tableTh1 = "<tr><th>تاریخ ها</th>";
    var tableTh2 ="<tr><th>عنوان ها</th><th>بدهـکار(تومان)</th>";
    var tableTd = new initArray("<tr><td>واحد 1</td>", "<tr><td>واحد 2</td>", "<tr><td>واحد 3</td>",
        "<tr><td>واحد 4</td>", "<tr><td>واحد 5</td>", "<tr><td>واحد 6</td>", "<tr><td>واحد 7</td>",
        "<tr><td>واحد 8</td>", "<tr><td>واحد 9</td>", "<tr><td>واحد 10</td>");
    var tableTdShr = new initArray("", "", "", "", "", "", "", "", "", "");
    var vahedBed = new initArray(0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
    var sumBeds=0;
    var today = new Date();
    var thCst = "<tr><th>تاریخ</th><th>عنوان</th><th>مبلغ</th><th>جمع کل(تومان)</th></tr>";
    var tdCst = "";
    var currentShr;
    var helpDate;
    var sumCst = 0;
    var sumShr = 0;
    var helpString = "</td ><td>sumCast";
    var remain1401 = 2600000;
    var todayDate;
     

    if (applaiedShr) { return (applaiedShr); }
//    alert("Arman");

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

            currentShr = shrMoney(apt[i]);
//            vahedBed[i + 1] += shrMoney(apt[i]);
            helpDate = solarMounth[apt[i] % 100] + "-" + (apt[i] / 100 >> 0);

            for (j = 0; j < apt[i + 1]; j++) {
                tableTh1 += "<th>" + helpDate  + "</th>";
                tableTh2 += "<th>" + Titles[apt[i+j+2]] + "</th>";
            }
            i = i + j + 2;
            nShr = apt[i]/10;
            for (j = 1; j < 11; j++) {
                for (k = 0; k < nShr; k++) {
                    ++i;
                    if (apt[i] > 0 && apt[i] < 10) {
                        tableTdShr[j] += "<td>" + Titles[apt[i]] + "</td>";
                    }
                    else {
                        tableTdShr[j] += "<td>" + apt[i] + "</td>";
                        vahedBed[j] += currentShr - apt[i];
                        sumShr += Number(apt[i]);
                    }
                }
            }

            i++;
            
            for (j = 0; j < apt[i]; j++) {
                usFormat = new Intl.NumberFormat().format(apt[i + j + 3]);
                tdCst += "<tr><td>" + helpDate + "</td><td>" + Titles[apt[i + j + 1]] + "</td><td>" + usFormat + helpString + "</td></tr>";
                helpString = "";
                sumCst += Number(apt[i + j + 3]);
            }
            i += apt[i] * 2 + 1;

        }
    }

    table = tableTh1 + "</tr>"+tableTh2 + "</tr>";
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
    tableCst = thCst + tdCst.replace("sumCast", usFormat);;
    document.getElementById("tcst").innerHTML = tableCst;

    usFormat = new Intl.NumberFormat().format(remain1401);
    tableSan = "<tr><th>مانده صندوق 1401</th><td>" + usFormat +"</td><th>تومان</th></tr>";
    usFormat = new Intl.NumberFormat().format(sumShr);
    tableSan += "<tr><th>پرداخت واحدها</th><td>" + usFormat + "</td></tr>";

    for (i = 1; i < 11; i++) {
        sumBeds += vahedBed[i];
    }
    usFormat = new Intl.NumberFormat().format(sumBeds);
    tableSan += "<tr><th>بدهکاری واحدها</th><td>" + usFormat + "</td></tr>";

    usFormat = new Intl.NumberFormat().format(sumCst);
    tableSan += "<tr><th>جمع هزینه ها</th><td>" + usFormat + "</td></tr>";
    usFormat = new Intl.NumberFormat().format(remain1401 + sumShr - sumCst - sumBeds);
    tableSan += "<tr><th>مانده موجود " + todayDate+"</th><td>" + usFormat + "</td></tr>";

    document.getElementById("tsan").innerHTML = tableSan;
 
    applaiedShr = true;
    return (applaiedShr);
}

function shrMoney(shrDate) {
    var result = 0;
    switch (shrDate) {
        case shrDate > 140900:
            result = 0;
            break;
        default:
            result = 150000;
    }
    return(result)
}

/* End Apllay shr***********************************************************************/

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
