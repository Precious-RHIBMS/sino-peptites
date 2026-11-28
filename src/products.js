/**
 * Local Product Catalog & Storefront Configuration
 * Runs completely client-side with zero backend dependencies.
 */

export const STORE_CONFIG = {
  brandName: 'sino_pepts',
  tagline: 'HPLC-Verified Research Peptides & Analytical Lab Solutions',
  shippingFee: 12.0,
  freeShippingThreshold: 150.0,
  currency: 'USD',
  contact: {
    email: 'care@sinopepts.com',
    phone: '+1 (503) 555-0194',
    address: '418 NW Flanders St, Suite 300, Portland, OR 97209',
    hours: 'Mon–Fri · 08:00–18:00 PST',
  },
};

export const CATEGORIES = [
  {
    id: 'other-peptides',
    name: 'Other Peptides',
    description: 'Lyophilized peptides, coenzymes, and lipotropic research vials.',
    image: '/assets/products/tesamorelin.png',
    imageBg: 'light',
    count: 8,
  },
  {
    id: 'lab-peptide',
    name: 'Lab Peptide',
    description: 'High-purity (>99%) standardized research peptide formulations.',
    image: '/assets/products/retatrutide.png',
    imageBg: 'dark',
    count: 3,
  },
  {
    id: 'bacteriostatic-water',
    name: 'Bacteriostatic Water',
    description: 'Sterile USP-grade reconstitution diluent with 0.9% benzyl alcohol.',
    image: '/assets/products/bacteriostatic_water.png',
    imageBg: 'light',
    count: 1,
  },
  {
    id: 'metabolic-support',
    name: 'Metabolic Support',
    description: 'Clinically studied oral capsules for metabolic research protocols.',
    image: '/assets/products/orlistat.png',
    imageBg: 'light',
    count: 1,
  },
];

/**
 * Sample Batch Certificates of Analysis for the Certificates section & inspection modal.
 */
export const CERTIFICATES = [
  {
    id: 'COA-2611-A',
    title: 'RP-HPLC Peptide Purity Assay',
    batchCode: 'LOT #SP-2611-04',
    standard: 'ISO/IEC 17025 Accredited Lab',
    result: '99.4% Active Purity · Pass',
    testedDate: 'November 12, 2026',
    summary:
      'Reversed-phase high-performance liquid chromatography confirming >99% primary sequence integrity and absence of truncated synthesis fragments.',
    metrics: [
      { label: 'Main Peak Area (HPLC)', value: '99.42%' },
      { label: 'Trifluoroacetate Counter-Ion', value: '<0.8% w/w' },
      { label: 'Appearance', value: 'White Lyophilized Cake' },
    ],
  },
  {
    id: 'COA-2611-B',
    title: 'LC-MS Molecular Weight & Identity',
    batchCode: 'LOT #SP-2611-09',
    standard: 'ESI-TOF Mass Spectrometry',
    result: 'Exact Mass Confirmed · Pass',
    testedDate: 'November 14, 2026',
    summary:
      'Electrospray ionization time-of-flight mass spectrometry verifying exact monoisotopic molecular weight and amino acid sequence fidelity.',
    metrics: [
      { label: 'Mass Accuracy Delta', value: '<1.2 ppm' },
      { label: 'Heavy Metals (ICP-MS)', value: '<0.005 ppm' },
      { label: 'Moisture (Karl Fischer)', value: '2.1%' },
    ],
  },
  {
    id: 'COA-2611-C',
    title: 'Endotoxin & Sterility Screening',
    batchCode: 'LOT #SP-2610-18',
    standard: 'USP <85> LAL Chromogenic',
    result: '<0.05 EU/mg · Pass',
    testedDate: 'October 29, 2026',
    summary:
      'Kinetic chromogenic Limulus Amebocyte Lysate testing and membrane filtration sterility verification on lyophilized vials and bacteriostatic water.',
    metrics: [
      { label: 'Bacterial Endotoxins', value: '<0.05 EU/mg' },
      { label: 'Total Aerobic Microbial Count', value: '0 CFU/vial' },
      { label: 'Container Closure Integrity', value: 'Vacuum Sealed Pass' },
    ],
  },
  {
    id: 'COA-2611-D',
    title: 'Cold-Chain & Vial Stability Panel',
    batchCode: 'LOT #SP-2611-02',
    standard: 'ICH Q1A Thermal Stability',
    result: '100% Assay Retention · Pass',
    testedDate: 'November 08, 2026',
    summary:
      'Accelerated thermal cycling verification confirming lyophilized peptide stability across domestic and international transit windows.',
    metrics: [
      { label: 'Active Potency Retention', value: '99.1% at 30 Days' },
      { label: 'Reconstitution Clarity', value: 'Clear, Particulate-Free' },
      { label: 'pH After Reconstitution', value: '6.8 – 7.2' },
    ],
  },
];

