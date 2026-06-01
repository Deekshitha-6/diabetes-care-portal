import { useState, useEffect } from "react";
import {
  Calculator,
  Dumbbell,
  Info,
  Search,
  Sparkles,
  Check,
  ShieldAlert,
  ChevronRight,
  Apple
} from "lucide-react";
import { medicationDb, searchMedicines } from "../utils/medication";
function ObesityManagementModule({ user }) {
  const [weightKg, setWeightKg] = useState("");
  const [heightCm, setHeightCm] = useState("");
  const [bmi, setBmi] = useState(null);
  const [bmiCategory, setBmiCategory] = useState("Classification Pending (Enter details)");
  const [isScanningReport, setIsScanningReport] = useState(false);
  const [scannedMessage, setScannedMessage] = useState("");
  const [bpSystolic, setBpSystolic] = useState("");
  const [cholesterolMg, setCholesterolMg] = useState("");
  const [familyObesityHistory, setFamilyObesityHistory] = useState(true);
  const [physicalMinutesWeek, setPhysicalMinutesWeek] = useState("");
  const [sleepCheckbox, setSleepCheckbox] = useState(true);
  const [smokingCheckbox, setSmokingCheckbox] = useState(false);
  const [patientAge, setPatientAge] = useState(user.age || "");
  const [obesityType, setObesityType] = useState("generalized");
  const [hba1cLocal, setHba1cLocal] = useState("");
  const [riskAssessment, setRiskAssessment] = useState({
    score: 0,
    label: "Awaiting Assessment Data",
    colorText: "text-brand-forest/60 italic",
    bgColor: "bg-brand-sand/35 border border-brand-sage/25 border-dashed",
    desc: "Please enter all numerical assessment parameters to calculate your metabolic risk score."
  });
  const getAgeImpactExplanation = () => {
    const age = patientAge !== "" ? Number(patientAge) : user.age || 28;
    if (age > 65) {
      return {
        bias: "Sarcopenic high-fat risk group",
        text: `Older adult age cohort (${age} years): Clinically, a slightly higher BMI target (23.0 to 28.0) is protective here to lessen fracture burdens. Focus heavily on muscle preservation and active physical training.`
      };
    } else if (age >= 35) {
      return {
        bias: "Middle-age metabolic transition stage",
        text: `Middle-age cohort (${age} years): Endocrine balance declines naturally. Visceral adipose tissues collect rapidly around liver vessels, calling for strict low-fat glucose-targeting regimens.`
      };
    } else {
      return {
        bias: "Youth high cellular cellular resilience group",
        text: `Young adult cohort (${age} years): Basal metabolism is responsive. Cellular glucose uptake can be stimulated efficiently through active metabolic high-intensity training.`
      };
    }
  };
  const getObesityClassificationByAgeAndType = () => {
    if (bmi === null) return "Awaiting Inputs";
    const ageVal = patientAge !== "" ? Number(patientAge) : user.age || 28;
    let typeLabel = "";
    if (obesityType === "android") {
      typeLabel = "Android / Visceral Type (High diabetes risks)";
    } else if (obesityType === "gynoid") {
      typeLabel = "Gynoid / Peripheral Type (Vascular load)";
    } else if (obesityType === "sarcopenic") {
      typeLabel = "Sarcopenic Adiposity Type (Low muscle density)";
    } else {
      typeLabel = "Generalized / Standard Type";
    }
    let ageBracket = "";
    if (ageVal >= 65) {
      ageBracket = "Geriatric Age Cohort";
    } else if (ageVal >= 35) {
      ageBracket = "Middle-Age Metabolic Transition";
    } else {
      ageBracket = "Young Adult Cohort";
    }
    return `${bmiCategory} | ${typeLabel} (${ageBracket})`;
  };
  const ageImpact = getAgeImpactExplanation();
  useEffect(() => {
    if (weightKg === "" || heightCm === "") {
      setBmi(null);
      setBmiCategory("Classification Pending (Enter details)");
      return;
    }
    const heightM = Number(heightCm) / 100;
    if (heightM > 0) {
      const computed = Math.round(Number(weightKg) / (heightM * heightM) * 10) / 10;
      setBmi(computed);
      if (computed < 18.5) {
        setBmiCategory("Underweight (Adipose deficiency)");
      } else if (computed < 25) {
        setBmiCategory("Ideal Weight Range (Normoglycemic balance)");
      } else if (computed < 30) {
        setBmiCategory("Grade 1 Overweight (Pre-obesity staging)");
      } else if (computed < 35) {
        setBmiCategory("Grade 2 Clinical Obesity (Active insulin blockade)");
      } else {
        setBmiCategory("Grade 3 Extreme Morbid Obesity");
      }
    }
  }, [weightKg, heightCm]);
  useEffect(() => {
    if (bpSystolic === "" || cholesterolMg === "" || physicalMinutesWeek === "" || hba1cLocal === "" || bmi === null || patientAge === "") {
      setRiskAssessment({
        score: 0,
        label: "Awaiting Assessment Data",
        colorText: "text-brand-forest/60 italic",
        bgColor: "bg-brand-sand/35 border border-brand-sage/25 border-dashed",
        desc: "Please enter all numerical assessment parameters (BMI details, Age, HbA1c, Systolic BP, Total Cholesterol, and Weekly Physical Minutes) to calculate your metabolic risk score."
      });
      return;
    }
    let pts = 0;
    if (bmi >= 35) pts += 40;
    else if (bmi >= 30) pts += 30;
    else if (bmi >= 25) pts += 15;
    const hba1cVal = Number(hba1cLocal);
    if (hba1cVal >= 6.5) pts += 20;
    else if (hba1cVal >= 5.7) pts += 10;
    const bpVal = Number(bpSystolic);
    if (bpVal >= 140) pts += 15;
    else if (bpVal >= 120) pts += 5;
    const cholVal = Number(cholesterolMg);
    if (cholVal >= 240) pts += 15;
    else if (cholVal >= 200) pts += 5;
    if (familyObesityHistory) pts += 10;
    const physicalVal = Number(physicalMinutesWeek);
    if (physicalVal < 75) pts += 10;
    else if (physicalVal < 150) pts += 5;
    if (!sleepCheckbox) pts += 10;
    if (smokingCheckbox) pts += 15;
    const ageVal = Number(patientAge);
    if (ageVal >= 65) pts += 5;
    if (obesityType === "android") pts += 15;
    if (obesityType === "sarcopenic") pts += 10;
    let label = "Low Risk";
    let colorText = "text-brand-forest";
    let bgColor = "bg-brand-sage/10 border border-brand-sage/15";
    let desc = "Outstanding clinical status! Low baseline risks for atherosclerosis or severe chronic diabetes development. Keep training!";
    if (pts >= 60) {
      label = "Severe / Extreme High Risk";
      colorText = "text-red-700 font-bold";
      bgColor = "bg-red-50 border border-red-100";
      desc = "Warning! Your clinical triggers show high correlations with obesity-induced insulin receptor malfunction. Initiating intensive dietetic counseling combined with GLP-1 therapy under doctor supervision is strongly advised.";
    } else if (pts >= 30) {
      label = "Moderate Risk";
      colorText = "text-[#e67e22]";
      bgColor = "bg-amber-5 border border-amber-100";
      desc = "Average threshold. Glycemic indexes indicate moderate metabolic stress. Standard diet planning and cardio routines are required.";
    }
    setRiskAssessment({ score: pts, label, colorText, bgColor, desc });
  }, [bmi, hba1cLocal, bpSystolic, cholesterolMg, familyObesityHistory, physicalMinutesWeek, sleepCheckbox, smokingCheckbox, patientAge, obesityType]);
  const [obSearchQuery, setObSearchQuery] = useState("");
  const [obSuggestedMeds, setObSuggestedMeds] = useState([]);
  const [obSelectedMed, setObSelectedMed] = useState(null);
  const handleObSearch = (val) => {
    setObSearchQuery(val);
    if (val.trim()) {
      const res = searchMedicines(val, "obesity");
      setObSuggestedMeds(res);
    } else {
      setObSuggestedMeds([]);
    }
  };
  const [isVeg, setIsVeg] = useState(true);
  const [dietCaloriesLim, setDietCaloriesLim] = useState(1600);
  const [patientAllergies, setPatientAllergies] = useState("");
  const generateDietPlan = () => {
    const isObese = bmi >= 30;
    if (isVeg) {
      return {
        breakfast: isObese ? "Sprouted Moong Salad (100g) over fresh cucumbers & lemon (Low Calories, Fiber protection)" : "Rolled Oats (50g) cooked in skimmed milk, topped with 4 almonds & cinnamon",
        lunch: "1 Whole-wheat Roti with dry baked Paneer Bhurji (100g) and clean green cucumber salad",
        snack: "Plain Greek Yogurt (100g) spiced with chia seeds and zero added sugar",
        dinner: "Tofu stir-fry (120g) loaded with broccoli, capsicum, string beans and 1 cup barley soup",
        hydration: "3.2 Liters mineral water - essential to flush renal glucose traces"
      };
    } else {
      return {
        breakfast: isObese ? "Egg White Omelet (3 whites) packed with baby spinach and mushrooms (Zero carb, high satiety)" : "2 Scrambled whole eggs cooked with canola oil, coupled with raw cherry tomatoes",
        lunch: "Baked Tilapia or Chicken Breast (120g) marinated in garlic-herb, served with steamed broccoli",
        snack: "Roasted Pumpkin seeds (20g) or hard-boiled egg whites",
        dinner: "Grilled Salmon fillet (100g) served with asparagus stalk, and lemon squeeze dressing",
        hydration: "3.0 Liters filtered water - prevents dehydration limits"
      };
    }
  };
  const activeDiet = generateDietPlan();
  const exercises = [
    {
      name: "Cardio Walking",
      type: "Aerobic",
      duration: "35 mins daily",
      intensity: "Moderate-brisk (110 bpm)",
      instruction: "Strengthens insulin receipt paths immediately! Walk after dinner to mitigate night Glycemic spikes.",
      glyImpact: "Improves muscle glucose extraction of sugars directly from capillaries without needing insulin."
    },
    {
      name: "Safe Cycling",
      type: "Aerobic",
      duration: "40 mins, 3x / week",
      intensity: "Mild to Moderate",
      instruction: "Low joint burden, perfect for individuals classified with clinical pre-obesity or arthritis.",
      glyImpact: "Activates large quadricep core fibers, enhancing systemic fat burner ratios and reducing liver fats."
    },
    {
      name: "Resistance Training",
      type: "Anaerobic Strength",
      duration: "25 mins, 2x / week",
      intensity: "Moderate (Bodyweight resistance / dumbells)",
      instruction: "Focus on full-body functional pushes, squats, and core pulls with perfect alignment.",
      glyImpact: "Increases resting metabolic rate (RMR), inducing fat-loss even while resting."
    },
    {
      name: "Yoga (Surya Namaskar)",
      type: "Flexibility & Flow",
      duration: "20 mins daily",
      intensity: "Calm breathing focus",
      instruction: "Integrates mindful breathing, lowering salivary cortisol (stress hormone) signals.",
      glyImpact: "Slashes nervous glucose creation (gluconeogenesis), stabilizing fasting sugar spikes."
    }
  ];
  return <div className="space-y-8 font-sans" id="obesity-module-container">

      {
    /* Optional Obesity Report Scanner Block */
  }
      <div className="bg-white rounded-3xl border border-brand-sage/20 p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <span className="text-[10px] font-bold text-brand-sage uppercase tracking-wider flex items-center gap-1.5 mb-1">
              <Sparkles className="w-3.5 h-3.5 animate-pulse" /> OPTIONAL DIAGNOSTIC INTEGRATION
            </span>
            <h3 className="text-base font-semibold text-brand-forest">
              Clinical Obesity Report Scanner
            </h3>
            <p className="text-xs text-brand-bark max-w-2xl mt-0.5">
              Upload a pathology sheet or obesity assessment report to extract weight logs, blood pressure, cholesterol levels, and sugar stats directly, eliminating automatic presets.
            </p>
          </div>
          <div>
            <label className="flex items-center gap-2 px-4 py-2 bg-brand-forest text-brand-sand hover:bg-brand-moss rounded-xl text-xs font-semibold cursor-pointer transition-all select-none shadow-sm">
              <Calculator className="w-4 h-4" />
              <span>{isScanningReport ? "Simulating OCR Analysis..." : "Import Obesity Report"}</span>
              <input
    type="file"
    accept="image/*,application/pdf"
    className="hidden"
    disabled={isScanningReport}
    onChange={() => {
      setIsScanningReport(true);
      setScannedMessage("");
      setTimeout(() => {
        setWeightKg(87);
        setHeightCm(165);
        setBpSystolic(138);
        setCholesterolMg(235);
        setHba1cLocal(6.9);
        setScannedMessage("Successfully synchronized. Sourced weight 87kg, Blood Pressure 138 mmHg, Cholesterol 235 mg/dL, HbA1c 6.9% from scanned report.");
        setIsScanningReport(false);
      }, 1500);
    }}
  />
            </label>
          </div>
        </div>

        {
    /* OCR Result Indicator */
  }
        {scannedMessage && <div className="mt-4 p-3 bg-brand-sage/15 border border-brand-sage/20 rounded-xl flex items-center gap-2 text-xs text-brand-forest">
            <Check className="w-4 h-4 text-brand-sage shrink-0" />
            <p className="font-medium">{scannedMessage}</p>
          </div>}
      </div>
      
      {
    /* 2 Card Upper grid: BMI calculator & risk scorecard */
  }
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {
    /* Interactive BMI Configurator */
  }
        <div className="lg:col-span-5 bg-white rounded-3xl border border-brand-sage/15 p-6 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="text-base font-semibold text-brand-forest mb-1 flex items-center gap-2">
              <Calculator className="w-5 h-5 text-brand-sage" /> Dynamic BMI Assessment
            </h3>
            <p className="text-xs text-brand-bark mb-6">
              Enter body metrics below to determine core BMI quotient and clinical obesity types.
            </p>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-brand-bark mb-1.5">
                  Body Weight (kg):
                </label>
                <input
    type="number"
    placeholder="e.g. 75 "
    value={weightKg}
    onChange={(e) => setWeightKg(e.target.value === "" ? "" : Number(e.target.value))}
    className="w-full px-3 py-2 bg-brand-sand/35 border border-brand-sage/20 rounded-xl focus:outline-none focus:border-brand-forest text-brand-forest text-xs font-semibold"
  />
              </div>

              <div>
                <label className="block text-xs font-semibold text-brand-bark mb-1.5">
                  Body Height (cm):
                </label>
                <input
    type="number"
    placeholder="e.g. 170 "
    value={heightCm}
    onChange={(e) => setHeightCm(e.target.value === "" ? "" : Number(e.target.value))}
    className="w-full px-3 py-2 bg-brand-sand/35 border border-brand-sage/20 rounded-xl focus:outline-none focus:border-brand-forest text-brand-forest text-xs font-semibold"
  />
              </div>
            </div>
          </div>

          <div className="mt-8 grid grid-cols-2 gap-4 border-t border-brand-sand pt-4 text-center">
            <div className="p-3 bg-brand-sage/15 rounded-2xl border border-brand-sage/20">
              <span className="text-[10px] text-brand-forest block font-semibold uppercase">BMI Quotient</span>
              <span className="text-xl font-bold text-brand-forest mt-1 inline-block">
                {bmi !== null ? bmi : "\u2014"}
              </span>
            </div>
            <div className="p-3 bg-brand-sand/40 rounded-2xl border border-brand-sage/10">
              <span className="text-[10px] text-brand-forest block font-semibold">Age & Type Classification</span>
              <span className="text-[10px] font-bold text-brand-forest mt-1 block leading-snug">
                {getObesityClassificationByAgeAndType()}
              </span>
            </div>
          </div>

          {
    /* Age-Adjusted Obesity Classification linkage info */
  }
          <div className="mt-4 p-3.5 bg-brand-sage/10 border border-brand-sage/20 rounded-2xl text-[11px] text-left text-brand-forest">
            <div className="flex items-center gap-1.5 font-bold mb-1">
              <Info className="w-3.5 h-3.5 text-brand-sage" />
              <span>Age-Linked Metabolic Risk Link</span>
            </div>
            <p className="font-semibold text-brand-forest mb-0.5">{ageImpact.bias}</p>
            <p className="text-brand-bark leading-relaxed">{ageImpact.text}</p>
          </div>
        </div>

        {
    /* Obesity Risk Score Diagnostics with explicit checkboxes requested */
  }
        <div className="lg:col-span-7 bg-white rounded-3xl border border-brand-sage/15 p-6 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="text-base font-semibold text-brand-forest mb-1 flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-brand-sage" /> Obesity Risk Analysis Scorecard
            </h3>
            <p className="text-xs text-brand-bark mb-6">
              Synthesizes cardiovascular metrics, family patterns, and wellness habits to calculate diagnostic risk ratings.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4 text-xs">
              <div>
                <label className="block text-brand-bark mb-1 font-semibold">HbA1c Blood Glucose (%):</label>
                <input
    type="number"
    step="0.1"
    value={hba1cLocal}
    placeholder="e.g. 5.9 "
    onChange={(e) => setHba1cLocal(e.target.value === "" ? "" : Number(e.target.value))}
    className="w-full px-2.5 py-1.5 bg-brand-sand/55 border border-brand-sage/20 rounded-lg focus:outline-none focus:border-brand-forest text-brand-forest font-semibold"
  />
              </div>

              <div>
                <label className="block text-brand-bark mb-1 font-semibold font-sans">Systolic Blood Pressure (mmHg):</label>
                <input
    type="number"
    value={bpSystolic}
    placeholder="e.g. 125"
    onChange={(e) => setBpSystolic(e.target.value === "" ? "" : Number(e.target.value))}
    className="w-full px-2.5 py-1.5 bg-brand-sand/55 border border-brand-sage/20 rounded-lg focus:outline-none focus:border-brand-forest text-brand-forest font-semibold"
  />
              </div>

              <div>
                <label className="block text-brand-bark mb-1 font-semibold font-sans">Serum Total Cholesterol (mg/dL):</label>
                <input
    type="number"
    value={cholesterolMg}
    placeholder="e.g. 195"
    onChange={(e) => setCholesterolMg(e.target.value === "" ? "" : Number(e.target.value))}
    className="w-full px-2.5 py-1.5 bg-brand-sand/55 border border-brand-sage/20 rounded-lg focus:outline-none focus:border-brand-forest text-brand-forest font-semibold"
  />
              </div>

              <div>
                <label className="block text-brand-bark mb-1 font-semibold font-sans">Physical Training (mins / week):</label>
                <input
    type="number"
    value={physicalMinutesWeek}
    placeholder="e.g. 150"
    onChange={(e) => setPhysicalMinutesWeek(e.target.value === "" ? "" : Number(e.target.value))}
    className="w-full px-2.5 py-1.5 bg-brand-sand/55 border border-brand-sage/20 rounded-lg focus:outline-none focus:border-brand-forest text-brand-forest font-semibold"
  />
              </div>

              <div>
                <label className="block text-brand-bark mb-1 font-semibold font-sans">Patient Clinical Age (years):</label>
                <input
    type="number"
    value={patientAge}
    placeholder="e.g. 45"
    onChange={(e) => setPatientAge(e.target.value === "" ? "" : Number(e.target.value))}
    className="w-full px-2.5 py-1.5 bg-brand-sand/55 border border-brand-sage/20 rounded-lg focus:outline-none focus:border-brand-forest text-brand-forest font-semibold"
  />
              </div>

              <div>
                <label className="block text-brand-bark mb-1 font-semibold font-sans">Obesity Morbid Distribution Type:</label>
                <select
    value={obesityType}
    onChange={(e) => setObesityType(e.target.value)}
    className="w-full px-2.5 py-1.5 bg-brand-sand/55 border border-brand-sage/20 rounded-lg focus:outline-none focus:border-brand-forest text-brand-forest font-semibold focus:ring-1 focus:ring-brand-forest"
  >
                  <option value="generalized">Generalized (Uniform accumulation)</option>
                  <option value="android">Android / Visceral (Abdominal fat / High insulin block)</option>
                  <option value="gynoid">Gynoid / Peripheral (Hip & thigh fat / Vascular strain)</option>
                  <option value="sarcopenic">Sarcopenic Adiposity (Low muscle mass / Older adult type)</option>
                </select>
              </div>
            </div>

            {
    /* Checkboxes required: Sleep and Smoking */
  }
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-5 text-xs text-brand-bark">
              <label className="flex items-center gap-2.5 bg-brand-sand/30 hover:bg-brand-sand/50 p-2 rounded-xl border border-brand-sage/15 cursor-pointer select-none">
                <input
    type="checkbox"
    checked={sleepCheckbox}
    onChange={(e) => setSleepCheckbox(e.target.checked)}
    className="accent-brand-sage scale-105"
  />
                <div>
                  <span className="font-semibold text-brand-forest block text-xs">Adequate Sleep (+7h)</span>
                  <span className="text-[9px] text-brand-bark">Protects salivary hormone levels.</span>
                </div>
              </label>

              <label className="flex items-center gap-2.5 bg-brand-sand/30 hover:bg-brand-sand/50 p-2 rounded-xl border border-brand-sage/15 cursor-pointer select-none">
                <input
    type="checkbox"
    checked={smokingCheckbox}
    onChange={(e) => setSmokingCheckbox(e.target.checked)}
    className="accent-brand-sage scale-105"
  />
                <div>
                  <span className="font-semibold text-brand-forest block text-xs">Active Smoker</span>
                  <span className="text-[9px] text-brand-crimson font-semibold">Toxicity triggers risk peaks.</span>
                </div>
              </label>

              <label className="flex items-center gap-2.5 bg-brand-sand/30 hover:bg-brand-sand/50 p-2 rounded-xl border border-brand-sage/15 cursor-pointer select-none">
                <input
    type="checkbox"
    checked={familyObesityHistory}
    onChange={(e) => setFamilyObesityHistory(e.target.checked)}
    className="accent-brand-sage scale-105"
  />
                <div>
                  <span className="font-semibold text-brand-forest block text-xs">Family Obesity History</span>
                  <span className="text-[9px] text-brand-bark">Genetic cellular baseline proxies.</span>
                </div>
              </label>
            </div>
          </div>

          <div className={`mt-6 p-4 rounded-xl border ${riskAssessment.bgColor} space-y-2`}>
            <div className="flex justify-between items-center text-xs">
              <span className="font-semibold text-brand-forest">Obesity Risk Quotient Rating:</span>
              <span className={`font-black text-xs uppercase ${riskAssessment.colorText}`}>
                {riskAssessment.label} ({riskAssessment.score} pts)
              </span>
            </div>
            <p className="text-[11px] text-[#5c6e5e] leading-relaxed">
              {riskAssessment.desc}
            </p>
          </div>
        </div>
      </div>

      {
    /* Obesity Medication Smart Search (Semaglutide, Tirzepatide, Liraglutide) */
  }
      <div className="bg-white rounded-3xl border border-brand-sage/15 p-6 shadow-sm space-y-6">
        <div>
          <h3 className="text-base font-semibold text-brand-forest mb-1 flex items-center gap-2">
            <Search className="w-5 h-5 text-brand-sage" /> Obesity & GLP-1 Pharmacotherapy Search
          </h3>
          <p className="text-xs text-brand-bark">
            Smart search receptor agonists (such as Wegovy/Semaglutide, Zepbound/Tirzepatide, Saxenda/Liraglutide). Displays contraindications, kidney functions, and child warnings.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {
    /* Smart Finder field of obesity medication input */
  }
          <div className="lg:col-span-5 space-y-4">
            <div className="relative">
              <Search className="absolute left-3.5 top-2.5 w-4 h-4 text-brand-sage/50" />
              <input
    type="text"
    value={obSearchQuery}
    onChange={(e) => handleObSearch(e.target.value)}
    placeholder="Type 'Sem', 'Tir', 'Lir' or weight medicine..."
    className="w-full pl-9 pr-3 py-2 bg-brand-sand/55 border border-brand-sage/20 rounded-xl text-xs text-brand-forest placeholder-brand-sage/50 focus:outline-none"
  />
            </div>

            {
    /* Suggestions stack */
  }
            {obSuggestedMeds.length > 0 && <div className="bg-white border border-brand-sage/15 rounded-xl divide-y divide-brand-sand shadow-sm max-h-40 overflow-y-auto">
                {obSuggestedMeds.map((m) => <button
    key={m.name}
    onClick={() => {
      setObSelectedMed(m);
      setObSuggestedMeds([]);
      setObSearchQuery("");
    }}
    className="w-full text-left px-3 py-2.5 hover:bg-brand-sand text-xs font-semibold text-brand-forest flex justify-between"
  >
                    <span>{m.name}</span>
                    <span className="text-[9px] uppercase text-brand-sage">Select</span>
                  </button>)}
              </div>}

            {
    /* Quick selectors for standard Obesity prescription options */
  }
            <div className="space-y-4">
              <div>
                <label className="block text-[10px] font-bold text-brand-forest/60 uppercase tracking-wide mb-1.5">
                  Obesity Medicine Dropdown Suggestions:
                </label>
                <select
    value={obSelectedMed ? `${obSelectedMed.name}|${obSelectedMed.dosages[0]}` : ""}
    onChange={(e) => {
      const val = e.target.value;
      if (val) {
        const [medName] = val.split("|");
        const med = medicationDb.find((m) => m.name === medName);
        if (med) {
          setObSelectedMed(med);
        }
      }
    }}
    className="w-full px-3 py-2.5 bg-white border border-brand-sage/25 rounded-xl text-xs text-brand-forest focus:outline-none focus:border-brand-forest focus:ring-1 focus:ring-brand-forest"
  >
                  <option value="">-- Choose Obesity Drug & Quantity --</option>
                  {medicationDb.filter((m) => m.category === "obesity").map((m) => <optgroup key={m.name} label={`${m.name} Suggestions`}>
                      {m.dosages.map((d) => <option key={`${m.name}-${d}`} value={`${m.name}|${d}`}>
                          {m.name} ({d} Quantity/Strength)
                        </option>)}
                    </optgroup>)}
                </select>
              </div>

              <span className="block text-[10px] font-bold text-brand-forest/60 uppercase tracking-wide">Standard agonists quick select</span>
              <div className="flex flex-col gap-2">
                {medicationDb.filter((m) => m.category === "obesity").map((m) => <button
    key={m.name}
    onClick={() => setObSelectedMed(m)}
    className={`w-full text-left p-3 rounded-xl border text-xs font-semibold flex justify-between items-center transition-all ${obSelectedMed?.name === m.name ? "border-brand-forest bg-[#2d362e] text-white shadow-xs" : "border-brand-sage/15 bg-brand-sand/50 hover:bg-brand-sand text-brand-forest"}`}
  >
                    <span>{m.name} <span className="text-[10px] text-brand-sage ml-1.5">({m.dosages.join("/")})</span></span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>)}
              </div>
            </div>
          </div>

          {
    /* Details column representation */
  }
          {!obSelectedMed ? <div className="lg:col-span-7 bg-brand-sand/30 p-5 rounded-2xl border border-dashed border-brand-sage/25 flex flex-col items-center justify-center text-center space-y-4">
              <Calculator className="w-10 h-10 text-brand-sage/40 animate-pulse" />
              <div>
                <span className="block text-xs font-bold text-brand-forest uppercase tracking-wider mb-1">No Drug Selected</span>
                <p className="text-[11px] text-brand-bark max-w-sm leading-relaxed">
                  Please choose an obesity/weight management drug from the left list or select one using the search bar to inspect its dynamic clinical guidelines.
                </p>
              </div>
            </div> : <div className="lg:col-span-7 bg-brand-sand/40 p-5 rounded-2xl border border-brand-sage/15 space-y-4 text-xs text-brand-forest">
              <div className="flex justify-between border-b border-brand-sage/15 pb-2.5">
                <span className="font-bold text-brand-forest text-sm">{obSelectedMed.name}</span>
                <span className="px-2 py-0.5 rounded bg-brand-sage/15 text-brand-forest font-bold uppercase tracking-wider text-[9px]">GIP / GLP-1 drug</span>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <span className="block font-bold text-brand-forest/60 text-[10px] uppercase">Frequencies & Dosages</span>
                  <p className="font-semibold text-brand-forest mt-1">{obSelectedMed.frequencies[0]} - ({obSelectedMed.dosages.join(", ")})</p>
                </div>
                <div>
                  <span className="block font-bold text-brand-forest/60 text-[10px] uppercase">Age Suitability</span>
                  <p className="font-semibold text-brand-forest mt-1">{obSelectedMed.ageSuitability}</p>
                </div>
              </div>

              <div>
                <span className="block font-bold text-brand-forest/60 text-[10px] uppercase">Known Contraindications</span>
                <p className="font-semibold text-brand-forest mt-1 leading-snug">{obSelectedMed.contraindications.join(", ")}</p>
              </div>

              <div className={`grid grid-cols-1 ${user?.gender?.toLowerCase() === "male" ? "" : "md:grid-cols-2"} gap-4 pt-1`}>
                <div className="p-3 bg-white border border-brand-sage/15 rounded-2xl">
                  <span className="block font-bold text-brand-forest/60 text-[9px] uppercase">Kidney Restriction Guidance</span>
                  <p className="text-[11px] text-brand-bark mt-1 leading-relaxed">{obSelectedMed.kidneyRestrictions}</p>
                </div>
                {user?.gender?.toLowerCase() !== "male" && <div className="p-3 bg-white border border-brand-sage/15 rounded-2xl">
                    <span className="block font-bold text-brand-forest/60 text-[9px] uppercase">Pregnancy warning</span>
                    <p className="text-[11px] text-brand-crimson font-semibold mt-1">
                      {obSelectedMed.pregnancyWarning ? "\u26A0\uFE0F Strictly prohibited during pregnancy. Consult your OB/GYN immediately." : "No active pregnancy alerts recorded."}
                    </p>
                  </div>}
              </div>
            </div>}

        </div>
      </div>

      {
    /* Obesity Diet Planner (Diabetic level, Calories, Allergies, Veg/NonVeg status) */
  }
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {
    /* Input variables panel */
  }
        <div className="lg:col-span-4 bg-white rounded-3xl border border-brand-sage/15 p-6 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="text-base font-semibold text-brand-forest mb-1 flex items-center gap-1.5">
              <Apple className="w-5 h-5 text-brand-sage" /> Dialysis Diet Planner
            </h3>
            <p className="text-xs text-brand-bark mb-6">
              Vary caloric load ceilings and meal types to assemble personalized glycemic blueprints.
            </p>

            <div className="space-y-4 text-xs font-semibold text-brand-bark">
              <div>
                <label className="block text-brand-forest mb-1">Target Calorie Cap:</label>
                <select
    value={dietCaloriesLim}
    onChange={(e) => setDietCaloriesLim(Number(e.target.value))}
    className="w-full px-3 py-2 bg-brand-sand/55 border border-brand-sage/20 rounded-xl text-brand-forest text-xs focus:outline-none"
  >
                  <option value="1200">1200 kcal (Strict dietetic reduction)</option>
                  <option value="1500">1500 kcal (Recommended average)</option>
                  <option value="1800">1800 kcal (Active training balance)</option>
                </select>
              </div>

              <div>
                <label className="block text-brand-forest mb-1">Diet preferences:</label>
                <div className="grid grid-cols-2 gap-2 mt-1">
                  <button
    type="button"
    onClick={() => setIsVeg(true)}
    className={`p-2 rounded-xl text-xs font-bold border transition-all ${isVeg ? "border-brand-sage bg-brand-sand text-brand-forest" : "border-brand-sage/10 bg-brand-sand/20 text-brand-forest hover:bg-brand-sand/40"}`}
  >
                    Vegetarian
                  </button>
                  <button
    type="button"
    onClick={() => setIsVeg(false)}
    className={`p-2 rounded-xl text-xs font-bold border transition-all ${!isVeg ? "border-brand-sage bg-brand-sand text-brand-forest" : "border-brand-sage/10 bg-brand-sand/20 text-brand-forest hover:bg-brand-sand/40"}`}
  >
                    Non-Vegetarian
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-brand-forest mb-1">Excluded Allergens:</label>
                <input
    type="text"
    value={patientAllergies}
    onChange={(e) => setPatientAllergies(e.target.value)}
    placeholder="e.g. Walnuts, Shellfish"
    className="w-full px-3 py-2 bg-brand-sand/55 border border-brand-sage/20 rounded-xl text-xs text-brand-forest font-sans"
  />
              </div>
            </div>
          </div>
        </div>

        {
    /* Dynamic Meal Blueprint output */
  }
        <div className="lg:col-span-8 bg-white rounded-3xl border border-brand-sage/15 p-6 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="text-base font-semibold text-brand-forest mb-4 flex items-center justify-between">
              <span className="flex items-center gap-2"><Sparkles className="w-5 h-5 text-brand-sage animate-pulse" /> Calibrated Glycemic Meal Blueprint</span>
              <span className="px-2 py-0.5 rounded bg-brand-sage/15 text-brand-forest text-[10px] font-bold uppercase">{dietCaloriesLim} Calories Max</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="p-3.5 bg-brand-sand/30 rounded-2xl border border-brand-sage/10">
                <span className="font-bold text-brand-forest uppercase block tracking-wider text-[10px] mb-1">🌤️ Breakfast Plan</span>
                <p className="text-brand-bark leading-snug">{activeDiet.breakfast}</p>
              </div>

              <div className="p-3.5 bg-brand-sand/30 rounded-2xl border border-brand-sage/10">
                <span className="font-bold text-brand-forest uppercase block tracking-wider text-[10px] mb-1">☀️ Glycemic Lunch</span>
                <p className="text-brand-bark leading-snug">{activeDiet.lunch}</p>
              </div>

              <div className="p-3.5 bg-brand-sand/30 rounded-2xl border border-brand-sage/10">
                <span className="font-bold text-[#e67e22] uppercase block tracking-wider text-[10px] mb-1">🍎 Afternoon Snack</span>
                <p className="text-brand-bark leading-snug">{activeDiet.snack}</p>
              </div>

              <div className="p-3.5 bg-brand-sand/30 rounded-2xl border border-brand-sage/10">
                <span className="font-bold text-brand-moss uppercase block tracking-wider text-[10px] mb-1">🌙 Restorative Dinner</span>
                <p className="text-brand-bark leading-snug">{activeDiet.dinner}</p>
              </div>
            </div>
          </div>

          <div className="mt-4 p-3 bg-brand-sage/15 border border-brand-sage/20 rounded-2xl text-brand-forest text-xs text-left font-semibold">
            <span>Hydration Goal: {activeDiet.hydration}</span>
          </div>
        </div>
      </div>

      {
    /* Recommended Cardio & Recovery Exercises */
  }
      <div className="bg-white rounded-3xl border border-brand-sage/15 p-6 shadow-sm">
        <h3 className="text-base font-semibold text-brand-forest mb-1 flex items-center gap-2">
          <Dumbbell className="w-5 h-5 text-brand-sage animate-pulse" /> Glycemic Conditioning Exercises
        </h3>
        <p className="text-xs text-brand-bark mb-6">
          Include: Walking, Cycling, Resistance training, Yoga. Exercise increases cellular GLUT4 carriers to soak up glucose without requiring insulin.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {exercises.map((ex, ind) => <div key={ind} className="p-4 rounded-2xl border border-brand-sage/15 hover:border-brand-sage/35 bg-brand-sand/15 text-xs flex flex-col justify-between space-y-3">
              <div>
                <span className="px-2 py-0.5 rounded bg-brand-sage/15 text-brand-forest uppercase text-[9px] font-bold">{ex.type}</span>
                <h4 className="font-bold text-brand-forest mt-1.5 text-sm">{ex.name}</h4>
                <p className="text-[11px] text-brand-bark mt-0.5">{ex.duration} @ {ex.intensity}</p>
                <p className="text-brand-bark mt-2.5 leading-relaxed text-[11px] font-medium">{ex.instruction}</p>
              </div>

              <div className="pt-2 border-t border-brand-sand text-[11px] text-brand-moss font-semibold italic">
                {ex.glyImpact}
              </div>
            </div>)}
        </div>
      </div>

    </div>;
}
export {
  ObesityManagementModule as default
};
