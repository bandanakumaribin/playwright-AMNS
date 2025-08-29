
import { validateAndLog } from "./common";
import { test } from "../setupBlocks/global.setup";
import { ACTIVE_BACKEND, USERS, TEST_TIMEOUT } from "../setupBlocks/constant";

//let rfxText = ''; 

const rel_event = async ({ page }) => {

 if(ACTIVE_BACKEND == 'qa-api'){
  await page.getByRole('button', {  name: 'icon: plus New Event M   icon'  }).click();
 }
 else{
 await page.getByRole('button', {  name: 'icon: plus New Event icon'  }).click();
 }
 await page.getByRole('menuitem', { name: 'eRFX Project Manage sourcing' }).click();
// Add product
  await page.getByRole('combobox').filter({ hasText: 'Search and add line items' }).click();
  await page.getByRole('combobox').filter({ hasText: 'Search and add line items' }).getByRole('textbox').fill("pro");
  await page.getByRole('option').first().click();
  
  for (let i = 0; i < 1; i++) {
    await page.getByText('Search and add line items').click();
    await page.getByRole('option').nth(i).click();
  }
  console.log("PR items added to cart");

 // Fill Quantities
  const quantities = ["20","20"];
  for (let i = 0; i < quantities.length; i++) {
    await page.getByRole("spinbutton", { name: "Quantity" }).nth(i).fill(quantities[i]);
  }
 await page.getByRole('button', { name: 'Create Project' }).click();
 await page.getByRole('menuitem', { name: 'Technical Stage' }).click();
 await page.getByRole('menuitem', { name: 'RFQ' }).click();
 await page.getByRole('button', { name: 'Create Project' }).click();
   if(ACTIVE_BACKEND == 'qa-api'){
  await qa_event({ page });
 }
 else {
 await page.getByRole('tab', { name: 'Technical Stage' }).click();
 await page.getByText('Select Template', { exact: true }).click();
 await page.getByRole('menuitem', { name: 'RFQ Technical Section –' }).click();
 await page.getByRole('button', { name: '+ Add Evaluators' }).click();
 await page.getByRole('option', { name: 'Akshay Raina akshay.raina@ril' }).click();
 await page.getByRole('tab', { name: 'RFQ' }).click();
 await page.getByRole('button', { name: 'template iconSelect Templates' }).click();
 await page.getByRole('menuitem', { name: 'Buy MRO Services ARC' }).click();
 await page.getByText('Select option').nth(1).dblclick();
 await page.getByRole('option', { name: 'XS2' }).first().click();
 await page.locator('td').first().dblclick();
 await page.getByRole('row', { name: '20 Litre (Litre)' }).getByRole('textbox').fill("1");
 await page.locator('tr:nth-child(3) > td').first().dblclick();
 await page.getByRole('row', { name: 'MAT-456 30 Litre (Litre)' }).getByRole('textbox').fill("2");
 await page.locator('tr:nth-child(4) > td').first().dblclick();
//  await page.getByRole('row', { name: '40 Litre (Litre)' }).getByRole('textbox').fill("3");
 await page.locator('td:nth-child(2)').first().dblclick();
 await page.getByRole('row', { name: 'MAT-345 20 Litre (Litre)' }).getByRole('textbox').fill("aa");
 await page.locator('tr:nth-child(3) > td:nth-child(2)').dblclick();
 await page.locator('td[aria-disabled="false"][data-celltype="main_line_description_custom"] input[type="text"]').fill("bb");
 await page.locator('tr:nth-child(4) > td:nth-child(2)').dblclick();
//  await page.locator('td[aria-disabled="false"][data-celltype="main_line_description_custom"][data-cell-error="false"] input[type="text"]').fill("cc");

 await page.getByRole('combobox').filter({ hasText: 'Search vendors you want to add' }).locator('div').first().click();
//  await page.getByRole('combobox', { name: /Search vendors you want to add/ }).locator('input.ant-select-search__field')
 await page.locator('input.ant-select-search__field#participantSelection').fill("Abb");
 await page.getByRole('menuitem', { name: '0000329265 (ABB LTD) Faridabad' }).first().click();
 await page.getByRole('button', { name: 'Invite POC' }).click();
 await page.getByRole('button', { name: 'Publish' }).click();
 await page.getByLabel('Subcategory Name').getByRole('button', { name: 'Publish' }).click();
 await page.waitForTimeout(5000);
//  let rfxText = await page.getByText('RFX-').textContent();
//  console.log(rfxText);
}
};

