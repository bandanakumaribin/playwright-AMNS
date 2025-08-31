import { test } from "./setupBlocks/global.setup";
import { clientLogin, vendorLogin} from "./setupBlocks/login.setup";
import {ACTIVE_BACKEND , TEST_TIMEOUT } from "./setupBlocks/constant";
import { qa_event , qa_vendor_bid, surrogate_bid , counter_offer, counter_offer_vendor1, counter_offer_vendor2 , counter_offer_vendor3} from "./utils/eventCreation";


// Set BACKEND_INSTANCE dynamically before each test based on test title
// test.beforeEach(async ({}, testInfo) => {
//   if (testInfo.title.includes('env-ril-bestq')) {
//     process.env.BACKEND_INSTANCE = 'ril-bestq';
//   } else if (testInfo.title.includes('env-qa-api')) {
//     process.env.BACKEND_INSTANCE = 'qa-api';
//   }
// });

//let rfxText = ''; // ✅ Shared variable across tests



test.beforeEach(async () => {
    test.info().setTimeout(TEST_TIMEOUT);
  });
  
  test.describe.serial("Event Creation", () => {
  
  let rfxText = '';
    test("Event Creation Flow @TC001 ", async ({ clientPage  }) => {
      // test.info().setTimeout(TEST_TIMEOUT);
      await clientLogin({ page: clientPage });
      await clientPage.getByRole('link', { name: 'Events', exact: true }).click();
      await qa_event({ page: clientPage });
      // Fetch and store RFX text
      rfxText = (await clientPage.getByText('RFX-').textContent())?.trim();
      console.log("Captured RFX:", rfxText);
     
    });
  
    test("Vendor Login & Flow @TC003", async ({ vendorPage }) => {
      // test.info().setTimeout(TEST_TIMEOUT);
      await vendorLogin({ page: vendorPage });
      // Use shared value from previous test
      await vendorPage.getByRole('textbox', { name: 'Search title or Ref-Id' }).click();
      await vendorPage.getByRole('textbox', { name: 'Search title or Ref-Id' }).fill(rfxText);
      await qa_vendor_bid({ page: vendorPage });
    });
  
    test("Surrogate Bid @TC002 ", async ({ clientPage  }) => {
      // test.info().setTimeout(TEST_TIMEOUT);
      await clientLogin({ page: clientPage });
      await clientPage.getByRole('link', { name: 'Events', exact: true }).click();
      await clientPage.getByRole('textbox', { name: 'Search Title' }).click();
      await clientPage.getByRole('textbox', { name: 'Search Title' }).fill(rfxText);
      await surrogate_bid({ page:clientPage });
    });
  
 
  
  
  
  });
