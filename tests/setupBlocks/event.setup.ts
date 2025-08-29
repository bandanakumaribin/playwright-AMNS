import { expect, setShouldThrowError } from "./global.setup";
import {
  DEFAULT_QUANTITY,
  EVALUATOR,
  EVENT_DURATION,
  EXTRA_DELAY,
  STAGES,
  TEMPLATE_NAME,
  VENDOR_OBJ,
} from "./constant";

// PRIVATE FUNCTIONS

const selectPRItemAndAddToCart = async (page, lineItems) => {
  await page
    .getByRole("menuitem", { name: "Purchase Requisitions" })
    .locator("div")
    .click();
  await page.getByRole("button", { name: "icon: filter Filter" }).click();
  try {
    await expect(
      page.getByRole("button", { name: "icon: delete Clear Filter" })
    ).toBeEnabled({ timeout: 1000 + EXTRA_DELAY });
    await page
      .getByRole("button", { name: "icon: delete Clear Filter" })
      .click();
    console.log("Filters cleared");
  } catch (error) {
    console.log("No filters applied");
    await page.getByRole("button", { name: "Cancel" }).click();
  }
  for (let i = 0; i < lineItems; i++) {
    await page
      .locator(
        `.ant-table-body-inner > .ant-table-fixed > .ant-table-tbody > tr:nth-child(${
          i + 2
        })`
      )
      .locator(".ant-checkbox-wrapper > .ant-checkbox > .ant-checkbox-input")
      .first()
      .check();
  }
  await page
    .getByRole("button", { name: "icon: shopping-cart Purchase" })
    .click();

  // TODO - Add assertions
  console.log("PR items added to cart");
};

const setQuantityAndStagesForProject = async (page) => {
  for (const lineItem of await page.getByRole("spinbutton").all()) {
    await lineItem.click();
    await lineItem.fill(DEFAULT_QUANTITY.toString());
  }
  await page.getByRole("button", { name: "Create Project" }).click();
  await page.getByRole("menuitem", { name: "Technical Stage" }).click();
  await page.getByRole("menuitem", { name: "RFQ" }).click();
  await page.getByRole("button", { name: "Create Project" }).click();

  // TODO - Add assertions
  console.log("Quantity and stages set for project");
};

const selectTemplate = async (page) => {
  await page.getByRole("button", { name: "Template" }).hover();
  await page.getByText(TEMPLATE_NAME).click();

  try {
    await page.getByRole("button", { name: "Yes" }).click();
    console.log("RFQ Template selected");
  } catch (error) {
    console.log("Template selected by default");
  }

  // TODO - Add assertions
};

const addEvaluators = async (page) => {
  await page
    .locator("#procol-content-wrapper")
    .getByText("Technical Stage")
    .click();
  let buttons = await page
    .getByRole("button", { name: "icon: plus Add Evaluator" })
    .all();
  for (let i = 0; i < buttons.length; i++) {
    // Re-query the buttons to get fresh references
    const button = await page
      .getByRole("button", { name: "icon: plus Add Evaluator" })
      .first();
    await button.click();
    await waitForTimeout(page, 1000);
    await page.getByRole("menuitem", { name: EVALUATOR }).click();
  }
  // TODO - Add assertions
  console.log("Evaluators added");
};

const inviteVendorAndAddTitle = async (page, title) => {
  await page.getByRole("tab", { name: "RFQ" }).click();
  await page.getByRole("button", { name: "Invite Vendor" }).click();

  await page.getByPlaceholder("Enter the title of the project").click();
  await page.getByPlaceholder("Enter the title of the project").fill(title);

  // TODO - Add assertions
  console.log("Vendor invited and title added");
};

const publishProject = async (page) => {
  await page.getByRole("button", { name: "Publish" }).click();
  await page
    .getByLabel("Publish Event")
    .getByRole("button", { name: "Publish" })
    .click();
  // TODO - Add assertions
  console.log("Project publish triggered");
};