const qa_event = async ({ page }) => {
 await page.getByRole('tab', { name: 'Technical Stage' }).click();
 await page.getByRole('button', { name: 'Technical Stage icon: right' }).click();
 await page.getByRole('radio', { name: 'I\'ll do line-item wise' }).click();
 await page.getByRole('button', { name: 'Save' }).click();
 await page.getByRole('button', { name: 'template iconSelect Templates' }).click();
 await page.getByRole('menuitem', { name: 'Vendor Details Template' }).click();

//  line item - add evaluator
  let buttons = await page.getByRole("button", { name: "icon: plus Add Evaluator" }).all();
  for (let i = 0; i < buttons.length; i++) {
    // Re-query the buttons to get fresh references
    await page.getByRole("button", { name: "icon: plus Add Evaluator" }).first().click();
    await page.getByRole("menuitem", { name: "First_name-116 Last_name-" }).click();
    await page.waitForTimeout(1000);
  }
  console.log("Evaluators added");
 
 await page.getByRole('tab', { name: 'RFQ' }).click();
 await page.getByRole('button', { name: 'template iconSelect Templates' }).click();
 await page.getByRole('menuitem', { name: 'Buy Main Template Copy', exact: true }).click();

  const rfqRows = [
    { name: "Product1 Details PR 20 NO", value: "Buy" }
    // { name: "Product - 10(300377116)", value: "Buy" }
  ];
  for (let i = 0; i <= 1; i++) {
    await page.locator('td:nth-child(3)').nth(i).dblclick();
  for (const row of rfqRows) {
    await page.getByRole("row", { name: row.name }).getByRole("textbox").fill(row.value);
    await page.getByRole("option").first().click();
    break;
  }
  }
 
  // Vendor search
 await page.getByRole('combobox').filter({ hasText: 'Search vendors you want to add' }).locator('div').first().click();
   for (const company of ["312", "309"]) {
    await page.locator('div.ant-select-selection[role="combobox"] input.ant-select-search__field').fill(company);
    await page.getByRole("menuitem", { name: new RegExp(`Company - ${company}`) }).click();
  }

 await page.getByRole('button', { name: 'Publish' }).click();
 await page.getByRole('button', { name: 'Edit Schedule' }).click();
// tech & rfq edit time

for (let i = 0; i < 2; i++) {
  if (i === 0) {
    await page.getByText('30 Mins', { exact: true }).first().click();
  } else {
    await page.getByText('Mins').nth(3).click();
  }

  await page.getByRole('menuitem', { name: 'Custom duration' }).click();
  await page.getByRole('spinbutton', { name: '60' }).click();
  await page.getByRole('spinbutton', { name: '60' }).fill("2");
  await page.getByRole('button', { name: 'Save', exact: true }).click();
}

await page.getByRole('button', { name: 'Save Schedule' }).click();
await page.getByRole('button', { name: 'Publish' }).click(); 
await page.getByLabel('Baby').getByRole('button', { name: 'Publish' }).click();
await page.waitForTimeout(3000);
console.log("Project publish successfully");
//rfxText = (await page.getByText('RFX-').textContent())?.trim();
//console.log("Captured RFX:", rfxText);
};

