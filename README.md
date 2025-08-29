### Steps to install and run
1. `npm install` 
2. Install this extension: 

    ![image](https://github.com/Procol-Tech/procol-client-dashboard/assets/124760840/d2a363ad-a59b-41bb-9854-e4aa9bce12b2)

3. Run awarding test from test Explorer:

    ![image](https://github.com/Procol-Tech/procol-client-dashboard/assets/124760840/92eafc60-7ac1-4885-95c3-97d25c72d128)

### User Journey Covered

1. **Buyer Actions:**
    - Logs in and selects some line items (user supplied, e.g., 4) from the PR page to create a project.
    - Creates a project with Technical and RFQ stages, selecting a specific template and evaluators.
    
2. **Vendor Bidding:**
    - 3 Vendors bid on technical and commercial stages with multiple currencies (INR, USD, and CNY) and random values.
    - Each vendor regrets any 1 of the line items (randomly).

3. **Buyer Actions:**
    - Waits for the event to end (starting evaluation time).
    - Splits a line item into 2 lots.

4. **Vendor Justification:**
    - Each vendor justifies their bid by modifying global fields to correspond to the lot splits.

5. **For each Lot:**
    - 5.1.  **Fast Bidding Mode Auction:**
        - Buyer selects vendor bids from the RFQ and triggers conversion to auction, sending it to the auction team.
        - Auction user publishes the auction with Fast Bidding Mode.
        - Each vendor revises their bid in the auction through fixed and percentage reduction on the lot.

    - 5.2.  **Cost Breakdown:**
        - Buyer waits for the bidding time to end (starting Cost Breakdown time).
        - After the start of CDB time, each vendor adjusts their prices to correspond to the lot revision.

    - 5.3  **Counter Offers:**
        - After the ending of CDB time (starting evaluation time), the Buyer gives a counter-offer on global and inline fields to one of the vendors (on non-regretted line items).
        - That particular vendor logs in and accepts the counteroffer.
    - 5.4  **Awarding and PO Creation:**
        - Buyer proceeds with awarding for that lot.
        - Each vendor is awarded some of the non-regretted line items.
        - PO creation is started post-awarding.
        - Custom PO forms are filled and submitted for proposal.
        - Final PO creation gets completed for the lot.