const validateSplit = async ({ page, lotVsSrNos, vendorCount }) => {
  for (const [lot, srNos] of Object.entries(lotVsSrNos)) {
    await page.getByText(lot).click();
    await page.waitForTimeout(1000);
    await expect(page.getByRole("row")).toHaveCount(srNos.length + 2);
    for (const srNo of srNos) {
      await expect(
        page.getByRole("gridcell", { name: srNo.toString(), exact: true })
      ).toBeVisible();
    }
    await page.getByLabel("vertical-switch").click();
    await expect(page.getByText("Approval Pending")).toHaveCount(vendorCount);
  }
};

const quickFillPO = async (page, lotNo) => {
  let awardedVendorsCount = 0;
  for (let vendor of VENDOR_OBJ) {
    try {
      await page
        .getByRole("columnheader", { name: vendor.name })
        .getByRole("button")
        .waitFor({ timeout: 5000 });

      await page
        .getByRole("columnheader", { name: vendor.name })
        .getByRole("button")
        .click();
    } catch (error) {
      console.log(
        `Vendor ${vendor.name} not selected for awarding in lot ${lotNo}`
      );
      continue;
    }
    awardedVendorsCount++;
    let QuickFillInputs = (
      await page
        .getByLabel("Quick Fill Line Item Inputs")
        .getByRole("combobox")
        .all()
    ).length;
    for (let ind = 0; ind < QuickFillInputs; ind++) {
      await waitForTimeout(page, 1000);
      await page
        .getByLabel("Quick Fill Line Item Inputs")
        .locator("svg")
        .nth(ind + 1)
        .click();
      await page.getByRole("option").first().click();
    }
    await page.getByRole("button", { name: "Apply to All" }).click();
  }

  console.log("Quick Fill Done");
  return awardedVendorsCount;
};

const fillMandatoryFields = async (page, awardedVendorsCount) => {
  const mandatoryPoFields = {
    "Order Category": { value: "E-bidding", type: "dropdown" },
    "Approved Vendors": { value: 1, type: "number" },
    "Order on Lowest One": { value: "YES", type: "dropdown" },
    "Reason for Not Selecting": { value: "test", type: "text" },
    "Shipping Instructions": { value: "test", type: "text" },
    "Justification for Order": { value: "test", type: "text" },
    "GST Terms and Conditions": { value: "test", type: "text" },
  };

  for (let [column, { value, type }] of Object.entries(mandatoryPoFields)) {
    for (let ind = 0; ind < awardedVendorsCount; ind++) {
      await page
        .getByRole("row", { name: column })
        .getByRole("gridcell")
        .nth(ind + 1)
        .click();
      if (type === "dropdown") {
        await page.getByRole("option", { name: value }).click();
      } else if (type === "text") {
        await page.getByRole("tooltip").getByRole("textbox").fill(value);
        await page
          .getByRole("row", { name: column })
          .getByRole("gridcell")
          .nth(ind + 1)
          .click();
      } else {
        Array.from({ length: value }).forEach(
          async () => await page.getByLabel("Increase Value").nth(ind).click()
        );
      }
      await waitForTimeout(page, 1000);
      await page.mouse.wheel(0, 100);
    }
  }
  console.log("Mandatory Fields Filled");
};

// PUBLIC FUNCTIONS

const setEventDuration = async (page, duration, type = "") => {
  await page.getByRole("button", { name: "icon: clock-circle Now" }).click();
  for (let stage = 0; stage < STAGES; stage++) {
    await page
      .getByText("Mins")
      .nth(stage + 1)
      .click();
    await page.getByRole("menuitem", { name: "Custom duration" }).click();
    await page.getByPlaceholder("60").nth(stage).click();
    await page.getByPlaceholder("60").nth(stage).fill(duration.toString());
    await page.getByRole("button", { name: "Save", exact: true }).click();
  }
  await page.getByRole("button", { name: "Save Schedule" }).click();
  console.log(`Event duration set to ${duration} mins`);
};

