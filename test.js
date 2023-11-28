
const https = require('https');
const puppeteer = require("puppeteer");
const inquirer = require("inquirer");
const fs = require("fs")
const showBanner = require('node-banner');



async function main() {

inquirer.prompt([
    {
        name:"gateway_type",
        message : "Select Gateway Type :",
        type : "list",
        choices :["Kerlink_iBTS" , "Kerlink_zepto" , "Kerlink_Station_v1", "Kerlink_Istation","Kerlink_femtocell","Kerlink_Ifemtoevolution", "Tektelic_Macro" , "Tektelic_Mega", "Tektelic_Micro","Tektelic_Kona_Enterprise", "Gemtek_Femto" , "Browan_PicoNext" , "Gemtek_Macro" , "Multitech" , "Lorix_Gateway" , "RAK_7249" , "RAK_7258" , "Ursalink","Gemtek","Semtech Pico cell"]
    },
    {
        name:"instance",
        message : "Please Enter the Instance Name :",
        type : "input",
    },
    {
        name:"tenant",
        message : "Please Enter Tenant Name :",
        type : "input",
    },
    {
        name:"ver",
        message : "Please Enter the OW agent version :",
        type : "input",
    }, {
        name:"download_link",
        message : "Please Enter the Downlink Link :",
        type : "input",
    }
])
.then(function(answer){
    let gtwType = answer.gateway_type;
    let dwnLink = answer.download_link;
    let tenantName = answer.tenant;
    let fwVersion = answer.ver;
    let instanceName = answer.instance;
    let pdfName = `${gtwType}_${instanceName}_${tenantName}_${fwVersion}_provsioining_document.pdf`
    

   let rec = {
       gtw_tp : gtwType,
       link_dw : dwnLink,
       TenantName : tenantName,
       FW_ver : fwVersion,
       Instance_Name : instanceName,
       PDF_name : pdfName,
       Date_Time : new Date()

   }

   
   fileread(gtwType,dwnLink,pdfName);
   investory_rec(rec);
})
}
async function fileread(gateway_type,dwnLink,pdfName){
fs.readFile("./Gateway_html/"+gateway_type+".html",'utf8',function(err,data){
if(err) throw err;
let html_template = ` ${data} `
let link = dwnLink.trim();
let splitfilename = dwnLink.split("50011/")
let binary = splitfilename[1]
const ow_path = "data:image/png;base64," + fs.readFileSync("orbiwise.png").toString("base64");
let html_final = html_template;
html_final = html_final.replace(/{{linked}}/,link);
html_final = html_final.replace(/{{ow_logo}}/,ow_path);
html_final = html_final.replace(/{{fw_file}}/,binary);
let doc_name =pdfName;
// console.log(html_final)
createHtmlPdfFile(html_final,doc_name)
})
}


async function createHtmlPdfFile(html, doc ){

    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    await page.setContent(html, {
      waitUntil: ["load","networkidle0"]
    });
    const pdf = await page.pdf({ path: doc, "height":"600mm","width":"340mm",printBackground: true });
	// const pdf = await page.pdf({ path: file+'.pdf', "height": "3cm" , "width" : "6.3cm"});
    console.log(` File Created ---> ${doc} `)
    await browser.close();
  
}

function investory_rec(content)
{
    let cont = JSON.stringify(content , null , 2) 
    fs.writeFile('./Record/Delivery.txt', cont + ",\n", { flag: 'a+' } ,err => {
        if (err) {
          console.error(err);
        }
    });
}



(async () => {
    await showBanner("Orbiwise", "Gateway Provisioing Document \n")
    
    main()
    })();