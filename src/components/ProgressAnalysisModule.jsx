import { useState } from "react";
import {
  Heart,
  BarChart2,
  Activity,
  ShieldCheck,
  Scale,
  Apple,
  Brain,
  AlertCircle,
  ThumbsUp
} from "lucide-react";
import { ResponsiveContainer, LineChart, CartesianGrid, XAxis, YAxis, Tooltip, Line, Legend } from "recharts";
function ProgressAnalysisModule({ user }) {
  const [overallStatus, setOverallStatus] = useState("improving");
  const [diaRecords, setDiaRecords] = useState(() => {
    const saved = localStorage.getItem("dia_records");
    return saved ? JSON.parse(saved) : [];
  });
  const [diaWeights, setDiaWeights] = useState(() => {
    const saved = localStorage.getItem("dia_weights");
    return saved ? JSON.parse(saved) : [];
  });
  const currentWeight = diaWeights.length > 0 ? diaWeights[diaWeights.length - 1].weight : user.weight;
  const previousWeight = diaWeights.length > 1 ? diaWeights[diaWeights.length - 2].weight : user.weight + 3.4;
  const heightInMeters = user.height / 100;
  const currentBmi = Math.round(currentWeight / (heightInMeters * heightInMeters) * 10) / 10;
  const prevBmi = Math.round(previousWeight / (heightInMeters * heightInMeters) * 10) / 10;
  const bmiDifference = Math.round((currentBmi - prevBmi) * 10) / 10;
  const weightDifference = Math.round((currentWeight - previousWeight) * 10) / 10;
  const weeklyData = diaRecords.map((r, i) => ({
    day: r.date || `Day ${i + 1}`,
    fbs: Number(r.fbs),
    ppbs: Number(r.ppbs),
    safeMax: 130
  }));
  const behaviourData = {
    weeklySugars: diaRecords.length > 0 ? `${(diaRecords.reduce((acc, r) => acc + (r.hba1c || 6), 0) / diaRecords.length * 5).toFixed(1)}g (Low)` : "32g (Low)",
    highGiCount: diaRecords.filter((r) => r.ppbs > 150).length,
    // meals exceeding ppbs threshold in manual records
    carbAdherence: diaRecords.length > 0 ? `${Math.max(50, 100 - diaRecords.filter((r) => r.ppbs > 140).length * 15)}% Good` : "100% Good",
    avgActiveMinutes: "42 mins / day",
    mindfulEatingScore: "7.8 / 10"
  };
  const statusMap = {
    improving: {
      label: "Improving",
      color: "bg-brand-sage text-white border-brand-sage/50",
      textClass: "text-brand-forest",
      bgColor: "bg-brand-sage/15 border-brand-sage/20",
      desc: "Superb trends! Weight is reducing safely, and Hba1c is responding cleanly. Your cellular receptor pathways are restoring insulin sensitivity."
    },
    stable: {
      label: "Stable",
      color: "bg-[#e67e22] text-white border-orange-200",
      textClass: "text-[#e67e22]",
      bgColor: "bg-orange-50/60 border-orange-100/60",
      desc: "Consistent readings. Maintaining level glycemic control. Continue focusing on food color codings and exercise limits to foster gradual enhancements."
    },
    attention: {
      label: "Needs Attention",
      color: "bg-brand-scarlet text-white border-brand-scarlet/50",
      textClass: "text-brand-crimson",
      bgColor: "bg-brand-scarlet/10 border-brand-scarlet/20",
      desc: "Notice requested. Blood sugar fluctuations detected, possibly linked with elevated carb loads. Exercise portion warnings and keep daily movement profiles target-oriented."
    }
  };
  return <div className="space-y-8 font-sans" id="progress-analysis-container">
      
      {
    /* Upper Panel: Status buttons & Weight progress card */
  }
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {
    /* Overall Status Radio Panel */
  }
        <div className="lg:col-span-5 bg-white rounded-3xl border border-brand-sage/15 p-6 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="text-base font-semibold text-brand-forest mb-1 flex items-center gap-2">
              <Activity className="w-5 h-5 text-brand-sage" /> Overall Clinical Status
            </h3>
            <p className="text-xs text-brand-bark mb-6">
              Track and evaluate your self-assessed overall metabolic response.
            </p>

            {
    /* Glowing Status Indicator */
  }
            <div className={`p-4 rounded-xl border mb-6 ${statusMap[overallStatus].bgColor} ${statusMap[overallStatus].textClass}`}>
              <span className="text-[10px] font-bold uppercase tracking-wider block mb-1">Clinic Assessment Verdict</span>
              <p className="text-xs leading-relaxed font-medium">
                {statusMap[overallStatus].desc}
              </p>
            </div>

            {
    /* Custom Styled Radio Selectors */
  }
            <div className="space-y-3" id="status-radio-options">
              <label
    className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-all ${overallStatus === "improving" ? "border-brand-sage bg-brand-sage/10" : "border-brand-sage/10 bg-white hover:bg-brand-sand/20"}`}
  >
                <div className="flex items-center gap-2.5">
                  <input
    type="radio"
    name="clinicalStatus"
    value="improving"
    checked={overallStatus === "improving"}
    onChange={() => setOverallStatus("improving")}
    className="accent-brand-sage"
  />
                  <span className="text-xs font-semibold text-brand-forest">Improving (Active progress)</span>
                </div>
                <span className="w-2.5 h-2.5 rounded-full bg-brand-sage" />
              </label>

              <label
    className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-all ${overallStatus === "stable" ? "border-[#e67e22] bg-[#e67e22]/10" : "border-brand-sage/10 bg-white hover:bg-brand-sand/20"}`}
  >
                <div className="flex items-center gap-2.5">
                  <input
    type="radio"
    name="clinicalStatus"
    value="stable"
    checked={overallStatus === "stable"}
    onChange={() => setOverallStatus("stable")}
    className="accent-[#e67e22]"
  />
                  <span className="text-xs font-semibold text-brand-forest">Stable (Standard line)</span>
                </div>
                <span className="w-2.5 h-2.5 rounded-full bg-[#e67e22]" />
              </label>

              <label
    className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-all ${overallStatus === "attention" ? "border-brand-scarlet bg-brand-scarlet/10" : "border-brand-sage/10 bg-white hover:bg-brand-sand/20"}`}
  >
                <div className="flex items-center gap-2.5">
                  <input
    type="radio"
    name="clinicalStatus"
    value="attention"
    checked={overallStatus === "attention"}
    onChange={() => setOverallStatus("attention")}
    className="accent-brand-crimson"
  />
                  <span className="text-xs font-semibold text-brand-forest">Needs Attention (Flagged alerts)</span>
                </div>
                <span className="w-2.5 h-2.5 rounded-full bg-brand-scarlet" />
              </label>
            </div>
          </div>
        </div>

        {
    /* Weight & BMI Trend Card */
  }
        <div className="lg:col-span-7 bg-white rounded-3xl border border-brand-sage/15 p-6 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="text-base font-semibold text-brand-forest mb-1 flex items-center gap-2">
              <Scale className="w-5 h-5 text-brand-sage" /> Weight & Body Mass Index Progress
            </h3>
            <p className="text-xs text-brand-bark mb-6">
              Track weight changes dynamically to calibrate obesity treatment goals.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="space-y-4 p-4 rounded-2xl border border-brand-sage/10 bg-brand-sand/40 flex flex-col justify-center">
                <span className="text-[10px] font-bold text-brand-bark uppercase tracking-wider block">Report-Based Metrics</span>
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between border-b border-brand-sand pb-1.5">
                    <span className="text-brand-bark">Latest Sourced Weight:</span>
                    <strong className="text-brand-forest">{currentWeight} kg</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-brand-bark">Previous Weight:</span>
                    <strong className="text-brand-forest">{previousWeight} kg</strong>
                  </div>
                  <span className="block text-[9px] text-brand-sage mt-1 italic leading-snug">
                    Logged values map automatically from clinical records under the 'Health Records' module.
                  </span>
                </div>
              </div>

              {
    /* Graphical BMI progress panel */
  }
              <div className="space-y-4 flex flex-col justify-center">
                <div className="flex justify-between items-center bg-white p-3 rounded-xl border border-brand-sage/10">
                  <span className="text-xs text-brand-bark font-medium">Belly Weight Gap</span>
                  <span className={`text-xs font-bold ${weightDifference < 0 ? "text-brand-sage" : "text-brand-crimson"}`}>
                    {weightDifference < 0 ? "Reduced" : "Added"} {Math.abs(weightDifference)} kg
                  </span>
                </div>

                <div className="flex justify-between items-center bg-white p-3 rounded-xl border border-brand-sage/10">
                  <span className="text-xs text-brand-bark font-medium">BMI Deviation</span>
                  <span className={`text-xs font-bold ${bmiDifference < 0 ? "text-brand-sage" : "text-brand-crimson"}`}>
                    {bmiDifference < 0 ? "Reduced" : "Increased"} {Math.abs(bmiDifference)} pt
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 text-center text-xs border-t border-brand-sand pt-4">
            <div className="p-2.5 bg-brand-sage/15 border border-brand-sage/20 text-brand-forest rounded-2xl">
              <span className="block text-brand-forest text-[10px]">Current BMI</span>
              <span className="text-sm font-bold text-brand-forest m-1 inline-block">{currentBmi}</span>
            </div>
            <div className="p-2.5 bg-brand-sand/40 border border-brand-sage/10 rounded-2xl">
              <span className="block text-brand-bark text-[10px]">Clinics Ideal Class</span>
              <span className="text-sm font-bold text-brand-forest m-1 inline-block">22.0 Ideal</span>
            </div>
          </div>
        </div>
      </div>

      {
    /* Weekly Glycemia line charts */
  }
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {
    /* Line Chart */
  }
        <div className="lg:col-span-8 bg-white rounded-3xl border border-brand-sage/15 p-6 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="text-base font-semibold text-brand-forest mb-1 flex items-center gap-2">
              <BarChart2 className="w-5 h-5 text-brand-sage" /> Weekly Blood Sugar Trends
            </h3>
            <p className="text-xs text-brand-bark mb-6">
              Post-meals glucose readings vs. safe diabetic target benchmarks.
            </p>

            <div className="h-64 w-full" id="progress-weekly-trend">
              {weeklyData.length === 0 ? <div className="h-full w-full flex flex-col items-center justify-center p-8 text-center bg-brand-sand/20 rounded-2xl border border-dashed border-brand-sage/25 space-y-4">
                  <BarChart2 className="w-12 h-12 text-brand-sage/40 animate-pulse" />
                  <div>
                    <span className="text-sm font-semibold text-brand-forest block">Glucose Graph Waiting for Data</span>
                    <p className="text-xs text-brand-bark max-w-sm mt-1 leading-relaxed">
                      This graph will chart reported measurements live. Go to the 'Health Records' module to manually log or import your patient report metrics.
                    </p>
                  </div>
                </div> : <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={weeklyData} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f4f2" />
                    <XAxis dataKey="day" tick={{ fill: "#839c89", fontSize: 11 }} />
                    <YAxis domain={[80, 180]} tick={{ fill: "#839c89", fontSize: 11 }} />
                    <Tooltip contentStyle={{ borderRadius: "16px", border: "1px solid rgba(143,179,148,0.2)", fontSize: "11px", background: "#faf8f5", color: "#2d362e" }} />
                    <Legend wrapperStyle={{ fontSize: "11px", marginTop: "10px" }} />
                    {
    /* FBS Line */
  }
                    <Line type="monotone" dataKey="fbs" name="Fasting Glucose (mg/dL)" stroke="#8fb394" strokeWidth={2.5} activeDot={{ r: 6 }} />
                    {
    /* PPBS Line */
  }
                    <Line type="monotone" dataKey="ppbs" name="Post-Meals (mg/dL)" stroke="#e67e22" strokeWidth={2.5} />
                    {
    /* Safety Boundary */
  }
                    <Line type="monotone" dataKey="safeMax" name="Biological Ceiling Limit" stroke="#d9534f" strokeWidth={1.5} strokeDasharray="5 5" dot={false} />
                  </LineChart>
                </ResponsiveContainer>}
            </div>
          </div>
        </div>
 
         {
    /* Right Panel: Food Behavior Analysis */
  }
         <div className="lg:col-span-4 bg-white rounded-3xl border border-brand-sage/15 p-6 shadow-sm flex flex-col justify-between">
           <div>
             <h3 className="text-base font-semibold text-brand-forest mb-1 flex items-center gap-2">
               <Brain className="w-5 h-5 text-brand-sage" /> Food Behaviour Analysis
             </h3>
             <p className="text-xs text-brand-bark mb-6">
               Cognitive dietetic review of carb counts, meal timings, and satiety rates.
             </p>
 
             <div className="space-y-4">
               <div className="flex items-center justify-between border-b border-brand-sand pb-2.5 text-xs">
                 <div className="flex items-center gap-2 text-brand-forest">
                   <Apple className="w-4 h-4 text-brand-sage" />
                   <span>Added Sugars Intake</span>
                 </div>
                 <span className="font-bold text-brand-forest">{behaviourData.weeklySugars}</span>
               </div>
 
               <div className="flex items-center justify-between border-b border-brand-sand pb-2.5 text-xs">
                 <div className="flex items-center gap-2 text-brand-forest">
                   <AlertCircle className="w-4 h-4 text-[#e67e22]" />
                   <span>High GI spikes this week</span>
                 </div>
                 <span className="font-bold text-brand-forest">{behaviourData.highGiCount} meals</span>
               </div>
 
               <div className="flex items-center justify-between border-b border-brand-sand pb-2.5 text-xs">
                 <div className="flex items-center gap-2 text-brand-forest">
                   <ShieldCheck className="w-4 h-4 text-brand-sage" />
                   <span>Carbohydrate Adherence</span>
                 </div>
                 <span className="font-bold text-brand-sage">{behaviourData.carbAdherence}</span>
               </div>
 
               <div className="flex items-center justify-between border-b border-brand-sand pb-2.5 text-xs">
                 <div className="flex items-center gap-2 text-brand-forest">
                   <Activity className="w-4 h-4 text-brand-sage" />
                   <span>Cardio active time</span>
                 </div>
                 <span className="font-bold text-brand-forest">{behaviourData.avgActiveMinutes}</span>
               </div>
 
               <div className="flex items-center justify-between text-xs">
                 <div className="flex items-center gap-2 text-brand-forest">
                   <Heart className="w-4 h-4 text-brand-crimson" />
                   <span>Portion Mindfulness Rating</span>
                 </div>
                 <span className="font-bold text-brand-moss">{behaviourData.mindfulEatingScore}</span>
               </div>
             </div>
           </div>

          <div className="mt-6 p-4 bg-brand-sage/15 border border-brand-sage/25 rounded-2xl flex items-start gap-2.5 text-brand-forest text-xs text-left">
            <ThumbsUp className="w-4 h-4 text-brand-sage shrink-0 mt-0.5" />
            <p className="leading-snug">
              <strong>Keep it up!</strong> Decreasing high Glycemic Index dishes reduces sudden beta-cell pancreas strain, supporting steady weight loss progress.
            </p>
          </div>
        </div>
      </div>
    </div>;
}
export {
  ProgressAnalysisModule as default
};