const setupEvent = async (page, title, object = {}) => {
  const lineItems = object.lineItems ?? 2;
  const duration = object.duration ?? EVENT_DURATION;
  // Create a new event
  await selectPRItemAndAddToCart(page, lineItems);
  await setQuantityAndStagesForProject(page);
  await selectTemplate(page);
  await addEvaluators(page);
  await setEventDuration(page, duration);
  await inviteVendorAndAddTitle(page, title);
  await publishProject(page);

  // Check if the event is created
  await page.getByRole("menuitem", { name: "Events" }).locator("div").click();
  await expect(page.getByText(title)).toBeVisible();
  console.log("PROJECT PUBLISHED SUCCESSFULLY");
};

const validateBidPlaced = async ({ page, title, lineItems, vendorCount }) => {
  // go to event
  await openClientEvent({ page, title, type: "Overview" });

  // Assert total bids placed
  await expect(page.getByText("Bid placed")).toHaveCount(vendorCount * 2); // * 2 since tech+rfq bids (total 2) for each vendor

  // Assert vendor's technical bids
  await page.getByRole("tab", { name: "Technical Stage" }).click();
  await expect(page.getByRole("columnheader")).toHaveCount(vendorCount + 2); // +2 since two extra headers present in the table

  // Assert vendor's bidded line items
  for (let i = 0; i < lineItems; i++) {
    await page
      .getByRole("gridcell", { name: "icon: caret-down" })
      .getByRole("button")
      .first()
      .click();
  }
  await expect(
    page.getByRole("row", { name: "icon: caret-right" })
  ).toHaveCount(lineItems); // each line item should have a row in TS sheet
  console.log("BIDS VALIDATED");
};

const raiseCounterOfferToVendor = async ({ page, title, vendor, options }) => {
  await page.getByLabel("vertical-switch").click();
  await waitForTimeout(page, 3000); // wait for view to switch
  await page
    .getByRole("columnheader", { name: vendor.name })
    .locator("#counterOffer")
    .click();

  const counterOfferModal = page.getByLabel(`Counter Offer for ${vendor.name}`);

  // logic to select counter offer cells with provided widget to give counter offer
  const cells = await counterOfferModal
    .getByTestId(options.counterOfferWidget)
    .filter({ hasText: /.+/ })
    .all();
  const enabledCells = await Promise.all(
    cells.map(async (cell) => {
      const isDisabled = await cell.evaluate(
        (el) => el.getAttribute("aria-disabled") === "false"
      );
      return isDisabled ? cell : null;
    })
  ).then((cells) => cells.filter(Boolean));

  for (let i = enabledCells.length - 1; i >= 0; i--) {
    const element = enabledCells[i];
    await element.dblclick();
    await element.getByRole("textbox").fill(options.counterOfferValue);
    await element.press("Enter");
    await waitForTimeout(page, 2000);
  }

  await counterOfferModal
    .getByRole("row", { name: options.globalCounterOfferField })
    .getByPlaceholder("Choose a date")
    .click();

  const dateInFourDays = new Date();
  dateInFourDays.setDate(dateInFourDays.getDate() + 4);
  const formattedDate = `${dateInFourDays.toLocaleString("default", {
    month: "long",
  })} ${dateInFourDays.getDate()}, ${dateInFourDays.getFullYear()}`;

  await page.getByTitle(formattedDate).first().locator("div").click();

  await waitForTimeout(page, 1000);
  await page.getByRole("button", { name: "Send Counter Offer" }).click();
  await waitForTimeout(page, 3000);
  console.log(`COUNTER OFFER RAISED TO ${vendor.name}`);
  return enabledCells.length;
};

const split_line_items = async (page, lineItems, vendorCount) => {
  await page
    .getByRole("button", { name: "icon: setting Settings icon:" })
    .click();
  await page
    .getByRole("menuitem", { name: "Split line items into lots" })
    .click();
  for (let i = 0; i < lineItems / 2; i++) {
    await page.getByText("SelectLot").first().click();
    await page.getByRole("option", { name: "Lot 2" }).click();
  }
  await page
    .getByRole("button", { name: "icon: right Lot 1" })
    .getByRole("button", { name: "Publish Lot" })
    .click();
  await page.waitForTimeout(3000);
  await page
    .getByRole("button", { name: "icon: right Lot 2" })
    .getByRole("button", { name: "Publish Lot" })
    .click();
  await page.waitForTimeout(3000);
  await page.getByRole("button", { name: "Close", exact: true }).click();
  const lotVsSrNos = {
    "Lot 1": Array.from(
      { length: lineItems - Math.ceil(lineItems / 2) },
      (_, i) => i + Math.ceil(lineItems / 2) + 1
    ),
    "Lot 2": Array.from({ length: Math.ceil(lineItems / 2) }, (_, i) => i + 1),
  };
  await validateSplit({ page, lotVsSrNos, vendorCount });
  console.log("Line Items Split Into Lots Successfully");
  return lotVsSrNos;
};

