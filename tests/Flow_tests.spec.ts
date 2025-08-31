import { test } from "./setupBlocks/global.setup";
import { clientLogin, vendorLogin} from "./setupBlocks/login.setup";
import {ACTIVE_BACKEND , TEST_TIMEOUT } from "./setupBlocks/constant";
import { qa_event , qa_vendor_bid, surrogate_bid , counter_offer, counter_offer_vendor1, counter_offer_vendor2 , counter_offer_vendor3} from "./utils/eventCreation";


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