const qa_vendor_bid = async ({ page }) => {
 /* //await page.getByRole('textbox', { name: 'Search title or Ref-Id' }).click();
  //await page.getByRole('textbox', { name: 'Search title or Ref-Id' }).fill(rfxText);
  await page.getByLabel('icon: search').locator('svg').dblclick();
 // await page.getByRole('textbox', { name: 'Search title or Ref-Id' }).press("Enter");
  await page.waitForTimeout(2000);

  await page.locator('.styles_stageTitle__IUGUn').first().click();
  await page.getByRole('button', { name: 'I will participate' }).click();
  // await page.getByRole('tab', { name: 'Technical Stage' }).click();
  await page.waitForTimeout(2000);
  await page.locator('span').filter({ hasText: 'Don’t miss out on' }).locator('a').click();
  if (await page.getByText('Quick Fill').first().isVisible()) {
    console.log("Quick Fill is visible");
    await page.waitForTimeout(2000);
  } 
  await page.getByText('Quick Fill').first().click();
  await page.getByRole('menuitem', { name: 'Same as Requested' }).click();
  await page.getByText('Quick Fill').nth(1).click();
  await page.getByRole('menuitem', { name: 'Same as Requested' }).click();
  await page.waitForTimeout(2000);
  await page.getByRole('button', { name: 'Submit' }).first().click(); */



//const quickFill = page.getByText('Quick Fill').first();
/*if (await quickFill.isVisible()) {
  console.log('Quick Fill is visible');
}
await quickFill.click();
await page.getByRole('menuitem', { name: 'Same as Requested' }).click();
await page.getByText('Quick Fill').nth(1).click();
await page.getByRole('menuitem', { name: 'Same as Requested' }).click();
await page.getByRole('button', { name: 'Submit' }).first().click();*/




await page.getByLabel('icon: search').locator('svg').dblclick();
await page.waitForTimeout(2000);
await page.locator('.styles_stageTitle__IUGUn').first().click();
await page.getByRole('tablist').getByText('RFQ').click();
await page.getByRole('button', { name: 'I will participate' }).click();
//await page.getByRole('tablist').getByText('Technical Stage').click();

const quickFill = page.getByText('Quick Fill');
for (let i = 0; i < 2; i++) {
  await page.waitForTimeout(2000);
  const quick = quickFill.nth(i).filter({ visible: true });
  if (await quick.count() > 0) {
    console.log('Quick Fill is visible');
    await quick.click();
    await page.getByRole('menuitem', { name: 'Same as Requested' }).click();
  }
}
await page.waitForTimeout(2000);
await page.getByRole('button', { name: 'Submit' }).first().click();

await validateAndLog({
  locator: page.locator('div').filter({ hasText: 'Project created successfully' }).nth(3),
  smessage: "Project created successfully with title: ",
  fmessage:  "Project creation failed" 
})
await page.getByRole('tab', { name: 'RFQ' }).click();
await page.getByRole('radio', { name: 'Indian Rupees (INR)' }).click();
await page.getByRole('button', { name: 'Save' }).click();
await page.waitForTimeout(1000);
// inline 
const fields: [number, number, string][] = [
[7, 0, "20"],
[7, 1, "30"],
[7, 0, "3"],
[7, 1, "3"],
[8, 0, "2"],
[8, 1, "2"],
];

// process in chunks of 2
for (let i = 0; i < fields.length; i++) {
// scroll before every 2-row batch
if (i % 2 === 0) {
  await page.locator('div[role="grid"]').first().hover();
  await page.mouse.wheel(300, 0);
  await page.waitForTimeout(800);
}

const [colIndex, rowIndex, value] = fields[i];
// click correct cell
await page.locator(`.rdg-row >> nth=${rowIndex} >> div:nth-child(${colIndex})`).click();

// Fill the value
await page.locator('input[type="text"]').nth(0).fill(value);
await page.locator('input[type="text"]').nth(0).press("Enter");
}

const mandatoryQuoteFields = {
"Incoterms*": { type: "dropdown", value: "ASW-At suppliers works" },
"Destination for Incoterms*": { type: "text", value: "Pune" }, 
"Vendor Category*": { type: "dropdown", value: "Service Provider" },
"Warranty Terms*": { type: "dropdown", value: "12 months from Supply and 18" },
"Payment Terms*": { type: "dropdown", value: "AB09 - 90% Delivery 30 Days," },
"Validity of Quotation*": { type: "date", value: "Today" },
};

for (let [field, config] of Object.entries(mandatoryQuoteFields)) {
const row = page.getByRole("row", { name: field, exact: true });

if (config.type === "dropdown") {
  let retries = 0;
  while (!(await page.getByRole("option").first().isVisible()) && retries < 3) {
    await row.getByRole("gridcell").nth(1).click();
    await page.waitForTimeout(500);
    retries++;
  }

  if (config.value === "first") {
    await page.getByRole("option").first().click();
  } else {
    await page.getByRole("option", { name: config.value }).first().click();
  }
}
else if (config.type === "text") {
    await row.getByRole("gridcell").nth(1).click();
    await page.locator('input[type="text"]').fill(config.value);
}
else if (config.type === "date") {
  await row.getByRole("gridcell").nth(1).click();
  await page.getByRole("gridcell", { name: "icon: calendar" }).click();
  await page.locator("div").filter({ hasText: new RegExp(`^${config.value}$`) }).click();
}
}
let a= 0;
  while (await page.getByRole('button', { name: 'Submit Quote' }).first().isVisible() && a < 2) {
    await page.getByRole('button', { name: 'Submit Quote' }).first().click();
    await page.waitForTimeout(1000);
a++;
}
 await validateAndLog({
  locator: page.locator('div').filter({ hasText: 'Project created successfully' }).nth(3),
  smessage: "Project created successfully with title: ",
  fmessage:  "Project creation failed" 
})
};