const validateBidAdjust = async ({ page, lotSize }) => {
  for (let lotNo = 1; lotNo <= lotSize; lotNo++) {
    await page.getByText(`Lot ${lotNo}`).click();
    await page.waitForTimeout(1000);
    await page.getByLabel("vertical-switch").click();
    await page.waitForTimeout(2000);
    await expect(page.getByText("Approval Pending")).toHaveCount(0);
  }
  console.log("Bid Adjustments Validated");
};

const openClientEvent = async ({ page, title, lotNo = 0, type = "RFQ" }) => {
  await page.bringToFront();
  await page.getByRole("menuitem", { name: "Events" }).locator("div").click();
  await page.getByPlaceholder("Search Title").click();
  await page.getByPlaceholder("Search Title").fill(title);
  await page.getByText(title).click();
  if (type == "Overview") return;
  if (lotNo) {
    await page.getByRole("tab", { name: "RFQ" }).click();
    await waitForTimeout(page, 3000);
    await page.getByText(`Lot ${lotNo}`).click();
    await waitForTimeout(page, 2000);
    await page.getByRole("button", { name: type }).click();
  } else {
    await page.getByRole("tab", { name: type }).click();
  }
  await waitForTimeout(page, 3000);
};

const waitForEventEnd = async (page, type = "RFQ") => {
  const eventVsEndIdentifier = {
    RFQ: {
      identifier: "Download Report",
      message: "Waiting for submission time to end",
    },
    Auction: {
      identifier: "Withdraw",
      message: "Waiting for Cost BreakDown time to start",
    },
  };

  console.log(eventVsEndIdentifier[type].message);
  if (type === "Auction") {
    await page.getByRole("button", { name: "Settings" }).click();
    await waitForTimeout(page, 2000);
    await expect(
      page.getByText(eventVsEndIdentifier[type].identifier)
    ).not.toBeVisible({
      timeout: 60000 + EXTRA_DELAY,
    });
  } else {
    await expect(
      page.getByText(eventVsEndIdentifier[type].identifier)
    ).toBeVisible({
      timeout: 60000 + EXTRA_DELAY,
    });
  }
  console.log("Wait time completed");
};

const validateBidPlacedInAuction = async ({
  page,
  title,
  vendorCount,
  lotNo,
}) => {
  await openClientEvent({ page, title, lotNo });
  await page.getByRole("button", { name: "Auction" }).click();
  await page.getByLabel("vertical-switch").click();
  await expect(page.getByText("Auto-Justified")).toHaveCount(vendorCount);
  console.log("Bids Placed In Auction Validated");
};

const publishAuction = async (page, lotNo) => {
  await page.getByRole("menuitem", { name: "Events" }).click();
  await page
    .getByRole("link", {
      name: `Lot ${lotNo} - Auction To Be Scheduled ${VENDOR_OBJ.length}`,
      exact: true,
    })
    .first()
    .click();
  await waitForTimeout(page, 3000);

  // Remove DTE from the event
  await page.getByRole("button", { name: "Rank on line" }).click();
  await page
    .locator("span")
    .filter({ hasText: "Dynamic Event Extension" })
    .getByLabel("")
    .uncheck();

  await page.getByRole("button", { name: "Save" }).click();
  await page.getByRole("button", { name: "Publish" }).click();
  await page
    .getByLabel("Publish Event")
    .getByRole("button", { name: "Publish" })
    .click();
  await waitForTimeout(page, 5000);
  console.log(`Auction of Lot ${lotNo} published`);
};

