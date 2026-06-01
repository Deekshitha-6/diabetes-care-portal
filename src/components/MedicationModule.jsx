import { useState, useRef } from "react";
import {
  Search,
  Pill,
  Sparkles,
  BookOpen,
  CheckCircle,
  Eye,
  RefreshCw,
  Upload,
  ShieldX
} from "lucide-react";
import { medicationDb, searchMedicines } from "../utils/medication";
function MedicationModule({
  allergies = ["Gluten", "Sulfa Drugs"],
  contradictions = ["Dehydration", "Active Pancreatitis"],
  user
}) {
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestedMeds, setSuggestedMeds] = useState([]);
  const [selectedMed, setSelectedMed] = useState(null);
  const [selectedDosage, setSelectedDosage] = useState("");
  const [selectedFrequency, setSelectedFrequency] = useState("");
  const [isOcrScanning, setIsOcrScanning] = useState(false);
  const [ocrCompleted, setOcrCompleted] = useState(false);
  const [ocrFeedbackMessage, setOcrFeedbackMessage] = useState("");
  const [scannedMedResult, setScannedMedResult] = useState(null);
  const [uploadedImageFilename, setUploadedImageFilename] = useState("");
  const ocrFileInputRef = useRef(null);
  const handleSearchChange = (val) => {
    setSearchQuery(val);
    if (val.trim().length > 0) {
      const results = searchMedicines(val).filter((m) => m.category === "diabetic");
      setSuggestedMeds(results);
    } else {
      setSuggestedMeds([]);
    }
  };
  const handleSelectMed = (med) => {
    setSelectedMed(med);
    setSelectedDosage(med.dosages[0]);
    setSelectedFrequency(med.frequencies[0]);
    setSuggestedMeds([]);
    setSearchQuery("");
  };
  const handleOcrFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadedImageFilename(file.name);
    setIsOcrScanning(true);
    setOcrCompleted(false);
    setScannedMedResult(null);
    setTimeout(() => {
      setIsOcrScanning(false);
      setOcrCompleted(true);
      const index = Math.random() > 0.5 ? 0 : 2;
      const detected = medicationDb[index];
      setScannedMedResult(detected);
      setSelectedMed(detected);
      setSelectedDosage(detected.dosages[0]);
      setSelectedFrequency(detected.frequencies[0]);
      setOcrFeedbackMessage(`OCR Engine parsed labels successfully! Extracted entity: "${detected.name}" with specified dosages. Submitting safety checks...`);
    }, 2800);
  };
  const verifyMedSafety = (med) => {
    const alerts = [];
    let isSafe = true;
    allergies.forEach((allergy) => {
      if (med.allergyInfo.toLowerCase().includes(allergy.toLowerCase()) || med.name.toLowerCase().includes(allergy.toLowerCase())) {
        isSafe = false;
        alerts.push(`Active Allergen warning: This drug overlaps with your recorded allergy/sensitivity to: "${allergy}".`);
      }
    });
    contradictions.forEach((contra) => {
      med.contraindications.forEach((mContra) => {
        if (mContra.toLowerCase().includes(contra.toLowerCase())) {
          isSafe = false;
          alerts.push(`Active Contraindication: Scanner warns against taking "${med.name}" during periods of: "${contra}".`);
        }
      });
    });
    return { isSafe, alerts };
  };
  const currentSafety = selectedMed ? verifyMedSafety(selectedMed) : { isSafe: true, alerts: [] };
  const scannedSafety = scannedMedResult ? verifyMedSafety(scannedMedResult) : { isSafe: true, alerts: [] };
  return <div className="space-y-8 font-sans" id="medication-module-container">
      
      {
    /* Primary Layout Grid: Smart search vs OCR OCR Laser panel */
  }
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {
    /* Left column: drug smart finder */
  }
        <div className="lg:col-span-7 bg-white rounded-3xl border border-brand-sage/15 p-6 shadow-sm space-y-6">
          <div>
            <h3 className="text-base font-semibold text-brand-forest mb-1 flex items-center gap-2">
              <Pill className="w-5 h-5 text-brand-sage animate-pulse" /> Smart Prescription Search
            </h3>
            <p className="text-xs text-brand-bark">
              Type first letters of the medicine (e.g., "Met", "Sem", "Glip") to view dosages, frequency schedules, and warnings.
            </p>
          </div>

          {
    /* Interactive Search Field */
  }
          <div className="relative space-y-4">
            <div className="relative">
              <Search className="absolute left-3.5 top-3 w-4.5 h-4.5 text-brand-sage/50" />
              <input
    type="text"
    value={searchQuery}
    onChange={(e) => handleSearchChange(e.target.value)}
    placeholder="Type 'Met' (app suggests Metformin) or other diabetes medicine..."
    className="w-full pl-11 pr-4 py-3 bg-brand-sand/55 border border-brand-sage/20 rounded-xl text-sm text-brand-forest placeholder-brand-sage/50 focus:outline-none focus:border-brand-forest"
  />
            </div>

            {
    /* Structured Select Dropdowns */
  }
            <div className="pt-1 bg-brand-sand/20 p-4 rounded-2xl border border-brand-sage/10">
              <div>
                <label className="block text-[10px] font-bold text-brand-forest uppercase tracking-wider mb-2">
                  Select Diabetic Meds & Quantity / Strength:
                </label>
                <select
    onChange={(e) => {
      const val = e.target.value;
      if (val) {
        const [medName, dose] = val.split("|");
        const med = medicationDb.find((m) => m.name === medName);
        if (med) {
          handleSelectMed(med);
          setSelectedDosage(dose);
        }
      }
    }}
    className="w-full px-3 py-2.5 bg-white border border-brand-sage/25 rounded-xl text-xs text-brand-forest focus:outline-none focus:border-brand-forest"
  >
                  <option value="">-- Choose Diabetic Drug & Quantity --</option>
                  {medicationDb.filter((m) => m.category === "diabetic").map((m) => <optgroup key={m.name} label={`${m.name} Suggestions`}>
                      {m.dosages.map((d) => <option key={`${m.name}-${d}`} value={`${m.name}|${d}`}>
                          {m.name} ({d} Quantity)
                        </option>)}
                    </optgroup>)}
                </select>
              </div>
            </div>

            {
    /* Smart Search Suggestions Dropdown */
  }
            {suggestedMeds.length > 0 && <div className="absolute z-10 w-full bg-white border border-brand-sage/15 rounded-xl mt-1 shadow-lg max-h-60 overflow-y-auto divide-y divide-brand-sand">
                {suggestedMeds.map((med) => <button
    key={med.name}
    onClick={() => handleSelectMed(med)}
    className="w-full text-left px-4 py-3 hover:bg-brand-sand/50 flex items-center justify-between text-xs transition-colors cursor-pointer"
  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-2.5 h-2.5 rounded-full bg-brand-sage" />
                      <span className="font-semibold text-brand-forest">{med.name}</span>
                    </div>
                    <span className="text-[10px] uppercase text-brand-forest/60 font-semibold px-2 py-0.5 bg-brand-sand rounded">
                      {med.category}
                    </span>
                  </button>)}
              </div>}
          </div>

          {
    /* Active Medication Card Detail Representation */
  }
          {!selectedMed ? <div className="bg-brand-sand/30 border border-dashed border-brand-sage/20 rounded-2xl p-8 text-center flex flex-col items-center justify-center min-h-[300px]">
              <Pill className="w-10 h-10 text-brand-sage/40 mb-3 animate-pulse" />
              <h4 className="text-sm font-bold text-brand-forest">No Medication Selected</h4>
              <p className="text-xs text-brand-bark max-w-sm mt-1.5 leading-relaxed">
                Provide an input or pick a medication from the prescription search above to view safety indices, age suitability, standardized metabolic checks, {user?.gender?.toLowerCase() === "male" ? "" : "pregnancy warnings, "}and kidney restrictions.
              </p>
            </div> : <div className="bg-brand-sand/40 border border-brand-sage/10 rounded-2xl p-5 space-y-5">
              
              {
    /* Header block */
  }
              <div className="flex justify-between items-start">
                <div>
                  <span className="px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider bg-brand-sage/15 text-brand-forest rounded">
                    Category: {selectedMed.category}
                  </span>
                  <h4 className="text-xl font-bold text-brand-forest mt-1.5">{selectedMed.name}</h4>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-brand-bark block font-medium">Age group</span>
                  <span className="text-xs font-bold text-brand-forest">{selectedMed.ageSuitability}</span>
                </div>
              </div>

              {
    /* Action config: Dosage & frequency selectors requested */
  }
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-b border-brand-sage/15 py-4">
                <div>
                  <label className="block text-[10px] font-bold text-brand-bark uppercase mb-1.5">Dosage formulation</label>
                  <div className="flex flex-wrap gap-2">
                    {selectedMed.dosages.map((dose) => <button
    key={dose}
    onClick={() => setSelectedDosage(dose)}
    className={`px-3 py-1.5 cursor-pointer rounded-lg text-xs font-semibold border transition-all ${selectedDosage === dose ? "border-brand-forest bg-brand-forest text-white shadow-xs" : "border-brand-sage/20 bg-white text-brand-forest hover:bg-brand-sand/50"}`}
  >
                        {dose}
                      </button>)}
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-brand-bark uppercase mb-1.5">Frequency cadence</label>
                  <div className="flex flex-col gap-2">
                    {selectedMed.frequencies.map((freq) => <button
    key={freq}
    onClick={() => setSelectedFrequency(freq)}
    className={`px-3 py-1.5 cursor-pointer rounded-lg text-left text-xs font-semibold border transition-all truncate ${selectedFrequency === freq ? "border-brand-forest bg-brand-forest text-white shadow-xs" : "border-brand-sage/20 bg-white text-brand-forest hover:bg-brand-sand/50"}`}
  >
                        {freq}
                      </button>)}
                  </div>
                </div>
              </div>

              {
    /* Cross reference clinical safety checks alert */
  }
              <div className="space-y-2.5">
                <span className="block text-[10px] uppercase font-bold text-brand-bark tracking-wider">Health Security checks</span>
                {currentSafety.isSafe ? <div className="p-3 bg-brand-sage/10 border border-brand-sage/20 text-brand-forest rounded-xl text-xs flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-brand-sage shrink-0" />
                    <span>No active allergy or symptom conflicts detected. This formulation is safe to continue.</span>
                  </div> : <div className="space-y-2">
                    {currentSafety.alerts.map((alert, index) => <div key={index} className="p-3 bg-brand-scarlet/10 border border-brand-scarlet/20 text-brand-crimson rounded-xl text-xs flex gap-2">
                        <ShieldX className="w-5 h-5 text-brand-crimson shrink-0 mt-0.5" />
                        <span className="font-semibold leading-relaxed">{alert}</span>
                      </div>)}
                  </div>}
              </div>

              {
    /* Side-effects & contraindications details */
  }
              <div className={`grid grid-cols-1 ${user?.gender?.toLowerCase() === "male" ? "" : "md:grid-cols-2"} gap-4 pt-2`}>
                <div className="p-3.5 bg-white border border-brand-sage/15 rounded-xl space-y-1.5">
                  <span className="block text-[10px] font-bold text-brand-bark uppercase tracking-wide">Common Side effects</span>
                  <ul className="list-disc pl-4 text-xs text-brand-forest/90 space-y-1">
                    {selectedMed.sideEffects.slice(0, 3).map((v, i) => <li key={i}>{v}</li>)}
                  </ul>
                </div>
                {user?.gender?.toLowerCase() === "male" ? <div className="p-3.5 bg-white border border-brand-sage/15 rounded-xl space-y-1.5">
                    <span className="block text-[10px] font-bold text-brand-bark uppercase tracking-wide">Kidney Restrictions</span>
                    <p className="text-xs text-brand-forest/90 leading-relaxed font-semibold">
                      <span className="text-[10px] text-brand-bark block font-medium">{selectedMed.kidneyRestrictions}</span>
                    </p>
                  </div> : <div className="p-3.5 bg-white border border-brand-sage/15 rounded-xl space-y-1.5">
                    <span className="block text-[10px] font-bold text-brand-bark uppercase tracking-wide">Pregnancy Warning & Kidney</span>
                    <p className="text-xs text-brand-forest/90 leading-relaxed font-semibold">
                      {selectedMed.pregnancyWarning ? "\u26A0\uFE0F High risk during pregnancy - consult obstetrician." : "\u2705 Safe for pregnancy with standard supervisor checks."}
                      <span className="text-[10px] text-brand-bark mt-1 block font-medium">{selectedMed.kidneyRestrictions}</span>
                    </p>
                  </div>}
              </div>

            </div>}

        </div>

        {
    /* Right column: Prescription card / box scanner simulation */
  }
        <div className="lg:col-span-5 bg-white rounded-3xl border border-brand-sage/15 p-6 shadow-sm flex flex-col justify-between space-y-6">
          <div>
            <h3 className="text-base font-semibold text-brand-forest mb-1 flex items-center gap-2">
              <Eye className="w-5 h-5 text-brand-sage" /> Label OCR Scanning
            </h3>
            <p className="text-xs text-brand-bark mb-4">
              Capture or upload a medical label. Our OCR text system reads raw words, checks dose and records safety.
            </p>

            {
    /* OCR Drag / Upload Simulator */
  }
            <div className="relative border-2 border-dashed border-brand-sage/25 bg-brand-sand/55 rounded-xl p-6 text-center cursor-pointer hover:border-brand-sage/45 transition-colors flex flex-col items-center justify-center min-h-[170px]">
              <input
    type="file"
    ref={ocrFileInputRef}
    onChange={handleOcrFileSelect}
    accept="image/*"
    className="absolute inset-0 opacity-0 cursor-pointer"
    id="ocr-file-picker"
  />

              {isOcrScanning ? <div className="space-y-3 flex flex-col items-center">
                  <RefreshCw className="w-8 h-8 text-brand-sage animate-spin" />
                  <span className="text-xs font-semibold text-brand-forest">Extracting pharmaceutical text...</span>
                  {
    /* Visual laser scanner line */
  }
                  <div className="w-32 h-1 bg-brand-sage absolute left-1/2 -translate-x-1/2 top-4 animate-bounce rounded-full" />
                </div> : <div className="space-y-2 flex flex-col items-center">
                  <Upload className="w-8 h-8 text-brand-sage/40 mb-1" />
                  <span className="text-xs font-semibold text-brand-forest">
                    {uploadedImageFilename ? `Target selected: ${uploadedImageFilename}` : "Click to scan container box"}
                  </span>
                  <span className="text-[10px] text-brand-bark">Takes JPG/PNG, running smart character parsing</span>
                </div>}
            </div>

            {
    /* Simulated OCR Response panel */
  }
            {ocrCompleted && scannedMedResult && <div className="mt-4 p-4 rounded-xl border border-brand-sage/20 bg-brand-sage/10 space-y-3 font-sans">
                <div className="flex gap-2">
                  <Sparkles className="w-4.5 h-4.5 text-brand-sage shrink-0 mt-0.5 animate-pulse" />
                  <div>
                    <span className="text-xs font-bold text-brand-forest block">OCR Recognition Complete</span>
                    <p className="text-[10.5px] text-brand-forest/90 leading-snug mt-1">
                      {ocrFeedbackMessage}
                    </p>
                  </div>
                </div>

                <div className="p-3 bg-white rounded-lg border border-brand-sage/10 text-xs">
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-bold text-brand-forest">Detected Formulation:</span>
                    <span className="text-[9px] uppercase font-bold text-brand-bark">OCR Confidence 98%</span>
                  </div>
                  <div className="font-semibold text-brand-forest">{scannedMedResult.name} - 500mg, Twice Daily</div>
                </div>

                {
    /* Scanned medicine cross-allergy details */
  }
                <div className="pt-1">
                  {scannedSafety.isSafe ? <div className="p-2.5 bg-white rounded-lg border border-brand-sage/10 text-[11px] text-brand-forest flex items-center gap-1.5 animate-fade-in">
                      <CheckCircle className="w-4 h-4 text-brand-sage shrink-0" />
                      <span>Allergy Clearance: Fully compatible.</span>
                    </div> : <div className="space-y-1.5">
                      {scannedSafety.alerts.map((alert, index) => <div key={index} className="p-2.5 bg-brand-scarlet/10 border border-brand-scarlet/20 text-[11px] text-brand-crimson flex items-start gap-1.5 rounded-lg">
                          <ShieldX className="w-4 h-4 text-brand-scarlet shrink-0 mt-0.5" />
                          <span>{alert}</span>
                        </div>)}
                    </div>}
                </div>
              </div>}
          </div>

          <div className="p-4 bg-brand-sand/60 border border-brand-sage/15 rounded-xl space-y-2 text-xs">
            <span className="font-semibold text-brand-forest flex items-center gap-1.5">
              <BookOpen className="w-4.5 h-4.5 text-brand-sage" /> Scanner Clinical Checklist
            </span>
            <p className="text-brand-forest/80 leading-relaxed text-[11px]">
              Our system checks drug names against clinical indexes before ingestion. Ensure label font is clear, non-blurred, and matches standard retail medication formatting.
            </p>
          </div>

        </div>
      </div>
    </div>;
}
export {
  MedicationModule as default
};