/**
 * Complete product catalog from the provided reference catalog.
 */
export const PRODUCTS = [
  {
    id: 'prod-tesamorelin-10mg',
    sku: 'SP-PEP-101',
    name: 'Tesamorelin 10mg',
    categoryId: 'other-peptides',
    categoryName: 'Other Peptides',
    image: '/assets/products/tesamorelin.png',
    imageBg: 'light',
    purityNote: '99% Purity · Research Use Only',
    shortDescription:
      'Stabilized 44-amino-acid GHRH analog lyophilized peptide supplied in sealed 10mg glass vials.',
    description:
      'Tesamorelin 10mg is synthesized via solid-phase peptide synthesis and purified by preparative HPLC to >=99% purity. Supplied as a sterile lyophilized powder in crimp-sealed borosilicate vials for laboratory research.',
    specs: [
      { label: 'Purity (HPLC)', value: '>= 99.0%' },
      { label: 'Vial Content', value: '10 mg Lyophilized Powder' },
      { label: 'Storage', value: '-20°C Long-Term / 2–8°C Short-Term' },
    ],
    variants: [
      { id: 'tesa-1x10', label: '1 × 10mg Vial', price: 60.0, stock: 28 },
      { id: 'tesa-3x10', label: '3 × 10mg Vials', price: 168.0, stock: 14 },
      { id: 'tesa-6x10', label: '6 × 10mg Kit', price: 320.0, stock: 7 },
    ],
  },
  {
    id: 'prod-nad-plus',
    sku: 'SP-NAD-102',
    name: 'NAD+',
    categoryId: 'other-peptides',
    categoryName: 'Other Peptides',
    image: '/assets/products/nad_plus.png',
    imageBg: 'light',
    purityNote: '500mg · 80 Sprays / 10ml',
    shortDescription:
      'Nicotinamide Adenine Dinucleotide 500mg metered nasal spray formulation (10ml / 80 sprays).',
    description:
      'Standardized 500mg NAD+ coenzyme solution housed in a metered 10ml nasal atomizer delivering 80 calibrated sprays per bottle. Batch-verified for coenzyme stability and purity.',
    specs: [
      { label: 'Concentration', value: '500 mg per 10 ml Bottle' },
      { label: 'Metered Output', value: '80 Calibrated Sprays' },
      { label: 'Purity Assay', value: '99.2% HPLC Verified' },
    ],
    variants: [
      { id: 'nad-1x500', label: '1 Bottle (500mg / 10ml)', price: 50.0, stock: 34 },
      { id: 'nad-2x500', label: '2 Bottles (1000mg Total)', price: 92.0, stock: 19 },
      { id: 'nad-3x500', label: '3 Bottles (1500mg Total)', price: 130.0, stock: 11 },
    ],
  },
  {
    id: 'prod-lipo-b-10ml',
    sku: 'SP-LIP-103',
    name: 'LIPO-B 10ml',
    categoryId: 'other-peptides',
    categoryName: 'Other Peptides',
    image: '/assets/products/lipo_b.png',
    imageBg: 'light',
    purityNote: '99% Purity · Research Use Only',
    shortDescription:
      'Lipotropic MIC & B-complex sterile 10ml multi-dose research solution.',
    description:
      'LIPO-B 10ml combines methionine, inositol, choline, and cyanocobalamin in a sterile, nitrogen-flushed 10ml septum vial engineered for metabolic pathway assays.',
    specs: [
      { label: 'Volume', value: '10 ml Sterile Vial' },
      { label: 'Purity', value: '99% Analytical Grade' },
      { label: 'Filtration', value: '0.22 Micron Sterile Filtered' },
    ],
    variants: [
      { id: 'lipob-1x10', label: '1 × 10ml Vial', price: 70.0, stock: 22 },
      { id: 'lipob-2x10', label: '2 × 10ml Vials', price: 120.0, stock: 12 },
    ],
  },
  {
    id: 'prod-selank',
    sku: 'SP-SLK-104',
    name: 'Selank',
    categoryId: 'other-peptides',
    categoryName: 'Other Peptides',
    image: '/assets/products/selank.png',
    imageBg: 'light',
    purityNote: '10mg · Professional Peptide Series',
    shortDescription:
      'Synthetic tuftsin-analog heptapeptide (10mg) verified for neurochemical research.',
    description:
      'Selank 10mg is a stabilized synthetic heptapeptide supplied in protective pharmaceutical-grade carton packaging with tamper-evident lot labeling and full COA documentation.',
    specs: [
      { label: 'Amount', value: '10 mg per Vial' },
      { label: 'Sequence Purity', value: '>= 98.8% RP-HPLC' },
      { label: 'Packaging', value: 'Tamper-Sealed Boxed Vial' },
    ],
    variants: [
      { id: 'selank-1x10', label: '1 × 10mg Vial', price: 50.0, stock: 26 },
      { id: 'selank-2x10', label: '2 × 10mg Vials', price: 80.0, stock: 15 },
    ],
  },
  {
    id: 'prod-retatrutide',
    sku: 'SP-RET-201',
    name: 'RETATRUTIDE',
    categoryId: 'lab-peptide',
    categoryName: 'Lab Peptide',
    image: '/assets/products/retatrutide.png',
    imageBg: 'dark',
    purityNote: 'Purity Exceeds 99% · Research Only',
    shortDescription:
      'Triple-agonist GLP-1/GIP/Glucagon receptor research peptide exceeding 99% purity.',
    description:
      'RETATRUTIDE is a multi-receptor agonist peptide manufactured to stringent analytical specifications (>99% purity by HPLC/MS). Available from single 5mg vials up to multi-vial laboratory kits.',
    specs: [
      { label: 'Purity', value: '> 99.0% (HPLC & Mass Spec)' },
      { label: 'Form', value: 'Lyophilized White Powder' },
      { label: 'Usage', value: 'For Research Purposes Only' },
    ],
    variants: [
      { id: 'ret-5mg', label: '5mg Single Vial', price: 60.0, stock: 30 },
      { id: 'ret-10mg', label: '10mg Single Vial', price: 115.0, stock: 18 },
      { id: 'ret-kit', label: '5 × 10mg Research Kit', price: 325.0, stock: 6 },
    ],
  },
  {
    id: 'prod-semaglutide',
    sku: 'SP-SEM-202',
    name: 'SEMAGLUTIDE',
    categoryId: 'lab-peptide',
    categoryName: 'Lab Peptide',
    image: '/assets/products/semaglutide.png',
    imageBg: 'dark',
    purityNote: 'Purity Exceeds 99% · Research Only',
    shortDescription:
      'GLP-1 receptor agonist research peptide (5mg) verified to exceed 99% purity.',
    description:
      'SEMAGLUTIDE is supplied in vacuum-sealed sterile vials with verified sequence identity and >=99% purity by reversed-phase HPLC and ESI-TOF mass spectrometry.',
    specs: [
      { label: 'Purity', value: '> 99.0% Verified' },
      { label: 'Vial Strength', value: '5 mg Lyophilized' },
      { label: 'Endotoxin', value: '< 0.05 EU/mg' },
    ],
    variants: [
      { id: 'sem-5mg', label: '5mg Single Vial', price: 40.0, stock: 35 },
      { id: 'sem-10mg', label: '2 × 5mg Vials (10mg)', price: 72.0, stock: 21 },
      { id: 'sem-15mg', label: '3 × 5mg Vials (15mg)', price: 100.0, stock: 12 },
    ],
  },
  {
    id: 'prod-b12',
    sku: 'SP-B12-203',
    name: 'B12',
    categoryId: 'lab-peptide',
    categoryName: 'Lab Peptide',
    image: '/assets/products/b12.png',
    imageBg: 'light',
    purityNote: '10mg · Purity Exceeds 99%',
    shortDescription:
      'High-purity Cobalamin 10mg research vial verified for >99% analytical purity.',
    description:
      'Laboratory-grade B12 (10mg) formulated for cellular coenzyme and hematologic pathway research. Packaged in light-shielded crimp vials with batch COA included.',
    specs: [
      { label: 'Purity', value: '> 99.0% Analytical Grade' },
      { label: 'Quantity', value: '10 mg per Vial' },
      { label: 'Documentation', value: 'COA Included' },
    ],
    variants: [
      { id: 'b12-10mg', label: '1 × 10mg Vial', price: 50.0, stock: 29 },
      { id: 'b12-20mg', label: '2 × 10mg Vials', price: 95.0, stock: 16 },
    ],
  },
  {
    id: 'prod-bacteriostatic-water',
    sku: 'SP-BSW-301',
    name: 'Bacteriostatic Water',
    categoryId: 'bacteriostatic-water',
    categoryName: 'Bacteriostatic Water',
    image: '/assets/products/bacteriostatic_water.png',
    imageBg: 'light',
    purityNote: '10ml Sterile · 0.9% Benzyl Alcohol',
    shortDescription:
      'Sterile, non-pyrogenic laboratory diluent containing 0.9% (9 mg/ml) benzyl alcohol.',
    description:
      'Designed exclusively for laboratory reconstitution and preparation of lyophilized peptides. Triple-filtered and sealed in sterile 10ml borosilicate vials.',
    specs: [
      { label: 'Preservative', value: '0.9% Benzyl Alcohol' },
      { label: 'Volume', value: '10 ml / 30 ml Options' },
      { label: 'Sterility', value: 'USP <71> Compliant' },
    ],
    variants: [
      { id: 'bsw-10ml', label: '10ml Single Vial', price: 10.0, stock: 64 },
      { id: 'bsw-30ml', label: '30ml / 3 × 10ml Pack', price: 20.0, stock: 42 },
    ],
  },
  {
    id: 'prod-orlistat-120mg',
    sku: 'SP-ORL-401',
    name: 'Orlistat 120mg Capsules – Clinically Proven Fat Reduction Support',
    categoryId: 'metabolic-support',
    categoryName: 'Metabolic Support',
    image: '/assets/products/orlistat.png',
    imageBg: 'light',
    purityNote: '120mg Hard Capsules · 84 Count',
    shortDescription:
      '84-capsule clinical pack standardized at 120mg Orlistat for lipid-absorption research.',
    description:
      'Supplied in sealed 84-capsule blister cartons containing 120mg hard oral capsules. Batch-verified for active content uniformity and stability.',
    specs: [
      { label: 'Dosage Form', value: '120 mg Hard Capsules' },
      { label: 'Pack Size', value: '84 Capsules per Box' },
      { label: 'Assay', value: '99.5% Content Uniformity' },
    ],
    variants: [
      { id: 'orl-1box', label: '1 Box (84 Capsules)', price: 86.0, originalPrice: 110.0, stock: 24 },
      { id: 'orl-2box', label: '2 Boxes (168 Capsules)', price: 164.0, originalPrice: 220.0, stock: 10 },
    ],
  },
  {
    id: 'prod-semax',
    sku: 'SP-SMX-105',
    name: 'SEMAX',
    categoryId: 'other-peptides',
    categoryName: 'Other Peptides',
    image: '/assets/products/semax.png',
    imageBg: 'light',
    purityNote: '>98% HPLC · Research Use Only',
    shortDescription:
      'ACTH (4–10) heptapeptide analog nasal formulation (>98% HPLC purity).',
    description:
      'SEMAX is a synthetic regulatory peptide (CAS 80714-61-0, MW 813.92 g/mol) prepared in an amber glass dropper-spray bottle for neurobiological research.',
    specs: [
      { label: 'CAS Number', value: '80714-61-0' },
      { label: 'Molecular Weight', value: '813.92 g/mol' },
      { label: 'Purity (HPLC)', value: '> 98.0%' },
    ],
    variants: [
      { id: 'semax-1', label: '1 × 10ml Bottle', price: 45.0, stock: 25 },
      { id: 'semax-2', label: '2 × 10ml Twin Pack', price: 85.0, stock: 13 },
    ],
  },
  {
    id: 'prod-lipo-c',
    sku: 'SP-LPC-106',
    name: 'LIPO-C',
    categoryId: 'other-peptides',
    categoryName: 'Other Peptides',
    image: '/assets/products/lipo_c.png',
    imageBg: 'light',
    purityNote: 'GHK-CU | BPC 157 | TB 500 · HPLC Tested',
    shortDescription:
      'Tri-peptide research complex combining GHK-Cu, BPC-157, and TB-500 in a 10ml sterile vial.',
    description:
      'LIPO-C 10ml pairs three extensively studied tissue-repair peptides—GHK-Cu, BPC-157, and TB-500—in a single HPLC-tested research solution.',
    specs: [
      { label: 'Peptide Blend', value: 'GHK-Cu + BPC-157 + TB-500' },
      { label: 'Volume', value: '10 ml Sterile Vial' },
      { label: 'Verification', value: 'HPLC Tested' },
    ],
    variants: [
      { id: 'lipoc-1', label: '1 × 10ml Vial', price: 65.0, stock: 21 },
      { id: 'lipoc-2', label: '2 × 10ml Vials', price: 120.0, stock: 11 },
    ],
  },
  {
    id: 'prod-glutaone-1200mg',
    sku: 'SP-GLU-107',
    name: 'Glutaone Inj. 1200mg',
    categoryId: 'other-peptides',
    categoryName: 'Other Peptides',
    image: '/assets/products/glutaone.png',
    imageBg: 'light',
    purityNote: 'Glutathione (Reduced) · 1200mg',
    shortDescription:
      'Reduced Glutathione 1200mg lyophilized vials packaged in multi-vial laboratory boxes.',
    description:
      'Glutaone 1200mg provides pharmaceutical-purity reduced tripeptide glutathione (L-gamma-glutamyl-L-cysteinyl-glycine) for cellular redox and antioxidant assays.',
    specs: [
      { label: 'Active', value: 'Glutathione (Reduced) 1200 mg' },
      { label: 'Form', value: 'Lyophilized Sterile Vials' },
      { label: 'Purity', value: '>= 99.0% Assay' },
    ],
    variants: [
      { id: 'glu-5v', label: '5 Vials (1200mg each)', price: 75.0, stock: 18 },
      { id: 'glu-10v', label: '10 Vials Full Box', price: 140.0, stock: 9 },
    ],
  },
  {
    id: 'prod-mots-c',
    sku: 'SP-MTC-108',
    name: 'MOTS-C',
    categoryId: 'other-peptides',
    categoryName: 'Other Peptides',
    image: '/assets/products/mots_c.png',
    imageBg: 'light',
    purityNote: '10mg Concentration · MW 2174.6 g/mol',
    shortDescription:
      'Mitochondrial-derived 16-amino-acid peptide (10mg) for cellular energetics research.',
    description:
      'MOTS-C 10mg (C101H152N28O22S2, MW ~2174.6 g/mol) is synthesized to >99% HPLC purity and packaged in protective tamper-evident cartons with full molecular documentation.',
    specs: [
      { label: 'Concentration', value: '10 mg per Vial' },
      { label: 'Molecular Weight', value: '~2174.6 g/mol' },
      { label: 'Formula', value: 'C101H152N28O22S2' },
    ],
    variants: [
      { id: 'motsc-1', label: '1 × 10mg Vial', price: 55.0, stock: 23 },
      { id: 'motsc-2', label: '2 × 10mg Vials', price: 105.0, stock: 12 },
    ],
  },
];