const surrogate_bid = async ({ page }) => {

await page.getByRole('textbox', { name: 'Search Title' }).press("Enter");
await page.getByRole('link', { name: 'first_name-102 last_name-102' }).first().click();
// await page.locator('div._headerSection_xwjmv_32 >> div[class*="_projectRefId_"]', { hasText: /^RFX-\d+$/ });
// Surrogate Bid - Tech 
await page.getByRole('tab', { name: 'Technical Stage' }).click();
await page.getByRole('tab', { name: 'Participants' }).click();
await page.getByRole('listitem').filter({ hasText: 'Company - 309--121226Add Bid' }).getByRole('button').click();
if (await page.getByText('Quick Fill').first().isVisible()) {
  console.log(` Quick Fill is visible`);
  await page.waitForTimeout(1000);
} 
await page.getByText('Quick Fill').first().click();
await page.getByRole('menuitem', { name: 'Same as Requested' }).click();
await page.getByText('Quick Fill').nth(1).click();
await page.getByRole('menuitem', { name: 'Same as Requested' }).click();
await page.getByRole('button', { name: 'Submit' }).click();
// Surrogate Bid - RFQ
// inline
await page.getByRole('tab', { name: 'RFQ' }).click();
if (await page.getByRole('tab', { name: 'Participants' }).isVisible()) {
  console.log(` Participants is visible`);
  await page.waitForTimeout(1000);
} 
await page.getByRole('tab', { name: 'Participants' }).dblclick();
await page.getByRole('button', { name: 'icon: plus Add Bid' }).first().click();
await page.locator('td:nth-child(7)').first().dblclick();
await page.getByRole('cell', { name: '₹ /NO' }).getByRole('textbox').fill("10");
await page.locator('tr:nth-child(3) > td:nth-child(7)').dblclick();
await page.getByRole('cell', { name: '₹ /Unit' }).getByRole('textbox').fill("15");
let i = 0;
  while (!await page.getByRole('cell', { name: '%' }).getByRole('textbox').isVisible() && i < 5) {
    await page.locator('td:nth-child(11)').first().dblclick();
    await page.waitForTimeout(1000);
    i++;
  }
await page.getByRole('cell', { name: '%' }).getByRole('textbox').fill("4");

let j = 0;
  while (!await page.getByRole('row', { name: '2 Product - 10(300377116)' }).getByRole('textbox').isVisible() && j < 5) {
    await page.locator('tr:nth-child(3) > td:nth-child(11)').dblclick();
    await page.waitForTimeout(1000);
    j++;
  }
await page.getByRole('row', { name: '2 Product - 10(300377116)' }).getByRole('textbox').fill("4");

await page.locator('td:nth-child(13)').first().dblclick();
await page.getByRole('row', { name: '1 Product1 Details PR' }).getByRole('textbox').fill("5");
await page.locator('tr:nth-child(3) > td:nth-child(13)').dblclick();
await page.getByRole('row', { name: '2 Product - 10(300377116)' }).getByRole('textbox').fill("5");
// global
let k = 0;
  while (!await page.getByRole('option', { name: 'ASW' }).isVisible() && k < 3) {
    await page.getByRole('row', { name: 'Incoterms*', exact: true }).locator('div').nth(1).click();
    await page.waitForTimeout(1000);
    k++;
  }
await page.getByRole('option', { name: 'ASW' }).click();
await page.getByRole('row', { name: 'Destination for Incoterms*' }).locator('td').nth(1).click();
await page.getByRole('tooltip', { name: 'Destination for Incoterms' }).getByRole('textbox').fill("Delhi");
await page.getByRole('row', { name: 'Vendor Category*' }).locator('div').nth(1).click();
await page.getByRole('option', { name: 'Service Provider' }).click();
// locator('._numberWrapper_1mlcc_2940').first()
await page.getByRole('row', { name: 'Incoming Domestic Freight*' }).locator('input').click();
await page.getByRole('row', { name: 'Incoming Domestic Freight*' }).locator('input').fill("5");
await page.getByRole('row', { name: 'Warranty Terms*' }).locator('div').nth(1).click();
await page.getByRole('option', { name: '12 months from Supply and 18' }).nth(1).click();
await page.getByRole('row', { name: 'Payment Terms*' }).locator('div').nth(1).click();
await page.getByRole('option', { name: 'AB09' }).click();
await page.getByRole('row', { name: 'Validity of Quotation*' }).locator('td').nth(1).click();
await page.locator('div').filter({ hasText: /^Today$/ }).click();
await page.getByRole('button', { name: 'Submit Quote' }).click();
};