const convertToAuction = async (page, title, lotNo) => {
  await openClientEvent({ page, title, lotNo });
  await page
    .getByRole("button", { name: "icon: setting Settings icon:" })
    .click();
  await page.getByRole("menuitem", { name: "Convert to Auction" }).click();
  await page.getByRole("button", { name: "Continue" }).click();
  await waitForTimeout(page, 2000);

  await expect(
    page.getByText(
      `We received quotes from ${VENDOR_OBJ.length} vendors in this RFQ`
    )
  ).toBeVisible();
  await expect(
    page.locator("#participantSelection").first().locator("li")
  ).toHaveCount(VENDOR_OBJ.length + 1); // +1 to take into account empty option

  await page.getByRole("button", { name: "Rank on line" }).click();
  await page.getByLabel("Enable Fast Bidding Mode").check();
  await page
    .locator("span")
    .filter({ hasText: "Dynamic Event Extension" })
    .getByLabel("")
    .uncheck();
  await page.getByRole("button", { name: "Save" }).click();

  await setEventDuration(page, 2.5, "Auction");

  await page.getByRole("button", { name: "Send to Auction team" }).click();
  await page
    .getByRole("button", { name: "Send to Auction Team", exact: true })
    .click();
  await waitForTimeout(page, 5000);
  console.log(`RFQ of Lot ${lotNo} sent to auction team`);
};

const awardVendors = async (page, lotItems) => {
  await page.getByRole("button", { name: "Start Awarding" }).click();
  await page
    .locator("#procol-content-wrapper")
    .getByRole("button")
    .nth(2)
    .click(); // change to horizontal view for better visibility

  await waitForTimeout(page, 2000);

  // Select vendor to be awarded for each line item
  for (let i = 0; i < lotItems + 1; i++) {
    // +1 for caret of Other Charges
    await page
      .getByRole("button", { name: "icon: caret-down" })
      .first()
      .click();
  }

  let vendorInd = 0;
  for (let i = 0; i < lotItems; i++) {
    await page
      .getByRole("button", { name: "icon: caret-right" })
      .nth(i)
      .click();

    // This loop is to ensure that we are awarding vendor for non-regretted line items
    for (let _entry of VENDOR_OBJ) {
      try {
        setShouldThrowError(false);
        await page.locator("label").nth(vendorInd).click();

        // Check for the confirmation popover and click "Yes" if it appears
        try {
          const popover = await page
            .getByRole("tooltip")
            .getByText(
              "Are you sure to award this line item as it is in RFP evaluation?"
            );
          if (popover) {
            const yesButton = await page.getByRole("button", { name: "Yes" });
            await yesButton.click();
          }
        } catch (popoverError) {
          // Popover didn't appear, continue with the flow
        }

        await page
          .getByText("Awarded")
          .waitFor({ timeout: 5000 + EXTRA_DELAY });
        break;
      } catch (error) {
        vendorInd = (vendorInd + 1) % VENDOR_OBJ.length;
      } finally {
        setShouldThrowError(true);
      }
    }

    await page
      .getByRole("button", { name: "icon: caret-down" })
      .first()
      .click();

    await waitForTimeout(page, 2000);
    vendorInd = (vendorInd + 1) % VENDOR_OBJ.length;
  }
};

const createPO = async (page, lotNo) => {
  await page.getByRole("button", { name: "Create PO" }).click();
  await waitForTimeout(page, 3000);

  const awardedVendorsCount = await quickFillPO(page, lotNo);

  await fillMandatoryFields(page, awardedVendorsCount);

  await page.getByRole("button", { name: "Submit Proposal" }).click();
  await page
    .getByRole("dialog")
    .getByRole("button", { name: "Submit Proposal" })
    .click();
  return awardedVendorsCount;
};

export {
  setupEvent,
  setEventDuration,
  validateBidPlaced,
  raiseCounterOfferToVendor,
  split_line_items,
  validateBidAdjust,
  openClientEvent,
  waitForEventEnd,
  validateBidPlacedInAuction,
  convertToAuction,
  publishAuction,
  awardVendors,
  createPO,
};
