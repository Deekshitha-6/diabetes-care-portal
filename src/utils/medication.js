const medicationDb = [
  {
    name: "Metformin",
    category: "diabetic",
    dosages: ["500mg", "850mg", "1000mg"],
    frequencies: ["Once daily with dinner", "Twice daily with breakfast & dinner"],
    contraindications: ["Severe renal impairment (eGFR < 30 mL/min)", "Metabolic acidosis", "Acute heart failure"],
    sideEffects: ["Nausea", "Diarrhea", "Abdominal bloating", "Metallic taste", "Lactic acidosis (rare but severe)"],
    ageSuitability: "Suitable for adults and children aged 10 and older",
    pregnancyWarning: true,
    // Warn if pregnant
    kidneyRestrictions: "Strictly restricted if eGFR is below 30 mL/min; adjust dose if eGFR is between 30-45 mL/min.",
    allergyInfo: "Contraindicated if previously hyper-sensitive to Metformin or biguanides."
  },
  {
    name: "Glipizide",
    category: "diabetic",
    dosages: ["5mg", "10mg"],
    frequencies: ["Once daily, 30 minutes before breakfast", "Twice daily, before meals"],
    contraindications: ["Type 1 Diabetes", "Diabetic ketoacidosis", "Severe liver failure"],
    sideEffects: ["Hypoglycemia (low blood sugar)", "Weight gain", "Dizziness", "Skin rashes"],
    ageSuitability: "Mainly for adults; use closely supervised in elderly due to hypoglycemia risks",
    pregnancyWarning: true,
    kidneyRestrictions: "Exercise high caution. Accumulates in kidneys; high risk of prolonged hypoglycemia.",
    allergyInfo: "Do not use if allergic to sulfa drugs or sulfonylureas."
  },
  {
    name: "Januvia (Sitagliptin)",
    category: "diabetic",
    dosages: ["25mg", "50mg", "100mg"],
    frequencies: ["Once daily in the morning"],
    contraindications: ["History of pancreatic swelling (pancreatitis)"],
    sideEffects: ["Upper respiratory tract infection", "Stuffy nose", "Headache", "Hypoglycemia (if combined with insulin)"],
    ageSuitability: "Approved for adults (18+)",
    pregnancyWarning: false,
    kidneyRestrictions: "Reduce dosage if severe renal insufficiency (25mg if eGFR < 30, 50mg if eGFR 30-45).",
    allergyInfo: "Contraindicated if sensitive to Sitagliptin or DPP-4 inhibitors."
  },
  {
    name: "Jardiance (Empagliflozin)",
    category: "diabetic",
    dosages: ["10mg", "25mg"],
    frequencies: ["Once daily in the morning with or without food"],
    contraindications: ["Severe renal impairment (eGFR < 30)", "Dialysis"],
    sideEffects: ["Urinary tract infections", "Yeast infections", "Increased urination", "Dehydration", "Ketoacidosis"],
    ageSuitability: "Approved for adults (18+), highly beneficial for cardiovascular protection",
    pregnancyWarning: true,
    kidneyRestrictions: "Do not initiate if eGFR is below 30 mL/min. Stops working as a glucose reducer but provides slight cardiac shield.",
    allergyInfo: "Do not use if sensitive to SGLT2 inhibitors."
  },
  {
    name: "Farxiga (Dapagliflozin)",
    category: "diabetic",
    dosages: ["5mg", "10mg"],
    frequencies: ["Once daily in the morning"],
    contraindications: ["Active bladder cancer", "Severe kidney failure (eGFR < 25)", "Dialysis"],
    sideEffects: ["Dehydration", "Low blood pressure", "Genital infections", "Ketoacidosis"],
    ageSuitability: "Approved for adults (18+) with type 2 diabetes",
    pregnancyWarning: true,
    kidneyRestrictions: "Not recommended for initiation in patients with eGFR < 25 mL/min.",
    allergyInfo: "Avoid if previous hypersensitivity to SGLT2 inhibitors."
  },
  {
    name: "Amaryl (Glimepiride)",
    category: "diabetic",
    dosages: ["1mg", "2mg", "4mg"],
    frequencies: ["Once daily with breakfast or first main meal"],
    contraindications: ["Type 1 Diabetes", "Diabetic ketoacidosis", "Severe hypersensitivity"],
    sideEffects: ["Hypoglycemia", "Dizziness", "Headache", "Nausea", "Mild weight gain"],
    ageSuitability: "Sourced for adults; high caution in elderly patients",
    pregnancyWarning: true,
    kidneyRestrictions: "Use with extreme caution. Renal impairment increases risk of hypoglycemia.",
    allergyInfo: "Do not use if allergic to sulfa drugs or sulfonylureas."
  },
  {
    name: "Actos (Pioglitazone)",
    category: "diabetic",
    dosages: ["15mg", "30mg", "45mg"],
    frequencies: ["Once daily with or without food"],
    contraindications: ["Congestive heart failure (NYHA Class III or IV)", "Active bladder cancer"],
    sideEffects: ["Edema (fluid retention)", "Weight gain", "Increased bone fracture risk", "Macular edema"],
    ageSuitability: "Adults only",
    pregnancyWarning: true,
    kidneyRestrictions: "No dosage adjustments necessary for patients with kidney dysfunction.",
    allergyInfo: "Contraindicated if hypersensitive to thiazolidinediones."
  },
  {
    name: "Diamicron (Gliclazide)",
    category: "diabetic",
    dosages: ["30mg", "60mg", "80mg"],
    frequencies: ["Once daily with breakfast (for MR formulation)", "Twice daily before main meals"],
    contraindications: ["Type 1 Diabetes", "Severe renal failure", "Severe hepatic failure"],
    sideEffects: ["Hypoglycemia", "Indigestion", "Skin reactions", "Liver enzyme elevation"],
    ageSuitability: "Adults and elderly under strict supervision",
    pregnancyWarning: true,
    kidneyRestrictions: "Contraindicated in severe renal insufficiency; monitor glucose levels closely in mild-moderate dysfunction.",
    allergyInfo: "Contraindicated in patients with sulfonamide hypersensitivity."
  },
  {
    name: "Tradjenta (Linagliptin)",
    category: "diabetic",
    dosages: ["5mg"],
    frequencies: ["Once daily"],
    contraindications: ["History of severe clinical pancreatitis"],
    sideEffects: ["Hypoglycemia", "Nasopharyngitis", "Cough", "Pancreatitis"],
    ageSuitability: "Approved for adults (18+)",
    pregnancyWarning: false,
    kidneyRestrictions: "No dosage adjustment required for any degree of renal impairment (unique DPP-4 benefits).",
    allergyInfo: "Avoid if sensitive to DPP-4 inhibitors."
  },
  {
    name: "Semaglutide (Ozempic/Wegovy)",
    category: "obesity",
    dosages: ["0.25mg", "0.5mg", "1.0mg", "2.4mg"],
    frequencies: ["Once weekly subcutaneous injection", "Once daily oral (Rybelsus)"],
    contraindications: ["Medullary thyroid carcinoma family history", "Multiple Endocrine Menoplasia syndrome type 2 (MEN 2)", "Pancreatitis history"],
    sideEffects: ["Nausea", "Vomiting", "Constipation", "Decreased appetite", "Gastric slowing"],
    ageSuitability: "Approved for adults and pediatric patients aged 12 years and older",
    pregnancyWarning: true,
    kidneyRestrictions: "Generally safe, but monitor fluid levels closely to avoid dehydration-induced kidney issues.",
    allergyInfo: "Avoid if sensitive to GLP-1 receptor agonists."
  },
  {
    name: "Liraglutide (Victoza/Saxenda)",
    category: "obesity",
    dosages: ["0.6mg", "1.2mg", "1.8mg", "3.0mg"],
    frequencies: ["Once daily subcutaneous injection"],
    contraindications: ["Personal or family history of medullary thyroid cancer", "MEN 2"],
    sideEffects: ["Headache", "Indigestion", "Fatigue", "Low blood sugar", "Nausea"],
    ageSuitability: "Approved for adults and pediatric patients aged 12 years and older",
    pregnancyWarning: true,
    kidneyRestrictions: "Use caution in advanced kidney failure; no initial dose adjustment required.",
    allergyInfo: "Contraindicated in GLP-1 agonist-sensitive patients."
  },
  {
    name: "Tirzepatide (Mounjaro/Zepbound)",
    category: "obesity",
    dosages: ["2.5mg", "5mg", "7.5mg", "10mg", "15mg"],
    frequencies: ["Once weekly subcutaneous injection"],
    contraindications: ["Thyroid C-cell tumors history", "MEN 2"],
    sideEffects: ["Acid reflux", "Stomach pain", "Extreme satiety", "Vomiting"],
    ageSuitability: "Approved for adults only (18+)",
    pregnancyWarning: true,
    kidneyRestrictions: "No dose adjustments, but can cause gastrointestinal side-effects leading to acute kidney injury.",
    allergyInfo: "Avoid if sensitive to Tirzepatide or GIP/GLP-1 combinations."
  },
  {
    name: "Qsymia (Phentermine-Topiramate)",
    category: "obesity",
    dosages: ["3.75mg/23mg", "7.5mg/46mg", "11.25mg/69mg", "15mg/92mg"],
    frequencies: ["Once daily in the morning with or without food"],
    contraindications: ["Pregnancy", "Glaucoma", "Hyperthyroidism", "MAO inhibitor usage within 14 days"],
    sideEffects: ["Paresthesia (tingling)", "Dizziness", "Insomnia", "Dry mouth", "Taste alteration"],
    ageSuitability: "Adults and pediatric patients aged 12 years and older",
    pregnancyWarning: true,
    kidneyRestrictions: "Do not exceed 7.5mg/46mg daily if moderate renal impairment; avoid if severe renal impairment.",
    allergyInfo: "Avoid if allergic to sympathomimetic amines or sulfa-related drugs."
  },
  {
    name: "Contrave (Naltrexone-Bupropion)",
    category: "obesity",
    dosages: ["8mg/90mg"],
    frequencies: ["One tablet in the morning, escalating to two tablets twice daily"],
    contraindications: ["Uncontrolled hypertension", "Seizure disorders", "Bulimia or anorexia nervosa", "Chronic opioid use"],
    sideEffects: ["Nausea", "Constipation", "Headache", "Insomnia", "Dry mouth"],
    ageSuitability: "Approved for adults only (18+)",
    pregnancyWarning: true,
    kidneyRestrictions: "Moderate renal impairment: limit maximum dosage. Severe kidney failure: not recommended.",
    allergyInfo: "Contraindicated if sensitive to Naltrexone, Bupropion, or opioids."
  },
  {
    name: "Xenical / Alli (Orlistat)",
    category: "obesity",
    dosages: ["60mg", "120mg"],
    frequencies: ["Three times daily with fat-containing meals"],
    contraindications: ["Chronic malabsorption syndrome", "Cholestasis"],
    sideEffects: ["Oily stools", "Flatulence with discharge", "Fecal urgency", "Fat-soluble vitamin deficiency"],
    ageSuitability: "Approved for adults (18+) and pediatric patients aged 12 and older (Xenical only)",
    pregnancyWarning: true,
    kidneyRestrictions: "No dosage adjustments necessary, but monitor urinary oxalate as it can cause oxalate nephropathy.",
    allergyInfo: "Do not use if sensitive to lipase inhibitors."
  }
];
function searchMedicines(query, category) {
  const norm = query.toLowerCase().trim();
  if (!norm) return [];
  return medicationDb.filter((med) => {
    const matchesCategory = category ? med.category === category : true;
    const matchesName = med.name.toLowerCase().includes(norm);
    return matchesCategory && matchesName;
  });
}
export {
  medicationDb,
  searchMedicines
};
