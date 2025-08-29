import { test as baseTest ,expect , Page , BrowserContext} from "@playwright/test";
import { USERS, ACTIVE_BACKEND, UserRole } from "./constant";
import { openClientEvent } from "./event.setup";
import { vendorLogin } from "./login.setup";

// Used to prevent Exception raise from API calls in case of try-catch blocks
let shouldThrowError = true;

const addIntercept = async (page) => {
  // Intercept all responses
  page.on("response", async (response) => {
    const status = response.status();
    if (status >= 400) {
      // Log the error response for debugging
      console.error(
        `API request failed with status ${status}: ${response.url()}`
      );
      try {
        if (!(response.status() >= 500)) {
          const responseBody = await response.text();
          console.log(responseBody);
        }
      } catch (error) {
        console.error("Failed to read response body:", error);
      }
      // Fail the test if shouldThrowError is true
      if (shouldThrowError) {
        throw new Error(`API request failed with status ${status}`);
      }
    }
  });
};


// const test = baseTest.extend({
//   clientPage: async ({ page }, use) => {
//     const config = USERS(ACTIVE_BACKEND, "client");

//     const context = await page.context();
//     for (const p of context.pages()) await p.close();

//     const clientPage = await context.newPage();
//     await clientPage.goto(config.FRONT_END, { timeout: 60000 });

//     await clientPage.evaluate((backendInstance) => {
//       localStorage.setItem(
//         "procol_current_selected_api",
//         `https://${backendInstance}.ag-ri.in/api`
//       );
//     }, config.BACKEND_INSTANCE);

//     await clientPage.reload();
//     await use(clientPage);
//   },

//   vendorPage: async ({ page }, use) => {
//     const config = USERS(ACTIVE_BACKEND, "vendor");

//     const context = await page.context();
//     for (const p of context.pages()) await p.close();

//     const vendorPage = await context.newPage();
//     await vendorPage.goto(config.FRONT_END, { timeout: 60000 });

//     await vendorPage.evaluate((backendInstance) => {
//       localStorage.setItem(
//         "procol_current_selected_api",
//         `https://${backendInstance}.ag-ri.in/api`
//       );
//     }, config.BACKEND_INSTANCE);

//     await vendorPage.reload();
//     await use(vendorPage);
//   }
// });
// type Fixtures = {
//   clientPage: Page;
//   vendorPage: Page;
// };

// const test = baseTest.extend<Fixtures>({
//   clientPage: async ({ browser }, use) => {
//     const config = USERS(ACTIVE_BACKEND, "client");
//     const context = await browser.newContext();
//     const page = await context.newPage();

//     await page.goto(config.FRONT_END); //, { timeout: 60000 })
//     await page.evaluate((backendInstance) => {
//       localStorage.setItem("procol_current_selected_api",
//          `https://${backendInstance}.ag-ri.in/api`);
//     }, config.BACKEND_INSTANCE);

//     await page.reload();
//     await use(page);
//   },

//   vendorPage: async ({ browser }, use) => {
//     const config = USERS(ACTIVE_BACKEND, "vendor");
//     const context = await browser.newContext();
//     const page = await context.newPage();

//     await page.goto(config.FRONT_END);  //, { timeout: 60000 }
//     await page.evaluate((backendInstance) => {
//       localStorage.setItem("procol_current_selected_api",
//          `https://${backendInstance}.ag-ri.in/api`);
//     }, config.BACKEND_INSTANCE);

//     await page.reload();
//     await use(page);
//   }
// });

// export default test;