const counter_offer = async ({ page }) => {
// client side 
  await page.getByRole('textbox', { name: 'Search Title' }).press("Enter");
  await page.getByRole('link', { name: 'first_name-102 last_name-102' }).first().click();
  await page.getByRole('tab', { name: 'RFQ' }).click();
  await page.locator('div[role="grid"]').first().hover();
  await page.mouse.wheel(1200, 0); 
  await page.waitForTimeout(2000);
  if (await page.getByRole('button', { name: 'Counter Offer' }).isVisible()) {
    await page.getByRole('button', { name: 'Counter Offer' }).click();
    await page.waitForTimeout(2000);
  }
  let a= 0;
    while (await page.getByRole('cell', { name: '₹ 20 /NO' }).nth(1).isVisible() && a < 2) {
      await page.getByRole('cell', { name: '₹ 20 /NO' }).nth(1).dblclick();
      await page.waitForTimeout(1000);
  a++;
  }
  await page.getByRole('row', { name: '1 Product1 Details 20 NO 20' }).getByRole('textbox').fill("15");
  await page.getByRole('button', { name: 'Send Counter Offer' }).click();
}

const counter_offer_vendor1 = async ({ page}) => {
// Accept counter offer
  await page.getByRole('textbox', { name: 'Search title or Ref-Id' }).press("Enter");
  await page.locator('.styles_stageTitle__IUGUn').first().click();
  await page.getByRole('tab', { name: 'RFQ' }).click();
  await page.getByRole('button', { name: 'Accept Offer' }).click();
}

const counter_offer_vendor2 = async ({ page}) => {
// Decline counter offer
  await page.getByRole('textbox', { name: 'Search title or Ref-Id' }).press("Enter");
  await page.locator('.styles_stageTitle__IUGUn').first().click();
  await page.getByRole('tab', { name: 'RFQ' }).click();
  await page.getByRole('button', { name: 'Decline' }).click();
  await page.getByRole('textbox', { name: 'Add a remark for declining' }).fill("abc");
  await page.getByLabel('Declining the counter offer').getByRole('button', { name: 'Decline' }).click();

}

const counter_offer_vendor3 = async ({ page}) => {
// Modify counter offer
  await page.getByRole('textbox', { name: 'Search title or Ref-Id' }).press("Enter");
  await page.locator('.styles_stageTitle__IUGUn').first().click();
  await page.getByRole('tab', { name: 'RFQ' }).click();
  await page.getByRole('gridcell', { name: '₹ 20 /NO icon: arrow-right ₹' }).click();
  await page.getByRole('button', { name: 'Decline' }).click();
  await page.getByRole('button', { name: 'Modify counter offer' }).click();
  await page.getByRole('gridcell', { name: '₹ 20 /NO icon: arrow-right ₹' }).click();
  await page.locator('input[type="text"]').fill("10");
  await page.locator('input[type="text"]').press("Enter");
  await page.waitForTimeout(1000);
  await page.getByRole('button', { name: 'Place Modified Bid' }).first().click();
  await page.getByRole('textbox', { name: 'Add a remark for declining' }).fill("abc");
  await page.getByLabel('Want to negotiate on the').getByRole('button', { name: 'Place Modified Bid' }).click();
}

export { rel_event , surrogate_bid, qa_event , qa_vendor_bid , test , counter_offer, counter_offer_vendor1 , counter_offer_vendor2 , counter_offer_vendor3};