/**
 * Verified client & research facility testimonials.
 */
export const TESTIMONIALS = [
  {
    id: 'test-1',
    name: 'Dr. Hannah Lindqvist',
    role: 'Principal Assay Chemist',
    organization: 'Cascade BioAnalytics',
    productPurchased: 'RETATRUTIDE · 5 × 10mg Kit',
    rating: 5,
    quote:
      'Previously we lost two weeks per order re-running external LC-MS checks when suppliers shipped unverified lots. Switching to sino_pepts cut our intake verification time to under 24 hours because every vial arrived with matching HPLC chromatograms.',
    verifiedDate: 'October 2026',
  },
  {
    id: 'test-2',
    name: 'Marcus Okafor',
    role: 'Procurement Lead',
    organization: 'Northstar Longevity Lab',
    productPurchased: 'Tesamorelin 10mg & Bacteriostatic Water',
    rating: 5,
    quote:
      'Temperature-buffered packaging and direct bank transfer settlement solved our recurring cold-chain delays. Across four quarterly restocks, every lyophilized cake reconstituted crystal clear with zero lot variance.',
    verifiedDate: 'November 2026',
  },
  {
    id: 'test-3',
    name: 'Elena Rostova, PhD',
    role: 'Cellular Energetics Researcher',
    organization: 'Pacific Rim Metabolic Institute',
    productPurchased: 'NAD+ 500mg & MOTS-C 10mg',
    rating: 5,
    quote:
      'Our NAD+ and MOTS-C cellular assays showed noticeable run-to-run drift with prior vendors. Since standardizing on sino_pepts batches with documented Karl Fischer moisture and purity assays, our baseline assay reproducibility improved immediately.',
    verifiedDate: 'October 2026',
  },
  {
    id: 'test-4',
    name: 'David Takahashi',
    role: 'Operations Director',
    organization: 'Beacon Peptide Research',
    productPurchased: 'SEMAGLUTIDE & LIPO-C 10ml',
    rating: 5,
    quote:
      'Having printed batch Certificates of Analysis packed directly inside the parcel alongside instant carrier tracking eliminated missing paperwork during our ISO audit.',
    verifiedDate: 'November 2026',
  },
];

