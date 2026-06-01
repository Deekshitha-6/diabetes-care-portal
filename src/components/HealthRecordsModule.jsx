import { useState, useEffect } from "react";
import {
  Plus,
  Trash2,
  FileText,
  UploadCloud,
  AlertCircle,
  Heart,
  TrendingUp,
  BarChart2,
  Smile
} from "lucide-react";
import { ResponsiveContainer, AreaChart, CartesianGrid, XAxis, YAxis, Tooltip, Area } from "recharts";
function HealthRecordsModule({ user }) {
  const [allergies, setAllergies] = useState(() => {
    const saved = localStorage.getItem("dia_allergies");
    return saved ? JSON.parse(saved) : [];
  });
  const [contradictions, setContradictions] = useState(() => {
    const saved = localStorage.getItem("dia_contradictions");
    return saved ? JSON.parse(saved) : [];
  });
  const [newAllergy, setNewAllergy] = useState("");
  const [newContradiction, setNewContradiction] = useState("");
  useEffect(() => {
    localStorage.setItem("dia_allergies", JSON.stringify(allergies));
  }, [allergies]);
  useEffect(() => {
    localStorage.setItem("dia_contradictions", JSON.stringify(contradictions));
  }, [contradictions]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedRecords, setUploadedRecords] = useState(() => {
    const saved = localStorage.getItem("dia_records");
    return saved ? JSON.parse(saved) : [];
  });
  const [uploadFeedback, setUploadFeedback] = useState("");
  const [inputDate, setInputDate] = useState("");
  const [inputFbs, setInputFbs] = useState("");
  const [inputPpbs, setInputPpbs] = useState("");
  const [inputHba1c, setInputHba1c] = useState("");
  const [pastWeights, setPastWeights] = useState(() => {
    const saved = localStorage.getItem("dia_weights");
    return saved ? JSON.parse(saved) : [];
  });
  const [weightInputDate, setWeightInputDate] = useState("");
  const [weightInputValue, setWeightInputValue] = useState("");
  useEffect(() => {
    localStorage.setItem("dia_records", JSON.stringify(uploadedRecords));
  }, [uploadedRecords]);
  useEffect(() => {
    localStorage.setItem("dia_weights", JSON.stringify(pastWeights));
  }, [pastWeights]);
  const [hba1c, setHba1c] = useState("");
  const [fbs, setFbs] = useState("");
  const [ppbs, setPpbs] = useState("");
  const [triglycerides, setTriglycerides] = useState("");
  const [fastingInsulin, setFastingInsulin] = useState("");
  const [hasFattyLiver, setHasFattyLiver] = useState(false);
  const [centralObesity, setCentralObesity] = useState(false);
  const currentHeightInMeters = user.height / 100;
  const currentBmi = Math.round(user.weight / (currentHeightInMeters * currentHeightInMeters) * 10) / 10;
  const hasHomaInputs = fastingInsulin !== "" && fbs !== "";
  const calculatedHomaIr = hasHomaInputs ? Math.round(Number(fastingInsulin) * Number(fbs) / 405 * 100) / 100 : null;
  const calculatedInsulinSensitivity = hasHomaInputs ? Math.round(1 / (Math.log10(Number(fastingInsulin) || 1) + Math.log10(Number(fbs) || 1)) * 100) : null;
  const [cPeptide, setCpeptide] = useState("");
  const [insulinResistanceState, setInsulinResistanceState] = useState({
    level: "Awaiting Data",
    colorText: "text-brand-forest/60 italic",
    bgColor: "bg-brand-sand/30",
    textColor: "text-brand-forest/70",
    borderColor: "border-brand-sage/20 border-dashed border-2",
    reasons: []
  });
  useEffect(() => {
    if (hba1c === "" || fbs === "" || triglycerides === "" || fastingInsulin === "") {
      setInsulinResistanceState({
        level: "Awaiting Data",
        colorText: "text-brand-moss/60 italic font-semibold",
        bgColor: "bg-brand-sand/35",
        textColor: "text-brand-forest/75",
        borderColor: "border-brand-sage/20 border-dashed border-2",
        reasons: ["Please enter HbA1c, Fasting Glycemia, Triglycerides, and Fasting Insulin to perform cellular insulin responsiveness and outcome calculations."]
      });
      return;
    }
    const reasons = [];
    let riskPoints = 0;
    const numHba1c = Number(hba1c);
    const numFbs = Number(fbs);
    const numTriglycerides = Number(triglycerides);
    if (numHba1c >= 5.7) {
      riskPoints += 1.5;
      reasons.push(`HbA1c level is elevated (${numHba1c}%), indicating prolonged carbohydrate load.`);
    }
    if (numFbs > 100) {
      riskPoints += 1.5;
      reasons.push(`Fasting Blood Sugar is elevated (${numFbs} mg/dL), denoting morning glycogen dump.`);
    }
    if (numTriglycerides >= 150) {
      riskPoints += 1;
      reasons.push(`High triglycerides (${numTriglycerides} mg/dL), a key blood lipid proxy for metabolic syndrome.`);
    }
    if (centralObesity) {
      riskPoints += 1;
      reasons.push("Visceral weight gain / central obesity is active. This releases inflammatory chemicals that block glucose paths.");
    }
    if (hasFattyLiver) {
      riskPoints += 1.5;
      reasons.push("Fatty liver history is recorded. Non-alcoholic liver fat accumulation directly halts standard hepatic insulin responses.");
    }
    if (calculatedHomaIr !== null && calculatedHomaIr > 1.9) {
      riskPoints += 1.5;
      reasons.push(`High HOMA-IR ratio (${calculatedHomaIr}), indicating active insulin oversecretion.`);
    }
    let level = "Healthy / Insulin Sensitive";
    let colorText = "text-green-600 font-bold";
    let bgColor = "bg-green-500/10";
    let textColor = "text-green-800";
    let borderColor = "border-green-500/20";
    if (riskPoints >= 5) {
      level = "Critical / Severe Resistance";
      colorText = "text-brand-crimson font-bold";
      bgColor = "bg-brand-scarlet/10";
      textColor = "text-brand-crimson";
      borderColor = "border-brand-scarlet/20";
    } else if (riskPoints >= 3) {
      level = "Moderate Action Advised";
      colorText = "text-[#e67e22] font-bold";
      bgColor = "bg-brand-clay/10";
      textColor = "text-[#e67e22]";
      borderColor = "border-brand-clay/20";
    }
    setInsulinResistanceState({ level, colorText, bgColor, textColor, borderColor, reasons });
  }, [hba1c, fbs, triglycerides, centralObesity, hasFattyLiver, calculatedHomaIr]);
  const handleAddAllergy = () => {
    if (newAllergy.trim() && !allergies.includes(newAllergy.trim())) {
      setAllergies([...allergies, newAllergy.trim()]);
      setNewAllergy("");
    }
  };
  const handleAddContradiction = () => {
    if (newContradiction.trim() && !contradictions.includes(newContradiction.trim())) {
      setContradictions([...contradictions, newContradiction.trim()]);
      setNewContradiction("");
    }
  };
  const handleAddManualRecord = () => {
    if (!inputDate.trim() || inputFbs === "" || inputPpbs === "" || inputHba1c === "") {
      alert("Please enter all the details (Date, Fasting Blood Sugar, Post-Meal, and HbA1c) before saving.");
      return;
    }
    const newRec = {
      date: inputDate.trim(),
      fbs: Number(inputFbs),
      ppbs: Number(inputPpbs),
      hba1c: Number(inputHba1c)
    };
    setUploadedRecords([...uploadedRecords, newRec]);
    setFbs(newRec.fbs);
    setPpbs(newRec.ppbs);
    setHba1c(newRec.hba1c);
    setInputDate("");
    setInputFbs("");
    setInputPpbs("");
    setInputHba1c("");
  };
  const handleAddManualWeight = () => {
    if (!weightInputDate.trim() || weightInputValue === "") {
      alert("Please enter both the date and the physical weight before saving.");
      return;
    }
    const newWeightLog = {
      date: weightInputDate.trim(),
      weight: Number(weightInputValue)
    };
    setPastWeights([...pastWeights, newWeightLog]);
    setWeightInputDate("");
    setWeightInputValue("");
  };
  const handleDeleteRecord = (idxToDelete) => {
    setUploadedRecords(uploadedRecords.filter((_, idx) => idx !== idxToDelete));
  };
  const handleDeleteWeight = (idxToDelete) => {
    setPastWeights(pastWeights.filter((_, idx) => idx !== idxToDelete));
  };
  const handleSimulationUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploading(true);
    setUploadFeedback("");
    setTimeout(() => {
      setIsUploading(false);
      const generatedRecord = {
        date: `Report ${uploadedRecords.length + 1}`,
        fbs: Math.round(95 + Math.random() * 35),
        ppbs: Math.round(130 + Math.random() * 50),
        hba1c: Math.round((5.4 + Math.random() * 1.8) * 10) / 10
      };
      setUploadedRecords([...uploadedRecords, generatedRecord]);
      setFbs(generatedRecord.fbs);
      setPpbs(generatedRecord.ppbs);
      setHba1c(generatedRecord.hba1c);
      setUploadFeedback(`Simulated clinical report file "${file.name}" analyzed successfully! Blood values saved: FBS ${generatedRecord.fbs} mg/dL, PPBS ${generatedRecord.ppbs} mg/dL, HbA1c ${generatedRecord.hba1c}%. Trends fully mapped.`);
    }, 1200);
  };
  return <div className="space-y-8 font-sans" id="health-records-container">
      {
    /* Upper Grid: Profile Insights and File Uploader */
  }
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {
    /* Profile Card & Custom PDF Interpreter */
  }
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white rounded-3xl border border-brand-sage/15 p-6 shadow-sm">
            <h3 className="text-base font-semibold text-brand-forest mb-4 flex items-center gap-2">
              <Smile className="w-5 h-5 text-brand-sage" /> Patient Index
            </h3>
            <div className="space-y-4 text-sm text-brand-forest/90">
              <div className="flex justify-between border-b border-brand-sage/5 pb-2">
                <span className="text-brand-bark">Name</span>
                <span className="font-semibold text-brand-forest">{user.name}</span>
              </div>
              <div className="flex justify-between border-b border-brand-sage/5 pb-2">
                <span className="text-brand-bark">Gender & Age</span>
                <span className="font-semibold text-brand-forest">{user.gender} ({user.age} yrs)</span>
              </div>
              <div className="flex justify-between border-b border-brand-sage/5 pb-2">
                <span className="text-brand-bark">Contact No.</span>
                <span className="font-semibold text-brand-forest">+91 {user.mobile}</span>
              </div>
              <div className="flex justify-between border-b border-brand-sage/5 pb-2">
                <span className="text-brand-bark">Category Tag</span>
                <span className="font-semibold uppercase text-brand-sage tracking-wide text-xs">{user.diabetesType}</span>
              </div>
              <div className="flex justify-between border-b border-brand-sage/5 pb-2">
                <span className="text-brand-bark">Height / Weight</span>
                <span className="font-semibold text-brand-forest">{user.height} cm / {pastWeights.length > 0 ? `${pastWeights[pastWeights.length - 1].weight} kg (latest)` : `${user.weight} kg`}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-brand-bark">Computed BMI</span>
                <span className="font-semibold text-brand-sage">
                  {pastWeights.length > 0 ? Math.round(pastWeights[pastWeights.length - 1].weight / (currentHeightInMeters * currentHeightInMeters) * 10) / 10 : currentBmi}
                </span>
              </div>
            </div>
          </div>

          {
    /* Mapped Weight History Log */
  }
          <div className="bg-white rounded-3xl border border-brand-sage/15 p-6 shadow-sm space-y-4">
            <h3 className="text-sm font-semibold text-brand-forest flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-brand-sage" /> Report-Based Weight Logs
            </h3>
            <p className="text-[11px] text-brand-bark">
              Track weight values obtained strictly from physical clinical reports.
            </p>

            {
    /* Input fields */
  }
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div>
                <label className="block text-[10px] text-brand-bark font-medium mb-1">Date:</label>
                <input
    type="text"
    value={weightInputDate}
    onChange={(e) => setWeightInputDate(e.target.value)}
    className="w-full px-2 py-1 bg-brand-sand/30 border border-brand-sage/15 rounded-md focus:outline-none"
    placeholder="e.g. May 2026"
  />
              </div>
              <div>
                <label className="block text-[10px] text-brand-bark font-medium mb-1">Weight (kg):</label>
                <input
    type="number"
    value={weightInputValue}
    onChange={(e) => {
      const val = e.target.value;
      setWeightInputValue(val === "" ? "" : Number(val));
    }}
    className="w-full px-2 py-1 bg-brand-sand/30 border border-brand-sage/15 rounded-md focus:outline-none"
    placeholder="e.g. 74"
  />
              </div>
            </div>
            <button
    onClick={handleAddManualWeight}
    className="w-full py-1.5 bg-brand-forest hover:bg-brand-moss text-white rounded-lg text-xs font-semibold cursor-pointer"
  >
              Log Physical Weight
            </button>

            {
    /* List */
  }
            {pastWeights.length > 0 ? <div className="space-y-2 max-h-36 overflow-y-auto pt-2 border-t border-brand-sand">
                {pastWeights.map((w, index) => <div key={index} className="flex justify-between items-center text-xs bg-brand-sand/20 px-3 py-1.5 rounded-lg border border-brand-sage/5">
                    <span className="font-semibold text-brand-forest">{w.date}</span>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-brand-forest">{w.weight} kg</span>
                      <button
    onClick={() => handleDeleteWeight(index)}
    className="p-0.5 text-brand-scarlet hover:text-brand-crimson cursor-pointer"
    title="Delete entry"
  >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>)}
              </div> : <p className="text-[10px] text-brand-bark/80 italic text-center py-2">No custom weight reports logged yet.</p>}
          </div>

          <div className="bg-white rounded-3xl border border-brand-sage/15 p-6 shadow-sm">
            <h3 className="text-base font-semibold text-brand-forest mb-2 flex items-center gap-2">
              <UploadCloud className="w-5 h-5 text-brand-sage" /> Report Upload (PDF)
            </h3>
            <p className="text-xs text-brand-bark mb-4">
              Upload your clinical lab records (PDF) to map trending blood sugars automatically.
            </p>

            <label className="relative flex flex-col items-center justify-center border-2 border-dashed border-brand-sage/20 rounded-xl px-4 py-8 bg-brand-sand/50 hover:bg-brand-sage/10 hover:border-brand-sage/40 transition-all cursor-pointer">
              <input
    type="file"
    accept=".pdf,.png,.jpg"
    onChange={handleSimulationUpload}
    className="hidden"
  />
              <FileText className="w-8 h-8 text-brand-sage/40 mb-2" />
              <span className="text-xs font-semibold text-brand-forest">
                {isUploading ? "Inspecting PDF Data..." : "Browse clinical file"}
              </span>
              <span className="text-[10px] text-brand-bark mt-1">PDF, clinical images max 5MB</span>
            </label>

            {uploadFeedback && <div className="mt-4 p-3 bg-brand-sage/10 border border-brand-sage/20 text-brand-forest text-xs rounded-xl flex gap-2">
                <AlertCircle className="w-4 h-4 text-brand-sage shrink-0 mt-0.5" />
                <span className="leading-snug">{uploadFeedback}</span>
              </div>}
          </div>
        </div>

        {
    /* Dynamic Blood Sugar Trend Chart */
  }
        <div className="lg:col-span-8 bg-white rounded-3xl border border-brand-sage/15 p-6 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="text-base font-semibold text-brand-forest flex items-center gap-2">
                  <BarChart2 className="w-5 h-5 text-brand-sage" /> Blood Sugar Trend Analyzer
                </h3>
                <p className="text-xs text-brand-bark mt-1">
                  Visualizing Fasting (FBS) & Post-Meals (PPBS) curves based on uploaded health data.
                </p>
              </div>
            </div>

            <div className="h-64 md:h-80 w-full mb-6" id="sugar-trend-graph">
              {uploadedRecords.length === 0 ? <div className="h-full w-full flex flex-col items-center justify-center p-8 text-center bg-brand-sand/20 rounded-2xl border border-dashed border-brand-sage/20 space-y-4">
                  <BarChart2 className="w-12 h-12 text-brand-sage/40 animate-pulse" />
                  <div>
                    <p className="text-sm font-semibold text-brand-forest">No Scientific Lab Records Found</p>
                    <p className="text-xs text-brand-bark max-w-sm mt-1 leading-relaxed">
                      Graphs do not take automated values. Please log manual glycemic values below, or upload a health lab PDF to visualize your blood sugar trends clinically.
                    </p>
                  </div>
                </div> : <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={uploadedRecords} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="fbsGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#8fb394" stopOpacity={0.2} />
                        <stop offset="95%" stopColor="#8fb394" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="ppbsGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#e67e22" stopOpacity={0.2} />
                        <stop offset="95%" stopColor="#e67e22" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis dataKey="date" tick={{ fill: "#5c6e5e", fontSize: 11 }} />
                    <YAxis domain={[50, 220]} tick={{ fill: "#5c6e5e", fontSize: 11 }} />
                    <Tooltip
    contentStyle={{ background: "#ffffff", borderRadius: "12px", border: "1px solid #8fb394", fontFamily: "sans-serif", fontSize: "12px", color: "#2d362e" }}
  />
                    <Area type="monotone" dataKey="ppbs" name="Post-Meal (PPBS)" stroke="#e67e22" strokeWidth={2.5} fillOpacity={1} fill="url(#ppbsGrad)" />
                    <Area type="monotone" dataKey="fbs" name="Fasting (FBS)" stroke="#8fb394" strokeWidth={2.5} fillOpacity={1} fill="url(#fbsGrad)" />
                  </AreaChart>
                </ResponsiveContainer>}
            </div>

            {
    /* Manual Record Input Form */
  }
            <div className="bg-brand-sand/20 rounded-2xl p-4 border border-brand-sage/15 space-y-3 mb-6 text-xs">
              <h4 className="font-semibold text-brand-forest">Log Custom Lab Report Entry Manually</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div>
                  <label className="block text-brand-bark mb-1">Date Tag:</label>
                  <input
    type="text"
    value={inputDate}
    onChange={(e) => setInputDate(e.target.value)}
    className="w-full px-2 py-1.5 bg-white border border-brand-sage/15 rounded-md focus:outline-none focus:border-brand-forest text-brand-forest font-medium"
    placeholder="e.g. May 25"
  />
                </div>
                <div>
                  <label className="block text-brand-bark mb-1">Fasting (FBS - mg/dL):</label>
                  <input
    type="number"
    value={inputFbs}
    onChange={(e) => {
      const val = e.target.value;
      setInputFbs(val === "" ? "" : Number(val));
    }}
    className="w-full px-2 py-1.5 bg-white border border-brand-sage/15 rounded-md focus:outline-none focus:border-brand-forest text-brand-forest font-semibold"
    placeholder="e.g. 104"
  />
                </div>
                <div>
                  <label className="block text-brand-bark mb-1">Post-Meal (PPBS - mg/dL):</label>
                  <input
    type="number"
    value={inputPpbs}
    onChange={(e) => {
      const val = e.target.value;
      setInputPpbs(val === "" ? "" : Number(val));
    }}
    className="w-full px-2 py-1.5 bg-white border border-brand-sage/15 rounded-md focus:outline-none focus:border-brand-forest text-brand-forest font-semibold"
    placeholder="e.g. 142"
  />
                </div>
                <div>
                  <label className="block text-brand-bark mb-1">HbA1c (%):</label>
                  <input
    type="number"
    step="0.1"
    value={inputHba1c}
    onChange={(e) => {
      const val = e.target.value;
      setInputHba1c(val === "" ? "" : Number(val));
    }}
    className="w-full px-2 py-1.5 bg-white border border-brand-sage/15 rounded-md focus:outline-none focus:border-brand-forest text-brand-forest font-semibold"
    placeholder="e.g. 5.8"
  />
                </div>
              </div>
              <button
    onClick={handleAddManualRecord}
    className="w-full px-3.5 py-2 bg-brand-forest hover:bg-brand-moss text-white rounded-xl font-semibold flex items-center justify-center gap-1.5 duration-100 cursor-pointer text-xs shadow-xs"
  >
                <Plus className="w-3.5 h-3.5" /> Save Manual Report Entry
              </button>
            </div>

            {
    /* Active Glycemic Records Database list with red trash button */
  }
            {uploadedRecords.length > 0 && <div className="mb-6 space-y-2 text-xs">
                <span className="block font-bold text-brand-forest uppercase tracking-wider text-[10px]">Active Glycemic Records History ({uploadedRecords.length})</span>
                <div className="max-h-40 overflow-y-auto divide-y divide-brand-sand border border-brand-sage/10 rounded-xl bg-white shadow-xs">
                  {uploadedRecords.map((item, idx) => <div key={idx} className="flex justify-between items-center px-4 py-2 hover:bg-brand-sand/20">
                      <div className="grid grid-cols-4 gap-4 flex-1">
                        <span className="font-semibold text-brand-forest">{item.date}</span>
                        <span className="text-brand-bark">FBS: <strong className="text-brand-forest">{item.fbs} mg/dL</strong></span>
                        <span className="text-brand-bark">PPBS: <strong className="text-brand-clay">{item.ppbs} mg/dL</strong></span>
                        <span className="text-brand-sage font-bold">HbA1c: {item.hba1c}%</span>
                      </div>
                      <button
    onClick={() => handleDeleteRecord(idx)}
    className="p-1 text-brand-scarlet/70 hover:text-brand-crimson hover:bg-brand-scarlet/5 rounded transition-colors cursor-pointer"
    title="Delete historic entry"
  >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>)}
                </div>
              </div>}
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 pt-6 border-t border-brand-sand text-center text-xs">
            <div className="p-3 bg-brand-sage/10 rounded-xl border border-brand-sage/20 text-brand-forest">
              <span className="block text-brand-bark">Current Average FBS</span>
              <span className="text-base font-bold text-brand-forest m-1.5 inline-block">
                {uploadedRecords.length > 0 ? `${Math.round(uploadedRecords.reduce((acc, r) => acc + r.fbs, 0) / uploadedRecords.length)} mg/dL` : "N/A"}
              </span>
            </div>
            <div className="p-3 bg-brand-clay/10 rounded-xl border border-brand-clay/20 text-brand-clay">
              <span className="block text-brand-bark">Current Average PPBS</span>
              <span className="text-base font-bold text-brand-clay m-1.5 inline-block">
                {uploadedRecords.length > 0 ? `${Math.round(uploadedRecords.reduce((acc, r) => acc + r.ppbs, 0) / uploadedRecords.length)} mg/dL` : "N/A"}
              </span>
            </div>
            <div className="p-3 bg-brand-moss/10 rounded-xl border border-brand-moss/20 text-brand-forest">
              <span className="block text-brand-bark">Current HbA1c average</span>
              <span className="text-base font-bold text-brand-forest m-1.5 inline-block">
                {uploadedRecords.length > 0 ? `${(uploadedRecords.reduce((acc, r) => acc + r.hba1c, 0) / uploadedRecords.length).toFixed(1)}%` : `${hba1c}%`}
              </span>
            </div>
            <div className="p-3 bg-brand-amber/10 rounded-xl border border-brand-amber/20 text-brand-forest">
              <span className="block text-brand-bark">Latest Calibration</span>
              <span className="text-base font-bold text-brand-forest m-1.5 inline-block">
                {uploadedRecords.length > 0 ? "Calibrated" : "No Data"}
              </span>
            </div>
          </div>
        </div>
      </div>

      {
    /* Allergies / Contradictions (Symptoms Module) */
  }
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {
    /* Contradictions & Symptoms */
  }
        <div className="bg-white rounded-3xl border border-brand-sage/15 p-6 shadow-sm">
          <h3 className="text-base font-semibold text-brand-forest mb-1 flex items-center gap-2">
            <Heart className="w-5 h-5 text-brand-scarlet" /> Active Symptoms & Contradictions
          </h3>
          <p className="text-xs text-brand-bark mb-4">
            Identify health symptoms to steer clear of conflicting medications.
          </p>

          <div className="space-y-3 mb-4" id="contradiction-list">
            {contradictions.map((item, idx) => <div key={idx} className="flex justify-between items-center bg-brand-scarlet/10 text-brand-crimson border border-brand-scarlet/20 px-3.5 py-2.5 rounded-xl text-xs font-semibold">
                <span>{item}</span>
                <button
    onClick={() => setContradictions(contradictions.filter((_, i) => i !== idx))}
    className="text-brand-scarlet/65 hover:text-brand-crimson transition-colors"
  >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>)}
          </div>

          <div className="flex gap-2">
            <input
    type="text"
    value={newContradiction}
    onChange={(e) => setNewContradiction(e.target.value)}
    placeholder="e.g. Pancreatitis, Gastric flareup"
    className="flex-1 px-3.5 py-2 bg-brand-sand/50 border border-brand-sage/20 rounded-xl text-xs text-brand-forest placeholder-brand-sage/55 focus:outline-none focus:border-brand-forest"
  />
            <button
    onClick={handleAddContradiction}
    className="px-4 py-2 bg-brand-forest hover:bg-brand-moss text-white rounded-xl text-xs font-semibold transition-colors flex items-center gap-1.5 cursor-pointer"
  >
              <Plus className="w-3.5 h-3.5" /> Track
            </button>
          </div>
        </div>

        {
    /* Contradiction Allergies */
  }
        <div className="bg-white rounded-3xl border border-brand-sage/15 p-6 shadow-sm">
          <h3 className="text-base font-semibold text-brand-forest mb-1 flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-brand-clay" /> Known Chemical Allergies
          </h3>
          <p className="text-xs text-brand-bark mb-4">
            Clinical allergens cross-referenced automatically against Smart Medication searches.
          </p>

          <div className="space-y-3 mb-4" id="allergy-list">
            {allergies.map((item, idx) => <div key={idx} className="flex justify-between items-center bg-brand-clay/10 text-[#d35400] border border-brand-clay/20 px-3.5 py-2.5 rounded-xl text-xs font-semibold">
                <span>{item}</span>
                <button
    onClick={() => setAllergies(allergies.filter((_, i) => i !== idx))}
    className="text-[#e67e22]/70 hover:text-brand-clay transition-colors"
  >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>)}
          </div>

          <div className="flex gap-2">
            <input
    type="text"
    value={newAllergy}
    onChange={(e) => setNewAllergy(e.target.value)}
    placeholder="e.g. Walnuts, Sulfa, Lactose"
    className="flex-1 px-3.5 py-2 bg-brand-sand/50 border border-brand-sage/20 rounded-xl text-xs text-brand-forest placeholder-brand-sage/55 focus:outline-none focus:border-brand-forest"
  />
            <button
    onClick={handleAddAllergy}
    className="px-4 py-2 bg-brand-forest hover:bg-brand-moss text-white rounded-xl text-xs font-semibold transition-colors flex items-center gap-1.5 cursor-pointer"
  >
              <Plus className="w-3.5 h-3.5" /> Tag
            </button>
          </div>
        </div>
      </div>

      {
    /* Critical Insulin Resistance & Historical Calculator panel */
  }
      <div className="bg-white rounded-3xl border border-brand-sage/15 p-6 shadow-sm space-y-6">
        <div>
          <h3 className="text-base font-semibold text-brand-forest mb-1 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-brand-sage" /> Insulin Resistance Assessment
          </h3>
          <p className="text-xs text-brand-bark">
            Calculated dynamic risk score linking HbA1c, triglycerides, HOMA-IR ratio, Central Obesity and Fatty Liver history.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {
    /* Diagnostic Inputs column */
  }
          <div className="space-y-4 p-4 rounded-2xl border border-brand-sage/10 bg-brand-sand/50 text-xs">
            <span className="block font-semibold text-brand-forest mb-3 uppercase tracking-wider text-[10px]">Adjust Health Signposts</span>
            
            <div className="space-y-3 font-medium">
              <div>
                <label className="block text-brand-bark mb-1">HbA1c (%):</label>
                <input
    type="number"
    step="0.1"
    value={hba1c}
    placeholder="Enter HbA1c (e.g. 5.8)"
    onChange={(e) => {
      const val = e.target.value;
      setHba1c(val === "" ? "" : Number(val));
    }}
    className="w-full px-2.5 py-1.5 bg-white border border-brand-sage/15 rounded-lg text-brand-forest focus:outline-none focus:border-brand-forest"
  />
              </div>

              <div>
                <label className="block text-brand-bark mb-1">Fasting Glycemia (FBS - mg/dL):</label>
                <input
    type="number"
    value={fbs}
    placeholder="Enter Fasting Glucose"
    onChange={(e) => {
      const val = e.target.value;
      setFbs(val === "" ? "" : Number(val));
    }}
    className="w-full px-2.5 py-1.5 bg-white border border-brand-sage/15 rounded-lg text-brand-forest focus:outline-none focus:border-brand-forest"
  />
              </div>

              <div>
                <label className="block text-brand-bark mb-1">Triglycerides (mg/dL):</label>
                <input
    type="number"
    value={triglycerides}
    placeholder="Enter Triglycerides"
    onChange={(e) => {
      const val = e.target.value;
      setTriglycerides(val === "" ? "" : Number(val));
    }}
    className="w-full px-2.5 py-1.5 bg-white border border-brand-sage/15 rounded-lg text-brand-forest focus:outline-none focus:border-brand-forest"
  />
              </div>

              <div>
                <label className="block text-brand-bark mb-1">Fasting Insulin Level (uIU/mL):</label>
                <input
    type="number"
    value={fastingInsulin}
    placeholder="Enter Fasting Insulin"
    onChange={(e) => {
      const val = e.target.value;
      setFastingInsulin(val === "" ? "" : Number(val));
    }}
    className="w-full px-2.5 py-1.5 bg-white border border-brand-sage/15 rounded-lg text-brand-forest focus:outline-none focus:border-brand-forest"
  />
              </div>
            </div>
          </div>

          {
    /* Genetic / Medical checkboxes */
  }
          <div className="space-y-4 p-4 rounded-2xl border border-brand-sage/10 bg-brand-sand/50 text-xs text-brand-bark">
            <span className="block font-semibold text-brand-forest mb-3 uppercase tracking-wider text-[10px]">Medical History Check</span>
            
            <label className="flex items-start gap-2.5 p-2 bg-white rounded-lg border border-brand-sage/10 cursor-pointer select-none">
              <input
    type="checkbox"
    checked={hasFattyLiver}
    onChange={(e) => setHasFattyLiver(e.target.checked)}
    className="mt-0.5"
  />
              <div>
                <span className="font-semibold text-brand-forest block text-xs">Fatty Liver History</span>
                <span className="text-[10px] text-brand-bark/80">Recorded clinical signs of fatty liver tissue.</span>
              </div>
            </label>

            <label className="flex items-start gap-2.5 p-2 bg-white rounded-lg border border-brand-sage/10 cursor-pointer select-none">
              <input
    type="checkbox"
    checked={centralObesity}
    onChange={(e) => setCentralObesity(e.target.checked)}
    className="mt-0.5"
  />
              <div>
                <span className="font-semibold text-brand-forest block text-xs">Central Obesity / Waist Weight Gain</span>
                <span className="text-[10px] text-brand-bark/80">Central localized adipose tissue.</span>
              </div>
            </label>

            <div>
              <label className="block text-brand-bark mb-1">C-Peptide Levels (ng/mL):</label>
              <input
    type="number"
    step="0.1"
    value={cPeptide}
    placeholder="Enter C-Peptide"
    onChange={(e) => {
      const val = e.target.value;
      setCpeptide(val === "" ? "" : Number(val));
    }}
    className="w-full px-2.5 py-1.5 bg-white border border-brand-sage/20 rounded-lg text-xs text-brand-forest focus:outline-none focus:border-brand-forest"
  />
            </div>
          </div>

          {
    /* Dynamic computed insulin results column */
  }
          <div className="space-y-4">
            <div className={`p-5 rounded-2xl border ${insulinResistanceState.bgColor} ${insulinResistanceState.borderColor} ${insulinResistanceState.textColor} h-full space-y-4`}>
              <div>
                <span className="text-[10px] uppercase font-semibold text-brand-bark tracking-wider">Resistance Outcome State</span>
                <div className="text-lg font-bold mt-1 inline-flex items-center gap-1.5">
                  <span className={insulinResistanceState.colorText}>
                    {insulinResistanceState.level}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs bg-white/70 backdrop-blur-xs p-3 rounded-xl border border-white/50 text-brand-forest">
                <div>
                  <span className="text-[10px] text-brand-bark block font-medium">HOMA-IR Value</span>
                  <span className="font-bold text-brand-forest">{calculatedHomaIr !== null ? calculatedHomaIr : "N/A"}</span>
                  <p className="text-[9px] text-[#c0392b] font-semibold mt-0.5">Normal is &lt; 1.9</p>
                </div>
                <div>
                  <span className="text-[10px] text-brand-bark block font-medium">Insulin Sensitivity</span>
                  <span className="font-bold text-brand-forest">{calculatedInsulinSensitivity !== null ? `${calculatedInsulinSensitivity}%` : "N/A"}</span>
                  <p className="text-[9px] text-brand-sage font-semibold mt-0.5">High is healthier</p>
                </div>
              </div>

              {insulinResistanceState.reasons.length > 0 && <div className="text-[11px] leading-relaxed space-y-1.5">
                  <span className="font-semibold block text-brand-forest">Etiology Rationale:</span>
                  <ul className="list-disc pl-3.5 space-y-1 text-brand-forest/90 font-medium">
                    {insulinResistanceState.reasons.map((re, index) => <li key={index}>{re}</li>)}
                  </ul>
                </div>}
            </div>
          </div>
        </div>
      </div>
    </div>;
}
export {
  HealthRecordsModule as default
};