const test = baseTest.extend<{
  clientPage: any;
  vendorPage: any;
}>({
  clientPage: async ({ page }, use) => {
    const config = USERS(ACTIVE_BACKEND, "client");

    const context = await page.context();
    for (const p of context.pages()) await p.close();

    const clientPage = await context.newPage();
    await clientPage.goto(config.FRONT_END, { timeout: 60000 });

    await clientPage.evaluate((backendInstance) => {
      localStorage.setItem(
        "procol_current_selected_api",
        `https://${backendInstance}.ag-ri.in/api`
      );
    }, config.BACKEND_INSTANCE);

    await clientPage.reload();
    await use(clientPage);
  },

  vendorPage: async ({ page }, use) => {
    const config = USERS(ACTIVE_BACKEND, "vendor");

    const context = await page.context();
    for (const p of context.pages()) await p.close();

    const vendorPage = await context.newPage();
    await vendorPage.goto(config.FRONT_END, { timeout: 60000, waitUntil: "domcontentloaded"});
    console.log("Navigated to:", config.FRONT_END);

    await vendorPage.evaluate((backendInstance) => {
      localStorage.setItem(
        "procol_current_selected_api",
        `https://${backendInstance}.ag-ri.in/api`
      );
    }, config.BACKEND_INSTANCE);

    await vendorPage.reload({ waitUntil: "domcontentloaded", timeout: 10000 });
    await use(vendorPage);
  },
});

export default test;





// const test = baseTest.extend({
//   clientPage: async ({ page }, use) => {
//     const config = USERS(process.env.BACKEND_INSTANCE as 'qa-api' | 'ril-bestq');

//     const context = await page.context();
//     for (const p of context.pages()) {
//       await p.close();
//     }

//     const clientPage = await context.newPage();

//     await clientPage.goto(config.FRONT_END, { timeout: 60000 });
//     await clientPage.evaluate((backendInstance) => {
//       localStorage.setItem(
//         "procol_current_selected_api",
//         `https://${backendInstance}.ag-ri.in/api`
//       );
//     }, config.BACKEND_INSTANCE);
//     await clientPage.reload();

//     await use(clientPage);
//   }
// });

// const test = baseTest.extend({
//   clientPage: async ({ page }, use) => {
//     const config = USERS(ACTIVE_BACKEND);
//     // close default pages
//     const context = await page.context();
//     for (const page of context.pages()) {
//       await page.close();
//     }

//     const clientPage = await context.newPage();

//     await clientPage.goto(config.FRONT_END, { timeout: 60000 });

//     await clientPage.evaluate((backendInstance) => {
//       localStorage.setItem(
//         "procol_current_selected_api",
//         `https://${backendInstance}.ag-ri.in/api`
//       );
//     }, config.BACKEND_INSTANCE);

//     await clientPage.reload();
//     await use(clientPage);
//   }
// });


// const test = baseTest.extend({
//   clientPage: async ({ page }, use) => {
//     const context = await page.context();
//     // close default pages
//     for (const page of context.pages()) {
//       await page.close();
//     }
//     const clientPage = await context.newPage();
//     await clientPage.goto(FRONT_END, { timeout: 60000 });
//     await clientPage.evaluate((backendInstance) => {
//       localStorage.setItem(
//         "procol_current_selected_api",
//         `https://${backendInstance}.ag-ri.in/api`
//       );
//     }, BACKEND_INSTANCE);
//     await clientPage.reload();
//     await use(clientPage);
//   },
// });

const setShouldThrowError = (value) => {
  shouldThrowError = value;
};

const Validate = async (Page,locaator,sucess_message,erro_message) => {

  try {
    await Page.getByText(locaator).waitFor({ timeout: 20000 });
    if (await Page.getByText(locaator).isVisible()) {

        console.log("✅ "+sucess_message);
    } else {
        throw new Error("❌ "+erro_message);
    }
} catch (error) {
    throw new Error("❌ "+erro_message);
}
}


const log_event = async (page, title) => {
  if (LOG_EVENT !== "true") return;

  await openClientEvent({ page, title });
  let url = page.url();
  // replacing the endpoint with enterprise url
  url = url.replace(
    /https:\/\/.*\.procol.tech/,
    "https://enterprise.procol.tech"
  );
  const fs = require("fs");
  fs.writeFileSync("event.log", url);
  console.log("Event URL logged for future reference");
};

export { test, expect,  log_event, setShouldThrowError ,Validate};
