import { useState, useEffect, useRef } from "react";
import {
  Camera,
  Search,
  Sparkles,
  Scale,
  Upload,
  AlertTriangle,
  CheckCircle,
  Barcode
} from "lucide-react";
import { foodDb, findFoodInDb, analyzeFoodQuantity } from "../utils/nutrition";
function FoodScannerModule({ user }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [portionGrams, setPortionGrams] = useState(150);
  const [selectedFood, setSelectedFood] = useState(null);
  const allergies = JSON.parse(localStorage.getItem("dia_allergies") || "[]");
  const contradictions = JSON.parse(localStorage.getItem("dia_contradictions") || "[]");
  const diaWeights = JSON.parse(localStorage.getItem("dia_weights") || "[]");
  const currentWeight = diaWeights.length > 0 ? diaWeights[diaWeights.length - 1].weight : user.weight;
  const [cameraActive, setCameraActive] = useState(false);
  const [stream, setStream] = useState(null);
  const [predictions, setPredictions] = useState([]);
  const [isClassifying, setIsClassifying] = useState(false);
  const [cameraError, setCameraError] = useState("");
  const [aiError, setAiError] = useState("");
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const sampleMeals = [
    { name: "Apple", image: "https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=200&auto=format&fit=crop&q=60", value: "apple" },
    { name: "Pizza", image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=200&auto=format&fit=crop&q=60", value: "pizza" },
    { name: "Red Burger", image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=200&auto=format&fit=crop&q=60", value: "burger" },
    { name: "Green Salad", image: "https://images.unsplash.com/photo-1540420773420-3366772f4999?w=200&auto=format&fit=crop&q=60", value: "salad" }
  ];
  useEffect(() => {
    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [stream]);
  const startCamera = async () => {
    setCameraError("");
    setAiError("");
    setCameraActive(true);
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment", width: 400, height: 300 },
        audio: false
      });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        videoRef.current.play();
      }
    } catch (err) {
      console.warn("Camera failed:", err);
      setCameraError("Unable to open live camera stream. You can still type item names, upload photos, or click quick testing templates.");
      setCameraActive(false);
    }
  };
  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
    }
    setCameraActive(false);
  };
  const analyzeImageWithGemini = async (base64Data, mimeType = "image/jpeg") => {
    setIsClassifying(true);
    setAiError("");
    try {
      const res = await fetch("/api/gemini/food-scanner", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          base64Image: base64Data,
          mimeType,
          allergies,
          contradictions,
          weight: currentWeight,
          height: user.height,
          age: user.age
        })
      });
      if (!res.ok) {
        const errorText = await res.text();
        let errMsg = "Server error analyzing image.";
        try {
          const parsedErr = JSON.parse(errorText);
          errMsg = parsedErr.error || errMsg;
        } catch (_) {
        }
        throw new Error(errMsg);
      }
      const data = await res.json();
      const grams = data.portionGrams || 150;
      const factorOf100g = grams / 100;
      const mappedFood = {
        name: data.foodName,
        calories: Math.max(1, Math.round(data.calories / factorOf100g)),
        carbs: Math.max(0, Math.round(data.carbs / factorOf100g * 10) / 10),
        sugar: Math.max(0, Math.round(data.sugar / factorOf100g * 10) / 10),
        protein: Math.max(0, Math.round(data.protein / factorOf100g * 10) / 10),
        fat: Math.max(0, Math.round(data.fat / factorOf100g * 10) / 10),
        gi: {
          value: data.glycemicIndex === "low" ? 35 : data.glycemicIndex === "medium" ? 60 : 75,
          rating: data.glycemicIndex || "low"
        },
        color: data.glycemicIndex === "low" ? "green" : data.glycemicIndex === "medium" ? "yellow" : "red",
        rationale: data.explanation || "AI evaluated dietetic profile."
      };
      setPortionGrams(grams);
      setSelectedFood(mappedFood);
      setPredictions([
        { className: `${data.foodName} (Estimated serving: ${grams}g)`, probability: 0.99 },
        { className: `Calories: ${data.calories} kcal | Carbs: ${data.carbs}g | Sugar: ${data.sugar}g`, probability: 0.95 }
      ]);
    } catch (err) {
      console.error("Gemini Food scanner API failed:", err);
      setAiError(err.message || "Cognitive AI parser offline. Verify your setup has the correct Secrets enabled.");
    } finally {
      setIsClassifying(false);
    }
  };
  const captureAndClassify = async () => {
    if (!videoRef.current || !canvasRef.current) return;
    setIsClassifying(true);
    setAiError("");
    try {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        canvas.width = video.videoWidth || 640;
        canvas.height = video.videoHeight || 480;
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL("image/jpeg", 0.85);
        const base64Clean = dataUrl.split(",")[1];
        await analyzeImageWithGemini(base64Clean, "image/jpeg");
      }
    } catch (err) {
      console.error("Canvas capture failed:", err);
      setAiError("Failed to capture frame from webcam viewport.");
      setIsClassifying(false);
    }
  };
  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsClassifying(true);
    setAiError("");
    const reader = new FileReader();
    reader.onloadend = () => {
      const resultStr = reader.result;
      const base64Clean = resultStr.split(",")[1];
      const mime = file.type || "image/jpeg";
      analyzeImageWithGemini(base64Clean, mime);
    };
    reader.onerror = () => {
      setAiError("Failed to read the uploaded image file.");
      setIsClassifying(false);
    };
    reader.readAsDataURL(file);
  };
  const triggerSampleAi = async (foodKey) => {
    setPredictions([
      { className: foodKey.charAt(0).toUpperCase() + foodKey.slice(1), probability: 0.94 },
      { className: "Sample Meal Loaded", probability: 0.05 }
    ]);
    const target = foodDb[foodKey] || findFoodInDb(foodKey);
    setSelectedFood(target);
    setPortionGrams(150);
  };
  const handleFoodSearch = (e) => {
    e.preventDefault();
    if (!searchQuery) return;
    const item = findFoodInDb(searchQuery);
    setSelectedFood(item);
    setPortionGrams(150);
  };
  const analysis = selectedFood ? analyzeFoodQuantity(selectedFood, portionGrams, allergies, contradictions) : null;
  const colorSchemes = {
    green: {
      border: "border-brand-sage/20",
      bg: "bg-brand-sage/10",
      tagBg: "bg-brand-sage/15 text-brand-forest font-semibold",
      indicator: "bg-brand-sage",
      verdict: "Suitable! Low Glycemic Load.",
      icon: <CheckCircle className="w-5 h-5 text-brand-sage shrink-0" />
    },
    yellow: {
      border: "border-brand-clay/20",
      bg: "bg-brand-clay/10",
      tagBg: "bg-brand-clay/15 text-[#e67e22] font-semibold",
      indicator: "bg-[#e67e22]",
      verdict: "Caution. Mind overall portion capacity.",
      icon: <AlertTriangle className="w-5 h-5 text-[#e67e22] shrink-0" />
    },
    red: {
      border: "border-brand-scarlet/20",
      bg: "bg-brand-scarlet/10",
      tagBg: "bg-brand-scarlet/15 text-brand-crimson font-semibold",
      indicator: "bg-brand-scarlet",
      verdict: "High Risk. Rapidly spike insulin pathways.",
      icon: <AlertTriangle className="w-5 h-5 text-brand-scarlet shrink-0" />
    }
  };
  const scheme = selectedFood ? colorSchemes[selectedFood.color] : null;
  return <div className="space-y-8 font-sans" id="food-scanner-container">
      
      {
    /* Top Banner indicating Gemini API capability */
  }
      <div className="p-4 bg-brand-sage/10 border border-brand-sage/20 rounded-2xl flex items-center gap-3 text-brand-forest text-xs">
        <Sparkles className="w-5 h-5 text-brand-sage animate-pulse" />
        <div>
          <span className="font-semibold block text-brand-forest">Server-Side Multimodal Gemini AI Active</span>
          <p className="text-[10px] text-brand-sage mt-0.5">Capturing raw frames or uploading pictures triggers high-fidelity quantity estimations and carbohydrate indexing via Gemini.</p>
        </div>
      </div>

      {
    /* Primary Layout Grid */
  }
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {
    /* Left Side: Capture frame and interactive scanner */
  }
        <div className="lg:col-span-6 space-y-6">
          <div className="bg-white rounded-3xl border border-brand-sage/15 p-6 shadow-sm">
            <h3 className="text-base font-semibold text-brand-forest mb-1 flex items-center gap-2">
              <Camera className="w-5 h-5 text-brand-sage" /> Food Recognition Camera
            </h3>
            <p className="text-xs text-brand-bark mb-4">
              Position food in front of your camera or attach any photo. Gemini automatically determines the meal and its exact portion weight (grams).
            </p>

            {
    /* Error notifications */
  }
            {(cameraError || aiError) && <div className="mb-4 p-3 bg-brand-scarlet/11 border border-brand-scarlet/20 text-brand-crimson text-xs rounded-xl space-y-1">
                {cameraError && <div>{cameraError}</div>}
                {aiError && <div className="font-semibold">⚠️ {aiError}</div>}
              </div>}

            {
    /* Live Camera Viewfinder */
  }
            <div className="relative aspect-video w-full bg-brand-forest rounded-2xl overflow-hidden mb-4 border border-brand-sage/15 flex items-center justify-center">
              {cameraActive ? <video
    ref={videoRef}
    playsInline
    muted
    className="w-full h-full object-cover"
  /> : <div className="text-center p-6 space-y-4">
                  <Camera className="w-10 h-10 text-brand-sage/40 mx-auto animate-pulse" />
                  <p className="text-xs text-brand-bark max-w-xs leading-relaxed">
                    Camera is currently closed. Launch the live viewfinder directly, or upload an image file from your photo gallery!
                  </p>
                  
                  <div className="flex flex-col sm:flex-row gap-3 justify-center items-center pt-2">
                    <button
    onClick={startCamera}
    className="px-5 py-2.5 bg-brand-forest hover:bg-brand-moss text-white rounded-xl text-xs font-semibold cursor-pointer transition-colors shadow-sm"
  >
                      Open Live Camera
                    </button>
                    
                    <label className="px-5 py-2.5 bg-brand-sand hover:bg-brand-sand/85 text-brand-forest rounded-xl text-xs font-semibold cursor-pointer transition-colors inline-flex items-center gap-1.5 border border-brand-sage/20 shadow-xs">
                      <Upload className="w-4 h-4 text-brand-sage" />
                      <span>Upload Food Photo</span>
                      <input
    type="file"
    accept="image/*"
    onChange={handleImageUpload}
    className="hidden"
  />
                    </label>
                  </div>
                </div>}

              {
    /* Offline capture canvas */
  }
              <canvas ref={canvasRef} className="hidden" />

              {isClassifying && <div className="absolute inset-0 bg-black/75 flex flex-col items-center justify-center text-white text-xs font-semibold gap-3 z-10">
                  <span className="w-8 h-8 border-3 border-brand-sage/30 border-t-brand-sage rounded-full animate-spin" />
                  <div className="text-center">
                    <p className="font-semibold">Gemini is recognitioning your meal...</p>
                    <p className="text-[10px] text-brand-sage mt-0.5">Sieving ingredients, carbs density, and portion load...</p>
                  </div>
                </div>}
            </div>

            {
    /* Viewfinder Controls */
  }
            {cameraActive && <div className="flex flex-col sm:flex-row gap-3 justify-center mb-6 items-center">
                <button
    onClick={captureAndClassify}
    className="px-6 py-2.5 bg-brand-forest hover:bg-brand-moss text-white rounded-xl text-xs font-semibold transition-colors inline-flex items-center gap-1.5 cursor-pointer shadow-sm"
    disabled={isClassifying}
  >
                  <Sparkles className="w-4 h-4 text-brand-sage animate-bounce" /> Capture & Match AI
                </button>
                
                <label className="px-4 py-2.5 bg-brand-sand hover:bg-brand-sand/85 text-brand-forest rounded-xl text-xs font-semibold transition-colors inline-flex items-center gap-1.5 border border-brand-sage/20 cursor-pointer">
                  <Upload className="w-4 h-4 text-brand-sage" />
                  <span>Upload Pic Instead</span>
                  <input
    type="file"
    accept="image/*"
    onChange={handleImageUpload}
    className="hidden"
  />
                </label>

                <button
    onClick={stopCamera}
    className="px-4 py-2.5 bg-brand-sand/65 hover:bg-brand-sand text-brand-forest rounded-xl text-xs font-semibold transition-colors cursor-pointer"
  >
                  Close Viewfinder
                </button>
              </div>}

            {
    /* Alternate Quick Plates for testing */
  }
            <div className="border-t border-brand-sand pt-4" id="ai-quick-plates">
              <span className="block text-[10px] uppercase font-semibold text-brand-bark tracking-wider mb-2.5">
                Quick Test Templates (Immediate Loading)
              </span>
              <div className="grid grid-cols-4 gap-2">
                {sampleMeals.map((m, idx) => <button
    key={idx}
    onClick={() => triggerSampleAi(m.value)}
    className="flex flex-col items-center bg-brand-sand/40 hover:bg-brand-sand p-1.5 rounded-xl border border-brand-sage/10 transition-all text-center cursor-pointer"
  >
                    <img
    src={m.image}
    alt={m.name}
    referrerPolicy="no-referrer"
    className="w-10 h-10 rounded-lg object-cover mb-1 border border-brand-sage/10"
  />
                    <span className="text-[10px] text-brand-forest font-semibold truncate w-full">{m.name}</span>
                  </button>)}
              </div>
            </div>
          </div>

          {
    /* Barcode & Manual Entry panel */
  }
          <div className="bg-white rounded-3xl border border-brand-sage/15 p-6 shadow-sm">
            <h3 className="text-base font-semibold text-brand-forest mb-1 flex items-center gap-2">
              <Barcode className="w-5 h-5 text-brand-sage" /> Barcode & Food Lookup
            </h3>
            <p className="text-xs text-brand-bark mb-4">
              Enter any item or type standard barcodes to pull calibrated nutrition specs.
            </p>

            <form onSubmit={handleFoodSearch} className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-2.5 w-4 h-4 text-brand-sage/55" />
                <input
    type="text"
    value={searchQuery}
    onChange={(e) => setSearchQuery(e.target.value)}
    placeholder="Type 'Roti', 'Idli', 'Burger', or numeric barcode..."
    className="w-full pl-9 pr-3 py-2 bg-brand-sand/55 border border-brand-sage/20 rounded-xl text-xs text-brand-forest placeholder-brand-sage/55 focus:outline-none focus:border-brand-forest"
  />
              </div>
              <button
    type="submit"
    className="px-4 py-2 bg-brand-forest hover:bg-brand-moss text-white rounded-xl text-xs font-semibold cursor-pointer transition-colors"
  >
                Inspect
              </button>
            </form>
          </div>
        </div>

        {
    /* Right Side: Advisory Outputs & Portion Slider */
  }
        <div className="lg:col-span-6 space-y-6">
          {!selectedFood || !analysis || !scheme ? <div className="bg-white rounded-3xl border border-brand-sage/15 p-12 shadow-sm text-center flex flex-col items-center justify-center min-h-[450px] space-y-4">
              <div className="w-16 h-16 rounded-full bg-brand-sand flex items-center justify-center text-brand-sage">
                <Sparkles className="w-8 h-8 animate-pulse" />
              </div>
              <h3 className="text-lg font-bold text-brand-forest">Awaiting Input</h3>
              <p className="text-xs text-brand-bark max-w-sm leading-relaxed">
                Provide an input first to examine food values safely. Use the Food Recognition Camera above, attach a food photo, type a general food in the search box, or pick from the Quick Test Templates to start real-time diabetic & obesity calculations.
              </p>
            </div> : (
    /* Main Selected Analysis Result */
    <div className={`p-6 rounded-3xl border ${scheme.border} ${scheme.bg} space-y-6`}>
              
              {
      /* Header portion */
    }
              <div className="flex justify-between items-start">
                <div>
                  <span className={`px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider rounded-md ${scheme.tagBg}`}>
                    {selectedFood.color} GI rating
                  </span>
                  <h2 className="text-2xl font-bold font-sans text-brand-forest mt-2">
                    {selectedFood.name}
                  </h2>
                </div>
                <div className="text-right">
                  <span className="text-xs text-brand-bark block font-medium">Quantity Option</span>
                  <div className="flex items-center gap-1.5 mt-1">
                    <Scale className="w-4 h-4 text-brand-sage shrink-0" />
                    <input
      type="number"
      value={portionGrams}
      onChange={(e) => setPortionGrams(e.target.value === "" ? 100 : Number(e.target.value))}
      className="w-16 px-1.5 py-0.5 text-center font-bold text-xs border border-brand-sage/20 rounded-lg bg-white focus:outline-none text-brand-forest"
    />
                    <span className="text-xs text-brand-bark font-semibold">g</span>
                  </div>
                </div>
              </div>

              {
      /* Quantity adjustment slider */
    }
              <div>
                <input
      type="range"
      min={20}
      max={500}
      step={10}
      value={portionGrams}
      onChange={(e) => setPortionGrams(Number(e.target.value))}
      className="w-full accent-brand-sage cursor-pointer"
    />
                <div className="flex justify-between text-[10px] text-brand-bark mt-1 font-semibold">
                  <span>Micro portion (20g)</span>
                  <span>Portion: {portionGrams}g</span>
                  <span>Heavy Meal (500g)</span>
                </div>
              </div>

              {
      /* Real-time calculated clinical items */
    }
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-center" id="live-nutrients">
                <div className="p-2.5 bg-white rounded-xl border border-brand-sage/15 text-xs shadow-xs">
                  <span className="text-brand-bark block mb-0.5 font-medium">Caloric Load</span>
                  <span className="font-bold text-brand-forest">{analysis.totalCalories} kcal</span>
                </div>
                <div className="p-2.5 bg-white rounded-xl border border-brand-sage/15 text-xs shadow-xs">
                  <span className="text-brand-bark block mb-0.5 font-medium">Carb Weight</span>
                  <span className="font-bold text-brand-forest">{analysis.totalCarbLoad}g</span>
                </div>
                <div className="p-2.5 bg-white rounded-xl border border-brand-sage/15 text-xs shadow-xs">
                  <span className="text-brand-bark block mb-0.5 font-medium">Net Sugar</span>
                  <span className="font-bold text-brand-forest">{analysis.totalSugar}g</span>
                </div>
                <div className="p-2.5 bg-white rounded-xl border border-brand-sage/15 text-xs shadow-xs">
                  <span className="text-brand-bark block mb-0.5 font-medium">Proteins</span>
                  <span className="font-bold text-brand-forest">{Math.round(selectedFood.protein * (portionGrams / 100))}g</span>
                </div>
                <div className="p-2.5 bg-white rounded-xl border border-brand-sage/15 text-xs col-span-2 sm:col-span-1 shadow-xs">
                  <span className="text-brand-bark block mb-0.5 font-medium">Lipids (Fat)</span>
                  <span className="font-bold text-brand-forest">{Math.round(selectedFood.fat * (portionGrams / 100))}g</span>
                </div>
              </div>

              {
      /* Verdict Box */
    }
              <div className="p-4 rounded-2xl bg-white border border-brand-sage/15 space-y-2.5">
                <div className="flex items-center gap-2 font-bold text-sm text-brand-forest">
                  {scheme.icon}
                  <span>Can I safely eat this portion?</span>
                </div>
                <p className="text-xs text-brand-forest/90 leading-relaxed font-sans">
                  {analysis.explanation}
                </p>
              </div>

              {
      /* Obesity Diabetes connection logic breakdown */
    }
              <div className="p-4 rounded-xl bg-[#2d362e] text-white space-y-3">
                <div className="flex items-center gap-1.5 text-xs text-brand-sage font-bold uppercase tracking-wide">
                  <span className="w-1.5 h-1.5 rounded-full bg-brand-sage animate-pulse" />
                  Portion Metabolic Impact
                </div>
                <p className="text-[11px] text-gray-300 leading-relaxed">
                  Diabetes and obesity interact closely: high glycemic-load items spur rapid weight gain. 
                  Consuming <strong className="text-white">{portionGrams}g</strong> of <strong className="text-white">{selectedFood.name}</strong> scores a glycemic target rating of <strong className="text-brand-sage">{analysis.glycemicImpact}</strong>. 
                  Excess sugars saturate skeletal muscles, forcing the pancreas to release high insulin levels. 
                  This excess insulin prevents lipolysis (fat-burning) and directs free sugar directly into adipose belly tissue, increasing clinical obesity.
                </p>
              </div>

              {
      /* Predictions readout if classification completed */
    }
              {predictions.length > 0 && <div className="p-4 rounded-xl border border-[#8fb394]/15 bg-white space-y-2">
                  <span className="text-[10px] font-semibold text-[#5c6e5e] uppercase tracking-wider block">
                    Metabolic & Diagnostic Projectiles
                  </span>
                  <div className="space-y-1.5">
                    {predictions.map((p, idx) => <div key={idx} className="flex justify-between text-xs">
                        <span className="text-[#5c6e5e] font-medium">{p.className}</span>
                        {p.probability < 1 && <span className="text-brand-moss font-bold">{Math.round(p.probability * 100)}% Match</span>}
                      </div>)}
                  </div>
                </div>}
            </div>
  )}
        </div>
      </div>
    </div>;
}
export {
  FoodScannerModule as default
};
