
// export const FRONT_END = process.env.FrontEnd || "https://client-main.preview.procol.tech/";
// export const BACKEND_INSTANCE = process.env.BACKEND_INSTANCE || "qa-api";
// export const TEST_TIMEOUT = 120000;

// export const USERS = {

//   intake_member: "1000000102",
//   OTP :'987321'

// };

// https://client-ril-dev-final.preview.procol.tech/
// backend - ril-bestq
// 1234567890
// 179483


//  Central place to change the environment
// export const ACTIVE_BACKEND: "qa-api" | "ril-bestq" = "qa-api"; 

// export function USERS(target: "qa-api" | "ril-bestq"){
//   if (target === "ril-bestq") {
//     return {
//       FRONT_END: "https://client-ril-dev-final.preview.procol.tech/",
//       BACKEND_INSTANCE: "ril-bestq",
//       USER_MOBILE: "1234567890",
//       OTP: "179483"
//     };
//   }

//   if (target === "qa-api") {
//     return {
//       FRONT_END: "https://client-main.preview.procol.tech/",
//       BACKEND_INSTANCE: "qa-api",
//       USER_MOBILE: "1000000102",
//       OTP: "987321"
//     };
//   }

//   throw new Error(`Invalid target: ${target}`);
// }

// export const TEST_TIMEOUT = 120000;

export type UserRole = "client" | "vendor";
export const ACTIVE_BACKEND: "qa-api" | "ril-bestq" = "qa-api"; // Change backend here



export function USERS(target: "qa-api" | "ril-bestq", role: UserRole) {
  if (target === "ril-bestq") {
    if (role === "client") {
      return {
        FRONT_END: "https://client-ril-dev-final.preview.procol.tech/",
        BACKEND_INSTANCE: "ril-bestq",
        LOGIN_METHOD: "phone",
        USER_MOBILE: "1234567890",
        OTP: "179483"
      };
    } else {
      return {
        FRONT_END: "https://vendor-ril-dev-final.preview.procol.tech/",
        BACKEND_INSTANCE: "ril-bestq",
        LOGIN_METHOD: "email",
        EMAIL: "balesh.kumar@in.abb.com",
        OTP: "179483"
      };
    }
  }

  if (target === "qa-api") {
    if (role === "client") {
      return {
        FRONT_END: "https://client-main.preview.procol.tech/",
        BACKEND_INSTANCE: "qa-api",
        LOGIN_METHOD: "phone",
        USER_MOBILE: "1000000102",
        OTP: "987321"
      };
    } else {
      return {
        FRONT_END: "https://vendor-main.preview.procol.tech/",
        BACKEND_INSTANCE: "qa-api",
        LOGIN_METHOD: "phone",
        USER_MOBILE: "1000000312",
        OTP: "987321"
      };
    }
  }

  throw new Error(`Invalid target (${target}) or role`);
}

export const TEST_TIMEOUT = 120000;


