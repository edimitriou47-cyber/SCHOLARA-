// Edit prices here. No source changes needed elsewhere.
window.PRICING = {
  currency: "€", wordsPerPage: 250,
  services: {            // rate per standard page (250 words)
    proof: { rate: 4 }, edit: { rate: 5.5 }, adv: { rate: 7 }, phd: { rate: 8 },
    eng: { rate: 7, max: 10 }
  },
  fixed: {               // formatting per page, others flat "from"
    format: { perPage: 2, max: 3 }, refs: { from: 30 }, final: { from: 50 }
  },
  discounts: [ { minPages: 150, pct: 15 }, { minPages: 80, pct: 10 } ],
  customQuoteAbovePages: 600,
  delivery: { standard: 0, priority: 25, express: 50 }   // % surcharge
};
